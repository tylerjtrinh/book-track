// NYT Best Sellers Sync Script
import pool from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

// Sync NYT Best Sellers to database
const syncNYTBestSellers = async () => {
    try {
        console.log('Starting NYT Best Sellers sync...');
        
        const apiKey = process.env.NYT_API_KEY;
        if (!apiKey) {
            throw new Error('NYT_API_KEY environment variable is required');
        }

        // Fetch overview data from NYT API
        // Current bestseller list
        const response = await fetch(
            `https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${apiKey}`
        );
        
        if (!response.ok) {
            throw new Error(`NYT API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.results || !data.results.lists) {
            throw new Error('Invalid response format from NYT API');
        }

        // Clean up any existing old tables from previous syncs
        console.log('Cleaning up any existing old tables...');
        await pool.query('DROP TABLE IF EXISTS explore_books_old CASCADE');

        // Create staging table for zero-downtime sync
        console.log('Creating staging table...');
        await pool.query('DROP TABLE IF EXISTS explore_books_staging CASCADE');
        await pool.query(`
            CREATE TABLE explore_books_staging (
                id SERIAL PRIMARY KEY,
                google_books_id VARCHAR(50),
                title VARCHAR(255) NOT NULL,
                author VARCHAR(255) NOT NULL,
                book_image VARCHAR(500),
                isbn_13 VARCHAR(20),
                isbn_10 VARCHAR(15),
                list_name VARCHAR(100) NOT NULL,
                list_name_encoded VARCHAR(100) NOT NULL,
                rank INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        let totalBooksInserted = 0;
        let googleBooksLookups = 0;
        let successfulLookups = 0;
        
        // Process weekly lists from overview
        for (const list of data.results.lists) {
            console.log(`Processing list: ${list.list_name} (${list.books.length} books)`);
            
            for (const book of list.books) {
                try {
                    // Look up Google Books ID using ISBN first, then title+author fallback
                    let googleBooksId = null;
                    const isbn13 = book.primary_isbn13;
                    const isbn10 = book.primary_isbn10;
                    
                    // Strategy 1: Try ISBN-13 first, then ISBN-10 as fallback
                    const isbnsToTry = [isbn13, isbn10].filter(Boolean);
                    
                    for (const isbn of isbnsToTry) {
                        if (googleBooksId) break; // Stop if we already found a match
                        
                        try {
                            googleBooksLookups++;
                            console.log(`Looking up Google Books ID for "${book.title}" (ISBN: ${isbn}) [${googleBooksLookups}]`);
                            
                            const googleResponse = await fetch(
                                `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
                            );
                            
                            if (googleResponse.ok) {
                                const googleData = await googleResponse.json();
                                if (googleData.items && googleData.items.length > 0) {
                                    googleBooksId = googleData.items[0].id;
                                    const volumeInfo = googleData.items[0].volumeInfo;
                                    if (!book.book_image && volumeInfo.imageLinks) {
                                        book.book_image = volumeInfo.imageLinks.large || 
                                                         volumeInfo.imageLinks.medium || 
                                                         volumeInfo.imageLinks.thumbnail;
                                    }
                                    successfulLookups++;
                                    console.log(`Found Google Books ID via ISBN: ${googleBooksId}`);
                                    break;
                                } else {
                                    console.log(`No Google Books match found for ISBN ${isbn}`);
                                }
                            }
                            
                            // Add small delay to respect rate limits
                            await new Promise(resolve => setTimeout(resolve, 100));
                        } catch (googleError) {
                            console.log(`Error looking up Google Books for "${book.title}" with ISBN ${isbn}:`, googleError.message);
                        }
                    }

                    // Strategy 2: If ISBN search failed, try title + author search
                    if (!googleBooksId && book.title && book.author) {
                        try {
                            googleBooksLookups++;
                            // Clean up title and author for better search results
                            const cleanTitle = book.title.replace(/[^\w\s]/g, '').trim();
                            const cleanAuthor = book.author.replace(/[^\w\s]/g, '').trim();
                            
                            // Try multiple search strategies in order of preference
                            const searchStrategies = [
                                `intitle:"${cleanTitle}"+inauthor:"${cleanAuthor}"`,
                                `"${cleanTitle}" "${cleanAuthor}"`,
                                `${cleanTitle} ${cleanAuthor}`,
                                cleanTitle // Just title as last resort
                            ];
                            
                            for (const searchQuery of searchStrategies) {
                                if (googleBooksId) break; // Stop if we found a match
                                
                                console.log(`Fallback search for "${book.title}" by "${book.author}" [${googleBooksLookups}] - Strategy: ${searchQuery}`);
                                
                                const googleResponse = await fetch(
                                    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=5`
                                );
                                
                                if (googleResponse.ok) {
                                    const googleData = await googleResponse.json();
                                    if (googleData.items && googleData.items.length > 0) {
                                        // Find the best match with scoring
                                        let bestMatch = null;
                                        let bestScore = 0;
                                        
                                        for (const item of googleData.items) {
                                            const volumeInfo = item.volumeInfo;
                                            const googleTitle = volumeInfo.title?.toLowerCase() || '';
                                            const googleAuthor = volumeInfo.authors?.[0]?.toLowerCase() || '';
                                            const nytTitle = book.title.toLowerCase();
                                            const nytAuthor = book.author.toLowerCase();
                                            
                                            let score = 0;
                                            
                                            // Title scoring 
                                            const titleWords = nytTitle.split(' ').filter(word => word.length > 2);
                                            const matchingWords = titleWords.filter(word => googleTitle.includes(word));
                                            const titleScore = titleWords.length > 0 ? matchingWords.length / titleWords.length : 0;
                                            score += titleScore * 0.7; // 70% weight for title
                                            
                                            // Author scoring
                                            const nytAuthorParts = nytAuthor.split(' ');
                                            const googleAuthorParts = googleAuthor.split(' ');
                                            let authorScore = 0;
                                            
                                            for (const nytPart of nytAuthorParts) {
                                                for (const googlePart of googleAuthorParts) {
                                                    if (nytPart.length > 2 && googlePart.includes(nytPart)) {
                                                        authorScore += 1;
                                                    }
                                                }
                                            }
                                            authorScore = Math.min(authorScore / nytAuthorParts.length, 1);
                                            score += authorScore * 0.3; // 30% weight for author
                                            
                                            // Prefer exact title matches
                                            if (googleTitle === nytTitle) score += 0.5;
                                            
                                            // Prefer books with publication dates (likely real books)
                                            if (volumeInfo.publishedDate) score += 0.1;
                                            
                                            if (score > bestScore && score > 0.4) { // Minimum threshold
                                                bestScore = score;
                                                bestMatch = item;
                                            }
                                        }
                                        
                                        if (bestMatch) {
                                            googleBooksId = bestMatch.id;
                                            const volumeInfo = bestMatch.volumeInfo;
                                            if (!book.book_image && volumeInfo.imageLinks) {
                                                book.book_image = volumeInfo.imageLinks.large || 
                                                                 volumeInfo.imageLinks.medium || 
                                                                 volumeInfo.imageLinks.thumbnail;
                                            }
                                            successfulLookups++;
                                            console.log(`Found Google Books ID via title+author: ${googleBooksId} (score: ${bestScore.toFixed(2)})`);
                                            break;
                                        }
                                    }
                                }
                                
                                // Small delay between different search strategies
                                await new Promise(resolve => setTimeout(resolve, 100));
                            }
                            
                            if (!googleBooksId) {
                                console.log(`No good match found for "${book.title}" by "${book.author}"`);
                            }
                            
                            // Add delay between API calls
                            await new Promise(resolve => setTimeout(resolve, 150));
                        } catch (googleError) {
                            console.log(`Error in title+author search for "${book.title}":`, googleError.message);
                        }
                    }

                    await pool.query(
                        `INSERT INTO explore_books_staging 
                         (google_books_id, title, author, book_image, isbn_13, isbn_10,
                          list_name, list_name_encoded, rank)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                        [
                            googleBooksId,
                            book.title || 'Unknown Title',
                            book.author || 'Unknown Author', 
                            book.book_image || null,
                            book.primary_isbn13 || null,
                            book.primary_isbn10 || null,
                            list.list_name,
                            list.list_name_encoded,
                            book.rank || 0
                        ]
                    );
                    totalBooksInserted++;
                } catch (error) {
                    console.error(`Error inserting book "${book.title}":`, error.message);
                }
            }
        }

        
        // swap: Replace live data with staging data (zero downtime)
        console.log('Performing swap to live table...');
        await pool.query('BEGIN');
        try {
            // Rename current live table to backup
            await pool.query('ALTER TABLE explore_books RENAME TO explore_books_old');
            
            // Rename staging table to become the new live table
            await pool.query('ALTER TABLE explore_books_staging RENAME TO explore_books');
            
            await pool.query('COMMIT');
            console.log('Swap completed successfully!');
            
            //Clean up old table outside of transaction (with CASCADE to handle dependencies)
            try {
                await pool.query('DROP TABLE IF EXISTS explore_books_old CASCADE');
                console.log('Old table cleanup completed');
            } catch (cleanupError) {
                console.log('Warning: Could not clean up old table:', cleanupError.message);
                console.log('Old table will be cleaned up on next sync');
            }
        } catch (swapError) {
            await pool.query('ROLLBACK');
            throw new Error(`Swap failed: ${swapError.message}`);
        }
        
        console.log(`Sync completed! Inserted ${totalBooksInserted} books from ${data.results.lists.length} lists`);
        console.log(`Google Books API calls: ${googleBooksLookups} total, ${successfulLookups} successful (${Math.round(successfulLookups/googleBooksLookups*100)}% success rate)`);
        console.log('Last updated:', new Date().toISOString());
        
    } catch (error) {
        console.error('Sync failed:', error.message);
        throw error;
    }
};

// Run the sync if called directly
if (process.argv[1].endsWith('nytSync.js')) {
    try {
        await syncNYTBestSellers();
        console.log('Script completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Script failed:', error);
        process.exit(1);
    }
}

export default syncNYTBestSellers;

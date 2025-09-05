import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom'
import {searchGoogleBooks} from '../../../utils/googleBooksApi';
import Spinner from '../components/Spinner';

const SearchResultsPage = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();

    const searchTerm = searchParams.get('q'); // Gets the ?q= parameter from URL
    console.log('Search term from URL:', searchTerm);

    useEffect(() => {
        const fetchGoogleBooks = async () => {
            try {
                const searchQuery = searchTerm.trim();
                console.log('Query being sent to API:', searchQuery);
                const googleBooks = await searchGoogleBooks(searchQuery , 24);
                
                console.log('API Response:', googleBooks);
                setSearchResults(googleBooks);
            } catch (error) {
                console.error('Error searching books', error);
                setError(error);
            }
            setLoading(false);
        }

        fetchGoogleBooks();
    }, [searchTerm]);

  // Handle loading state
  if (loading) {
    return (
      <div className="bg-slate-700 min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <div className="bg-slate-700 min-h-screen flex items-center justify-center">
        <div className="text-red-400 text-xl">Error searching books</div>
      </div>
    );
  }

  const mappedBooks = searchResults.map(book => ({
    id: book.id,
    title: book.volumeInfo?.title || 'Untitled',
    author: book.volumeInfo?.authors || 'Unknown Author',
    image: book.volumeInfo?.imageLinks?.large || book.volumeInfo?.imageLinks?.medium || book.volumeInfo?.imageLinks?.thumbnail || "https://via.placeholder.com/150x200"
  }));

    console.log("searched: ", mappedBooks);

  return (
    <div className="bg-slate-700 min-h-screen text-center flex flex-col items-center">
        <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Search Results
            </h1>

            {/* Books Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-w-7xl px-4">
                {mappedBooks.map((book) => (
                    <div 
                    key={book.id} 
                    className="cursor-pointer group"
                    >
                    {/* Book Cover Container */}
                    <div className="bg-slate-600 rounded-lg hover:bg-slate-500 transition-colors duration-200 mb-3 overflow-hidden">
                        <Link to={`/book/${book.title}/${book.id}`}>
                        <img 
                            src={book.image} 
                            alt={book.title}
                            className="w-full aspect-[2/3] object-cover"
                            />
                        </Link>  
                        </div>
                        
                        {/* Book Info - Outside the gray box */}
                        <div className="px-1 mb-10">
                            <h3 className="text-white font-medium text-sm mb-1 line-clamp-1 leading-tight">
                              {book.title}
                            </h3>
                            <p className="text-slate-300 text-xs line-clamp-1">
                              {book.author}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default SearchResultsPage;
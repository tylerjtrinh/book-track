export const searchGoogleBooks = async (searchQuery, maxResults) => {
    try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=${maxResults}`;
        const res = await fetch(url);

        if(!res.ok) {
            throw new Error('Failed to search books');
        }

        const data = await res.json();
        return data.items || [];
    } catch (error) {
        console.log('Error searching books:', error);
        throw error;
    }
};

export const getGoogleBook = async (googleBookId) => {
    try {
        const url = `https://www.googleapis.com/books/v1/volumes/${googleBookId}`;
        const res = await fetch(url);

        if(!res.ok) {
            throw new Error('Failed to get book');
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.log('Error searching book:', error);
        throw error;
    }
};



import { useGetBooksQuery, useDeleteBookMutation } from '../slices/userBooksApiSlice';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBookmark } from "react-icons/fa";
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

const ReadList = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Check if user is logged in
  const { userInfo } = useSelector((state) => state.auth);
  
  const { data: userBooks, error: userBooksError, isLoading: userBooksLoading } = useGetBooksQuery(undefined, {
    skip: !userInfo // Skip API call if user is not logged in
  });

  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

  const filterButtons = ['All', 'Favorited', 'Completed', 'Currently Reading', 'To-Read'];

  const getButtonClass = (filter) => {
    const baseClass = "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200";
    
    if (!userInfo) {
      // Disabled state when not logged in
      return `${baseClass} bg-slate-600 text-slate-300 hover:bg-slate-500 hover:text-white cursor-not-allowed`;
    }
    
    return activeFilter === filter
      ? `${baseClass} bg-blue-600 text-white`
      : `${baseClass} bg-slate-600 text-slate-300 hover:bg-slate-500 hover:text-white cursor-pointer`;
  };

  const handleDeleteBook = async (bookId) => {
  try {
    await deleteBook(bookId).unwrap();
    toast.success('Book deleted');
  } catch (error) {
    console.error('Failed to delete book:', error);
    toast.error('Failed to delete book')
  }
  };
  

  const filterBooks = (books, activeFilter) => {
    if (activeFilter === 'All') return books;
  
    return books.filter(book => {
      switch(activeFilter) {
        case 'Favorited': 
          return book.favorite === true;
        case 'Completed': 
          return book.status === 'completed';
        case 'Currently Reading': 
          return book.status === 'currently-reading';
        case 'To-Read': 
          return book.status === 'to-read';
        default: 
          return true;
      }
    });
  };

  if (userBooksLoading) {
    return (
      <div className="bg-slate-700 min-h-screen flex items-center justify-center">
          <Spinner />
      </div>
    );
  }
  
  // Handle error state
  if (userBooksError) {
    return (
    <div className="bg-slate-700 min-h-screen flex items-center justify-center">
      <div className="text-red-400 text-xl">Error loading books</div>
    </div>
  );
  }

  // Only process books if user is logged in
  let filteredBooksList = [];
  let mappedBooks = [];
  
  if (userInfo && userBooks?.books) {
    // Filter the books based on active filter
    filteredBooksList = filterBooks(userBooks.books, activeFilter);
    
    mappedBooks = filteredBooksList.map(book => ({
      id: book.book_id,
      title: book.title || 'Untitled',
      author: book.author || 'Unknown Author',
      image: book.cover_image || "https://via.placeholder.com/150x200"
    }));
  }

  return (
    <div className="bg-slate-700 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">
          Your Bookshelf
        </h1>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {filterButtons.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={getButtonClass(filter)}
              disabled={!userInfo} // Disable buttons if not logged in
            >
              {filter}
            </button>
          ))}
        </div>
        
        {/* Content based on authentication status */}
        {!userInfo ? (
          // Not logged in - Show login message
          <div className="text-center py-12">
            <div className="bg-slate-600 rounded-lg p-8 max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-white mb-4">
                Log in to create your reading list
              </h2>
              <p className="text-slate-300 mb-6">
                Start building your personal bookshelf by logging into your account.
              </p>
              <Link 
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Log In
              </Link>
            </div>
          </div>
        ) : (
          // Logged in with books - Show books grid
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
            {mappedBooks.map((book) => (
              <div 
                key={book.id} 
                className="cursor-pointer group"
              >
                {/* Book Cover Container */}
                <div className="bg-slate-600 rounded-lg hover:bg-slate-500 transition-colors duration-200 mb-3 overflow-hidden relative">
                  <Link to={`/book/${book.title}/${book.id}`}>
                  <img 
                    src={book.image} 
                    alt={book.title}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  </Link>
                  {/* Bookmark Icon - positioned over the image */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="group/bookmark relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle remove from bookshelf logic here
                          handleDeleteBook(book.id);
                        }}
                        className="bg-transparent hover:bg-slate-400 text-slate-300 hover:text-white p-1 rounded transition-colors duration-200">
                        <FaBookmark className="cursor-pointer h-4 w-4" />
                      </button>
                      
                      {/* only appears when hovering over bookmark */}
                      <div className="absolute bottom-full mb-2 right-0 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover/bookmark:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        Remove from bookshelf
                        <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Book Info - Outside the gray box */}
                <div className="px-1">
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
        )}
      </div>
    </div>
  )
}

export default ReadList
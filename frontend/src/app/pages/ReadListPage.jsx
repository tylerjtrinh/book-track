import { useState } from 'react';
import { FaBookmark } from "react-icons/fa";

const ReadList = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Template data - will be replaced with user's books from database
  const userBooks = [
        { id: 1, title: "Book 1", author: "Author 1", image: "https://via.placeholder.com/150x200" },
        { id: 2, title: "Book 2", author: "Author 2", image: "https://via.placeholder.com/150x200" },
        { id: 3, title: "Book 3", author: "Author 3", image: "https://via.placeholder.com/150x200" },
        { id: 4, title: "Book 4", author: "Author 4", image: "https://via.placeholder.com/150x200" },
        { id: 5, title: "Book 5", author: "Author 5", image: "https://via.placeholder.com/150x200" },
        { id: 1, title: "Book 1", author: "Author 1", image: "https://via.placeholder.com/150x200" },
        { id: 2, title: "Book 2", author: "Author 2", image: "https://via.placeholder.com/150x200" },
        { id: 3, title: "Book 3", author: "Author 3", image: "https://via.placeholder.com/150x200" },
        { id: 4, title: "Book 4", author: "Author 4", image: "https://via.placeholder.com/150x200" },
        { id: 5, title: "Book 5", author: "Author 5", image: "https://via.placeholder.com/150x200" },
        { id: 1, title: "Book 1", author: "Author 1", image: "https://via.placeholder.com/150x200" },
        { id: 2, title: "Book 2", author: "Author 2", image: "https://via.placeholder.com/150x200" },
        { id: 3, title: "Book 3", author: "Author 3", image: "https://via.placeholder.com/150x200" },
        { id: 4, title: "Book 4", author: "Author 4", image: "https://via.placeholder.com/150x200" },
        { id: 5, title: "Book 5", author: "Author 5", image: "https://via.placeholder.com/150x200" },
  ];

  const filterButtons = ['All', 'Favorited', 'Completed', 'Currently Reading', 'To-Read'];

  const getButtonClass = (filter) =>
    activeFilter === filter
      ? "bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
      : "bg-slate-600 text-slate-300 hover:bg-slate-500 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer";

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
            >
              {filter}
            </button>
          ))}
        </div>
        
        {/* Books Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
          {userBooks.map((book) => (
            <div 
              key={book.id} 
              className="bg-slate-600 rounded-lg p-3 hover:bg-slate-500 transition-colors duration-200 cursor-pointer group"
            >
              {/* Book Cover */}
              <div className="w-full aspect-[3/4] mb-3">
                <img 
                  src={book.image} 
                  alt={book.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              
              {/* Book Info */}
              <div className="flex justify-between items-end">
                <div className="flex-1">
                  <h3 className="text-white font-medium text-xs sm:text-sm mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-slate-300 text-xs">
                    {book.author}
                  </p>
                </div>
                
                {/* Bookmark Icon */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
                  <div className="group/bookmark relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle remove from bookshelf logic here
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
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReadList
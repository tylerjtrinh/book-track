import { useGetAllBooksQuery, useGetPopularBooksQuery } from "../slices/exploreApiSlice";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useState, useEffect } from 'react';
import Spinner from "./Spinner";

const BookListings = () => {
  const [scrollStates, setScrollStates] = useState({});

  const { data: popularBooksData, error: popularBooksError, isLoading: popularBooksLoading } = useGetPopularBooksQuery();
  const { data: allBooksData, error: allBooksError, isLoading: allBooksLoading } = useGetAllBooksQuery();

  // Check scroll position for a specific container
  const updateScrollState = (categoryIndex) => {
    const container = document.getElementById(`books-container-${categoryIndex}`);
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const canScrollLeft = scrollLeft > 0;
    const canScrollRight = scrollLeft < scrollWidth - clientWidth;

    setScrollStates(prev => ({
      ...prev,
      [categoryIndex]: { canScrollLeft, canScrollRight }
    }));
  };

  // Update scroll states when data loads
  useEffect(() => {
    if (popularBooksData && allBooksData) {
      // Wait for DOM to update, then check all containers
      setTimeout(() => {
        const totalCategories = 1 + (allBooksData?.lists?.length || 0);
        for (let i = 0; i < totalCategories; i++) {
          updateScrollState(i);
        }
      }, 100);
    }
  }, [popularBooksData, allBooksData]);

  // Handle loading state - wait for both to load
  if (popularBooksLoading || allBooksLoading) {
    return (
      <div className="bg-slate-700 min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  
  // Handle error state
  if (popularBooksError || allBooksError) {
    return (
      <div className="bg-slate-700 min-h-screen flex items-center justify-center">
        <div className="text-red-400 text-xl">Error loading books</div>
      </div>
    );
  }

  // Create combined categories: Popular Now + All Official Lists
  const exploreCategories = [
    // First: Popular Now (curated section)
    {
      title: "Popular Now",
      books: popularBooksData?.books?.map(book => ({
        id: book.google_books_id,
        title: book.title,
        author: book.author,
        image: book.book_image || "https://via.placeholder.com/150x200"
      })) || []
    },
    // Then: All official NYT lists
    ...(allBooksData?.lists?.map(list => ({
      title: list.listName,
      books: list.books.map(book => ({
        id: book.google_books_id,
        title: book.title,
        author: book.author,
        image: book.book_image || "https://via.placeholder.com/150x200"
      }))
    })) || [])
  ];


  //Functionality to scroll left and right
  const scrollLeft = (categoryIndex) => {
    const container = document.getElementById(`books-container-${categoryIndex}`);
    // Calculate scroll distance based on container width
    const scrollDistance = container.clientWidth * 0.9; // Scroll 90% of visible width
    container.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
    // Update scroll state after animation completes
    setTimeout(() => updateScrollState(categoryIndex), 300);
  };

  const scrollRight = (categoryIndex) => {
    const container = document.getElementById(`books-container-${categoryIndex}`);
    // Calculate scroll distance based on container width
    const scrollDistance = container.clientWidth * 0.9; // Scroll 90% of visible width
    container.scrollBy({ left: scrollDistance, behavior: 'smooth' });
    // Update scroll state after animation completes
    setTimeout(() => updateScrollState(categoryIndex), 300);
  };

  return (
    <div className="bg-slate-700 min-h-screen">
      {/* Explore Section */}
      <section className="py-12">
        <div className="max-w-full px-2 sm:px-3 lg:px-4">
          {exploreCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              {/* Category Title */}
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 px-2">
                {category.title}
              </h2>
              
              {/* Books Row with Navigation */}
              <div className="relative group">
                {/* Left Arrow */}
                {scrollStates[categoryIndex]?.canScrollLeft && (
                  <button
                    onClick={() => scrollLeft(categoryIndex)}
                    className="cursor-pointer absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <FaAngleLeft className="h-7 w-7" />
                  </button>
                )}

                {/* Right Arrow */}
                {scrollStates[categoryIndex]?.canScrollRight && (
                  <button
                    onClick={() => scrollRight(categoryIndex)}
                    className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <FaAngleRight className="h-7 w-7" />
                  </button>
                )}

                {/* Books Container */}
                <div 
                  id={`books-container-${categoryIndex}`}
                  className="flex space-x-4 overflow-x-auto scrollbar-hide"
                  style={{
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none', // IE and Edge
                  }}
                  onScroll={() => updateScrollState(categoryIndex)}
                >
                  {category.books.map((book) => (
                    <div 
                      key={book.id} 
                      className="flex-shrink-0 cursor-pointer"
                      style={{ width: '180px' }}
                    >
                      {/* Book Cover Container */}
                      <div className="bg-slate-600 rounded-lg hover:bg-slate-500 transition-colors duration-200 mb-3 overflow-hidden">
                        <img 
                          src={book.image} 
                          alt={book.title}
                          className="w-full aspect-[2/3] object-cover"
                        />
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
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default BookListings
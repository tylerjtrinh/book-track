import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
const BookListings = () => {
  //place holder for now. will fetch data from NYT API later
  const exploreCategories = [
    {
      title: "Popular Now",
      books: [
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
      ]
    }
  ];

  const scrollLeft = (categoryIndex) => {
    const container = document.getElementById(`books-container-${categoryIndex}`);
    container.scrollBy({ left: -400, behavior: 'smooth' });
  };

  const scrollRight = (categoryIndex) => {
    const container = document.getElementById(`books-container-${categoryIndex}`);
    container.scrollBy({ left: 400, behavior: 'smooth' });
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
                <button
                  onClick={() => scrollLeft(categoryIndex)}
                  className="cursor-pointer absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <FaAngleLeft className="h-7 w-7" />
                </button>

                {/* Right Arrow */}
                <button
                  onClick={() => scrollRight(categoryIndex)}
                  className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <FaAngleRight className="h-7 w-7" />
                </button>

                {/* Books Container */}
                <div 
                  id={`books-container-${categoryIndex}`}
                  className="flex space-x-4 overflow-x-auto pb-4 px-2 scrollbar-hide"
                  style={{
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none', // IE and Edge
                  }}
                >
                  {category.books.map((book) => (
                    <div 
                      key={book.id} 
                      className="flex-shrink-0 bg-slate-600 rounded-lg p-4 hover:bg-slate-500 transition-colors duration-200 cursor-pointer"
                      style={{ width: '180px' }}
                    >
                      {/* Book Cover */}
                      <img 
                        src={book.image} 
                        alt={book.title}
                        className="w-full h-48 object-cover rounded-md mb-3"
                      />
                      
                      {/* Book Info */}
                      <div>
                        <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="text-slate-300 text-xs">
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
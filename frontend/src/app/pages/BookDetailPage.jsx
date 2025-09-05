import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { getGoogleBook } from '../../../utils/googleBooksApi';
import Spinner from '../components/Spinner';

const BookDetail = () => {
  window.scrollTo(0, 0); //so the page loads in at the top
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { bookTitle, googleBookId } = useParams(); // Get book ID from URL
  console.log("googleBookId", googleBookId);
  console.log("bookTitle (encoded)", bookTitle);
  console.log("bookTitle (decoded)", decodeURIComponent(bookTitle || ''));
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookData = await getGoogleBook(googleBookId);
        setBook(bookData);
      } catch (error) {
        console.error('Error fetching book:', error);
        setError(error);
      }
      setLoading(false);
    };

    if (googleBookId) {
      fetchBook();
    }
  }, [googleBookId]);

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
        <div className="text-red-400 text-xl">Error loading book details</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="bg-slate-700 min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Book not found</div>
      </div>
    );
  }

  const { volumeInfo } = book;
  const {
    title,
    authors,
    description,
    imageLinks,
    isbn,
    categories
  } = volumeInfo;

  // Extract ISBN-10 and ISBN-13
  const isbn10 = isbn?.find(id => id.type === 'ISBN_10')?.identifier;
  const isbn13 = isbn?.find(id => id.type === 'ISBN_13')?.identifier;

  return (
    <div className="bg-slate-700 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Book Info Box */}
        <div className="bg-slate-600 rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Book Image - on left */}
            <div className="flex-shrink-0">
              <img 
                src={imageLinks?.thumbnail || imageLinks?.large || imageLinks?.medium || "https://via.placeholder.com/300x400"}
                alt={title}
                className="w-full h-90 aspect-[2/3] object-cover rounded-lg shadow-lg"
              />
            </div>
            
            {/* Book Details - Right side */}
            <div className="flex-1">
              {/* Title - Large */}
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                {title}
              </h1>
              
              {/* Authors */}
              <div className="mb-4">
                <p className="text-xl text-slate-200">
                  {authors ? authors.join(', ') : 'Unknown Author'}
                </p>
              </div>
              
              {/* ISBN Row */}
              <div className="flex flex-wrap gap-6 mb-4">
                {isbn10 && (
                  <div>
                    <span className="text-slate-300 text-sm">ISBN-10: </span>
                    <span className="text-white">{isbn10}</span>
                  </div>
                )}
                {isbn13 && (
                  <div>
                    <span className="text-slate-300 text-sm">ISBN-13: </span>
                    <span className="text-white">{isbn13}</span>
                  </div>
                )}
              </div>
              
              {/* Categories/Genres */}
              {categories && categories.length > 0 && (
                <div className="mb-4">
                  <span className="text-slate-300 text-sm">Categories: </span>
                  <span className="text-white">{categories.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Description Section */}
        {description && (
          <div className="bg-slate-600 rounded-lg p-6">
            <h2 className="text-3xl font-bold text-white mb-4">Description</h2>
            <div 
              className="text-lg text-slate-100 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default BookDetail
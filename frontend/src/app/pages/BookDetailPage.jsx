import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'
import { getGoogleBook } from '../../../utils/googleBooksApi';
import { useAddBookMutation } from '../slices/userBooksApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

const BookDetail = () => {
  window.scrollTo(0, 0); //so the page loads in at the top
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { bookTitle, googleBookId } = useParams(); // Get book ID from URL
  console.log("googleBookId", googleBookId);

  const { userInfo } = useSelector((state) => state.auth); //For the reading list features

  const [addBook, {isLoading}] = useAddBookMutation();

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
  console.log('Volume Info:', volumeInfo); // Debug log to see the data structure
  
  const {
    title,
    authors,
    subtitle,
    description,
    imageLinks,
    industryIdentifiers,
    categories
  } = volumeInfo;

  // Extract ISBN-10 and ISBN-13
  const isbn10 = industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier;
  const isbn13 = industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier;

  //For users logged in
  
  const handleAddBook = async () => {
    if(userInfo) {
      try {
        //Parse data
        const bookData = {
            google_books_id: googleBookId || '',                           
            title: title || 'Untitled', 
            author: authors?.join(', ') || 'Unknown Author',
            description: description || '', 
            cover_image: imageLinks?.large || imageLinks?.medium || imageLinks?.small || imageLinks?.thumbnail || "https://via.placeholder.com/300x400",
            genres: categories || []
        };
        
        console.log('Sending book data:', bookData);
        
        const res = await addBook(bookData).unwrap();
        console.log('Response:', res);
        toast.success('Book added successfully!');
      } catch (err) {
          const errorMessage = err?.data?.error || err?.data?.message || err.error || 'Failed to add book';
          toast.error(errorMessage);
          console.log('Error:', err);
      }
    }
  }

  return (
    <div className="bg-slate-700 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Book Info Box */}
        <div className="bg-slate-600 rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Book Image - on left */}
            <div className="flex-shrink-0">
              <img 
                src={ imageLinks?.large || imageLinks?.medium || book.volumeInfo?.imageLinks?.small || imageLinks?.thumbnail || "https://via.placeholder.com/300x400"}
                alt={title}
                className="w-full max-w-50 lg:max-w-60 min-h-70 lg:min-h-90 aspect-[2/3] object-cover rounded-lg shadow-lg mx-auto lg:mx-0"
              />
            </div>
            
            {/* Book Details - Right side */}
            <div className="flex-1">
              {/* Title - Large */}
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1 leading-tight">
                {title}
              </h1>

              {/* SubTitle */}
              <div className="mb-4">
                <p className="text-lg text-slate-100 italic">
                  {subtitle}
                </p>
              </div>
              
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
              {userInfo ? (
              <button
                onClick={handleAddBook}
                className="cursor-pointer bg-blue-700 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Add to reading list
              </button>
              ) : (
                <Link to='/login'
                  className="cursor-pointer bg-blue-700 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Sign in to add to list
                </Link>
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
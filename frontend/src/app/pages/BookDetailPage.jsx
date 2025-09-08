import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'
import { getGoogleBook } from '../../../utils/googleBooksApi';
import { 
  useAddBookMutation, 
  useToggleBookFavoriteMutation, 
  useDeleteBookMutation, 
  useGetBookQuery,
  useUpdateBookStatusMutation } from '../slices/userBooksApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { FaRegStar, FaStar } from "react-icons/fa";

const BookDetail = () => {
  window.scrollTo(0, 0); //so the page loads in at the top
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { bookTitle, googleBookId } = useParams(); // Get book ID from URL
  console.log("googleBookId", googleBookId);

  const { userInfo } = useSelector((state) => state.auth); //For the reading list features

  const [addBook, {isLoading: isAddLoading}] = useAddBookMutation();
  const [favoriteBook, {isLoading: isFavoriteLoading}] = useToggleBookFavoriteMutation();
  const [deleteBook, {isLoading: isDeleteLoading}] = useDeleteBookMutation();
  const [updateStatus, {isLoading: isStatusLoading}] = useUpdateBookStatusMutation();
  
  // Check if book is in user's reading list (only if user is logged in)
  const { data: userBookData, isLoading: isCheckingBook, error: bookCheckError } = useGetBookQuery(googleBookId, {
    skip: !userInfo // Skip API call if user is not logged in
  });
  
  console.log('User Book Data:', userBookData);
  console.log('Favorite value:', userBookData?.favorite);
  console.log('Is Checking Book:', isCheckingBook);
  console.log('Book Check Error:', bookCheckError);

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
            cover_image: imageLinks?.thumbnail || imageLinks?.smallThumbnail || imageLinks?.medium || "https://via.placeholder.com/300x400",
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

  const handleDeleteBook = async () => {
    if(userInfo) {
      try {
        await deleteBook(googleBookId).unwrap();
        toast.success('Book removed from reading list!');
      } catch (error) {
        console.error('Failed to delete book:', error);
        toast.error('Failed to remove book')
      }
    }
  };

  const handleToggleFavorite = async () => {
    if(userInfo) {
      try {
        console.log('Before toggle - userBookData:', userBookData);
        console.log('Before toggle - favorite status:', userBookData?.favorite);
        
        const response = await favoriteBook(googleBookId).unwrap();
        console.log('Server response:', response);
        console.log('Response favorite status:', response.book.favorite);
        
        // Use the response data to show correct message since it has the updated favorite status
        toast.success(response.book.favorite ? 'Added to favorites' : 'Removed from favorites');
        
      } catch (error) {
        console.error('Failed to toggle favorite:', error);
        toast.error('Failed to update favorite status');
      }
    }
  };

  const handleStatusChange = async (event) => {
    if(userInfo) {
      const newStatus = event.target.value;
      try {
        const response = await updateStatus({ googleBookId, status: newStatus }).unwrap();
      } catch (error) {
        console.error('Failed to update status:', error);
        toast.error('Failed to update book status');
      }
    }
  };

  return (
    <div className="bg-slate-700 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Book Info Box */}
        <div className="bg-slate-600 rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Book Image - on left */}
            <div className="flex-shrink-0">
              <img 
                src={imageLinks?.thumbnail || imageLinks?.smallThumbnail || imageLinks?.medium || "https://via.placeholder.com/300x400"}
                alt={title}
                className="w-full max-w-sm lg:max-w-md min-h-50 lg:min-h-80 aspect-[2/3] object-cover rounded-lg shadow-lg mx-auto lg:mx-0"
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
              
              {/* Status Dropdown - Only show if book is in user's list */}
              {userInfo && userBookData?.isInUserList && (
                <div className="mb-6">
                  <label htmlFor="status-select" className="block text-slate-300 text-sm mb-2">
                    Reading Status:
                  </label>
                  <select
                    id="status-select"
                    value={userBookData?.status || 'to-read'}
                    onChange={handleStatusChange}
                    disabled={isStatusLoading}
                    className="bg-slate-600 border border-slate-500 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="to-read">To Read</option>
                    <option value="currently-reading">Currently Reading</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              )}
              
              {/* Add/Remove Button */}
              {userInfo ? (
                isCheckingBook ? (
                  // Loading state while checking if book exists
                  <button
                    disabled
                    className="cursor-not-allowed bg-gray-600 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg opacity-50"
                  >
                    Checking...
                  </button>
                ) : userBookData?.isInUserList ? (
                  // Book is in user's list - show remove button and favorite button
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDeleteBook}
                      disabled={isDeleteLoading}
                      className="cursor-pointer bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                    >
                      {isDeleteLoading ? 'Removing...' : 'Remove from reading list'}
                    </button>
                    
                    {/* Favorite Button - Square with Star */}
                    <button
                      onClick={handleToggleFavorite}
                      disabled={isFavoriteLoading}
                      className="cursor-pointer bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white p-3 rounded-lg text-xl transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center w-12 h-12"
                      title={userBookData?.favorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {isFavoriteLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : userBookData?.favorite ? (
                        <FaStar />
                      ) : (
                        <FaRegStar />
                      )}
                    </button>
                  </div>
                ) : (
                  // Book is not in user's list - show add button
                  <button
                    onClick={handleAddBook}
                    disabled={isAddLoading}
                    className="cursor-pointer bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    {isAddLoading ? 'Adding...' : 'Add to reading list'}
                  </button>
                )
              ) : (
                // User not logged in
                <Link to='/login'
                  className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
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
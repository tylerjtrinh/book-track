import { apiSlice } from './apiSlice';
const BOOK_URL = '/api/books';

export const userBooksApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBooks: builder.query({
            query: () => ({
                url: `${BOOK_URL}`,
                method: 'GET'
            }),
            providesTags: ['Books'] // For cache invalidation
        }),

        getBook: builder.query({
            query: (googleBookId) => ({
                url: `${BOOK_URL}/details/${googleBookId}`,
                method: 'GET'
            }),
            providesTags: (result, error, googleBookId) => [{ type: 'Books', id: googleBookId }]
        }),
        addBook: builder.mutation({
            query: (data) => ({
                url: `${BOOK_URL}`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result, error, data) => [
                'Books', 
                { type: 'Books', id: data.google_books_id }
            ]
        }),
        updateBookStatus: builder.mutation({
            query: ({ googleBookId, status }) => ({
                url: `${BOOK_URL}/status/${googleBookId}`,
                method: 'PUT',
                body: { status }
            }),
            invalidatesTags: ['Books'] // Refetch books after status update
        }),
        toggleBookFavorite: builder.mutation({
            query: (googleBookId) => ({
                url: `${BOOK_URL}/favorite/${googleBookId}`,
                method: 'PUT'
            }),
            invalidatesTags: ['Books'] // Refetch books after favorite toggle
        }),
        deleteBook: builder.mutation({
            query: (googleBookId) => ({
                url: `${BOOK_URL}/${googleBookId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, googleBookId) => [
                'Books', 
                { type: 'Books', id: googleBookId }
            ]
        })
    })
})

export const { 
    useGetBooksQuery, 
    useGetBookQuery,
    useAddBookMutation,
    useUpdateBookStatusMutation,
    useToggleBookFavoriteMutation,
    useDeleteBookMutation 
} = userBooksApiSlice;
import { apiSlice } from './apiSlice';
const BOOK_URL = '/api/books';

export const userBooksApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBooks: builder.query({
            query: () => ({
                url: `${BOOK_URL}`,
                method: 'GET'
            }),
            providesTags: ['Book'] // For cache invalidation
        }),
        deleteBook: builder.mutation({
            query: (bookId) => ({
                url: `${BOOK_URL}/${bookId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Book'] // Automatically refetch getBooks after deletion
        })
    })
})

export const { useGetBooksQuery, useDeleteBookMutation } = userBooksApiSlice;
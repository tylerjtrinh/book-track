import { apiSlice } from './apiSlice';
const BOOK_URL = '/api/books';

export const userBooksApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBooks: builder.query({
            query: () => ({
                url: `${BOOK_URL}`,
                method: 'GET'
            })
        }),
        getFilteredBooks: builder.query({
            query: (status) => ({
                url: `${BOOK_URL}/status`,
                method: 'GET'
            })
        })
    })
})

export const { useGetBooksQuery, useGetFilteredBooksQuery } = userBooksApiSlice;
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
        
    })
})

export const { useGetBooksQuery } = userBooksApiSlice;
import { apiSlice } from './apiSlice';
const EXPLORE_URL = '/api/explore';

export const exploreApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllBooks: builder.query({
            query: (listName) => ({
                url: `${EXPLORE_URL}/all`,
                method: 'GET'
            })
        }),
        getPopularBooks: builder.query({
            query: () => ({
                url: `${EXPLORE_URL}/popular`,
                method: 'GET'
            })
        })
    })
})

export const { useGetAllBooksQuery, useGetPopularBooksQuery } = exploreApiSlice;
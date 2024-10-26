import {apiSlice} from './api';
import { Book } from '@/types/book';

export const booksApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getNotMatchedBooks: build.query<Book[], number>({
            query: (rapprochementId) => ({
                url: `/grand_livre/${rapprochementId}/non_rapproches`,
                method: 'GET',
            }),
            transformResponse: (response: any[]) => response.map(item => ({
                ...item,
                date_ecriture: new Date(item.date_ecriture).toISOString(),
            })),
        }),
    })
})

export const {
    useGetNotMatchedBooksQuery,
} = booksApi;

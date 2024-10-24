import {apiSlice} from './api';
import { GrandLivre } from '@/types/grandLivre';

export const grandsLivresApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getNonRapprochesGrandLivres: build.query<GrandLivre[], number>({
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
    useGetNonRapprochesGrandLivresQuery,
} = grandsLivresApi;

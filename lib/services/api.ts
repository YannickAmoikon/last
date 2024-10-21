// lib/services/api.ts
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {getSession} from 'next-auth/react';

export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://69.197.168.215:8000/api/v1',
		prepareHeaders: async (headers) => {
			const session = await getSession();

			// Ajoute le token Bearer si disponible
			if (session?.accessToken) {
				headers.set('authorization', `Bearer ${session.accessToken}`);
			}

			return headers;
		},
	}),
	endpoints: (builder) => ({}),
	// Tags pour la gestion du cache
	tagTypes: ['Posts', 'Users'],
});
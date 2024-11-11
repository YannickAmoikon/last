// lib/services/api.ts
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {getSession, signOut} from 'next-auth/react';

const baseQuery = fetchBaseQuery({
	baseUrl: 'http://69.197.168.215:8000/api/v1',
	prepareHeaders: async (headers) => {
		const session = await getSession();

		if (session?.accessToken) {
			headers.set('authorization', `Bearer ${session.accessToken}`);
		}

		return headers;
	},
});

// Créer un baseQuery avec gestion des erreurs
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
	let result = await baseQuery(args, api, extraOptions);

	// Gérer les erreurs 401 (Unauthorized) ou 403 (Forbidden)
	if (result?.error?.status === 401 || result?.error?.status === 403) {
		// Déconnecter l'utilisateur et rediriger vers la page de login
		await signOut({callbackUrl: '/login'});
	}

	return result;
};

export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: baseQueryWithReauth,
	endpoints: (builder) => ({}),
	// Tags pour la gestion du cache
	tagTypes: ['Posts', 'Users'],
});

// Exporter un hook personnalisé pour vérifier l'état de l'authentification
export const useAuthCheck = () => {
	return async () => {
		const session = await getSession();
		if (!session?.accessToken) {
			await signOut({callbackUrl: '/login'});
			return false;
		}
		return true;
	};
};
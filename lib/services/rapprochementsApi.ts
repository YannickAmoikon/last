// lib/services/rapprochementsApi.ts
import {apiSlice} from './api';

interface Rapprochement {
	user_id: string;
	banque_id: string;
	date: string;
	status: string;
	id: string;
	etape_actuelle: string;
	commentaire: string;
	temps_traitement: string;
	banque: {
		id: string;
		nom: string;
	}
}

interface RapprochementsResponse {
	items: Rapprochement[];
	total: number;
	page: number;
	page_size: number;
	total_pages: number;
}

interface GetRapprochementsParams {
	page?: number;
	page_size?: number;
}

// Étendre l'API Slice existant avec les endpoints des rapprochements
export const rapprochementsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getRapprochements: builder.query<RapprochementsResponse, GetRapprochementsParams | void>({
			query: (params = {page: 1, page_size: 10}) => ({
				url: '/rapprochements',
				method: 'GET',
				params: params,
			}),
			transformResponse: (response: RapprochementsResponse) => {
				return {
					...response,
					items: response.items.map(item => ({
						...item,
						date: new Date(item.date).toISOString(), // Assure que la date est bien formatée
					})),
				};
			},
			providesTags: (result) =>
				result
					? [
						...result.items.map(({id}) => ({type: 'Rapprochements' as const, id})),
						{type: 'Rapprochements', id: 'LIST'},
					]
					: [{type: 'Rapprochements', id: 'LIST'}],
		}),

		// Ajouter un rapprochement
		addRapprochement: builder.mutation<Rapprochement, Partial<Rapprochement>>({
			query: (body) => ({
				url: '/rapprochements',
				method: 'POST',
				body,
			}),
			invalidatesTags: [{type: 'Rapprochements', id: 'LIST'}],
		}),

		// Mettre à jour un rapprochement
		updateRapprochement: builder.mutation<Rapprochement, { id: string; body: Partial<Rapprochement> }>({
			query: ({id, body}) => ({
				url: `/rapprochements/${id}`,
				method: 'PUT',
				body,
			}),
			invalidatesTags: (result, error, {id}) => [{type: 'Rapprochements', id}],
		}),

		// Supprimer un rapprochement
		deleteRapprochement: builder.mutation<void, string>({
			query: (id) => ({
				url: `/rapprochements/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [{type: 'Rapprochements', id}],
		}),
	}),
});

export const {
	useGetRapprochementsQuery,
	useAddRapprochementMutation,
	useUpdateRapprochementMutation,
	useDeleteRapprochementMutation,
} = rapprochementsApiSlice;
import {apiSlice} from './api';

// Interfaces
interface Banque {
	id: string;
	nom: string;
}

interface Rapprochement {
	user_id: string;
	banque_id: string;
	date: string;
	statut: string;
	id: string;
	etape_actuelle: string;
	commentaire: string;
	temps_traitement: string;
	banque: Banque;
}

interface RapprochementsResponse {
	items: Rapprochement[];
	total: number;
	page: number;
	page_size: number;
	total_pages: number;
}

// Types pour les requêtes
type GetRapprochementsParams = {
	page?: number;
	page_size?: number;
};

type CreateRapprochementRequest = {
	banque_id: number;
	compte_id: number;
	date: string;
	releve_bancaire: File;
	grand_livre: File;
	balance: File;
	edr: File;
};

// Constantes
const RAPPROCHEMENTS_URL = '/rapprochements';
const RAPPROCHEMENTS_TAG = 'Rapprochements';

// Fonctions utilitaires
const createFormData = (body: CreateRapprochementRequest): FormData => {
	const formData = new FormData();
	Object.entries(body).forEach(([key, value]) => {
		if (value instanceof File) {
			formData.append(key, value, value.name);
		} else {
			formData.append(key, value.toString());
		}
	});
	return formData;
};

// Slice API
export const rapprochementsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getRapprochements: builder.query<RapprochementsResponse, GetRapprochementsParams | void>({
			query: (params = {page: 1, page_size: 10}) => ({
				url: RAPPROCHEMENTS_URL,
				method: 'GET',
				params,
			}),
			transformResponse: (response: RapprochementsResponse) => ({
				...response,
				items: response.items.map(item => ({
					...item,
					date: new Date(item.date).toISOString(),
				})),
			}),
			providesTags: (result) =>
				result
					? [
						...result.items.map(({id}) => ({type: RAPPROCHEMENTS_TAG, id})),
						{type: RAPPROCHEMENTS_TAG, id: 'LIST'},
					]
					: [{type: RAPPROCHEMENTS_TAG, id: 'LIST'}],
		}),

		addRapprochement: builder.mutation<Rapprochement, CreateRapprochementRequest>({
			query: (body) => ({
				url: RAPPROCHEMENTS_URL,
				method: 'POST',
				body: createFormData(body),
				formData: true,
			}),
			invalidatesTags: [{type: RAPPROCHEMENTS_TAG, id: 'LIST'}],
		}),

		updateRapprochement: builder.mutation<Rapprochement, { id: string; body: Partial<Rapprochement> }>({
			query: ({id, body}) => ({
				url: `${RAPPROCHEMENTS_URL}/${id}`,
				method: 'PUT',
				body,
			}),
			invalidatesTags: (result, error, {id}) => [{type: RAPPROCHEMENTS_TAG, id}],
		}),

		deleteRapprochement: builder.mutation<void, string>({
			query: (id) => ({
				url: `${RAPPROCHEMENTS_URL}/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [{type: RAPPROCHEMENTS_TAG, id}],
		}),
	}),
});

// Hooks exportés
export const {
	useGetRapprochementsQuery,
	useAddRapprochementMutation,
	useUpdateRapprochementMutation,
	useDeleteRapprochementMutation,
} = rapprochementsApiSlice;
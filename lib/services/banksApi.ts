import {apiSlice} from './api';

// Interfaces
interface Compte {
	id: number;
	numero_compte: string;
	description: string;
}

interface Banque {
	id: number;
	nom: string;
	comptes: Compte[];
}

// Types pour les requêtes
type BanqueCreateInput = Omit<Banque, 'id' | 'comptes'>;
type BanqueUpdateInput = Partial<BanqueCreateInput>;

// Constantes
const BANKS_URL = '/banks';
const BANKS_TAG = 'Banques';

// Slice API
export const banquesApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getBanquesWithComptes: builder.query<Banque[], void>({
			query: () => ({
				url: `${BANKS_URL}/with-comptes`,
				method: 'GET',
			}),
			providesTags: (result) =>
				result
					? [
						...result.map(({id}) => ({type: BANKS_TAG, id})),
						{type: BANKS_TAG, id: 'LIST'},
					]
					: [{type: BANKS_TAG, id: 'LIST'}],
		}),

		addBanque: builder.mutation<Banque, BanqueCreateInput>({
			query: (body) => ({
				url: BANKS_URL,
				method: 'POST',
				body,
			}),
			invalidatesTags: [{type: BANKS_TAG, id: 'LIST'}],
		}),

		updateBanque: builder.mutation<Banque, { id: number; body: BanqueUpdateInput }>({
			query: ({id, body}) => ({
				url: `${BANKS_URL}/${id}`,
				method: 'PUT',
				body,
			}),
			invalidatesTags: (result, error, {id}) => [{type: BANKS_TAG, id}],
		}),

		deleteBanque: builder.mutation<void, number>({
			query: (id) => ({
				url: `${BANKS_URL}/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [{type: BANKS_TAG, id}],
		}),
	}),
});

// Hooks exportés
export const {
	useGetBanquesWithComptesQuery,
	useAddBanqueMutation,
	useUpdateBanqueMutation,
	useDeleteBanqueMutation,
} = banquesApiSlice;
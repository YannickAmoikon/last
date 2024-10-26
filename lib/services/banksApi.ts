import {apiSlice} from './api';
import {Bank} from '@/types/bank'


// Types pour les requêtes
type BankCreateInput = Omit<Bank, 'id' | 'comptes'>;
type BankUpdateInput = Partial<BankCreateInput>;

// Constantes
const BANKS_URL = '/banks';
const BANKS_TAG = 'Banques';

// Slice API
export const banquesApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getBanksWithAccounts: builder.query<Bank[], void>({
			query: () => ({
				url: `${BANKS_URL}/with-comptes`,
				method: 'GET',
			}),
			//@ts-ignore
			providesTags: (result) =>
				result
					? [
						...result.map(({id}) => ({type: BANKS_TAG, id})),
						{type: BANKS_TAG, id: 'LIST'},
					]
					: [{type: BANKS_TAG, id: 'LIST'}],
		}),

		createBank: builder.mutation<Bank, BankCreateInput>({
			query: (body) => ({
				url: BANKS_URL,
				method: 'POST',
				body,
			}),
			//@ts-ignore
			invalidatesTags: [{type: BANKS_TAG, id: 'LIST'}],
		}),

		updateBank: builder.mutation<Bank, { id: number; body: BankUpdateInput }>({
			query: ({id, body}) => ({
				url: `${BANKS_URL}/${id}`,
				method: 'PUT',
				body,
			}),
			//@ts-ignore
			invalidatesTags: (result, error, {id}) => [{type: BANKS_TAG, id}],
		}),

		deleteBank: builder.mutation<void, number>({
			query: (id) => ({
				url: `${BANKS_URL}/${id}`,
				method: 'DELETE',
			}),
			//@ts-ignore
			invalidatesTags: (result, error, id) => [{type: BANKS_TAG, id}],
		}),
	}),
});

// Hooks exportés
export const {
	useGetBanksWithAccountsQuery,
	useCreateBankMutation,
	useUpdateBankMutation,
	useDeleteBankMutation,
} = banquesApiSlice;
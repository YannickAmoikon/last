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

interface RapprochementLignesResponse {
	items: RapprochementLigne[];
	total: number;
	page: number;
	page_size: number;
	total_pages: number;
  };
  interface RapprochementLigne {
	rapprochement_id: number;
	date_operation: string;
	numero_compte: string;
	description: string;
	reference: string;
	date_valeur: string;
	devise: string;
	debit: number;
	credit: number;
	solde_courant: number;
	id: string;
	lignes_rapprochement: LigneRapprochement[];
  };
  interface GrandLivre {
	rapprochement_id: number;
	numero_piece: string;
	date_ecriture: string;
	libelle: string;
	debit: number;
	credit: number;
	cpte_alt: string;
	exercice: string;
	compte: string;
	cpte_gen: string;
	id: string;
  }
  
  interface LigneRapprochement {
	id: number;
	rapprochement_id: number;
	statut: string;
	type_match: string;
	commentaire: string;
	decision: string;
	flag: string;
	grand_livre: GrandLivre;
  }

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
			// @ts-ignore
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
			// @ts-ignore
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
			// @ts-ignore
			invalidatesTags: [{type: RAPPROCHEMENTS_TAG, id: 'LIST'}],
		}),

		updateRapprochement: builder.mutation<Rapprochement, { id: string; body: Partial<Rapprochement> }>({
			query: ({id, body}) => ({
				url: `${RAPPROCHEMENTS_URL}/${id}`,
				method: 'PUT',
				body,
			}),
			// @ts-ignore
			invalidatesTags: (result, error, {id}) => [{type: RAPPROCHEMENTS_TAG, id}],
		}),

		deleteRapprochement: builder.mutation<void, string>({
			query: (id) => ({
				url: `${RAPPROCHEMENTS_URL}/${id}`,
				method: 'DELETE',
			}),
			// @ts-ignore
			invalidatesTags: (result, error, id) => [{type: RAPPROCHEMENTS_TAG, id}],
		}),

		getRapprochementLignes: builder.query<RapprochementLignesResponse, { rapprochement_id: number, statut?: string, page?: number, page_size?: number }>({
			query: ({ rapprochement_id, statut, page = 1, page_size = 10 }) => ({
				url: `${RAPPROCHEMENTS_URL}/${rapprochement_id}/lignes`,
				method: 'GET',
				params: { statut, page, page_size },
			}),
			transformResponse: (response: RapprochementLignesResponse) => ({
				...response,
				items: response.items.map(item => ({
					...item,
					date_operation: new Date(item.date_operation).toISOString(),
					date_valeur: new Date(item.date_valeur).toISOString(),
					lignes_rapprochement: item.lignes_rapprochement.map(ligne => ({
						...ligne,
						grand_livre: {
							...ligne.grand_livre,
							date_ecriture: new Date(ligne.grand_livre.date_ecriture).toISOString(),
						},
					})),
				})),
			}),
			// @ts-ignore
			providesTags: (result, error, arg) => 
				result
					? [
						...result.items.map(({ id }) => ({ type: RAPPROCHEMENTS_TAG, id })),
						{ type: RAPPROCHEMENTS_TAG, id: `LIST_${arg.rapprochement_id}` },
					]
					: [{ type: RAPPROCHEMENTS_TAG, id: `LIST_${arg.rapprochement_id}` }],
		}),

		validerLigneRapprochement: builder.mutation<{ message: string, ligne_id: number }, { rapprochement_id: number, ligne_id: number }>({
			query: ({ rapprochement_id, ligne_id }) => ({
				url: `${RAPPROCHEMENTS_URL}/${rapprochement_id}/lignes/${ligne_id}/valider`,
				method: 'POST',
			}),
			// @ts-ignore
			invalidatesTags: (result, error, { rapprochement_id }) => [
				{ type: RAPPROCHEMENTS_TAG, id: `LIST_${rapprochement_id}` },
			],
		}),
	}),
});

// Hooks exportés
export const {
	useGetRapprochementsQuery,
	useAddRapprochementMutation,
	useUpdateRapprochementMutation,
	useDeleteRapprochementMutation,
	useGetRapprochementLignesQuery,
	useValiderLigneRapprochementMutation,
} = rapprochementsApiSlice;

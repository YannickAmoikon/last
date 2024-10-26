import { apiSlice } from "./api";
import {
  Rapprochement,
  RapprochementsResponse,
  GetRapprochementsParams,
  CreateRapprochementRequest,
  RapprochementLignesResponse,
} from "@/types/rapprochements";

// Constantes
const RAPPROCHEMENTS_URL = "/rapprochements";
const RAPPROCHEMENTS_TAG = "Rapprochements";

// Slice API
export const rapprochementsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRapprochements: builder.query<
      RapprochementsResponse,
      GetRapprochementsParams | void
    >({
      // @ts-ignore
      query: (params = { page: 1, page_size: 10 }) => ({
        url: RAPPROCHEMENTS_URL,
        method: "GET",
        params,
      }),
      transformResponse: (response: RapprochementsResponse) => ({
        ...response,
        items: response.items.map((item) => ({
          ...item,
          date: new Date(item.date).toISOString(),
        })),
      }),
      // @ts-ignore
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: RAPPROCHEMENTS_TAG,
                id,
              })),
              { type: RAPPROCHEMENTS_TAG, id: "LIST" },
            ]
          : [{ type: RAPPROCHEMENTS_TAG, id: "LIST" }],
    }),

    addRapprochement: builder.mutation<Rapprochement, CreateRapprochementRequest>({
      query: (body) => ({
        url: RAPPROCHEMENTS_URL,
        method: "POST",
        body,
        formData: true,
      }),
      // @ts-ignore
      invalidatesTags: [{ type: RAPPROCHEMENTS_TAG, id: "LIST" }],
    }),

    updateRapprochement: builder.mutation<
      Rapprochement,
      { id: string; body: Partial<Rapprochement> }
    >({
      query: ({ id, body }) => ({
        url: `${RAPPROCHEMENTS_URL}/${id}`,
        method: "PUT",
        body,
      }),
      // @ts-ignore
      invalidatesTags: (result, error, { id }) => [
        { type: RAPPROCHEMENTS_TAG, id },
      ],
    }),

    deleteRapprochement: builder.mutation<void, string>({
      query: (id) => ({
        url: `${RAPPROCHEMENTS_URL}/${id}`,
        method: "DELETE",
      }),
      // @ts-ignore
      invalidatesTags: (result, error, id) => [
        { type: RAPPROCHEMENTS_TAG, id },
      ],
    }),

    getRapprochementLignes: builder.query<
      RapprochementLignesResponse,
      {
        rapprochement_id: number;
        statut?: string;
        page?: number;
        page_size?: number;
      }
    >({
      query: ({ rapprochement_id, statut, page = 1, page_size = 10 }) => ({
        url: `${RAPPROCHEMENTS_URL}/${rapprochement_id}/lignes`,
        method: "GET",
        params: { statut, page, page_size },
      }),
      transformResponse: (response: RapprochementLignesResponse) => ({
        ...response,
        items: response.items.map((item) => ({
          ...item,
          date_operation: new Date(item.date_operation).toISOString(),
          date_valeur: new Date(item.date_valeur).toISOString(),
          lignes_rapprochement: item.lignes_rapprochement.map((ligne) => ({
            ...ligne,
            grand_livre: {
              ...ligne.grand_livre,
              date_ecriture: new Date(
                ligne.grand_livre.date_ecriture,
              ).toISOString(),
            },
          })),
        })),
      }),
      // @ts-ignore
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: RAPPROCHEMENTS_TAG,
                id,
              })),
              { type: RAPPROCHEMENTS_TAG, id: `LIST_${arg.rapprochement_id}` },
            ]
          : [{ type: RAPPROCHEMENTS_TAG, id: `LIST_${arg.rapprochement_id}` }],
    }),

    validerLigneRapprochement: builder.mutation<
      { message: string; ligne_id: number },
      { rapprochement_id: number; ligne_id: number }
    >({
      query: ({ rapprochement_id, ligne_id }) => ({
        url: `${RAPPROCHEMENTS_URL}/${rapprochement_id}/lignes/${ligne_id}/valider`,
        method: "POST",
      }),
      // @ts-ignore
      invalidatesTags: (result, error, { rapprochement_id }) => [
        { type: RAPPROCHEMENTS_TAG, id: `LIST_${rapprochement_id}` },
      ],
    }),

    getRapprochementRapport: builder.query<
      Blob,
      { rapprochement_id: number; statut: string }
    >({
      query: ({ rapprochement_id, statut }) => ({
        url: `${RAPPROCHEMENTS_URL}/${rapprochement_id}/lignes/rapport`,
        method: "GET",
        params: { statut },
        responseHandler: (response) => response.blob(),
      }),
    }),

    creerLigneRapprochement: builder.mutation<
      { message: string; ligne_id: number },
      {
        rapprochement_id: number;
        body: {
          releve_bancaire_id: string;
          grand_livre_id: string;
          commentaire: string;
        };
      }
    >({
      query: ({ rapprochement_id, body }) => ({
        url: `${RAPPROCHEMENTS_URL}/${rapprochement_id}/lignes/creer`,
        method: "POST",
        body,
      }),
      // @ts-ignore
      invalidatesTags: (result, error, { rapprochement_id }) => [
        { type: RAPPROCHEMENTS_TAG, id: `LIST_${rapprochement_id}` },
      ],
    }),

    cloturerRapprochement: builder.mutation<
      { message: string },
      { rapprochement_id: number }
    >({
      query: ({ rapprochement_id }) => ({
        url: `${RAPPROCHEMENTS_URL}/${rapprochement_id}/cloturer`,
        method: "POST",
      }),
      //@ts-ignore
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
  useGetRapprochementRapportQuery,
  useCreerLigneRapprochementMutation,
  useCloturerRapprochementMutation,
} = rapprochementsApiSlice;

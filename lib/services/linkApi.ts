import { apiSlice } from "./api";
import {
  Link,
  LinksResponse,
  GetLinksParams,
  CreateLinkRequest,
  MatchResponse,
} from "@/types/link";

// Constantes
const LINKS_URL = "/rapprochements";
const LINKS_TAG = "Links";

// Slice API
export const LinkApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLinks: builder.query<
      LinksResponse,
      GetLinksParams | void
    >({
      // @ts-ignore
      query: (params = { page: 1, page_size: 10 }) => ({
        url: LINKS_URL,
        method: "GET",
        params,
      }),
      transformResponse: (response: LinksResponse) => ({
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
                type: LINKS_TAG,
                id,
              })),
              { type: LINKS_TAG, id: "LIST" },
            ]
          : [{ type: LINKS_TAG, id: "LIST" }],
    }),

    createLink: builder.mutation<Link, CreateLinkRequest>({
      query: (body) => ({
        url: LINKS_URL,
        method: "POST",
        body,
        formData: true,
      }),
      // @ts-ignore
      invalidatesTags: [{ type: LINKS_TAG, id: "LIST" }],
    }),

    updateLink: builder.mutation<
      Link,
      { id: string; body: Partial<Link> }
    >({
      query: ({ id, body }) => ({
        url: `${LINKS_URL}/${id}`,
        method: "PUT",
        body,
      }),
      // @ts-ignore
      invalidatesTags: (result, error, { id }) => [
        { type: LINKS_TAG, id },
      ],
    }),

    deleteLink: builder.mutation<void, string>({
      query: (id) => ({
        url: `${LINKS_URL}/${id}`,
        method: "DELETE",
      }),
      // @ts-ignore
      invalidatesTags: (result, error, id) => [
        { type: LINKS_TAG, id },
      ],
    }),

    getMatches: builder.query<
      MatchResponse,
      {
        rapprochement_id: number;
        statut?: string;
        page?: number;
        page_size?: number;
      }
    >({
      query: ({ rapprochement_id, statut, page = 1, page_size = 10 }) => ({
        url: `/ligne_rapprochement/${rapprochement_id}/releves`,
        method: "GET",
        params: { statut, page, page_size },
      }),
      // @ts-ignore
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: LINKS_TAG,
                id,
              })),
              { type: LINKS_TAG, id: `LIST_${arg.rapprochement_id}` },
            ]
          : [{ type: LINKS_TAG, id: `LIST_${arg.rapprochement_id}` }],
    }),

    validateLineLink: builder.mutation<any, { 
      rapprochement_id: number;
      ligne_ids: number[];
      ecart_accepte: boolean;
    }>({
      query: ({ rapprochement_id, ligne_ids, ecart_accepte }) => ({
        url: `/ligne_rapprochement/${rapprochement_id}/valider`,
        method: 'POST',
        body: {
          ligne_ids,
          ecart_accepte
        }
      }),
      // @ts-ignore
      invalidatesTags: (result, error, { rapprochement_id }) => [
        { type: LINKS_TAG, id: `LIST_${rapprochement_id}` },
      ],
    }),

    getLinkRapport: builder.query<
      Blob,
      { rapprochement_id: number; statut: string }
    >({
      query: ({ rapprochement_id, statut }) => ({
        url: `${LINKS_URL}/${rapprochement_id}/lignes/rapport`,
        method: "GET",
        params: { statut },
        responseHandler: (response) => response.blob(),
      }),
    }),

    createLineLink: builder.mutation<
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
        url: `${LINKS_URL}/${rapprochement_id}/lignes/creer`,
        method: "POST",
        body,
      }),
      // @ts-ignore
      invalidatesTags: (result, error, { rapprochement_id }) => [
        { type: LINKS_TAG, id: `LIST_${rapprochement_id}` },
      ],
    }),

    closeLink: builder.mutation<
      { message: string },
      { rapprochement_id: number }
    >({
      query: ({ rapprochement_id }) => ({
        url: `${LINKS_URL}/${rapprochement_id}/cloturer`,
        method: "POST",
      }),
      //@ts-ignore
      invalidatesTags: (result, error, { rapprochement_id }) => [
        { type: LINKS_TAG, id: `LIST_${rapprochement_id}` },
      ],
    }),
  }),
});

// Hooks exportés
export const {
  useGetLinksQuery,
  useCreateLinkMutation,
  useUpdateLinkMutation,
  useDeleteLinkMutation,
  useGetMatchesQuery,
  useValidateLineLinkMutation,
  useGetLinkRapportQuery,
  useCreateLineLinkMutation,
  useCloseLinkMutation,
} = LinkApi;

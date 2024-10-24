import { apiSlice } from "./api"

export const lignesRapprochementsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    dematcherLigne: builder.mutation({
      query: ({ rapprochement_id, ligne_id }) => ({
        url: `/ligne_rapprochement/${rapprochement_id}/${ligne_id}/dematcher`,
        method: 'POST',
      }),
    }),
  }),
})

export const { useDematcherLigneMutation } = lignesRapprochementsApi

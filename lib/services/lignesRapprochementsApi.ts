import { apiSlice } from "./api"
import { LigneRapprochement } from "@/types/ligneRapprochement";

// Définition des URL et tags
const LIGNES_RAPPROCHEMENTS_URL = '/ligne_rapprochement';
const LIGNES_RAPPROCHEMENTS_TAG = 'LignesRapprochements';

export const lignesRapprochementsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    dematcherLigne: builder.mutation<LigneRapprochement, { rapprochement_id: number; ligne_id: number }>({
      query: ({ rapprochement_id, ligne_id }) => ({
        url: `${LIGNES_RAPPROCHEMENTS_URL}/${rapprochement_id}/${ligne_id}/dematcher`,
        method: 'POST',
      }),
      //@ts-ignore
      invalidatesTags: (result, error, { rapprochement_id }) => [
        { type: LIGNES_RAPPROCHEMENTS_TAG, id: rapprochement_id },
        LIGNES_RAPPROCHEMENTS_TAG
      ],
    }),
  }),
})

export const { useDematcherLigneMutation } = lignesRapprochementsApi

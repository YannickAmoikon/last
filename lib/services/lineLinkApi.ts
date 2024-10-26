import { apiSlice } from "./api"
import { LineLink } from "@/types/lineLink";

// Définition des URL et tags
const LINE_LINK_URL = '/ligne_rapprochement';
const LINE_LINK_TAG = 'LineLink';

export const lineLinkApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    dematchLineLink: builder.mutation<LineLink, { rapprochement_id: number; ligne_id: number }>({
      query: ({ rapprochement_id, ligne_id }) => ({
        url: `${LINE_LINK_URL}/${rapprochement_id}/${ligne_id}/dematcher`,
        method: 'POST',
      }),
      //@ts-ignore
      invalidatesTags: (result, error, { rapprochement_id }) => [
        { type: LINE_LINK_TAG, id: rapprochement_id },
        LINE_LINK_TAG
      ],
    }),
  }),
})

export const { useDematchLineLinkMutation } = lineLinkApi

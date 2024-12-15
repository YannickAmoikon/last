import {apiSlice} from './api';


export const dashboardApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getStatPerBank: build.query({
            query: (bankId) => ({
                url: `/dashboard/stats?banque_id=${bankId}`,
                method: 'GET'
            }),
        })
    })
})

export const {
    useGetStatPerBankQuery
} = dashboardApi
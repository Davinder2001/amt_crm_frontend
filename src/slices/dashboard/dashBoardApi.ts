import dashBoardCreateApiSlice from "./dashBoardCreateSlice";

const dashBoardApi = dashBoardCreateApiSlice.injectEndpoints({
    endpoints: (builder) => ({

        dashboardCardSummary: builder.query<DashboardCardsResponse, void>({
            query: () => ({
                url: "dashboard/cards-summary",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Dashboard"],
        }),

    }),
});

export const {
    useDashboardCardSummaryQuery,

} = dashBoardApi;

export default dashBoardApi;

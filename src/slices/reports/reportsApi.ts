import reportsCreateApiSlice from "./reportsCreateSlice";
const reportsApi = reportsCreateApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchReportSummary: builder.query<unknown, void>({
      query: () => ({
        url: "reports/summary",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Reports"],
    }),

    fetchSalesReport: builder.query<SalesReportResponse, void>({
      query: () => ({
        url: "reports/sales",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Reports"],
    }),

    fetchRevenueReport: builder.query<RevenueReportResponse, void>({
      query: () => ({
        url: "reports/revenue",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Reports"],
    }),

    fetchMonthlySalesReport: builder.query<MonthlySalesResponse, void>({
      query: () => ({
        url: "reports/sales-summary",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Reports"],
    }),

    fetchMonthlyRevenueReport: builder.query<MonthlyRevenueResponse, void>({
      query: () => ({
        url: "reports/revenue-summary",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Reports"],
    }),

    fetchTopSellingItems: builder.query<TopSellingItemsResponse, void>({
      query: () => ({
        url: "reports/top-selling-items",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Reports"],
    }),
  }),
});

export const {
  useFetchReportSummaryQuery,
  useFetchSalesReportQuery,
  useFetchRevenueReportQuery,
  useFetchMonthlySalesReportQuery,
  useFetchMonthlyRevenueReportQuery,
  useFetchTopSellingItemsQuery, 
} = reportsApi;

export default reportsApi;

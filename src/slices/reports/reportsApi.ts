import reportsCreateApiSlice from "./reportsCreateSlice";
import { SalesReportResponse, RevenueReportResponse } from "@/types/reportsTypes";

const reportsApi = reportsCreateApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Example endpoint, replace or extend as needed
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
    }),
});

export const {
    useFetchReportSummaryQuery,
    useFetchSalesReportQuery,
    useFetchRevenueReportQuery,
} = reportsApi;

export default reportsApi; 
import reportsCreateApiSlice from "./reportsCreateSlice";
import {
  SalesReportResponse,
  RevenueReportResponse,
  MonthlySalesResponse
} from "@/types/reportsTypes";

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
  }),
});

export const {
  useFetchReportSummaryQuery,
  useFetchSalesReportQuery,
  useFetchRevenueReportQuery,
  useFetchMonthlySalesReportQuery,
} = reportsApi;

export default reportsApi;

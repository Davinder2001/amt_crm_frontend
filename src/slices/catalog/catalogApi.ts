import catalogCreateSlice from "./catalogCreateSlice";

const catalogApi = catalogCreateSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all catalog items
    fetchCatalogItems: builder.query<StoreItem[], void>({
      query: () => "catalog",
      providesTags: ["Catalog"],
    }),

    // Add item to catalog
    addToCatalog: builder.mutation<StoreItem, number>({
      query: (id) => ({
        url: `catalog/add/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Catalog"],
    }),

    // Remove item from catalog
    removeFromCatalog: builder.mutation<StoreItem, number>({
      query: (id) => ({
        url: `catalog/remove/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Catalog"],
    }),
  }),
});

export const {
  useFetchCatalogItemsQuery,
  useAddToCatalogMutation,
  useRemoveFromCatalogMutation,
} = catalogApi;

export default catalogApi;

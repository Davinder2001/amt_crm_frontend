import storeApiSlice from "./storeCreateSlice";



const storeApi = storeApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all store items
    fetchStore: builder.query<StoreResponse, void>({
      query: () => "store/items",
      providesTags: ["Store"],
    }),

    // Fetch a single store item by id
    fetchStoreItem: builder.query<StoreItem, number>({
      query: (id) => `store/items/${id}`,
      providesTags: (result, error, id) => [{ type: "Store", id }],
    }),

    // Create a new store item
    createStoreItem: builder.mutation<CreateStoreItemRequest, FormData>({
      query: (newItem) => ({
        url: "store/add-items",
        method: "POST",
        body: newItem,
      }),
      invalidatesTags: ["Store"],
    }),

    // Delete a store item
    deleteStoreItem: builder.mutation<void, number>({
      query: (id) => ({
        url: `store/items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Store"],
    }),

    // Update a store item
    updateStoreItem: builder.mutation<StoreItem, UpdateStoreItemRequest>({
      query: ({ id, ...patch }) => ({
        url: `store/items/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Store"],
    }),

    // Bulk create store items
    bulkCreateStoreItem: builder.mutation<CreateStoreItemRequest, FormData>({
      query: (formData) => ({
        url: "store/bulk-items",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Store"],
    }),

    // OCR scan
    ocrProcess: builder.mutation<OcrResponse, FormData>({
      query: (formData) => ({
        url: "add-as-vendor/ocrscan",
        method: "POST",
        body: formData,
      }),
    }),

    // 🆕 Fetch all attributes
    fetchAttributes: builder.query<Attribute[], void>({
      query: () => "attributes",
      providesTags: ["Store"],
    }),

    // 🆕 Fetch single attribute by ID
    fetchAttributeById: builder.query<Attribute, number>({
      query: (id) => `attributes/${id}`,
      providesTags: (result, error, id) => [{ type: "Store", id }],
    }),

    // 🆕 Create new attribute
    createAttribute: builder.mutation<Attribute, CreateAttributePayload>({
      query: (data) => ({
        url: "attributes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Store"],
    }),
    

    // 🆕 Update an attribute
    updateAttribute: builder.mutation<Attribute, { id: number; data: Partial<Attribute> }>({
      query: ({ id, data }) => ({
        url: `attributes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Store"],
    }),

    // 🆕 Delete attribute
    deleteAttribute: builder.mutation<void, number>({
      query: (id) => ({
        url: `attributes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Store"],
    }),

    toggleAttributeStatus: builder.mutation<{ status: string }, number>({
      query: (id) => ({
        url: `attributes/${id}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Store'],
    }),
    

  }),
});

export const {
  useFetchStoreQuery,
  useFetchStoreItemQuery,
  useCreateStoreItemMutation,
  useDeleteStoreItemMutation,
  useUpdateStoreItemMutation,
  useBulkCreateStoreItemMutation,
  useOcrProcessMutation,

  // 🆕 Attribute hooks
  useFetchAttributesQuery,
  useFetchAttributeByIdQuery,
  useCreateAttributeMutation,
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
  useToggleAttributeStatusMutation
} = storeApi;

export default storeApi;

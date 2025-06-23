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
    createStoreItem: builder.mutation<{ success: boolean, message: string, error: string, item: { id: number } }, FormData>({
      query: (newItem) => ({
        url: "store/add-items",
        method: "POST",
        body: newItem,
      }),
      invalidatesTags: ["Store"],
    }),

    // Delete a store item
    deleteStoreItem: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `store/items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Store"],
    }),

    // bulk Delete store items
    bulkDeleteStoreItems: builder.mutation<{ message: string }, number[]>({
      query: (item_id) => ({
        url: 'store/items/bulk-delete',
        method: 'POST',
        body: { item_id },
      }),
      invalidatesTags: ["Store"],
    }),

    // Update a store item
    updateStoreItem: builder.mutation<StoreItem, { id: number, formdata: FormData }>({
      query: ({ id, formdata }) => ({
        url: `store/items/${id}`,
        method: "POST",
        body: formdata,
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
    fetchAttributes: builder.query<AttributesResponse, void>({
      query: () => "attributes",
      providesTags: ["Store"],
    }),

    fetchVariations: builder.query<AttributesResponse, void>({
      query: () => "variations",
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
    updateAttribute: builder.mutation<Attribute, { id: number; data: { name: string; values: string[] } }>({
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

    // 🆕 Fetch all categories
    fetchCategories: builder.query<CategoryResponse, void>({
      query: () => "categories",
      providesTags: ["Store"],
    }),

    // 🆕 Create new category
    createCategory: builder.mutation<Category, Partial<Category>>({
      query: (data) => ({
        url: "categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Store"],
    }),

    // 🆕 Update an category
    updateCategory: builder.mutation<Category, { id: number; data: Partial<Category> }>({
      query: ({ id, data }) => ({
        url: `categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Store"],
    }),


    // 🆕 Delete category
    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Store"],
    }),


    // 🆕 Fetch all  with items
    fetchCategoriesAndItems: builder.query<Category, void>({
      query: () => "store/cat-items",
      providesTags: ["Store"],
    }),

    // 🆕 Export store items to Excel
    exportStoreItems: builder.query<Blob, void>({
      query: () => ({
        url: "export-inline", // Update this if your Laravel route differs
        method: "GET",
        responseHandler: async (response) => response.blob(),
      }),
    }),

    importStoreItems: builder.mutation<Record<string, unknown>, FormData>({
      query: (formData) => ({
        url: 'import-inline',
        method: 'POST',
        body: formData,
      }),
    }),


    fetchBrands: builder.query<Brand[], void>({
      query: () => 'store/brands',
    }),
    createBrand: builder.mutation<Brand, { name: string }>({
      query: (body) => ({
        url: 'store/brands',
        method: 'POST',
        body,
      }),
    }),
    deleteBrand: builder.mutation<void, number>({
      query: (id) => ({
        url: `store/brands/${id}`,
        method: 'DELETE',
      }),
    }),
    updateBrand: builder.mutation<Brand, { id: number; name: string }>({
      query: ({ id, ...body }) => ({
        url: `store/brands/${id}`,
        method: 'PUT',
        body,
      }),
    }),

    // Item Batch Endpoints
    fetchItemBatches: builder.query<ItemBatch[], void>({
      query: () => "store/item/batch",
      providesTags: ["Store"],
    }),

    fetchItemBatchById: builder.query<ItemBatch, number>({
      query: (id) => `store/item/batch/${id}`,
      providesTags: (result, error, id) => [{ type: "Store", id }],
    }),

    createItemBatch: builder.mutation<StoreItemBatchRequest, FormData>({
      query: (newBatch) => ({
        url: "store/item/batch",
        method: "POST",
        body: newBatch,
      }),
      invalidatesTags: ["Store"],
    }),

    updateItemBatch: builder.mutation<ItemBatchResponse, {
      id: number;
      data: {
        cost_price?: number;
        quantity_count?: number;
      }
    }>({
      query: ({ id, data }) => ({
        url: `store/item/batch/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Store", id },
        "Store"
      ],
    }),

    deleteItemBatch: builder.mutation<ItemBatchResponse, number>({
      query: (id) => ({
        url: `store/item/batch/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Store"],
    }),

  }),
});

export const {
  useFetchStoreQuery,
  useFetchStoreItemQuery,
  useCreateStoreItemMutation,
  useDeleteStoreItemMutation,
  useBulkDeleteStoreItemsMutation,
  useUpdateStoreItemMutation,
  useBulkCreateStoreItemMutation,
  useOcrProcessMutation,

  // 🆕 Attribute hooks
  useFetchAttributesQuery,
  useFetchVariationsQuery,
  useFetchAttributeByIdQuery,
  useCreateAttributeMutation,
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
  useToggleAttributeStatusMutation,

  // categories hook
  useFetchCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesAndItemsQuery,
  useLazyExportStoreItemsQuery,
  useImportStoreItemsMutation,

  useFetchBrandsQuery,
  useCreateBrandMutation,
  useDeleteBrandMutation,
  useUpdateBrandMutation,


  // Item Batch hooks
  useFetchItemBatchesQuery,
  useFetchItemBatchByIdQuery,
  useCreateItemBatchMutation,
  useUpdateItemBatchMutation,
  useDeleteItemBatchMutation,

} = storeApi;

export default storeApi;

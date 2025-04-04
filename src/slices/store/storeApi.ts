import storeApiSlice from "./storeCreateSlice";
import { 
  StoreItem, 
  CreateStoreItemRequest, 
  StoreResponse, 
  OcrResponse 
} from '@/types/StoreItem';

interface UpdateStoreItemRequest {
  id: number;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  // Add additional fields as needed
}

const storeApi = storeApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all store items
    fetchStore: builder.query<StoreResponse, void>({
      query: () => "store/items",
      providesTags: ["Store"],
    }),

    // Fetch a single store item by id (for show/view)
    fetchStoreItem: builder.query<StoreItem, number>({
      query: (id) => `store/items/${id}`,
      providesTags: (result, error, id) => [{ type: "Store", id }],
    }),

    // Create a new store item
    createStoreItem: builder.mutation<StoreItem, CreateStoreItemRequest>({
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

    // Update (edit) a store item
    updateStoreItem: builder.mutation<StoreItem, UpdateStoreItemRequest>({
      query: ({ id, ...patch }) => ({
        url: `store/items/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Store"],
    }),




    bulkCreateStoreItem: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "store/bulk-items",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Store"],
    }),
    

    // OCR process endpoint (if needed)
    ocrProcess: builder.mutation<OcrResponse, FormData>({
      query: (formData) => ({
        url: "ocr-process",
        method: "POST",
        body: formData,
      }),
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
} = storeApi;

export default storeApi;

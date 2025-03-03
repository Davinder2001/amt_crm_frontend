import storeApiSlice from "./storeCreateSlice";

interface StoreItem {
  id:number;
  sr_no: number;
  name: string;
  quantity: number;
  price: number;
}

interface StoreResponse {
  data: StoreItem[];
}

interface CreateStoreItemRequest {
  name: string;
  quantity: number;
  price: number;
}
interface OcrResponse {
  message: string;
  imageUrl?: string; // ✅ API provides an image URL instead of a Blob
}

const storeApi = storeApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchStore: builder.query<StoreResponse, void>({
      query: () => "api/v1/store",
      providesTags: ["Store"],
    }),

    createStoreItem: builder.mutation<StoreItem, CreateStoreItemRequest>({
      query: (newItem) => ({
        url: "api/v1/store",
        method: "POST",
        body: newItem,
      }),
      invalidatesTags: ["Store"], // Refresh store data after creation
    }),

    deleteStoreItem: builder.mutation<void, number>({
      query: (id) => ({
        url: `api/v1/store/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Store"], // Refresh store data after deletion
    }),

    ocrProcess: builder.mutation<OcrResponse, FormData>({
      query: (formData) => ({
        url: "api/v1/ocr-process",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useFetchStoreQuery,
  useCreateStoreItemMutation,
  useDeleteStoreItemMutation, // ✅ New DELETE mutation
  useOcrProcessMutation,
} = storeApi;

export default storeApi;

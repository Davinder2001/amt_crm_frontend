import storeApiSlice from "./storeCreateSlice";

const storeApi = storeApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchStore: builder.query<StoreResponse, void>({
      query: () => "store",
      providesTags: ["Store"],
    }),

    createStoreItem: builder.mutation<StoreItem, CreateStoreItemRequest>({
      query: (newItem) => ({
        url: "store",
        method: "POST",
        body: newItem,
      }),
      invalidatesTags: ["Store"], 
    }),

    deleteStoreItem: builder.mutation<void, number>({
      query: (id) => ({
        url: `store/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Store"], 
    }),

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
  useCreateStoreItemMutation,
  useDeleteStoreItemMutation, 
  useOcrProcessMutation,
} = storeApi;

export default storeApi;

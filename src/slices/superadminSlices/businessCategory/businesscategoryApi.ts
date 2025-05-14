import businesscategoryCreateApiSlice from "./businesscategoryCreateSlice";

const businesscategoryApi = businesscategoryCreateApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // GET: Fetch all categories
        getBusinessCategories: builder.query<BusinessCategory[], void>({
            query: () => ({
                url: "business-categories",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["BusinessCategory"],
        }),

        // POST: Create new category
        createBusinessCategory: builder.mutation<void, { name: string }>({
            query: (body) => ({
                url: "business-categories",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["BusinessCategory"],
        }),

        // PUT: Update category by ID
        updateBusinessCategory: builder.mutation<void, { id: number; name: string }>({
            query: ({ id, ...body }) => ({
                url: `business-categories/${id}`,
                method: "PUT",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["BusinessCategory"],
        }),

        // DELETE: Remove category by ID
        deleteBusinessCategory: builder.mutation<void, number>({
            query: (id) => ({
                url: `business-categories/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["BusinessCategory"],
        }),
    }),
});

export const {
    useGetBusinessCategoriesQuery,
    useCreateBusinessCategoryMutation,
    useUpdateBusinessCategoryMutation,
    useDeleteBusinessCategoryMutation,
} = businesscategoryApi;

export default businesscategoryApi;

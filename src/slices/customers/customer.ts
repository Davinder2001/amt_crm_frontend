import customerCreateApiSlice from "./customerCreateSlice";

const customerApi = customerCreateApiSlice.injectEndpoints({
    endpoints: (builder) => ({

        fetchAllCustomers: builder.query<void, void>({
            query: () => ({
                url: "customers",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Customer"],
        }),

    }),
});

export const {
    useFetchAllCustomersQuery,
} = customerApi;

export default customerApi;

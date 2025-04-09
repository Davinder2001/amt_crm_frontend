import customerCreateApiSlice from "./customerCreateSlice";

const customerApi = customerCreateApiSlice.injectEndpoints({
    endpoints: (builder) => ({

        fetchAllCustomers: builder.query<CustomersResponse, void>({
            query: () => ({
                url: "customers",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Customer"],
        }),

        fetchCustomerById: builder.query<Customer, number>({
            query: (id) => `customers/${id}`,
            providesTags: ["Customer"],
        }),

    }),
});

export const {
    useFetchAllCustomersQuery,
    useFetchCustomerByIdQuery,
} = customerApi;

export default customerApi;

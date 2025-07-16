// expensesApi.ts
import expensesCreateApiSlice from "./expensesCreateSlice";

const expensesApi = expensesCreateApiSlice.injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
        // Fetch all expenses
        fetchExpenses: builder.query<ExpenseResponse, { page?: number; per_page?: number }>({
            query: (params) => ({
                url: "expenses",
                params: {
                    page: params.page,
                    per_page: params.per_page
                }
            }),
            providesTags: ["Expenses"],
        }),

        // Fetch single expense
        fetchExpense: builder.query<Expense, number>({
            query: (id) => `expenses/${id}`,
            providesTags: (result, error, id) => [{ type: 'Expenses', id }],
        }),

        // Create expense
        createExpense: builder.mutation<Expense, { formdata: FormData }>({
            query: ({ formdata }) => {
                return {
                    url: 'expenses/store',
                    method: 'POST',
                    body: formdata,
                };
            },
            invalidatesTags: ["Expenses"],
        }),

        // Update expense
        updateExpense: builder.mutation<Expense, { id: number, formdata: FormData }>({
            query: ({ id, formdata }) => {
                return {
                    url: `expenses/${id}/update`,
                    method: 'POST',
                    body: formdata,
                };
            },
            invalidatesTags: (result, error, { id }) => [
                { type: 'Expenses', id },
                { type: 'Expenses' }
            ],
        }),

        // Delete expense
        deleteExpense: builder.mutation<void, number>({
            query: (id) => ({
                url: `expenses/${id}/delete`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Expenses"],
        }),
    }),
});

export const {
    useFetchExpensesQuery,
    useFetchExpenseQuery,
    useCreateExpenseMutation,
    useUpdateExpenseMutation,
    useDeleteExpenseMutation,
} = expensesApi;

export default expensesApi;
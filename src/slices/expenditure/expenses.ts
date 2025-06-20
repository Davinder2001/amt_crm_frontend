// expensesApi.ts
import expensesCreateApiSlice from "./expensesCreateSlice";

const expensesApi = expensesCreateApiSlice.injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
        // Fetch all expenses
        fetchExpenses: builder.query<Expense[], void>({
            query: () => "expenses",
            providesTags: ["Expenses"],
        }),

        // Fetch single expense
        fetchExpense: builder.query<Expense, number>({
            query: (id) => `expenses/${id}`,
            providesTags: (result, error, id) => [{ type: 'Expenses', id }],
        }),

        // Create expense
        createExpense: builder.mutation<Expense, ExpenseCreateRequest>({
            query: (body) => {
                const formData = new FormData();
                formData.append('heading', body.heading);
                if (body.description) formData.append('description', body.description);
                formData.append('price', body.price.toString());
                formData.append('file', body.file);

                return {
                    url: 'expenses/store',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ["Expenses"],
        }),

        // Update expense
        updateExpense: builder.mutation<Expense, { id: number, data: ExpenseUpdateRequest }>({
            query: ({ id, data }) => {
                const formData = new FormData();
                formData.append('heading', data.heading);
                if (data.description) formData.append('description', data.description);
                formData.append('price', data.price.toString());
                if (data.file) formData.append('file', data.file);
                formData.append('_method', 'PUT');

                return {
                    url: `expenses/${id}`,
                    method: 'POST', // Using POST with _method=PUT for Laravel
                    body: formData,
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
                url: `expenses/${id}`,
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
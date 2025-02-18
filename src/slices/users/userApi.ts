 // Import the API slice from your store/apiSlice.js

import userCreateApiSlice from "./userCreateSlice";

const userCreateApi = userCreateApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login', // relative to the base URL (http://localhost:8000/api/)
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: credentials, // Pass user credentials to the request body
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout', // relative to the base URL (http://localhost:8000/api/)
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
  overrideExisting: false, // Ensures no conflict with existing endpoints
});

export const { useLoginMutation, useLogoutMutation } = userCreateApi;

// Export the API reducer for integration into the Redux store
export default userCreateApi;

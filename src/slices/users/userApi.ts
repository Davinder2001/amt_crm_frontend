import userCreateApiSlice from "./userCreateSlice";


const userCreateApi = userCreateApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchUsers: builder.query({
      query: () => 'api/users',
      providesTags: ['Auth'],
    }),

      

    login: builder.mutation({
      query: (credentials) => ({
        url: 'api/login',  
        method: 'POST',
        body: credentials,  
        credentials: 'include'
      }),
      invalidatesTags: ['Auth'],
    }),

    

    logout: builder.mutation({
      query: () => ({
        url: 'api/logout',  
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
       
    }),
     
  }),
  
});

export const { useFetchUsersQuery, useLoginMutation, useLogoutMutation } = userCreateApi;

 
export default userCreateApi;

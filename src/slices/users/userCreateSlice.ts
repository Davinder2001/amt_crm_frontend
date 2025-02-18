// store/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

 
const userCreateApiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/' }), 
  tagTypes: ['Auth'],  
  endpoints: () => ({}),
});

export default userCreateApiSlice;

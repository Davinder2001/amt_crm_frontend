import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const employeCreateApiSlice = createApi({
  reducerPath: 'employeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem("authToken");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      
      return headers;
    },
  }),
  tagTypes: ['Employe'],
  endpoints: () => ({}),
});

export default employeCreateApiSlice;

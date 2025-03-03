import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const storeApiSlice = createApi({
  reducerPath: 'storeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      headers.set("Authorization", `Bearer ${token}`);

      return headers;
    },
  }),
  tagTypes: ['Store'],
  endpoints: () => ({}),
});

export default storeApiSlice;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const userCreateApiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {

      const token = localStorage.getItem("authToken");
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      headers.set("Authorization", `Bearer ${token}`);


      return headers;
    },
  }),
  tagTypes: ['Auth'],
  endpoints: () => ({}),
});

export default userCreateApiSlice;

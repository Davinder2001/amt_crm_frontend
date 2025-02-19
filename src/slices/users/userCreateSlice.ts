import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const userCreateApiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({

    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    credentials: 'include',

    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  
  tagTypes: ['Auth'],
  endpoints: () => ({}),
});

export default userCreateApiSlice;

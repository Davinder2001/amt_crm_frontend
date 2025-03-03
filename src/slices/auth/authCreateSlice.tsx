import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const userCreateApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers: Headers) => {
      // Extract the access_token from document.cookie
      const cookieString = document.cookie;
      const token = cookieString
        .split('; ')
        .find((row) => row.startsWith('access_token='))
        ?.split('=')[1] || null;

      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ['Auth'],
  endpoints: () => ({}),
});

export default userCreateApiSlice;

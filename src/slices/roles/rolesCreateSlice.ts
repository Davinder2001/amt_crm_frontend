import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const userCreateApiSlice = createApi({
  reducerPath: 'roleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers: Headers) => {
      const cookieString = document.cookie;
      const token = cookieString
        .split('; ')
        .find((row) => row.startsWith('access_token='))
        ?.split('=')[1] || null;

      // Set headers
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      headers.set('Authorization', `Bearer ${token}`);

      return headers;
    },
  }),
  tagTypes: ['Auth'],
  endpoints: () => ({}),
});

export default userCreateApiSlice;

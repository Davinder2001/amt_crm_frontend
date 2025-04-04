import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const catalogCreateApiSlice = createApi({
  reducerPath: 'catalogApiSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers: Headers) => {
      const cookies = document.cookie.split('; ').reduce((acc, current) => {
        const [key, value] = current.split('=');
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {} as Record<string, string>);

      const token = cookies['access_token'];

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ['Catalog'],
  endpoints: () => ({}),
});

export default catalogCreateApiSlice;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const attendanceCreateApiSlice = createApi({
  reducerPath: 'vendorApiSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers: Headers) => {
      const cookies = document.cookie.split('; ').reduce((acc, current) => {
        const [key, value] = current.split('=');
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {} as Record<string, string>);

      headers.set('Accept', 'application/json');
      
      const token = cookies['access_token'];

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ['Store'],
  endpoints: () => ({}),
});

export default attendanceCreateApiSlice;

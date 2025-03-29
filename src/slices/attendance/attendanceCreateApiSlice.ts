// src/slices/attendance/attendanceCreateApiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const attendanceCreateApiSlice = createApi({
  reducerPath: 'attendanceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { endpoint }) => {
      const cookies = document.cookie.split('; ').reduce((acc, current) => {
        const [key, value] = current.split('=');
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {} as Record<string, string>);

      const token = cookies['access_token'];

      headers.set('Accept', 'application/json');
      // Only set Content-Type for non-file endpoints.
      if (endpoint !== 'recordAttendance') {
        headers.set('Content-Type', 'application/json');
      }

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ['Attendance'],
  endpoints: () => ({}),
});

export default attendanceCreateApiSlice;

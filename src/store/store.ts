import { configureStore } from '@reduxjs/toolkit';
import authApiSlice from '@/slices/auth/authCreateSlice';
import userApiSlice from '@/slices/users/userCreateSlice';
import employeCreateApiSlice from '@/slices/employe/employeeCreateSlice';
import storeApiSlice from '@/slices/store/storeCreateSlice';
import vendorApiSlice from '@/slices/vendor/vendorCreateSlice';
import roleApiSlice from '@/slices/roles/rolesCreateSlice';
import permissionApiSlice from '@/slices/permissions/permissionCreateSlice';
import tasksApi from '@/slices/tasks/taskApiCreateSlice';
import attendanceApiSlice from '@/slices/attendance/attendance';
import companyApiSlice from '@/slices/superadminSlices/company/companyCreateSlice';

const store = configureStore({
  reducer: {
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [employeCreateApiSlice.reducerPath]: employeCreateApiSlice.reducer,
    [storeApiSlice.reducerPath]: storeApiSlice.reducer,
    [vendorApiSlice.reducerPath]: vendorApiSlice.reducer,
    [roleApiSlice.reducerPath]: roleApiSlice.reducer,
    [permissionApiSlice.reducerPath]: permissionApiSlice.reducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
    [attendanceApiSlice.reducerPath]: attendanceApiSlice.reducer,
    [companyApiSlice.reducerPath]: companyApiSlice.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApiSlice.middleware)
      .concat(userApiSlice.middleware)
      .concat(employeCreateApiSlice.middleware)
      .concat(storeApiSlice.middleware)
      .concat(vendorApiSlice.middleware)
      .concat(roleApiSlice.middleware)
      .concat(permissionApiSlice.middleware)
      .concat(tasksApi.middleware)
      .concat(attendanceApiSlice.middleware)
      .concat(companyApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

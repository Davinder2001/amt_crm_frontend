import { configureStore } from '@reduxjs/toolkit';
import authApiSlice from '@/slices/auth/authCreateSlice';
import userApiSlice from '@/slices/users/userCreateSlice';
import employeCreateApiSlice from '@/slices/employe/employeeCreateSlice';
import storeApiSlice from '@/slices/store/storeCreateSlice';
import roleApiSlice from '@/slices/roles/rolesCreateSlice'; 

const store = configureStore({
  reducer: {
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [employeCreateApiSlice.reducerPath]: employeCreateApiSlice.reducer,
    [storeApiSlice.reducerPath]: storeApiSlice.reducer,
    [roleApiSlice.reducerPath]: roleApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApiSlice.middleware)
      .concat(userApiSlice.middleware)
      .concat(employeCreateApiSlice.middleware)
      .concat(storeApiSlice.middleware)
      .concat(roleApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

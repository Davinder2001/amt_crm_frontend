import { configureStore } from '@reduxjs/toolkit';
import userCreateApiSlice from '@/slices/users/userCreateSlice';
import employeCreateApiSlice from '@/slices/employe/employeeCreateSlice'; 

const store = configureStore({
  reducer: {
    [userCreateApiSlice.reducerPath]: userCreateApiSlice.reducer,
    [employeCreateApiSlice.reducerPath]: employeCreateApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userCreateApiSlice.middleware)
      .concat(employeCreateApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

import userCreateApiSlice from '@/slices/users/userCreateSlice';
import { configureStore } from '@reduxjs/toolkit';
 
const store = configureStore({
  reducer: {

    [userCreateApiSlice.reducerPath]: userCreateApiSlice.reducer,
    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userCreateApiSlice.middleware),  
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

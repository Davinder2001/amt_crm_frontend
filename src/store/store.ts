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
import catalogCreateApiSlice from '@/slices/catalog/catalogCreateSlice';
import invoiceCreateApiSlice from '@/slices/invoices/invoiceCreateSlice';
import customerCreateApiSlice from '@/slices/customers/customerCreateSlice';
import companyCreateSlice from '@/slices/company/companyCreateSlice';
import adminManageApi from '@/slices/superadminSlices/adminManagement/adminManageApi';
import notificationApi from '@/slices/notifications/notificationsCreateSlice';
import chatApi from '@/slices/chat/chatCreateSlice';
import quotationApi from '@/slices/quotation/quotationCreateSlice';
import hrApi from '@/slices/hr/hrCreateSlice';
import packagesCreateApiSlice from '@/slices/superadminSlices/packages/packagesApi';
import businesscategoryCreateApiSlice from '@/slices/superadminSlices/businessCategory/businesscategoryApi';
import themeReducer from '@/slices/theme/themeSlice';
import billingCreateApiSlice from '@/slices/paymentsAndBillings/payBillCreate';


const store = configureStore({
  reducer: {
    theme: themeReducer,
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
    [catalogCreateApiSlice.reducerPath]: catalogCreateApiSlice.reducer,
    [invoiceCreateApiSlice.reducerPath]: invoiceCreateApiSlice.reducer,
    [customerCreateApiSlice.reducerPath]: customerCreateApiSlice.reducer,
    [companyCreateSlice.reducerPath]: companyCreateSlice.reducer,
    [adminManageApi.reducerPath]: adminManageApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [quotationApi.reducerPath]: quotationApi.reducer,
    [hrApi.reducerPath]: hrApi.reducer,
    [packagesCreateApiSlice.reducerPath]: packagesCreateApiSlice.reducer,
    [businesscategoryCreateApiSlice.reducerPath]: businesscategoryCreateApiSlice.reducer,
    [billingCreateApiSlice.reducerPath]: billingCreateApiSlice.reducer,
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
      .concat(companyApiSlice.middleware)
      .concat(catalogCreateApiSlice.middleware)
      .concat(invoiceCreateApiSlice.middleware)
      .concat(customerCreateApiSlice.middleware)
      .concat(companyCreateSlice.middleware)
      .concat(adminManageApi.middleware)
      .concat(notificationApi.middleware)
      .concat(chatApi.middleware)
      .concat(quotationApi.middleware)
      .concat(hrApi.middleware)
      .concat(packagesCreateApiSlice.middleware)
      .concat(businesscategoryCreateApiSlice.middleware)
      .concat(billingCreateApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

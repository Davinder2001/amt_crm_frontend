// utils/ApiDispatch.ts
import { AppDispatch } from '@/store/store'; // adjust path if needed

// Import all slices
import authApiSlice from '@/slices/auth/authCreateSlice';
import userApiSlice from '@/slices/users/userCreateSlice';
import employeCreateApiSlice from '@/slices/employe/employeeCreateSlice';
import storeApiSlice from '@/slices/store/storeCreateSlice';
import vendorApiSlice from '@/slices/vendor/vendorCreateSlice';
import roleApiSlice from '@/slices/roles/rolesCreateSlice';
import permissionApiSlice from '@/slices/permissions/permissionCreateSlice';
import tasksApi from '@/slices/tasks/taskApiCreateSlice';
import attendanceApiSlice from '@/slices/attendance/attendanceApi';
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

export const invalidateAllCompanyApis = (dispatch: AppDispatch) => {
    dispatch(authApiSlice.util.invalidateTags(['Auth']));
    dispatch(userApiSlice.util.invalidateTags(['Auth']));
    dispatch(employeCreateApiSlice.util.invalidateTags(['Employe']));
    dispatch(storeApiSlice.util.invalidateTags(['Store']));
    dispatch(vendorApiSlice.util.invalidateTags(['Vendor']));
    dispatch(roleApiSlice.util.invalidateTags(['Auth']));
    dispatch(permissionApiSlice.util.invalidateTags(['Auth']));
    dispatch(tasksApi.util.invalidateTags(['Task']));
    dispatch(attendanceApiSlice.util.invalidateTags(['Attendance']));
    dispatch(companyApiSlice.util.invalidateTags(['Company']));
    dispatch(catalogCreateApiSlice.util.invalidateTags(['Catalog']));
    dispatch(invoiceCreateApiSlice.util.invalidateTags(['Invoice']));
    dispatch(customerCreateApiSlice.util.invalidateTags(['Customer']));
    dispatch(companyCreateSlice.util.invalidateTags(['Company']));
    dispatch(adminManageApi.util.invalidateTags(['Admin']));
    dispatch(notificationApi.util.invalidateTags(['Notifications']));
    dispatch(chatApi.util.invalidateTags(['Chat']));
    dispatch(quotationApi.util.invalidateTags(['Qutation']));
    dispatch(hrApi.util.invalidateTags(['Hr']));
    dispatch(packagesCreateApiSlice.util.invalidateTags(['Package']));
    dispatch(businesscategoryCreateApiSlice.util.invalidateTags(['BusinessCategory']));
};

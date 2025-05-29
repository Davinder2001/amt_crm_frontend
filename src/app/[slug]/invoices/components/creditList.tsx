// 'use client';
// import React, { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useGetCreditUsersQuery } from '@/slices/invoices/invoice';
// import { useBreadcrumb } from '@/provider/BreadcrumbContext';

// const CreditList = () => {
//   const router = useRouter();
//   const { setTitle } = useBreadcrumb();

//   // Set page title once on mount
//   useEffect(() => {
//     setTitle('Credit Users');
//   }, [setTitle]);

//   const { data, isLoading, isError } = useGetCreditUsersQuery();

//   const handleView = (userId: number) => {
//     router.push(`credits/view/${userId}`);
//   };

//   const handlePay = (userId: number) => {
//     router.push(`credits/pay/${userId}`);
//   };

//   if (isLoading) return <p>Loading...</p>;
//   if (isError) return <p>Something went wrong.</p>;

//   return (
//     <div className="table-container">
//       <table className="table">
//         <thead className="thead">
//           <tr>
//             <th>#</th>
//             <th>Name</th>
//             <th>Phone</th>
//             <th>Total Invoices</th>
//             <th>Total Due (₹)</th>
//             <th>Paid (₹)</th>
//             <th>Outstanding (₹)</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody className="tbody">
//           {data?.data?.map((user, index) => (
//             <tr key={user.customer_id ?? index}>
//               <td>{index + 1}</td>
//               <td>{user.name}</td>
//               <td>{user.number}</td>
//               <td>{user.total_invoices}</td>
//               <td>{user.total_due}</td>
//               <td>{user.amount_paid}</td>
//               <td>{user.outstanding}</td>
//               <td>
//                 <button className="btn view-btn" onClick={() => handleView(user.customer_id)}>
//                   View
//                 </button>
//                 <button className="btn pay-btn" onClick={() => handlePay(user.customer_id)}>
//                   Pay
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CreditList;











'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { 
  useGetCreditUsersQuery, 
} from '@/slices/invoices/invoice';
import { useCompany } from "@/utils/Company";

import ResponsiveTable from '@/components/common/ResponsiveTable';
import TableToolbar from '@/components/common/TableToolbar';
import { FaEye, FaMoneyBill } from 'react-icons/fa';

const CreditList = () => {
  const router = useRouter();
  const { setTitle } = useBreadcrumb();
  const { data, isLoading, isError } = useGetCreditUsersQuery();
  const { companySlug } = useCompany();

  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  useEffect(() => {
    setTitle('Credit Users');
  }, [setTitle]);

  const users = Array.isArray(data?.data) ? data.data : [];

  useEffect(() => {
    if (users.length > 0) {
      setVisibleColumns([
        'name',
        'number',
        'total_invoices',
        'total_due',
        'amount_paid',
        'outstanding',
        'action'
      ]);
    }
  }, [users]);

  const handleView = (userId: number) => router.push(`credits/view/${userId}`);
  const handlePay = (userId: number) => router.push(`credits/pay/${userId}`);



  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };

  const columns = visibleColumns.map((key) => ({
    label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    render: (item: any) => {
      if (key === 'action') {
        return (
          <div className="flex space-x-2">
            <button
              className="btn view-btn"
              onClick={() => handleView(item.customer_id)}
              title="View"
            >
              <FaEye />
            </button>
            <button
              className="btn pay-btn"
              onClick={() => handlePay(item.customer_id)}
              title="Pay"
            >
              <FaMoneyBill />
            </button>
          </div>
        );
      }
      return item[key]?.toString() ?? '-';
    },
  }));

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong.</p>;

  return (
    <div className="credit-users-page">
      <TableToolbar
        filters={{}}
        onFilterChange={() => { }}
        columns={columns.map((col) => ({ label: col.label, key: col.label }))}
        visibleColumns={visibleColumns}
        onColumnToggle={(label) =>
          toggleColumn(
            label.toLowerCase().replace(/ /g, '_')
          )
        }
        actions={[]}
      />

      <ResponsiveTable
        data={users}
        columns={columns}
        onView={(id) => router.push(`/${companySlug}/invoices/credits/view/${id}`)}
      />
    </div>
  );
};

export default CreditList;
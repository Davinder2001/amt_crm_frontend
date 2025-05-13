// 'use client'
// import React from 'react';
// import Link from 'next/link';
// import { useFetchVendorsQuery } from '@/slices/vendor/vendorApi';
// import { useCompany } from '@/utils/Company';
// import { FaArrowLeft, FaEye } from 'react-icons/fa';

// const Page: React.FC = () => {
//   const { data: vendors, error, isLoading } = useFetchVendorsQuery();
//   const { companySlug } = useCompany();

//   return (
//     <>
//       <Link href={`/${companySlug}/store`} className='back-button'><FaArrowLeft size={20} color='#fff' /></Link>
//       <div>
//         {isLoading ? (
//           <p>Loading vendors...</p>
//         ) : error ? (
//           <p>Error fetching vendors.</p>
//         ) : vendors && vendors.length > 0 ? (
//           <table border={1} cellPadding={8} cellSpacing={0}>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Vendor Name</th>
//                 <th>Created At</th>
//                 <th>Updated At</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {vendors.map((vendor: Vendor) => (
//                 <tr key={vendor.id}>
//                   <td>{vendor.id}</td>
//                   <td>{vendor.vendor_name}</td>
//                   <td>{vendor.created_at}</td>
//                   <td>{vendor.updated_at}</td>
//                   <td>
//                     <Link href={`/${companySlug}/store/vendors/${vendor.id}`}>
//                       <span><FaEye color='#222' /></span>
//                     </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p>No vendors found.</p>
//         )}
//       </div>
//     </>
//   );
// };

// export default Page;











'use client';
import React from 'react';
import Link from 'next/link';
import { useFetchVendorsQuery } from '@/slices/vendor/vendorApi';
import { useCompany } from '@/utils/Company';
import { FaArrowLeft, FaEye } from 'react-icons/fa';
import ResponsiveTable from '@/components/common/ResponsiveTable';

const Page: React.FC = () => {
  const { data: vendors, error, isLoading } = useFetchVendorsQuery();
  const { companySlug } = useCompany();

  if (isLoading) return <p>Loading vendors...</p>;
  if (error) return <p>Error fetching vendors.</p>;
  if (!vendors || vendors.length === 0) return <p>No vendors found.</p>;

  const columns = [
    { label: 'ID', key: 'id' as keyof Vendor },
    { label: 'Vendor Name', key: 'vendor_name' as keyof Vendor },
    { label: 'Created At', key: 'created_at' as keyof Vendor },
    { label: 'Updated At', key: 'updated_at' as keyof Vendor },
    {
      label: 'Actions',
      render: (vendor: Vendor) => (
        <Link href={`/${companySlug}/store/vendors/${vendor.id}`}>
          <span>
            <FaEye color="#222" />
          </span>
        </Link>
      )
    }
  ];

  return (
    <>
      <Link href={`/${companySlug}/store`} className="back-button">
        <FaArrowLeft size={20} color="#fff" />
      </Link>
      <ResponsiveTable data={vendors} columns={columns} onDelete={(id: number) => {
        console.log('Delete attendance with ID:', id);
      }}
      onEdit={(id: number) => {
        console.log('Edit attendance with ID:', id);
      }}
      onView={(id: number) => {
        console.log('View attendance with ID:', id);
      }}/>
    </>
  );
};

export default Page;

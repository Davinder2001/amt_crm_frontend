// 'use client'
// import React, { useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { useDeleteStoreItemMutation, useFetchStoreItemQuery } from '@/slices/store/storeApi';
// import Image from 'next/image';
// import ConfirmDialog from '@/components/common/ConfirmDialog';
// import { useCompany } from '@/utils/Company';
// import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';

// const ViewItem = () => {
//   const { id } = useParams();
//   const { data: item, error, isLoading } = useFetchStoreItemQuery(Number(id));
//   const [deleteStoreItem] = useDeleteStoreItemMutation();
//   console.log('images', item?.images);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const router = useRouter();
//   const { companySlug } = useCompany();

//   // fetch the selected company info
//   const { data: selectedCompany } = useFetchSelectedCompanyQuery();
//   const companyName = selectedCompany?.selected_company?.company_name ?? '';

//   const handleDelete = async () => {
//     try {
//       await deleteStoreItem(Number(id)).unwrap();
//       setShowConfirm(false);
//       router.push(`/${companySlug}/store`);
//     } catch (err) {
//       console.error('Error deleting item:', err);
//     }
//   };

//   if (isLoading) return <p>Loading item...</p>;
//   if (error) return <p>Error loading item.</p>;
//   if (!item) return <p>Item not found.</p>;

//   return (
//     <div className="view-item-container">
//       <div className="view-inner-item-container">
//         <div className='view-item-header'>
//           {companyName}
//         </div>

//         <div className="view-item-inner-container">
//           <p><strong>Item Code:</strong> {item.item_code}</p>
//           <p><strong>Name:</strong> {item.name}</p>
//           <p><strong>Quantity Count:</strong> {item.quantity_count}</p>
//           <p><strong>Availability Stock:</strong> {item.availability_stock}</p>
//           <p><strong>Measurement:</strong> {item.measurement || '-'}</p>
//           <p><strong>Purchase Date:</strong> {item.purchase_date || '-'}</p>
//           <p><strong>Date of Manufacture:</strong> {item.date_of_manufacture || '-'}</p>
//           <p><strong>Date of Expiry:</strong> {item.date_of_expiry || '-'}</p>
//           <p><strong>Brand Name:</strong> {item.brand_name || '-'}</p>
//           <p><strong>Replacement:</strong> {item.replacement || '-'}</p>
//           <p><strong>Categories:</strong>
//             {item.categories?.length
//               ? item.categories.map(category => category.name).join(', ')
//               : '-'}
//           </p>
//           <p><strong>Tax: </strong>
//             {item.taxes?.[0]?.name || '-'}
//             {item.taxes?.[0]?.rate ? ` - ${item.taxes[0].rate}%` : ''}
//           </p>
//           <p><strong>Vendor Name:</strong> {item.vendor_name || '-'}</p>
//           <p><strong>Cost Price:</strong> {item.cost_price || '-'}</p>
//           <p><strong>Selling Price:</strong> {item.selling_price || '-'}</p>
//           <p><strong>Catalog:</strong> {item.catalog ? 'Yes' : 'No'}</p>
//           <p><strong>Online Visibility:</strong> {item.online_visibility ? 'Yes' : 'No'}</p>
//         </div>

//         {Array.isArray(item.images) && item.images.length > 0 && (
//           <div>
//             <h2 className="text-lg font-semibold mt-4 mb-2">Images</h2>
//             <div className="flex flex-wrap gap-3">
//               {item.images.map((img: File | string, index: number) => {
//                 const imgSrc = typeof img === 'string' ? img : URL.createObjectURL(img);
//                 return (
//                   <Image
//                     key={index}
//                     src={imgSrc}
//                     alt={`Item image ${index + 1}`}
//                     className="single-item-images w-32 h-32 object-cover rounded border"
//                     width={100}
//                     height={100}
//                   />
//                 );
//               })}
//             </div>
//           </div>

//         )}

//         <div className="buttons-container viev-item-buttons-container">
//           <Link href={`/${companySlug}/store/edit-item/${item.id}`}>
//             <button className="buttons" >
//               Edit Item
//             </button>
//           </Link>
//           <button
//             onClick={() => setShowConfirm(true)}
//             className=" buttons"
//           >
//             Delete Item
//           </button>
//         </div>
//         <ConfirmDialog
//           isOpen={showConfirm}
//           message="Are you sure you want to delete this item? This action cannot be undone."
//           onConfirm={handleDelete}
//           onCancel={() => setShowConfirm(false)}
//         />
//       </div>
//     </div>
//   );
// };

// export default ViewItem;




'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDeleteStoreItemMutation, useFetchStoreItemQuery } from '@/slices/store/storeApi';
import Image from 'next/image';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useCompany } from '@/utils/Company';
// import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import { FaArrowLeft, FaEdit, FaInfoCircle, FaMoneyBillWave, FaTags, FaTrash } from 'react-icons/fa';
import { BsGearWideConnected } from 'react-icons/bs';

const ViewItem = () => {
  const { id } = useParams();
  const { data: item, error, isLoading } = useFetchStoreItemQuery(Number(id));
  const [deleteStoreItem] = useDeleteStoreItemMutation();
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const { companySlug } = useCompany();
  // const { data: selectedCompany } = useFetchSelectedCompanyQuery();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      await deleteStoreItem(Number(id)).unwrap();
      setShowConfirm(false);
      router.push(`/${companySlug}/store`);
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  if (isLoading) return <p>Loading item...</p>;
  if (error) return <p>Error loading item.</p>;
  if (!item) return <p>Item not found.</p>;

  const images = Array.isArray(item.images) ? item.images : [];

  return (
    <div className="view-item-container">
      <div className="item-container">
        <div className="item-header">
          <Link href={`/${companySlug}/store`} className='back-button'><FaArrowLeft size={20} color='#fff' /></Link>
          <div className="action-buttons">
            <Link href={`/${companySlug}/store/edit-item/${item.id}`}>
              <button className="edit-btn"><FaEdit />Edit</button>
            </Link>
            <button className="delete-btn" onClick={() => setShowConfirm(true)}><FaTrash />Delete</button>
          </div>
        </div>

        <div className={`info-grid-outer ${images.length === 0 ? 'full-width' : ''}`}>
          <div className="info-grid">
            <InfoCard icon={FaInfoCircle} title="Basic Info" className="info-card info-card-blue" data={[
              { label: 'Name', value: item.name },
              { label: 'Item code', value: item.item_code },
              { label: 'Quantity', value: item.quantity_count },
              { label: 'Stock', value: item.availability_stock },
              { label: 'Measurement', value: item.measurement || '-' },
              { label: 'Purchase Date', value: item.purchase_date || '-' }
            ]} />

            <InfoCard icon={BsGearWideConnected} title="Manufacturing Info" className="info-card info-card-green" data={[
              { label: 'Date of Manufacture', value: item.date_of_manufacture || '-' },
              { label: 'Expiry Date', value: item.date_of_expiry || '-', className: 'Expiry-date' },
              { label: 'Brand', value: item.brand_name || '-' },
              { label: 'Replacement', value: item.replacement || '-' }
            ]} />

            <InfoCard icon={FaMoneyBillWave} title="Pricing & Tax" className="info-card info-card-yellow" data={[
              { label: 'Cost Price', value: item.cost_price || '-' },
              { label: 'Selling Price', value: item.selling_price || '-' },
              { label: 'Tax', value: item.taxes?.[0]?.name ? `${item.taxes[0].name} - ${item.taxes[0].rate}%` : '-', className: item.taxes?.[0]?.rate ? 'text-rate' : '' }
            ]} />

            <InfoCard icon={FaTags} title="Category & Vendor" className="info-card info-card-purple" data={[
              { label: 'Categories', value: item.categories?.map(c => c.name).join(', ') || '-' },
              { label: 'Vendor', value: item.vendor_name || '-' },
              { label: 'Catalog', value: item.catalog ? 'Yes' : 'No' },
              { label: 'Online Visibility', value: item.online_visibility ? 'Yes' : 'No' }
            ]} />
          </div>

          {images.length > 0 && (
            <div>
              <div className="view-item-img-outer">
                {images.map((img: File | string, index: number) => {
                  const imgSrc = typeof img === 'string' ? img : URL.createObjectURL(img);
                  return (
                    <Image
                      key={index}
                      src={imgSrc}
                      alt={`Item image ${index + 1}`}
                      className="single-item-images w-32 h-32 object-cover rounded border cursor-pointer"
                      width={100}
                      height={100}
                      onClick={() => setSelectedImage(imgSrc)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {selectedImage && (
            <div className="image-modal" onClick={() => setSelectedImage(null)}>
              <img src={selectedImage} alt="Full preview" className="modal-image" />
            </div>
          )}
        </div>

        <ConfirmDialog
          isOpen={showConfirm}
          message="Are you sure you want to delete this item?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
    </div>
  );
};

const InfoCard = ({
  title,
  data,
  className = '',
  icon: Icon
}: {
  title: string;
  data: { label: string; value: any; className?: string }[];  // support className
  className?: string;
  icon?: React.ElementType;
}) => (
  <div className={`info-card ${className}`}>
    <h3 className="card-title">
      {Icon && <Icon className="card-icon" />}
      {title}
    </h3>
    <ul>
      {data.map((item, idx) => (
        <li key={idx}>
          <span className="label">{item.label}:</span>
          <span className={`value ${item.className || ''}`}>{item.value}</span>  {/* Apply custom class */}
        </li>
      ))}
    </ul>
  </div>
);

export default ViewItem;

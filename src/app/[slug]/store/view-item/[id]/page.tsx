'use client';
import React, { useState, useEffect, useRef } from 'react';
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


  const [showAllCategories, setShowAllCategories] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setShowAllCategories(false);
      }
    }; document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async () => {
    try {
      await deleteStoreItem(Number(id)).unwrap();
      setShowConfirm(false);
      router.push(`/${companySlug}/store`);
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };
  // Update the InfoCard props interface
  // interface InfoCardProps {
  //   title: string;
  //   data: {
  //     label: string;
  //     value: React.ReactNode;  // Changed from string|number
  //     className?: string
  //   }[];
  //   className?: string;
  //   icon?: React.ElementType;
  // }
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
              { label: 'New Stock Added', value: item.quantity_count },
              { label: 'Available Stock', value: item.availability_stock },
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
              // Replace the Categories line in your data array
              {
                label: 'Categories',
                value: (
                  <div className="categories-container" ref={categoriesRef}>
                    {item.categories?.slice(0, 2).map((c, index) => (
                      <span key={c.id || index}>
                        {c.name}
                        {index < 1 && item.categories.length > 2 && ', '}
                      </span>
                    ))}

                    {item.categories?.length > 2 && (
                      <>
                        {item.categories?.length > 2 && (
                          <button
                            type="button"
                            className="see-all-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAllCategories(!showAllCategories);
                            }}
                          >
                            {showAllCategories ? 'See less' : 'See all categories'}
                          </button>
                        )}

                        {showAllCategories && (
                          <div className="categories-dropdown">
                            {item.categories.map((c, index) => (
                              <div key={c.id || index} className="category-item">
                                {c.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                    {!item.categories?.length && '-'}
                  </div>
                )

              },
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
                      width={1000}
                      height={1000}
                      onClick={() => setSelectedImage(imgSrc)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {selectedImage && (
            <div className="image-modal" onClick={() => setSelectedImage(null)}>
              <Image
                src={selectedImage}
                alt="Full preview"
                className="modal-image"
                width={400} // set desired width
                height={300} // set desired height
                unoptimized // required if selectedImage is a Blob or data URL
              />
            </div>
          )}
        </div>

        <ConfirmDialog
          isOpen={showConfirm}
          message="Are you sure you want to delete this item?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
          type="delete"
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
  data: { label: string; value: React.ReactNode; className?: string }[];  // support React.ReactNode
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

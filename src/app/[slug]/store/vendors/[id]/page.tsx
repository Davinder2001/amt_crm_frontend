'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetchVendorByIdQuery, useDeleteVendorMutation } from '@/slices';
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useCompany } from '@/utils/Company';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import { FaTriangleExclamation } from 'react-icons/fa6';
import ResponsiveTable from '@/components/common/ResponsiveTable';

interface TableVendorItem extends VendorItem {
  id: number;
  date: string;
  vendorName: string;
  name: string;
}

type ResponsiveTableItem = TableVendorItem;

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const vendorId = Number(params?.id);
  const { companySlug } = useCompany();

  const { data: vendor, isLoading, error } = useFetchVendorByIdQuery(vendorId);
  const [deleteVendor] = useDeleteVendorMutation();
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showItems, setShowItems] = React.useState(false);

  const handleDelete = async () => {
    try {
      await deleteVendor(vendorId).unwrap();
      router.push(`/${companySlug}/store/vendors`);
    } catch (err) {
      alert('Failed to delete vendor.');
      console.error(err);
    }
  };

  // Transform vendor items data for ResponsiveTable
  const transformItemsData = (): ResponsiveTableItem[] => {
    if (!vendor?.items_by_date) return [];

    return Object.entries(vendor.items_by_date).flatMap(([date, vendorItems]) =>
      Object.entries(vendorItems).flatMap(([vendorName, items]) =>
        items.map(item => ({
          ...item,
          id: Number(item.batch_id), // Convert to number to match ResponsiveTable expectation
          date,
          vendorName,
          // Add name property to match ResponsiveTable expectation
          name: item.item_name
        }))
      )
    );
  };

  const itemsData = transformItemsData();

  const columns = [
    { label: 'Invoice No.', key: 'vendorName' as const },
    { label: 'Item Name', key: 'item_name' as const },
    { label: 'Date', key: 'date' as const },
    { label: 'Quantity', key: 'quantity' as const },
    { label: 'Price', key: 'regular_price' as const },
    { label: 'Batch ID', key: 'batch_id' as const },
  ];

  if (isLoading) return <LoadingState />;
  if (error)
    return (
      <EmptyState
        icon={<FaTriangleExclamation className='empty-state-icon' />}
        title="Failed to fetching vendor details."
        message="Something went wrong while fetching vendor details."
      />
    );
  if (!vendor) return <p className="empty-text">Vendor not found.</p>;

  return (
    <div className="vendor-details-outer">
      <div className="vendor-details-page">
        <div className="vendor-card">
          <div className="vendor-header">
            <h1 className="vendor-title"> Vendor Details </h1>
            <div className='view-vendor-action-button-outter'>
              <FaEdit onClick={() => router.push(`/${companySlug}/store/vendors/edit/${vendor.id}`)} className='edit-button'/>
              <FaTrash onClick={() => setShowConfirm(true)} className='delete-button'/>
            </div>
          </div>

          <div className="vendor-info">
            <p><strong>ID:</strong> {vendor.id}</p>
            <p><strong>Name:</strong> {vendor.name}</p>
            <p><strong>Email:</strong> {vendor.email}</p>
            <p><strong>Number:</strong> {vendor.number}</p>
            <p><strong>Address:</strong> {vendor.address}</p>
          </div>

          {vendor.items_by_date && (
            <div className="vendor-items-section">
              <span
                className="toggle-items-btn"
                onClick={() => setShowItems(!showItems)}
              >
                {showItems ? (
                  <>
                    <FaChevronUp /> Hide Items Summary
                  </>
                ) : (
                  <>
                    <FaChevronDown /> Show Items Summary
                  </>
                )}
              </span>

              {showItems && (
                <div className="vendor-items-summary">
                  <ResponsiveTable<ResponsiveTableItem>
                    data={itemsData}
                    columns={columns}
                    cardView={(item) => (
                      <>
                        <div className="card-row">
                          <h5>{item.item_name}</h5>
                          <p>{item.vendorName}</p>
                        </div>
                        <div className="card-row">
                          <p> {item.date}</p>
                          <p> {item.quantity}</p>
                        </div>
                        <div className="card-row">
                          <p> {item.regular_price}</p>
                          <p> {item.batch_id}</p>
                        </div>
                      </>
                    )}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div >

      <ConfirmDialog
        isOpen={showConfirm}
        message="Are you sure you want to delete this vendor?"
        onConfirm={() => {
          handleDelete();
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
        type="delete"
      />
    </div >
  );
};

export default Page;
import React from 'react';
import { useFetchCatalogItemsQuery } from '@/slices/catalog/catalogApi';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';

const ItemList = () => {
  const { data: items = [], isLoading, error } = useFetchCatalogItemsQuery();

  if (isLoading) return <LoadingState/>;
 if (error) {
    return (
      <EmptyState
        icon="alert"
        title="Failed to load catalog items."
        message="Something went wrong while fetching your working catalog items."
      />
    );
  }
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Catalog Items</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="w-full border text-left text-sm">
          <thead className="bg-teal-700 text-white">
            <tr>
              <th className="p-2">Sr No.</th>
              <th className="p-2">Name</th>
              <th className="p-2">Measurement</th>
              <th className="p-2">Brand Name</th>
              <th className="p-2">Replacement</th>
              <th className="p-2">Category</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{item.name}</td>
                <td className="p-2">{typeof item.measurement === 'string' ? item.measurement : item.measurement ? String(item.measurement) : '—'}</td>
                <td className="p-2">{item.brand_name}</td>
                <td className="p-2">{item.replacement || '—'}</td>
                <td className="p-2">{item.category || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemList;

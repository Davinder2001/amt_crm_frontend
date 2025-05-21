// 'use client';
// import React from 'react';
// import { useFetchPackagesQuery } from '@/slices/superadminSlices/packages/packagesApi';
// import Loader from '@/components/common/Loader';
// import { useRouter } from 'next/navigation';
// import { FaPlus } from 'react-icons/fa';

// const PackagesView = () => {
//   const { data, error, isLoading } = useFetchPackagesQuery();
//   const router = useRouter();

//   if (isLoading) return <Loader />;
//   if (error) return <div className="error-message">Error loading packages.</div>;

//   return (
//     <div className="superadmin-packages-container">
//       <div className="header">
//         <h2>Pick Your Perfect Plan</h2>
//         <button onClick={() => router.push('/superadmin/packages/create')} className='buttons'>
//           <FaPlus /> Create New Package
//         </button>
//       </div>

//       <div className="packages-grid">
//         {Array.isArray(data) && data.length > 0 ?
//           (data.map((plan) => {
//             return <div key={plan.id} className="package-card">
//               <div className="ribbon">1 Year</div>
//               <h3 className="planPrice">₹ {plan.price ?? 0} / Year</h3>
//               <ul className="features">
//                 <li>👥 {plan.employee_numbers} Employees</li>
//                 <li>📦 {plan.items_number} Items</li>
//                 <li>📋 {plan.daily_tasks_number} Tasks/day</li>
//                 <li>🧾 {plan.invoices_number} Invoices</li>
//               </ul>
//               {plan.business_categories?.length > 0 && (
//                 <div className="categories">
//                   <h4>Business Categories</h4>
//                   <ul>
//                     {plan.business_categories.map((category) => (
//                       <li key={category.id}>{category.name}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           })) : (
//             <div className="no-packages-message">
//               <div className="empty-box-icon">📦</div>
//               <h3>No packages available</h3>
//               <p>We couldn't find any packages for this category.</p>
//               <div className="suggestions">
//                 <p>Try selecting a different category or check back later!</p>
//                 <div className="wave-hand">👋</div>
//               </div>
//             </div>
//           )}

//       </div>
//     </div>
//   );
// };

// export default PackagesView;











// 'use client';
// import { useState } from 'react';
// import { useFetchPackagesQuery, useUpdatePackageMutation } from '@/slices/superadminSlices/packages/packagesApi';
// import Loader from '@/components/common/Loader';
// import { useRouter } from 'next/navigation';
// import { FaChevronDown, FaPlus } from 'react-icons/fa';

// const PackagesView = () => {
//   const { data, error, isLoading } = useFetchPackagesQuery();
//   const router = useRouter();
//   const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);

//   const [editId, setEditId] = useState<number | null>(null);
//   const [editableFields] = useState({
//     employee_numbers: '',
//     items_number: '',
//     daily_tasks_number: '',
//     invoices_number: ''
//   });
//   const [updatePackage] = useUpdatePackageMutation();

//   const handleSave = async (plan: PackagePlan) => {
//     await updatePackage({
//       id: plan.id,
//       data: {
//         ...plan,
//         ...editableFields,
//         employee_numbers: +editableFields.employee_numbers,
//         items_number: +editableFields.items_number,
//         daily_tasks_number: +editableFields.daily_tasks_number,
//         invoices_number: +editableFields.invoices_number,
//       }
//     });
//     setEditId(null);
//   };

//   if (isLoading) return <Loader />;
//   if (error) return <div className="error-message">Error loading packages.</div>;

//   return (
//     <div className="superadmin-packages-container">
//       <div className="header">
//         <button onClick={() => router.push('/superadmin/packages/create')} className='buttons'>
//           <FaPlus /> Create New Package
//         </button>
//       </div>

//       <div className="packages-grid">
//         {Array.isArray(data) && data.length > 0 ?
//           (
//             data.map((plan) => {


//               const handleContentEdit = (
//                 e: React.FormEvent<HTMLSpanElement>,
//                 field: string,
//                 plan: any
//               ) => {
//                 const value = (e.target as HTMLSpanElement).innerText;
//                 updatePackage({
//                   id: plan.id,
//                   data: {
//                     ...plan,
//                     [field]: +value,
//                   },
//                 });
//               };

//               return (
//                 <div key={plan.id} className="package-card">
//                   <div className="ribbon">1 Year</div>
//                   <h3 className="planPrice">
//                     ₹{' '}
//                     <span
//                       contentEditable
//                       suppressContentEditableWarning
//                       onBlur={(e) => handleContentEdit(e, 'price', plan)}
//                       onKeyDown={(e) => {
//                         if (e.key === 'Enter') {
//                           e.preventDefault();
//                           (e.target as HTMLElement).blur();
//                         }
//                       }}
//                     >
//                       {plan.price ?? 0}
//                     </span>{' '}
//                     / Year
//                   </h3>

//                   <ul className="features">
//                     <li>
//                       👥{' '}
//                       <span
//                         contentEditable
//                         suppressContentEditableWarning
//                         onBlur={(e) => handleContentEdit(e, 'employee_numbers', plan)}
//                         onKeyDown={(e) => {
//                           if (e.key === 'Enter') {
//                             e.preventDefault();
//                             (e.target as HTMLElement).blur();
//                           }
//                         }}
//                       >
//                         {plan.employee_numbers}
//                       </span>{' '}
//                       Employees
//                     </li>
//                     <li>
//                       📦{' '}
//                       <span
//                         contentEditable
//                         suppressContentEditableWarning
//                         onBlur={(e) => handleContentEdit(e, 'items_number', plan)}
//                         onKeyDown={(e) => {
//                           if (e.key === 'Enter') {
//                             e.preventDefault();
//                             (e.target as HTMLElement).blur();
//                           }
//                         }}
//                       >
//                         {plan.items_number}
//                       </span>{' '}
//                       Items
//                     </li>
//                     <li>
//                       📋{' '}
//                       <span
//                         contentEditable
//                         suppressContentEditableWarning
//                         onBlur={(e) => handleContentEdit(e, 'daily_tasks_number', plan)}
//                         onKeyDown={(e) => {
//                           if (e.key === 'Enter') {
//                             e.preventDefault();
//                             (e.target as HTMLElement).blur();
//                           }
//                         }}
//                       >
//                         {plan.daily_tasks_number}
//                       </span>{' '}
//                       Tasks/day
//                     </li>
//                     <li>
//                       🧾{' '}
//                       <span
//                         contentEditable
//                         suppressContentEditableWarning
//                         onBlur={(e) => handleContentEdit(e, 'invoices_number', plan)}
//                         onKeyDown={(e) => {
//                           if (e.key === 'Enter') {
//                             e.preventDefault();
//                             (e.target as HTMLElement).blur();
//                           }
//                         }}
//                       >
//                         {plan.invoices_number}
//                       </span>{' '}
//                       Invoices
//                     </li>
//                   </ul>

//                   {plan.business_categories?.length > 0 && (
//                     <div className="categories">
//                       <div
//                         className="categories-header"
//                         onClick={() =>
//                           setOpenCategoryId(openCategoryId === plan.id ? null : plan.id)
//                         }
//                       >
//                         <span className='business-categories-count-outer' ><span className='business-categories-count'>{plan.business_categories.length}</span> Categories</span>
//                         <span className={`dropdown-icon ${openCategoryId === plan.id ? 'open' : ''}`}>
//                           <FaChevronDown />
//                         </span>
//                       </div>

//                       {openCategoryId === plan.id && (
//                         <ul className="category-list">
//                           {plan.business_categories.map((category) => {
//                             const isChecked = plan.business_categories.some((c) => c.id === category.id);

//                             const toggleCategory = async () => {
//                               const updatedCategories = isChecked
//                                 ? plan.business_categories.filter((c) => c.id !== category.id)
//                                 : [...plan.business_categories, category];

//                               await updatePackage({
//                                 id: plan.id,
//                                 data: {
//                                   ...plan,
//                                   business_categories: updatedCategories,
//                                 },
//                               });
//                             };

//                             return (
//                               <li key={category.id}>
//                                 <label>
//                                   <div className="checkbox-container">
//                                     <input
//                                       type="checkbox"
//                                       checked={isChecked}
//                                       onChange={toggleCategory}
//                                     />
//                                     <span className="custom-checkmark"></span>
//                                   </div>
//                                   {category.name}
//                                 </label>
//                               </li>
//                             );
//                           })}
//                         </ul>
//                       )}
//                     </div>
//                   )}

//                 </div>
//               );
//             })
//           ) : (
//             <div className="no-packages-message">
//               <div className="empty-box-icon">📦</div>
//               <h3>No packages available</h3>
//               <p>We couldn&apos;t find any packages for this category.</p>
//               <div className="suggestions">
//                 <p>Try selecting a different category or check back later!</p>
//                 <div className="wave-hand">👋</div>
//               </div>
//             </div>
//           )}
//       </div>
//     </div>
//   );
// };

// export default PackagesView;









'use client';
import { useState, useRef, useEffect } from 'react';
import { useFetchPackagesQuery } from '@/slices/superadminSlices/packages/packagesApi';
import Loader from '@/components/common/Loader';
import { useRouter } from 'next/navigation';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import { FaChevronDown, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const PackagesView = () => {
  const { data, error, isLoading } = useFetchPackagesQuery();
  // const [deletepackage] = useDeletePackageMutation();
  const router = useRouter();
  const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);
  const categoriesCellRef = useRef<HTMLDivElement | null>(null);
  // Updated toggle handler with ref capture
  const handleToggle = (event: React.MouseEvent, planId: number) => {
    const newId = openCategoryId === planId ? null : planId;
    setOpenCategoryId(newId);
    if (newId) {
      categoriesCellRef.current = (event.currentTarget as HTMLElement).closest('.categories-cell');
    }
  };


  // Add this effect right after your other useEffect hooks
  // Example state for form data (adjust fields as needed)
  const [formData, setFormData] = useState<{ name: string; package_type: string }>({ name: '', package_type: 'yearly' });

  useEffect(() => {
    // Only modify name if package type changes and name exists
    if (formData.name.trim()) {
      const typeText = formData.package_type === 'monthly' ? 'Monthly' : 'Yearly';
      const suffix = `(${typeText})`;

      // Check if name already has a type suffix
      const hasExistingSuffix = /\(\s*(Monthly|Yearly)\s*\)$/.test(formData.name);

      setFormData(prev => ({
        ...prev,
        name: hasExistingSuffix
          ? prev.name.replace(/\(\s*(Monthly|Yearly)\s*\)$/, suffix)
          : `${prev.name} ${suffix}`
      }));
    }
  }, [formData.package_type]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openCategoryId !== null &&
        categoriesCellRef.current &&
        !categoriesCellRef.current.contains(event.target as Node)
      ) {
        setOpenCategoryId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openCategoryId]);
  const columns = [
    {
      label: 'Package Name',
      key: 'name' as keyof PackagePlan,
      render: (plan: PackagePlan) => <span className='package-name'>{plan.name}</span>
    },
    {
      label: 'Price',
      key: 'price' as keyof PackagePlan,
      render: (plan: PackagePlan) => (
        <span>{Math.floor(Number(plan.price))}</span>
      )
    },

    {
      label: 'Package Type',
      key: 'package_type' as keyof PackagePlan,
      render: (plan: PackagePlan) => (
        <span className="Package-type ">{plan.package_type}</span>
      )
    },
    {
      label: 'Employees',
      key: 'employee_numbers' as keyof PackagePlan,
      render: (plan: PackagePlan) => <span>{plan.employee_numbers}</span>
    },
    {
      label: 'Inventory Items',
      key: 'items_number' as keyof PackagePlan,
      render: (plan: PackagePlan) => <span>{plan.items_number}</span>
    },
    {
      label: 'Daily Tasks',
      key: 'daily_tasks_number' as keyof PackagePlan,
      render: (plan: PackagePlan) => <span>{plan.daily_tasks_number}</span>
    },
    {
      label: 'Invoices',
      key: 'invoices_number' as keyof PackagePlan,
      render: (plan: PackagePlan) => <span>{plan.invoices_number}</span>
    },
    {
      label: 'Applicable Categories',
      key: 'business_categories' as keyof PackagePlan,
      render: (plan: PackagePlan) => (
        <div className="categories-cell">
          <div
            className="categories-toggle"
            onClick={(e) => plan.id !== undefined && handleToggle(e, plan.id)}
          >
            <span className='categories-show'>
              <span>{plan.business_categories.length}</span>
              Categor{plan.business_categories.length === 1 ? 'y' : 'ies'}
            </span>
            <FaChevronDown className={`toggle-icon ${openCategoryId === plan.id ? 'open' : ''}`} />
          </div>

          {openCategoryId === plan.id && (
            <div className="category-dropdown">
              {plan.business_categories.map((category) => (
                <div key={category.id} className="category-item">
                  <label>
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      label: 'Actions',
      key: undefined,
      render: (plan: PackagePlan) => (
        <div className="package-action-buttons">
          <span onClick={() => router.push(`/superadmin/packages/edit/${plan.id}`)} title="Edit" className='package-edit-icon' >
            <FaEdit />
          </span>
          <span title="Delete" className='package-delete-icon'>
            <FaTrash />
          </span>
        </div>
      )
    }
  ];


  if (isLoading) return <Loader />;
  if (error) return <div className="error-message">Error loading packages.</div>;

  return (
    <div className="superadmin-packages-container">
      <div className="header">
        <button onClick={() => router.push('/superadmin/packages/create')} className='buttons'>
          <FaPlus /> Create New Package
        </button>
      </div>

      <ResponsiveTable
        data={Array.isArray(data) ? data.filter((plan): plan is PackagePlan & { id: number } => typeof plan.id === 'number') : []}
        columns={columns}
        onEdit={(id) => router.push(`/superadmin/packages/edit/${id}`)}
      />
    </div>
  );
};

export default PackagesView;
// 'use client';
// import React, { useState, useEffect, useRef } from 'react';
// import {
//     FiChevronDown,
//     FiCheck,
//     FiX,
//     FiUsers,
//     FiBox,
//     FiCheckCircle,
//     FiFileText,
// } from 'react-icons/fi';
// import { FaArrowLeft } from 'react-icons/fa';
// import {
//     useCreatePackageMutation,
//     useFetchSinglePackageQuery,
//     useUpdatePackageMutation
// } from '@/slices/superadminSlices/packages/packagesApi';
// import { useGetBusinessCategoriesQuery } from '@/slices/superadminSlices/businessCategory/businesscategoryApi';
// import { useRouter } from 'next/navigation';
// import { useClickOutside } from '@/components/common/useClickOutside';
// import LoadingState from '@/components/common/LoadingState';
// import { useFetchAdminsQuery } from '@/slices/superadminSlices/adminManagement/adminManageApi';

// interface PackageProps {
//     mode?: "add" | "edit";
//     packageId?: number;
// }

// const Package: React.FC<PackageProps> = ({ mode = 'add', packageId }) => {
//     const initialLimits = React.useMemo<PlanLimits>(() => ({
//         employee_numbers: 0,
//         items_number: 0,
//         daily_tasks_number: 0,
//         invoices_number: 0,
//     }), []);

//     const [formData, setFormData] = useState<PackagePlan>({
//         name: '',
//         package_type: '',
//         user_id: null,
//         monthly_price: 0,
//         annual_price: 0,
//         three_years_price: 0,
//         monthly_limits: { ...initialLimits },
//         annual_limits: { ...initialLimits },
//         three_years_limits: { ...initialLimits },
//         business_categories: [],
//     });
//     const { data: adminData } = useFetchAdminsQuery();
//     const admins = adminData?.admins || [];


//     const router = useRouter();
//     const dropdownRef = useRef<HTMLDivElement>(null);
//     useClickOutside(dropdownRef, () => setShowDropdown(false));

//     const [showDropdown, setShowDropdown] = useState(false);

//     const { data: categories } = useGetBusinessCategoriesQuery();
//     const [createPackage] = useCreatePackageMutation();
//     const [updatePackage] = useUpdatePackageMutation();
//     const { data: packageData, isLoading: isPackageLoading } = useFetchSinglePackageQuery(
//         packageId ? String(packageId) : "",
//         { skip: mode !== 'edit' || !packageId }
//     );

//     useEffect(() => {
//         if (mode === 'edit' && packageData) {
//             const limitsMap = {
//                 monthly: { ...initialLimits },
//                 annual: { ...initialLimits },
//                 three_years: { ...initialLimits },
//             };

//             if (packageData.limits) {
//                 packageData.limits.forEach(limit => {
//                     const { variant_type, ...rest } = limit;
//                     if (limitsMap[variant_type as keyof typeof limitsMap]) {
//                         limitsMap[variant_type as keyof typeof limitsMap] = {
//                             employee_numbers: rest.employee_numbers,
//                             items_number: rest.items_number,
//                             daily_tasks_number: rest.daily_tasks_number,
//                             invoices_number: rest.invoices_number,
//                         };
//                     }
//                 });
//             }

//             setFormData({
//                 name: packageData.name || '',
//                 package_type: packageData.package_type || '',
//                 user_id: packageData.user_id ?? null,
//                 monthly_price: Number(packageData.monthly_price) || 0,
//                 annual_price: Number(packageData.annual_price) || 0,
//                 three_years_price: Number(packageData.three_years_price) || 0,
//                 monthly_limits: limitsMap.monthly,
//                 annual_limits: limitsMap.annual,
//                 three_years_limits: limitsMap.three_years,
//                 business_categories: packageData.business_categories || [],
//             });
//         }
//     }, [packageData, mode, initialLimits]);


//     const clearCardData = (planType: 'monthly' | 'annual' | 'three_years') => {
//         setFormData(prev => {
//             // Create a new limits object with all values set to 0
//             const clearedLimits = Object.fromEntries(
//                 Object.keys(initialLimits).map(key => [key, 0])
//             ) as unknown as PlanLimits;

//             return {
//                 ...prev,
//                 [`${planType}_price`]: 0,
//                 [`${planType}_limits`]: clearedLimits,
//             };
//         });
//     };

//     const handleInputChange = (
//         e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//     ) => {
//         const { name, value } = e.target;

//         if (name === 'monthly_price' || name === 'annual_price' || name === 'three_years_price') {
//             const digitsOnly = value.replace(/\D/g, '').slice(0, 8);
//             setFormData(prev => ({
//                 ...prev,
//                 [name]: digitsOnly ? Number(digitsOnly) : 0,
//             }));
//             return;
//         }

//         const limitFieldPrefixes = ['monthly_limits.', 'annual_limits.', 'three_years_limits.'];
//         const isLimitField = limitFieldPrefixes.some(prefix => name.startsWith(prefix));

//         if (isLimitField) {
//             const [limitType, fieldName] = name.split('.');
//             const digitsOnly = value.replace(/\D/g, '').slice(0, 8);

//             setFormData(prev => ({
//                 ...prev,
//                 [limitType]: {
//                     ...((typeof prev[limitType as keyof PackagePlan] === 'object' && prev[limitType as keyof PackagePlan] !== null)
//                         ? (prev[limitType as keyof PackagePlan] as object)
//                         : {}),
//                     [fieldName]: digitsOnly ? Number(digitsOnly) : 0,
//                 },
//             }));
//         } else {
//             setFormData(prev => ({
//                 ...prev,
//                 [name]: value,
//             }));
//         }
//     };

//     const toggleCategory = (category: BusinessCategory) => {
//         const exists: boolean = formData.business_categories.some(c => c.id === category.id);
//         setFormData(prev => {
//             const updatedCategories = exists
//                 ? prev.business_categories.filter(c => c.id !== category.id)
//                 : [
//                     ...prev.business_categories,
//                     {
//                         ...category,
//                     },
//                 ];
//             const normalizedCategories = updatedCategories.map(c => ({
//                 ...c,
//             }));
//             return { ...prev, business_categories: normalizedCategories };
//         });
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         const formDataToSubmit = new FormData();

//         // Create a copy of formData without user_id if package_type is general
//         const payloadData = {
//             ...formData,
//             user_id: formData.package_type === 'specific' ? formData.user_id : null
//         };

//         Object.entries(payloadData).forEach(([key, value]) => {
//             if (key === 'business_categories') {
//                 (value as BusinessCategory[]).forEach(category => {
//                     formDataToSubmit.append('business_category_ids[]', category.id.toString());
//                 });
//             } else if (typeof value === 'object' && value !== null) {
//                 Object.entries(value).forEach(([subKey, subValue]) => {
//                     formDataToSubmit.append(`${key}[${subKey}]`, String(subValue));
//                 });
//             } else if (value !== null && value !== undefined) {
//                 formDataToSubmit.append(key, value.toString());
//             } else {
//                 formDataToSubmit.append(key, '');
//             }
//         });

//         try {
//             if (mode === 'edit' && packageId) {
//                 const { business_categories, ...rest } = payloadData;
//                 await updatePackage({
//                     id: packageId,
//                     fomdata: {
//                         ...rest,
//                         business_category_ids: business_categories.map(c => c.id),
//                     } as unknown as PackagePlan
//                 }).unwrap();
//                 router.back();
//             } else {
//                 await createPackage(formDataToSubmit).unwrap();
//                 alert('Package created successfully!');
//                 if (mode === 'add') {
//                     setFormData({
//                         name: '',
//                         package_type: '',
//                         user_id: null,
//                         monthly_price: 0,
//                         annual_price: 0,
//                         three_years_price: 0,
//                         monthly_limits: { ...initialLimits },
//                         annual_limits: { ...initialLimits },
//                         three_years_limits: { ...initialLimits },
//                         business_categories: [],
//                     });
//                 }
//             }
//         } catch (error) {
//             alert(`Error ${mode === 'edit' ? 'updating' : 'creating'} package`);
//             console.error('Error:', error);
//         }
//     };

//     if (mode === 'edit' && isPackageLoading) return <LoadingState />;

//     return (
//         <div>
//             <button className="back-button" onClick={() => router.back()}>
//                 <FaArrowLeft size={16} color="#fff" />
//             </button>
//             <div className="add-packages-conatiner">

//                 <form onSubmit={handleSubmit} className="form">
//                     <div className="form-section">
//                         <h2 className="section-title">Basic Information</h2>
//                         <div className='form-group-outer'>
//                             <div className="form-group">
//                                 <label className="form-label">Package Name <span className="required">*</span></label>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     value={formData.name}
//                                     onChange={handleInputChange}
//                                     placeholder="e.g., Premium Business Package"
//                                     className="form-input"
//                                     required
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <label className="form-label">Applicable Categories</label>
//                                 <div className="multi-select" ref={dropdownRef}>
//                                     <div className="dropdown-container">
//                                         <button
//                                             type="button"
//                                             onClick={() => setShowDropdown(!showDropdown)}
//                                             className="dropdown-toggle"
//                                         >
//                                             <span>Select categories</span>
//                                             <FiChevronDown className={`dropdown-icon ${showDropdown ? 'open' : ''}`} />
//                                         </button>
//                                         {showDropdown && (
//                                             <div className="dropdown-menu">
//                                                 {categories?.map(category => (
//                                                     <div
//                                                         key={category.id}
//                                                         className="dropdown-item"
//                                                         onClick={() => toggleCategory(category)}
//                                                     >
//                                                         <div className="checkbox-container">
//                                                             {formData.business_categories.some(c => c.id === category.id) ? (
//                                                                 <FiCheck className="checkbox checked" />
//                                                             ) : (
//                                                                 <div className="checkbox unchecked" />
//                                                             )}
//                                                         </div>
//                                                         <span>{category.name}</span>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </div>

//                                 </div>
//                             </div>
//                             <div className='form-group bc-group-span'>
//                                 <div className="selected-items">
//                                     {formData.business_categories.map(category => (
//                                         <span key={category.id} className="selected-item">
//                                             {category.name}
//                                             <button
//                                                 type="button"
//                                                 onClick={() => toggleCategory(category)}
//                                                 className="remove-item"
//                                             >
//                                                 <FiX size={14} />
//                                             </button>
//                                         </span>
//                                     ))}
//                                 </div>
//                             </div>
//                             <div className="form-group">
//                                 <label className="form-label">
//                                     Package Type <span className="required">*</span>
//                                 </label>
//                                 <select
//                                     className="form-input"
//                                     name="package_type"
//                                     value={formData.package_type}
//                                     onChange={(e) =>
//                                         setFormData((prev) => ({
//                                             ...prev,
//                                             package_type: e.target.value,
//                                             user_id: e.target.value === 'general' ? null : prev.user_id,
//                                         }))
//                                     }
//                                     required
//                                 >
//                                     <option value="">Select type</option>
//                                     <option value="general">General</option>
//                                     <option value="specific">Specific</option>
//                                 </select>
//                             </div>

//                             {/* Show admin dropdown only if specific is selected */}
//                             {formData.package_type === 'specific' && (
//                                 <div className="form-group">
//                                     <label className="form-label">
//                                         Select Admin <span className="required">*</span>
//                                     </label>
//                                     <select
//                                         className="form-input"
//                                         name="user_id"
//                                         value={formData.user_id || ''}
//                                         onChange={(e) =>
//                                             setFormData((prev) => ({
//                                                 ...prev,
//                                                 user_id: Number(e.target.value),
//                                             }))
//                                         }
//                                         required
//                                     >
//                                         <option value="">Choose an admin</option>
//                                         {admins?.map((admin) => (
//                                             <option key={admin.id} value={admin.id}>
//                                                 {admin.name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                             )}

//                         </div>
//                     </div>

//                     <div className="form-section">
//                         <h2 className="section-title">Package Pricing & Limits</h2>
//                         <div className="pricing-cards-container">
//                             {/* Monthly Card */}
//                             <div className="pricing-card">
//                                 <div className="card-header">
//                                     <h3>Monthly Plan</h3>
//                                     {(formData.monthly_price > 0 || Object.values(formData.monthly_limits).some(val => val > 0)) && (
//                                         <span
//                                             className="clear-card-btn"
//                                             onClick={() => clearCardData('monthly')}
//                                         >
//                                             Clear All
//                                         </span>
//                                     )}
//                                 </div>
//                                 <div className="card-body">
//                                     <div className="price-input-group">
//                                         <label>Price (₹)</label>
//                                         <input
//                                             type="number"
//                                             name="monthly_price"
//                                             value={formData.monthly_price || ''}
//                                             onChange={handleInputChange}
//                                             placeholder="0"
//                                             min="0"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="limit-input-group">
//                                         <label><FiUsers className="icon" /> Employees</label>
//                                         <input
//                                             type="number"
//                                             name="monthly_limits.employee_numbers"
//                                             value={formData.monthly_limits.employee_numbers || ''}
//                                             onChange={handleInputChange}
//                                             min="0"
//                                             placeholder="Max employees"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="limit-input-group">
//                                         <label><FiBox className="icon" /> Inventory Items</label>
//                                         <input
//                                             type="number"
//                                             name="monthly_limits.items_number"
//                                             value={formData.monthly_limits.items_number || ''}
//                                             onChange={handleInputChange}
//                                             min="0"
//                                             placeholder="Max items"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="limit-input-group">
//                                         <label><FiCheckCircle className="icon" /> Daily Tasks</label>
//                                         <input
//                                             type="number"
//                                             name="monthly_limits.daily_tasks_number"
//                                             value={formData.monthly_limits.daily_tasks_number || ''}
//                                             onChange={handleInputChange}
//                                             min="0"
//                                             placeholder="Max tasks"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="limit-input-group">
//                                         <label><FiFileText className="icon" /> Invoices</label>
//                                         <input
//                                             type="number"
//                                             name="monthly_limits.invoices_number"
//                                             value={formData.monthly_limits.invoices_number || ''}
//                                             onChange={handleInputChange}
//                                             min="0"
//                                             placeholder="Max invoices"
//                                             required
//                                         />
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Annual Card */}
//                             <div className="pricing-card">
//                                 <div className="card-header">
//                                     <h3>Annual Plan</h3>
//                                     {(formData.annual_price > 0 || Object.values(formData.annual_limits).some(val => val > 0)) && (
//                                         <span
//                                             className="clear-card-btn"
//                                             onClick={() => clearCardData('annual')}
//                                         >
//                                             Clear All
//                                         </span>
//                                     )}
//                                 </div>
//                                 <div className="card-body">
//                                     <div className="price-input-group">
//                                         <label>Price (₹)</label>
//                                         <input
//                                             type="number"
//                                             name="annual_price"
//                                             value={formData.annual_price || ''}
//                                             onChange={handleInputChange}
//                                             placeholder="0"
//                                             min="0"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="limit-input-group">
//                                         <label><FiUsers className="icon" /> Employees</label>
//                                         <input
//                                             type="number"
//                                             name="annual_limits.employee_numbers"
//                                             value={formData.annual_limits.employee_numbers || ''}
//                                             onChange={handleInputChange}
//                                             min="0"
//                                             placeholder="Max employees"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="limit-input-group">
//                                         <label><FiBox className="icon" /> Inventory Items</label>
//                                         <input
//                                             type="number"
//                                             name="annual_limits.items_number"
//                                             value={formData.annual_limits.items_number || ''}
//                                             onChange={handleInputChange}
//                                             min="0"
//                                             placeholder="Max items"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="limit-input-group">
//                                         <label><FiCheckCircle className="icon" /> Daily Tasks</label>
//                                         <input
//                                             type="number"
//                                             name="annual_limits.daily_tasks_number"
//                                             value={formData.annual_limits.daily_tasks_number || ''}
//                                             onChange={handleInputChange}
//                                             min="0"
//                                             placeholder="Max tasks"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="limit-input-group">
//                                         <label><FiFileText className="icon" /> Invoices</label>
//                                         <input
//                                             type="number"
//                                             name="annual_limits.invoices_number"
//                                             value={formData.annual_limits.invoices_number || ''}
//                                             onChange={handleInputChange}
//                                             min="0"
//                                             placeholder="Max invoices"
//                                             required
//                                         />
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* 3 Years Card */}
//                             <div className="pricing-card">
//                                 <div className="card-header">
//                                     <h3>3 Years Plan</h3>
//                                     {(formData.three_years_price > 0 || Object.values(formData.three_years_limits).some(val => val > 0)) && (
//                                         <span
//                                             className="clear-card-btn"
//                                             onClick={() => clearCardData('three_years')}
//                                         >
//                                             Clear All
//                                         </span>
//                                     )}
//                                 </div>
//                                 <div className="card-body">
//                                     <div className="price-input-group">
//                                         <label>Price (₹)</label>
//                                         <input
//                                             type="number"
//                                             name="three_years_price"
//                                             value={formData.three_years_price || ''}
//                                             onChange={handleInputChange}
//                                             placeholder="0"
//                                             min="0"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="limit-input-group">
//                                         <label><FiUsers className="icon" /> Employees</label>
//                                         <input
//                                             type="number"
//                                             name="three_years_limits.employee_numbers"
//                                             value={formData.three_years_limits.employee_numbers || ''}
//                                             onChange={handleInputChange}
//                                             min="0"
//                                             placeholder="Max employees"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="limit-input-group">
//                                         <label><FiBox className="icon" /> Inventory Items</label>
//                                         <input
//                                             type="number"
//                                             name="three_years_limits.items_number"
//                                             value={formData.three_years_limits.items_number || ''}
//                                             onChange={handleInputChange}
//                                             min="0"
//                                             placeholder="Max items"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="limit-input-group">
//                                         <label><FiCheckCircle className="icon" /> Daily Tasks</label>
//                                         <input
//                                             type="number"
//                                             name="three_years_limits.daily_tasks_number"
//                                             value={formData.three_years_limits.daily_tasks_number || ''}
//                                             onChange={handleInputChange}
//                                             min="0"
//                                             placeholder="Max tasks"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="limit-input-group">
//                                         <label><FiFileText className="icon" /> Invoices</label>
//                                         <input
//                                             type="number"
//                                             name="three_years_limits.invoices_number"
//                                             value={formData.three_years_limits.invoices_number || ''}
//                                             onChange={handleInputChange}
//                                             min="0"
//                                             placeholder="Max invoices"
//                                             required
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="package-action">
//                         <button
//                             type="submit"
//                             className="buttons"
//                         >
//                             {mode === 'edit' ? 'Update Package' : 'Create Package'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Package;












'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
    FiChevronDown,
    FiCheck,
    FiX,
    FiUsers,
    FiBox,
    FiCheckCircle,
    FiFileText,
    FiMessageSquare,
    FiClipboard,
    FiUser,
} from 'react-icons/fi';
import { FaArrowLeft } from 'react-icons/fa';
import {
    useCreatePackageMutation,
    useFetchSinglePackageQuery,
    useUpdatePackageMutation
} from '@/slices/superadminSlices/packages/packagesApi';
import { useGetBusinessCategoriesQuery } from '@/slices/superadminSlices/businessCategory/businesscategoryApi';
import { useRouter } from 'next/navigation';
import { useClickOutside } from '@/components/common/useClickOutside';
import LoadingState from '@/components/common/LoadingState';
import { useFetchAdminsQuery } from '@/slices/superadminSlices/adminManagement/adminManageApi';

interface PackageProps {
    mode?: "add" | "edit";
    packageId?: number;
}

const Package: React.FC<PackageProps> = ({ mode = 'add', packageId }) => {
    const initialLimits = React.useMemo<PlanLimits>(() => ({
        employee_numbers: 0,
        items_number: 0,
        daily_tasks_number: 0,
        invoices_number: 0,
        task: false,
        chat: false,
        hr: false,
    }), []);

    const [formData, setFormData] = useState<PackagePlan>({
        name: '',
        package_type: '',
        user_id: null,
        monthly_price: 0,
        annual_price: 0,
        three_years_price: 0,
        monthly_limits: { ...initialLimits },
        annual_limits: { ...initialLimits },
        three_years_limits: { ...initialLimits },
        business_categories: [],
    });
    const { data: adminData } = useFetchAdminsQuery();
    const admins = adminData?.admins || [];

    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    useClickOutside(dropdownRef, () => setShowDropdown(false));

    const [showDropdown, setShowDropdown] = useState(false);

    const { data: categories } = useGetBusinessCategoriesQuery();
    const [createPackage] = useCreatePackageMutation();
    const [updatePackage] = useUpdatePackageMutation();
    const { data: packageData, isLoading: isPackageLoading } = useFetchSinglePackageQuery(
        packageId ? String(packageId) : "",
        { skip: mode !== 'edit' || !packageId }
    );

    useEffect(() => {
        if (mode === 'edit' && packageData) {
            const limitsMap = {
                monthly: { ...initialLimits },
                annual: { ...initialLimits },
                three_years: { ...initialLimits },
            };

            if (packageData.limits) {
                packageData.limits.forEach((limit: Limit) => {
                    const { variant_type, ...rest } = limit;
                    if (limitsMap[variant_type as keyof typeof limitsMap]) {
                        limitsMap[variant_type as keyof typeof limitsMap] = {
                            employee_numbers: rest.employee_numbers,
                            items_number: rest.items_number,
                            daily_tasks_number: rest.daily_tasks_number,
                            invoices_number: rest.invoices_number,
                            task: rest.Task || false,  // Note the capitalized 'Task'
                            chat: rest.Chat || false,  // Note the capitalized 'Chat'
                            hr: rest.Hr || false,     // Note the capitalized 'Hr'
                        };
                    }
                });
            }

            setFormData({
                name: packageData.name || '',
                package_type: packageData.package_type || '',
                user_id: packageData.user_id ?? null,
                monthly_price: Number(packageData.monthly_price) || 0,
                annual_price: Number(packageData.annual_price) || 0,
                three_years_price: Number(packageData.three_years_price) || 0,
                monthly_limits: limitsMap.monthly,
                annual_limits: limitsMap.annual,
                three_years_limits: limitsMap.three_years,
                business_categories: packageData.business_categories || [],
            });
        }
    }, [packageData, mode, initialLimits]);

    const clearCardData = (planType: 'monthly' | 'annual' | 'three_years') => {
        setFormData(prev => ({
            ...prev,
            [`${planType}_price`]: 0,
            [`${planType}_limits`]: { ...initialLimits },
        }));
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (name === 'monthly_price' || name === 'annual_price' || name === 'three_years_price') {
            const digitsOnly = value.replace(/\D/g, '').slice(0, 8);
            setFormData(prev => ({
                ...prev,
                [name]: digitsOnly ? Number(digitsOnly) : 0,
            }));
            return;
        }

        const limitFieldPrefixes = ['monthly_limits.', 'annual_limits.', 'three_years_limits.'];
        const isLimitField = limitFieldPrefixes.some(prefix => name.startsWith(prefix));

        if (isLimitField) {
            const [limitType, fieldName] = name.split('.');
            const inputValue = type === 'checkbox'
                ? (e.target as HTMLInputElement).checked
                : value.replace(/\D/g, '').slice(0, 8);

            setFormData(prev => ({
                ...prev,
                [limitType]: {
                    ...((typeof prev[limitType as keyof PackagePlan] === 'object' && prev[limitType as keyof PackagePlan] !== null)
                        ? prev[limitType as keyof PackagePlan] as object
                        : {}),
                    [fieldName]: type === 'checkbox' ? inputValue : (inputValue ? Number(inputValue) : 0),
                },
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const toggleCategory = (category: BusinessCategory) => {
        const exists: boolean = formData.business_categories.some(c => c.id === category.id);
        setFormData(prev => {
            const updatedCategories = exists
                ? prev.business_categories.filter(c => c.id !== category.id)
                : [...prev.business_categories, category];
            return { ...prev, business_categories: updatedCategories };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare the payload data
        const payloadData = {
            ...formData,
            user_id: formData.package_type === 'specific' ? formData.user_id : null,
            // Ensure all boolean fields are properly set
            monthly_limits: {
                ...formData.monthly_limits,
                task: Boolean(formData.monthly_limits.task),
                chat: Boolean(formData.monthly_limits.chat),
                hr: Boolean(formData.monthly_limits.hr),
            },
            annual_limits: {
                ...formData.annual_limits,
                task: Boolean(formData.annual_limits.task),
                chat: Boolean(formData.annual_limits.chat),
                hr: Boolean(formData.annual_limits.hr),
            },
            three_years_limits: {
                ...formData.three_years_limits,
                task: Boolean(formData.three_years_limits.task),
                chat: Boolean(formData.three_years_limits.chat),
                hr: Boolean(formData.three_years_limits.hr),
            }
        };

        try {
            if (mode === 'edit' && packageId) {
                await updatePackage({
                    id: packageId,
                    fomdata: {
                        ...payloadData,
                        business_categories: payloadData.business_categories,
                    }
                }).unwrap();
                router.back();
            } else {
                // For create, use FormData but ensure boolean values are properly handled
                const formDataToSubmit = new FormData();

                Object.entries(payloadData).forEach(([key, value]) => {
                    if (key === 'business_categories') {
                        (value as BusinessCategory[]).forEach(category => {
                            formDataToSubmit.append('business_category_ids[]', category.id.toString());
                        });
                    } else if (typeof value === 'object' && value !== null) {
                        Object.entries(value).forEach(([subKey, subValue]) => {
                            // Convert boolean values to '1' or '0' for FormData
                            if (typeof subValue === 'boolean') {
                                formDataToSubmit.append(`${key}[${subKey}]`, subValue ? '1' : '0');
                            } else {
                                formDataToSubmit.append(`${key}[${subKey}]`, String(subValue));
                            }
                        });
                    } else if (value !== null && value !== undefined) {
                        formDataToSubmit.append(key, value.toString());
                    }
                });

                await createPackage(formDataToSubmit).unwrap();
                alert('Package created successfully!');
                if (mode === 'add') {
                    setFormData({
                        name: '',
                        package_type: '',
                        user_id: null,
                        monthly_price: 0,
                        annual_price: 0,
                        three_years_price: 0,
                        monthly_limits: { ...initialLimits },
                        annual_limits: { ...initialLimits },
                        three_years_limits: { ...initialLimits },
                        business_categories: [],
                    });
                }
            }
        } catch (error) {
            alert(`Error ${mode === 'edit' ? 'updating' : 'creating'} package`);
            console.error('Error:', error);
        }
    };

    if (mode === 'edit' && isPackageLoading) return <LoadingState />;

    return (
        <div>
            <button className="back-button" onClick={() => router.back()}>
                <FaArrowLeft size={16} color="#fff" />
            </button>
            <div className="add-packages-conatiner">
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-section">
                        <h2 className="section-title">Basic Information</h2>
                        <div className='form-group-outer'>
                            <div className="form-group">
                                <label className="form-label">Package Name <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Premium Business Package"
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Applicable Categories</label>
                                <div className="multi-select" ref={dropdownRef}>
                                    <div className="dropdown-container">
                                        <button
                                            type="button"
                                            onClick={() => setShowDropdown(!showDropdown)}
                                            className="dropdown-toggle"
                                        >
                                            <span>Select categories</span>
                                            <FiChevronDown className={`dropdown-icon ${showDropdown ? 'open' : ''}`} />
                                        </button>
                                        {showDropdown && (
                                            <div className="dropdown-menu">
                                                {categories?.map(category => (
                                                    <div
                                                        key={category.id}
                                                        className="dropdown-item"
                                                        onClick={() => toggleCategory(category)}
                                                    >
                                                        <div className="checkbox-container">
                                                            {formData.business_categories.some(c => c.id === category.id) ? (
                                                                <FiCheck className="checkbox checked" />
                                                            ) : (
                                                                <div className="checkbox unchecked" />
                                                            )}
                                                        </div>
                                                        <span>{category.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className='form-group bc-group-span'>
                                <div className="selected-items">
                                    {formData.business_categories.map(category => (
                                        <span key={category.id} className="selected-item">
                                            {category.name}
                                            <button
                                                type="button"
                                                onClick={() => toggleCategory(category)}
                                                className="remove-item"
                                            >
                                                <FiX size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    Package Type <span className="required">*</span>
                                </label>
                                <select
                                    className="form-input"
                                    name="package_type"
                                    value={formData.package_type}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            package_type: e.target.value,
                                            user_id: e.target.value === 'general' ? null : prev.user_id,
                                        }))
                                    }
                                    required
                                >
                                    <option value="">Select type</option>
                                    <option value="general">General</option>
                                    <option value="specific">Specific</option>
                                </select>
                            </div>

                            {formData.package_type === 'specific' && (
                                <div className="form-group">
                                    <label className="form-label">
                                        Select Admin <span className="required">*</span>
                                    </label>
                                    <select
                                        className="form-input"
                                        name="user_id"
                                        value={formData.user_id || ''}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                user_id: Number(e.target.value),
                                            }))
                                        }
                                        required
                                    >
                                        <option value="">Choose an admin</option>
                                        {admins?.map((admin) => (
                                            <option key={admin.id} value={admin.id}>
                                                {admin.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-section">
                        <h2 className="section-title">Package Pricing & Limits</h2>
                        <div className="pricing-cards-container">
                            {/* Monthly Card */}
                            <div className="pricing-card">
                                <div className="card-header">
                                    <h3>Monthly Plan</h3>
                                    {(formData.monthly_price > 0 || Object.values(formData.monthly_limits).some(val => val !== 0 && val !== false)) && (
                                        <span
                                            className="clear-card-btn"
                                            onClick={() => clearCardData('monthly')}
                                        >
                                            Clear All
                                        </span>
                                    )}
                                </div>
                                <div className="card-body">
                                    <div className="price-input-group">
                                        <label>Price (₹)</label>
                                        <input
                                            type="number"
                                            name="monthly_price"
                                            value={formData.monthly_price || ''}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="limit-input-group">
                                        <label><FiUsers className="icon" /> Employees</label>
                                        <input
                                            type="number"
                                            name="monthly_limits.employee_numbers"
                                            value={formData.monthly_limits.employee_numbers || ''}
                                            onChange={handleInputChange}
                                            min="0"
                                            placeholder="Max employees"
                                            required
                                        />
                                    </div>

                                    <div className="limit-input-group">
                                        <label><FiBox className="icon" /> Inventory Items</label>
                                        <input
                                            type="number"
                                            name="monthly_limits.items_number"
                                            value={formData.monthly_limits.items_number || ''}
                                            onChange={handleInputChange}
                                            min="0"
                                            placeholder="Max items"
                                            required
                                        />
                                    </div>

                                    <div className="limit-input-group">
                                        <label><FiCheckCircle className="icon" /> Daily Tasks</label>
                                        <input
                                            type="number"
                                            name="monthly_limits.daily_tasks_number"
                                            value={formData.monthly_limits.daily_tasks_number || ''}
                                            onChange={handleInputChange}
                                            min="0"
                                            placeholder="Max tasks"
                                            required
                                        />
                                    </div>

                                    <div className="limit-input-group">
                                        <label><FiFileText className="icon" /> Invoices</label>
                                        <input
                                            type="number"
                                            name="monthly_limits.invoices_number"
                                            value={formData.monthly_limits.invoices_number || ''}
                                            onChange={handleInputChange}
                                            min="0"
                                            placeholder="Max invoices"
                                            required
                                        />
                                    </div>

                                    <div className="limit-checkbox-group">
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="monthly_limits.task"
                                                checked={formData.monthly_limits.task || false}
                                                onChange={handleInputChange}
                                            />
                                            <FiClipboard className="icon" /> Task Module
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="monthly_limits.chat"
                                                checked={formData.monthly_limits.chat || false}
                                                onChange={handleInputChange}
                                            />
                                            <FiMessageSquare className="icon" /> Chat Module
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="monthly_limits.hr"
                                                checked={formData.monthly_limits.hr || false}
                                                onChange={handleInputChange}
                                            />
                                            <FiUser className="icon" /> HR Module
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Annual Card */}
                            <div className="pricing-card">
                                <div className="card-header">
                                    <h3>Annual Plan</h3>
                                    {(formData.annual_price > 0 || Object.values(formData.annual_limits).some(val => val !== 0 && val !== false)) && (
                                        <span
                                            className="clear-card-btn"
                                            onClick={() => clearCardData('annual')}
                                        >
                                            Clear All
                                        </span>
                                    )}
                                </div>
                                <div className="card-body">
                                    <div className="price-input-group">
                                        <label>Price (₹)</label>
                                        <input
                                            type="number"
                                            name="annual_price"
                                            value={formData.annual_price || ''}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="limit-input-group">
                                        <label><FiUsers className="icon" /> Employees</label>
                                        <input
                                            type="number"
                                            name="annual_limits.employee_numbers"
                                            value={formData.annual_limits.employee_numbers || ''}
                                            onChange={handleInputChange}
                                            min="0"
                                            placeholder="Max employees"
                                            required
                                        />
                                    </div>

                                    <div className="limit-input-group">
                                        <label><FiBox className="icon" /> Inventory Items</label>
                                        <input
                                            type="number"
                                            name="annual_limits.items_number"
                                            value={formData.annual_limits.items_number || ''}
                                            onChange={handleInputChange}
                                            min="0"
                                            placeholder="Max items"
                                            required
                                        />
                                    </div>

                                    <div className="limit-input-group">
                                        <label><FiCheckCircle className="icon" /> Daily Tasks</label>
                                        <input
                                            type="number"
                                            name="annual_limits.daily_tasks_number"
                                            value={formData.annual_limits.daily_tasks_number || ''}
                                            onChange={handleInputChange}
                                            min="0"
                                            placeholder="Max tasks"
                                            required
                                        />
                                    </div>

                                    <div className="limit-input-group">
                                        <label><FiFileText className="icon" /> Invoices</label>
                                        <input
                                            type="number"
                                            name="annual_limits.invoices_number"
                                            value={formData.annual_limits.invoices_number || ''}
                                            onChange={handleInputChange}
                                            min="0"
                                            placeholder="Max invoices"
                                            required
                                        />
                                    </div>

                                    <div className="limit-checkbox-group">
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="annual_limits.task"
                                                checked={formData.annual_limits.task || false}
                                                onChange={handleInputChange}
                                            />
                                            <FiClipboard className="icon" /> Task Module
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="annual_limits.chat"
                                                checked={formData.annual_limits.chat || false}
                                                onChange={handleInputChange}
                                            />
                                            <FiMessageSquare className="icon" /> Chat Module
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="annual_limits.hr"
                                                checked={formData.annual_limits.hr || false}
                                                onChange={handleInputChange}
                                            />
                                            <FiUser className="icon" /> HR Module
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* 3 Years Card */}
                            <div className="pricing-card">
                                <div className="card-header">
                                    <h3>3 Years Plan</h3>
                                    {(formData.three_years_price > 0 || Object.values(formData.three_years_limits).some(val => val !== 0 && val !== false)) && (
                                        <span
                                            className="clear-card-btn"
                                            onClick={() => clearCardData('three_years')}
                                        >
                                            Clear All
                                        </span>
                                    )}
                                </div>
                                <div className="card-body">
                                    <div className="price-input-group">
                                        <label>Price (₹)</label>
                                        <input
                                            type="number"
                                            name="three_years_price"
                                            value={formData.three_years_price || ''}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="limit-input-group">
                                        <label><FiUsers className="icon" /> Employees</label>
                                        <input
                                            type="number"
                                            name="three_years_limits.employee_numbers"
                                            value={formData.three_years_limits.employee_numbers || ''}
                                            onChange={handleInputChange}
                                            min="0"
                                            placeholder="Max employees"
                                            required
                                        />
                                    </div>

                                    <div className="limit-input-group">
                                        <label><FiBox className="icon" /> Inventory Items</label>
                                        <input
                                            type="number"
                                            name="three_years_limits.items_number"
                                            value={formData.three_years_limits.items_number || ''}
                                            onChange={handleInputChange}
                                            min="0"
                                            placeholder="Max items"
                                            required
                                        />
                                    </div>

                                    <div className="limit-input-group">
                                        <label><FiCheckCircle className="icon" /> Daily Tasks</label>
                                        <input
                                            type="number"
                                            name="three_years_limits.daily_tasks_number"
                                            value={formData.three_years_limits.daily_tasks_number || ''}
                                            onChange={handleInputChange}
                                            min="0"
                                            placeholder="Max tasks"
                                            required
                                        />
                                    </div>

                                    <div className="limit-input-group">
                                        <label><FiFileText className="icon" /> Invoices</label>
                                        <input
                                            type="number"
                                            name="three_years_limits.invoices_number"
                                            value={formData.three_years_limits.invoices_number || ''}
                                            onChange={handleInputChange}
                                            min="0"
                                            placeholder="Max invoices"
                                            required
                                        />
                                    </div>

                                    <div className="limit-checkbox-group">
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="three_years_limits.task"
                                                checked={formData.three_years_limits.task || false}
                                                onChange={handleInputChange}
                                            />
                                            <FiClipboard className="icon" /> Task Module
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="three_years_limits.chat"
                                                checked={formData.three_years_limits.chat || false}
                                                onChange={handleInputChange}
                                            />
                                            <FiMessageSquare className="icon" /> Chat Module
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="three_years_limits.hr"
                                                checked={formData.three_years_limits.hr || false}
                                                onChange={handleInputChange}
                                            />
                                            <FiUser className="icon" /> HR Module
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="package-action">
                        <button
                            type="submit"
                            className="buttons"
                        >
                            {mode === 'edit' ? 'Update Package' : 'Create Package'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Package;
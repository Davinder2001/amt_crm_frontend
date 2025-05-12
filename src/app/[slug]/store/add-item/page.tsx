'use client';
import React, { useEffect, useState } from 'react';
import { useCreateStoreItemMutation } from '@/slices/store/storeApi';
import { useRouter } from 'next/navigation';
import { useFetchVendorsQuery } from '@/slices/vendor/vendorApi';
import AddVendor from '../components/AddVendor';
import ImageUpload from '../components/ImageUpload';
import { useCompany } from '@/utils/Company';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import ItemsTab from './ItemsTab';
import { useFetchTaxesQuery } from '@/slices/company/companyApi';
import AddCategory from './AddCategory';
import DatePicker from "react-datepicker";
const AddItem: React.FC = () => {
  const [createStoreItem, { isLoading }] = useCreateStoreItemMutation();
  const { currentData } = useFetchVendorsQuery();
  const { data: taxesData } = useFetchTaxesQuery();
  const router = useRouter();
  const { companySlug } = useCompany();

  const [formData, setFormData] = useState<CreateStoreItemRequest>({
    name: '',
    quantity_count: 0,
    measurement: '',
    purchase_date: '',
    date_of_manufacture: '',
    date_of_expiry: '',
    brand_name: '',
    replacement: '',
    category: '',
    vendor_name: '',
    availability_stock: 0,
    cost_price: 0,
    selling_price: 0,
    tax_id: 0,
    images: [],
    variants: [],
    categories: [],
  });

  const [vendors, setVendors] = useState<string[]>([]);
  const [variants, setVariants] = useState<variations[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (currentData) {
      const vendorNames = currentData.map((vendor: { vendor_name: string }) => vendor.vendor_name);
      setVendors(vendorNames);
    }
  }, [currentData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newImages = selectedFiles.slice(0, 5);
      const updatedImages = [...(formData.images || []), ...newImages].slice(-5);
      setFormData(prev => ({ ...prev, images: updatedImages }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => {
      const updatedImages = [...(prev.images || [])];
      updatedImages.splice(index, 1);
      return { ...prev, images: updatedImages };
    });
  };

  const handleClearImages = () => {
    setFormData(prev => ({ ...prev, images: [] }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', formData.name);
    form.append('quantity_count', formData.quantity_count.toString());
    form.append('measurement', formData.measurement || '');
    form.append('purchase_date', formData.purchase_date || '');
    form.append('date_of_manufacture', formData.date_of_manufacture);
    form.append('date_of_expiry', formData.date_of_expiry || '');
    form.append('brand_name', formData.brand_name);
    form.append('replacement', formData.replacement || '');
    form.append('category', formData.category || '');
    form.append('vendor_name', formData.vendor_name || '');
    form.append('availability_stock', formData.availability_stock.toString());
    form.append('cost_price', formData.cost_price.toString());
    form.append('selling_price', formData.selling_price.toString());
    form.append('tax_id', formData.tax_id.toString());

    // Attach images
    formData.images?.forEach((img) => {
      form.append('images[]', img);
    });

    // Attach variants
    variants.forEach((variant, i) => {
      form.append(`variants[${i}][price]`, variant.price.toString());

      // 🔁 Build nested attribute list correctly
      variant.attributes.forEach((attr, attrIndex) => {
        form.append(`variants[${i}][attributes][${attrIndex}][attribute_id]`, attr.attribute_id.toString());
        form.append(`variants[${i}][attributes][${attrIndex}][attribute_value_id]`, attr.attribute_value_id.toString());
      });

      // 🧠 Support any additional dynamic fields (e.g. color, size, etc.)
      Object.entries(variant).forEach(([key, val]) => {
        if (!['price', 'attributes'].includes(key)) {
          form.append(`variants[${i}][${key}]`, val.toString());
        }
      });
    });

    // ✅ Send only category IDs
    selectedCategories.forEach((category, index) => {
      form.append(`categories[${index}]`, category.id.toString());
    });


    try {
      await createStoreItem(form).unwrap();
      router.push(`/${companySlug}/store`);
    } catch (err) {
      console.error('Error creating item:', err);
    }
  };

  return (
    <div className='store-add-item'>
      <Link href={`/${companySlug}/store`} className='back-button'>
        <FaArrowLeft size={20} color='#fff' />
      </Link>

      <form onSubmit={handleSubmit}>
        <div className='categories-filds-outer'>
          <div className='add-items-form-container'>
            <div className='add-items-form-input-label-container'>
              <label>Item Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Samsung Monitor 24 inch"
                required
              />
            </div>

            <div className='add-items-form-input-label-container'>
              <label>Quantity Count*</label>
              <input
                type="number"
                name="quantity_count"
                value={formData.quantity_count === 0 ? '' : formData.quantity_count}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    quantity_count: isNaN(val) ? 0 : val,
                  }));
                }}
                placeholder="e.g. 100"
                required
              />
            </div>

            <div className='add-items-form-input-label-container'>
              <label>Measurement</label>
              <input
                type="text"
                name="measurement"
                value={formData.measurement}
                onChange={handleChange}
                placeholder="e.g. kg, pcs, liters"
              />
            </div>

            {/* Purchase Date */}
            <div className='add-items-form-input-label-container'>
              <label>Purchase Date</label>
              <DatePicker
                selected={formData.purchase_date ? new Date(formData.purchase_date) : null}
                onChange={(date: Date | null) =>
                  setFormData(prev => ({
                    ...prev,
                    purchase_date: date ? date.toISOString().split('T')[0] : ''
                  }))
                }
                dateFormat="dd/MM/yyyy"
                placeholderText="Select purchase date"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                wrapperClassName="w-full"
                popperClassName="!z-[10000]"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                maxDate={new Date()}
                showMonthDropdown
                dropdownMode="select"
                dayClassName={date =>
                  date.getDay() === 0 ? "datepicker-sunday" : ""
                }
                renderCustomHeader={({
                  date,
                  changeYear,
                  changeMonth,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
                  <div className="date-p-header">
                    <button
                      onClick={decreaseMonth}
                      disabled={prevMonthButtonDisabled}
                      className="date-p-btn"
                    >
                      {"<"}
                    </button>
                    <select
                      value={date.getFullYear()}
                      onChange={({ target: { value } }) => changeYear(Number(value))}
                      className="date-p-year"
                    >
                      {Array.from({ length: 100 }, (_, i) => (
                        <option key={i} value={new Date().getFullYear() - 99 + i}>
                          {new Date().getFullYear() - 99 + i}
                        </option>
                      ))}
                    </select>
                    <select
                      value={date.toLocaleString("default", { month: "long" })}
                      onChange={({ target: { value } }) =>
                        changeMonth(new Date(Date.parse(value + " 1, 2000")).getMonth())
                      }
                      className="date-p-header-month"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={new Date(0, i).toLocaleString("default", { month: "long" })}>
                          {new Date(0, i).toLocaleString("default", { month: "long" })}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={increaseMonth}
                      disabled={nextMonthButtonDisabled}
                      className="date-p-btn"
                    >
                      {">"}
                    </button>
                  </div>
                )}
              />
            </div>

            {/* Date of Manufacture */}
            <div className='add-items-form-input-label-container'>
              <label>Date Of Manufacture*</label>
              <DatePicker
                selected={formData.date_of_manufacture ? new Date(formData.date_of_manufacture) : null}
                onChange={(date: Date | null) =>
                  setFormData(prev => ({
                    ...prev,
                    date_of_manufacture: date ? date.toISOString().split('T')[0] : ''
                  }))
                }
                dateFormat="dd/MM/yyyy"
                placeholderText="Select manufacture date"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                wrapperClassName="w-full"
                popperClassName="!z-[10000]"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                maxDate={new Date()}
                showMonthDropdown
                dropdownMode="select"
                required
                dayClassName={date => date.getDay() === 0 ? 'datepicker-sunday' : ''}
                renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                  <div className="date-p-header">
                    <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="date-p-btn">{"<"}</button>
                    <select
                      value={date.getFullYear()}
                      onChange={({ target: { value } }) => changeYear(Number(value))}
                      className="mr-2 p-1 bg-white border rounded"
                    >
                      {Array.from({ length: 100 }, (_, i) => (
                        <option key={i} value={new Date().getFullYear() - 99 + i}>
                          {new Date().getFullYear() - 99 + i}
                        </option>
                      ))}
                    </select>
                    <select
                      value={date.toLocaleString("default", { month: "long" })}
                      onChange={({ target: { value } }) =>
                        changeMonth(new Date(Date.parse(value + " 1, 2000")).getMonth())
                      }
                      className="p-1 bg-white border rounded"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={new Date(0, i).toLocaleString("default", { month: "long" })}>
                          {new Date(0, i).toLocaleString("default", { month: "long" })}
                        </option>
                      ))}
                    </select>
                    <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="date-p-btn">{">"}</button>
                  </div>
                )}
              />

            </div>

            {/* Date of Expiry */}
            <div className='add-items-form-input-label-container'>
              <label>Date Of Expiry</label>
              <DatePicker
                selected={formData.date_of_expiry ? new Date(formData.date_of_expiry) : null}
                onChange={(date: Date | null) =>
                  setFormData(prev => ({
                    ...prev,
                    date_of_expiry: date ? date.toISOString().split('T')[0] : ''
                  }))
                }
                dateFormat="dd/MM/yyyy"
                placeholderText="Select expiry date"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                wrapperClassName="w-full"
                popperClassName="!z-[10000]"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                minDate={new Date()}
                showMonthDropdown
                dropdownMode="select"
                dayClassName={date => date.getDay() === 0 ? 'datepicker-sunday' : ''}
                renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                  <div className="date-p-header">
                    <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="date-p-btn">{"<"}</button>
                    <select
                      value={date.getFullYear()}
                      onChange={({ target: { value } }) => changeYear(Number(value))}
                      className="mr-2 p-1 bg-white border rounded"
                    >
                      {Array.from({ length: 100 }, (_, i) => (
                        <option key={i} value={new Date().getFullYear() - 99 + i}>
                          {new Date().getFullYear() - 99 + i}
                        </option>
                      ))}
                    </select>
                    <select
                      value={date.toLocaleString("default", { month: "long" })}
                      onChange={({ target: { value } }) =>
                        changeMonth(new Date(Date.parse(value + " 1, 2000")).getMonth())
                      }
                      className="p-1 bg-white border rounded"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={new Date(0, i).toLocaleString("default", { month: "long" })}>
                          {new Date(0, i).toLocaleString("default", { month: "long" })}
                        </option>
                      ))}
                    </select>
                    <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="date-p-btn">{">"}</button>
                  </div>
                )}
              />

            </div>
            <div className='add-items-form-input-label-container'>
              <label>Brand Name*</label>
              <input
                type="text"
                name="brand_name"
                value={formData.brand_name}
                onChange={handleChange}
                placeholder="e.g. Samsung, LG"
                required
              />
            </div>

            <div className='add-items-form-input-label-container'>
              <label>Replacement</label>
              <input
                type="text"
                name="replacement"
                value={formData.replacement}
                onChange={handleChange}
                placeholder="e.g. Replace after 2 years"
              />
            </div>

            <div className='add-items-form-input-label-container'>
              <label>Cost Price*</label>
              <input
                type="number"
                name="cost_price"
                value={formData.cost_price === 0 ? '' : formData.cost_price}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    cost_price: isNaN(val) ? 0 : val,
                  }));
                }}
                placeholder="e.g. 250.00"
                required
              />
            </div>

            <div className='add-items-form-input-label-container'>
              <label>Selling Price*</label>
              <input
                type="number"
                name="selling_price"
                value={formData.selling_price === 0 ? '' : formData.selling_price}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    selling_price: isNaN(val) ? 0 : val,
                  }));
                }}
                placeholder="e.g. 300.00"
                required
              />
            </div>

            <div className='add-items-form-input-label-container'>
              <label>Availability Stock</label>
              <input
                type="number"
                name="availability_stock"
                value={formData.availability_stock === 0 ? '' : formData.availability_stock}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    availability_stock: isNaN(val) ? 0 : val,
                  }));
                }}
                placeholder="e.g. 50"
              />
            </div>
            <div className='add-items-form-input-label-container'>
              <label>Tax</label>
              <select
                name="tax_id"
                value={formData.tax_id}
                onChange={(e) => setFormData(prev => ({ ...prev, tax_id: parseInt(e.target.value) }))}
              >
                <option value="">Select Tax</option>
                {taxesData?.data?.map((tax: Tax) => (
                  <option key={tax.id} value={tax.id}>
                    {tax.name} - {tax.rate}%
                  </option>
                ))}
              </select>
            </div>

            <div className='add-items-form-input-label-container'>
              <label>Vendor Name*</label>
              <AddVendor
                vendors={vendors}
                selectedVendor={formData.vendor_name || ''}
                onVendorSelect={(vendorName) =>
                  setFormData(prev => ({ ...prev, vendor_name: vendorName }))
                }
                onVendorAdded={(vendorName) => {
                  setVendors(prev => [...prev, vendorName]);
                  setFormData(prev => ({ ...prev, vendor_name: vendorName }));
                }}
              />
            </div>


            <ImageUpload
              images={formData.images}
              handleImageChange={handleImageChange}
              handleClearImages={handleClearImages}
              handleRemoveImage={handleRemoveImage}
            />
            <div >
              <ItemsTab
                onChange={setVariants}
                variations={variants}
              />
            </div>
          </div>
          <AddCategory onCategoryChange={setSelectedCategories} selectedCategories={selectedCategories} />
        </div>
        <div className='save-cancel-button' style={{ flex: '1 1 100%', marginTop: '1rem' }}>
          <button
            className='buttons'
            type="button"
            style={{ marginLeft: '1rem' }}
            onClick={() => router.push(`/${companySlug}/store`)}
          >
            Cancel
          </button>
          <button className='buttons' type="submit" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;

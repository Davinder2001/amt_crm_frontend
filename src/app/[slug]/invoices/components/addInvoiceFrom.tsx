import React, { useState } from "react";
import { useCreateInvoiceMutation } from "@/slices/invoices/invoice";
import { useFetchStoreQuery } from "@/slices/store/storeApi";
import { useFetchAllCustomersQuery } from "@/slices/customers/customer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddInvoiceForm = () => {
  const [number, setNumber] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<string>("");
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [isAutocompleteVisible, setIsAutocompleteVisible] = useState<boolean>(false);
  const [filteredStoreItems, setFilteredStoreItems] = useState<StoreItem[]>([]);
  const [createInvoice, { isLoading }] = useCreateInvoiceMutation();
  const { data: customers } = useFetchAllCustomersQuery();
  const { data: storeData } = useFetchStoreQuery();
  const storeItems: StoreItem[] = storeData || [];

  const handleNumberBlur = () => {
    if (!number || !customers?.customers) return;
  
    const matchedCustomer = customers.customers.find(
      (cust: Customer) => cust.number === number
    );
  
    if (matchedCustomer) {
      setClientName(matchedCustomer.name);
      setClientEmail(matchedCustomer.email || "");
      toast.success(`Customer "${matchedCustomer.name}" found and autofilled!`);
    }
  };
  

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: number | string) => {
    const updatedItems = [...items];
    if (field === "quantity" || field === "unit_price") {
      value = isNaN(Number(value)) ? 0 : Number(value);
    } else {
      value = String(value);
    }
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    if (field === "quantity" || field === "unit_price") {
      updatedItems[index].price =
        updatedItems[index].quantity * updatedItems[index].unit_price;
    }
    setItems(updatedItems);
  };

  const handleSelectItem = (index: number, storeItem: StoreItem) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      item_id: storeItem.id,
      name: storeItem.name,
      unit_price: parseFloat(storeItem.selling_price) || 0,
      quantity: 1,
      price: parseFloat(storeItem.selling_price) || 0,
      measurement: storeItem.measurement,
      date_of_manufacture: storeItem.date_of_manufacture,
      date_of_expiry: storeItem.date_of_expiry,
      description: `${storeItem.category || ""} ${storeItem.brand_name || ""}`.trim(),
    };
    setItems(updatedItems);
    setIsAutocompleteVisible(false);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        item_id: null,
        name: "",
        description: "",
        quantity: 1,
        unit_price: 0,
        price: 0,
        measurement: "",
        date_of_manufacture: "",
        date_of_expiry: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasMissingIds = items.some((item) => !item.item_id);
    if (hasMissingIds) {
      alert("Please select valid items from the list before submitting.");
      return;
    }

    const payload = {
      number,
      client_name: clientName,
      email:  clientEmail,
      invoice_date: invoiceDate,
      items: items.map(({ item_id, quantity, unit_price, description, measurement, date_of_manufacture, date_of_expiry }) => ({
        item_id,
        quantity,
        unit_price,
        description,
        measurement,
        date_of_manufacture,
        date_of_expiry,
      })),
    };

    try {
      const response = await createInvoice(payload).unwrap();
      console.log("Invoice created:", response);
      alert("Invoice successfully created!");
    } catch (error) {
      console.error("Failed to create invoice:", error);
      alert("Something went wrong.");
    }
  };

  const handleItemInputFocus = () => {
    setIsAutocompleteVisible(true);
    setFilteredStoreItems(storeItems);
  };

  const handleItemInputChange = (index: number, value: string) => {
    handleItemChange(index, "name", value);
    const filteredItems = value
      ? storeItems.filter((storeItem) =>
          storeItem.name.toLowerCase().includes(value.toLowerCase())
        )
      : storeItems;
    setFilteredStoreItems(filteredItems);
  };

  const incrementQuantity = (index: number) => {
    const updatedItems = [...items];
    updatedItems[index].quantity += 1;
    updatedItems[index].price = updatedItems[index].quantity * updatedItems[index].unit_price;
    setItems(updatedItems);
  };

  const decrementQuantity = (index: number) => {
    const updatedItems = [...items];
    if (updatedItems[index].quantity > 1) {
      updatedItems[index].quantity -= 1;
      updatedItems[index].price = updatedItems[index].quantity * updatedItems[index].unit_price;
      setItems(updatedItems);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="invoice-form">
      <div className="form-group">
        <label className="form-label">Number</label>
        <input
          type="number"
          className="form-input"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          onBlur={handleNumberBlur}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Client Name</label>
        <input
          type="text"
          className="form-input"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Client Email ( Optional )</label>
        <input
          type="email"
          className="form-input"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Invoice Date</label>
        <input
          type="date"
          className="form-input"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Items</label>
        {items.map((item, index) => (
          <div key={index} className="item-group">
            <div className="grid">
              <div className="relative">
                <div className="item-field">
                  <label htmlFor="item-name">Item Name:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Item Name"
                    value={item.name}
                    onFocus={handleItemInputFocus}
                    onChange={(e) => handleItemInputChange(index, e.target.value)}
                    required
                  />
                </div>
                {isAutocompleteVisible && item.name && (
                  <ul className="autocomplete-list">
                    {filteredStoreItems.map((storeItem) => (
                      <li
                        key={storeItem.id}
                        className="autocomplete-item"
                        onClick={() => handleSelectItem(index, storeItem)}
                      >
                        {storeItem.name} - #{storeItem.id}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="item-field">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button type="button" className="quantity-btn" onClick={() => decrementQuantity(index)} disabled={item.quantity <= 1}>-</button>
                  <input type="number" className="form-input quantity-input" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value, 10))} min={1} required />
                  <button type="button" className="quantity-btn" onClick={() => incrementQuantity(index)}>+</button>
                </div>
              </div>
              <div className="item-field">
                <label>Unit Price:</label>
                <input type="number" className="form-input" value={item.unit_price || 0} onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value))} required />
              </div>
              <div className="item-field">
                <label>Measurement:</label>
                <input type="text" className="form-input" value={item.measurement || ""} disabled />
              </div>
              <div className="item-field">
                <label>Date of Manufacture:</label>
                <input type="date" className="form-input" value={item.date_of_manufacture || ""} disabled />
              </div>
              <div className="item-field">
                <label>Date of Expiry:</label>
                <input type="date" className="form-input" value={item.date_of_expiry || ""} disabled />
              </div>
              <div className="item-field">
                <label>Description:</label>
                <textarea className="form-input description-textarea" value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} />
              </div>
            </div>
            <div className="flex-between">
              <p className="subtotal">Subtotal: ₹{typeof item.price === "number" ? item.price.toFixed(2) : "0.00"}</p>
              {items.length > 1 && (
                <button type="button" className="remove-item" onClick={() => removeItem(index)}>
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
        <button type="button" onClick={addItem} className="add-item-btn">
          Add Item
        </button>
      </div>

      <button type="submit" className="submit-btn" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Create Invoice"}
      </button>
    </form>
  );
};

export default AddInvoiceForm;

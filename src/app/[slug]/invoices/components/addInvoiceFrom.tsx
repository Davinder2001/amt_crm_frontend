'use client';
import React, { useState } from "react";
import { useCreateInvoiceMutation } from "@/slices/invoices/invoice";
import { useFetchStoreQuery } from "@/slices/store/storeApi";

const AddInvoiceForm = () => {
  const [clientName, setClientName] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<string>("");
  const [items, setItems] = useState<Item[]>([
    {
      id: Date.now(),
      name: "",
      description: "",
      quantity: 1,
      unit_price: 0,
      price: 0,
    },
  ]);
  const [isAutocompleteVisible, setIsAutocompleteVisible] = useState<boolean>(false);

  const [createInvoice, { isLoading }] = useCreateInvoiceMutation();
  const { data: storeData } = useFetchStoreQuery();
  const storeItems: StoreItem[] = storeData || [];

  const handleItemChange = (index: number, field: keyof Item, value: number | string) => {
    const updatedItems = [...items];

    if (field === "quantity" || field === "unit_price") {
      // Ensure these fields are numbers
      value = isNaN(Number(value)) ? 0 : Number(value);
    } else {
      // For 'name' and 'description', treat them as strings
      value = String(value);
    }

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    // Recalculate the price if quantity or unit_price changed
    if (field === "quantity" || field === "unit_price") {
      updatedItems[index].price = updatedItems[index].quantity * updatedItems[index].unit_price;
    }

    setItems(updatedItems);
  };

  const handleSelectItem = (index: number, storeItem: StoreItem) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      name: storeItem.name,
      unit_price: parseFloat(String(storeItem.price)),
      quantity: storeItem.quantity_count || 1,
      price: storeItem.price * (storeItem.quantity_count || 1),
      description: `${storeItem.category || ""} ${storeItem.brand_name || ""}`.trim(),
    };
    setItems(updatedItems);
    setIsAutocompleteVisible(false); // Hide autocomplete list after selecting
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        name: "",
        description: "",
        quantity: 1,
        unit_price: 0,
        price: 0,
      },
    ]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      client_name: clientName,
      invoice_date: invoiceDate,
      items: items.map(({...rest }) => rest),
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
    setIsAutocompleteVisible(true); // Show autocomplete list when input is focused
  };

  return (
    <form onSubmit={handleSubmit} className="invoice-form">
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
          <div key={item.id} className="item-group">
            <div className="grid">
              <div className="relative">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Item Name"
                  value={item.name}
                  onFocus={handleItemInputFocus} // Show autocomplete list on focus
                  onChange={(e) => handleItemChange(index, "name", e.target.value)}
                  required
                />
                {isAutocompleteVisible && item.name && (
                  <ul className="autocomplete-list">
                    {storeItems
                      .filter((storeItem) =>
                        storeItem.name.toLowerCase().includes(item.name.toLowerCase())
                      )
                      .map((storeItem) => (
                        <li
                          key={storeItem.id}
                          className="autocomplete-item"
                          onClick={() => handleSelectItem(index, storeItem)}
                        >
                          {storeItem.name} - ₹{storeItem.price || 0}
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              <input
                type="text"
                className="form-input"
                placeholder="Description"
                value={item.description}
                onChange={(e) => handleItemChange(index, "description", e.target.value)}
              />
              <input
                type="number"
                className="form-input"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                required
              />
              <input
                type="number"
                className="form-input"
                placeholder="Unit Price"
                value={item.unit_price}
                onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value))}
                required
              />
            </div>
            <div className="flex-between">
              <p className="subtotal">Subtotal: ₹{item.price.toFixed(2)}</p>
              {items.length > 1 && (
                <button
                  type="button"
                  className="remove-item"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="add-item-btn"
        >
          Add Item
        </button>
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Create Invoice"}
      </button>
    </form>
  );
};

export default AddInvoiceForm;

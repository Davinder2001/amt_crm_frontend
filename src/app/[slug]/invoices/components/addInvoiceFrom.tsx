import React, { useState } from "react";
import { useCreateInvoiceMutation } from "@/slices/invoices/invoice";
import { useFetchStoreQuery } from "@/slices/store/storeApi";
import { useFetchAllCustomersQuery } from "@/slices/customers/customer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const AddInvoiceForm = () => {
  const [number, setNumber] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<string>("");
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [isAutocompleteVisible, setIsAutocompleteVisible] = useState<boolean>(false);
  const [filteredStoreItems, setFilteredStoreItems] = useState<StoreItem[]>([]);
  const [nextItemId, setNextItemId] = useState<number>(1);
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
      updatedItems[index].price = updatedItems[index].quantity * updatedItems[index].unit_price;
    }
    setItems(updatedItems);
  };

  const handleSelectItem = (index: number, storeItem: StoreItem) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      name: storeItem.name,
      unit_price: parseFloat(String(storeItem.price)) || 0,
      price: storeItem.price * (storeItem.quantity_count || 1),
      description: `${storeItem.category || ""} ${storeItem.brand_name || ""}`.trim(),
    };
    setItems(updatedItems);
    setIsAutocompleteVisible(false);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        item_id: nextItemId,
        name: "",
        description: "",
        quantity: 1,
        unit_price: 0,
        price: 0,
      },
    ]);
    setNextItemId(nextItemId + 1);
  };

  const removeItem = (item_id: number) => {
    setItems(items.filter((item) => item.item_id !== item_id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      number,
      client_name: clientName,
      invoice_date: invoiceDate,
      items: items.map(({ item_id, ...rest }) => ({ ...rest, item_id })),
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
    if (storeItems.length > 0) {
      setFilteredStoreItems(storeItems);
    }
  };

  const handleItemInputChange = (index: number, value: string) => {
    handleItemChange(index, "name", value);
    if (value) {
      const filteredItems = storeItems.filter((storeItem) =>
        storeItem.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStoreItems(filteredItems);
    } else {
      setFilteredStoreItems(storeItems);
    }
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
          onBlur={handleNumberBlur} // 👈 added for autofill
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
          <div key={item.item_id} className="item-group">
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
                <label htmlFor="item-quantity">Quantity:</label>
                <div className="quantity-controls">
                  <button
                    type="button"
                    className="quantity-btn"
                    onClick={() => decrementQuantity(index)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="form-input quantity-input"
                    value={item.quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value, 10);
                      if (e.target.value === "") {
                        handleItemChange(index, "quantity", 1);
                      } else if (!isNaN(newQuantity) && newQuantity >= 1) {
                        handleItemChange(index, "quantity", newQuantity);
                      }
                    }}
                    min={1}
                    required
                  />
                  <button
                    type="button"
                    className="quantity-btn"
                    onClick={() => incrementQuantity(index)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="item-field">
                <label htmlFor="item-unit-price">Unit Price:</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Unit Price"
                  value={isNaN(item.unit_price) ? 0 : item.unit_price}
                  onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value))}
                  required
                />
              </div>
              <div className="item-field">
                <label htmlFor="item-description">Description:</label>
                <textarea
                  className="form-input description-textarea"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, "description", e.target.value)}
                />
              </div>
            </div>
            <div className="flex-between">
              <p className="subtotal">Subtotal: ₹{item.price.toFixed(2)}</p>
              {items.length > 1 && (
                <button
                  type="button"
                  className="remove-item"
                  onClick={() => removeItem(item.item_id)}
                >
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

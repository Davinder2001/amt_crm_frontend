"use client";

import React, { useState } from "react";
import { useCreateInvoiceMutation } from "@/slices/invoices/invoice";
import { useFetchStoreQuery } from "@/slices/store/storeApi";

const AddInvoiceForm = () => {
  const [clientName, setClientName] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [items, setItems] = useState([
    {
      id: Date.now(),
      name: "",
      description: "",
      quantity: 1,
      unit_price: 0,
      price: 0,
    },
  ]);

  const [createInvoice, { isLoading }] = useCreateInvoiceMutation();
  const { data: storeData } = useFetchStoreQuery();
  const storeItems = storeData || [];

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    if (field === "quantity" || field === "unit_price") {
      updatedItems[index].price =
        updatedItems[index].quantity * updatedItems[index].unit_price;
    }

    setItems(updatedItems);
  };

  const handleSelectItem = (index: number, storeItem: any) => {
    const updatedItems = [...items];
    updatedItems[index].name = storeItem.name;
    updatedItems[index].unit_price = parseFloat(storeItem.price);
    updatedItems[index].quantity = storeItem.quantity_count || 1;
    updatedItems[index].price =
      updatedItems[index].unit_price * updatedItems[index].quantity;
    updatedItems[index].description = `${storeItem.category || ""} ${storeItem.brand_name || ""}`.trim();
    setItems(updatedItems);
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
      items: items.map(({ id, ...rest }) => rest),
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

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold">Create Invoice</h2>

      <div>
        <label className="block text-sm">Client Name</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm">Invoice Date</label>
        <input
          type="date"
          className="border p-2 w-full"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold">Items</label>
        {items.map((item, index) => (
          <div key={item.id} className="bg-gray-50 p-3 mb-3 rounded border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2 relative">
              <div className="relative">
                <input
                  type="text"
                  className="border p-2 w-full"
                  placeholder="Item Name"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, "name", e.target.value)}
                  required
                />
                {item.name && (
                  <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto">
                    {storeItems
                      .filter((storeItem) =>
                        storeItem.name.toLowerCase().includes(item.name.toLowerCase())
                      )
                      .map((storeItem) => (
                        <li
                          key={storeItem.id}
                          className="px-3 py-1 cursor-pointer hover:bg-gray-100 text-sm"
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
                className="border p-2"
                placeholder="Description"
                value={item.description}
                onChange={(e) => handleItemChange(index, "description", e.target.value)}
              />
              <input
                type="number"
                className="border p-2"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                required
              />
              <input
                type="number"
                className="border p-2"
                placeholder="Unit Price"
                value={item.unit_price}
                onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value))}
                required
              />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Subtotal: ₹{item.price.toFixed(2)}</p>
              {items.length > 1 && (
                <button
                  type="button"
                  className="text-red-500 text-sm"
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
          className="bg-green-500 text-white px-3 py-1 mt-2 rounded text-sm"
        >
          Add Item
        </button>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Create Invoice"}
      </button>
    </form>
  );
};

export default AddInvoiceForm;

'use client';

import React, { useState } from 'react';
import { FiX, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import {
  useCreateInvoiceMutation,
  usePrintInvoiceMutation,
  useMailInvoiceMutation,
} from '@/slices/invoices/invoice';

type TabType = 'Cart' | 'Delivery' | 'Pickup';
type CartItem = {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  selling_price: number;
};

type CreateInvoicePayload = {
  number: string;
  client_name: string;
  invoice_date: string;
  items: {
    item_id: number;
    quantity: number;
    unit_price: number;
    description: string;
  }[];
};

type CheckoutPanelProps = {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  cart: CartItem[];
  onQtyChange: (itemId: number, delta: number) => void;
  onRemoveItem: (itemId: number) => void;
  onClearCart: () => void;
};

const tabs: TabType[] = ['Cart', 'Delivery', 'Pickup'];

export default function CheckoutPanel({
  activeTab,
  onTabChange,
  cart,
  onQtyChange,
  onRemoveItem,
  onClearCart,
}: CheckoutPanelProps) {
  const [showPaymentDetails, setShowPaymentDetails] = useState(true);

  // RTK Query hooks
  const [createInvoice, { isLoading: isSaving }] = useCreateInvoiceMutation();
  const [printInvoice,  { isLoading: isPrinting }] = usePrintInvoiceMutation();
  const [mailInvoice,   { isLoading: isMailing }] = useMailInvoiceMutation();

  const total = cart.reduce((sum, i) => sum + i.quantity * i.selling_price, 0);

  const buildPayload = (): CreateInvoicePayload => ({
    number: `INV-${Date.now()}`,
    client_name: 'Guest',
    invoice_date: new Date().toISOString().split('T')[0],
    items: cart.map(i => ({
      item_id:    i.id,
      quantity:   i.quantity,
      unit_price: i.selling_price,
      description: i.description || i.name,
      total: i.quantity * i.selling_price,
    })),
  });
  

  // 1) Save only
  const handleSave = async () => {
    try {
      const payload = buildPayload();
      const invoice = await createInvoice(payload).unwrap();
      console.log('Invoice saved:', invoice);
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  // 2) Save & Print
  const handlePrint = async () => {
    try {
      const payload = buildPayload();
      const pdfBlob = await printInvoice(payload).unwrap();
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Print error:', err);
    }
  };

  // 3) Save & Mail (or KOT)
  const handleMail = async () => {
    try {
      const payload = buildPayload();
      const invoice = await mailInvoice(payload).unwrap();
      console.log('Invoice mailed:', invoice);
    } catch (err) {
      console.error('Mail error:', err);
    }
  };

  return (
    <div className="checkout">
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab ${tab === activeTab ? 'active' : ''}`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="content">
        {activeTab === 'Cart' && (
          <>
            {cart.length > 0 ? (
              <>
                <table className="cartTable">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.id}>
                        <td>
                          <button className="removeBtn" onClick={() => onRemoveItem(item.id)}>
                            <FiX />
                          </button>{' '}
                          {item.name}
                        </td>
                        <td>
                          <button onClick={() => onQtyChange(item.id, -1)}>-</button>
                          {item.quantity}
                          <button onClick={() => onQtyChange(item.id, 1)}>+</button>
                        </td>
                        <td>₹{item.quantity * item.selling_price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={onClearCart} title="Clear all items from cart">
                  <FiTrash2 style={{ marginRight: 5 }} />
                  Clear All
                </button>
              </>
            ) : (
              <div className="emptyCart">
                <FiShoppingCart size={80} color="#ccc" />
                <p>Your cart is empty</p>
              </div>
            )}

            <div className="sectionToggle" onClick={() => setShowPaymentDetails(!showPaymentDetails)}>
              <span>{showPaymentDetails ? '▼' : '▲'}</span>
              <span>Discounts & Payment</span>
            </div>

            {showPaymentDetails && (
              <div className="discounts">
                <div className="checkboxGroup">
                  <label><input type="checkbox" /> Bogo</label>
                  <label><input type="checkbox" /> Complimentary</label>
                </div>
                <div className="radioGroup">
                  <label><input type="radio" name="pay" /> Cash</label>
                  <label><input type="radio" name="pay" /> Card</label>
                  <label><input type="radio" name="pay" /> Due</label>
                </div>
              </div>
            )}

            <div className="total">
              Total: <strong>₹{total}</strong>
            </div>

            <div className="actions">
              <button className="btn" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button className="btn" onClick={handlePrint} disabled={isPrinting}>
                {isPrinting ? 'Printing...' : 'Save & Print'}
              </button>
              <button className="btn" onClick={handleMail} disabled={isMailing}>
                {isMailing ? 'Sending...' : 'Save & KOT'}
              </button>
            </div>
          </>
        )}

        {activeTab === 'Delivery' && (
          <div className="form">
            <h4>Delivery Details</h4>
            <input type="text" placeholder="Customer Name" />
            <input type="text" placeholder="Phone Number" />
            <textarea placeholder="Delivery Address" />
            <div className="actions">
              <button className="btn">Save</button>
              <button className="btn">Send</button>
            </div>
          </div>
        )}

        {activeTab === 'Pickup' && (
          <div className="form">
            <h4>Pickup Details</h4>
            <input type="text" placeholder="Customer Name" />
            <input type="text" placeholder="Phone Number" />
            <div className="actions">
              <button className="btn">Save</button>
              <button className="btn">Notify</button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
                .checkout {
                    width: 350px;
                    background: #fff;
                    border-left: 1px solid #ccc;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    font-family: sans-serif;
                }

                .tabs {
                    display: flex;
                    border-bottom: 1px solid #ccc;
                }

                .tab {
                    flex: 1;
                    padding: 10px;
                    border: none;
                    background: #eee;
                    cursor: pointer;
                    font-weight: bold;
                }

                .tab.active {
                    background: #009688;
                    color: white;
                }

                .content {
                    padding: 12px;
                    overflow-y: auto;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .cartTable {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 14px;
                }

                .cartTable th,
                .cartTable td {
                    padding: 6px;
                    border-bottom: 1px solid #ddd;
                    text-align: left;
                }

                .cartTable button {
                    margin: 0 4px;
                    padding: 2px 6px;
                }
                    .emptyCart {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 10px;
    color: #888;
}

.emptyCart p {
    margin-top: 10px;
    font-size: 16px;
}


                .sectionToggle {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    background: #f1f1f1;
                    padding: 8px;
                    border-radius: 4px;
                }

                .discounts {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    background: #fafafa;
                }

                .checkboxGroup,
                .radioGroup {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .total {
                    text-align: right;
                    font-size: 16px;
                }

                .actions {
                    display: flex;
                    gap: 10px;
                }

                .btn {
                    flex: 1;
                    padding: 10px;
                    background: #009688;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-weight: bold;
                    cursor: pointer;
                }

                .form {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .form input,
                .form textarea {
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }

                .form textarea {
                    resize: vertical;
                }
            `}</style>
    </div>
  );
}

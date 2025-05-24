// 'use client';

// import React from 'react';
// import { useParams } from 'next/navigation';
// import { useGetInvoiceByIdQuery } from '@/slices/invoices/invoice';
// import ResponsiveTable from '@/components/common/ResponsiveTable';

// const InvoiceViewPage = () => {
//   const params = useParams();
//   const id = params?.id;

//   const {
//     data,
//     isLoading,
//     isError,
//   } = useGetInvoiceByIdQuery(id as string, {
//     skip: !id,
//   });

//   if (isLoading) return <div>Loading invoice...</div>;
//   if (isError || !data?.invoice) return <div>Failed to load invoice.</div>;

//   const { invoice } = data;

//   const columns = [
//     { label: 'Description', key: 'description' as keyof typeof invoice.items[0] },
//     { label: 'Quantity', key: 'quantity' as keyof typeof invoice.items[0] },
//     {
//       label: 'Unit Price (₹)',
//       render: (item: typeof invoice.items[0]) => `₹${item.unit_price}`,
//     },
//     {
//       label: 'Total (₹)',
//       render: (item: typeof invoice.items[0]) => `₹${item.total}`,
//     },
//   ];

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">Invoice #{invoice.invoice_number}</h1>
//       <p><strong>Client Name:</strong> {invoice.client_name || "N/A"}</p>
//       <p><strong>Email:</strong> {invoice.client_email || "N/A"}</p>
//       <p><strong>Date:</strong> {invoice.invoice_date}</p>
//       <p><strong>Total:</strong> ₹{invoice.total_amount}</p>

//       <h2 className="mt-6 font-semibold text-lg mb-2">Items</h2>

//       <ResponsiveTable
//         data={invoice.items}
//         columns={columns}
//       />
//     </div>
//   );
// };

// export default InvoiceViewPage;







// 'use client';

// import React from 'react';
// import { useParams } from 'next/navigation';
// import { useGetInvoiceByIdQuery } from '@/slices/invoices/invoice';

// const InvoiceViewPage = () => {
//   const params = useParams();
//   const id = params?.id;

//   const { data, isLoading, isError } = useGetInvoiceByIdQuery(id as string, {
//     skip: !id,
//   });

//   if (isLoading) return <div className="loading">Loading invoice...</div>;
//   if (isError || !data?.invoice) return <div className="error">Failed to load invoice.</div>;

//   const { invoice } = data;

//   return (
//     <div className="view-invoice-container">
//       <header className="view-invoice-header">
//         <div className="title"> INVOICE</div>
//       </header>

//       <section className="info">
//         <div>
//           <p><strong>Name:</strong> {invoice.client_name}</p>
//           <p><strong>Contact:</strong> {invoice.client_phone}</p>
//           <p><strong>Invoice No:</strong> {invoice.invoice_number}</p>
//           <p><strong>Date:</strong> {invoice.invoice_date}</p>
//         </div>
//         <div>
//           <p><strong>Payment Mode:</strong> {invoice.payment_method}</p>
//           <p><strong>Issued By:</strong> {invoice.issued_by_name}</p>
//         </div>
//       </section>

//       <table className="table">
//         <thead>
//           <tr>
//             <th>Sn.</th>
//             <th>Product/Item</th>
//             <th>Unit Price</th>
//             <th>Tax Rate</th>
//             <th>Qty</th>
//             <th>Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           {invoice.items.map((item, i) => (
//             <tr key={item.id}>
//               <td>{i + 1}</td>
//               <td>{item.description}</td>
//               <td>₹{item.unit_price}</td>
//               <td>{item.tax_rate}%</td>
//               <td>{item.quantity}</td>
//               <td>₹{item.total}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <section className="totals">
//         <p><strong>Sub Total:</strong> ₹{invoice.sub_total}</p>
//         <p><strong>Service Charge:</strong> ₹{invoice.service_charge_amount} + GST ₹{invoice.service_charge_gst}</p>
//         <p><strong>Discount:</strong> ₹{invoice.discount_amount} ({invoice.discount_percentage}%)</p>
//         <h3><strong>Grand Total:</strong> ₹{invoice.final_amount}</h3>
//       </section>

//       <footer className="footer">
//         <p>Thank you for your business!</p>
//         <p className="signature">Authorized Signatory</p>
//       </footer>
//     </div>
//   );
// };

// export default InvoiceViewPage;


'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetInvoiceByIdQuery } from '@/slices/invoices/invoice';

const InvoiceViewPage = () => {
  const params = useParams();
  const id = params?.id;
  const { data, isLoading, isError } = useGetInvoiceByIdQuery(id as string, {
    skip: !id,
  });

  if (isLoading) return <div className="invoice-loading">Loading invoice...</div>;
  if (isError || !data?.invoice) return <div className="invoice-error">Failed to load invoice.</div>;

  const { invoice } = data;

  return (
    <div className="invoice-wrapper">
      <div className="invoice-card">
        <header className="invoice-header">
          <div className="invoice-title">
            <h1>
              <span className="holo-glow">INVOICE</span>
            </h1>
            <p className="invoice-number">#{invoice.invoice_number}</p>
          </div>
          <div className="invoice-date">
            <p>Date: <strong>{invoice.invoice_date}</strong></p>
          </div>
        </header>

        <section className="invoice-info">
          <div className="client-section">
            <h2>Client</h2>
            <p><strong>Name:</strong> {invoice.client_name}</p>
            <p><strong>Phone:</strong> {invoice.client_phone}</p>
            <p><strong>Email:</strong> {invoice.client_email}</p>
          </div>
          <div className="company-section">
            <h2>Other Info</h2>
            <p><strong>Issued By:</strong> {invoice.issued_by_name}</p>
            <p><strong>Payment Method:</strong> <span>{invoice.payment_method}</span></p>
          </div>
        </section>

        <section className="invoice-items">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Price</th>
                <th>Tax %</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>
                  <td>{item.description}</td>
                  <td>₹{item.unit_price}</td>
                  <td>{item.tax_percentage}%</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="invoice-summary-outer">
          <div className="invoice-summary">
            <div className="summary-row"><span>Subtotal</span><span>₹{invoice.sub_total}</span></div>
            <div className="summary-row">
              <span>Service Charge</span>
              <span>
                ₹{invoice.service_charge_amount} + {invoice.service_charge_percent}% GST
                <span className="service-charge-percent"> ₹({invoice.service_charge_final})</span>
              </span>
            </div>
            <div className="summary-row"><span>Discount ({invoice.discount_percentage}%)</span><span>₹{invoice.discount_amount}</span></div>
            <div className="summary-row total">
              <span>Grand Total</span>
              <span className="view-invoice-final-amount">₹{invoice.final_amount}</span>
            </div>
          </div>
        </section>

        <footer className="invoice-footer">
          <p>Thank you for your business!</p>
        </footer>
      </div>
    </div>
  );
};

export default InvoiceViewPage;

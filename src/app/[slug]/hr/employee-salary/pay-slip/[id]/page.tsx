'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  useFetchPaySlipByIdQuery,
  useDownloadPaySlipPdfQuery,
} from '@/slices/employe/employe';

function Page() {
  const params = useParams() as { id?: string };
  const id = Number(params?.id || 0);

  const { currentData } = useFetchPaySlipByIdQuery(id, {
    skip: isNaN(id) || id === 0,
  });

  const { data: pdfData } = useDownloadPaySlipPdfQuery(id, {
    skip: isNaN(id) || id === 0,
  });

  const employee = currentData?.employee;

  useEffect(() => {
    document.title = 'Pay Slip';
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!pdfData?.pdf_base64) {
      alert('PDF not available.');
      return;
    }

    const base64 = pdfData.pdf_base64;
    const fileName = pdfData.file_name;

    const byteCharacters = atob(base64);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (!employee) return <p>Loading...</p>;

  return (
    <div>
      <h2>Pay Slip</h2>
      <p><b>Company:</b> {employee.company_name || 'Unknown'}</p>
      <p><b>Employee:</b> {employee.name}</p>
      <p><b>Email:</b> {employee.email}</p>
      <p><b>Phone:</b> {employee.number}</p>
      <p><b>Current Salary:</b> ₹{employee?.employee_salary?.current_salary || 'N/A'}</p>

      <hr />

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Earnings</th>
            <th>Total</th>
            <th>Deductions</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Basic Salary</td>
            <td>₹{employee?.employee_salary?.current_salary || '0.00'}</td>
            <td>-</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>

      <br />

      <button onClick={handlePrint}>Print</button>
      <button onClick={handleDownload}>Download PDF</button>
    </div>
  );
}

export default Page;

'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  useFetchPaySlipByIdQuery,
  useLazyDownloadPaySlipPdfQuery,
} from '@/slices/employe/employe';

export default function Page() {
  const params = useParams() as { id?: string };
  const id = Number(params?.id || 0);

  // 1. Always call hooks in the same order:
  const { currentData } = useFetchPaySlipByIdQuery(id, {
    skip: isNaN(id) || id === 0,
  });
  const [triggerDownload, { data: pdfData, isFetching }] =
    useLazyDownloadPaySlipPdfQuery();

  useEffect(() => {
    document.title = 'Pay Slip';
  }, []);

  // 2. Only conditionally return _after_ all hooks have run:
  if (!currentData?.employee) {
    return <p>Loading...</p>;
  }

  const employee = currentData.employee;

  // 3. Safely coerce salary so toFixed() always works:
  const rawSalary = employee.employee_salary?.current_salary;
  const parsedSalary =
    typeof rawSalary === 'string'
      ? parseFloat(rawSalary)
      : typeof rawSalary === 'number'
      ? rawSalary
      : NaN;
  const currentSalary = isNaN(parsedSalary) ? 0 : parsedSalary;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (isNaN(id) || id === 0) {
      alert('Invalid pay‑slip ID.');
      return;
    }

    try {
      const result = await triggerDownload(id).unwrap();
      const base64 = result.pdf_base64;
      const fileName = result.file_name;

      if (!base64) {
        alert('PDF not available.');
        return;
      }

      const byteCharacters = atob(base64);
      const byteArrays: Uint8Array[] = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
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
    } catch (err) {
      console.error(err);
      alert('Failed to download PDF.');
    }
  };

  return (
    <div>
      <h2>Pay Slip</h2>
      <p><b>Company:</b> {employee.company_name || 'Unknown'}</p>
      <p><b>Employee:</b> {employee.name}</p>
      <p><b>Email:</b> {employee.email}</p>
      <p><b>Phone:</b> {employee.number}</p>
      <p><b>Current Salary:</b> ₹{currentSalary.toFixed(2)}</p>

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
            <td>₹{currentSalary.toFixed(2)}</td>
            <td>-</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>

      <br />

      <button onClick={handlePrint}>Print</button>
      <button onClick={handleDownload} disabled={isFetching}>
        {isFetching ? 'Preparing…' : 'Download PDF'}
      </button>
    </div>
  );
}

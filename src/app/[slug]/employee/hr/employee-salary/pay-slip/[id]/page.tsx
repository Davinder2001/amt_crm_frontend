'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { useFetchPaySlipByIdQuery } from '@/slices/employe/employeApi';
import Loader from '@/components/common/Loader';

function Page() {
  const { setTitle } = useBreadcrumb();
  const params = useParams() as { id?: string };
  const id = Number(params?.id || 0);

  const { currentData } = useFetchPaySlipByIdQuery(id, {
    skip: isNaN(id) || id === 0,
  });

  const employee = currentData?.employee;
  const pdfBase64 = currentData?.pdf?.url;
  const fileName = currentData?.pdf?.filename || `pay-slip-${employee?.name || 'employee'}.pdf`;

  useEffect(() => {
    setTitle('Pay Slip');
  }, [setTitle]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!pdfBase64) {
      alert('PDF not available.');
      return;
    }

    const byteCharacters = atob(pdfBase64);
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

  if (!employee) return <Loader />;

  return (
    <div className="pay-slip-page">
      <button>
        <FaArrowLeft size={20} color="#009693" />
      </button>

      <div className="pay-slip-model print-area">
        <div className="payslip-header">
          <h5>Pay Slip</h5>
          <div>
            <ul>
              <li><strong>Company:</strong> {employee.company_name || 'Unknown'}</li>
              <li><strong>Employee:</strong> {employee.name}</li>
              <li><strong>Email:</strong> {employee.email}</li>
              <li><strong>Phone:</strong> {employee.number}</li>
              <li><strong>Current Salary:</strong> ₹{employee?.employee_salary?.current_salary || 'N/A'}</li>
            </ul>
          </div>
        </div>

        <table className="payslip-table">
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
      </div>

      <div className="payslip-actions">
        <button onClick={handlePrint} className="print-button">
          Print
        </button>
        <button onClick={handleDownload} className="download-button">
          Save
        </button>
      </div>

      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: fixed;
            background-color: #F1F9F9;
            display: flex;
            justify-content: center;
            align-items: center;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 999999999999;
          }
        }
      `}</style>
    </div>
  );
}

export default Page;

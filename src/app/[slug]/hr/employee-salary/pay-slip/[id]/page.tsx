'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import {
  useFetchPaySlipByIdQuery,
  useLazyDownloadPaySlipByIdQuery,
} from '@/slices/employe/employe';

function Page(): JSX.Element {
  const { setTitle } = useBreadcrumb();
  const params = useParams();
  const id = Number((params as { id: string }).id);

  const { currentData } = useFetchPaySlipByIdQuery(id);
  const [triggerDownload] = useLazyDownloadPaySlipByIdQuery();

  const employee = currentData?.employee;

  useEffect(() => {
    setTitle('Pay Slip');
  }, [setTitle]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      const response = await triggerDownload(id).unwrap();

      if (response?.pdf?.url) {
        const fileResponse = await fetch(response.pdf.url);
        const blob = await fileResponse.blob();

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = response.pdf.filename || `pay-slip-${employee?.name || 'employee'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert('PDF download link not found.');
      }
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Error downloading PDF');
    }
  };

  if (!employee) return <p>Loading...</p>;

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

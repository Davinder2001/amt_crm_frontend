'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useFetchPaySlipByIdQuery, useGenerateSalaryMutation } from '@/slices';
import LoadingState from '@/components/common/LoadingState';

export default function Page() {
  const { id } = useParams();
  const { currentData } = useFetchPaySlipByIdQuery(Number(id));
  const [generateSalary, { isLoading: isGenerating }] = useGenerateSalaryMutation();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  if (!currentData?.employee) {
    return <LoadingState />;
  }

  const employee = currentData.employee;

  const handleGenerateSalary = async () => {
    try {
      const response = await generateSalary({ id: Number(id) }).unwrap();

      if (response.status) {
        // Create a blob from the base64 PDF
        const byteCharacters = atob(response.pdf_base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Create URL for the blob
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);

        // Automatically download it
        const link = document.createElement('a');
        link.href = url;
        link.download = response.file_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error generating salary:', error);
      // Handle error (show toast, etc.)
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Pay Slip</h2>
      <div className="mb-6">
        <p><b>Company:</b> {employee.company_name || 'Unknown'}</p>
        <p><b>Employee:</b> {employee.name}</p>
        <p><b>Email:</b> {employee.email}</p>
        <p><b>Phone:</b> {employee.number}</p>
        <p><b>Current Salary:</b> ₹{employee.employee_salary?.current_salary}</p>
      </div>

      <button
        onClick={handleGenerateSalary}
        disabled={isGenerating}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {isGenerating ? 'Generating...' : 'Generate Salary Slip'}
      </button>

      {pdfUrl && (
        <div className="mt-6">
          <iframe
            src={pdfUrl}
            width="100%"
            height="500px"
            className="border"
            title="Salary Slip"
          />
        </div>
      )}
    </div>
  );
}
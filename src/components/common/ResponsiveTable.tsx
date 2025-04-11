'use client';

import React, { useState } from 'react';

type Column<T> = {
  label: string;
  key?: keyof T;
  render?: (item: T, index: number) => React.ReactNode;
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  itemsPerPage?: number;
};

function ResponsiveTable<T>({ data, columns, itemsPerPage = 10 }: Props<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const shouldShowPagination = totalPages > 1 && data.length > itemsPerPage;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="responsive-table">
      {/* Table View */}
      <div className="table-view">
        <table>
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr key={index}>
                {columns.map((col, i) => (
                  <td key={i}>
                    {col.render
                      ? col.render(item, index)
                      : col.key
                        ? String(item[col.key])
                        : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card View */}
      <div className="card-view">
        {currentData.map((item, index) => (
          <div key={index} className="t-card">
            {columns.map((col, i) => (
              <div key={i} className="card-row">
                <strong>{col.label}: </strong>
                <span>
                  {col.render
                    ? col.render(item, index)
                    : col.key
                      ? String(item[col.key])
                      : ''}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {shouldShowPagination && (
        <div className="pagination-controls">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ResponsiveTable;

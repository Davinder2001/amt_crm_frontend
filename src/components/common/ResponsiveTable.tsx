'use client';

import React, { useEffect, useState } from 'react';
import {
  FaEllipsisH,
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
} from 'react-icons/fa';

type Column<T> = {
  label: string;
  key?: keyof T;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
};

type Props<T extends { id: number; name?: string }> = {
  data: T[];
  columns: Column<T>[];
  itemsPerPage?: number;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onView: (id: number) => void;
};


function ResponsiveTable<T extends { id: number; name?: string }>({
  data,
  columns,
  itemsPerPage = 10,
  onDelete,
  onEdit,
  onView,
}: Props<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [openActionCard, setOpenActionCard] = useState<number | null>(null);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const shouldShowPagination = totalPages > 1 && data.length > itemsPerPage;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [data, currentPage, itemsPerPage]);

  const toggleExpand = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
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
            {/* Card Header */}
            <div className="card-header">
              <FaEllipsisH
                className="ellipsis-icon"
                onClick={() =>
                  setOpenActionCard(openActionCard === index ? null : index)
                }
              />
              {openActionCard === index && (
                <div className="card-actions">
                  <FaEdit
                    className="action-icon edit"
                    onClick={() => onEdit(item.id)}
                  />
                  <FaTrash
                    className="action-icon delete"
                    onClick={() => onDelete(item.id)}
                  />
                </div>
              )}
            </div>

            {/* Card Content - 2-3 items */}
            <div className="card-body">
              {columns.slice(0, 3).map((col, i) => (
                <div key={i} className={`card-row ${col.className || ''}`}>
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

              {expandedCard === index && (
                <div className="expanded-content">
                  {columns.slice(3).map((col, i) => (
                    <div key={i} className={`card-row ${col.className || ''}`}>
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
              )}
            </div>

            {/* Card Footer */}
            <div className="card-footer">
              <button className="expand-text" onClick={() => toggleExpand(index)}>
                {expandedCard === index ? 'Collapse' : 'Expand'}
              </button>
              <div className="go-button" onClick={() => onView(item.id)}>
                <FaExternalLinkAlt color="#007bff" size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {shouldShowPagination && (
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
      <style jsx>{`
      .responsive-table {
  

  .t-card {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1rem;
    position: relative;
    background: #fff;

    .card-header {
      display: flex;
      justify-content: flex-end;
      position: relative;

      .ellipsis-icon {
        cursor: pointer;
      }

      .card-actions {
        position: absolute;
        top: 0;
        right: 25px;
        background: #f9f9f9;
        padding: 5px 10px;
        border-radius: 4px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 10px;

        .action-icon {
          margin: 0 5px;
          cursor: pointer;

          &.edit {
            color: green;
          }

          &.delete {
            color: red;
          }
        }
      }
    }

    .card-body {
      margin-top: 0.5rem;

      .card-row {
        margin-bottom: 0.4rem;

        strong {
          margin-right: 0.5rem;
        }
      }

      .expanded-content {
        margin-top: 0.75rem;
        background: #f8f8f8;
        padding: 0.5rem;
        border-radius: 4px;
      }
    }

    .card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e0e0e0;

  .expand-text {
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
  }

  .go-button {
    cursor: pointer;
  }
}

  }
}

      `}</style>
    </div>
  );
}

export default ResponsiveTable;

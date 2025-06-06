'use client';

import React, { useEffect, useState } from 'react';
import {
  FaEllipsisH,
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import ConfirmDialog from './ConfirmDialog'; // adjust path if needed
import { useDragScroll } from '@/components/common/useDragScroll'

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
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
  onView?: (id: number) => void;
  storageKey?: string;
};


function ResponsiveTable<T extends { id: number; name?: string }>({
  data,
  columns,
  itemsPerPage = 10,
  onDelete,
  onEdit,
  onView,
  storageKey,
}: Props<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [openActionCard, setOpenActionCard] = useState<number | null>(null);
  const { ref, handleMouseDown, wasDraggedRef } = useDragScroll();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const shouldShowPagination = totalPages > 1 && data.length > itemsPerPage;

  useEffect(() => {
    if (storageKey) {
      const savedPage = localStorage.getItem(storageKey);
      if (savedPage) {
        const parsed = parseInt(savedPage, 10);
        if (!isNaN(parsed)) {
          setCurrentPage(parsed);
        }
      }
    }
  }, [storageKey]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (storageKey) {
      localStorage.setItem(storageKey, String(newPage));
    }
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
      <div className="table-view"
        ref={ref}
        onMouseDown={handleMouseDown}
        style={{ width: '100%', overflow: 'auto', whiteSpace: 'nowrap' }}>
        <table>
          <thead>
            <tr>
              <th>S.N.</th>
              {columns.map((col, i) => (
                <th key={i}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => {
              const serialNumber = startIndex + index + 1;
              return (
                <tr key={index} onClick={(e) => {
                  if (wasDraggedRef.current) {
                    wasDraggedRef.current = false; // reset after suppressing click
                    return;
                  }

                  const target = e.target as HTMLElement;
                  if (
                    target.closest('button') ||
                    target.closest('svg') ||
                    target.closest('.action-icon') ||
                    target.closest('.ellipsis-icon') ||
                    target.closest('select')
                  ) {
                    return;
                  }

                  if (onView) onView(item.id);
                }}>
                  <td>{serialNumber}</td>
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
              )
            })}
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
                    onClick={() => onEdit && onEdit(item.id)}
                  />
                  <FaTrash
                    className="action-icon delete"
                    onClick={() => {
                      setDeleteTargetId(item.id);
                      setShowConfirmDialog(true);
                    }}
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
              {onView && (
                <div className="go-button" onClick={() => onView(item.id)}>
                  <FaExternalLinkAlt color="#007bff" size={18} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {shouldShowPagination && (
        <div className="pagination-controls">
          <div className="pagination-track">
            <button
              className="nav-arrow"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={currentPage === i + 1 ? 'active' : ''}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="nav-arrow"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              →
            </button>

            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>
      )}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        message="Are you sure you want to delete this item?"
        onConfirm={async () => {
          if (deleteTargetId !== null && onDelete) {
            await onDelete(deleteTargetId);
          }
          setShowConfirmDialog(false);
          setDeleteTargetId(null);
        }}
        onCancel={() => {
          setShowConfirmDialog(false);
          setDeleteTargetId(null);
        }}
        type="delete"
      />
    </div>
  );
}

export default ResponsiveTable;
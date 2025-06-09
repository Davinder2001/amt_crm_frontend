'use client';

import React, { useEffect, useState } from 'react';
import {
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
  FaCheckSquare,
  FaSquare,
} from 'react-icons/fa';
import ConfirmDialog from './ConfirmDialog';
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
  onBulkDelete?: (ids: number[]) => void;
  onEdit?: (id: number) => void;
  onView?: (id: number) => void;
  storageKey?: string;
  cardViewKey?: keyof T;
  showBulkActions?: boolean;
};

function ResponsiveTable<T extends { id: number; name?: string }>({
  data,
  columns,
  itemsPerPage = 10,
  onDelete,
  onBulkDelete,
  onEdit,
  onView,
  storageKey,
  cardViewKey,
  showBulkActions = false,
}: Props<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const { ref, handleMouseDown, wasDraggedRef } = useDragScroll();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [showBulkConfirmDialog, setShowBulkConfirmDialog] = useState(false);

  const [selectedItems, setSelectedItems] = useState<{
    all: boolean;
    ids: number[];
    page: number;
  }>({ all: false, ids: [], page: 1 });

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
          setSelectedItems(prev => ({ ...prev, page: parsed }));
        }
      }
    }
  }, [storageKey]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    setSelectedItems(prev => ({ ...prev, page: newPage }));
    if (storageKey) {
      localStorage.setItem(storageKey, String(newPage));
    }
  };

  useEffect(() => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
      setSelectedItems(prev => ({ ...prev, page: totalPages }));
    }
  }, [data, currentPage, itemsPerPage]);

  const toggleExpand = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const toggleSelectAll = () => {
    if (selectedItems.all) {
      // Deselect all
      setSelectedItems({ all: false, ids: [], page: currentPage });
    } else {
      // Select all on current page
      const pageIds = currentData.map(item => item.id);
      setSelectedItems({ all: false, ids: pageIds, page: currentPage });
    }
  };

  const toggleSelectAllPages = () => {
    if (selectedItems.all) {
      // Deselect all
      setSelectedItems({ all: false, ids: [], page: currentPage });
    } else {
      // Select all across all pages
      setSelectedItems({ all: true, ids: data.map(item => item.id), page: currentPage });
    }
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems(prev => {
      if (prev.all) {
        // If "all" is selected, we need to exclude this item
        const newIds = prev.ids.filter(itemId => itemId !== id);
        return { all: false, ids: newIds, page: prev.page };
      } else {
        // Toggle this item in the selection
        const newIds = prev.ids.includes(id)
          ? prev.ids.filter(itemId => itemId !== id)
          : [...prev.ids, id];
        return { ...prev, ids: newIds };
      }
    });
  };

  const handleBulkDelete = async () => {
    if (onBulkDelete) {
      const idsToDelete = selectedItems.all
        ? data.map(item => item.id)
        : selectedItems.ids;
      await onBulkDelete(idsToDelete);
      setSelectedItems({ all: false, ids: [], page: currentPage });
      setShowBulkConfirmDialog(false);
    }
  };

  const getSelectedCount = () => {
    if (selectedItems.all) {
      return data.length;
    }
    return selectedItems.ids.length;
  };

  const isItemSelected = (id: number) => {
    if (selectedItems.all) return true;
    return selectedItems.ids.includes(id);
  };

  return (
    <div className="responsive-table">
      {/* Bulk Actions Toolbar */}
      {showBulkActions && getSelectedCount() > 0 && (
        <div className="bulk-actions-toolbar">
          <div className="selected-count">
            {getSelectedCount()} item{getSelectedCount() !== 1 ? 's' : ''} selected
          </div>
          <div className="bulk-actions">
            <button
              className="bulk-delete-btn"
              onClick={() => setShowBulkConfirmDialog(true)}
            >
              <FaTrash /> Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Table View */}
      <div className="table-view"
        ref={ref}
        onMouseDown={handleMouseDown}
        style={{ width: '100%', overflow: 'auto', whiteSpace: 'nowrap' }}>
        <table>
          <thead>
            <tr>
              {showBulkActions && (
                <th>
                  <div className="select-all-container">
                    <span onClick={toggleSelectAll}>
                      {selectedItems.ids.length === currentData.length && !selectedItems.all ? (
                        <FaCheckSquare className="select-icon" />
                      ) : (
                        <FaSquare className="select-icon" />
                      )}
                    </span>
                    {totalPages > 1 && (
                      <span
                        className="select-all-pages"
                        onClick={toggleSelectAllPages}
                        title="Select all items across all pages"
                      >
                        {selectedItems.all ? (
                          <FaCheckSquare className="select-icon" />
                        ) : (
                          <FaSquare className="select-icon" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              )}
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
                    wasDraggedRef.current = false;
                    return;
                  }

                  const target = e.target as HTMLElement;
                  if (
                    target.closest('button') ||
                    target.closest('svg') ||
                    target.closest('.action-icon') ||
                    target.closest('.ellipsis-icon') ||
                    target.closest('select') ||
                    target.closest('.select-checkbox')
                  ) {
                    return;
                  }

                  if (onView) onView(item.id);
                }}>
                  {showBulkActions && (
                    <td>
                      <span
                        className="select-checkbox"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectItem(item.id);
                        }}
                      >
                        {isItemSelected(item.id) ? (
                          <FaCheckSquare className="select-icon" />
                        ) : (
                          <FaSquare className="select-icon" />
                        )}
                      </span>
                    </td>
                  )}
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
            {/* Card Content */}
            <div className="card-body">

              {cardViewKey && (
                <div className="card-row">
                  <strong>
                    {columns.find(col => col.key === cardViewKey)?.label || cardViewKey.toString()}:
                  </strong>
                  <span>{String(item[cardViewKey])}</span>
                </div>
              )}

              {expandedCard === index && (
                <div className="expanded-content">
                  {columns
                    .filter(col =>
                      col.key !== cardViewKey && col.label.toLowerCase() !== 'actions'
                    )
                    .map((col, i) => (
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
                {onView && (
                  <div className="go-button" onClick={() => onView(item.id)}>
                    <FaExternalLinkAlt color="#007bff" />
                  </div>
                )}
              </div>
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

      {/* Single Delete Confirmation */}
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

      {/* Bulk Delete Confirmation */}
      <ConfirmDialog
        isOpen={showBulkConfirmDialog}
        message={`Are you sure you want to delete ${getSelectedCount()} selected item${getSelectedCount() !== 1 ? 's' : ''}?`}
        onConfirm={handleBulkDelete}
        onCancel={() => setShowBulkConfirmDialog(false)}
        type="delete"
      />
    </div>
  );
}

export default ResponsiveTable;
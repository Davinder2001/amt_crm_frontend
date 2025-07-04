'use client';

import React, { useEffect, useState } from 'react';
import {
  FaEdit,
  FaTrash,
  FaCheckSquare,
  FaSquare,
} from 'react-icons/fa';
import ConfirmDialog from './ConfirmDialog';
import { useDragScroll } from '@/components/common/useDragScroll';

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
  showBulkActions?: boolean;
  cardView?: (item: T) => React.ReactNode;
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
  showBulkActions = false,
  cardView,
}: Props<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const { ref, handleMouseDown, wasDraggedRef } = useDragScroll();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [showBulkConfirmDialog, setShowBulkConfirmDialog] = useState(false);
  const [showIndividualCheckboxes, setShowIndividualCheckboxes] = useState(false);
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
    if (storageKey) localStorage.setItem(storageKey, String(newPage));
  };

  useEffect(() => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
      setSelectedItems(prev => ({ ...prev, page: totalPages }));
    }
  }, [data, currentPage, itemsPerPage]);

  const toggleSelectAll = () => {
    setSelectedItems(prev => {
      if (prev.all) {
        return { all: false, ids: [], page: currentPage };
      } else if (prev.ids.length === currentData.length) {
        return { all: false, ids: [], page: currentPage };
      } else {
        const pageIds = currentData.map(item => item.id);
        return { all: false, ids: pageIds, page: currentPage };
      }
    });
    setShowIndividualCheckboxes(true);
  };

  const toggleSelectAllPages = () => {
    setSelectedItems(prev => ({
      all: !prev.all,
      ids: [],
      page: currentPage
    }));
    setShowIndividualCheckboxes(true);
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems(prev => {
      if (prev.all) {
        // When "all" is selected, unselecting an item means we're excluding it
        const newIds = prev.ids.includes(id)
          ? prev.ids.filter(itemId => itemId !== id)
          : [...prev.ids, id];
        return { ...prev, ids: newIds };
      } else {
        // When "all" is not selected, normal selection behavior
        const newIds = prev.ids.includes(id)
          ? prev.ids.filter(itemId => itemId !== id)
          : [...prev.ids, id];
        return { all: false, ids: newIds, page: currentPage };
      }
    });
    setShowIndividualCheckboxes(true);
  };

  const handleBulkDelete = async () => {
    if (onBulkDelete) {
      const idsToDelete = selectedItems.all
        ? data.filter(item => !selectedItems.ids.includes(item.id)).map(item => item.id)
        : selectedItems.ids;
      await onBulkDelete(idsToDelete);
      setSelectedItems({ all: false, ids: [], page: currentPage });
      setShowBulkConfirmDialog(false);
    }
  };

  const getSelectedCount = React.useCallback(() => {
    if (selectedItems.all) {
      return data.length - selectedItems.ids.length;
    } else {
      return selectedItems.ids.length;
    }
  }, [selectedItems, data.length]);

  const isItemSelected = (id: number) => {
    if (selectedItems.all) {
      return !selectedItems.ids.includes(id);
    } else {
      return selectedItems.ids.includes(id);
    }
  };

  useEffect(() => {
    if (getSelectedCount() === 0) {
      setShowIndividualCheckboxes(false);
    }
  }, [selectedItems, getSelectedCount]);

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
      <div
        className="table-view"
        ref={ref}
        onMouseDown={handleMouseDown}
        style={{ width: '100%', overflow: 'auto', whiteSpace: 'nowrap' }}
      >
        <table>
          <thead>
            <tr>
              {showBulkActions && (
                <th className='bulk-action-th'>
                  <div className="select-all-container">
                    <span onClick={toggleSelectAll} title="Select current page">
                      {selectedItems.all ? (
                        <FaSquare className="select-icon" />
                      ) : selectedItems.ids.length === currentData.length ? (
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
            {currentData.map((item, index) => (
              <tr
                key={index}
                onClick={(e) => {
                  if (wasDraggedRef.current ||
                    (e.target as HTMLElement).closest('button, svg, .action-icon, select, .select-checkbox')) {
                    wasDraggedRef.current = false;
                    return;
                  }
                  if (onView) onView(item.id);
                }}
              >
                {showBulkActions && (
                  <td className='bulk-action-td'>
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
                <td>{startIndex + index + 1}</td>
                {columns.map((col, i) => (
                  <td key={i}>
                    {col.render
                      ? col.render(item, index)
                      : col.key
                        ? item[col.key] != null
                          ? String(item[col.key])
                          : 'N/A'
                        : 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card View - Always expanded with bulk selection */}
      <div className="card-view">
        {showBulkActions && (
          <div className="card-bulk-header">
            <div className="select-all-container">
              <span onClick={toggleSelectAll} title="Select current page">
                {selectedItems.all ? (
                  <FaSquare className="select-icon" />
                ) : selectedItems.ids.length === currentData.length ? (
                  <FaCheckSquare className="select-icon" />
                ) : (
                  <FaSquare className="select-icon" />
                )}
                <span className="select-label">Select Current Page</span>
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
                  <span className="select-label">Select All Items</span>
                </span>
              )}
            </div>
          </div>
        )}
        {currentData.map((item, index) => (
          <div key={index} className="t-card">
            {/* Overlay for bulk selection */}
            {showBulkActions && showIndividualCheckboxes && (
              <div className="card-bulk-overlay">
                <div className="card-bulk-checkbox">
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
                </div>
              </div>
            )}

            <div className="card-body" onClick={() => onView && onView(item.id)}>
              {cardView && cardView(item)}
            </div>

            <div className="card-footer">
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
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {shouldShowPagination && (
        <div className="pagination-controls">
          <div className="pagination-track">
            <div className="nav-arrow-wrapper">
              <button
                className="nav-arrow"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ←
              </button>
              <div className="pagination-btns-counts">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={currentPage === i + 1 ? 'active' : ''}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                className="nav-arrow"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                →
              </button>
            </div>
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
          if (deleteTargetId !== null && onDelete) await onDelete(deleteTargetId);
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
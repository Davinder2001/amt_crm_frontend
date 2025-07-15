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
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  counts?: number;
  onDelete?: (id: number) => void;
  onBulkDelete?: (ids: number[]) => void;
  onEdit?: (id: number) => void;
  onView?: (id: number) => void;
  showBulkActions?: boolean;
  cardView?: (item: T) => React.ReactNode;
};

function ResponsiveTable<T extends { id: number; name?: string }>({
  data,
  columns,
  pagination,
  onPageChange,
  onPerPageChange,
  counts,
  onDelete,
  onBulkDelete,
  onEdit,
  onView,
  showBulkActions = false,
  cardView,
}: Props<T>) {
  const { ref, handleMouseDown, wasDraggedRef } = useDragScroll();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [showBulkConfirmDialog, setShowBulkConfirmDialog] = useState(false);
  const [showIndividualCheckboxes, setShowIndividualCheckboxes] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{
    all: boolean;
    ids: number[];
  }>({ all: false, ids: [] });

  const currentPage = pagination?.current_page || 1;
  const perPage = pagination?.per_page || counts || 10;
  const totalItems = pagination?.total || data.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const shouldShowPagination = totalPages > 1;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    if (onPageChange) onPageChange(newPage);
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = parseInt(e.target.value, counts);
    if (onPerPageChange) onPerPageChange(newPerPage);
  };

  const toggleSelectAll = () => {
    setSelectedItems(prev => {
      if (prev.all) {
        return { all: false, ids: [] };
      } else if (prev.ids.length === data.length) {
        return { all: false, ids: [] };
      } else {
        const pageIds = data.map(item => item.id);
        return { all: false, ids: pageIds };
      }
    });
    setShowIndividualCheckboxes(true);
  };

  const toggleSelectAllPages = () => {
    setSelectedItems(prev => ({
      all: !prev.all,
      ids: []
    }));
    setShowIndividualCheckboxes(true);
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems(prev => {
      if (prev.all) {
        const newIds = prev.ids.includes(id)
          ? prev.ids.filter(itemId => itemId !== id)
          : [...prev.ids, id];
        return { ...prev, ids: newIds };
      } else {
        const newIds = prev.ids.includes(id)
          ? prev.ids.filter(itemId => itemId !== id)
          : [...prev.ids, id];
        return { all: false, ids: newIds };
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
      setSelectedItems({ all: false, ids: [] });
      setShowBulkConfirmDialog(false);
    }
  };

  const getSelectedCount = React.useCallback(() => {
    if (selectedItems.all) {
      return pagination?.total ? pagination.total - selectedItems.ids.length : 0;
    } else {
      return selectedItems.ids.length;
    }
  }, [selectedItems, pagination?.total]);

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
                        <FaSquare className="select-icon" size={18} />
                      ) : selectedItems.ids.length === data.length ? (
                        <FaCheckSquare className="select-icon" size={18} />
                      ) : (
                        <FaSquare className="select-icon" size={18} />
                      )}
                    </span>
                    {totalPages > 1 && (
                      <span
                        className="select-all-pages"
                        onClick={toggleSelectAllPages}
                        title="Select all items across all pages"
                      >
                        {selectedItems.all ? (
                          <FaCheckSquare className="select-icon" size={18} />
                        ) : (
                          <FaSquare className="select-icon" size={18} />
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
            {data.map((item, index) => (
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
                        <FaCheckSquare className="select-icon" size={18} />
                      ) : (
                        <FaSquare className="select-icon" size={18} />
                      )}
                    </span>
                  </td>
                )}
                <td>{(currentPage - 1) * perPage + index + 1}</td>
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
      <div className="card-view-section">
        {showBulkActions && (
          <div className="card-bulk-header">
            <div className="select-all-container">
              <span onClick={toggleSelectAll} title="Select current page">
                {selectedItems.all ? (
                  <FaSquare className="select-icon" />
                ) : selectedItems.ids.length === data.length ? (
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
        <div className="card-view">
          {data.map((item, index) => (
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

              <div className="card-body"
                onClick={(e) => {
                  if (wasDraggedRef.current ||
                    (e.target as HTMLElement).closest('button, svg, .action-icon, select, .select-checkbox')) {
                    wasDraggedRef.current = false;
                    return;
                  }
                  if (onView) onView(item.id);
                }}
              >
                {cardView && cardView(item)}
              </div>

              {
                (onEdit || onDelete) && (
                  <div className="card-footer">
                    <div className="card-actions">
                      {onEdit && (
                        <FaEdit
                          className="action-icon edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item.id);
                          }}
                        />
                      )}
                      {onDelete && (
                        <FaTrash
                          className="action-icon delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTargetId(item.id);
                            setShowConfirmDialog(true);
                          }}
                        />
                      )}
                    </div>
                  </div>
                )
              }
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination-controls">
        {/* Empty div for left alignment */}
        <div />

        {shouldShowPagination && (
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
        )}

        {/* Per Page Selector - Right aligned */}
        <div className="per-page-selector-wrapper">
          <span className="per-page-label">Items per page:</span>
          <div className="per-page-selector">
            <select
              value={perPage}
              onChange={handlePerPageChange}
              className="per-page-select"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

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
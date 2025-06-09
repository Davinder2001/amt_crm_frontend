import React from 'react';
import { FaCheckSquare, FaRegSquare, FaTimes } from 'react-icons/fa';
import { FiFilter, FiColumns, FiDownloadCloud, FiSliders } from 'react-icons/fi';

interface Column {
    key: string;
    label: string;
}

interface Action {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
}

type FilterType = 'search' | 'multi-select';

interface Filter {
    key: string;
    label: string;
    type: FilterType;
    options?: string[];
}

interface TableToolbarProps {
    filters?: Filter[];
    onFilterChange?: (field: string, value: string | string[], type: FilterType) => void;
    columns?: Column[];
    visibleColumns?: string[];
    onColumnToggle?: (columnKey: string) => void;
    actions?: Action[];
    downloadActions?: Action[];
    extraLinks?: Action[];
    onResetColumns?: () => void;
    activeFilterType?: string | null;
    onFilterTypeChange?: (filterKey: string | null) => void;
    showBulkActions?: boolean;
    onToggleBulkActions?: (enabled: boolean) => void;
}

const TableToolbar: React.FC<TableToolbarProps> = ({
    filters,
    onFilterChange,
    columns,
    visibleColumns = [],
    onColumnToggle,
    actions,
    downloadActions,
    extraLinks,
    onResetColumns,
    activeFilterType,
    onFilterTypeChange,
    showBulkActions,
    onToggleBulkActions,
}) => {
    const [selectedFilters, setSelectedFilters] = React.useState<Record<string, string[]>>({});
    const [searchValue, setSearchValue] = React.useState<string>('');
    const [localActiveFilterType, setLocalActiveFilterType] = React.useState<string | null>(null);

    const currentActiveFilterType = activeFilterType !== undefined ? activeFilterType : localActiveFilterType;
    const setActiveFilterType: (filterKey: string | null) => void = onFilterTypeChange || setLocalActiveFilterType;

    const handleFilterTypeSelect = (filterKey: string) => {
        if (currentActiveFilterType === filterKey) {
            setActiveFilterType(null);
        } else {
            setActiveFilterType(filterKey);
        }
    };

    const handleMultiSelectChange = (field: string, value: string, checked: boolean) => {
        const updatedFilters = { ...selectedFilters };
        if (checked) {
            updatedFilters[field] = [...(updatedFilters[field] || []), value];
        } else {
            updatedFilters[field] = updatedFilters[field]?.filter((item) => item !== value) || [];
        }
        setSelectedFilters(updatedFilters);

        if (onFilterChange) {
            onFilterChange(field, updatedFilters[field] || [], 'multi-select');
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);

        if (onFilterChange && currentActiveFilterType) {
            const filterConfig = filters?.find(f => f.key === currentActiveFilterType);
            if (filterConfig) {
                onFilterChange(filterConfig.key, value, 'search');
            }
        }
    };

    const renderActiveFilterInput = () => {
        if (!currentActiveFilterType) return null;

        const filterConfig = filters?.find(f => f.key === currentActiveFilterType);
        if (!filterConfig) return null;

        // In the TableToolbar component, update the search input rendering:
        if (filterConfig.type === 'search') {
            return (
                <div className="search-filter-container">
                    <input
                        type="text"
                        placeholder="Search across all columns..."
                        value={searchValue}
                        onChange={handleSearchChange}
                        className="search-filter-input"
                    />
                    {searchValue && (
                        <button
                            onClick={() => {
                                setSearchValue('');
                                if (onFilterChange) {
                                    onFilterChange(filterConfig.key, '', 'search');
                                }
                            }}
                            className="clear-search-btn"
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>
            );
        }

        return null;
    };

    return (
        <div className="toolbar">
            <div className="left-group">
                {filters && filters.length > 0 && (
                    <>
                        <div className="dropdown dropdown-left hover-group">
                            <button className="toolbar-btn">
                                <FiFilter />
                                <span className='hide-mobile'>Filter</span>
                            </button>
                            <div className="dropdown-content">
                                <div
                                    className={`bulk-toggle-btn ${showBulkActions ? 'active' : ''}`}
                                    onClick={() => onToggleBulkActions?.(!showBulkActions)}
                                >
                                    {showBulkActions ? (
                                        <FaCheckSquare className="icon-checked" />
                                    ) : (
                                        <FaRegSquare className="icon-unchecked" />
                                    )}
                                    <span className="label">{showBulkActions ? 'Exit Bulk Mode' : 'Bulk Actions'}</span>
                                </div>
                                {filters.map((filter) => (
                                    <div key={filter.key} className="section">
                                        <label className="filter-type-option">
                                            <input
                                                type="checkbox"
                                                checked={currentActiveFilterType === filter.key}
                                                onChange={() => handleFilterTypeSelect(filter.key)}
                                            />
                                            {filter.label}
                                        </label>

                                        {currentActiveFilterType === filter.key && filter.type === 'multi-select' && (
                                            <div className="filter-options-list">
                                                {filter.options?.map((opt) => (
                                                    <label key={opt} className="option">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedFilters[filter.key]?.includes(opt) || false}
                                                            onChange={(e) =>
                                                                handleMultiSelectChange(filter.key, opt, e.target.checked)
                                                            }
                                                        />
                                                        {opt}
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {renderActiveFilterInput()}
                    </>
                )}
            </div>

            <div className="right-group">
                {columns && columns.length > 0 && (
                    <div className="dropdown dropdown-right hover-group">
                        <button className="toolbar-btn">
                            <FiColumns />
                            <span className='hide_col'>Columns</span>
                        </button>
                        <div className="dropdown-content">
                            <div className="reset-columns" onClick={onResetColumns}>
                                Reset to Default
                            </div>
                            {columns.map((col) => (
                                <label key={col.key} className="option">
                                    <input
                                        type="checkbox"
                                        checked={visibleColumns.includes(col.key)}
                                        onChange={() => onColumnToggle?.(col.key)}
                                    />
                                    {col.label}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {downloadActions && downloadActions.length > 0 && (
                    <div className="dropdown dropdown-right hover-group">
                        <button className="toolbar-btn">
                            <FiDownloadCloud size={18.98} style={{ strokeWidth: 3 }} />
                        </button>
                        <div className="dropdown-content">
                            <ul className="action-list">
                                {downloadActions.map((action, i) => (
                                    <li key={i} onClick={action.onClick} className="action-item">
                                        {action.icon && <span className="a-icon">{action.icon}</span>}
                                        <span>{action.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {actions && actions?.length > 0 ?
                    <div className="action-icons-horizontal">
                        {actions.map((action, i) => (
                            <div key={i} className="action-tooltip">
                                <button
                                    onClick={action.onClick}
                                    className="toolbar-btn"
                                >
                                    <i>{action.icon}</i>
                                    <span>{action.label}</span>
                                </button>
                                <span className="tooltip-text">{action.label}</span>
                            </div>
                        ))}
                    </div>
                    : ''
                }

                {extraLinks && extraLinks.length > 0 && (
                    <div className="dropdown dropdown-right hover-group extra-links">
                        <button className="toolbar-btn">
                            <FiSliders size={18} />
                        </button>
                        <div className="dropdown-content">
                            <ul className="action-list">
                                {extraLinks.map((action, i) => (
                                    <li key={i} onClick={action.onClick} className="action-item">
                                        {action.icon && <span className="a-icon">{action.icon}</span>}
                                        <span>{action.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                .reset-columns {
                    padding: 8px 12px;
                    cursor: pointer;
                    background: #f8f7fa;
                    font-weight: 500;
                    color: #384b70;
                }
                .reset-columns:hover {
                    background: #e0e0e0;
                }
                .dropdown-content {
                    max-height: 400px;
                    overflow-y: auto;
                }
                .action-icons-horizontal {
                    display: flex;
                    gap: 10px;
                }
                .action-tooltip {
                    position: relative;
                    display: inline-block;
                }
                .tooltip-text {
                    visibility: hidden;
                    width: max-content;
                    background-color: black;
                    color: #fff;
                    text-align: center;
                    border-radius: 4px;
                    padding: 5px 8px;
                    position: absolute;
                    z-index: 1;
                    bottom: 30px;
                    right: 0;
                    transform: translateX(-0%);
                    opacity: 0;
                    transition: opacity 0.2s;
                    white-space: nowrap;
                    font-size: 12px;
                    display: none;
                }
                    @media (max-width: 768px) {
                    .tooltip-text {
                    display: block;
                    }
            }
                .action-tooltip:hover .tooltip-text {
                    visibility: visible;
                    opacity: 1;
                }
            `}</style>
        </div>
    );
};

export default TableToolbar;
import React, { useState, useEffect } from 'react';
import { FiFilter, FiColumns, FiSettings } from 'react-icons/fi';

type FilterOptions = Record<string, string[]>;

interface Column {
    key: string;
    label: string;
}

interface Action {
    label?: string;
    icon?: React.ReactNode;
    onClick: () => void;
}

interface TableToolbarProps {
    filters?: FilterOptions;
    onFilterChange?: (field: string, value: string, checked: boolean) => void;
    columns?: Column[];
    visibleColumns?: string[]; // Columns that should be visible
    onColumnToggle?: (columnKey: string) => void;
    actions?: Action[];
    downloadActions?: Action[];
}

const TableToolbar: React.FC<TableToolbarProps> = ({
    filters,
    onFilterChange,
    columns,
    onColumnToggle,
    actions,
    downloadActions,
}) => {
    const [selectedFilters, setSelectedFilters] = useState<FilterOptions>(() => {
        const savedFilters = localStorage.getItem('selectedFilters');
        return savedFilters ? JSON.parse(savedFilters) : {};
    });
    const [selectedColumns, setSelectedColumns] = useState<string[]>(() => {
        const savedColumns = localStorage.getItem('selectedColumns');
        if (savedColumns) {
            return JSON.parse(savedColumns);
        } else {
            return columns?.map(col => col.key) || []; // Default to all columns being visible
        }
    });


    // Handle filter changes
    const handleFilterChange = (field: string, value: string, checked: boolean) => {
        const updatedFilters = { ...selectedFilters };
        if (checked) {
            updatedFilters[field] = [...(updatedFilters[field] || []), value];
        } else {
            updatedFilters[field] = updatedFilters[field]?.filter((item) => item !== value) || [];
        }
        setSelectedFilters(updatedFilters);
        localStorage.setItem('selectedFilters', JSON.stringify(updatedFilters));
        if (onFilterChange) {
            onFilterChange(field, value, checked);
        }
    };

    // Handle column visibility toggling
    const handleColumnToggle = (columnKey: string) => {
        let updatedColumns = [...selectedColumns];

        if (updatedColumns.includes(columnKey)) {
            updatedColumns = updatedColumns.filter((key) => key !== columnKey);
        } else {
            updatedColumns.push(columnKey);
        }

        setSelectedColumns(updatedColumns);
        localStorage.setItem('selectedColumns', JSON.stringify(updatedColumns));

        // Apply the column toggle to the table (this should call your `onColumnToggle` prop)
        if (onColumnToggle) {
            onColumnToggle(columnKey);
        }
    };

    // Reset to default state
    // const handleReset = () => {
    //     setLoading(true);
    //     setSelectedFilters({});
    //     setSelectedColumns(columns.map(col => col.key)); // Reset to default all columns
    //     localStorage.removeItem('selectedFilters');
    //     localStorage.setItem('selectedColumns', JSON.stringify(columns.map(col => col.key))); // Reset to default columns
    //     setTimeout(() => setLoading(false), 1000); // Simulate reset delay
    // };

    // Syncing localStorage with state on changes
    useEffect(() => {
        // Sync selected filters and columns with localStorage
        localStorage.setItem('selectedFilters', JSON.stringify(selectedFilters));
        localStorage.setItem('selectedColumns', JSON.stringify(selectedColumns));
    }, [selectedFilters, selectedColumns]);

    // Load selected columns from localStorage on page load
    useEffect(() => {
        const savedColumns = JSON.parse(localStorage.getItem('selectedColumns') || '[]');
        if (savedColumns.length > 0) {
            setSelectedColumns(savedColumns); // Apply saved selected columns
        }
    }, []);

    return (
        <div className="toolbar">
            {/* Left Side: Filter */}
            <div className="left-group">
                {filters && Object.keys(filters).length > 0 && (
                    <div className="dropdown dropdown-left hover-group">
                        <button className="toolbar-btn">
                            <FiFilter />
                            <span className='hide-mobile'>Filter</span>
                        </button>
                        <div className="dropdown-content">
                            {Object.entries(filters ?? {}).map(([field, options]) => (
                                <div key={field} className="section">
                                    <p className="title">{field}</p>
                                    {options.map((opt) => (
                                        <label key={opt} className="option">
                                            <input
                                                type="checkbox"
                                                checked={selectedFilters[field]?.includes(opt) || false}
                                                onChange={(e) =>
                                                    handleFilterChange(field, opt, e.target.checked)
                                                }
                                            />
                                            {opt}
                                        </label>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Side: Columns & Actions */}
            <div className="right-group">
                {columns && columns.length > 0 && (
                    <div className="dropdown dropdown-right hover-group">
                        <button className="toolbar-btn">
                            <FiColumns />
                            <span>Columns</span>
                        </button>
                        <div className="dropdown-content">
                            {columns?.map((col) => (
                                <label key={col.key} className="option">
                                    <input
                                        type="checkbox"
                                        checked={selectedColumns.includes(col.key)}
                                        onChange={() => handleColumnToggle(col.key)}
                                    />
                                    {col.label}
                                </label>
                            ))}
                        </div>
                    </div>
                )}
                {/* Reset Button */}
                {/* <div className="reset-group">
                    <button
                        onClick={handleReset}
                        className="reset-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="loading-spinner"></div>
                        ) : (
                            <FiRefreshCw />
                        )}
                        <span>Reset</span>
                    </button>
                </div> */}
                {/* <div className="dropdown dropdown-right">
                    <button onClick={() => toggleDropdown('actions')}
                        className={`toolbar-btn ${openDropdown === 'filter' ? 'active' : ''}`}
                    >
                        <FiSettings />
                        <span>Actions</span>
                    </button>
                    {openDropdown === 'actions' && (
                        <div className="dropdown-content show">
                            <ul className="action-list">
                                {actions && actions.map((action, i) => (
                                    <li key={i} onClick={action.onClick} className="action-item">
                                        {action.icon && <span className="a-icon">{action.icon}</span>}
                                        <span>{action.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div> */}
                {downloadActions && downloadActions.length > 0 && (
                    <div className="dropdown dropdown-right hover-group">
                        <button className="toolbar-btn">
                            <FiSettings />
                            <span className="hide-mobile">Download</span>
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

                <div className="action-icons-horizontal">
                    {actions && actions.map((action, i) => (
                        <div key={i} className="action-tooltip">
                            <button
                                onClick={action.onClick}
                                className="action-icon-btn"
                            >
                                <i>{action.icon}</i>
                                <span>{action.label}</span>
                            </button>
                            {/* <span className="tooltip-text">{action.label}</span> */}
                        </div>
                    ))}
                </div>

                <style jsx>{`
    .action-icons-horizontal {
        display: flex;
        gap: 10px;
        margin-left: 10px;
    }

    .action-tooltip {
        position: relative;
        display: inline-block;
    }

    .action-icon-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        gap: 5px;
    }

    .action-icon-btn:hover {
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
    }

    i {
        display: flex;
        align-items: center;
        justify-content: center;
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
    }

    .action-tooltip:hover .tooltip-text {
        visibility: visible;
        opacity: 1;
    }
`}</style>

            </div>
        </div>
    );
};

export default TableToolbar;

import React from 'react';
import { FiFilter, FiColumns, FiDownloadCloud, FiSliders } from 'react-icons/fi';

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
    visibleColumns?: string[];
    onColumnToggle?: (columnKey: string) => void;
    actions?: Action[];
    downloadActions?: Action[];
    extraLinks?: Action[];
    leftContent?: React.ReactNode;
    onResetColumns?: () => void;
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
}) => {
    const [selectedFilters, setSelectedFilters] = React.useState<FilterOptions>({});

    const handleFilterChange = (field: string, value: string, checked: boolean) => {
        const updatedFilters = { ...selectedFilters };
        if (checked) {
            updatedFilters[field] = [...(updatedFilters[field] || []), value];
        } else {
            updatedFilters[field] = updatedFilters[field]?.filter((item) => item !== value) || [];
        }
        setSelectedFilters(updatedFilters);
        if (onFilterChange) {
            onFilterChange(field, value, checked);
        }
    };

    return (
        <div className="toolbar">
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
                            {columns?.map((col) => (
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

                <div className="action-icons-horizontal">
                    {actions && actions.map((action, i) => (
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
                    background: #f0f0f0;
                    border-bottom: 1px solid #ddd;
                    font-weight: 500;
                    color: #333;
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
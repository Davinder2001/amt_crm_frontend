import React, { useState } from 'react';
import { FiFilter, FiColumns, FiSettings } from 'react-icons/fi';

type FilterOptions = Record<string, string[]>;

interface Column {
    key: string;
    label: string;
}

interface Action {
    label: string;
    onClick: () => void;
}

interface TableToolbarProps {
    filters: FilterOptions;
    onFilterChange: (field: string, value: string, checked: boolean) => void;
    columns: Column[];
    visibleColumns: string[];
    onColumnToggle: (columnKey: string) => void;
    actions: Action[];
}

const TableToolbar: React.FC<TableToolbarProps> = ({
    filters,
    onFilterChange,
    columns,
    visibleColumns,
    onColumnToggle,
    actions,
}) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const closeDropdown = () => setOpenDropdown(null);

    return (
        <div className="toolbar" onMouseLeave={closeDropdown}>
            {/* Left Side: Filter */}
            <div className="left-group">
                <div className="dropdown dropdown-left">
                    <button onClick={() => toggleDropdown('filter')}>
                        <FiFilter />
                        <span>Filter</span>
                    </button>
                    {openDropdown === 'filter' && (
                        <div className="dropdown-content">
                            {Object.entries(filters).map(([field, options]) => (
                                <div key={field} className="section">
                                    <p className="title">{field}</p>
                                    {options.map((opt) => (
                                        <label key={opt} className="option">
                                            <input
                                                type="checkbox"
                                                onChange={(e) =>
                                                    onFilterChange(field, opt, e.target.checked)
                                                }
                                            />
                                            {opt}
                                        </label>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side: Columns & Actions */}
            <div className="right-group">
                <div className="dropdown dropdown-right">
                    <button onClick={() => toggleDropdown('columns')}>
                        <FiColumns />
                        <span>Columns</span>
                    </button>
                    {openDropdown === 'columns' && (
                        <div className="dropdown-content">
                            {columns.map((col) => (
                                <label key={col.key} className="option">
                                    <input
                                        type="checkbox"
                                        checked={visibleColumns.includes(col.key)}
                                        onChange={() => onColumnToggle(col.key)}
                                    />
                                    {col.label}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="dropdown dropdown-right">
                    <button onClick={() => toggleDropdown('actions')}>
                        <FiSettings />
                        <span>Actions</span>
                    </button>
                    {openDropdown === 'actions' && (
                        <div className="dropdown-content">
                            {actions.map((action, i) => (
                                <button key={i} onClick={action.onClick} className="action">
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .toolbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-family: "DMSans", sans-serif;
                }

                .left-group,
                .right-group {
                    display: flex;
                    gap: 1rem;
                }

                .dropdown {
                    position: relative;
                }

                .dropdown button {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: #009693;
                    color: #ffffff;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 500;
                    transition: background 0.3s;
                }

                .dropdown button:hover {
                    background: #007c7a;
                }

                .dropdown-content {
                    position: absolute;
                    top: 40px;
                    background: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    padding: 1rem;
                    box-shadow: 0px 18px 40px 0px #01969314;
                    min-width: 240px;
                    animation: fadeIn 0.3s ease-in-out;
                    z-index: 100;
                }

                .dropdown-left .dropdown-content {
                    left: 0;
                }

                .dropdown-right .dropdown-content {
                    right: 0;
                }

                .section {
                    margin-bottom: 1rem;
                }

                .title {
                    font-weight: 600;
                    font-size: 14px;
                    margin-bottom: 0.5rem;
                    text-transform: capitalize;
                }

                .option {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 14px;
                    margin-bottom: 0.3rem;
                }

                .action {
                    width: 100%;
                    padding: 0.4rem 0.6rem;
                    background: none;
                    border: none;
                    text-align: left;
                    font-size: 14px;
                    cursor: pointer;
                    color: #222222;
                    border-radius: 5px;
                    transition: background 0.3s;
                }

                .action:hover {
                    background: #f4f4f4;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-5px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default TableToolbar;

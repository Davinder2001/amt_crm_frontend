// import React, { useState } from 'react';
// import { FiFilter, FiColumns, FiSettings } from 'react-icons/fi';

// type FilterOptions = Record<string, string[]>;

// interface Column {
//     key: string;
//     label: string;
// }

// interface Action {
//     label: string;
//     onClick: () => void;
// }

// interface TableToolbarProps {
//     filters: FilterOptions;
//     onFilterChange: (field: string, value: string, checked: boolean) => void;
//     columns: Column[];
//     visibleColumns: string[];
//     onColumnToggle: (columnKey: string) => void;
//     actions: Action[];
// }

// const TableToolbar: React.FC<TableToolbarProps> = ({
//     filters,
//     onFilterChange,
//     columns,
//     visibleColumns,
//     onColumnToggle,
//     actions,
// }) => {
//     const [openDropdown, setOpenDropdown] = useState<string | null>(null);

//     const toggleDropdown = (name: string) => {
//         setOpenDropdown(openDropdown === name ? null : name);
//     };

//     const closeDropdown = () => setOpenDropdown(null);

//     return (
//         <div className="toolbar" onMouseLeave={closeDropdown}>
//             {/* Left Side: Filter */}
//             <div className="left-group">
//                 <div className="dropdown dropdown-left">
//                     <button onClick={() => toggleDropdown('filter')}>
//                         <FiFilter />
//                         <span>Filter</span>
//                     </button>
//                     {openDropdown === 'filter' && (
//                         <div className="dropdown-content">
//                             {Object.entries(filters).map(([field, options]) => (
//                                 <div key={field} className="section">
//                                     <p className="title">{field}</p>
//                                     {options.map((opt) => (
//                                         <label key={opt} className="option">
//                                             <input
//                                                 type="checkbox"
//                                                 onChange={(e) =>
//                                                     onFilterChange(field, opt, e.target.checked)
//                                                 }
//                                             />
//                                             {opt}
//                                         </label>
//                                     ))}
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Right Side: Columns & Actions */}
//             <div className="right-group">
//                 <div className="dropdown dropdown-right">
//                     <button onClick={() => toggleDropdown('columns')}>
//                         <FiColumns />
//                         <span>Columns</span>
//                     </button>
//                     {openDropdown === 'columns' && (
//                         <div className="dropdown-content">
//                             {columns.map((col) => (
//                                 <label key={col.key} className="option">
//                                     <input
//                                         type="checkbox"
//                                         checked={visibleColumns.includes(col.key)}
//                                         onChange={() => onColumnToggle(col.key)}
//                                     />
//                                     {col.label}
//                                 </label>
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 <div className="dropdown dropdown-right">
//                     <button onClick={() => toggleDropdown('actions')}>
//                         <FiSettings />
//                         <span>Actions</span>
//                     </button>
//                     {openDropdown === 'actions' && (
//                         <div className="dropdown-content">
//                             {actions.map((action, i) => (
//                                 <button key={i} onClick={action.onClick} className="action">
//                                     {action.label}
//                                 </button>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>

//             <style jsx>{`
//                 .toolbar {
//                     display: flex;
//                     justify-content: space-between;
//                     align-items: center;
//                     font-family: "DMSans", sans-serif;
//                 }

//                 .left-group,
//                 .right-group {
//                     display: flex;
//                     gap: 1rem;
//                 }

//                 .dropdown {
//                     position: relative;
//                 }

//                 .dropdown button {
//                     display: flex;
//                     align-items: center;
//                     gap: 0.5rem;
//                     padding: 0.5rem 1rem;
//                     background: #009693;
//                     color: #ffffff;
//                     border: none;
//                     border-radius: 5px;
//                     cursor: pointer;
//                     font-size: 16px;
//                     font-weight: 500;
//                     transition: background 0.3s;
//                 }

//                 .dropdown button:hover {
//                     background: #007c7a;
//                 }

//                 .dropdown-content {
//                     position: absolute;
//                     top: 40px;
//                     background: #ffffff;
//                     border: 1px solid #ddd;
//                     border-radius: 5px;
//                     padding: 1rem;
//                     box-shadow: 0px 18px 40px 0px #01969314;
//                     min-width: 240px;
//                     animation: fadeIn 0.3s ease-in-out;
//                     z-index: 100;
//                 }

//                 .dropdown-left .dropdown-content {
//                     left: 0;
//                 }

//                 .dropdown-right .dropdown-content {
//                     right: 0;
//                 }

//                 .section {
//                     margin-bottom: 1rem;
//                 }

//                 .title {
//                     font-weight: 600;
//                     font-size: 14px;
//                     margin-bottom: 0.5rem;
//                     text-transform: capitalize;
//                 }

//                 .option {
//                     display: flex;
//                     align-items: center;
//                     gap: 0.5rem;
//                     font-size: 14px;
//                     margin-bottom: 0.3rem;
//                 }

//                 .action {
//                     width: 100%;
//                     padding: 0.4rem 0.6rem;
//                     background: none;
//                     border: none;
//                     text-align: left;
//                     font-size: 14px;
//                     cursor: pointer;
//                     color: #222222;
//                     border-radius: 5px;
//                     transition: background 0.3s;
//                 }

//                 .action:hover {
//                     background: #f4f4f4;
//                 }

//                 @keyframes fadeIn {
//                     from {
//                         opacity: 0;
//                         transform: translateY(-5px);
//                     }
//                     to {
//                         opacity: 1;
//                         transform: translateY(0);
//                     }
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default TableToolbar;










import React, { useState, useEffect } from 'react';
import { FiFilter, FiColumns, FiSettings, FiRefreshCw } from 'react-icons/fi';

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
    visibleColumns: string[]; // Columns that should be visible
    onColumnToggle: (columnKey: string) => void;
    actions: Action[];
}

const TableToolbar: React.FC<TableToolbarProps> = ({
    filters,
    onFilterChange,
    columns,
    onColumnToggle,
    actions,
}) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [selectedFilters, setSelectedFilters] = useState<FilterOptions>(() => {
        const savedFilters = localStorage.getItem('selectedFilters');
        return savedFilters ? JSON.parse(savedFilters) : {};
    });
    const [selectedColumns, setSelectedColumns] = useState<string[]>(() => {
        const savedColumns = localStorage.getItem('selectedColumns');
        if (savedColumns) {
            return JSON.parse(savedColumns);
        } else {
            return columns.map(col => col.key); // Default to all columns being visible
        }
    });
    const [loading, setLoading] = useState(false);

    // Toggling dropdown visibility
    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const closeDropdown = () => setOpenDropdown(null);

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
        onFilterChange(field, value, checked);
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
        onColumnToggle(columnKey);
    };

    // Reset to default state
    const handleReset = () => {
        setLoading(true);
        setSelectedFilters({});
        setSelectedColumns(columns.map(col => col.key)); // Reset to default all columns
        localStorage.removeItem('selectedFilters');
        localStorage.setItem('selectedColumns', JSON.stringify(columns.map(col => col.key))); // Reset to default columns
        setTimeout(() => setLoading(false), 1000); // Simulate reset delay
    };

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
                                        checked={selectedColumns.includes(col.key)}
                                        onChange={() => handleColumnToggle(col.key)}
                                    />
                                    {col.label}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
                {/* Reset Button */}
                <div className="reset-group">
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

                .reset-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: #009693;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }

                .reset-btn:disabled {
                    background: #ddd;
                    cursor: not-allowed;
                }

                .loading-spinner {
                    border: 2px solid #f3f3f3;
                    border-top: 2px solid #009693;
                    border-radius: 50%;
                    width: 16px;
                    height: 16px;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
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

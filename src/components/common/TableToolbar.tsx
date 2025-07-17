'use client';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {  FaChevronDown, FaChevronUp, FaQuestion, FaSearch, FaTimes } from 'react-icons/fa';
import { FiFilter, FiColumns, FiDownloadCloud, FiSliders } from 'react-icons/fi';

// Helper functions for managing the intro keys
const getIntroKeys = (): Record<string, boolean> => {
    const stored = localStorage.getItem('introKeys');
    return stored ? JSON.parse(stored) : {};
};

const setIntroKey = (key: string, value: boolean) => {
    const currentKeys = getIntroKeys();
    localStorage.setItem(
        'introKeys',
        JSON.stringify({ ...currentKeys, [key]: value })
    );
};

interface Column {
    key: string;
    label: string;
}

interface Action {
    label: string;
    icon?: React.ReactElement;
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
    showBulkActions?: boolean;
    onToggleBulkActions?: (enabled: boolean) => void;
    hasBulkActions?: boolean;
    introKey?: string;
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
    showBulkActions,
    onToggleBulkActions,
    hasBulkActions,
    introKey,
}) => {
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
    const [searchValues, setSearchValues] = useState<Record<string, string>>({});
    const [activeFilterTypes, setActiveFilterTypes] = useState<string[]>([]);
    const [isMobile, setIsMobile] = useState(false);
    // Intro popup state
    const [showIntro, setShowIntro] = useState(false);
    const [hasSeenIntro, setHasSeenIntro] = useState(true);
    const introPopupRef = useRef<HTMLDivElement>(null);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // Check screen size and localStorage after mount with delay
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 769);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        if (introKey && isMobile) {
            const timer = setTimeout(() => {
                const introKeys = getIntroKeys();
                const seen = introKeys[introKey];
                setHasSeenIntro(!!seen);
                if (!seen) {
                    setShowIntro(true);
                }
            }, 1500);

            return () => {
                clearTimeout(timer);
                window.removeEventListener('resize', checkScreenSize);
            };
        }

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, [introKey, isMobile]);

    const handleDismissIntro = useCallback(() => {
        if (introKey) {
            setIntroKey(introKey, true);
            setHasSeenIntro(true);
        }
        setShowIntro(false);
    }, [introKey]);

    const showHelpGuide = () => {
        setShowIntro(true);
    };

    useEffect(() => {
        if (!showIntro) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (introPopupRef.current && !introPopupRef.current.contains(event.target as Node)) {
                handleDismissIntro();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showIntro, handleDismissIntro]);

    // Get all unique icons from toolbar actions
    const allToolbarIcons = useMemo(() => {
        const icons: { icon: React.ReactElement; label: string; description: string }[] = [];

        // Add filter icon if filters exist
        if (filters && filters.length > 0) {
            icons.push({
                icon: <FiFilter />,
                label: 'Filter',
                description: 'Filter and narrow down the displayed items'
            });
        }

        // Add columns icon if columns exist
        if (columns && columns.length > 0) {
            icons.push({
                icon: <FiColumns />,
                label: 'Columns',
                description: 'Customize which information is visible'
            });
        }

        // Add download icon if downloadActions exist
        if (downloadActions && downloadActions.length > 0) {
            icons.push({
                icon: <FiDownloadCloud />,
                label: 'Download',
                description: 'Export the current view or data'
            });
        }

        // Add settings icon if extraLinks exist
        if (extraLinks && extraLinks.length > 0) {
            icons.push({
                icon: <FiSliders />,
                label: 'Settings',
                description: 'Additional display and configuration options'
            });
        }

        // Add dynamic icons from actions
        actions?.forEach(action => {
            if (action.icon && !icons.some(i => i.label === action.label)) {
                icons.push({
                    icon: action.icon,
                    label: action.label,
                    description: action.label // Fallback to label if no description
                });
            }
        });

        return icons;
    }, [filters, columns, downloadActions, extraLinks, actions]);

    const handleFilterTypeSelect = (filterKey: string) => {
        setActiveFilterTypes(prev => {
            if (prev.includes(filterKey)) {
                return prev.filter(key => key !== filterKey);
            } else {
                return [...prev, filterKey];
            }
        });
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

    const handleSearchChange = (filterKey: string, value: string) => {
        setSearchValues(prev => ({ ...prev, [filterKey]: value }));

        if (onFilterChange) {
            onFilterChange(filterKey, value, 'search');
        }
    };

    // Add this useEffect hook right after your other useEffect hooks
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Close dropdown if click is outside any multi-select filter
            const multiSelectElements = document.querySelectorAll('.multi-select-filter-wrapper');
            let clickedOutsideAll = true;

            multiSelectElements.forEach(el => {
                if (el.contains(event.target as Node)) {
                    clickedOutsideAll = false;
                }
            });

            if (clickedOutsideAll) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Render active filters in a horizontal row
    const renderActiveFilters = () => {
        return (
            <div className="active-filters-container">
                {activeFilterTypes.map(filterKey => {
                    const filterConfig = filters?.find(f => f.key === filterKey);
                    if (!filterConfig) return null;

                    if (filterConfig.type === 'search') {
                        return (
                            <div key={filterKey} className="search-filter-container filter-outer">
                                <FaSearch className="search-icon" size={14} />
                                <input
                                    type="text"
                                    placeholder='Search...'
                                    value={searchValues[filterKey] || ''}
                                    onChange={(e) => handleSearchChange(filterKey, e.target.value)}
                                    className="search-filter-input"
                                />
                                <button
                                    onClick={() => handleFilterTypeSelect(filterKey)}
                                    className="clear-filter-btn"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        );
                    }

                    if (filterConfig.type === 'multi-select') {
                        return (
                            <div key={filterKey} className="multi-select-filter-wrapper filter-outer">
                                <div
                                    className="multi-select-trigger"
                                    onClick={() => setOpenDropdown(openDropdown === filterKey ? null : filterKey)}
                                >
                                    <span className='dropdown-placeholder'>{filterConfig.label}</span>
                                    <span className="dropdown-arrow">
                                        {openDropdown === filterKey ? <FaChevronUp /> : <FaChevronDown />}
                                    </span>
                                </div>

                                {openDropdown === filterKey && (
                                    <div className="multi-select-dropdown">
                                        <div className="multi-select-options">
                                            {filterConfig.options?.map(opt => (
                                                <label key={opt} className="option">
                                                    <span>{opt}</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFilters[filterKey]?.includes(opt) || false}
                                                        onChange={(e) =>
                                                            handleMultiSelectChange(filterKey, opt, e.target.checked)
                                                        }
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => handleFilterTypeSelect(filterKey)}
                                    className="clear-filter-btn"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        );
                    }

                    return null;
                })}
            </div>
        );
    };

    return (
        <>
            {showIntro && isMobile && (
                <div className="toolbar-intro-popup">
                    <div className="intro-content" ref={introPopupRef}>
                        <h3>Toolbar Guide</h3>
                        <ul>
                            {allToolbarIcons.map((item, index) => (
                                <li key={index}>
                                    <span className="intro-icon">{item.icon}</span>
                                    <div>
                                        <strong>{item.label}</strong>
                                        <p>{item.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button
                            className="dismiss-btn"
                            onClick={handleDismissIntro}
                        >
                            Got It!
                        </button>
                    </div>
                </div>
            )}
            <div className="toolbar">

                {filters && filters.length > 0 && (
                    <div className="left-group">
                        <div className="dropdown dropdown-left hover-group">
                            <button className="toolbar-btn">
                                <FiFilter />
                                <span className='hide-mobile'>Filter</span>
                            </button>
                            <div className="dropdown-content">
                                {hasBulkActions && (
                                    <div
                                        className={`bulk-toggle-btn ${showBulkActions ? 'active' : ''}`}
                                        onClick={() => onToggleBulkActions?.(!showBulkActions)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={showBulkActions || false}
                                            onChange={() => onToggleBulkActions?.(!showBulkActions)}
                                        />
                                        <span className="label">{showBulkActions ? 'Exit Bulk Mode' : 'Bulk Actions'}</span>
                                    </div>
                                )}
                                {filters.map((filter) => (
                                    <div key={filter.key} className="section">
                                        <label className="filter-type-option">
                                            <input
                                                type="checkbox"
                                                checked={activeFilterTypes.includes(filter.key)}
                                                onChange={() => handleFilterTypeSelect(filter.key)}
                                            />
                                            {filter.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {activeFilterTypes.length > 0 &&
                            <div className='desktop-render-filter-table filter-search-table'>
                                {renderActiveFilters()}
                            </div>
                        }
                    </div>
                )}


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

                    {actions && actions?.length > 0 ? (
                        <div className="action-icons-horizontal">
                            {actions.map((action, i) => (
                                <button key={i}
                                    onClick={action.onClick}
                                    className="toolbar-btn"
                                >
                                    <i>{action.icon}</i>
                                    <span>{action.label}</span>
                                </button>
                            ))}
                        </div>
                    ) : null}

                    {hasSeenIntro && introKey && isMobile && (
                        <button
                            className="toolbar-btn help-btn"
                            onClick={showHelpGuide}
                            title="Show toolbar guide"
                        >
                            <span>Help</span>
                            <FaQuestion />
                        </button>
                    )}
                </div>
            </div>

            {activeFilterTypes.length > 0 &&
                <div className='mobile-render-filter-table filter-search-table'>
                    {renderActiveFilters()}
                </div>
            }
        </>
    );
};

export default TableToolbar;
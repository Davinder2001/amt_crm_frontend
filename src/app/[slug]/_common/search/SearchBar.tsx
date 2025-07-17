'use client';
import React, { useState, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleClear = () => {
        setSearchTerm('');
        inputRef.current?.focus();
    };

    const handleFocus = () => {
        setIsFocused(true);
        setShowResults(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setTimeout(() => setShowResults(false), 200);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle search submission
        console.log('Searching for:', searchTerm);
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <div className={`search-container ${isFocused ? 'focused' : ''}`}>
                <div className="search-input-container">
                    <button type="submit" className="search-button">
                        <FaSearch className="search-icon" />
                    </button>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search Items..."
                        value={searchTerm}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="clear-search-button"
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>

                {showResults && (
                    <div className="search-results">
                        {searchTerm ? (
                            <div className="results-content">
                                <div className="result-item">Search result for &quot;
                                    <span>{searchTerm}</span>&quot;
                                </div>
                                <div className="result-item">Another result</div>
                            </div>
                        ) : (
                            <div className="recent-searches">
                                <h4>Recent searches</h4>
                                <div className="recent-item">Dashboard</div>
                                <div className="recent-item">Settings</div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </form>
    );
};

export default SearchBar;
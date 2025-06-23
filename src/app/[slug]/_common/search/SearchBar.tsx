'use client';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleClear = () => {
        setSearchTerm('');
    };

    return (
        <>
            <div className="search-container">
                <div className='search-input-container'>
                    <FaSearch size={20}/>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleChange}
                        className="search-input"
                    />
                </div>
                {searchTerm && (
                    <button onClick={handleClear} className="clear-button">
                        ✖
                    </button>
                )}
            </div>

        </>
    );
};

export default SearchBar;

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
                    <FaSearch size={15} color='#009693'/>
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

            {/* Scoped Styles using JSX */}
            <style jsx>{`
        .search-container {
          display: flex;
          align-items: center;
          background-color: #F1F9F9;
          border-radius: 20px;
          padding: 5px 10px;
          width: 100%;
        }
        .search-input-container{
         display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        color: #009693;
        }
        .search-input {
            flex: 1;
            border: none;
            outline: none;
            background-color: transparent;
            font-size: 14px;
            width: 100%;
            padding: 5px;
            color: #009693;
            }
            .search-input::placeholder{
            color: #009693;
            }
        .clear-button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          color: #777;
          margin-left: 5px;
        }
      `}</style>
        </>
    );
};

export default SearchBar;

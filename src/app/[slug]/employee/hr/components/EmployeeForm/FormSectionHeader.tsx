"use client";

import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FormSectionHeaderProps } from "./types";

const FormSectionHeader: React.FC<FormSectionHeaderProps> = ({ title, isExpanded, onToggle }) => {
    return (
        <div className="form-card-title flex justify-between items-center">
            <h3 className="flex items-center gap-2">
                {title}
            </h3>
            <button
                type="button"
                onClick={onToggle}
                className="toggle-icon-btn"
            >
                {isExpanded ? (
                    <FaMinus className="text-gray-600 text-xs" />
                ) : (
                    <FaPlus className="text-gray-600 text-xs" />
                )}
            </button>
        </div>
    );
};

export default FormSectionHeader; 
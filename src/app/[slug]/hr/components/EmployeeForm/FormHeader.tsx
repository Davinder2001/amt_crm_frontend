"use client";

import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FormHeaderProps } from "./types";

const FormHeader: React.FC<FormHeaderProps> = ({ mode, allExpanded, onToggleAllSections }) => {
    return (
        <div className="add-item-header form-header">
            <h4>{mode === "add" ? "Add New Employee" : "Edit Employee"}</h4>
            <button
                type="button"
                onClick={onToggleAllSections}
                className="toggle-all-btn"
                title={allExpanded ? 'Collapse All' : 'Expand All'}
            >
                {allExpanded ? (
                    <FaMinus className="text-gray-600 text-xs" />
                ) : (
                    <FaPlus className="text-gray-600 text-xs" />
                )}
            </button>
        </div>
    );
};

export default FormHeader; 
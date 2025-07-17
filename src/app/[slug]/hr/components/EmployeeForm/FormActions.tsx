"use client";

import React from "react";
import { FormActionsProps } from "./types";

const FormActions: React.FC<FormActionsProps> = ({
    mode,
    hasChanges,
    isCreating,
    isUpdating,
    onCancelChanges,
    setShowConfirm
}) => {
    return (
        <div className="form-actions">
            {mode === "edit" && hasChanges && (
                <>
                    <button
                        type="button"
                        onClick={onCancelChanges}
                        className="form-button secondary cancel-btn"
                    >
                        Cancel
                    </button>
                    <button
                        className="form-button"
                        type="submit"
                        disabled={isUpdating}
                    >
                        {isUpdating ? "Updating..." : "Update Employee"}
                    </button>
                </>
            )}

            {mode === "add" && (
                <>
                    <button
                        type="button"
                        onClick={() => setShowConfirm(true)}
                        className="form-button secondary"
                    >
                        Clear Form
                    </button>
                    <button
                        className="form-button"
                        type="submit"
                        disabled={isCreating}
                    >
                        {isCreating ? "Creating..." : "Create Employee"}
                    </button>
                </>
            )}
        </div>
    );
};

export default FormActions; 
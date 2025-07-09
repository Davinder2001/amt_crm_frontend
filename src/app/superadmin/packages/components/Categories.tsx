"use client";
import React, { useState } from "react";
import { useGetBusinessCategoriesQuery, useCreateBusinessCategoryMutation, useUpdateBusinessCategoryMutation, useDeleteBusinessCategoryMutation } from "@/slices/superadminSlices/businessCategory/businesscategoryApi";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import LoadingState from "@/components/common/LoadingState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";

const BusinessCategories = () => {
    // API hooks
    const {
        data: categories = [],
        isLoading,
        isError
    } = useGetBusinessCategoriesQuery();

    const [createCategory] = useCreateBusinessCategoryMutation();
    const [updateCategory] = useUpdateBusinessCategoryMutation();
    const [deleteCategory] = useDeleteBusinessCategoryMutation();

    // Component state
    const [form, setForm] = useState<{ id: number | null; name: string }>({
        id: null,
        name: ""
    });

    const [deleteState, setDeleteState] = useState<{
        id: number | null;
        name: string;
        showDialog: boolean;
    }>({
        id: null,
        name: "",
        showDialog: false
    });

    // Handlers
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (form.id) {
                await updateCategory({ id: form.id, name: form.name }).unwrap();
            } else {
                await createCategory({ name: form.name }).unwrap();
            }
            setForm({ id: null, name: "" });
        } catch (error) {
            console.error("Failed to save category:", error);
        }
    };

    const handleDeleteInit = (id: number, name: string) => {
        setDeleteState({
            id,
            name,
            showDialog: true
        });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteState.id) return;

        try {
            await deleteCategory(deleteState.id).unwrap();
            setDeleteState({
                id: null,
                name: "",
                showDialog: false
            });
        } catch (error) {
            console.error("Failed to delete category:", error);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteState({
            id: null,
            name: "",
            showDialog: false
        });
    };

    return (
        <div className="business-categories">
            {/* Header Section */}
            <div className="section-header">
                <h2>Business Categories</h2>
                <p>Manage your Package categories</p>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="category-form">
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Category name"
                    required
                />
                <div className="form-buttons">
                    {form.id && (
                        <button
                            type="button"
                            onClick={() => setForm({ id: null, name: "" })}
                            className="secondary"
                        >
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="primary">
                        <FiPlus /> {form.id ? "Update" : "Add"}
                    </button>
                </div>
            </form>

            {/* Categories List */}
            <div className="categories-list">
                {isLoading ? (
                    <LoadingState />
                ) : isError ? (
                    <EmptyState
                        icon="alert"
                        title="Error loading categories."
                        message="Something went wrong while loading categories ."
                    />

                ) : (
                    categories.map((cat) => (
                        <div key={cat.id} className="category-item">
                            <span>{cat.name}</span>
                            <div className="item-actions">
                                <button onClick={() => setForm({ id: cat.id, name: cat.name })}>
                                    <FiEdit2 />
                                </button>
                                <button
                                    onClick={() => handleDeleteInit(cat.id, cat.name)}
                                    className="danger"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteState.showDialog}
                title="Delete Category"
                message={`Are you sure you want to delete "${deleteState.name}"?`}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                type="delete"
            />
        </div>
    );
};

export default BusinessCategories;
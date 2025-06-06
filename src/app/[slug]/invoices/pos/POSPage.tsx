'use client';

import React, { useEffect, useState } from 'react';
import { useFetchCategoriesAndItemsQuery } from '@/slices/store/storeApi';
import CheckoutPanel from './CheckoutPanel';
import CategoriesMenu from './CategoriesMenu';
import InvoiceItems from './InvoiceItems';
import Loader from '@/components/common/Loader';
import { FaTimes } from 'react-icons/fa';

function POSPage() {
    const { data: categories } = useFetchCategoriesAndItemsQuery() as { data: Category[] | undefined };
    const [selectedTopCatId, setSelectedTopCatId] = useState<number | null>(null);
    const [selectedChildCatId, setSelectedChildCatId] = useState<number | null>(null);
    const [expandedChildCats, setExpandedChildCats] = useState<number[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>('Cart');
    const [showMobileCategories, setShowMobileCategories] = useState(false);
    const [showCheckoutPanel, setShowCheckoutPanel] = useState(false);

    useEffect(() => {
        if (categories && categories.length > 0) {
            // Don't set initial selected category - let "All" be selected by default
        }
    }, [categories]);

    if (!categories) return <Loader />;

    const topCategories: Category[] = Array.isArray(categories) ? categories : [];

    // Function to get all items from all categories and subcategories
    const getAllItems = (): StoreItem[] => {
        const allItems: StoreItem[] = [];

        const collectItems = (category: Category) => {
            if (category.items) {
                allItems.push(...category.items);
            }
            if (category.children) {
                category.children.forEach(collectItems);
            }
        };

        topCategories.forEach(collectItems);
        return allItems;
    };

    // Function to get all items from a category including all its subcategories
    const getCategoryItems = (category: Category): StoreItem[] => {
        const items: StoreItem[] = [];

        // Add direct items of the category
        if (category.items) {
            items.push(...category.items);
        }

        // Recursively add items from all child categories
        if (category.children) {
            category.children.forEach(child => {
                items.push(...getCategoryItems(child));
            });
        }

        return items;
    };

    const selectedTopCategory = topCategories.find((cat: { id: number | null; }) => cat.id === selectedTopCatId);
    const childCategories = selectedTopCategory?.children || [];

    const findCategoryById = (cats: Category[], id: number | null): Category | undefined => {
        for (const cat of cats) {
            if (cat.id === id) return cat;
            if (cat.children) {
                const found = findCategoryById(cat.children, id);
                if (found) return found;
            }
        }
        return undefined;
    };

    const selectedChild = findCategoryById(childCategories, selectedChildCatId);

    // Determine which items to display based on selection
    const displayItems = selectedTopCatId === null
        ? getAllItems() // Show all items when "All" is selected
        : selectedChildCatId && selectedChild
            ? selectedChild.items as StoreItem[] // Show items from selected child category
            : selectedTopCategory
                ? getCategoryItems(selectedTopCategory) // Show all items from selected parent and its children
                : [];


    const handleAddToCart = (item: StoreItem, variant?: variations) => {
        const itemId = item.id;
        const variantId = variant?.id;
        const id = variantId ?? itemId;
        const finalCost = variant?.final_cost ?? item.final_cost;
        const name = item.name + (variant
            ? ` (${variant.attributes.map(attr => `${attr.attribute}: ${attr.value}`).join(', ')})`
            : '');

        setCart(prev => {
            const existing = prev.find(ci => ci.id === id);

            if (existing) {
                return prev.map(ci =>
                    ci.id === id
                        ? { ...ci, quantity: ci.quantity + 1 }
                        : ci
                );
            } else {
                return [
                    ...prev,
                    {
                        id,
                        itemId,
                        variantId,
                        name,
                        quantity: 1,
                        final_cost: finalCost
                    }
                ];
            }
        });
    };

    const handleQtyChange = (itemId: number, delta: number) => {
        setCart(prev =>
            prev
                .map(ci =>
                    ci.id === itemId ? { ...ci, quantity: ci.quantity + delta } : ci
                )
                .filter(ci => ci.quantity > 0)
        );
    };

    const handleRemoveItem = (itemId: number) => {
        setCart(prev => prev.filter(item => item.id !== itemId));
    };

    const handleClearCart = () => {
        setCart([]);
    };

    return (
        <div className="pos-wrapper">
            {/* Left: Categories - Desktop */}
            {!showCheckoutPanel && (
                <div className='cats-sidebar desktop-category-wrapper'>
                    <CategoriesMenu
                        categories={topCategories}
                        selectedTopCatId={selectedTopCatId}
                        setSelectedTopCatId={setSelectedTopCatId}
                        selectedChildCatId={selectedChildCatId}
                        setSelectedChildCatId={setSelectedChildCatId}
                        expandedChildCats={expandedChildCats}
                        setExpandedChildCats={setExpandedChildCats}
                    />
                </div>
            )}

            {/* Mobile Categories Overlay */}
            {showMobileCategories && (
                <div className="mobile-categories-overlay">
                    <div className="mobile-categories-content">
                        <div className="m-cat-header">
                            <h4>Ctaegories</h4>
                            <button
                                onClick={() => setShowMobileCategories(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <CategoriesMenu
                            categories={topCategories}
                            selectedTopCatId={selectedTopCatId}
                            setSelectedTopCatId={(id) => {
                                setSelectedTopCatId(id);
                                setShowMobileCategories(false); // Close when category is selected
                            }}
                            selectedChildCatId={selectedChildCatId}
                            setSelectedChildCatId={(id) => {
                                setSelectedChildCatId(id);
                                setShowMobileCategories(false); // Close when category is selected
                            }}
                            expandedChildCats={expandedChildCats}
                            setExpandedChildCats={setExpandedChildCats}
                        />
                    </div>
                </div>
            )}

            {/* center items */}
            {!showCheckoutPanel && (
                <div className='invoice-items-wrapper'>
                    <InvoiceItems
                        items={displayItems}
                        onAddToCart={handleAddToCart}
                        cart={cart}
                        onFilterClick={() => setShowMobileCategories(true)}
                        onCartClick={() => setShowCheckoutPanel(true)}
                    />
                </div>)}

            {/* Right: Checkout Panel */}
            <div className={`checkout-panel checkout-panel-overlay ${showCheckoutPanel ? 'open' : 'closing'}`}>
                <CheckoutPanel
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    cart={cart}
                    onQtyChange={handleQtyChange}
                    onRemoveItem={handleRemoveItem}
                    onClearCart={handleClearCart}
                    onClose={() => setShowCheckoutPanel(false)}
                />
            </div>
        </div>
    );
}

export default POSPage;
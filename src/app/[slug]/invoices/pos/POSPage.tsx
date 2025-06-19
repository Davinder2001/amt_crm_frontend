'use client';

import React, { useEffect, useRef, useState } from 'react';
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
    const mobileCategoriesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // If the click is outside the mobile categories content and the popup is shown
            if (showMobileCategories && mobileCategoriesRef.current &&
                !mobileCategoriesRef.current.contains(event.target as Node)) {
                setShowMobileCategories(false);
            }
        };

        // Add event listener when component mounts
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up event listener when component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMobileCategories]);

    useEffect(() => {
        if (categories && categories.length > 0) {
            // Don't set initial selected category - let "All" be selected by default
        }
    }, [categories]);


    const topCategories: Category[] = Array.isArray(categories) ? categories : [];

    const getAllItems = (): StoreItem[] => {
        const itemMap = new Map<number, StoreItem>(); // Maps item.id → latest StoreItem

        const collectItems = (category: Category) => {
            if (category.items) {
                for (const item of category.items) {
                    itemMap.set(item.id, item); // Always overwrite with the latest occurrence
                }
            }
            if (category.children) {
                category.children.forEach(collectItems);
            }
        };

        topCategories.forEach(collectItems);
        return Array.from(itemMap.values()); // Convert back to an array
    };

    // Function to get all items from a category including all its subcategories
    const getCategoryItems = (category: Category): StoreItem[] => {
        const items: StoreItem[] = [];
        const seenItemIds = new Set<number>();

        const collectUniqueItems = (cat: Category) => {
            if (cat.items) {
                for (const item of cat.items) {
                    if (!seenItemIds.has(item.id)) {
                        seenItemIds.add(item.id);
                        items.push(item);
                    }
                }
            }
            if (cat.children) {
                cat.children.forEach(collectUniqueItems);
            }
        };

        collectUniqueItems(category);
        return items;
    };

    // Get all items from a specific category (including its subcategories)
    const getItemsFromCategory = (categoryId: number | null): StoreItem[] => {
        if (!categoryId) return getAllItems(); // Show all items when no category selected

        const findCategoryAndItems = (categories: Category[]): StoreItem[] => {
            for (const category of categories) {
                if (category.id === categoryId) {
                    // Found the category - return its items plus all items from subcategories
                    return getCategoryItems(category);
                }

                if (category.children) {
                    const childItems = findCategoryAndItems(category.children);
                    if (childItems.length) return childItems;
                }
            }
            return [];
        };

        return findCategoryAndItems(topCategories);
    };

    // Determine which items to display based on selection
    const displayItems = selectedChildCatId
        ? getItemsFromCategory(selectedChildCatId) // Show items from selected child category
        : getItemsFromCategory(selectedTopCatId); // Show items from selected parent or all items

    const handleAddToCart = (item: StoreItem, variant?: variations, useUnitPrice?: boolean, unitQuantity?: number | null) => {
        const id = variant ? `${item.id}-${variant.id}` : item.id;
        const finalCost = variant?.final_cost ?? item.final_cost;
        const name = item.name + (variant
            ? ` (${variant.attributes.map(attr => `${attr.attribute}: ${attr.value}`).join(', ')})`
            : '');

        setCart(prev => {
            const existing = prev.find(ci => ci.id.toString() === id.toString());
            const availableQty = item.quantity_count;

            // Calculate total quantity of all variants of this item already in cart
            const totalVariantsInCart = prev
                .filter(ci => ci.itemId === item.id)
                .reduce((sum, ci) => sum + ci.quantity, 0);

            if (existing) {
                // Only increase if we have stock available across all variants
                if (totalVariantsInCart < availableQty) {
                    return prev.map(ci =>
                        ci.id.toString() === id.toString()
                            ? {
                                ...ci,
                                quantity: ci.quantity + 1,
                                variants: ci.variants?.map(v => ({
                                    ...v,
                                    quantity: v.quantity + 1,
                                    units: useUnitPrice ? (typeof unitQuantity === 'number' ? unitQuantity : null) : null
                                }))
                            }
                            : ci
                    );
                }
                return prev; // Don't change if we can't increase
            } else {
                // Only add if we have at least 1 in stock across all variants
                if (totalVariantsInCart < availableQty) {
                    const newItem: CartItem = {
                        id,
                        itemId: item.id,
                        variantId: variant?.id,
                        name,
                        quantity: 1,
                        final_cost: finalCost,
                        product_type: item.product_type,
                        unit_of_measure: item.unit_of_measure
                    };

                    if (variant && item.product_type === 'variable_product') {
                        newItem.variants = [{
                            variant_id: variant.id!,
                            quantity: 1,
                            final_cost: useUnitPrice
                                ? (variant.variant_price_per_unit !== undefined
                                    ? Number(variant.variant_price_per_unit) * (unitQuantity || 1)
                                    : null)
                                : (variant.final_cost !== undefined ? variant.final_cost : null),
                            units: useUnitPrice ? (typeof unitQuantity === 'number' ? unitQuantity : null) : null
                        }];
                    }

                    return [...prev, newItem];
                }
                return prev; // Don't add if out of stock
            }
        });
    };

    const handleQtyChange = (itemId: string | number, delta: number | string) => {
        setCart(prev => {
            return prev
                .map(ci => {
                    if (ci.id.toString() === itemId.toString()) {
                        // Find the cart item and its parent item
                        const cartItem = prev.find(item => item.id.toString() === itemId.toString());
                        if (!cartItem) return ci;

                        const storeItem = displayItems.find(item => item.id === cartItem.itemId);
                        if (!storeItem) return ci;

                        const availableQty = storeItem.quantity_count;

                        // Calculate total quantity of all variants of this item already in cart
                        const totalVariantsInCart = prev
                            .filter(item => item.itemId === cartItem.itemId)
                            .reduce((sum, item) => sum + item.quantity, 0);

                        // Calculate current item's quantity without this one's delta
                        const othersQty = totalVariantsInCart - ci.quantity;

                        let newQty = ci.quantity;
                        if (typeof delta === 'number') {
                            newQty += delta;
                        } else {
                            newQty = Number(delta);
                        }

                        // Ensure quantity stays between 1 and available quantity considering other variants
                        newQty = Math.max(1, Math.min(newQty, availableQty - othersQty));

                        // Update variant quantity if this is a variable product
                        const updatedItem = { ...ci, quantity: newQty };
                        if (ci.product_type === 'variable_product' && ci.variants?.length) {
                            updatedItem.variants = ci.variants.map(v => ({
                                ...v,
                                quantity: newQty
                            }));
                        }

                        return updatedItem;
                    }
                    return ci;
                })
                .filter(ci => ci.quantity > 0);
        });
    };


    const handleRemoveItem = (itemId: string | number) => {
        setCart(prev => prev.filter(item => item.id.toString() !== itemId.toString()));
    };
    const handleClearCart = () => {
        setCart([]);
    };

    if (!categories) return <Loader />;

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
                    <div className="mobile-categories-content" ref={mobileCategoriesRef}>
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
                            }}
                            selectedChildCatId={selectedChildCatId}
                            setSelectedChildCatId={(id) => {
                                setSelectedChildCatId(id);
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
                    items={displayItems}
                />
            </div>
        </div>
    );
}

export default POSPage;
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useFetchCategoriesAndItemsQuery } from '@/slices/store/storeApi';
import CheckoutPanel from './CheckoutPanel';
import CategoriesMenu from './CategoriesMenu';
import InvoiceItems from './InvoiceItems';
import { FaTimes } from 'react-icons/fa';
import EmptyState from '@/components/common/EmptyState';
import { FaTriangleExclamation } from 'react-icons/fa6';
import LoadingState from '@/components/common/LoadingState';
import { toast } from 'react-toastify';

function POSPage() {
    const { data: categories, isError } = useFetchCategoriesAndItemsQuery() as { data: Category[] | undefined, isError: boolean };
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
            if (category.invoice_items && Array.isArray(category.invoice_items)) {
                for (const item of category.invoice_items || []) {
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
            if (cat.invoice_items && Array.isArray(cat.invoice_items)) {
                for (const item of cat.invoice_items || []) {
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
    const displayItems = (selectedChildCatId
        ? getItemsFromCategory(selectedChildCatId)
        : getItemsFromCategory(selectedTopCatId)).filter(item => item.batches && item.batches.length > 0);


    const handleAddToCart = (
        item: StoreItem,
        variant?: variations,
        useUnitPrice?: boolean,
        unitQuantity?: number | null,
        batch?: storeItemBatch
    ) => {
        // Generate unique ID for the cart item
        const id = variant ? `${item.id}-${variant.id}` : batch ? `${item.id}-${batch.id}` : item.id;

        // Calculate final cost and determine actual quantity
        let finalCost: number;
        let actualQuantity: number;

        if (variant) {
            if (useUnitPrice && variant.variant_price_per_unit && unitQuantity) {
                finalCost = variant.variant_price_per_unit * unitQuantity;
                actualQuantity = unitQuantity; // Use unit quantity as actual quantity
            } else {
                finalCost = variant.variant_sale_price || 0;
                actualQuantity = 1; // Default to 1 for regular pricing
            }
        } else if (batch) {
            if (useUnitPrice && batch.price_per_unit && unitQuantity) {
                finalCost = batch.price_per_unit * unitQuantity;
                actualQuantity = unitQuantity; // Use unit quantity as actual quantity
            } else {
                finalCost = batch.sale_price || 0;
                actualQuantity = 1; // Default to 1 for regular pricing
            }
        } else {
            finalCost = item.sale_price || 0;
            actualQuantity = 1; // Default to 1 for regular pricing
        }

        // Rest of the function remains the same, but use actualQuantity instead of hardcoded 1
        const name = item.name +
            (variant ? ` (${variant.attributes.map(attr => `${attr.attribute}: ${attr.value}`).join(', ')})` : '') +
            (batch ? ` (Batch: ${batch.batch_number || batch.id})` : '');

        setCart(prev => {
            const existing = prev.find(ci => ci.id.toString() === id.toString());
            const availableQty = batch?.quantity || item.quantity_count;

            // Calculate total quantity of this item/variant/batch already in cart
            const totalInCart = prev
                .filter(ci => {
                    // Same item
                    if (ci.itemId !== item.id) return false;

                    // If batch is specified, match batch
                    if (batch && (!ci.batches || !ci.batches.some(b => b.batch_id === batch.id))) return false;

                    // If variant is specified, match variant
                    if (variant && (!ci.variants || !ci.variants.some(v => v.variant_id === variant.id))) return false;

                    return true;
                })
                .reduce((sum, ci) => sum + ci.quantity, 0);

            if (existing) {
                // Only increase if we have stock available
                if (totalInCart < availableQty) {
                    return prev.map(ci =>
                        ci.id.toString() === id.toString()
                            ? {
                                ...ci,
                                quantity: ci.quantity + actualQuantity,
                                variants: ci.variants?.map(v => ({
                                    ...v,
                                    quantity: v.quantity + actualQuantity,
                                    final_cost: finalCost,
                                    units: useUnitPrice ? unitQuantity || null : null
                                })),
                                batches: ci.batches?.map(b => ({
                                    ...b,
                                    quantity: b.quantity + actualQuantity,
                                    variants: b.variants?.map(v => ({
                                        ...v,
                                        quantity: v.quantity + actualQuantity,
                                        final_cost: finalCost,
                                        units: useUnitPrice ? unitQuantity || null : null
                                    }))
                                }))
                            }
                            : ci
                    );
                }
                toast.error(`Maximum quantity reached for ${name}`);
                return prev;
            } else {
                // Only add if we have stock available
                if (totalInCart < availableQty) {
                    const newItem: CartItem = {
                        id,
                        itemId: item.id,
                        variantId: variant?.id,
                        name,
                        quantity: actualQuantity, // Use actualQuantity here
                        featured_image: item.featured_image,
                        final_cost: finalCost,
                        product_type: item.product_type,
                        unit_of_measure: item.unit_of_measure,
                        variants: variant && typeof variant.id === 'number' ? [{
                            variant_id: variant.id,
                            quantity: actualQuantity, // Use actualQuantity here
                            final_cost: finalCost,
                            units: useUnitPrice ? unitQuantity || null : null
                        }] : undefined,
                        batches: batch ? [{
                            batch_id: batch.id,
                            quantity: actualQuantity, // Use actualQuantity here
                            variants: (variant && typeof variant.id === 'number') ? [{
                                variant_id: variant.id,
                                quantity: actualQuantity, // Use actualQuantity here
                                final_cost: finalCost,
                                units: useUnitPrice ? unitQuantity || null : null
                            }] : undefined
                        }] : undefined
                    };
                    return [...prev, newItem];
                }
                toast.error(`Not enough stock available for ${name}`);
                return prev;
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

                        // Determine available quantity based on product type and batch
                        let availableQty = storeItem.quantity_count;
                        let batch: storeItemBatch | undefined;

                        // If this is a batch item, find the specific batch
                        if (cartItem.batches?.[0]?.batch_id) {
                            batch = (storeItem.batches as storeItemBatch[] | undefined)?.find(b => b.id === cartItem.batches?.[0]?.batch_id);
                            if (batch) {
                                availableQty = batch.quantity;
                            }
                        }
                        // For variable products with variants
                        if (cartItem.product_type === 'variable_product' && cartItem.variants?.[0]?.variant_id) {
                            const variant = storeItem.variants?.find(v => v.id === cartItem.variants?.[0]?.variant_id);
                            if (variant) {
                                availableQty = variant.variant_stock || availableQty;
                            }
                        }

                        // For batch items with variants
                        if (cartItem.batches?.[0]?.variants?.[0]?.variant_id) {
                            const batchVariant = batch?.variants?.find(
                                v => v.id === cartItem.batches?.[0]?.variants?.[0]?.variant_id
                            );
                            if (batchVariant) {
                                availableQty = batchVariant.variant_stock || availableQty;
                            }
                        }

                        // Calculate total quantity of all variants/batches of this item already in cart
                        const totalInCart = prev
                            .filter(item => {
                                // Same item
                                if (item.itemId !== cartItem.itemId) return false;

                                // If batch is specified, match batch
                                if (cartItem.batches?.[0]?.batch_id) {
                                    return item.batches?.[0]?.batch_id === cartItem.batches[0].batch_id;
                                }

                                // If variant is specified, match variant
                                if (cartItem.variants?.[0]?.variant_id) {
                                    return item.variants?.[0]?.variant_id === cartItem.variants[0].variant_id;
                                }

                                return true;
                            })
                            .reduce((sum, item) => sum + item.quantity, 0);

                        // Calculate current item's quantity without this one's delta
                        const othersQty = totalInCart - ci.quantity;

                        let newQty = ci.quantity;
                        if (typeof delta === 'number') {
                            newQty += delta;
                        } else {
                            newQty = Number(delta);
                        }

                        // Ensure quantity stays between 1 and available quantity considering other variants/batches
                        newQty = Math.max(1, Math.min(newQty, availableQty - othersQty));

                        // Update final cost based on pricing mode
                        let finalCost = ci.final_cost;
                        if (ci.variants?.[0]?.units) {
                            // For unit pricing, recalculate cost
                            const unitPrice = ci.variants[0].units / ci.quantity * finalCost;
                            finalCost = unitPrice * newQty;
                        } else if (ci.batches?.[0]?.variants?.[0]?.units) {
                            // For batch unit pricing, recalculate cost
                            const unitPrice = ci.batches[0].variants[0].units / ci.quantity * finalCost;
                            finalCost = unitPrice * newQty;
                        }

                        // Update variant quantity if this is a variable product
                        const updatedItem = { ...ci, quantity: newQty, final_cost: finalCost };

                        // Update variants array if exists
                        if (ci.variants?.length) {
                            updatedItem.variants = ci.variants.map(v => ({
                                ...v,
                                quantity: newQty,
                                final_cost: finalCost
                            }));
                        }

                        // Update batches array if exists
                        if (ci.batches?.length) {
                            updatedItem.batches = ci.batches.map(b => ({
                                ...b,
                                quantity: newQty,
                                variants: b.variants?.map(v => ({
                                    ...v,
                                    quantity: newQty,
                                    final_cost: finalCost
                                }))
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

    if (isError) return <EmptyState
        icon={<FaTriangleExclamation className="empty-state-icon" />}
        title="Failed to load categories and items"
        message="We encountered an error while loading your store items. Please try again later."
    />;

    if (!categories) return <LoadingState />;

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
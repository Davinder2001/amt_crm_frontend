'use client';

import React, { useEffect, useState } from 'react';
import { useFetchCategoriesAndItemsQuery } from '@/slices/store/storeApi';
import CheckoutPanel from './CheckoutPanel';
import CategoriesMenu from './CategoriesMenu';
import InvoiceItems from './InvoiceItems';
import Loader from '@/components/common/Loader';

function POSPage() {
    const { data: categories } = useFetchCategoriesAndItemsQuery() as { data: Category[] | undefined };
    const [selectedTopCatId, setSelectedTopCatId] = useState<number | null>(null);
    const [selectedChildCatId, setSelectedChildCatId] = useState<number | null>(null);
    const [expandedChildCats, setExpandedChildCats] = useState<number[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>('Cart');

    useEffect(() => {
        if (categories && categories.length > 0) {
            setSelectedTopCatId(categories[0].id);
        }
    }, [categories]);

    if (!categories) return <Loader />;

    const topCategories: Category[] = Array.isArray(categories) ? categories : [];
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
    const displayItems =
        selectedChildCatId && selectedChild
            ? selectedChild.items as StoreItem[]
            : selectedTopCategory?.items as StoreItem[] || [];

    const handleAddToCart = (item: StoreItem, variant?: variations) => {
        const itemId = item.id;
        const variantId = variant?.id;
        const id = variantId ?? itemId; // use variant id as unique cart key
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
                        id, // this will be variant id if available
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
            {/* Left: Categorie */}
            <div className='cats-sidebar'>
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
            {/* center items */}
            <div className='invoice-items-wrapper'>
                <InvoiceItems items={displayItems} onAddToCart={handleAddToCart} />
            </div>
            {/* Right: Checkout Panel */}
            <div className='checkout-panel'>
                <CheckoutPanel
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    cart={cart}
                    onQtyChange={handleQtyChange}
                    onRemoveItem={handleRemoveItem}
                    onClearCart={handleClearCart}
                />
            </div>
        </div>
    );
}

export default POSPage;
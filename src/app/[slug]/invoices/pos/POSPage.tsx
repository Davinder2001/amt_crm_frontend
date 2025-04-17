'use client';

import React, { useEffect, useState } from 'react';
import { useFetchCategoriesAndItemsQuery } from '@/slices/store/storeApi';
import CheckoutPanel from './CheckoutPanel';
import CategoriesMenu from './CategoriesMenu';
import InvoiceItems from './InvoiceItems';

function POSPage() {
    const { data: categories } = useFetchCategoriesAndItemsQuery();
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

    if (!categories) return <div>Loading...</div>;

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

    const handleAddToCart = (item: StoreItem) => {
        setCart(prev => {
            const existing = prev.find(ci => ci.id === item.id);
            if (existing) {
                return prev.map(ci =>
                    ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
                );
            } else {
                return [...prev, { id: item.id, name: item.name, selling_price: item.selling_price, quantity: 1 }];
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
        <div className="container">
            {/* Left: Categorie */}
            <div style={{ minWidth: '200px', display: 'flex', flexDirection: 'column', borderRight: '1px solid #ccc' }}>
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
            <InvoiceItems items={displayItems} onAddToCart={handleAddToCart} />
            {/* Right: Checkout Panel */}
            <CheckoutPanel
                activeTab={activeTab}
                onTabChange={setActiveTab}
                cart={cart}
                onQtyChange={handleQtyChange}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
            />
            <style jsx>{`
        .container {
          display: flex;
        }
      `}</style>
        </div>
    );
}

export default POSPage;
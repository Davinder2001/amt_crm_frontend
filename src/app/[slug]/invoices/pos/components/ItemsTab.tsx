// components/cart/ItemsTab.tsx
'use client';

import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import { FiShoppingCart } from 'react-icons/fi';
import { toast } from 'react-toastify';

type ItemsTabProps = {
    cart: CartItem[];
    items: StoreItem[];
    onQtyChange: (itemId: number | string, delta: number | string) => void;
    onRemoveItem: (itemId: number | string) => void;
};

export default function ItemsTab({ cart, items, onQtyChange, onRemoveItem }: ItemsTabProps) {
    const [popupImage, setPopupImage] = useState<string | null>(null);

    if (cart.length === 0) {
        return (
            <div className="empty-cart-message">
                <FiShoppingCart size={80} color="#ccc" />
                <p>Your cart is empty</p>
            </div>
        );
    }

    return (
        <>
            <div className="cart-items-list">
                {cart.map(item => {
                    const storeItem = items.find(si => si.id === item.itemId);
                    const imageUrl = storeItem?.featured_image;

                    return (
                        <div key={item.id} className="cart-item-row">
                            <div className="item-image-container" onClick={() => {
                                const storeItem = items.find(si => si.id === item.itemId);
                                if (storeItem?.featured_image) {
                                    setPopupImage(storeItem.featured_image);
                                }
                            }}>
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={item.name}
                                        className="item-image"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                        width={50}
                                        height={50}
                                    />
                                ) : (
                                    <div className="item-image-placeholder">
                                        {item.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {popupImage && (
                                <div className="image-popup-overlay" onClick={() => setPopupImage(null)}>
                                    <div className="image-popup-content" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            className="close-popup"
                                            onClick={() => setPopupImage(null)}
                                        >
                                            <FaTimes />
                                        </button>
                                        <Image
                                            src={popupImage}
                                            alt="Enlarged product"
                                            width={1000}
                                            height={1000}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="item-details">
                                <div className="item-header">
                                    <span className="item-name">{item.name}</span>
                                    <button
                                        className="delete-btn"
                                        onClick={() => onRemoveItem(item.id)}
                                        title="Remove"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>

                                <div className="item-controls">
                                    <div className="quantity-control">
                                        <button
                                            className="item-quantity-btn"
                                            onClick={() => onQtyChange(item.id, -1)}
                                            disabled={item.quantity <= 1}
                                            style={{
                                                opacity: item.quantity <= 1 ? 0.5 : 1,
                                                cursor: item.quantity <= 1 ? "not-allowed" : "pointer",
                                                backgroundColor: item.quantity <= 1 ? "var(--primary-color)" : "var(--primary-color)",
                                            }}
                                        >
                                            −
                                        </button>

                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const storeItem = items.find(si => si.id === item.itemId);

                                                let maxQty;
                                                if (item.product_type === 'variable_product' && item.variants?.length) {
                                                    const variant = storeItem?.variants?.find(v => item.variants && item.variants.length > 0 && item.variants[0] && v.id === item.variants[0].variant_id);
                                                    maxQty = variant?.variant_stock || Infinity;
                                                } else {
                                                    maxQty = storeItem?.quantity_count || Infinity;
                                                }

                                                if (value === '') {
                                                    onQtyChange(item.id, '');
                                                    return;
                                                }

                                                const newQty = parseInt(value);
                                                if (!isNaN(newQty)) {
                                                    if (newQty > maxQty) {
                                                        toast.error(`Maximum available quantity is ${maxQty}`);
                                                        onQtyChange(item.id, maxQty.toString());
                                                    } else {
                                                        onQtyChange(item.id, newQty.toString());
                                                    }
                                                }
                                            }}
                                            onBlur={(e) => {
                                                const newValue = e.target.value;
                                                if (newValue === '' || parseInt(newValue) < 1) {
                                                    onQtyChange(item.id, '1');
                                                }
                                            }}
                                            min={1}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.currentTarget.blur();
                                                }
                                                if (e.key === '.' || e.key === ',') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            style={{ height: 'auto', maxWidth: '40px', width: '100%', textAlign: 'center', margin: 'auto', padding: 0, border: 'none' }}
                                        />

                                        <button
                                            className="item-quantity-btn"
                                            onClick={() => {
                                                const storeItem = items.find(si => si.id === item.itemId);

                                                let maxQty;
                                                if (item.product_type === 'variable_product' && item.variants?.length) {
                                                    const variant = (item.variants && item.variants.length > 0)
                                                        ? storeItem?.variants?.find(v => item.variants && item.variants.length > 0 && v.id === item.variants[0].variant_id)
                                                        : undefined;
                                                    maxQty = variant?.variant_stock || Infinity;
                                                } else {
                                                    maxQty = storeItem?.quantity_count || Infinity;
                                                }

                                                if (item.quantity >= maxQty) {
                                                    toast.error(`Maximum available quantity is ${maxQty}`);
                                                } else {
                                                    onQtyChange(item.id, 1);
                                                }
                                            }}
                                            disabled={(() => {
                                                const storeItem = items.find(si => si.id === item.itemId);
                                                if (!storeItem) return false;

                                                let maxQty;
                                                if (item.product_type === 'variable_product' && item.variants?.length) {
                                                    const variant = (item.variants && item.variants.length > 0)
                                                        ? storeItem.variants?.find(v => item.variants && item.variants.length > 0 && v.id === item.variants[0].variant_id)
                                                        : undefined;
                                                    maxQty = variant?.variant_stock || Infinity;
                                                } else {
                                                    maxQty = storeItem.quantity_count || Infinity;
                                                }

                                                return item.quantity >= maxQty;
                                            })()}
                                            style={{
                                                opacity: (() => {
                                                    const storeItem = items.find(si => si.id === item.itemId);
                                                    if (!storeItem) return 1;

                                                    let maxQty;
                                                    if (item.product_type === 'variable_product' && item.variants?.length) {
                                                        const variant = (item.variants && item.variants.length > 0)
                                                            ? storeItem.variants?.find(v => item.variants && item.variants.length > 0 && v.id === item.variants[0].variant_id)
                                                            : undefined;
                                                        maxQty = variant?.variant_stock || Infinity;
                                                    } else {
                                                        maxQty = storeItem.quantity_count || Infinity;
                                                    }

                                                    return item.quantity >= maxQty ? 0.5 : 1;
                                                })(),
                                                cursor: (() => {
                                                    const storeItem = items.find(si => si.id === item.itemId);
                                                    if (!storeItem) return "pointer";

                                                    let maxQty;
                                                    if (item.product_type === 'variable_product' && item.variants?.length) {
                                                        const variant = (item.variants && item.variants.length > 0)
                                                            ? storeItem.variants?.find(v => v.id === item.variants![0].variant_id)
                                                            : undefined;
                                                        maxQty = variant?.variant_stock || Infinity;
                                                    } else {
                                                        maxQty = storeItem.quantity_count || Infinity;
                                                    }

                                                    return item.quantity >= maxQty ? "not-allowed" : "pointer";
                                                })(),
                                                backgroundColor: (() => {
                                                    const storeItem = items.find(si => si.id === item.itemId);
                                                    if (!storeItem) return "var(--primary-color)";

                                                    let maxQty;
                                                    if (item.product_type === 'variable_product' && item.variants?.length) {
                                                        const variant = (item.variants && item.variants.length > 0)
                                                            ? storeItem.variants?.find(v => v.id === item.variants![0].variant_id)
                                                            : undefined;
                                                        maxQty = variant?.variant_stock || Infinity;
                                                    } else {
                                                        maxQty = storeItem.quantity_count || Infinity;
                                                    }

                                                    return item.quantity >= maxQty ? "var(--primary-light)" : "var(--primary-color)";
                                                })(),
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="item-price">₹{item.quantity * item.final_cost}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
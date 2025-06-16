'use client';

import React, { useState } from 'react';
import { FaSearch, FaShoppingCart, FaTh, FaList, FaCheck } from 'react-icons/fa';
import { MdOutlineFilterList } from 'react-icons/md';
import Image from 'next/image';
import { placeholderImg } from '@/assets/useImage';
import { FiX } from 'react-icons/fi';

interface catMenuProps {
  items: StoreItem[];
  cart: CartItem[];
  onAddToCart: (item: StoreItem, variant?: variations) => void;
  onFilterClick: () => void;
  onCartClick: () => void;
}

const InvoiceItems: React.FC<catMenuProps> = ({ items, onAddToCart, cart, onFilterClick, onCartClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [variantModalItem, setVariantModalItem] = useState<StoreItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<variations | null>(null);

  const cartItemCount = cart.length;

  // Check if an item is in the cart
  const isItemInCart = (itemId: number) => {
    return cart.some(cartItem => cartItem.itemId === itemId);
  };

  // Add this helper function to get the quantity from cart
  const getItemQuantity = (itemId: number) => {
    const cartItem = cart.find(ci => ci.itemId === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  const getPriceRange = (variants: variations[]) => {
    if (!variants || variants.length <= 1) return null;

    const prices = variants.map(variant => parseFloat(String(variant.final_cost ?? '0')));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return { min: minPrice, max: maxPrice };
  };

  return (
    <>
      <div className="searchbar-desktop">
        <div className="searchbar-container">
          <FaSearch />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="searchbar-mobile">
        <div className="searchbar-container">
          <FaSearch size={30} />
          <input
            type="text"
            placeholder="Search Here.."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className="icon-buttons">
            <div className="icon-buttons">
              <button
                className="circle-btn"
                title={viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
                onClick={toggleViewMode}
              >
                {viewMode === 'grid' ? <FaList /> : <FaTh />}
              </button>
              <button className="circle-btn" title="Filter" onClick={onFilterClick}>
                <MdOutlineFilterList size={18} />
              </button>
            </div>
            <button className="circle-btn cart-icon-btn" title="Cart"
              onClick={(e) => {
                e.stopPropagation();
                onCartClick();
              }}>
              <FaShoppingCart size={15} />
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <p className="no-items">No items found</p>
      ) : (
        <ul className={`item-list ${viewMode}-view`}>
          {filteredItems.map((item, index) => {
            const imageSrc = item.featured_image ?? placeholderImg;

            const isHovered = hoveredItemId === item.id;
            const inCart = isItemInCart(item.id);

            let priceDisplay = '';

            if (item.variants && item.variants.length === 1) {
              priceDisplay = `₹${item.variants[0].final_cost}`;
            } else if (item.variants && item.variants.length > 1) {
              const priceRange = getPriceRange(item.variants);
              priceDisplay = priceRange ? `₹${priceRange.min} - ₹${priceRange.max}` : '0';
            } else {
              priceDisplay = `₹${item.final_cost}`;
            }


            return (
              <li
                key={`item-${item.id}-${index}-${item.category}`}
                className={`item ${isHovered ? 'hovered' : ''} ${inCart ? 'in-cart' : ''}`}
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
                onClick={() => {
                  if (item.variants && item.variants.length > 1) {
                    setVariantModalItem(item);
                  } else if (item.variants && item.variants.length === 1) {
                    onAddToCart(item, item.variants[0]);
                  } else {
                    onAddToCart(item);
                  }
                }}
              >
                <div className="item-image">
                  <Image
                    src={imageSrc}
                    alt={item.name}
                    width={120}
                    height={100}
                    className="item-image-img"
                  />

                  {inCart && (
                    <div className="item-selected-indicator">
                      <div className="checkmark-circle">
                        {(() => {
                          // For items with variants, calculate total quantity across all variants
                          if (item.variants && item.variants.length > 0) {
                            const totalVariantQuantity = cart.reduce((total, cartItem) => {
                              // Match either the base item or any of its variants
                              return cartItem.itemId === item.id ? total + cartItem.quantity : total;
                            }, 0);

                            return totalVariantQuantity > 1 ? (
                              <span className='item-qty-count'>{totalVariantQuantity}</span>
                            ) : (
                              <FaCheck className="checkmark-icon" />
                            );
                          }
                          // For simple items without variants
                          else {
                            const quantity = getItemQuantity(item.id);
                            return quantity > 1 ? (
                              <span className='item-qty-count'>{quantity}</span>
                            ) : (
                              <FaCheck className="checkmark-icon" />
                            );
                          }
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                <div className="item-details">
                  <h4 className="item-name">{item.name}</h4>
                  <p className="item-price">{priceDisplay}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Variant Selection Modal */}
      {variantModalItem && (
        <div className="variant-modal">
          <div className="variant-modal-content">
            <h3>Select Variant</h3>
            <button onClick={() => {
              setVariantModalItem(null);
              setSelectedVariant(null);
            }} className="close-btn"><FiX /></button>

            <select
              onChange={(e) => {
                const variantId = parseInt(e.target.value);
                const matched = variantModalItem?.variants?.find(v => v.id === variantId) ?? null;
                setSelectedVariant(matched);
              }}
              defaultValue=""
            >
              <option value="" disabled>Select a variant</option>
              {(variantModalItem?.variants ?? []).map(variant => {
                const label = variant.attributes
                  .map(attr => `${attr.attribute}: ${attr.value}`)
                  .join(', ');

                return (
                  <option key={variant.id} value={variant.id}>
                    {label} - ₹{variant.final_cost}
                  </option>
                );
              })}
            </select>

            {selectedVariant && (
              <p className="price-info">Price: ₹{selectedVariant.final_cost}</p>
            )}

            <button
              disabled={!selectedVariant}
              onClick={() => {
                if (selectedVariant) {
                  onAddToCart(variantModalItem, selectedVariant);
                  setVariantModalItem(null);
                  setSelectedVariant(null);
                }
              }}
              className="confirm-btn"
            >
              Confirm Add to Cart
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InvoiceItems;
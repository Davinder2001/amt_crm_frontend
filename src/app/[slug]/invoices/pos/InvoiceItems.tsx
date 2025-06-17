'use client';

import React, { useState } from 'react';
import { FaSearch, FaShoppingCart, FaTh, FaList, FaCheck } from 'react-icons/fa';
import { MdOutlineFilterList } from 'react-icons/md';
import Image from 'next/image';
import { placeholderImg } from '@/assets/useImage';
import Modal from '@/components/common/Modal';

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

  // Add this helper function to get the quantity of a specific variant from cart
  const getVariantQuantity = (itemId: number, variantId?: number) => {
    if (!variantId) return 0;
    const cartItem = cart.find(ci => ci.itemId === itemId && ci.variantId === variantId);
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

    const prices = variants.map(variant => parseFloat(String(variant.variant_final_cost ?? '0')));
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
              priceDisplay = `₹${item.variants[0].variant_final_cost}`;
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
                        {item.variants?.length ? (
                          // Variant items: Sum quantities of all variants
                          (() => {
                            const totalQty = cart
                              .filter(cartItem => cartItem.itemId === item.id)
                              .reduce((sum, item) => sum + item.quantity, 0);

                            return totalQty > 1 ? (
                              <span className="item-qty-count">{totalQty}</span>
                            ) : (
                              <FaCheck className="checkmark-icon" />
                            );
                          })()
                        ) : (
                          // Simple items: Show quantity as before
                          getItemQuantity(item.id) > 1 ? (
                            <span className="item-qty-count">{getItemQuantity(item.id)}</span>
                          ) : (
                            <FaCheck className="checkmark-icon" />
                          )
                        )}
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
        <Modal
          isOpen={!!variantModalItem}
          onClose={() => {
            setVariantModalItem(null);
            setSelectedVariant(null);
          }}
          title="Select Variant"
          width="400px"
        >
          <div className="variant-modal-content">
            <div className="variant-radial-selector">
              {(variantModalItem?.variants ?? []).map(variant => {
                const firstLetters = variant.attributes
                  .map(attr => attr.value.substring(0, 1).toUpperCase())
                  .join('');
                const variantQty = getVariantQuantity(variantModalItem.id, variant.id);

                return (
                  <div
                    key={variant.id}
                    className={`variant-bubble ${selectedVariant?.id === variant.id ? 'selected' : ''} ${variantQty > 0 ? 'in-cart' : ''}`}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    <div className="bubble-label">{firstLetters}</div>
                    {variantQty > 0 && (
                      <div className="variant-qty-badge">{variantQty}</div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="variant-details">
              {selectedVariant ? (
                <>
                  <div className="variant-name">
                    {selectedVariant.attributes.map(attr => attr.value).join(' • ')}
                  </div>
                  <div className="variant-price">₹{selectedVariant.variant_final_cost}</div>
                </>
              ) : (
                <div className="variant-name">Select a variant</div>
              )}
            </div>

            <button
              disabled={!selectedVariant}
              onClick={() => {
                if (selectedVariant) {
                  onAddToCart(variantModalItem, selectedVariant);
                  setVariantModalItem(null);
                  setSelectedVariant(null);
                }
              }}
              className="add-button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Confirm Add To Cart
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default InvoiceItems;
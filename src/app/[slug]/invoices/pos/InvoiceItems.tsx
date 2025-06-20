'use client';

import React, { useState } from 'react';
import { FaSearch, FaShoppingCart, FaTh, FaList, FaCheck } from 'react-icons/fa';
import { MdOutlineFilterList } from 'react-icons/md';
import Image from 'next/image';
import { placeholderImg } from '@/assets/useImage';
import Modal from '@/components/common/Modal';
import { FormInput } from '@/components/common/FormInput';

interface catMenuProps {
  items: StoreItem[];
  cart: CartItem[];
  onAddToCart: (item: StoreItem, variant?: variations, useUnitPrice?: boolean, unitQuantity?: number | null) => void;
  onFilterClick: () => void;
  onCartClick: () => void;
}

const InvoiceItems: React.FC<catMenuProps> = ({ items, onAddToCart, cart, onFilterClick, onCartClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [variantModalItem, setVariantModalItem] = useState<StoreItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<variations | null>(null);
  const [useUnitPrice, setUseUnitPrice] = useState(false);
  const [unitQuantity, setUnitQuantity] = useState(1);

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

  const getAvailableStock = (item: StoreItem, variant?: variations) => {
    if (variant) {
      // For variants: variant_stock minus cart quantities for this variant
      const variantInCart = cart.find(ci => ci.itemId === item.id && ci.variantId === variant.id);
      const cartQty = variantInCart ? variantInCart.quantity : 0;
      return Math.max(0, (variant.variant_stock ?? 0) - cartQty);
    }
    // For simple products: quantity_count minus cart quantities
    const itemInCart = cart.find(ci => ci.itemId === item.id && !ci.variantId);
    const cartQty = itemInCart ? itemInCart.quantity : 0;
    return Math.max(0, (item.quantity_count ?? 0) - cartQty);
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

  const handleVariantModalClose = () => {
    setVariantModalItem(null);
    setSelectedVariant(null);
    setUseUnitPrice(false);
    setUnitQuantity(1);
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
          onClose={handleVariantModalClose}
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
                const availableStock = getAvailableStock(variantModalItem, variant);
                const isOutOfStock = availableStock <= 0;

                return (
                  <div
                    key={variant.id}
                    className={`variant-bubble ${selectedVariant?.id === variant.id ? 'selected' : ''} ${variantQty > 0 ? 'in-cart' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setUseUnitPrice(false);
                      setUnitQuantity(1);
                    }}
                    title={`${availableStock} available`}
                  >
                    <div className="bubble-label">{firstLetters}</div>
                    {variantQty > 0 && (
                      <div className="variant-qty-badge">{variantQty}</div>
                    )}
                    {isOutOfStock && (
                      <div className="out-of-stock-badge">0</div>
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
                  <div className="variant-price">
                    ₹{selectedVariant.final_cost}
                    {selectedVariant.variant_price_per_unit && (
                      <span className="unit-price"> (₹{selectedVariant.variant_price_per_unit}/unit)</span>
                    )}
                  </div>
                  <div className={`variant-stock ${getAvailableStock(variantModalItem, selectedVariant || undefined) <= 0 ? 'out-of-stock' : ''}`}>
                    Available: {getAvailableStock(variantModalItem, selectedVariant || undefined)}
                  </div>
                </>
              ) : (
                <div className="variant-name">Select a variant</div>
              )}
            </div>

            {selectedVariant && variantModalItem?.unit_of_measure === 'unit' && selectedVariant.variant_price_per_unit && (
              <div className="unit-price-option">
                <label className="unit-price-toggle">
                  <input
                    type="checkbox"
                    checked={useUnitPrice}
                    onChange={() => setUseUnitPrice(!useUnitPrice)}
                  />
                  <span>Use per-unit pricing</span>
                </label>
                {useUnitPrice && (
                  <div className="unit-controls">
                    <div className="unit-price-display">
                      Price Per Unit: <strong>₹{selectedVariant.variant_price_per_unit}</strong>
                    </div>
                    <div className="unit-quantity-input">
                      <label>Units:</label>
                      <FormInput
                        label="Units"
                        name="unitQuantity"
                        type="number"
                        value={unitQuantity || ''}
                        onChange={(e) => {
                          const numValue = e.target.value === '' ? 0 : Number(e.target.value);
                          const maxAvailable = getAvailableStock(variantModalItem, selectedVariant);
                          setUnitQuantity(Math.min(maxAvailable, isNaN(numValue) ? 0 : numValue));
                        }}
                        placeholder="e.g. 0.1"
                      />
                    </div>
                    <div className="calculated-price">
                      Total: ₹{(selectedVariant.variant_price_per_unit * unitQuantity).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              disabled={!selectedVariant || getAvailableStock(variantModalItem, selectedVariant) <= 0}
              onClick={() => {
                if (selectedVariant && getAvailableStock(variantModalItem, selectedVariant) > 0) {
                  const calculatedPrice = useUnitPrice
                    ? Number(selectedVariant.variant_price_per_unit) * unitQuantity
                    : Number(selectedVariant.final_cost);

                  onAddToCart(
                    variantModalItem,
                    {
                      ...selectedVariant,
                      final_cost: calculatedPrice
                    },
                    useUnitPrice,
                    useUnitPrice ? unitQuantity : undefined
                  );
                  handleVariantModalClose();
                }
              }}
              className={`add-button ${getAvailableStock(variantModalItem, selectedVariant || undefined) <= 0 ? 'disabled' : ''}`}
              style={{ cursor: getAvailableStock(variantModalItem, selectedVariant || undefined) <= 0 ? 'not-allowed' : 'pointer' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {getAvailableStock(variantModalItem, selectedVariant || undefined) <= 0 ? (
                'Out of Stock'
              ) : (
                useUnitPrice ? 'Add with Unit Pricing' : 'Add To Cart'
              )}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default InvoiceItems;
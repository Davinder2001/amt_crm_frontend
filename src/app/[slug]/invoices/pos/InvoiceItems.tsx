'use client';

import React, { useState } from 'react';
import { FaSearch, FaShoppingCart, FaTh, FaList, FaCheck } from 'react-icons/fa';
import { MdOutlineFilterList } from 'react-icons/md';
import Image from 'next/image';
import { placeholderImg } from '@/assets/useImage';
import Modal from '@/components/common/Modal';

interface InvoiceItemsProps {
  items: StoreItem[];
  cart: CartItem[];
  onAddToCart: (item: StoreItem, variant?: variations, useUnitPrice?: boolean, unitQuantity?: number | null, batch?: storeItemBatch) => void;
  onFilterClick: () => void;
  onCartClick: () => void;
}

// Type guard for storeItemBatch
function isStoreItemBatch(batch: storeItemBatch | ItemBatch): batch is storeItemBatch {
  return (batch as storeItemBatch).product_type !== undefined;
}

const InvoiceItems: React.FC<InvoiceItemsProps> = ({ items, onAddToCart, cart, onFilterClick, onCartClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedVariant, setSelectedVariant] = useState<variations | null>(null);
  const [batchModalItem, setBatchModalItem] = useState<StoreItem | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<storeItemBatch | null>(null);
  const [batchVariantModal, setBatchVariantModal] = useState<{ item: StoreItem, batch: storeItemBatch } | null>(null);
  const [simpleUnitModal, setSimpleUnitModal] = useState<{ item: StoreItem, batch: storeItemBatch } | null>(null);
  const [useUnitPrice, setUseUnitPrice] = useState<boolean>(false);
  const [unitQuantity, setUnitQuantity] = useState<number>(1);

  const cartItemCount = cart.length;

  // Check if an item is in the cart
  const isItemInCart = (itemId: number) => {
    return cart.some(cartItem => cartItem.itemId === itemId);
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  // --- Helper for batch price range ---
  const getBatchPriceRange = (batch: storeItemBatch) => {
    if (!batch.variants || batch.variants.length === 0) return null;
    const prices = batch.variants.map((v: variations) => v.variant_sale_price ?? 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { min, max };
  };

  // --- UI for batch modal ---
  const renderBatchModal = () => {
    if (!batchModalItem) return null;
    const batches: (storeItemBatch | ItemBatch)[] = batchModalItem.batches || [];
    return (
      <Modal
        isOpen={!!batchModalItem}
        onClose={() => { setBatchModalItem(null); setSelectedBatch(null); }}
        title={`Select Batch for ${batchModalItem.name}`}
        width="500px"
      >
        <div className="batch-modal-content" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {batches.length === 0 ? (
            <div>No batches available.</div>
          ) : (
            <div className="variant-radial-selector" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 16, position: 'relative' }}>
              {batches.map((batch: storeItemBatch | ItemBatch) => {
                const isVariable = isStoreItemBatch(batch) && batch.product_type === 'variable_product';
                const priceRange = isVariable && batch.variants ? getBatchPriceRange(batch) : null;
                const hasUnits = isStoreItemBatch(batch) && batch.unit_of_measure === 'unit' && batch.price_per_unit;

                return (
                  <div
                    key={batch.id}
                    className={`variant-bubble${selectedBatch?.id === batch.id ? ' selected' : ''}`}
                    style={{
                      maxWidth: 200,
                      width: '100%',
                      minHeight: 80,
                      border: '1px solid #e0e0e0',
                      borderRadius: 12,
                      background: '#fff',
                      margin: 4,
                      padding: 10,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      boxShadow: selectedBatch?.id === batch.id ? '0 2px 8px rgba(50,67,101,0.08)' : 'none',
                      borderColor: selectedBatch?.id === batch.id ? 'var(--primary-color)' : '#e0e0e0'
                    }}
                    onClick={() => {
                      setSelectedBatch(batch as storeItemBatch);
                      if (isStoreItemBatch(batch)) {
                        if (batch.product_type === 'simple_product') {
                          if (hasUnits) {
                            // Open the simple unit modal instead of adding to cart directly
                            setSimpleUnitModal({ item: batchModalItem, batch });
                          } else {
                            onAddToCart(batchModalItem, undefined, false, undefined, batch);
                            setBatchModalItem(null);
                          }
                        } else if (batch.product_type === 'variable_product') {
                          setBatchVariantModal({ item: batchModalItem, batch });
                        }
                      }
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}><b>Batch:</b> {('batch_number' in batch ? batch.batch_number : '') || batch.id}</div>
                    <div style={{ fontSize: 13, color: '#384B70', marginBottom: 2 }}>
                      {isVariable
                        ? (priceRange ? `₹${priceRange.min} - ₹${priceRange.max}` : 'No variants')
                        : isStoreItemBatch(batch) ? `₹${batch.sale_price}` : ''}
                    </div>
                    {isStoreItemBatch(batch) && (
                      <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>
                        <b>Product Type:</b> {batch.product_type}
                        {hasUnits && <span> (Unit: ₹{batch.price_per_unit})</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Modal>
    );
  };

  // --- UI for simple product unit modal ---
  const renderSimpleUnitModal = () => {
    if (!simpleUnitModal) return null;
    const { item, batch } = simpleUnitModal;
    const showUnitOption = batch.unit_of_measure === 'unit' && batch.price_per_unit;

    return (
      <Modal
        isOpen={!!simpleUnitModal}
        onClose={() => { setSimpleUnitModal(null); setUseUnitPrice(false); setUnitQuantity(1); }}
        title={`Add ${item.name} to Cart`}
        width="400px"
      >
        <div className="unit-modal-content">
          <div className="price-options" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <input
                type="radio"
                name="priceOption"
                checked={!useUnitPrice}
                onChange={() => setUseUnitPrice(false)}
              />
              <div>
                <div style={{ fontWeight: 'bold' }}>Regular Price</div>
                <div>₹{batch.sale_price} per item</div>
              </div>
            </label>
            {showUnitOption && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="radio"
                  name="priceOption"
                  checked={useUnitPrice}
                  onChange={() => setUseUnitPrice(true)}
                />
                <div>
                  <div style={{ fontWeight: 'bold' }}>Unit Price</div>
                  <div>₹{batch.price_per_unit} per unit</div>
                </div>
              </label>
            )}
          </div>

          <button
            onClick={() => {
              onAddToCart(item, undefined, useUnitPrice, useUnitPrice ? unitQuantity : undefined, batch);
              setSimpleUnitModal(null);
              setBatchModalItem(null);
              setUseUnitPrice(false);
              setUnitQuantity(1);
            }}
            className="add-button"
          >
            Add To Cart
          </button>
        </div>
      </Modal>
    );
  };

  // --- UI for batch variant modal ---
  const renderBatchVariantModal = () => {
    if (!batchVariantModal) return null;
    const { item, batch } = batchVariantModal;
    const supportsRegularPrice = selectedVariant && selectedVariant.variant_sale_price !== undefined;

    const supportsUnitPrice = selectedVariant &&
      selectedVariant.variant_price_per_unit !== undefined &&
      selectedVariant.variant_price_per_unit !== null &&
      batch.unit_of_measure === 'unit';

    return (
      <Modal
        isOpen={!!batchVariantModal}
        onClose={() => { setBatchVariantModal(null); setSelectedVariant(null); setUseUnitPrice(false); setUnitQuantity(1); }}
        title={`Select Variant for Batch #${batch.id}`}
        width="400px"
      >
        <div className="variant-modal-content">
          <div className="variant-radial-selector">
            {(batch.variants ?? []).map((variant: variations) => {
              const firstLetters = variant.attributes
                .map((attr: AttributeItem) => attr.value.substring(0, 1).toUpperCase())
                .join('');
              return (
                <div
                  key={variant.id}
                  className={`variant-bubble ${selectedVariant?.id === variant.id ? 'selected' : ''}`}
                  onClick={() => { setSelectedVariant(variant); setUseUnitPrice(false); setUnitQuantity(1); }}
                >
                  <div className="bubble-label">{firstLetters}</div>
                </div>
              );
            })}
          </div>
          <div className="variant-details">
            {selectedVariant ? (
              <>
                <div className="variant-name">
                  {selectedVariant.attributes.map((attr: AttributeItem) => attr.value).join(' • ')}
                </div>
                <div className="variant-price">
                  ₹{selectedVariant.variant_sale_price}
                </div>
                <div style={{ marginTop: '16px' }}>
                  <div className="price-options" style={{ marginBottom: '8px' }}>
                    {supportsRegularPrice && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="radio"
                          name="variantPriceOption"
                          checked={!useUnitPrice}
                          onChange={() => setUseUnitPrice(false)}
                        />
                        <div>
                          <div style={{ fontWeight: 'bold' }}>Regular Price</div>
                          <div>₹{selectedVariant.variant_sale_price} per item</div>
                        </div>
                      </label>
                    )}
                    {supportsUnitPrice && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="radio"
                          name="variantPriceOption"
                          checked={useUnitPrice}
                          onChange={() => setUseUnitPrice(true)}
                        />
                        <div>
                          <div style={{ fontWeight: 'bold' }}>Unit Price</div>
                          <div>₹{selectedVariant.variant_price_per_unit} per unit</div>
                        </div>
                      </label>
                    )}

                  </div>
                </div>

              </>
            ) : (
              <div className="variant-name">Select a variant</div>
            )}
          </div>
          <button
            disabled={!selectedVariant}
            onClick={() => {
              if (selectedVariant) {
                onAddToCart(item, selectedVariant, useUnitPrice, useUnitPrice ? unitQuantity : undefined, batch);
                setBatchVariantModal(null);
                setBatchModalItem(null);
                setSelectedVariant(null);
                setUseUnitPrice(false);
                setUnitQuantity(1);
              }
            }}
            className="add-button"
          >
            Add To Cart
          </button>
        </div>
      </Modal>
    );
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

            // --- Price display logic ---
            let priceDisplay = '';
            let batchToShow: storeItemBatch | ItemBatch | null = null;
            if (batchModalItem && batchModalItem.id === item.id && selectedBatch) {
              batchToShow = selectedBatch;
            } else if (item.batches && item.batches.length > 0) {
              batchToShow = item.batches[0]; // Always default to first batch if available
            }
            if (!item.batches || item.batches.length === 0) {
              priceDisplay = 'No batches available';
            } else if (batchToShow) {
              if (isStoreItemBatch(batchToShow) && batchToShow.product_type === 'simple_product') {
                priceDisplay = `₹${batchToShow.sale_price}`;
                if (batchToShow.unit_of_measure === 'unit' && batchToShow.price_per_unit) {
                  priceDisplay += ` (₹${batchToShow.price_per_unit}/unit)`;
                }
              } else if (isStoreItemBatch(batchToShow) && batchToShow.product_type === 'variable_product') {
                const priceRange = getBatchPriceRange(batchToShow);
                priceDisplay = priceRange ? `₹${priceRange.min} - ₹${priceRange.max}` : 'No variants';
              } else {
                priceDisplay = 'Select Batch';
              }
            } else {
              priceDisplay = 'Select Batch';
            }

            return (
              <li
                key={`item-${item.id}-${index}-${item.category}`}
                className={`item ${isHovered ? 'hovered' : ''} ${inCart ? 'in-cart' : ''}`}
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
                onClick={() => {
                  // If there's only one batch, handle it directly
                  if (item.batches && item.batches.length === 1) {
                    const singleBatch = item.batches[0];

                    if (isStoreItemBatch(singleBatch)) {
                      if (singleBatch.product_type === 'simple_product') {
                        // Only open simple unit modal if unit_of_measure is 'unit' and has price_per_unit
                        if (singleBatch.unit_of_measure === 'unit' && singleBatch.price_per_unit) {
                          setSimpleUnitModal({ item, batch: singleBatch });
                        } else {
                          // For 'pieces' or other unit_of_measure values, add directly to cart
                          onAddToCart(item, undefined, false, undefined, singleBatch);
                        }
                      } else if (singleBatch.product_type === 'variable_product') {
                        // Open variant modal directly
                        setBatchVariantModal({ item, batch: singleBatch });
                      }
                    }
                  } else {
                    // Multiple batches or no batches - show batch modal
                    setBatchModalItem(item);
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
                        <FaCheck className="checkmark-icon" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="item-details">
                  <h4 className="item-name" title={item.name}>{item.name}</h4>
                  <div className="item-price">{priceDisplay}</div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {renderBatchModal()}
      {renderSimpleUnitModal()}
      {renderBatchVariantModal()}
    </>
  );
};

export default InvoiceItems;
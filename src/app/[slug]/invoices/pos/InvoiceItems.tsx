'use client';

import React, { useState, useEffect } from 'react';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { LuLayoutList, } from 'react-icons/lu';
import { MdOutlineFilterList } from 'react-icons/md';
import Image from 'next/image';
import { FiX, FiChevronLeft, FiChevronRight, FiHeart } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import { placeholderImg } from '@/assets/useImage';

interface catMenuProps {
  items: StoreItem[];
  cart: CartItem[];
  onAddToCart: (item: StoreItem, variant?: variations) => void;
}

const InvoiceItems: React.FC<catMenuProps> = ({ items, onAddToCart, cart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);

  const cartItemCount = cart.length;


  const [variantModalItem, setVariantModalItem] = useState<StoreItem | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({});
  const [variants, setSelectedVariant] = useState<variations | null>(null);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('wrwer', filteredItems);


  const toggleWishlist = (id: number) => {
    setWishlistItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const openModal = (item: StoreItem) => {
    if (!Array.isArray(item.images) || item.images.length === 0) {
      return;
    }
    setSelectedItem(item);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    if (!selectedItem) return;
    setCurrentImageIndex((prev) => (prev + 1) % selectedItem.images.length);
  };

  const prevImage = () => {
    if (!selectedItem) return;
    setCurrentImageIndex((prev) =>
      (prev - 1 + selectedItem.images.length) % selectedItem.images.length
    );
  };

  useEffect(() => {
    document.body.style.overflow = selectedItem ? 'hidden' : 'auto';
  }, [selectedItem]);

  useEffect(() => {
    if (!variantModalItem || !variantModalItem.variants) return;

    const matchedVariant = variantModalItem.variants.find(variant =>
      variant.attributes.every(attr =>
        selectedAttributes[attr.attribute] === attr.value
      )
    );
    setSelectedVariant(matchedVariant ?? null);
  }, [selectedAttributes, variantModalItem]);

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
          <FaSearch size={20} />
          <input
            type="text"
            placeholder="Search Here.."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className="icon-buttons">
            <div className="icon-buttons">
              <button className="circle-btn" title="Toggle View">
                <LuLayoutList size={14} />
              </button>
              <button className="circle-btn" title="Filter">
                <MdOutlineFilterList size={15} />
              </button>
            </div>
            <button className="circle-btn cart-icon-btn" title="Cart">
              <FaShoppingCart size={12} />
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
        <ul className="item-list">
          {filteredItems.map((item, index) => {
            const firstImage = Array.isArray(item.images) && item.images.length > 0
              ? (typeof item.images[0] === 'string' ? item.images[0] : URL.createObjectURL(item.images[0]))
              : placeholderImg;

            const isHovered = hoveredItemId === item.id;
            const priceRange = item.variants ? getPriceRange(item.variants) : null;

            const priceDisplay = priceRange
              ? `₹${priceRange.min} - ₹${priceRange.max}`
              : `₹${item.final_cost}`;

            return (
              <li
                key={`item-${item.id}-${index}-${item.category}`}
                className={`item ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
                onClick={(e) => {
                  // Make sure click is not on the image container
                  const isImageClick = (e.target as HTMLElement).closest('.item-image');
                  if (isImageClick) return;

                  if (item.variants && item.variants.length > 1) {
                    setVariantModalItem(item);
                  } else if (item.variants && item.variants.length === 1) {
                    onAddToCart(item, item.variants[0]);
                  } else {
                    onAddToCart(item);
                  }
                }}
              >
                <div className="item-image" onClick={() => openModal(item)}>
                  <Image
                    src={firstImage}
                    alt={item.name}
                    width={120}
                    height={100}
                    className="item-image-img"
                  />
                  <div className="cart-navs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(item.id);
                      }}
                      className={`cart-btn ${wishlistItems.includes(item.id) ? 'filled' : ''}`}
                      title="Add to Wishlist"
                    >
                      {wishlistItems.includes(item.id) ? <AiFillHeart /> : <FiHeart />}
                    </button>
                  </div>

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

      {/* Image Modal */}
      {selectedItem && (
        <div className="images-modal">
          <div className="images-modal-content">
            <span onClick={closeModal} className="modal-close-btn">
              <FiX />
            </span>

            {selectedItem.images.length > 0 ? (
              <div className="image-slider">
                <div className="slider-images" style={{
                  transform: `translateX(-${currentImageIndex * 100}%)`,
                }}>
                  {selectedItem.images.map((img, index) => {
                    const imgSrc = typeof img === 'string' ? img : URL.createObjectURL(img);
                    return (
                      <div key={index} className="slider-image">
                        <Image
                          src={imgSrc}
                          alt={`Image ${index + 1}`}
                          width={400}
                          height={300}
                          className="slider-image-img"
                        />
                      </div>
                    );
                  })}
                </div>
                <button onClick={prevImage} className="slider-btn prev-btn"><FiChevronLeft /></button>
                <button onClick={nextImage} className="slider-btn next-btn"><FiChevronRight /></button>
                <div className="image-counter">
                  {currentImageIndex + 1} / {selectedItem.images.length}
                </div>
              </div>
            ) : <p>No images available.</p>}
          </div>
        </div>
      )}

      {/* Variant Selection Modal */}
      {variantModalItem && (
        <div className="variant-modal">
          <div className="variant-modal-content">
            <h3>Select Variant</h3>
            <button onClick={() => {
              setVariantModalItem(null);
              setSelectedAttributes({});
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

            {variants && (
              <p className="price-info">Price: ₹{variants.final_cost}</p>
            )}

            <button
              disabled={!variants}
              onClick={() => {
                if (variants) {
                  onAddToCart(variantModalItem, variants);
                  setVariantModalItem(null);
                  setSelectedAttributes({});
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
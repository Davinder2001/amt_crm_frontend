'use client';

import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import Image from 'next/image';
import { FiX, FiChevronLeft, FiChevronRight, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import { placeholderImg } from '@/assets/useImage';

interface catMenuProps {
  items: StoreItem[];
  onAddToCart: (item: StoreItem) => void;
}

const InvoiceItems: React.FC<catMenuProps> = ({ items, onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleWishlist = (id: number) => {
    setWishlistItems((prev) =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const openModal = (item: StoreItem) => {
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

  return (
    <>
      {/* Search */}
      <div className="searchbar-container">
        <FaSearch />
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Item List */}
      {
        filteredItems.length === 0 ? (
          <p className="no-items">No items found</p>
        ) : (
          <ul className="item-list">
            {filteredItems.map(item => {
              const firstImage = Array.isArray(item.images) && item.images.length > 0
                ? (typeof item.images[0] === 'string' ? item.images[0] : URL.createObjectURL(item.images[0]))
                : placeholderImg;

              const isHovered = hoveredItemId === item.id;

              return (
                <li
                  key={`item-${item.id}`}
                  className={`item ${isHovered ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                >
                  {/* Image */}
                  <div className="item-image" onClick={() => {
                    if (Array.isArray(item.images) && item.images.length > 0) {
                      openModal(item);
                    }
                  }}>
                    <Image
                      src={firstImage}
                      alt={item.name}
                      width={120}
                      height={100}
                      className="item-image-img"
                    />
                    {/* Add to Cart Button on Hover */}
                    {isHovered && (
                      <div className="cart-navs">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(item);
                          }}
                          className="cart-btn"
                          title="Add to Cart"
                        >
                          <FiShoppingCart />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(item.id);
                          }}
                          className="cart-btn"
                          title="Add to Wishlist"
                        >
                          {wishlistItems.includes(item.id) ? <AiFillHeart /> : <FiHeart />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="item-details">
                    <h4 className="item-name">
                      {item.name}
                    </h4>
                    <p className="item-price">₹{item.selling_price}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )
      }

      {/* Modal */}
      {selectedItem && (
        <div className="images-modal">
          <div className="images-modal-content">
            {/* Close Button */}
            <span onClick={closeModal} className="modal-close-btn">
              <FiX />
            </span>

            {/* Image Slider */}
            {selectedItem.images.length > 0 ? (
              <div className="image-slider">
                <div className="slider-images" style={{
                  transform: `translateX(-${currentImageIndex * 100}%)`,
                }}>
                  {selectedItem.images.map((img, index) => {
                    const imgSrc = typeof img === 'string' ? img : URL.createObjectURL(img);
                    return (
                      <div
                        key={index}
                        className="slider-image"
                      >
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

                {/* Prev Button */}
                <button
                  onClick={prevImage}
                  className="slider-btn prev-btn"
                >
                  <FiChevronLeft />
                </button>

                {/* Next Button */}
                <button
                  onClick={nextImage}
                  className="slider-btn next-btn"
                >
                  <FiChevronRight />
                </button>

                {/* Image Counter */}
                <div className="image-counter">
                  {currentImageIndex + 1} / {selectedItem.images.length}
                </div>
              </div>
            ) : (
              <p>No images available.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default InvoiceItems;

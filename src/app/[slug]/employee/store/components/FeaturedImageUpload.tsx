'use client';
import Image from 'next/image';
import React, { useRef } from 'react';
import { FiUploadCloud, FiXCircle } from 'react-icons/fi';

interface FeaturedImageUploadProps {
    featuredImage: File | string | null;
    onFeaturedImageChange: (file: File) => void;
    onRemoveFeaturedImage: () => void;
    disabled?: boolean;
}

const FeaturedImageUpload: React.FC<FeaturedImageUploadProps> = ({
    featuredImage,
    onFeaturedImageChange,
    onRemoveFeaturedImage,
    disabled = false
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            onFeaturedImageChange(e.target.files[0]);
        }
    };

    return (
        <div className="featured-image-upload" style={disabled ? { cursor: 'not-allowed', opacity: 0.6, backgroundColor: '#f5f5f5' } : {}}>
            {featuredImage ? (
                <div className="image-preview">
                    <Image
                        src={typeof featuredImage === 'string' ? featuredImage : URL.createObjectURL(featuredImage)}
                        alt="Featured"
                        className="preview-img"
                        width={400}
                        height={200}
                        style={{ objectFit: 'cover', borderRadius: '8px', width: '100%' }}
                        unoptimized={typeof featuredImage !== 'string'}
                    />
                    <button className="remove-button" onClick={onRemoveFeaturedImage} style={disabled ? { cursor: 'not-allowed'} : {}} disabled={disabled}>
                        <FiXCircle size={18} />
                        Remove
                    </button>
                </div>
            ) : (
                <div
                    className="upload-box"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <FiUploadCloud size={40} color="#ccc" style={disabled ? { cursor: 'not-allowed'} : {}}/>
                    <p>Click or Drag to Upload Featured Image</p>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        disabled={disabled}
                    />
                </div>
            )}

            <style jsx>{`
        .featured-image-upload {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 2px dashed var(--primary-light);
          border-radius: 5px;
          background-color: #f9ffff;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .upload-box {
          text-align: center;
          padding: 1rem;
        }

        .upload-box p {
          color: #888;
          margin-top: 0.5rem;
          font-size: 0.9rem;
        }

        .image-preview {
          position: relative;
          width: 100%;
        }

        .preview-img {
          width: 100%;
          height: auto;
          max-height: 200px;
          object-fit: cover;
          border-radius: 8px;
        }

        .remove-button {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 4px;
          padding: 4px 6px;
          font-size: 0.8rem;
          color: #d33;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }
      `}</style>
        </div>
    );
};

export default FeaturedImageUpload;

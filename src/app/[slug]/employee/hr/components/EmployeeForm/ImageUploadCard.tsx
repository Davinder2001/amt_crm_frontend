"use client";

import React from "react";
import Image from "next/image";
import { FaImage, FaUpload } from "react-icons/fa";
import { ImageUploadProps } from "./types";

const ImageUploadCard: React.FC<ImageUploadProps> = ({
    title,
    fieldName,
    imagePreview,
    onFileChange,
    error,
    accept = "image/*",
    id
}) => {
    return (
        <div className="image-upload-card">
            <h3>{title}</h3>
            <div className="image-preview">
                {imagePreview ? (
                    typeof imagePreview === 'string' && imagePreview.startsWith('http') ? (
                        <Image
                            src={imagePreview}
                            alt={`${title} Preview`}
                            width={100}
                            height={100}
                            unoptimized
                        />
                    ) : (
                        <Image
                            src={imagePreview}
                            alt={`${title} Preview`}
                            width={100}
                            height={100}
                        />
                    )
                ) : (
                    <div className="placeholder">
                        <FaImage size={48} />
                        <span>No image selected</span>
                    </div>
                )}
            </div>
            <div className="upload-controls">
                <input
                    type="file"
                    id={id}
                    name={fieldName}
                    accept={accept}
                    onChange={(e) => onFileChange(e, fieldName)}
                    className="file-input"
                />
                <label htmlFor={id} className="upload-button">
                    <FaUpload /> Choose File
                </label>
                {error && (
                    <div className="error-message">{error}</div>
                )}
            </div>
        </div>
    );
};

export default ImageUploadCard; 
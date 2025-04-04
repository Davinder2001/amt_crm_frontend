import React from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  images: File[] | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, handleImageChange }) => {
  return (
    <div style={{ flex: '1 1 100%' }}>
      <label>Upload Images (up to 5)*</label>
      <input
        type="file"
        name="images"
        accept="image/*"
        multiple
        onChange={handleImageChange}
      />
      {images && images.length > 0 && (
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
          {Array.from(images).map((file, index) => (
            <Image
              key={index}
              src={URL.createObjectURL(file)}
              alt={`preview-${index}`}
              width={100}
              height={100}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

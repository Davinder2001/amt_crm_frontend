import Image from 'next/image';
import { toast } from 'react-toastify';

interface ImageUploadProps {
    images: File[] | null;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClearImages: () => void; 
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, handleImageChange, handleClearImages }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);

            // Check if total number of images exceeds 5
            const totalFiles = (images ? images.length : 0) + selectedFiles.length;

            if (totalFiles > 5) {
                toast.error("You can only select up to 5 images.");
                e.target.value = ""; // Clear the file input
                return; // Prevent the files from being added
            }

            // Pass the selected files to parent for further processing
            handleImageChange(e);
        }
    };

    return (
    <div className='store-add-item-form-img-container'>
    <label>Upload Images (up to 5)*</label>
    
    <div className='store-add-item-form-img-inner'>
        <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleFileChange}
        />
    </div>

    {/* Image Previews */}
    {images && images.length > 0 && (
        <div style={{ display: 'flex', gap: '10px' }}>
            {images.map((file, index) => (
                <div key={index}>
                    <Image
                        src={URL.createObjectURL(file)}
                        alt={`preview-${index}`}
                        width={100}
                        height={100}
                    />
                </div>
            ))}
        </div>
    )}

    {/* ✅ Conditionally Render the Clear Button */}
    {images && images.length > 0 && (
        <button
            type="button"
            className='clear-image-button'
            onClick={handleClearImages}
        >
            Clear Images
        </button>
    )}
</div>
);


};

export default ImageUpload;

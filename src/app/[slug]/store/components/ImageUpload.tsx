import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';
import { FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface ImageUploadProps {
    images: File[] | null;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClearImages: () => void;
    handleRemoveImage: (index: number) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    images,
    handleImageChange,
    handleClearImages,
    handleRemoveImage
}) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const totalFiles = (images ? images.length : 0) + selectedFiles.length;

            if (totalFiles > 5) {
                toast.error("You can only select up to 5 images.");
                e.target.value = "";
                return;
            }

            handleImageChange(e);
        }
    };

    return (
        <div className="upload-container">
            <label>Upload Images ({images?.length || 0}/5)*</label>
            <div
                className="upload-input-box"
                onClick={() => document.getElementById('file-upload-input')?.click()}
            >
                <FiUpload size={18} />
                <span className="upload-text">Click here to upload or drag & drop</span>
                <input
                    id="file-upload-input"
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
            </div>
            <small className="upload-note">SVG, JPG, PNG up to 10MB</small>

            {images && images.length > 0 && (
                <>
                    <div className="preview-row">
                        {images.map((file, index) => (
                            <div key={index} className="preview-image-wrapper">
                                <div className="preview-image">
                                    <Image
                                        src={URL.createObjectURL(file)}
                                        alt={`preview-${index}`}
                                        width={50}
                                        height={50}
                                    />
                                </div>
                                <button
                                    className="delete-btn"
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    <FaTimes />
                                </button>

                            </div>
                        ))}
                    </div>

                    <button className="clear-btn" onClick={handleClearImages}>
                        Clear All
                    </button>
                </>
            )}
        </div>
    );
};

export default ImageUpload;

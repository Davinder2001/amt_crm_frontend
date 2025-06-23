import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';
import { FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface ImageUploadProps {
    images: (string | File)[];
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClearImages: () => void;
    handleRemoveImage: (index: number) => void;
    disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    images,
    handleImageChange,
    handleClearImages,
    handleRemoveImage,
    disabled = false
}) => {
    const isLimitReached = images.length >= 5;
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const totalFiles = images.length + selectedFiles.length;

            if (totalFiles > 5) {
                toast.error("You can only upload up to 5 images.");
                e.target.value = '';
                return;
            }

            handleImageChange(e);
        }
    };

    return (
        <div className="upload-container" style={disabled ? { cursor: 'not-allowed', opacity: 0.6, backgroundColor: '#f5f5f5' } : {}}>
            <label>Upload Images ({images.length}/5)*</label>

            <div
                className={`upload-input-box ${isLimitReached ? 'disabled-upload' : ''}`}
                onClick={() => {
                    if (!isLimitReached) {
                        document.getElementById('file-upload-input')?.click();
                    }
                }}
                style={disabled ? { cursor: 'not-allowed', opacity: 0.6, backgroundColor: '#f5f5f5' } : { cursor: isLimitReached ? 'not-allowed' : 'pointer', opacity: isLimitReached ? 0.5 : 1 }}
            >
                <FiUpload size={18} />
                <span className="upload-text">
                    {isLimitReached ? 'Maximum 5 images uploaded' : 'Click here to upload or drag & drop'}
                </span>
                <input
                    id="file-upload-input"
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: 'none', }}
                    disabled={isLimitReached || disabled}
                />
            </div>
            <small className="upload-note">SVG, JPG, PNG up to 10MB</small>
            {images.length > 0 && (
                <>
                    <div className="preview-row">
                        {images.map((file, index) => (
                            <div key={index} className="preview-image-wrapper">
                                <div className="preview-image">
                                    <Image
                                        src={typeof file === 'string' ? file : URL.createObjectURL(file)}
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

                    <button className="clear-btn" onClick={handleClearImages} type='button'>
                        Clear All
                    </button>
                </>
            )}
        </div>
    );
};

export default ImageUpload;

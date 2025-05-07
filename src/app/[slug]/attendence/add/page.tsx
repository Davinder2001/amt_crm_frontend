// "use client"; // If you're in Next.js 13 with app router
// import React, { useState, useRef } from "react";
// import ReactWebcam from "react-webcam";
// import { useRecordAttendanceMutation } from "@/slices/attendance/attendance";
// import Image from "next/image";
// import { toast } from "react-toastify";
// import Link from "next/link";
// import { FaArrowLeft } from "react-icons/fa";
// import { useCompany } from "@/utils/Company";

// function AddAttendancePage() {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [showWebcam, setShowWebcam] = useState<boolean>(false);
//   const webcamRef = useRef<ReactWebcam | null>(null);
//   const { companySlug } = useCompany();


//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     setSelectedFile(file || null);
//   };

//   const captureFromWebcam = () => {
//     const imageSrc = webcamRef.current?.getScreenshot();
//     if (imageSrc) {
//       const blob = dataURLtoBlob(imageSrc);
//       const file = new File([blob], "webcam.jpg", { type: blob.type });
//       setSelectedFile(file);
//       setShowWebcam(false);
//     }
//   };

//   const dataURLtoBlob = (dataUrl: string): Blob => {
//     const arr = dataUrl.split(',');
//     const mime = arr[0].match(/:(.*?);/)?.[1] || "";
//     const bstr = atob(arr[1]);
//     let n = bstr.length;
//     const u8arr = new Uint8Array(n);
//     while (n--) {
//       u8arr[n] = bstr.charCodeAt(n);
//     }
//     return new Blob([u8arr], { type: mime });
//   };

//   const [recordAttendance] = useRecordAttendanceMutation();

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!selectedFile) {
//       toast.error("No file selected");
//       return;
//     }

//     try {
//       // Send selectedFile inside an object { image: selectedFile }
//       const response = await recordAttendance({ image: selectedFile }).unwrap();
//       console.log('response', response);
//       toast.success("Attendance uploaded successfully!");
//       // router.push(`${companySlug}/attendence`)
//     } catch (err) {
//       console.error("Error:", err);
//       toast.error("Failed to upload attendance");
//     }
//   };

//   return (
//     <>
//   <Link href={`/${companySlug}/attendence`} className="back-button">
//     <FaArrowLeft size={20} color="#fff" />
//   </Link>

//   <div className="attendance-container">
//     <h1 className="page-title">Add Attendance</h1>

//     <div className="button-group">
//       <button
//         onClick={() => setShowWebcam(true)}
//         className="button webcam-button"
//       >
//         Use Webcam
//       </button>
//       <button
//         onClick={() => {
//           const uploadInput = document.getElementById("uploadInput") as HTMLInputElement;
//           uploadInput?.click();
//         }}
//         className="button upload-button"
//       >
//         Upload Image
//       </button>
//     </div>

//     {showWebcam && (
//       <div className="webcam-container">
//         <ReactWebcam
//           audio={false}
//           ref={webcamRef}
//           screenshotFormat="image/jpeg"
//           videoConstraints={{ facingMode: "user" }}
//           className="webcam"
//         />
//         <div className="webcam-actions">
//           <button onClick={captureFromWebcam} className="button capture-button">
//             Capture
//           </button>
//           <button onClick={() => setShowWebcam(false)} className="button cancel-button">
//             Cancel
//           </button>
//         </div>
//       </div>
//     )}

//     <input
//       id="uploadInput"
//       type="file"
//       accept="image/*"
//       className="upload-input"
//       onChange={handleFileChange}
//     />

//     {selectedFile && (
//       <div className="preview-container">
//         <p className="preview-text">Preview:</p>
//         <div className="image-preview-card">
//           <Image
//             alt="Preview"
//             src={URL.createObjectURL(selectedFile)}
//             width={100}
//             height={100}
//             unoptimized
//             className="preview-image"
//           />
//         </div>
//       </div>
//     )}

//     <form onSubmit={handleSubmit}>
//       <button type="submit" className="button submit-button">
//         Submit Attendance
//       </button>
//     </form>
//   </div>
// </>


//   );
// }

// export default AddAttendancePage;









"use client";
import React, { useState, useRef } from "react";
import ReactWebcam from "react-webcam";
import { useRecordAttendanceMutation } from "@/slices/attendance/attendance";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import { FaArrowLeft, FaCamera, FaUpload, FaCheckCircle } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useCompany } from "@/utils/Company";

function AddAttendancePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showWebcam, setShowWebcam] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const webcamRef = useRef<ReactWebcam | null>(null);
  const { companySlug } = useCompany();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowWebcam(false);
    }
  };

  const captureFromWebcam = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const blob = dataURLtoBlob(imageSrc);
      const file = new File([blob], "webcam.jpg", { type: blob.type });
      setSelectedFile(file);
      setShowWebcam(false);
    }
  };

  const dataURLtoBlob = (dataUrl: string): Blob => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || "";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const [recordAttendance] = useRecordAttendanceMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!selectedFile) {
      toast.error("Please capture or upload an image first");
      setIsSubmitting(false);
      return;
    }

    try {
      await recordAttendance({ image: selectedFile }).unwrap();
      toast.success("Attendance recorded successfully!");
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to record attendance");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="attendance-page-outer">
      <Link href={`/${companySlug}/attendence`} className="back-button">
          <FaArrowLeft />
        </Link>
        <div className="attendance-page">
      <main className="attendance-main">
        {!selectedFile ? (
          <div className="capture-options">
            <div className="option-card" onClick={() => setShowWebcam(true)}>
              <div className="option-icon">
                <FaCamera />
              </div>
              <h3>Take Photo</h3>
              <p>Use your camera to capture your attendance</p>
            </div>

            <div className="option-card">
              <label htmlFor="uploadInput">
                <div className="option-icon">
                  <FaUpload />
                </div>
                <h3>Upload Photo</h3>
                <p>Select an existing photo from your device</p>
              </label>
              <input
                id="uploadInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
        ) : (
          <div className="preview-section">
            <div className="preview-header">
              <h3>Photo Preview</h3>
              <button 
                onClick={() => setSelectedFile(null)} 
                className="clear-button"
              >
                <MdClose />
              </button>
            </div>
            
            <div className="image-preview">
              <Image
                alt="Preview"
                src={URL.createObjectURL(selectedFile)}
                fill
                style={{ objectFit: "contain" }}
                unoptimized
              />
            </div>
          </div>
        )}

        {showWebcam && (
          <div className="webcam-modal">
            <div className="webcam-container">
              <ReactWebcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user" }}
              />
              
              <div className="webcam-controls">
                <button 
                  onClick={() => setShowWebcam(false)} 
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button 
                  onClick={captureFromWebcam} 
                  className="capture-button"
                >
                  Capture
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedFile && (
          <form onSubmit={handleSubmit} className="submit-form">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`submit-button ${isSubmitting ? 'loading' : ''}`}
            >
              {isSubmitting ? (
                'Processing...'
              ) : (
                <>
                  <FaCheckCircle /> Confirm Attendance
                </>
              )}
            </button>
          </form>
        )}
      </main>
    </div>
    </div>
  );
}

export default AddAttendancePage;
"use client"; // If you're in Next.js 13 with app router
import React, { useState, useRef } from "react";
import ReactWebcam from "react-webcam";
import { useRecordAttendanceMutation } from "@/slices/attendance/attendance";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { useCompany } from "@/utils/Company";

function AddAttendancePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showWebcam, setShowWebcam] = useState<boolean>(false);
  const webcamRef = useRef<ReactWebcam | null>(null);
  const { companySlug } = useCompany();


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
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

    if (!selectedFile) {
      toast.error("No file selected");
      return;
    }

    try {
      // Send selectedFile inside an object { image: selectedFile }
      const response = await recordAttendance({ image: selectedFile }).unwrap();
      console.log('response', response);
      toast.success("Attendance uploaded successfully!");
      // router.push(`${companySlug}/attendence`)
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to upload attendance");
    }
  };

  return (
    <>
  <Link href={`/${companySlug}/attendence`} className="back-button">
    <FaArrowLeft size={20} color="#fff" />
  </Link>

  <div className="attendance-container">
    <h1 className="page-title">Add Attendance</h1>

    <div className="button-group">
      <button
        onClick={() => setShowWebcam(true)}
        className="button webcam-button"
      >
        Use Webcam
      </button>
      <button
        onClick={() => {
          const uploadInput = document.getElementById("uploadInput") as HTMLInputElement;
          uploadInput?.click();
        }}
        className="button upload-button"
      >
        Upload Image
      </button>
    </div>

    {showWebcam && (
      <div className="webcam-container">
        <ReactWebcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "user" }}
          className="webcam"
        />
        <div className="webcam-actions">
          <button onClick={captureFromWebcam} className="button capture-button">
            Capture
          </button>
          <button onClick={() => setShowWebcam(false)} className="button cancel-button">
            Cancel
          </button>
        </div>
      </div>
    )}

    <input
      id="uploadInput"
      type="file"
      accept="image/*"
      className="upload-input"
      onChange={handleFileChange}
    />

    {selectedFile && (
      <div className="preview-container">
        <p className="preview-text">Preview:</p>
        <div className="image-preview-card">
          <Image
            alt="Preview"
            src={URL.createObjectURL(selectedFile)}
            width={100}
            height={100}
            unoptimized
            className="preview-image"
          />
        </div>
      </div>
    )}

    <form onSubmit={handleSubmit}>
      <button type="submit" className="button submit-button">
        Submit Attendance
      </button>
    </form>
  </div>
</>


  );
}

export default AddAttendancePage;

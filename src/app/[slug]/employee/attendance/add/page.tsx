"use client"; // If you're in Next.js 13 with app router
import React, { useState, useRef } from "react";
import ReactWebcam from "react-webcam";
import { useRecordAttendanceMutation } from "@/slices";
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
      <Link href={`/${companySlug}/employee/attendence`} className='back-button'><FaArrowLeft size={20} color='#fff' /></Link>
      <div style={{ padding: "1rem" }}>
        <h1>Add Attendance</h1>

        <div style={{ marginBottom: "1rem" }}>
          <button
            onClick={() => setShowWebcam(true)}
            style={{ marginRight: "1rem" }}
          >
            Use Webcam
          </button>
          <button
            onClick={() => {
              const uploadInput = document.getElementById("uploadInput") as HTMLInputElement;
              uploadInput?.click();
            }}
          >
            Upload Image
          </button>
        </div>

        {showWebcam && (
          <div style={{ marginBottom: "1rem" }}>
            <ReactWebcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }}
              style={{ width: 300 }}
            />
            <div style={{ marginTop: "0.5rem" }}>
              <button onClick={captureFromWebcam} style={{ marginRight: "1rem" }}>
                Capture
              </button>
              <button className="cancel-btn" onClick={() => setShowWebcam(false)}>Cancel</button>
            </div>
          </div>
        )}

        <input
          id="uploadInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {selectedFile && (
          <div style={{ marginTop: "1rem" }}>
            <p>Preview:</p>
            <Image
              alt="Preview"
              src={URL.createObjectURL(selectedFile)}
              width={100}
              height={100}
              unoptimized
            />

          </div>
        )}

        <form onSubmit={handleSubmit}>
          <button type="submit" style={{ marginTop: "1rem" }}>
            Submit Attendance
          </button>
        </form>
      </div>
    </>
  );
}

export default AddAttendancePage;

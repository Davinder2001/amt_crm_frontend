// src/components/AddAttendancePage.tsx
"use client"; // For Next.js 13 app router
import React, { useState, useRef } from "react";
import ReactWebcam from "react-webcam";
import { useRecordAttendanceMutation } from "@/slices/attendance/attendance";

function AddAttendancePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showWebcam, setShowWebcam] = useState<boolean>(false);
  const webcamRef = useRef<ReactWebcam | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const [recordAttendance] = useRecordAttendanceMutation();

  const captureFromWebcam = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const blob = dataURLtoBlob(imageSrc);
      // Create a File object that mimics an uploaded file
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("No file selected");
      return;
    }

    try {
      // Pass the file directly (raw binary data will be sent)
      await recordAttendance(selectedFile).unwrap();
      alert("Attendance uploaded successfully!");
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to upload attendance");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Add Attendance</h1>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setShowWebcam(true)} style={{ marginRight: "1rem" }}>
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
            <button onClick={() => setShowWebcam(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Hidden file input for uploading an image */}
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
          <img alt="Preview" src={URL.createObjectURL(selectedFile)} style={{ width: 200, height: "auto" }} />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <button type="submit" style={{ marginTop: "1rem" }}>
          Submit Attendance
        </button>
      </form>
    </div>
  );
}

export default AddAttendancePage;

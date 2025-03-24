'use client';

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
// import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import { FaCamera } from 'react-icons/fa';
import Image from 'next/image';

const videoConstraints = {
  width: 320,
  height: 240,
  facingMode: 'user',
};

const Page = () => {
  // const { currentData: company } = useFetchSelectedCompanyQuery();
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [responseMsg, setResponseMsg] = useState('');
  const [showWebcam, setShowWebcam] = useState(false);

  const openCamera = () => {
    setShowWebcam(true);
    setCapturedImage(null);
    setResponseMsg('');
  };

  const capture = () => {
    const imageSrc = webcamRef.current ? webcamRef.current.getScreenshot() : null;
    setCapturedImage(imageSrc);
    setResponseMsg('Photo captured successfully ✅');
    setShowWebcam(false); // Close webcam after capture
  };

  const handleAttendance = () => {
    if (!capturedImage) {
      setResponseMsg('Please capture a photo first.');
      return;
    }
    setResponseMsg('Attendance logic is removed. Photo is ready.');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Attendance Page (Capture Only)</h1>

      {/* Camera Icon Button */}
      {!showWebcam && (
        <button
          onClick={openCamera}
          className="bg-gray-200 p-4 rounded-full text-black hover:bg-gray-300 inline-flex items-center"
        >
          <FaCamera size={24} className="mr-2" />
          Open Camera
        </button>
      )}

      {/* Webcam Preview */}
      {showWebcam && (
        <div className="mt-4">
          <Webcam
            audio={false}
            height={240}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={320}
            videoConstraints={videoConstraints}
            className="border rounded"
          />

          <div className="flex gap-4 mt-4">
            <button onClick={capture} className="bg-blue-600 text-white px-4 py-2 rounded">
              Capture Photo
            </button>
            <button onClick={() => setShowWebcam(false)} className="bg-red-600 text-white px-4 py-2 rounded">
              Close Camera
            </button>
          </div>
        </div>
      )}

      {/* Captured Image Preview */}
      {capturedImage && (
        <div className="mt-4">
          <h2 className="font-semibold">Preview:</h2>
          <Image src={capturedImage} alt="Captured" className="border rounded mt-2" width={100} height={100} />
        </div>
      )}

      {/* Attendance Action */}
      <button onClick={handleAttendance} className="bg-green-600 text-white px-4 py-2 rounded mt-4">
        Mark Attendance
      </button>

      {responseMsg && <p className="mt-4 text-lg">{responseMsg}</p>}
    </div>
  );
};

export default Page;

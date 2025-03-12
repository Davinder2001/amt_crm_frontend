"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation, useVerifyOtpMutation } from "@/slices/auth/authApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const router = useRouter();

  // State variables for the form
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [stage, setStage] = useState<"email" | "otp" | "reset">("email");
  const [error, setError] = useState<string>("");

  // API hooks
  const [forgotPassword, { isLoading: isSendingOtp }] = useForgotPasswordMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

  // Send OTP when email is submitted
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      toast.success("OTP sent to your email.");
      setStage("otp"); // Switch to OTP verification step
    } catch (err: any) {
      const errorMessage = err?.data?.errors?.email?.[0] || "Failed to send OTP.";
      toast.error(errorMessage);
    }
  };

  // Verify OTP and reset password
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Send all four fields (email, otp, password, password_confirmation)
      await verifyOtp({
        email,
        otp,
        password: newPassword,
        password_confirmation: confirmPassword,
      }).unwrap();

      // After verifying OTP, reset the password
      toast.success("OTP verified successfully. Your password is now reset.");
      setStage("reset");
      router.push("/login");
    } catch (err: any) {
      const errorMessage = err?.data?.errors?.otp?.[0] || "Failed to verify OTP.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white p-6 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {stage === "email" ? "Forgot Password" : stage === "otp" ? "Enter OTP" : "Reset Password"}
        </h2>

        {stage === "email" && (
          <form onSubmit={handleEmailSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-3 border rounded-md"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
              disabled={isSendingOtp}
            >
              {isSendingOtp ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {stage === "otp" && (
          <form onSubmit={handleOtpSubmit}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 mb-3 border rounded-md"
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 mb-3 border rounded-md"
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 mb-3 border rounded-md"
              required
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
              disabled={isVerifyingOtp}
            >
              {isVerifyingOtp ? "Verifying..." : "Verify OTP & Reset Password"}
            </button>
          </form>
        )}

        {stage === "reset" && <p>Password has been reset successfully!</p>}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Page;

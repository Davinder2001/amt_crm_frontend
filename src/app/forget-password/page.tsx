'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation, useVerifyOtpMutation } from "@/slices/auth/authApi";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { forgotPageimage} from "@/assets/useImage";
import { FiMail } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
// Define the error response structure
interface ErrorResponse {
  data?: {
    errors?: {
      [key: string]: string[]; // For example, email or otp error fields
    };
  };
  message?: string;
}

const ResetPasswordForm = () => {
  const router = useRouter();

  // State variables for the form
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [stage, setStage] = useState<"email" | "otp" | "reset">("email");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

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
    } catch (err) {
      const error = err as ErrorResponse;
      const errorMessage = error?.data?.errors?.email?.[0] || "Failed to send OTP.";
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
      await verifyOtp({
        email,
        otp,
        password: newPassword,
        password_confirmation: confirmPassword,
      }).unwrap();

      toast.success("OTP verified successfully. Your password is now reset.");
      setStage("reset");
      router.push("/login");
    } catch (err) {
      const error = err as ErrorResponse;
      const errorMessage = error?.data?.errors?.otp?.[0] || "Failed to verify OTP.";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <section className="forgot-p-form-wrapper">
        <div className="forgot-p-form-container">
          <div className="login-container2">
            <div className="left-panel">
              <button
                type="button"
                onClick={() => router.back()}
                className="back-button"
              >
                <IoArrowBack size={18} />
                Back
              </button>
              <div className="left-panel-inner">
              {stage === "email" && (
                <form onSubmit={handleEmailSubmit}>
                  <h1 className="title">Forgot your password?</h1>
            <p className="description">Don’t worry, we’ll help you reset it in a few steps.</p>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <div className="input-wrapper filled">
                      <FiMail size={18} className="input-icon" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email..."
                      />
                    </div>
                  </div>

                  <button type="submit" className="sendOTP-button" disabled={isSendingOtp}>
                    {isSendingOtp ? "Sending OTP..." : "Send OTP"}
                  </button>
                </form>
              )}

              {stage === "otp" && (
                <form onSubmit={handleOtpSubmit}>
                  <div className="form-group">
                    <label htmlFor="otp">OTP:</label>
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      placeholder="Enter OTP"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">New Password:</label>
                    <div className="password-container">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        placeholder="New Password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <div className="password-container">
                      <input
                        type={showPasswordConfirmation ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Confirm New Password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                      >
                        {showPasswordConfirmation ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {error && <p style={{ color: "red" }}>{error}</p>}

                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isVerifyingOtp}
                  >
                    {isVerifyingOtp ? "Verifying OTP..." : "Verify OTP & Reset Password"}
                  </button>
                </form>
              )}

              {stage === "reset" && <p>Password has been reset successfully!</p>}
            </div>
            </div>
            <div className="right-panel">
              <img src={forgotPageimage.src} alt="Doctors" className="illustration" />
            </div>
            
          </div>
        </div>

      </section>
      <ToastContainer />

    </>
  );
};

export default ResetPasswordForm;

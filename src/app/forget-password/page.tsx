'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation, useVerifyOtpMutation } from "@/slices/auth/authApi";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

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
      <section className="form-wrapper">
        <div className="form-container">
          <h2>{stage === "email" ? "Forgot Password" : stage === "otp" ? "Enter OTP" : "Reset Password"}</h2>
          
          {stage === "email" && (
            <form onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <button type="submit" className="submit-button" disabled={isSendingOtp}>
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
      </section>
      <ToastContainer />
      <style jsx>{`
        .form-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 50px 0;
          background: #f9f9f9;
        }

        .form-container {
          max-width: 700px;
          width: 100%;
          padding: 30px;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
        }

        h2 {
          text-align: center;
          font-size: 32px;
          font-weight: 700;
          color: #222222;
          margin-bottom: 15px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
        }

        label {
          font-weight: 600;
          margin-bottom: 8px;
          color: #333333;
        }

        input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          color: #333333;
          margin-bottom: 5px;
          transition: border 0.3s ease;
        }

        input:focus {
          border-color: #009693;
          outline: none;
        }

        .password-container {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #888888;
        }

        .submit-button {
          width: 100%;
          padding: 10px;
          background-color: #009693;
          border: none;
          border-radius: 8px;
          color: #ffffff;
          font-size: 18px;
          cursor: pointer;
          margin-top: 20px;
        }

        .submit-button:hover {
          background-color: #01A601;
        }
      `}</style>
    </>
  );
};

export default ResetPasswordForm;

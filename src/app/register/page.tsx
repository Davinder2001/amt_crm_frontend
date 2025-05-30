"use client";
import React, { useState } from "react";
import { useSendOtpMutation, useAdminRegisterMutation } from "@/slices/auth/authApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FaWhatsapp } from "react-icons/fa";
import { FiEye, FiEyeOff, FiLock, FiPhone, FiUser, FiMail } from "react-icons/fi";
import { encodeStorage } from "@/utils/Company";
import { useUser } from "@/provider/UserContext";

const LOCAL_STORAGE_KEY = "basicUserInfo";

const UserRegisterForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    password_confirmation: "",
  });
  const [requestId, setRequestId] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { setUser } = useUser();
  const [sendOtp, { isLoading: sendingOtp }] = useSendOtpMutation();
  const [adminRegister, { isLoading: registering }] = useAdminRegisterMutation();

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async () => {
    try {
      const res = await sendOtp({ number: form.number }).unwrap();
      setRequestId(res.request_id);
      setOtpSent(true);
      toast.success("OTP sent!");
    } catch {
      toast.error("Failed to send OTP");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.password_confirmation) return toast.error("Passwords do not match");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("number", form.number);
    formData.append("password", form.password);
    formData.append("password_confirmation", form.password_confirmation);
    formData.append("otp", otp);
    formData.append("request_id", requestId);

    try {
      const response = await adminRegister(formData).unwrap();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(form));
 
      // Set cookies
      Cookies.set('access_token', response.token, { path: '/' });
      Cookies.set('user_type', response.user.user_type, { path: '/' });
      // Store the data in localStorage with encoding
      localStorage.setItem('access_token', encodeStorage(response.token));
      localStorage.setItem('user_type', encodeStorage(response.user.user_type));
      // Update user in context
      setUser(response.user);

      toast.success("Registered successfully");
      router.push("/");
    } catch {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="register-popup">
      <h2 className="text-lg font-semibold mb-4">Create Your Account</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="form-group">
          <label><FiUser /> Full Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label><FiMail /> Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label><FiPhone /> Phone Number</label>
          <div className="input-group">
            <input
              name="number"
              value={form.number}
              onChange={handleChange}
              maxLength={10}
              required
            />
            <button type="button" onClick={handleSendOtp} disabled={sendingOtp || !form.number || form.number.length !== 10}>
              <FaWhatsapp /> {sendingOtp ? "Sending..." : "Send OTP"}
            </button>
          </div>
        </div>

        {otpSent && (
          <div className="form-group">
            <label>Enter OTP</label>
            <input
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label><FiLock /> Password</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label><FiLock /> Confirm Password</label>
          <div className="input-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              required
            />
            <span onClick={() => setShowConfirmPassword((prev) => !prev)}>
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={registering}>
          {registering ? "Registering..." : "Register"}
        </button>
      </form>

      <style jsx>{`
        .register-popup {
          max-width: 450px;
          margin: 40px auto;
          padding: 24px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
        }

        h2 {
          text-align: center;
          margin-bottom: 24px;
          font-size: 1.5rem;
          color: #333;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
        }

        .form-group label {
          font-weight: 500;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #444;
        }

        .form-group input {
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
        }

        .input-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .input-group input {
          flex: 1;
        }

        .input-group span {
          cursor: pointer;
          margin-left: 4px;
          color: #888;
        }

        button {
          font-weight: 600;
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          background: #007bff;
          color: #fff;
          cursor: pointer;
          margin-top: 8px;
        }

        button:hover {
          background: #005fcc;
        }

        button:disabled {
          background: #b5cce7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default UserRegisterForm;

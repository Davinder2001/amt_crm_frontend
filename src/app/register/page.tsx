"use client";
import React, { useState } from "react";
import { useSendOtpMutation, useAdminRegisterMutation } from "@/slices";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FaWhatsapp } from "react-icons/fa";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { MdSmartphone, MdEmail, MdPerson } from "react-icons/md";
import { encodeStorage } from "@/utils/Company";
import { useUser } from "@/provider/UserContext";
import Image from "next/image";
import Link from "next/link";
import Loader from "@/components/common/Loader";
import { loginPageimage } from "@/assets/useImage";

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
    if (!otpSent) {
      return toast.error("Please request an OTP first");
    }
    if (!otp) {
      return toast.error("Please enter the OTP");
    }

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
    <div className="login-container2 register-contianer">
      {registering && <Loader />}
      <div className="left-panel">
        <div className="form-box">
          <h1 className="title">Create your account <span className='wave-hand'>👋🏻</span></h1>
          <p className="description">Please fill in your details to register.</p>

          {!registering && (
            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <label>Full Name</label>
                <div className="input-wrapper filled">
                  <MdPerson size={18} className="input-icon" />
                  <input
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    className="login-input"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Email</label>
                <div className="input-wrapper filled">
                  <MdEmail size={18} className="input-icon" />
                  <input
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="login-input"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Phone Number</label>
                <div className="input-wrapper filled">
                  <MdSmartphone size={18} className="input-icon" />
                  <input
                    name="number"
                    type="text"
                    placeholder="0123456789"
                    value={form.number}
                    onChange={handleChange}
                    maxLength={10}
                    className="login-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp || !form.number || form.number.length !== 10}
                    className="otp-button"
                  >
                    <FaWhatsapp /> {sendingOtp ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              </div>

              {otpSent && (
                <div className="input-group">
                  <label>OTP</label>
                  <div className="input-wrapper filled">
                    <MdSmartphone size={18} className="input-icon" />
                    <input
                      name="otp"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="login-input"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="input-group">
                <label>Password</label>
                <div className="input-wrapper filled">
                  <FiLock size={18} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="mySecurePass123"
                    value={form.password}
                    onChange={handleChange}
                    className="password-input"
                    required
                  />
                  <span
                    className="password-toggle-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
              </div>

              <div className="input-group">
                <label>Confirm Password</label>
                <div className="input-wrapper filled">
                  <FiLock size={18} className="input-icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="password_confirmation"
                    placeholder="mySecurePass123"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    className="password-input"
                    required
                  />
                  <span
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
              </div>

              <button type="submit" className="login-button" disabled={registering}>
                {registering ? 'Registering...' : 'Register'}
              </button>
            </form>
          )}

          <div className="login-footer-links">
            <p>Already have an account? <Link href="/login" className="register-company-link">Login here</Link></p>
          </div>
        </div>
      </div>

      <div className="right-panel">
        <Image
          src={loginPageimage.src}
          alt="Registration Illustration"
          className="illustration"
          width={600}
          height={400}
          priority
        />
      </div>
    </div>
  );
};

export default UserRegisterForm;
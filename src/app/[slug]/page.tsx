"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFetchProfileQuery, useLoginMutation } from "@/slices/auth/authApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CompanyPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const router = useRouter();
  const [slug, setSlug] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [number, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { data: profile, isFetching } = useFetchProfileQuery();
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    })();
  }, [params]);

  useEffect(() => {
    if (profile?.user && slug) {
      if (profile.user.company_slug === slug) {
        setUser(profile.user);
      } else {
        setUser(null);
      }
    }
  }, [profile, slug]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ number, password }).unwrap();
      toast.success("Login successful");

      document.cookie = `access_token=${result.access_token}; path=/;`;
      window.location.reload();
    } catch (err: any) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  if (isFetching) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {user ? (
        <>
          <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
          <p>Number: {user.number}</p>
          <p>Company: {user.company_name}</p>
          <p>Slug: {user.company_slug}</p>
        </>
      ) : (
        <div className="bg-white p-6 shadow-md rounded-md w-96">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Number"
              value={number}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-3 border rounded-md"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-3 border rounded-md"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CompanyPage;

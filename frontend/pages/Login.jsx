import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userName", data.user.name);
        navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Error logging in");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-sm text-center border border-purple-100"
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-purple-100 p-4 rounded-xl">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-purple-600">Welcome Back</h1>
        <p className="text-gray-500 text-sm mb-6">
          Sign in to access your notes
        </p>

        {/* Email */}
        <div className="text-left mb-3">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
        </div>

        {/* Password */}
        <div className="text-left mb-5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg py-2.5 font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all"
        >
          Sign In
        </button>

        {/* Link */}
        <p className="text-sm text-gray-600 mt-5">
          Need an account?{" "}
          <Link to="/register" className="text-purple-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

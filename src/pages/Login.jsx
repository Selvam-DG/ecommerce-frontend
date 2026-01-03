import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../lib/api";
import useStore from "../store/useStore";

export default function Login() {
  const { setUser } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await authAPI.login(form);

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      //  fetch profile AFTER login
      const profileRes = await authAPI.getProfile();
      console.log(profileRes);
      setUser(profileRes.data);

      navigate("/", { replace: true });
    } catch (err) {
      if (err.response?.status === 403) {
        setError(err.response.data.error);
      } else {
        setError("Invalid credentials");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={submit} className="bg-white p-8 shadow rounded w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Login</h2>

        {error && <p className="bg-red-100 text-red-600 p-2 mb-4">{error}</p>}

        <input
          className="input"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="input mt-3"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full mt-6 bg-indigo-600 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}

import { useState } from "react";
import { authAPI } from "../lib/api";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
    phone: "",
  });

  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await authAPI.register(form);
    setSuccess(
      "Registration successful. Please check your email to verify your account."
    );
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="bg-green-100 p-6 rounded">{success}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={submit} className="bg-white p-8 shadow rounded w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Create Account</h2>

        <input className="input" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
        <input className="input mt-3" placeholder="First Name" onChange={e => setForm({...form, first_name: e.target.value})} />
        <input className="input mt-3" placeholder="Last Name" onChange={e => setForm({...form, last_name: e.target.value})} />
        <input className="input mt-3" placeholder="Phone" onChange={e => setForm({...form, phone: e.target.value})} />
        <input type="password" className="input mt-3" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
        <input type="password" className="input mt-3" placeholder="Confirm Password" onChange={e => setForm({...form, password2: e.target.value})} />

        <button className="w-full mt-6 bg-indigo-600 text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}

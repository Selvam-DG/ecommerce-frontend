import { useState } from "react";
import { authAPI } from "../lib/api";

export default function ResendVerification() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = async () => {
    await authAPI.resendVerification(email);
    setMessage("Verification email resent. Please check inbox.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 shadow rounded">
        <input
          placeholder="Email"
          className="input"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={submit} className="btn mt-4">
          Resend
        </button>
        {message && <p className="mt-3 text-green-600">{message}</p>}
      </div>
    </div>
  );
}

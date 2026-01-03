import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { authAPI } from "../lib/api";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    authAPI
      .verifyEmail(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.data.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.error ||
          "Invalid or expired verification link."
        );
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 shadow rounded max-w-md text-center">
        {status === "loading" && <p>Verifying email...</p>}

        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-3">
              Email Verified 🎉
            </h2>
            <p className="mb-4">{message}</p>
            <Link
              to="/login"
              className="text-indigo-600 underline"
            >
              Login Now
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-3">
              Verification Failed
            </h2>
            <p>{message}</p>
          </>
        )}
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import useStore from "../store/useStore";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useStore();

  const displayName =
    user?.first_name
      ? `${user.first_name} ${user.last_name || ""}`
      : user?.email;

  return (
    <nav className="bg-white shadow border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          ShopX
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>

          {isAuthenticated ? (
            <>
              <span className="text-gray-700 text-sm">
                Hi, <strong>{displayName}</strong>
              </span>

              <Link
                to="/"
                className="px-3 py-1 rounded bg-indigo-600 text-white text-sm"
              >
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="px-3 py-1 bg-gray-200 rounded text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="text-indigo-600">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

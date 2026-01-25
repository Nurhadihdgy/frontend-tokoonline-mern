import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({
        name: localStorage.getItem("name"),
        role: localStorage.getItem("role")
      });
    }
  }, []);

  const logout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Anda yakin ingin keluar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Logout"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/login");
      }
    });
  };

  return (
    <nav className="w-screen bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="text-white font-bold text-xl">
          <ion-icon name="cart-outline" className="text-blue-400 mr-2"></ion-icon>
          Toko Online Nurhadi
        </Link>

        {/* MENU */}
        <div className="flex items-center gap-6 text-sm">
          <Link to="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link to="/products" className="text-gray-300 hover:text-white">
            Products
          </Link>

          {/* ADMIN MENU */}
          {user?.role === "admin" && (
            <Link
              to="/products/add"
              className="text-gray-300 hover:text-white"
            >
              Add Product
            </Link>
          )}

          {/* AUTH */}
          {!user ? (
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-gray-300">
                <ion-icon name="person-circle-outline" className="text-xl mr-2"></ion-icon>
                <span className="font-semibold">{user.name}</span>
                <span className="ml-1 text-xs text-blue-400">
                  ({user.role})
                </span>
              </div>

              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

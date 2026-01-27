import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({
        name: localStorage.getItem("name"),
        role: localStorage.getItem("role"),
      });
    }
  }, []);

  const logout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Anda yakin ingin keluar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Logout",
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
        <Link to="/" className="text-white font-bold text-xl flex items-center">
          <ion-icon
            name="cart-outline"
            className="text-blue-400 text-2xl mr-2"
          ></ion-icon>
          Toko Online Nurhadi
        </Link>

        {/* HAMBURGER (MOBILE) */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white text-2xl"
        >
          <ion-icon name={open ? "close-outline" : "menu-outline"}></ion-icon>
        </button>

        {/* MENU DESKTOP */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <MenuItems user={user} logout={logout} />
        </div>
      </div>

      {/* MENU MOBILE */}
      {open && (
        <div className="md:hidden bg-gray-800 px-6 pb-4 space-y-4">
          <MenuItems
            user={user}
            logout={logout}
            mobile
            close={() => setOpen(false)}
          />
        </div>
      )}
    </nav>
  );
}

/* ============================= */
/* REUSABLE MENU COMPONENT */
/* ============================= */
function MenuItems({ user, logout, mobile = false, close }) {
  const baseClass = "block text-gray-300 hover:text-white transition";

  const handleClick = () => {
    if (mobile && close) close();
  };

  /* =============================
     BELUM LOGIN
     ============================= */
  if (!user) {
    return (
      <>
        <Link to="/" onClick={handleClick} className={baseClass}>
          Home
        </Link>

        <Link
          to="/login"
          onClick={handleClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center"
        >
          Login
        </Link>
      </>
    );
  }

  /* =============================
     SUDAH LOGIN
     ============================= */
  return (
    <>
      <Link to="/" onClick={handleClick} className={baseClass}>
        Home
      </Link>

      <Link to="/products" onClick={handleClick} className={baseClass}>
        Products
      </Link>

      {user.role === "admin" && (
        <Link
          to="/products/add"
          onClick={handleClick}
          className={baseClass}
        >
          Add Product
        </Link>
      )}

      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="text-gray-300 text-sm">
          <ion-icon
            name="person-circle-outline"
            className="text-lg mr-1"
          ></ion-icon>
          <span className="font-semibold">{user.name}</span>
          <span className="ml-1 text-xs text-blue-400">
            ({user.role})
          </span>
        </div>

        <button
          onClick={() => {
            logout();
            if (mobile && close) close();
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </>
  );
}


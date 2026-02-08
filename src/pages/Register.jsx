import { useState } from "react";
import { registerUser } from "../services/api";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import ReactGA from "react-ga4";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerUser(form);
      

      Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil",
        text: "Silakan login untuk melanjutkan",
        confirmButtonText: "Ke Login"
      }).then(() => navigate("/login"));

      ReactGA.event({ category: "Auth", action: "Register Success",});
    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Registrasi gagal",
        "error"
      );

      ReactGA.event({ category: "Auth", action: "Register Gagal",});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={submit}
        className="bg-gray-800 p-6 rounded-xl w-96 space-y-4 shadow-lg"
      >
        <h2 className="text-xl font-bold text-center">Register</h2>

        <input
          type="text"
          placeholder="Nama Lengkap"
          className="w-full p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded transition disabled:opacity-50"
        >
          {loading ? "Mendaftarkan..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>

        <Link
          to="/"
          className="block text-center text-sm text-gray-400 hover:text-white transition"
        >
          ← Kembali ke Home
        </Link>
      </form>
    </div>
  );
}

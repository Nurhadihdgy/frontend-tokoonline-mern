import { useState } from "react";
import { loginUser } from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ReactGA from "react-ga4";

export default function Login() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name", res.data.user.name);

      Swal.fire("Berhasil", "Login berhasil", "success");

      ReactGA.event({
        category: "Auth",
        action: "Login Success",
      });

      navigate("/products");
    } catch (err) {
      Swal.fire("Gagal", err.response?.data?.message || "Login gagal", "error");
        ReactGA.event({ category: "Auth", action: "Login Gagal",})
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={submit}
        className="bg-gray-800 p-6 rounded-xl w-80 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Login</h2>

        <input
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-700"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-700"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-blue-600 py-2 rounded">Login</button>
        <div className="text-gray-400 mt-4 justify-center flex">
          Belum punya akun?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Register
          </a>
        </div>
      </form>
    </div>
  );
}

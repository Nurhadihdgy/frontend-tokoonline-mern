import { Link } from "react-router-dom";


export default function Home() {
  return (
    <section className="w-screen h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* HERO */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-0 grid md:grid-cols-2 gap-16 items-center">
        {/* LEFT */}
        <div>
          <span className="inline-block bg-blue-600/20 text-blue-400 px-4 py-1 rounded-full text-sm mb-4">
            MERN Stack Project
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Toko Online
            <span className="block text-blue-500">Modern & Aman</span>
          </h1>

          <p className="text-gray-300 text-lg mb-8 max-w-xl">
            Aplikasi toko online berbasis React, Node.js, MongoDB, dan JWT
            dengan sistem autentikasi, proteksi role, serta monitoring pengguna.
          </p>

          <div className="flex gap-4">
            <Link
              to="/products"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold transition"
            >
              Lihat Produk
            </Link>

            <Link
              to="/login"
              className="border border-gray-500 text-white hover:border-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Login
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative hidden md:block">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-600/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl"></div>

          <div className="relative bg-white/10 backdrop-blur-xl p-8 mb-9 rounded-2xl shadow-2xl border border-gray-700">
            <img
              src="https://illustrations.popsy.co/gray/shopping-cart.svg"
              alt="Shopping"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="bg-gray-900/60 border-t border-gray-700">
        <div className="bg-gray-900/60 border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-20 grid sm:grid-cols-2 md:grid-cols-3 gap-10">
            <Feature
              title="JWT Authentication"
              desc="Keamanan aplikasi menggunakan token JWT dengan proteksi route."
              icon="lock-closed-outline"
            />
            <Feature
              title="Role Based Access"
              desc="Pembagian hak akses antara admin dan user."
              icon="shield-checkmark-outline"
            />
            <Feature
              title="Monitoring Pengguna"
              desc="Integrasi Google Analytics untuk memantau aktivitas."
              icon="analytics-outline"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ title, desc, icon }) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 hover:shadow-xl transition border border-gray-700 group">
      
      <div className="text-blue-500 text-4xl mb-4 group-hover:scale-110 transition">
        <ion-icon name={icon}></ion-icon>
      </div>

      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </div>
  );
}


import { useEffect, useState } from "react";
import { getProducts } from "../services/api";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    setError(false);

    getProducts()
      .then((res) => {
        setProducts(res.data.products);
        setFiltered(res.data.products);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔍 SEARCH FILTER
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    );
  }, [search, products]);

  /* =======================
     LOADING
  ======================= */
  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-gray-900 text-white">
        <Navbar />
      <div className="w-screen grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-9 py-9">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-xl shadow-lg animate-pulse"
          >
            <div className="h-48 bg-gray-700" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-700 rounded w-1/2" />
              <div className="h-8 bg-gray-700 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
      </div>
    );
  }

  /* =======================
     2️⃣ API ERROR / DOWN
  ======================= */
  if (error) {
    return (
      <div className="min-h-screen w-screen bg-gray-900 text-white">
        <Navbar />
      
      <div className="w-screen min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076500.png"
          alt="Server down"
          className="w-40 mb-6 opacity-80"
        />

        <h2 className="text-2xl font-bold mb-2">
          Server tidak dapat dihubungi
        </h2>

        <p className="text-gray-400 mb-6">
          Silakan periksa koneksi atau coba beberapa saat lagi
        </p>

        <button
          onClick={fetchProducts}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Coba Lagi
        </button>
      </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ion-icon name="bag-handle-outline" class="text-blue-400"></ion-icon>
              Daftar Produk
            </h1>
            <p className="text-gray-400 text-sm">
              Temukan produk terbaik untuk Anda
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full md:w-80">
            <ion-icon
              name="search-outline"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            ></ion-icon>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk atau kategori..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800
                         focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* EMPTY */}
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            Produk tidak ditemukan
          </p>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filtered.map((p) => (
            <div
              key={p._id}
              className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg
                         hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              <img
                src={`${api.defaults.baseURL}/products/${p._id}/image`}
                alt={p.name}
                className="h-48 w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.assets.so/img.jpg?w=400&h=300&bg=dcfce7&f=png";
                }}
              />

              <div className="p-5">
                <h3 className="text-xl font-semibold mb-1">{p.name}</h3>

                <p className="text-sm text-gray-400 mb-2">
                  {p.category}
                </p>

                <p className="text-green-400 font-bold text-lg mb-4">
                  Rp {p.price.toLocaleString("id-ID")}
                </p>

                <Link
                  to={`/products/${p._id}`}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white
                             hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                >
                  Detail
                  <ion-icon name="arrow-forward-outline"></ion-icon>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

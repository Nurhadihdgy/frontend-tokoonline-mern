import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { getUser } from "../services/auth";
import ReactGA from "react-ga4";

export default function ProductDetail() {
  const user = getUser();
  const isAdmin = user?.role === "admin";

  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => setProduct(res.data.product))
      .catch(console.error);
  }, [id]);

  const deleteProduct = async () => {
    const result = await Swal.fire({
      title: "Hapus produk?",
      text: "Data yang dihapus tidak bisa dikembalikan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus",
    });

    if (!result.isConfirmed) return;

    await API.delete(`/products/${id}`);

    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Produk berhasil dihapus",
    });

    ReactGA.event({ category: "Product", action: "Delete Product" });

    navigate("/products");
  };

  if (!product) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
  <div className="min-h-screen w-full bg-gray-900 text-white">
    <Navbar />

    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <Link to="/products" className="text-blue-400 underline text-sm sm:text-base">
        ← Kembali ke Produk
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-6">
        <img
          src={product.imageUrl}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://via.assets.so/img.jpg?w=400&h=400&bg=dcfce7&f=png";
          }}
          className="w-full aspect-square object-cover rounded-xl"
        />

        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            {product.name}
          </h1>

          <p className="text-green-400 text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
            Rp {product.price.toLocaleString("id-ID")}
          </p>

          <p className="text-gray-300 text-sm sm:text-base mb-4">
            {product.description || "Tidak ada deskripsi"}
          </p>

          <p className="text-sm text-gray-400">Kategori: {product.category}</p>
          <p className="text-sm text-gray-400 mb-6">Stok: {product.stock}</p>

          {isAdmin && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
              <button
                onClick={() => navigate(`/products/${id}/edit`)}
                className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2 rounded-lg font-semibold transition"
              >
                <ion-icon name="create-outline" class="text-xl"></ion-icon>
                Ubah
              </button>

              <button
                onClick={deleteProduct}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold transition"
              >
                <ion-icon name="trash-outline" class="text-xl"></ion-icon>
                Hapus
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

}

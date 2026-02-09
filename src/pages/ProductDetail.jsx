import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import API, { addToCart } from "../services/api";
import Navbar from "../components/Navbar";
import ImagePlaceholder from "../components/ImagePlaceholder";
import { getUser } from "../services/auth";
import ReactGA from "react-ga4";

export default function ProductDetail() {
  const user = getUser();
  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

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
        <ImagePlaceholder
          src={product.imageUrl}
          alt={product.name}
          size="large"
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
          <p className={`text-sm mb-6 ${product.stock > 0 ? "text-gray-400" : "text-red-400 font-semibold"}`}>
            {product.stock > 0 ? `Stok: ${product.stock}` : "Stok Habis"}
          </p>

          {isUser && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 mb-4">
              <button
                onClick={() => {
                  addToCart(product._id)
                    .then(() => {
                      window.dispatchEvent(new Event("cart-updated"));
                      Swal.fire({
                        icon: "success",
                        title: "Ditambahkan!",
                        text: `${product.name} ditambahkan ke keranjang`,
                        timer: 1500,
                        showConfirmButton: false,
                      });
                    })
                    .catch((err) => {
                      const msg = err.response?.data?.message || "Gagal menambahkan ke keranjang";
                      Swal.fire({ icon: "error", title: "Gagal", text: msg });
                    });
                }}
                disabled={product.stock <= 0}
                className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-semibold transition
                  ${product.stock > 0
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}
              >
                <ion-icon name="cart-outline" class="text-xl"></ion-icon>
                {product.stock > 0 ? "Tambah ke Keranjang" : "Stok Habis"}
              </button>
            </div>
          )}

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

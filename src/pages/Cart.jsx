import { useEffect, useState } from "react";
import { getCart, updateCartItem, removeFromCart, clearCart } from "../services/api";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCart = () => {
    setLoading(true);
    setError(false);

    getCart()
      .then((res) => {
        setCart(res.data?.cart || { items: [] });
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQty = (productId, newQty) => {
    if (newQty < 1) return;
    updateCartItem(productId, newQty)
      .then((res) => {
        setCart(res.data?.cart);
        window.dispatchEvent(new Event("cart-updated"));
      })
      .catch(() =>
        Swal.fire({ icon: "error", title: "Gagal", text: "Gagal update quantity" })
      );
  };

  const handleRemove = (productId, productName) => {
    Swal.fire({
      title: "Hapus item?",
      text: `Hapus ${productName} dari keranjang?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      confirmButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(productId)
          .then((res) => {
            setCart(res.data?.cart);
            window.dispatchEvent(new Event("cart-updated"));
          })
          .catch(() =>
            Swal.fire({ icon: "error", title: "Gagal", text: "Gagal menghapus item" })
          );
      }
    });
  };

  const handleClearCart = () => {
    Swal.fire({
      title: "Kosongkan keranjang?",
      text: "Semua item akan dihapus",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Kosongkan",
      confirmButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart()
          .then((res) => {
            setCart(res.data?.cart);
            window.dispatchEvent(new Event("cart-updated"));
          })
          .catch(() =>
            Swal.fire({ icon: "error", title: "Gagal", text: "Gagal mengosongkan keranjang" })
          );
      }
    });
  };

  const totalPrice =
    cart?.items?.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    ) || 0;

  const totalItems =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  /* =======================
     LOADING
  ======================= */
  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-gray-900 text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-xl p-4 flex gap-4 animate-pulse"
            >
              <div className="w-24 h-24 bg-gray-700 rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-700 rounded w-1/2" />
                <div className="h-4 bg-gray-700 rounded w-1/3" />
                <div className="h-4 bg-gray-700 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* =======================
     ERROR
  ======================= */
  if (error) {
    return (
      <div className="min-h-screen w-screen bg-gray-900 text-white">
        <Navbar />
        <div className="w-screen min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-2xl font-bold mb-2">Gagal memuat keranjang</h2>
          <p className="text-gray-400 mb-6">Silakan coba lagi</p>
          <button
            onClick={fetchCart}
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

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ion-icon name="cart-outline" class="text-blue-400"></ion-icon>
              Keranjang Belanja
            </h1>
            <p className="text-gray-400 text-sm">
              {totalItems} item di keranjang
            </p>
          </div>

          {cart?.items?.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
            >
              <ion-icon name="trash-outline"></ion-icon>
              Kosongkan
            </button>
          )}
        </div>

        {/* EMPTY CART */}
        {(!cart?.items || cart.items.length === 0) && (
          <div className="text-center py-20">
            <ion-icon
              name="cart-outline"
              style={{ fontSize: "80px" }}
              class="text-gray-600 mb-4"
            ></ion-icon>
            <h2 className="text-xl font-semibold text-gray-400 mb-2">
              Keranjang kosong
            </h2>
            <p className="text-gray-500 mb-6">
              Belum ada produk di keranjang Anda
            </p>
            <Link
              to="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <ion-icon name="bag-handle-outline"></ion-icon>
              Lihat Produk
            </Link>
          </div>
        )}

        {/* CART ITEMS */}
        {cart?.items?.length > 0 && (
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.product?._id || item._id}
                className="bg-gray-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
              >
                {/* IMAGE */}
                <img
                  src={item.product?.imageUrl}
                  alt={item.product?.name}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.assets.so/img.jpg?w=100&h=100&bg=dcfce7&f=png";
                  }}
                />

                {/* INFO */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold truncate">
                    {item.product?.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {item.product?.category}
                  </p>
                  <p className="text-green-400 font-bold">
                    Rp {item.product?.price?.toLocaleString("id-ID")}
                  </p>
                </div>

                {/* QUANTITY */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleUpdateQty(item.product?._id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600
                               disabled:opacity-40 disabled:cursor-not-allowed
                               flex items-center justify-center text-lg"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleUpdateQty(item.product?._id, item.quantity + 1)
                    }
                    className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600
                               flex items-center justify-center text-lg"
                  >
                    +
                  </button>
                </div>

                {/* SUBTOTAL */}
                <div className="text-right min-w-[120px]">
                  <p className="text-green-400 font-bold">
                    Rp{" "}
                    {(
                      (item.product?.price || 0) * item.quantity
                    ).toLocaleString("id-ID")}
                  </p>
                </div>

                {/* REMOVE */}
                <button
                  onClick={() =>
                    handleRemove(item.product?._id, item.product?.name)
                  }
                  className="text-red-400 hover:text-red-300 text-xl"
                >
                  <ion-icon name="trash-outline"></ion-icon>
                </button>
              </div>
            ))}

            {/* TOTAL */}
            <div className="bg-gray-800 rounded-xl p-6 mt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm">Total ({totalItems} item)</p>
                  <p className="text-2xl font-bold text-green-400">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    to="/products"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg
                               inline-flex items-center gap-2 transition"
                  >
                    <ion-icon name="bag-handle-outline"></ion-icon>
                    Lanjut Belanja
                  </Link>
                  <Link
                    to="/checkout"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg
                               inline-flex items-center gap-2 transition font-semibold"
                  >
                    <ion-icon name="card-outline"></ion-icon>
                    Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

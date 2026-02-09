import { useEffect, useState } from "react";
import { getCart, checkout, checkPayment } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import ImagePlaceholder from "../components/ImagePlaceholder";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [order, setOrder] = useState(null);
  const [checking, setChecking] = useState(false);
  const [paid, setPaid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCart()
      .then((res) => setCart(res.data?.cart || { items: [] }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalPrice =
    cart?.items?.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    ) || 0;

  const totalItems =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const hasStockIssue = cart?.items?.some(
    (item) => item.quantity > (item.product?.stock || 0)
  );

  const handleCheckout = () => {
    if (!paymentMethod) {
      Swal.fire({ icon: "warning", title: "Pilih metode pembayaran" });
      return;
    }
    setSubmitting(true);
    checkout(paymentMethod)
      .then((res) => {
        const newOrder = res.data?.order;
        setOrder(newOrder);
        window.dispatchEvent(new Event("cart-updated"));

        if (paymentMethod === "cash") {
          setPaid(true);
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Checkout gagal";
        Swal.fire({ icon: "error", title: "Gagal", text: msg });
      })
      .finally(() => setSubmitting(false));
  };

  const handleCheckPayment = () => {
    if (!order) return;
    setChecking(true);

    setTimeout(() => {
      checkPayment(order._id)
        .then((res) => {
          const updatedOrder = res.data?.order;
          setOrder(updatedOrder);
          setPaid(true);
        })
        .catch(() => {
          Swal.fire({ icon: "error", title: "Gagal", text: "Gagal cek pembayaran" });
        })
        .finally(() => setChecking(false));
    }, 2000);
  };

  /* =======================
     LOADING
  ======================= */
  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-gray-900 text-white">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/2" />
            <div className="h-40 bg-gray-800 rounded-xl" />
            <div className="h-40 bg-gray-800 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  /* =======================
     CART KOSONG (belum checkout)
  ======================= */
  if (!order && (!cart?.items || cart.items.length === 0)) {
    return (
      <div className="min-h-screen w-screen bg-gray-900 text-white">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-10 text-center">
          <h1 className="text-2xl font-bold mb-4">Checkout</h1>
          <p className="text-gray-400 mb-6">Keranjang kosong, tidak ada yang bisa di-checkout.</p>
          <Link
            to="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Lihat Produk
          </Link>
        </div>
      </div>
    );
  }

  /* =======================
     PEMBAYARAN SUKSES
  ======================= */
  if (paid && order) {
    return (
      <div className="min-h-screen w-screen bg-gray-900 text-white">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="bg-gray-800 rounded-2xl p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <ion-icon name="checkmark-outline" style={{ fontSize: "40px", color: "white" }}></ion-icon>
            </div>

            <h1 className="text-3xl font-bold text-green-400 mb-2">
              Pembayaran Berhasil!
            </h1>

            <p className="text-gray-400 mb-6">
              Terima kasih atas pesanan Anda
            </p>

            {/* Info Box */}
            <div className="bg-gray-700 rounded-xl p-6 mb-6 text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Order ID</span>
                <span className="font-mono text-sm">{order._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Metode Pembayaran</span>
                <span className="font-semibold uppercase">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total</span>
                <span className="text-green-400 font-bold">
                  Rp {order.totalPrice?.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status Pembayaran</span>
                <span className="text-green-400 font-semibold">Lunas</span>
              </div>

              <hr className="border-gray-600" />

              <h3 className="font-semibold text-white">Item Pesanan:</h3>
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-300">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="text-gray-300">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>

            {/* Forwarded to seller */}
            <div className="bg-blue-900/40 border border-blue-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-blue-400 mb-2">
                <ion-icon name="storefront-outline" style={{ fontSize: "24px" }}></ion-icon>
                <span className="font-semibold">Pesanan Diteruskan ke Penjual</span>
              </div>
              <p className="text-gray-400 text-sm">
                Pesanan Anda telah dikonfirmasi dan diteruskan kepada penjual untuk segera diproses.
                Penjual akan menyiapkan pesanan Anda.
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Link
                to="/products"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition"
              >
                <ion-icon name="bag-handle-outline"></ion-icon>
                Belanja Lagi
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =======================
     MENUNGGU PEMBAYARAN QRIS
  ======================= */
  if (order && !paid) {
    return (
      <div className="min-h-screen w-screen bg-gray-900 text-white">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="bg-gray-800 rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-bold mb-2">Menunggu Pembayaran QRIS</h1>
            <p className="text-gray-400 mb-6">
              Scan QR Code di bawah ini untuk menyelesaikan pembayaran
            </p>

            {/* Dummy QRIS */}
            <div className="bg-white rounded-2xl p-6 inline-block mx-auto mb-6">
              <svg
                viewBox="0 0 200 200"
                width="200"
                height="200"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* QR-like pattern */}
                <rect x="10" y="10" width="50" height="50" fill="#000" />
                <rect x="15" y="15" width="40" height="40" fill="#fff" />
                <rect x="22" y="22" width="26" height="26" fill="#000" />

                <rect x="140" y="10" width="50" height="50" fill="#000" />
                <rect x="145" y="15" width="40" height="40" fill="#fff" />
                <rect x="152" y="22" width="26" height="26" fill="#000" />

                <rect x="10" y="140" width="50" height="50" fill="#000" />
                <rect x="15" y="145" width="40" height="40" fill="#fff" />
                <rect x="22" y="152" width="26" height="26" fill="#000" />

                {/* Random data modules */}
                <rect x="70" y="10" width="10" height="10" fill="#000" />
                <rect x="90" y="10" width="10" height="10" fill="#000" />
                <rect x="110" y="10" width="10" height="10" fill="#000" />
                <rect x="70" y="30" width="10" height="10" fill="#000" />
                <rect x="100" y="30" width="10" height="10" fill="#000" />
                <rect x="120" y="30" width="10" height="10" fill="#000" />
                <rect x="80" y="50" width="10" height="10" fill="#000" />
                <rect x="110" y="50" width="10" height="10" fill="#000" />

                <rect x="10" y="70" width="10" height="10" fill="#000" />
                <rect x="30" y="70" width="10" height="10" fill="#000" />
                <rect x="50" y="70" width="10" height="10" fill="#000" />
                <rect x="70" y="70" width="10" height="10" fill="#000" />
                <rect x="90" y="70" width="10" height="10" fill="#000" />
                <rect x="110" y="70" width="10" height="10" fill="#000" />
                <rect x="130" y="70" width="10" height="10" fill="#000" />
                <rect x="150" y="70" width="10" height="10" fill="#000" />
                <rect x="170" y="70" width="10" height="10" fill="#000" />

                <rect x="20" y="90" width="10" height="10" fill="#000" />
                <rect x="40" y="90" width="10" height="10" fill="#000" />
                <rect x="80" y="90" width="10" height="10" fill="#000" />
                <rect x="100" y="90" width="10" height="10" fill="#000" />
                <rect x="140" y="90" width="10" height="10" fill="#000" />
                <rect x="160" y="90" width="10" height="10" fill="#000" />
                <rect x="180" y="90" width="10" height="10" fill="#000" />

                <rect x="10" y="110" width="10" height="10" fill="#000" />
                <rect x="50" y="110" width="10" height="10" fill="#000" />
                <rect x="70" y="110" width="10" height="10" fill="#000" />
                <rect x="110" y="110" width="10" height="10" fill="#000" />
                <rect x="130" y="110" width="10" height="10" fill="#000" />
                <rect x="170" y="110" width="10" height="10" fill="#000" />

                <rect x="80" y="130" width="10" height="10" fill="#000" />
                <rect x="100" y="130" width="10" height="10" fill="#000" />
                <rect x="120" y="130" width="10" height="10" fill="#000" />
                <rect x="150" y="130" width="10" height="10" fill="#000" />
                <rect x="180" y="130" width="10" height="10" fill="#000" />

                <rect x="70" y="150" width="10" height="10" fill="#000" />
                <rect x="90" y="150" width="10" height="10" fill="#000" />
                <rect x="130" y="150" width="10" height="10" fill="#000" />
                <rect x="160" y="150" width="10" height="10" fill="#000" />

                <rect x="70" y="170" width="10" height="10" fill="#000" />
                <rect x="100" y="170" width="10" height="10" fill="#000" />
                <rect x="120" y="170" width="10" height="10" fill="#000" />
                <rect x="140" y="170" width="10" height="10" fill="#000" />
                <rect x="170" y="170" width="10" height="10" fill="#000" />

                {/* QRIS label */}
                <text x="100" y="198" textAnchor="middle" fontSize="10" fill="#666">
                  QRIS
                </text>
              </svg>
            </div>

            <div className="bg-gray-700 rounded-xl p-4 mb-6 text-left">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Total Pembayaran</span>
                <span className="text-green-400 font-bold text-lg">
                  Rp {order.totalPrice?.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Order ID</span>
                <span className="font-mono text-sm">{order._id}</span>
              </div>
            </div>

            <button
              onClick={handleCheckPayment}
              disabled={checking}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-wait
                         text-white px-8 py-3 rounded-lg font-semibold
                         inline-flex items-center gap-2 transition"
            >
              {checking ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Mengecek Pembayaran...
                </>
              ) : (
                <>
                  <ion-icon name="scan-outline"></ion-icon>
                  Cek Transaksi
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =======================
     FORM CHECKOUT (pilih metode bayar)
  ======================= */
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <ion-icon name="card-outline" class="text-blue-400"></ion-icon>
          Checkout
        </h1>

        {/* Ringkasan Pesanan */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Ringkasan Pesanan</h2>
          <div className="space-y-3">
            {cart?.items?.map((item) => (
              <div
                key={item.product?._id}
                className="flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <ImagePlaceholder
                    src={item.product?.imageUrl}
                    alt={item.product?.name}
                    size="checkout"
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-medium">{item.product?.name}</p>
                    <p className="text-sm text-gray-400">x{item.quantity}</p>
                    {item.quantity > (item.product?.stock || 0) && (
                      <p className="text-xs text-red-400">
                        Stok tidak cukup (tersedia: {item.product?.stock || 0})
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-green-400 font-semibold">
                  Rp{" "}
                  {((item.product?.price || 0) * item.quantity).toLocaleString(
                    "id-ID"
                  )}
                </p>
              </div>
            ))}
          </div>

          <hr className="border-gray-700 my-4" />

          <div className="flex justify-between text-lg">
            <span className="font-semibold">Total ({totalItems} item)</span>
            <span className="text-green-400 font-bold">
              Rp {totalPrice.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Pilih Metode Pembayaran */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Metode Pembayaran</h2>

          <div className="space-y-3">
            {/* CASH */}
            <button
              onClick={() => setPaymentMethod("cash")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition
                ${
                  paymentMethod === "cash"
                    ? "border-blue-500 bg-blue-900/30"
                    : "border-gray-700 bg-gray-700/50 hover:border-gray-500"
                }`}
            >
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <ion-icon name="cash-outline" style={{ fontSize: "24px", color: "white" }}></ion-icon>
              </div>
              <div className="text-left">
                <p className="font-semibold">Cash (Bayar di Tempat)</p>
                <p className="text-sm text-gray-400">
                  Bayar langsung saat barang diterima
                </p>
              </div>
              {paymentMethod === "cash" && (
                <ion-icon
                  name="checkmark-circle"
                  class="text-blue-400 text-2xl ml-auto"
                ></ion-icon>
              )}
            </button>

            {/* QRIS */}
            <button
              onClick={() => setPaymentMethod("qris")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition
                ${
                  paymentMethod === "qris"
                    ? "border-blue-500 bg-blue-900/30"
                    : "border-gray-700 bg-gray-700/50 hover:border-gray-500"
                }`}
            >
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <ion-icon name="qr-code-outline" style={{ fontSize: "24px", color: "white" }}></ion-icon>
              </div>
              <div className="text-left">
                <p className="font-semibold">QRIS</p>
                <p className="text-sm text-gray-400">
                  Scan QR Code untuk pembayaran instan
                </p>
              </div>
              {paymentMethod === "qris" && (
                <ion-icon
                  name="checkmark-circle"
                  class="text-blue-400 text-2xl ml-auto"
                ></ion-icon>
              )}
            </button>
          </div>
        </div>

        {/* Stock Warning */}
        {hasStockIssue && (
          <div className="bg-red-900/40 border border-red-500/30 rounded-xl p-4 mb-4 text-center">
            <p className="text-red-400 font-semibold">
              Beberapa item melebihi stok yang tersedia. Kembali ke keranjang untuk menyesuaikan.
            </p>
          </div>
        )}

        {/* Tombol Bayar */}
        <button
          onClick={handleCheckout}
          disabled={!paymentMethod || submitting || hasStockIssue}
          className="w-full bg-green-600 hover:bg-green-700
                     disabled:bg-gray-700 disabled:cursor-not-allowed
                     text-white py-4 rounded-xl font-bold text-lg
                     flex items-center justify-center gap-2 transition"
        >
          {submitting ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Memproses...
            </>
          ) : (
            <>
              <ion-icon name="lock-closed-outline"></ion-icon>
              Bayar Sekarang
            </>
          )}
        </button>
      </div>
    </div>
  );
}

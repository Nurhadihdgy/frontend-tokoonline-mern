import { useEffect, useState } from "react";
import { getOrders } from "../services/api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const STATUS_LABELS = {
  waiting_payment: "Menunggu Pembayaran",
  forwarded_to_seller: "Diteruskan ke Penjual",
  processing: "Diproses",
  completed: "Selesai",
};

const STATUS_COLORS = {
  waiting_payment: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  forwarded_to_seller: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  processing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
};

const STATUS_ICONS = {
  waiting_payment: "time-outline",
  forwarded_to_seller: "send-outline",
  processing: "cube-outline",
  completed: "checkmark-circle-outline",
};

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    setError(false);
    getOrders()
      .then((res) => setOrders(res.data?.orders || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.orderStatus === filter);

  const totalSpent = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  /* LOADING */
  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-gray-900 text-white">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/3" />
            <div className="h-24 bg-gray-800 rounded-xl" />
            <div className="h-24 bg-gray-800 rounded-xl" />
            <div className="h-24 bg-gray-800 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  /* ERROR */
  if (error) {
    return (
      <div className="min-h-screen w-screen bg-gray-900 text-white">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-10 text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076500.png"
            alt="Error"
            className="w-32 mx-auto mb-6 opacity-80"
          />
          <p className="text-red-400 text-lg mb-4">Gagal memuat riwayat transaksi.</p>
          <button
            onClick={fetchOrders}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gray-900 text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ion-icon name="receipt-outline" class="text-blue-400"></ion-icon>
              Riwayat Belanja
            </h1>
            <p className="text-gray-400 mt-1">
              {orders.length} pesanan
            </p>
          </div>

          {/* STATS */}
          <div className="flex gap-4">
            <div className="bg-gray-800 rounded-xl px-5 py-3 text-center">
              <p className="text-xs text-gray-400">Total Pesanan</p>
              <p className="text-xl font-bold text-blue-400">{orders.length}</p>
            </div>
            <div className="bg-gray-800 rounded-xl px-5 py-3 text-center">
              <p className="text-xs text-gray-400">Total Belanja</p>
              <p className="text-xl font-bold text-green-400">
                Rp {totalSpent.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        {/* FILTER */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: "all", label: "Semua" },
            { key: "waiting_payment", label: "Menunggu Bayar" },
            { key: "forwarded_to_seller", label: "Diteruskan" },
            { key: "processing", label: "Diproses" },
            { key: "completed", label: "Selesai" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === f.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {f.label}
              {f.key !== "all" && (
                <span className="ml-1 text-xs">
                  ({orders.filter((o) => o.orderStatus === f.key).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* EMPTY */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <ion-icon
              name="bag-outline"
              style={{ fontSize: "64px", color: "#4b5563" }}
            ></ion-icon>
            <p className="text-gray-400 mt-4 mb-6">Belum ada pesanan.</p>
            <Link
              to="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition"
            >
              <ion-icon name="bag-handle-outline"></ion-icon>
              Mulai Belanja
            </Link>
          </div>
        )}

        {/* ORDER LIST */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-800 rounded-2xl overflow-hidden"
            >
              {/* ORDER HEADER */}
              <div
                className="p-5 cursor-pointer hover:bg-gray-750 transition"
                onClick={() =>
                  setExpandedOrder(
                    expandedOrder === order._id ? null : order._id
                  )
                }
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm text-gray-400">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border inline-flex items-center gap-1 ${
                          STATUS_COLORS[order.orderStatus]
                        }`}
                      >
                        <ion-icon name={STATUS_ICONS[order.orderStatus]}></ion-icon>
                        {STATUS_LABELS[order.orderStatus]}
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          order.paymentStatus === "paid"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {order.paymentStatus === "paid" ? "Lunas" : "Belum Bayar"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <ion-icon name="card-outline"></ion-icon>
                        {order.paymentMethod?.toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1">
                        <ion-icon name="time-outline"></ion-icon>
                        {new Date(order.createdAt).toLocaleString("id-ID")}
                      </span>
                      <span className="flex items-center gap-1">
                        <ion-icon name="pricetag-outline"></ion-icon>
                        {order.items?.length || 0} item
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="text-green-400 font-bold text-lg">
                      Rp {order.totalPrice?.toLocaleString("id-ID")}
                    </p>
                    <ion-icon
                      name={
                        expandedOrder === order._id
                          ? "chevron-up-outline"
                          : "chevron-down-outline"
                      }
                      class="text-gray-400 text-xl"
                    ></ion-icon>
                  </div>
                </div>
              </div>

              {/* ORDER DETAIL (EXPANDED) */}
              {expandedOrder === order._id && (
                <div className="border-t border-gray-700 p-5">
                  <h4 className="font-semibold mb-3 text-gray-300">
                    Detail Pesanan
                  </h4>

                  <div className="space-y-2 mb-4">
                    {order.items?.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-gray-700/50 rounded-lg px-4 py-3"
                      >
                        <div>
                          <span className="text-white font-medium">{item.name}</span>
                          <span className="text-gray-400 text-sm ml-2">
                            x{item.quantity}
                          </span>
                          <span className="text-gray-500 text-sm ml-2">
                            @ Rp {item.price?.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <span className="text-gray-300 font-medium">
                          Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* TOTAL */}
                  <div className="flex justify-between items-center border-t border-gray-700 pt-3 mb-3">
                    <span className="text-gray-400 font-medium">Total</span>
                    <span className="text-green-400 font-bold text-lg">
                      Rp {order.totalPrice?.toLocaleString("id-ID")}
                    </span>
                  </div>

                  {/* STATUS TRACKER */}
                  <div className="bg-gray-700/30 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-3">Status Pesanan</p>
                    <div className="flex items-center gap-2">
                      {Object.entries(STATUS_LABELS).map(([key, label], idx) => {
                        const statusOrder = Object.keys(STATUS_LABELS);
                        const currentIdx = statusOrder.indexOf(order.orderStatus);
                        const isActive = idx <= currentIdx;

                        return (
                          <div key={key} className="flex items-center gap-2 flex-1">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                isActive
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-700 text-gray-500"
                              }`}
                            >
                              {idx + 1}
                            </div>
                            <span
                              className={`text-xs hidden sm:block ${
                                isActive ? "text-white" : "text-gray-500"
                              }`}
                            >
                              {label}
                            </span>
                            {idx < statusOrder.length - 1 && (
                              <div
                                className={`flex-1 h-0.5 ${
                                  idx < currentIdx ? "bg-blue-600" : "bg-gray-700"
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-gray-500">
                    Order ID: <span className="font-mono text-gray-400">{order._id}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

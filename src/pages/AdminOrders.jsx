import { useEffect, useState } from "react";
import { adminGetAllOrders, adminUpdateOrderStatus } from "../services/api";
import Swal from "sweetalert2";
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

const PAYMENT_COLORS = {
  paid: "text-green-400",
  pending: "text-yellow-400",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    setError(false);
    adminGetAllOrders()
      .then((res) => setOrders(res.data?.orders || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = (orderId, currentStatus) => {
    const statusOptions = Object.entries(STATUS_LABELS)
      .filter(([key]) => key !== currentStatus)
      .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});

    Swal.fire({
      title: "Ubah Status Order",
      input: "select",
      inputOptions: statusOptions,
      inputPlaceholder: "Pilih status baru",
      showCancelButton: true,
      confirmButtonText: "Update",
      confirmButtonColor: "#2563eb",
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        adminUpdateOrderStatus(orderId, result.value)
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              text: "Status order diperbarui",
              timer: 1500,
              showConfirmButton: false,
            });
            fetchOrders();
          })
          .catch(() => {
            Swal.fire({ icon: "error", title: "Gagal", text: "Gagal update status" });
          });
      }
    });
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.orderStatus === filter);

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  /* LOADING */
  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-gray-900 text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-10">
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
        <div className="max-w-6xl mx-auto px-6 py-10 text-center">
          <p className="text-red-400 text-lg mb-4">Gagal memuat data transaksi.</p>
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

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ion-icon name="receipt-outline" class="text-blue-400"></ion-icon>
              Riwayat Transaksi
            </h1>
            <p className="text-gray-400 mt-1">
              {orders.length} transaksi total
            </p>
          </div>

          {/* STATS */}
          <div className="flex gap-4">
            <div className="bg-gray-800 rounded-xl px-5 py-3 text-center">
              <p className="text-xs text-gray-400">Total Transaksi</p>
              <p className="text-xl font-bold text-blue-400">{orders.length}</p>
            </div>
            <div className="bg-gray-800 rounded-xl px-5 py-3 text-center">
              <p className="text-xs text-gray-400">Pendapatan (Lunas)</p>
              <p className="text-xl font-bold text-green-400">
                Rp {totalRevenue.toLocaleString("id-ID")}
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
              name="document-text-outline"
              style={{ fontSize: "64px", color: "#4b5563" }}
            ></ion-icon>
            <p className="text-gray-400 mt-4">Tidak ada transaksi ditemukan.</p>
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
                        className={`text-xs px-2 py-1 rounded-full border ${
                          STATUS_COLORS[order.orderStatus]
                        }`}
                      >
                        {STATUS_LABELS[order.orderStatus]}
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          PAYMENT_COLORS[order.paymentStatus]
                        }`}
                      >
                        {order.paymentStatus === "paid" ? "Lunas" : "Belum Bayar"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <ion-icon name="person-outline"></ion-icon>
                        {order.user?.name || "Unknown"} ({order.user?.email || "-"})
                      </span>
                      <span className="flex items-center gap-1">
                        <ion-icon name="card-outline"></ion-icon>
                        {order.paymentMethod?.toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1">
                        <ion-icon name="time-outline"></ion-icon>
                        {new Date(order.createdAt).toLocaleString("id-ID")}
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
                    Item Pesanan ({order.items?.length || 0} item)
                  </h4>

                  <div className="space-y-2 mb-4">
                    {order.items?.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-gray-700/50 rounded-lg px-4 py-2"
                      >
                        <div>
                          <span className="text-white">{item.name}</span>
                          <span className="text-gray-400 text-sm ml-2">
                            x{item.quantity}
                          </span>
                        </div>
                        <span className="text-gray-300">
                          Rp{" "}
                          {(item.price * item.quantity).toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-sm text-gray-400">
                      Order ID:{" "}
                      <span className="font-mono text-gray-300">
                        {order._id}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateStatus(order._id, order.orderStatus);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg
                                 inline-flex items-center gap-2 transition text-sm"
                    >
                      <ion-icon name="create-outline"></ion-icon>
                      Ubah Status
                    </button>
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

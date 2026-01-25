import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/api";
import Swal from "sweetalert2";
import ReactGA from "react-ga4";

export default function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const categories = [
    "Elektronik",
    "Fashion",
    "Makanan",
    "Minuman",
    "Alat Tulis",
    "Lainnya",
  ];

  const submit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach((key) =>
      data.append(key, form[key])
    );
    if (image) data.append("image", image);

    try {
      await createProduct(data);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Produk berhasil ditambahkan",
        confirmButtonColor: "#2563eb",
      });

      ReactGA.event({ category: "Product", action: "Create Product",});

      navigate("/products");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: err.response?.data?.message || "Terjadi kesalahan",
        confirmButtonColor: "#dc2626",
      });
      ReactGA.event({ category: "Product", action: "Create Product Gagal",});
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-10">
      <form
        onSubmit={submit}
        className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 border border-gray-700"
      >
        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">
            Tambah Produk Baru
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Lengkapi informasi produk dengan benar
          </p>
        </div>

        <hr className="border-gray-700" />

        {/* FORM GRID */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Nama */}
          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Nama Produk
            </label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="input-modern"
              placeholder="Mouse Wireless"
              required
            />
          </div>

          {/* Harga */}
          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Harga
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              className="input-modern"
              placeholder="150000"
              required
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Kategori
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="input-modern"
              required
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Stok */}
          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Stok
            </label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: e.target.value })
              }
              className="input-modern"
              placeholder="20"
              required
            />
          </div>
        </div>

        {/* Deskripsi */}
        <div>
          <label className="text-sm text-gray-300 mb-1 block">
            Deskripsi Produk
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            rows={3}
            className="input-modern resize-none"
            placeholder="Deskripsi singkat produk"
          />
        </div>

        {/* Upload */}
        <div>
          <label className="text-sm text-gray-300 mb-2 block">
            Gambar Produk
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setImage(file);
              setPreview(URL.createObjectURL(file));
            }}
            className="text-sm text-gray-300"
          />
        </div>

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-xl border border-gray-700"
          />
        )}

        {/* ACTION */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Simpan Produk
          </button>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}

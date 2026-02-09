import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Swal from "sweetalert2";
import ReactGA from "react-ga4";
import ImagePlaceholder from "../components/ImagePlaceholder";
export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: ""
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    API.get(`/products/${id}`).then((res) => {
      const p = res.data.product;
      setForm({
        name: p.name,
        price: p.price,
        description: p.description || "",
        category: p.category,
        stock: p.stock
      });
      setCurrentImage(p.imageUrl);
    });
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach((key) =>
      data.append(key, form[key])
    );
    if (image) data.append("image", image);

    await API.put(`/products/${id}`, data);

    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Produk berhasil diperbarui",
      confirmButtonColor: "#2563eb"
    });

    ReactGA.event({ category: "Product", action: "Edit Product",});

    navigate(`/products/${id}`);
  };

  const categories = [
    "Elektronik",
    "Fashion",
    "Makanan",
    "Minuman",
    "Alat Tulis",
    "Lainnya"
  ];

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={submit}
        className="w-full max-w-xl bg-gray-900 text-white p-8 rounded-2xl shadow-2xl space-y-5"
      >
        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-3xl font-bold flex justify-center items-center gap-2">
            <ion-icon name="create-outline" class="text-blue-400"></ion-icon>
            Edit Produk
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Perbarui informasi produk Anda
          </p>
        </div>

        {/* NAMA */}
        <div>
          <label className="text-sm text-gray-300">Nama Produk</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Nama produk"
            required
          />
        </div>

        {/* HARGA */}
        <div>
          <label className="text-sm text-gray-300">Harga</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Harga produk"
            required
          />
        </div>

        {/* DESKRIPSI */}
        <div>
          <label className="text-sm text-gray-300">Deskripsi</label>
          <textarea
            rows="3"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Deskripsi produk"
          />
        </div>

        {/* KATEGORI */}
        <div>
          <label className="text-sm text-gray-300">Kategori</label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* STOK */}
        <div>
          <label className="text-sm text-gray-300">Stok</label>
          <input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Jumlah stok"
            required
          />
        </div>

        {/* UPLOAD IMAGE */}
        <div>
          <label className="text-sm text-gray-300">Gambar Produk</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setImage(file);
              setPreview(URL.createObjectURL(file));
            }}
            className="w-full mt-2 text-sm text-gray-400"
          />
        </div>

        {/* CURRENT IMAGE PREVIEW */}
        {currentImage && !preview && (
          <div>
            <label className="text-sm text-gray-300 mb-2 block">
              Gambar Saat Ini
            </label>
            <ImagePlaceholder
              src={currentImage}
              alt="Current product image"
              size="large"
              className="w-full h-48 object-cover rounded-xl border border-gray-700"
            />
          </div>
        )}

        {/* NEW IMAGE PREVIEW */}
        {preview && (
          <div>
            <label className="text-sm text-gray-300 mb-2 block">
              Preview Gambar Baru
            </label>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-xl border border-gray-700"
            />
          </div>
        )}

        {/* ACTION */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700
                       px-4 py-2 rounded-lg font-semibold transition"
          >
            <ion-icon name="save-outline" className="text-xl mr-2"></ion-icon>
            Simpan Perubahan
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-700 hover:bg-gray-600
                       px-4 py-2 rounded-lg transition"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}

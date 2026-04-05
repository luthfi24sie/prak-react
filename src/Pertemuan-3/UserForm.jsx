import { useState } from "react";
import InputField from "./InputField";

export default function UserForm() {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    umur: "",
    kategori: "",
    tujuan: "",
  });

  const [errors, setErrors] = useState({});
  const [submit, setSubmit] = useState(false);

  const validate = (data) => {
    let err = {};

    if (!data.nama) err.nama = "Nama wajib diisi";
    else if (/\d/.test(data.nama)) err.nama = "Tidak boleh angka";
    else if (data.nama.length < 3) err.nama = "Minimal 3 huruf";

    if (!data.email) err.email = "Email wajib diisi";
    else if (!data.email.includes("@")) err.email = "Format email salah";
    else if (data.email.length < 5) err.email = "Terlalu pendek";

    if (!data.umur) err.umur = "Umur wajib diisi";
    else if (isNaN(data.umur)) err.umur = "Harus angka";
    else if (data.umur < 15) err.umur = "Minimal 15 tahun";

    if (!data.kategori) err.kategori = "Pilih kategori";
    if (!data.tujuan) err.tujuan = "Pilih tujuan";

    return err;
  };

  const handleChange = (name, value) => {
    const newForm = { ...form, [name]: value };
    setForm(newForm);
    setErrors(validate(newForm));
  };

  const isValid =
    Object.keys(errors).length === 0 &&
    form.nama &&
    form.email &&
    form.umur &&
    form.kategori &&
    form.tujuan;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        padding: "40px 0",
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          margin: "auto",
          background: "#ffffff",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        {/* HEADER */}
        <h2 style={{ marginBottom: "10px", textAlign: "center" }}>
          Form Workshop Digital Skill
        </h2>

        <p
          style={{
            marginBottom: "20px",
            fontSize: "14px",
            color: "#555",
            textAlign: "center",
          }}
        >
          Silakan isi data untuk mengikuti workshop sesuai minat Anda
        </p>

        {/* INPUT */}
        <InputField
          label="Nama"
          placeholder="Masukkan nama"
          value={form.nama}
          onChange={(e) => handleChange("nama", e.target.value)}
          error={errors.nama}
        />

        <InputField
          label="Email"
          placeholder="Masukkan email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
        />

        <InputField
          label="Umur"
          placeholder="Masukkan umur"
          value={form.umur}
          onChange={(e) => handleChange("umur", e.target.value)}
          error={errors.umur}
        />

        {/* SELECT */}
        <div style={{ marginBottom: "18px" }}>
          <label style={{ marginBottom: "6px", display: "block" }}>
            Kategori
          </label>
          <select
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
            onChange={(e) => handleChange("kategori", e.target.value)}
          >
            <option value="">Pilih</option>
            <option>Frontend</option>
            <option>Backend</option>
            <option>UI/UX</option>
          </select>

          {errors.kategori && (
            <div
              style={{
                background: "#ffe5e5",
                color: "#b71c1c",
                padding: "8px",
                borderRadius: "6px",
                marginTop: "6px",
                fontSize: "13px",
              }}
            >
              ⚠ {errors.kategori}
            </div>
          )}
        </div>

        <div style={{ marginBottom: "18px" }}>
          <label style={{ marginBottom: "6px", display: "block" }}>
            Tujuan
          </label>
          <select
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
            onChange={(e) => handleChange("tujuan", e.target.value)}
          >
            <option value="">Pilih</option>
            <option>Belajar</option>
            <option>Karir</option>
            <option>Relasi</option>
          </select>

          {errors.tujuan && (
            <div
              style={{
                background: "#ffe5e5",
                color: "#b71c1c",
                padding: "8px",
                borderRadius: "6px",
                marginTop: "6px",
                fontSize: "13px",
              }}
            >
              ⚠ {errors.tujuan}
            </div>
          )}
        </div>

        {/* BUTTON */}
        {isValid && (
          <button
            onClick={() => setSubmit(true)}
            style={{
              width: "100%",
              padding: "10px",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Submit
          </button>
        )}

        {/* OUTPUT */}
        {submit && (
          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              background: "#e6fffa",
              borderRadius: "6px",
            }}
          >
            <strong>Hasil:</strong>
            <p>Nama: {form.nama}</p>
            <p>Email: {form.email}</p>
            <p>Umur: {form.umur}</p>
            <p>Kategori: {form.kategori}</p>
            <p>Tujuan: {form.tujuan}</p>
          </div>
        )}
      </div>
    </div>
  );
}
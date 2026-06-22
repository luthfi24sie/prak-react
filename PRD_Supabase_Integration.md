# Product Requirements Document (PRD)
## Integrasi Supabase: Auth, CRUD & Sistem Poin Member
**Versi:** 1.0.0
**Tanggal:** 22 Juni 2026
**Dibuat oleh:** Software Architect
**Ditujukan untuk:** AI Coding Agent (Qoder)
**Status:** Ready for Implementation

---

## DAFTAR ISI

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Tech Stack & Constraint](#2-tech-stack--constraint)
3. [Safety Rules untuk AI Agent](#3-safety-rules-untuk-ai-agent)
4. [Arsitektur Sistem](#4-arsitektur-sistem)
5. [Fitur & Fungsionalitas](#5-fitur--fungsionalitas)
6. [Desain Skema Database](#6-desain-skema-database)
7. [Row Level Security (RLS)](#7-row-level-security-rls)
8. [Alur Autentikasi](#8-alur-autentikasi)
9. [API & Fungsi Supabase](#9-api--fungsi-supabase)
10. [Instruksi Khusus untuk Qoder](#10-instruksi-khusus-untuk-qoder)

---

## 1. Ringkasan Eksekutif

Proyek ini adalah integrasi backend menggunakan **Supabase** (Auth + PostgreSQL) ke dalam aplikasi React JS yang sudah memiliki UI Admin (halaman: Dashboard, Customer, Produk, Login, Register). Tujuan integrasi ini adalah:

- Mengaktifkan sistem autentikasi berbasis role (Admin, Member, Guest).
- Menghubungkan UI yang sudah ada dengan operasi CRUD ke Supabase.
- Mengimplementasikan sistem poin dan tiering loyalitas untuk Member.

**PENTING:** Tidak ada perubahan visual/desain yang diizinkan. Hanya penambahan logika data binding, state management, dan pemanggilan Supabase API.

---

## 2. Tech Stack & Constraint

| Lapisan | Teknologi | Keterangan |
|---|---|---|
| Framework | React JS (JSX) | Wajib menggunakan pola komponen yang sudah ada |
| BaaS | Supabase | Auth (JWT) + PostgreSQL Database |
| Styling | Tailwind CSS | Tidak boleh dimodifikasi untuk kebutuhan styling baru |
| UI Components | Shadcn UI | Komponen UI tambahan hanya dari Shadcn UI |
| State | React hooks (useState, useEffect) | Tidak boleh menambahkan library state management baru (Redux, Zustand, dll.) |
| Routing | React Router (sesuai yang sudah ada) | Ikuti pola routing yang sudah diterapkan |

---

## 3. Safety Rules untuk AI Agent

> ⛔ **BACA DAN PATUHI SEBELUM MENULIS SATU BARIS KODE PUN.**

### Rule 1 — DILARANG OVER-ENGINEERING
- Gunakan pendekatan paling sederhana yang bisa menyelesaikan masalah.
- Dilarang membuat abstraksi layer seperti custom hooks berlapis, factory functions, atau design patterns yang tidak diminta.
- Satu fungsi = satu tanggung jawab yang jelas.

### Rule 2 — SESUAIKAN DENGAN POLA YANG ADA
- Sebelum menulis kode, baca dan analisis file-file React yang sudah ada.
- Ikuti penamaan variabel, struktur folder, dan gaya penulisan JSX yang sudah digunakan.
- Jika existing code menggunakan `const handleClick = () => {}`, jangan tiba-tiba menggunakan `function handleClick() {}`.

### Rule 3 — JANGAN SENTUH FILE YANG TIDAK RELEVAN
- Identifikasi terlebih dahulu daftar file yang perlu dimodifikasi.
- File di luar daftar tersebut adalah **zona terlarang** — tidak boleh dibaca dengan intent untuk diubah, tidak boleh direfactor, tidak boleh "diperbaiki" meskipun ada code smell.
- Hanya tambahkan import baru di file yang membutuhkannya.

### Rule 4 — JANGAN RUSAK UI YANG ADA
- Layout, struktur JSX, className Tailwind, dan komponen Shadcn yang sudah ada **tidak boleh berubah**.
- Penambahan kode hanya berupa: mengganti data statis dengan state, menambahkan event handler, menambahkan kondisi loading/error state.
- Modifikasi JSX **hanya diizinkan** untuk kebutuhan binding data Supabase (contoh: `{customers.map(...)}` menggantikan data hardcoded).

---

## 4. Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                     React JS App                         │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  Auth    │  │  Admin   │  │  Member  │  │ Guest  │  │
│  │  Pages   │  │  Pages   │  │  Pages   │  │ View   │  │
│  │ (Login,  │  │(Dashboard│  │(Dashboard│  │        │  │
│  │ Register)│  │ Customer │  │ Pesanan  │  │        │  │
│  │          │  │ Produk,  │  │ History) │  │        │  │
│  │          │  │ Pesanan) │  │          │  │        │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───┬────┘  │
│       │              │              │             │       │
│  ┌────▼──────────────▼──────────────▼─────────────▼───┐  │
│  │              Supabase Client (supabase-js)           │  │
│  └────────────────────────┬────────────────────────────┘  │
└───────────────────────────│────────────────────────────────┘
                            │
              ┌─────────────▼──────────────┐
              │        Supabase BaaS        │
              │                            │
              │  ┌────────┐  ┌──────────┐  │
              │  │  Auth  │  │PostgreSQL│  │
              │  │ (JWT)  │  │    DB    │  │
              │  └────────┘  └──────────┘  │
              │         (RLS Enabled)       │
              └────────────────────────────┘
```

### Alur Role & Akses

```
User Login
    │
    ▼
Cek role di tabel profiles
    │
    ├── role = 'admin'   → Redirect ke /admin/dashboard
    │                       Akses penuh: Customer, Produk, Pesanan
    │
    ├── role = 'member'  → Redirect ke /member/dashboard
    │                       Akses: Buat pesanan, Lihat history, Lihat poin & tier
    │
    └── role = 'guest'   → Redirect ke /
        (belum login)       Akses: Halaman publik saja
```

---

## 5. Fitur & Fungsionalitas

### 5.1 Autentikasi & Manajemen Role

| ID | Fitur | Deskripsi |
|---|---|---|
| AUTH-01 | Register | User daftar dengan email & password. Role default = `member`. Data profil disimpan ke tabel `profiles` via database trigger otomatis. |
| AUTH-02 | Login | User login dengan email & password menggunakan Supabase Auth. Setelah login, sistem membaca role dari tabel `profiles` untuk menentukan redirect. |
| AUTH-03 | Logout | Menghapus sesi Supabase dan redirect ke halaman Login. |
| AUTH-04 | Protected Routes | Halaman Admin hanya bisa diakses oleh role `admin`. Halaman Member hanya bisa diakses oleh role `member`. Guest yang mencoba akses akan di-redirect ke Login. |
| AUTH-05 | Session Persistence | Sesi user tetap aktif setelah refresh halaman menggunakan `onAuthStateChange`. |

### 5.2 Fungsionalitas Admin

#### 5.2.1 Manajemen Customer (CRUD)
| ID | Aksi | Deskripsi |
|---|---|---|
| ADMIN-C-01 | Read | Tampilkan daftar semua customer dari tabel `profiles` (role = member). |
| ADMIN-C-02 | Update | Admin dapat mengubah data customer (nama, nomor telepon). |
| ADMIN-C-03 | Delete | Admin dapat menghapus akun customer (soft delete menggunakan kolom `is_active`). |
| ADMIN-C-04 | View Detail | Admin dapat melihat detail customer termasuk tier, total poin, dan history pesanan. |

#### 5.2.2 Manajemen Produk (CRUD)
| ID | Aksi | Deskripsi |
|---|---|---|
| ADMIN-P-01 | Create | Admin dapat menambahkan produk baru (nama, deskripsi, harga, stok, kategori). |
| ADMIN-P-02 | Read | Tampilkan daftar semua produk dari tabel `products`. |
| ADMIN-P-03 | Update | Admin dapat mengubah data produk yang sudah ada. |
| ADMIN-P-04 | Delete | Admin dapat menghapus produk (soft delete menggunakan kolom `is_active`). |

#### 5.2.3 Manajemen Pesanan (CRUD)
| ID | Aksi | Deskripsi |
|---|---|---|
| ADMIN-O-01 | Read | Tampilkan semua pesanan dari seluruh member. |
| ADMIN-O-02 | Update Status | Admin dapat mengubah status pesanan (pending → processing → completed / cancelled). |
| ADMIN-O-03 | View Detail | Admin dapat melihat detail item dalam sebuah pesanan. |
| ADMIN-O-04 | Delete | Admin dapat menghapus pesanan yang berstatus `cancelled`. |

#### 5.2.4 Dashboard Admin
| ID | Metrik | Deskripsi |
|---|---|---|
| ADMIN-D-01 | Total Customer | Hitung jumlah user dengan role `member` yang aktif. |
| ADMIN-D-02 | Total Produk | Hitung jumlah produk yang aktif (`is_active = true`). |
| ADMIN-D-03 | Total Pesanan | Hitung total seluruh pesanan. |
| ADMIN-D-04 | Total Pendapatan | Jumlahkan `total_amount` dari semua pesanan berstatus `completed`. |

### 5.3 Fungsionalitas Member

| ID | Fitur | Deskripsi |
|---|---|---|
| MEMBER-01 | Dashboard | Tampilkan total poin, tier saat ini, dan ringkasan pesanan. |
| MEMBER-02 | Buat Pesanan | Member dapat membuat pesanan dengan memilih produk dan jumlah. Stok akan dikurangi otomatis. Poin akan dihitung berdasarkan tier saat pesanan `completed`. |
| MEMBER-03 | History Pesanan | Tampilkan semua pesanan milik member yang sedang login, terurut dari terbaru. |
| MEMBER-04 | Detail Pesanan | Member dapat melihat detail item dalam setiap pesanannya. |

### 5.4 Sistem Poin & Tiering Member

#### Struktur Tier

| Tier | Minimum Poin | Cashback/Reward | Badge |
|---|---|---|---|
| Bronze | 0 – 4.999 | 5% dari total belanja | 🥉 |
| Silver | 5.000 – 14.999 | 10% dari total belanja | 🥈 |
| Gold | 15.000 – 29.999 | 15% dari total belanja | 🥇 |
| Platinum | 30.000+ | 20% dari total belanja | 💎 |

#### Logika Perhitungan Poin

- Poin diberikan **hanya** ketika status pesanan berubah menjadi `completed`.
- Rumus poin: `poin_diterima = total_amount * persentase_tier / 100`
  - Contoh: Member dengan tier Silver melakukan pembelian Rp 200.000. Poin diterima = 200.000 × 10 / 100 = **20.000 poin**.
- Penentuan tier bersifat **kumulatif** berdasarkan **total poin sepanjang masa** (`total_points` di tabel `profiles`).
- Tier diperbarui **otomatis** setiap kali poin bertambah (dijalankan via Supabase Database Function/Trigger atau logika di sisi aplikasi).

#### Logika Update Tier (dijalankan setelah penambahan poin)

```
total_points < 5.000       → tier = 'bronze'
total_points < 15.000      → tier = 'silver'
total_points < 30.000      → tier = 'gold'
total_points >= 30.000     → tier = 'platinum'
```

---

## 6. Desain Skema Database

### Overview Tabel

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   profiles   │     │   products   │     │    orders    │
│  (extends    │     │              │     │              │
│  auth.users) │     │              │     │              │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (FK)      │──┐  │ id           │  ┌──│ id           │
│ full_name    │  │  │ name         │  │  │ user_id (FK) │
│ phone        │  │  │ description  │  │  │ status       │
│ role         │  │  │ price        │  │  │ total_amount │
│ total_points │  │  │ stock        │  │  │ points_earned│
│ tier         │  │  │ category     │  │  │ created_at   │
│ is_active    │  │  │ is_active    │  │  └──────────────┘
│ created_at   │  │  │ created_at   │  │         │
│ updated_at   │  │  │ updated_at   │  │         │
└──────────────┘  │  └──────────────┘  │  ┌──────────────┐
                  │                     │  │  order_items │
                  │                     │  ├──────────────┤
                  └─────────────────────┘  │ id           │
                                           │ order_id (FK)│
                                           │ product_id   │
                                           │ quantity     │
                                           │ unit_price   │
                                           │ subtotal     │
                                           └──────────────┘
```

---

### 6.1 Tabel: `profiles`

Menyimpan data profil user yang berelasi satu-ke-satu dengan `auth.users`.

```sql
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'guest')),
  total_points INTEGER NOT NULL DEFAULT 0,
  tier        TEXT NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

| Kolom | Tipe | Constraint | Deskripsi |
|---|---|---|---|
| `id` | UUID | PK, FK → auth.users | Sinkron dengan Supabase Auth user ID |
| `full_name` | TEXT | — | Nama lengkap user |
| `phone` | TEXT | — | Nomor telepon |
| `role` | TEXT | DEFAULT 'member', CHECK | Role: admin / member / guest |
| `total_points` | INTEGER | DEFAULT 0 | Total akumulasi poin sepanjang masa |
| `tier` | TEXT | DEFAULT 'bronze', CHECK | Tier saat ini berdasarkan total_points |
| `is_active` | BOOLEAN | DEFAULT TRUE | Soft delete flag |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Waktu pembuatan akun |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Waktu terakhir update |

---

### 6.2 Tabel: `products`

Menyimpan katalog produk yang dikelola Admin.

```sql
CREATE TABLE public.products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category    TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

| Kolom | Tipe | Constraint | Deskripsi |
|---|---|---|---|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Primary key otomatis |
| `name` | TEXT | NOT NULL | Nama produk |
| `description` | TEXT | — | Deskripsi produk |
| `price` | NUMERIC(12,2) | NOT NULL, ≥ 0 | Harga satuan |
| `stock` | INTEGER | DEFAULT 0, ≥ 0 | Jumlah stok tersedia |
| `category` | TEXT | — | Kategori produk |
| `is_active` | BOOLEAN | DEFAULT TRUE | Soft delete flag |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Waktu penambahan produk |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Waktu terakhir update |

---

### 6.3 Tabel: `orders`

Menyimpan header pesanan dari Member.

```sql
CREATE TABLE public.orders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  total_amount  NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  points_earned INTEGER NOT NULL DEFAULT 0,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

| Kolom | Tipe | Constraint | Deskripsi |
|---|---|---|---|
| `id` | UUID | PK | Primary key otomatis |
| `user_id` | UUID | FK → profiles.id | Pemilik pesanan |
| `status` | TEXT | DEFAULT 'pending', CHECK | Status: pending / processing / completed / cancelled |
| `total_amount` | NUMERIC(12,2) | DEFAULT 0, ≥ 0 | Total nilai pesanan |
| `points_earned` | INTEGER | DEFAULT 0 | Poin yang didapatkan dari pesanan ini |
| `notes` | TEXT | — | Catatan tambahan dari member |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Waktu pesanan dibuat |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Waktu terakhir update |

---

### 6.4 Tabel: `order_items`

Menyimpan detail item dalam setiap pesanan (relasi many-to-one ke `orders`).

```sql
CREATE TABLE public.order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  unit_price  NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
  subtotal    NUMERIC(12, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

| Kolom | Tipe | Constraint | Deskripsi |
|---|---|---|---|
| `id` | UUID | PK | Primary key otomatis |
| `order_id` | UUID | FK → orders.id, CASCADE | Pesanan induk |
| `product_id` | UUID | FK → products.id, RESTRICT | Produk yang dipesan |
| `quantity` | INTEGER | NOT NULL, > 0 | Jumlah unit yang dipesan |
| `unit_price` | NUMERIC(12,2) | NOT NULL, ≥ 0 | Harga saat transaksi (snapshot harga) |
| `subtotal` | NUMERIC(12,2) | GENERATED (quantity × unit_price) | Total per item, dihitung otomatis DB |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Waktu item ditambahkan |

---

### 6.5 Database Functions & Triggers

#### Trigger 1: Auto-create Profile saat Register

Setiap kali user baru terdaftar di `auth.users`, otomatis buat baris di `profiles`.

```sql
-- Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'member')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### Trigger 2: Auto-update `updated_at`

Berlaku untuk tabel `profiles`, `products`, dan `orders`.

```sql
-- Generic function untuk update timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Terapkan ke setiap tabel
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

#### Function 3: Update Poin & Tier Member

Dipanggil dari sisi aplikasi (React) setelah Admin mengubah status pesanan ke `completed`.

```sql
CREATE OR REPLACE FUNCTION public.add_points_and_update_tier(
  p_user_id UUID,
  p_points  INTEGER
)
RETURNS VOID AS $$
DECLARE
  v_new_total INTEGER;
  v_new_tier  TEXT;
BEGIN
  -- Tambahkan poin ke total
  UPDATE public.profiles
  SET total_points = total_points + p_points
  WHERE id = p_user_id
  RETURNING total_points INTO v_new_total;

  -- Tentukan tier baru berdasarkan total poin
  IF v_new_total >= 30000 THEN
    v_new_tier := 'platinum';
  ELSIF v_new_total >= 15000 THEN
    v_new_tier := 'gold';
  ELSIF v_new_total >= 5000 THEN
    v_new_tier := 'silver';
  ELSE
    v_new_tier := 'bronze';
  END IF;

  -- Update tier
  UPDATE public.profiles
  SET tier = v_new_tier
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### Function 4: Kalkulasi Poin Berdasarkan Tier

Helper function untuk menghitung poin yang akan diterima.

```sql
CREATE OR REPLACE FUNCTION public.calculate_points(
  p_total_amount NUMERIC,
  p_tier         TEXT
)
RETURNS INTEGER AS $$
DECLARE
  v_percentage NUMERIC;
BEGIN
  CASE p_tier
    WHEN 'bronze'   THEN v_percentage := 5;
    WHEN 'silver'   THEN v_percentage := 10;
    WHEN 'gold'     THEN v_percentage := 15;
    WHEN 'platinum' THEN v_percentage := 20;
    ELSE v_percentage := 5;
  END CASE;

  RETURN FLOOR(p_total_amount * v_percentage / 100);
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

---

## 7. Row Level Security (RLS)

> RLS wajib diaktifkan di semua tabel. Prinsip: **deny by default**, izin diberikan secara eksplisit.

### 7.1 Tabel: `profiles`

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Admin dapat membaca semua profil
CREATE POLICY "Admin: read all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Member hanya bisa baca profil sendiri
CREATE POLICY "Member: read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Admin dapat update semua profil
CREATE POLICY "Admin: update any profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Member hanya bisa update profil sendiri (bukan role/poin/tier)
CREATE POLICY "Member: update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Hanya sistem (trigger) yang bisa insert (via SECURITY DEFINER)
-- Tidak ada policy INSERT untuk user biasa
```

### 7.2 Tabel: `products`

```sql
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Semua authenticated user dapat membaca produk aktif
CREATE POLICY "Authenticated: read active products"
  ON public.products FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

-- Admin dapat membaca semua produk (termasuk yang tidak aktif)
CREATE POLICY "Admin: read all products"
  ON public.products FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Hanya Admin yang dapat insert produk baru
CREATE POLICY "Admin: insert product"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Hanya Admin yang dapat update produk
CREATE POLICY "Admin: update product"
  ON public.products FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Hanya Admin yang dapat delete produk
CREATE POLICY "Admin: delete product"
  ON public.products FOR DELETE
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );
```

### 7.3 Tabel: `orders`

```sql
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Admin dapat membaca semua pesanan
CREATE POLICY "Admin: read all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Member hanya bisa baca pesanan miliknya sendiri
CREATE POLICY "Member: read own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Member dapat membuat pesanan baru atas namanya sendiri
CREATE POLICY "Member: insert own order"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Admin dapat update status pesanan manapun
CREATE POLICY "Admin: update any order"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Admin dapat delete pesanan yang cancelled
CREATE POLICY "Admin: delete cancelled order"
  ON public.orders FOR DELETE
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    AND status = 'cancelled'
  );
```

### 7.4 Tabel: `order_items`

```sql
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Admin dapat membaca semua order items
CREATE POLICY "Admin: read all order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Member hanya bisa baca order_items dari pesanan miliknya
CREATE POLICY "Member: read own order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM public.orders WHERE user_id = auth.uid()
    )
  );

-- Member dapat menambahkan item ke pesanannya sendiri
CREATE POLICY "Member: insert own order items"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    order_id IN (
      SELECT id FROM public.orders
      WHERE user_id = auth.uid() AND status = 'pending'
    )
  );
```

---

## 8. Alur Autentikasi

### 8.1 Alur Register

```
User mengisi form Register (nama, email, password)
    │
    ▼
supabase.auth.signUp({ email, password, options: { data: { full_name } } })
    │
    ▼
Supabase Auth membuat user baru di auth.users
    │
    ▼
Trigger `on_auth_user_created` otomatis insert ke public.profiles
(role default = 'member')
    │
    ▼
Redirect ke halaman Login dengan pesan sukses
```

### 8.2 Alur Login

```
User mengisi form Login (email, password)
    │
    ▼
supabase.auth.signInWithPassword({ email, password })
    │
    ├─ Gagal → Tampilkan pesan error di form
    │
    └─ Berhasil → Ambil session user
                    │
                    ▼
              Query: SELECT role FROM profiles WHERE id = auth.uid()
                    │
                    ├── role = 'admin'  → navigate('/admin/dashboard')
                    │
                    └── role = 'member' → navigate('/member/dashboard')
```

### 8.3 Alur Protected Routes

Buat komponen wrapper `ProtectedRoute` yang:
1. Mengecek apakah ada session aktif (`supabase.auth.getSession()`).
2. Jika tidak ada session → redirect ke `/login`.
3. Jika ada session → cek role di `profiles`.
4. Jika role tidak sesuai → redirect ke halaman yang sesuai dengan role-nya.

---

## 9. API & Fungsi Supabase

### 9.1 Setup Supabase Client

File: `src/lib/supabaseClient.js`

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

File: `.env`
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 9.2 Contoh Pemanggilan API per Fitur

#### Auth
```javascript
// Register
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: { data: { full_name: fullName } }
})

// Login
const { data, error } = await supabase.auth.signInWithPassword({ email, password })

// Logout
await supabase.auth.signOut()

// Get current session
const { data: { session } } = await supabase.auth.getSession()
```

#### CRUD Produk (Admin)
```javascript
// Read
const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })

// Create
const { data, error } = await supabase.from('products').insert({ name, description, price, stock, category })

// Update
const { data, error } = await supabase.from('products').update({ name, price, stock }).eq('id', productId)

// Soft Delete
const { data, error } = await supabase.from('products').update({ is_active: false }).eq('id', productId)
```

#### Pesanan Member
```javascript
// Buat pesanan baru + items (dalam satu transaksi manual)
// 1. Insert order
const { data: order, error: orderError } = await supabase
  .from('orders')
  .insert({ user_id: session.user.id, total_amount: totalAmount })
  .select()
  .single()

// 2. Insert order items
const items = cartItems.map(item => ({
  order_id: order.id,
  product_id: item.product_id,
  quantity: item.quantity,
  unit_price: item.price
}))
const { error: itemsError } = await supabase.from('order_items').insert(items)

// 3. Kurangi stok (lakukan per produk)
for (const item of cartItems) {
  await supabase.rpc('decrement_stock', { p_product_id: item.product_id, p_qty: item.quantity })
}
```

#### Update Status Pesanan & Tambah Poin (Admin)
```javascript
// Saat status berubah ke 'completed'
const updateOrderStatus = async (orderId, newStatus, userId, totalAmount, userTier) => {
  // 1. Update status pesanan
  await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)

  // 2. Jika completed, hitung dan tambah poin
  if (newStatus === 'completed') {
    const pointsEarned = await supabase.rpc('calculate_points', {
      p_total_amount: totalAmount,
      p_tier: userTier
    })
    // 3. Update poin di pesanan
    await supabase.from('orders').update({ points_earned: pointsEarned.data }).eq('id', orderId)
    // 4. Tambah poin dan update tier member
    await supabase.rpc('add_points_and_update_tier', {
      p_user_id: userId,
      p_points: pointsEarned.data
    })
  }
}
```

---

## 10. Instruksi Khusus untuk Qoder

> 🤖 **BACA SEKSI INI SECARA MENYELURUH SEBELUM MELAKUKAN TINDAKAN APAPUN.**

### FASE 0 — ANALISIS KODE EXISTING (WAJIB DILAKUKAN PERTAMA)

Sebelum menulis satu baris kode pun, lakukan hal berikut:

1. **Pindai seluruh struktur folder** proyek dan buat daftar semua file yang relevan.
2. **Baca setiap file komponen** yang akan dimodifikasi (halaman Dashboard, Customer, Produk, Login, Register).
3. **Catat pola yang digunakan**: penamaan state, cara import, struktur JSX, pola penanganan event.
4. **Identifikasi data statis** (hardcoded data) yang akan digantikan dengan data dari Supabase.
5. **Jangan lakukan perubahan apapun** di fase ini. Hanya observasi dan dokumentasi.

---

### FASE 1 — EKSEKUSI SQL DDL & RLS (WAJIB SEBELUM KODE REACT)

> ⚠️ **STOP. Jangan menulis kode React sebelum seluruh langkah di Fase 1 selesai.**

**Langkah 1.1 — Generate SQL DDL Lengkap**

Buat satu file SQL yang berisi SELURUH kode DDL berikut ini dalam urutan yang benar:

```
1. CREATE TABLE public.profiles
2. CREATE TABLE public.products
3. CREATE TABLE public.orders
4. CREATE TABLE public.order_items
5. CREATE FUNCTION public.handle_new_user()
6. CREATE TRIGGER on_auth_user_created
7. CREATE FUNCTION public.handle_updated_at()
8. CREATE TRIGGER set_profiles_updated_at
9. CREATE TRIGGER set_products_updated_at
10. CREATE TRIGGER set_orders_updated_at
11. CREATE FUNCTION public.add_points_and_update_tier()
12. CREATE FUNCTION public.calculate_points()
13. CREATE FUNCTION public.decrement_stock() -- untuk kurangi stok produk
```

**Langkah 1.2 — Generate SQL RLS Lengkap**

Lanjutkan file SQL yang sama dengan seluruh kode RLS:

```
1. ENABLE RLS untuk setiap tabel
2. CREATE POLICY untuk profiles (semua policy)
3. CREATE POLICY untuk products (semua policy)
4. CREATE POLICY untuk orders (semua policy)
5. CREATE POLICY untuk order_items (semua policy)
```

**Langkah 1.3 — Eksekusi SQL**

Eksekusi SQL tersebut di Supabase menggunakan salah satu metode berikut (pilih yang tersedia):

- **Opsi A (Direkomendasikan):** Buka Supabase Dashboard → SQL Editor → Paste seluruh SQL → Run.
- **Opsi B:** Gunakan Supabase CLI: `supabase db push`
- **Opsi C:** Jalankan via `psql` dengan connection string dari Supabase Dashboard.

**Langkah 1.4 — Verifikasi**

Setelah eksekusi SQL, verifikasi hal berikut sebelum melanjutkan:

- [ ] Tabel `profiles`, `products`, `orders`, `order_items` muncul di Supabase Table Editor.
- [ ] Kolom dan tipe data sesuai spesifikasi di PRD ini.
- [ ] Trigger `on_auth_user_created` aktif.
- [ ] RLS enabled pada semua tabel (ditandai dengan ikon kunci di Table Editor).
- [ ] Semua policies terdaftar di Authentication → Policies.

---

### FASE 2 — SETUP SUPABASE CLIENT & ENVIRONMENT

1. Install dependency: `npm install @supabase/supabase-js`
2. Buat file `src/lib/supabaseClient.js` sesuai template di Seksi 9.1.
3. Buat file `.env` di root project dengan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
4. Tambahkan `.env` ke `.gitignore` jika belum ada.

---

### FASE 3 — IMPLEMENTASI AUTH

1. Implementasikan fungsi Login di halaman Login yang sudah ada (hanya binding data, JANGAN ubah UI).
2. Implementasikan fungsi Register di halaman Register yang sudah ada.
3. Buat komponen `ProtectedRoute` di `src/components/ProtectedRoute.jsx`.
4. Implementasikan `onAuthStateChange` untuk persistensi sesi di root App component.
5. Tambahkan redirect berdasarkan role setelah login berhasil.

---

### FASE 4 — IMPLEMENTASI CRUD ADMIN

Lakukan dalam urutan ini dan **selesaikan satu fitur sebelum lanjut ke berikutnya**:

1. **Produk** — Read daftar, Create, Update, Soft Delete.
2. **Customer** — Read daftar member, Update data, Soft Delete (toggle `is_active`).
3. **Pesanan** — Read semua pesanan, Update status (dengan logika poin jika → `completed`).
4. **Dashboard** — Ambil angka statistik dari database secara real.

---

### FASE 5 — IMPLEMENTASI FITUR MEMBER

1. Dashboard Member: tampilkan poin, tier, dan ringkasan pesanan.
2. Buat Pesanan: form pilih produk + jumlah, submit ke `orders` dan `order_items`.
3. History Pesanan: tampilkan list pesanan milik member yang login.

---

### FASE 6 — SISTEM POIN & TIERING

1. Pastikan function `calculate_points` dan `add_points_and_update_tier` sudah tersedia di Supabase.
2. Panggil kedua function tersebut via `supabase.rpc()` saat Admin mengubah status pesanan ke `completed`.
3. Pastikan UI Member Dashboard menampilkan tier dan poin terbaru.

---

### ATURAN COMMIT & DELIVERABLE

- Setelah setiap fase selesai, laporkan: file apa yang dibuat/diubah, fungsi apa yang ditambahkan.
- Jangan menggabungkan perubahan dari beberapa fase dalam satu commit/laporan.
- Jika ada ambiguitas antara instruksi PRD dan kode yang sudah ada, **prioritaskan menyesuaikan dengan kode yang ada** dan laporkan ketidaksesuaian tersebut.

---

*PRD ini bersifat final dan telah divalidasi oleh Software Architect. Segala keputusan implementasi yang tidak tercakup dalam dokumen ini harus dikonsultasikan sebelum dieksekusi.*

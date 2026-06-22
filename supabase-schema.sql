-- ============================================================
-- SUPABASE SCHEMA: DDL + TRIGGERS + FUNCTIONS + RLS
-- PRD: Integrasi Supabase - Auth, CRUD & Sistem Poin Member
-- ============================================================
-- Jalankan seluruh script ini di Supabase SQL Editor.
-- ============================================================

-- ============================================================
-- 1. CREATE TABLES
-- ============================================================

-- 1.1 Tabel profiles (extends auth.users)
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

-- 1.2 Tabel products
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

-- 1.3 Tabel orders
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

-- 1.4 Tabel order_items
CREATE TABLE public.order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  unit_price  NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
  subtotal    NUMERIC(12, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. DATABASE FUNCTIONS & TRIGGERS
-- ============================================================

-- 2.1 Trigger: Auto-create profile saat user register
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2.2 Trigger: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2.3 Function: Tambah poin & update tier member
CREATE OR REPLACE FUNCTION public.add_points_and_update_tier(
  p_user_id UUID,
  p_points  INTEGER
)
RETURNS VOID AS $$
DECLARE
  v_new_total INTEGER;
  v_new_tier  TEXT;
BEGIN
  UPDATE public.profiles
  SET total_points = total_points + p_points
  WHERE id = p_user_id
  RETURNING total_points INTO v_new_total;

  IF v_new_total >= 30000 THEN
    v_new_tier := 'platinum';
  ELSIF v_new_total >= 15000 THEN
    v_new_tier := 'gold';
  ELSIF v_new_total >= 5000 THEN
    v_new_tier := 'silver';
  ELSE
    v_new_tier := 'bronze';
  END IF;

  UPDATE public.profiles
  SET tier = v_new_tier
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2.4 Function: Kalkulasi poin berdasarkan tier
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

-- 2.5 Function: Kurangi stok produk
CREATE OR REPLACE FUNCTION public.decrement_stock(
  p_product_id UUID,
  p_qty        INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.products
  SET stock = stock - p_qty
  WHERE id = p_product_id AND stock >= p_qty;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Stok tidak mencukupi untuk produk %', p_product_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- 3.1 Enable RLS pada semua tabel
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3.2 Policies: profiles
-- ============================================================

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

-- Member hanya bisa update profil sendiri
CREATE POLICY "Member: update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ============================================================
-- 3.3 Policies: products
-- ============================================================

-- Semua authenticated user dapat membaca produk aktif
CREATE POLICY "Authenticated: read active products"
  ON public.products FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

-- Admin dapat membaca semua produk (termasuk tidak aktif)
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

-- ============================================================
-- 3.4 Policies: orders
-- ============================================================

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

-- ============================================================
-- 3.5 Policies: order_items
-- ============================================================

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

-- ============================================================
-- SELESAI. Verifikasi:
-- [ ] 4 tabel muncul di Table Editor
-- [ ] Trigger on_auth_user_created aktif
-- [ ] RLS enabled (ikon kunci) di semua tabel
-- [ ] Semua policies terdaftar di Authentication > Policies
-- ============================================================

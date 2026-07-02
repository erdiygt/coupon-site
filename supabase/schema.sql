-- Run in Supabase SQL Editor (PostgreSQL)
-- Storage: create public bucket "uploads" in Dashboard → Storage

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  ad TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  aciklama TEXT NOT NULL DEFAULT '',
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS stores (
  id SERIAL PRIMARY KEY,
  ad TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '',
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL DEFAULT '',
  seo_icerik TEXT NOT NULL DEFAULT '',
  sss JSONB NOT NULL DEFAULT '[]'::jsonb,
  kategori_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE SET DEFAULT DEFAULT 1,
  populer_mi BOOLEAN NOT NULL DEFAULT FALSE,
  puan NUMERIC(2,1) NOT NULL DEFAULT 4.5,
  degerlendirme_sayisi INTEGER NOT NULL DEFAULT 100
);

CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  baslik TEXT NOT NULL,
  aciklama TEXT NOT NULL DEFAULT '',
  kod TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '',
  tur TEXT NOT NULL CHECK (tur IN ('kod', 'kampanya')),
  baslangic_tarihi DATE NOT NULL,
  bitis_tarihi DATE NOT NULL,
  aktif_mi BOOLEAN NOT NULL DEFAULT TRUE,
  kullanim_sayisi INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_name TEXT NOT NULL DEFAULT 'İndirimKodu',
  logo_url TEXT NOT NULL DEFAULT '',
  favicon_url TEXT NOT NULL DEFAULT '',
  homepage_meta_title TEXT NOT NULL DEFAULT '',
  homepage_meta_description TEXT NOT NULL DEFAULT ''
);

INSERT INTO site_settings (id, site_name, homepage_meta_title, homepage_meta_description)
VALUES (
  1,
  'İndirimKodu',
  'İndirimKodu — Güncel İndirim Kodları ve Kampanyalar',
  'Türkiye''nin en güncel indirim kodları ve kampanyaları. Binlerce markada anında tasarruf edin.'
)
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_stores_slug ON stores(slug);
CREATE INDEX IF NOT EXISTS idx_stores_kategori ON stores(kategori_id);
CREATE INDEX IF NOT EXISTS idx_stores_populer ON stores(populer_mi);
CREATE INDEX IF NOT EXISTS idx_coupons_store ON coupons(store_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  username TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  ip TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity, entity_id);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deny_anon_audit_logs" ON audit_logs FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_audit_logs" ON audit_logs FOR ALL TO authenticated USING (false);

CREATE POLICY "deny_anon_categories" ON categories FOR ALL TO anon USING (false);
CREATE POLICY "deny_anon_stores" ON stores FOR ALL TO anon USING (false);
CREATE POLICY "deny_anon_coupons" ON coupons FOR ALL TO anon USING (false);
CREATE POLICY "deny_anon_site_settings" ON site_settings FOR ALL TO anon USING (false);

CREATE OR REPLACE FUNCTION store_count_by_category()
RETURNS TABLE(kategori_id INTEGER, store_count BIGINT)
LANGUAGE sql
STABLE
AS $$
  SELECT kategori_id, COUNT(*)::BIGINT
  FROM stores
  GROUP BY kategori_id;
$$;
-- Reset sequences after seed with explicit IDs
CREATE OR REPLACE FUNCTION reset_id_sequences() RETURNS void AS $$
BEGIN
  PERFORM setval('categories_id_seq', COALESCE((SELECT MAX(id) FROM categories), 1));
  PERFORM setval('stores_id_seq', COALESCE((SELECT MAX(id) FROM stores), 1));
  PERFORM setval('coupons_id_seq', COALESCE((SELECT MAX(id) FROM coupons), 1));
END;
$$ LANGUAGE plpgsql;

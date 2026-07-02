-- Tighten RLS, audit log table, category store count RPC

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

-- App uses service role server-side; deny anon/authenticated direct access.
CREATE POLICY "deny_anon_audit_logs" ON audit_logs FOR ALL TO anon USING (false);
CREATE POLICY "deny_authenticated_audit_logs" ON audit_logs FOR ALL TO authenticated USING (false);

DROP POLICY IF EXISTS "public_read_categories" ON categories;
DROP POLICY IF EXISTS "public_read_stores" ON stores;
DROP POLICY IF EXISTS "public_read_coupons" ON coupons;

-- Anon: no direct table access (server uses service role).
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

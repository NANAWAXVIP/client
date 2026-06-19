-- Nanawax VIP — Schema Supabase
-- À coller dans : Supabase Dashboard → SQL Editor → New query → Run

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Events ───────────────────────────────────────────────
CREATE TABLE events (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  date       TIMESTAMPTZ NOT NULL,
  location   TEXT NOT NULL,
  capacity   INT NOT NULL DEFAULT 20,
  time_slots TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Guests ───────────────────────────────────────────────
CREATE TABLE guests (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id     UUID REFERENCES events(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  token        TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  status       TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'confirmed', 'declined')),
  time_slot    TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  UNIQUE (event_id, email)
);

-- ─── Catalog ──────────────────────────────────────────────
CREATE TABLE catalog_items (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id   UUID REFERENCES events(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  price      DECIMAL(10,2) NOT NULL,
  image_url  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Favorites ────────────────────────────────────────────
CREATE TABLE favorites (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id        UUID REFERENCES guests(id) ON DELETE CASCADE,
  catalog_item_id UUID REFERENCES catalog_items(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (guest_id, catalog_item_id)
);

-- ─── Pre-registrations (liens d'inscription) ──────────────
CREATE TABLE pre_registrations (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id      UUID REFERENCES events(id) ON DELETE CASCADE,
  token         TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'registered', 'expired')),
  guest_id      UUID REFERENCES guests(id),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  registered_at TIMESTAMPTZ
);

-- ─── Messages & cadeaux ───────────────────────────────────
CREATE TABLE messages (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id   UUID REFERENCES events(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  file_url   TEXT,
  file_name  TEXT,
  file_type  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE message_recipients (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  guest_id   UUID REFERENCES guests(id) ON DELETE CASCADE,
  read_at    TIMESTAMPTZ,
  UNIQUE (message_id, guest_id)
);

-- ─── Storage buckets ──────────────────────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES ('catalog', 'catalog', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('gifts', 'gifts', true);

-- ─── Données de démonstration ─────────────────────────────
INSERT INTO events (id, name, date, location, capacity, time_slots) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Vente Privée Été 2026',
  '2026-07-05T15:00:00Z',
  'Showroom Nanawax — 12 rue des Arts, Paris 11e',
  30,
  ARRAY['15h00 – 15h30','15h30 – 16h00','16h00 – 16h30','16h30 – 17h00','17h00 – 17h30','17h30 – 18h00']
);

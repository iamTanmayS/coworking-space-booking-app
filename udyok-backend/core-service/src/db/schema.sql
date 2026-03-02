-- ============================================================
-- UDYOK — COMPLETE DATABASE SCHEMA
-- Run this once on a fresh database to create all tables.
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom Types
CREATE TYPE provider_type AS ENUM ('email', 'google');

CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed',
  'ongoing',
  'cancelled',
  'completed'
);


-- ========================  USERS  ========================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_number TEXT,
  phone_verified BOOLEAN DEFAULT FALSE,
  profile_image TEXT,
  provider provider_type NOT NULL DEFAULT 'email',
  provider_user_id TEXT,
  password_hash TEXT,

  -- Location (from 003.locations)
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  city VARCHAR(100),
  country VARCHAR(100),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT provider_check CHECK (
    (provider = 'email' AND provider_user_id IS NULL AND password_hash IS NOT NULL)
    OR
    (provider = 'google' AND provider_user_id IS NOT NULL AND password_hash IS NULL)
  )
);


-- ========================  OPERATORS  ========================
CREATE TABLE operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ========================  SPACES  ========================
CREATE TABLE spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES operators(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100),
  price_per_hour NUMERIC NOT NULL CHECK (price_per_hour > 0),
  city VARCHAR(100),
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  amenities JSONB DEFAULT '[]',
  rating NUMERIC DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_spaces_owner ON spaces(owner_id);
CREATE INDEX idx_spaces_city ON spaces(city);


-- ========================  SPACE IMAGES  ========================
CREATE TABLE space_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_space_images_space_id ON space_images(space_id);


-- ========================  BOOKINGS  ========================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status booking_status DEFAULT 'pending',
  total_amount NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_space ON bookings(space_id);


-- ========================  PAYMENT METHODS  ========================
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20),
  details TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payment_methods_user ON payment_methods(user_id);


-- ========================  TRANSACTIONS  ========================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  type VARCHAR(10) CHECK (type IN ('credit','debit')),
  description TEXT,
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_user ON transactions(user_id);


-- ========================  REVIEWS  ========================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  rating NUMERIC CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_space ON reviews(space_id);


-- ========================  FAVOURITES  ========================
CREATE TABLE favorites (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, space_id)
);


-- ========================  USER SETTINGS  ========================
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(10) DEFAULT 'light',
  notifications BOOLEAN DEFAULT TRUE,
  language VARCHAR(50) DEFAULT 'en',
  timezone VARCHAR(100),
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT NOW()
);


-- ========================  OTPs  ========================
CREATE TABLE otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_otps_email ON otps(email);

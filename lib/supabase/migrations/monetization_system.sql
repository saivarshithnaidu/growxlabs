-- GrowX Labs Monetization System
-- Unified Checkout for Courses and Subscriptions

-- 1. Coupons System
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL, -- 'percentage' or 'flat'
    discount_value INTEGER NOT NULL,
    min_purchase INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Billing Details (Persistent per user)
CREATE TABLE IF NOT EXISTS billing_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    area TEXT NOT NULL,
    city TEXT NOT NULL,
    pincode TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Unified Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL, -- course_id or plan_id
    product_type TEXT NOT NULL, -- 'course' or 'subscription'
    original_price INTEGER NOT NULL,
    discount_amount INTEGER DEFAULT 0,
    final_amount INTEGER NOT NULL,
    coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
    razorpay_order_id TEXT UNIQUE NOT NULL,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    status TEXT DEFAULT 'pending', -- pending, paid, failed, cancelled
    billing_snapshot JSONB NOT NULL, -- Copy of billing details at time of order
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Admin Policies
CREATE POLICY "Admin All Coupons" ON coupons FOR ALL USING ((auth.jwt() ->> 'role') IN ('ADMIN', 'CO_ADMIN'));
CREATE POLICY "Admin All Orders" ON orders FOR ALL USING ((auth.jwt() ->> 'role') IN ('ADMIN', 'CO_ADMIN'));

-- User Policies
CREATE POLICY "Users view active coupons" ON coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Users manage own billing" ON billing_details FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

-- Seed Initial Coupon (Optional)
INSERT INTO coupons (code, discount_type, discount_value, expires_at)
VALUES ('GROWX50', 'percentage', 50, '2026-12-31 23:59:59')
ON CONFLICT (code) DO NOTHING;

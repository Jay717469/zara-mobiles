-- ========================================================
-- ZARA MOBILES - SAMPLE DEVELOPMENT DATA
-- Note: All data below is realistic sample development data.
-- ========================================================

USE zara_mobiles_db;

-- 1. SEED CATEGORIES
INSERT INTO categories (id, name, slug, description, image_url, is_active) VALUES
(1, 'Flagship Smartphones', 'flagship-smartphones', 'Premium flagship mobile phones with cutting-edge processors and pro cameras.', 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=600&q=80', TRUE),
(2, 'Mid-Range Smartphones', 'mid-range-smartphones', 'Feature-packed all-rounders offering incredible value and performance.', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80', TRUE),
(3, 'Budget Smartphones', 'budget-smartphones', 'Reliable and affordable smartphones for everyday communication and entertainment.', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80', TRUE),
(4, 'Audio & Earbuds', 'audio-earbuds', 'True wireless earbuds, headphones, and studio-grade mobile audio accessories.', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80', TRUE),
(5, 'Power & Cables', 'power-cables', 'Fast chargers, MagSafe adapters, wireless charging pads, and durable cables.', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80', TRUE),
(6, 'Cases & Protection', 'cases-protection', 'Heavy duty shockproof cases, tempered glass, and stylish protective covers.', 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=600&q=80', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. SEED STORES FOR PHYSICAL STORE PICKUP
INSERT INTO stores (id, name, address, city, state, pin_code, phone, opening_hours, is_active) VALUES
(1, 'Zara Mobiles Flagship Experience Center', 'Shop 104-106, High Street Phoenix Mall, Lower Parel', 'Mumbai', 'Maharashtra', '400013', '+91 63793 67629', 'Mon-Sun: 10:00 AM - 09:30 PM', TRUE),
(2, 'Zara Mobiles Tech Hub', 'Ground Floor, Indiranagar 100ft Road, Near Metro Pillar 42', 'Bengaluru', 'Karnataka', '560038', '+91 63855 33138', 'Mon-Sun: 10:30 AM - 09:00 PM', TRUE),
(3, 'Zara Mobiles City Center', 'Unit 12, Connaught Place, Inner Circle', 'New Delhi', 'Delhi', '110001', '+91 63793 67629', 'Mon-Sat: 10:00 AM - 08:30 PM', TRUE),
(4, 'Zara Mobiles Galleria', 'Road No. 36, Jubilee Hills', 'Hyderabad', 'Telangana', '500033', '+91 63855 33138', 'Mon-Sun: 10:00 AM - 09:00 PM', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name), phone=VALUES(phone);

-- 3. SEED INITIAL USERS (Password hashes correspond to BCrypt $2a$10$w8LgGff.HqNf2d5JvH8a8eEevYqG0Y1cR/R8z3h3aY4cIhzM3a7tq for "Password@123" or created via DataInitializer)
-- We insert user records with placeholder hashes; DataInitializer will ensure valid encoded passwords for Admin@123 and Customer@123
INSERT INTO users (id, full_name, email, password, mobile_number, role, status) VALUES
(1, 'Zara Admin', 'admin@zaramobiles.com', '$2a$10$3Z9X5mG2y2v2dYy8q6v6eO9p9q8r7s6t5u4v3w2x1y0z.SampleAdmin', '+91 98765 00001', 'ADMIN', 'ACTIVE'),
(2, 'John Customer', 'customer@zaramobiles.com', '$2a$10$3Z9X5mG2y2v2dYy8q6v6eO9p9q8r7s6t5u4v3w2x1y0z.SampleCust', '+91 98765 00002', 'CUSTOMER', 'ACTIVE')
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- 4. SEED PRODUCTS
INSERT INTO products (id, category_id, name, brand, model, sku, description, price, discount_percentage, final_price, stock_quantity, rating, review_count, ram, storage, processor, display, battery, camera, color, warranty_details, is_active, is_featured, is_trending, is_best_seller) VALUES
(1, 1, 'Apple iPhone 15 Pro Max', 'Apple', 'iPhone 15 Pro Max', 'APL-IP15PM-256-NT', 'Forged in titanium with industry-leading A17 Pro chip, customizable Action button, and the most versatile iPhone camera system ever.', 159900.00, 7.00, 148707.00, 25, 4.90, 128, '8 GB', '256 GB', 'A17 Pro Bionic (3nm)', '6.7-inch Super Retina XDR OLED 120Hz', '4422 mAh with 20W Fast Charging', '48MP Main + 12MP Ultra-Wide + 12MP 5x Telephoto', 'Natural Titanium', '1 Year Apple Brand Warranty', TRUE, TRUE, TRUE, TRUE),

(2, 1, 'Samsung Galaxy S24 Ultra 5G', 'Samsung', 'Galaxy S24 Ultra', 'SAM-S24U-512-TI', 'Meet Galaxy S24 Ultra with Galaxy AI, durable titanium exterior, built-in S Pen, and 200MP quad-telephoto optical zoom.', 139999.00, 10.00, 125999.00, 30, 4.85, 95, '12 GB', '512 GB', 'Snapdragon 8 Gen 3 for Galaxy', '6.8-inch Dynamic AMOLED 2X QHD+ 120Hz', '5000 mAh with 45W Fast Charging', '200MP Main + 50MP Periscope + 10MP Tele + 12MP Ultra-Wide', 'Titanium Gray', '1 Year Samsung Comprehensive Warranty', TRUE, TRUE, TRUE, TRUE),

(3, 1, 'Google Pixel 8 Pro', 'Google', 'Pixel 8 Pro', 'GGL-PX8P-128-OB', 'The pro phone engineered by Google. Features Google Tensor G3, super actua display, pro camera controls, and 7 years of OS updates.', 106999.00, 12.00, 94159.00, 18, 4.70, 64, '12 GB', '128 GB', 'Google Tensor G3 + Titan M2 Security', '6.7-inch Super Actua LTPO OLED 120Hz', '5050 mAh with 30W Fast Charging', '50MP Main + 48MP Ultra-Wide + 48MP 5x Telephoto', 'Obsidian Black', '1 Year Google Manufacturer Warranty', TRUE, TRUE, FALSE, FALSE),

(4, 2, 'OnePlus 12R', 'OnePlus', '12R 5G', 'OP-12R-256-CB', 'Smooth Beyond Belief. Powered by Snapdragon 8 Gen 2, 4th Gen LTPO 120Hz ProXDR display, and huge 5500 mAh battery with 100W SUPERVOOC.', 45999.00, 8.00, 42319.00, 45, 4.65, 82, '16 GB', '256 GB', 'Snapdragon 8 Gen 2 Mobile Platform', '6.78-inch 1.5K AMOLED 120Hz ProXDR', '5500 mAh with 100W SUPERVOOC Fast Charge', '50MP Sony IMX890 OIS + 8MP Ultra-Wide + 2MP Macro', 'Cool Blue', '1 Year OnePlus India Warranty', TRUE, TRUE, TRUE, FALSE),

(5, 2, 'Samsung Galaxy A55 5G', 'Samsung', 'Galaxy A55', 'SAM-A55-128-AN', 'Premium metal frame with Gorilla Glass Victus+, vibrant Super AMOLED display, Knox security, and IP67 water and dust resistance.', 39999.00, 15.00, 33999.00, 40, 4.50, 43, '8 GB', '128 GB', 'Samsung Exynos 1480 (4nm)', '6.6-inch Super AMOLED FHD+ 120Hz', '5000 mAh with 25W Fast Charging', '50MP OIS + 12MP Ultra-Wide + 5MP Macro', 'Awesome Navy', '1 Year Official Samsung Warranty', TRUE, FALSE, TRUE, FALSE),

(6, 3, 'Redmi Note 13 5G', 'Xiaomi', 'Redmi Note 13', 'XIA-RN13-128-PB', 'Super-slim 5G powerhouse with 108MP triple camera, 120Hz AMOLED display, and MediaTek Dimensity 6080 ultra-fast processor.', 18999.00, 16.00, 15959.00, 60, 4.40, 110, '6 GB', '128 GB', 'MediaTek Dimensity 6080 5G', '6.67-inch FHD+ AMOLED 120Hz', '5000 mAh with 33W Fast Charger included', '108MP Ultra-Clear Main + 8MP Ultra-Wide + 2MP Macro', 'Prism Black', '1 Year Xiaomi Brand Warranty', TRUE, FALSE, FALSE, TRUE),

(7, 4, 'Apple AirPods Pro (2nd Gen, USB-C)', 'Apple', 'AirPods Pro 2', 'APL-APP2-USBC', 'Up to 2x more Active Noise Cancellation, Adaptive Audio, Transparency mode, Personalized Spatial Audio, and MagSafe Charging Case (USB-C).', 24900.00, 5.00, 23655.00, 35, 4.90, 78, 'N/A', 'N/A', 'Apple H2 Headphone Chip', 'In-Ear with silicone tips (4 sizes)', 'Up to 30 hours total with Case', 'Dual beamforming microphones', 'White', '1 Year Apple International Warranty', TRUE, TRUE, FALSE, TRUE),

(8, 4, 'Sony WF-1000XM5 Wireless Noise Canceling Earbuds', 'Sony', 'WF-1000XM5', 'SNY-WF1000M5-BK', 'The best noise canceling true wireless earbuds with dual proprietary processors, Dynamic Driver X, and crystal-clear call quality.', 29990.00, 17.00, 24890.00, 20, 4.75, 39, 'N/A', 'N/A', 'Integrated Processor V2 & HD QN2e', 'Ergonomic In-Ear fit', 'Up to 24 hours (8h buds + 16h case)', '6 microphones with AI bone conduction sensor', 'Black', '1 Year Sony India Warranty', TRUE, FALSE, TRUE, FALSE),

(9, 5, 'Anker 65W GaNPrime 3-Port Fast Wall Charger', 'Anker', '735 Charger (GaNPrime 65W)', 'ANK-GAN65-3P', 'Power 3 devices simultaneously with 2 USB-C and 1 USB-A ports. Powered by GaN technology with ActiveShield 2.0 temperature protection.', 4999.00, 20.00, 3999.00, 50, 4.80, 56, 'N/A', 'N/A', 'Anker GaNPrime PowerIQ 4.0', 'Ultra-compact folding plug', 'N/A', 'N/A', 'Black', '18 Months Replacement Warranty', TRUE, FALSE, FALSE, TRUE),

(10, 6, 'Spigen Ultra Hybrid MagFit Case for iPhone 15 Pro Max', 'Spigen', 'Ultra Hybrid MagFit', 'SPG-UHMF-IP15PM', 'Crystal clear protection with integrated magnetic ring for full MagSafe compatibility and Air Cushion Technology corner protection.', 2999.00, 25.00, 2249.00, 75, 4.60, 92, 'N/A', 'N/A', 'Shock-absorbing TPU bumper + PC back', 'Precision cutouts with tactile buttons', 'N/A', 'N/A', 'Frost Clear', '6 Months Spigen Warranty', TRUE, FALSE, FALSE, FALSE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 5. SEED PRODUCT IMAGES (Multiple images per product)
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES
(1, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(1, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80', FALSE, 2),
(2, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(2, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80', FALSE, 2),
(3, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(4, 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(5, 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(6, 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(7, 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(8, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(9, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(10, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80', TRUE, 1);

-- 6. SEED REVIEWS
INSERT INTO reviews (product_id, user_id, rating, headline, comment) VALUES
(1, 2, 5, 'Unbelievable performance and camera!', 'Upgraded from an older device and the titanium finish feels so light in hand. The 5x telephoto camera is crisp and battery lasts over a day and a half easily.'),
(2, 2, 5, 'The ultimate Android flagship', 'The anti-reflective screen on the S24 Ultra is a game changer in direct sunlight. Galaxy AI circle to search is genuinely useful.'),
(4, 2, 5, 'Insanely fast charging and butter smooth', '100W charging fills the battery in under 28 minutes. Great display and speakers. Best value for money phone right now.');

-- 7. INITIAL INVENTORY TRANSACTIONS
INSERT INTO inventory_transactions (product_id, transaction_type, quantity_change, quantity_after, reason, reference_id) VALUES
(1, 'INITIAL', 25, 25, 'Initial warehouse shipment intake', 'BATCH-2026-001'),
(2, 'INITIAL', 30, 30, 'Initial warehouse shipment intake', 'BATCH-2026-002'),
(3, 'INITIAL', 18, 18, 'Initial warehouse shipment intake', 'BATCH-2026-003'),
(4, 'INITIAL', 45, 45, 'Initial warehouse shipment intake', 'BATCH-2026-004'),
(5, 'INITIAL', 40, 40, 'Initial warehouse shipment intake', 'BATCH-2026-005'),
(6, 'INITIAL', 60, 60, 'Initial warehouse shipment intake', 'BATCH-2026-006'),
(7, 'INITIAL', 35, 35, 'Initial warehouse shipment intake', 'BATCH-2026-007'),
(8, 'INITIAL', 20, 20, 'Initial warehouse shipment intake', 'BATCH-2026-008'),
(9, 'INITIAL', 50, 50, 'Initial warehouse shipment intake', 'BATCH-2026-009'),
(10, 'INITIAL', 75, 75, 'Initial warehouse shipment intake', 'BATCH-2026-010');

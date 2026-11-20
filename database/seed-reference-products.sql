-- SEED ADDITIONAL REFERENCE PRODUCTS (IPHONE 18 PRO, IPHONE 17 PRO MAX DEMO, IPHONE 13 DEMO, REDMI, REALME)
USE zara_mobiles_db;

INSERT INTO products (
    id, category_id, name, brand, model, sku, description, price, discount_percentage, final_price,
    stock_quantity, rating, review_count, ram, storage, processor, display, battery, camera, color,
    warranty_details, is_active, is_featured, is_trending, is_best_seller
) VALUES
(11, 1, 'iPhone 18 Pro', 'Apple', 'iPhone 18 Pro', 'APL-IP18P-256-TI',
 'Next-gen flagship smartphone featuring revolutionary A19 Pro Neural Silicon, Grade 5 Titanium enclosure, under-display FaceID, and quad-prism 10x optical zoom.',
 162600.00, 8.00, 149999.00, 15, 4.95, 210, '12 GB', '256GB', 'Apple A19 Pro Bionic (2nm)', '6.3-inch Super Retina XDR OLED ProMotion 1-120Hz', '100%CC-28 Battery Health', '48MP Quad-Pixel + 48MP Ultra-Wide + 48MP 10x Periscope', 'White Titanium',
 'APPLE WARRANTY TILL: 27.10.2027', TRUE, TRUE, TRUE, TRUE),

(12, 1, 'iPhone 17 Pro Max Dual eSIM', 'Apple', 'iPhone 17 Pro Max', 'APL-IP17PM-256-DS',
 'Certified Store Demo Unit in pristine flawless condition. Dual active eSIM support, aerospace titanium casing in Desert Orange, and all-day battery endurance.',
 139900.00, 14.00, 119999.00, 10, 4.88, 145, '8 GB', '256GB', 'Apple A18 Pro Bionic', '6.9-inch Super Retina XDR OLED 120Hz', '95% Battery Health', '48MP Fusion + 48MP Ultra-Wide + 12MP 5x Telephoto', 'Desert Orange',
 '3 MONTHS STORE WARRANTY', TRUE, TRUE, TRUE, TRUE),

(13, 1, 'iPhone 13', 'Apple', 'iPhone 13', 'APL-IP13-128-PK',
 'Certified Pre-Owned Apple iPhone 13. Super Retina XDR display, A15 Bionic chip, cinematic video mode, and durable ceramic shield front cover.',
 49900.00, 50.00, 24999.00, 20, 4.70, 320, '4 GB', '128GB', 'Apple A15 Bionic Chip', '6.1-inch Super Retina XDR OLED', '77% Battery Health', '12MP Wide + 12MP Ultra-Wide Dual Camera', 'Pink',
 '1 MONTHS STORE WARRANTY', TRUE, TRUE, TRUE, TRUE),

(14, 2, 'Redmi Note 13 Pro+ 5G', 'Redmi', 'Note 13 Pro+', 'XIA-RN13PP-256-FP',
 'Flagship-level 3D Curved 1.5K AMOLED 120Hz display, 200MP Samsung ISOCELL HP3 camera with OIS, IP68 water resistance, and blazing 120W HyperCharge.',
 33999.00, 18.00, 27999.00, 35, 4.65, 88, '12 GB', '256GB', 'MediaTek Dimensity 7200-Ultra (4nm)', '6.67-inch 1.5K 3D Curved AMOLED 120Hz', '5000 mAh with 120W HyperCharge in-box', '200MP OIS Main + 8MP Ultra-Wide + 2MP Macro', 'Fusion Purple',
 '1 YEAR BRAND WARRANTY', TRUE, TRUE, TRUE, FALSE),

(15, 2, 'Realme GT 6 5G', 'Realme', 'GT 6', 'RLM-GT6-512-FS',
 'AI Flagship Killer powered by Snapdragon 8s Gen 3, world\'s brightest 6000-nit 8T LTPO display, Sony LYT-808 OIS flagship sensor, and 120W SUPERVOOC charging.',
 44999.00, 11.00, 39999.00, 25, 4.75, 62, '16 GB', '512GB', 'Snapdragon 8s Gen 3 Mobile Platform', '6.78-inch 1.5K 8T LTPO AMOLED 6000-nits 120Hz', '5500 mAh with 120W SUPERVOOC Fast Charge', '50MP Sony LYT-808 OIS + 50MP Telephoto + 8MP Ultra-Wide', 'Fluid Silver',
 '1 YEAR BRAND WARRANTY', TRUE, TRUE, TRUE, TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), final_price=VALUES(final_price), warranty_details=VALUES(warranty_details), battery=VALUES(battery), color=VALUES(color), storage=VALUES(storage);

-- SEED IMAGES FOR NEW PRODUCTS
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES
(11, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(11, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80', FALSE, 2),
(12, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(12, 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=800&q=80', FALSE, 2),
(13, 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(13, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80', FALSE, 2),
(14, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(15, 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80', TRUE, 1)
ON DUPLICATE KEY UPDATE image_url=VALUES(image_url);

-- SEED INVENTORY TRANSACTIONS
INSERT INTO inventory_transactions (product_id, transaction_type, quantity_change, quantity_after, reason, reference_id) VALUES
(11, 'INITIAL', 15, 15, 'Direct Apple Authorized Distributor Intake', 'BATCH-2026-011'),
(12, 'INITIAL', 10, 10, 'Certified Store Demo Intake', 'BATCH-2026-012'),
(13, 'INITIAL', 20, 20, 'Certified Pre-Owned Intake', 'BATCH-2026-013'),
(14, 'INITIAL', 35, 35, 'Xiaomi India Direct Intake', 'BATCH-2026-014'),
(15, 'INITIAL', 25, 25, 'Realme India Direct Intake', 'BATCH-2026-015');

-- =====================================================
-- WARRIOR LEAP PRODUCTS - PROFESSIONAL COPY UPDATE
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- ADD SEO DESCRIPTION COLUMN
-- =====================================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- =====================================================
-- 1. WARRIOR CHILLER ($1,250) - Cools to 6°C
-- =====================================================
UPDATE products
SET
  name = 'Warrior Chiller',
  features = '[
    {"text": "Cools to 6°C, no ice needed", "icon": "Thermometer"},
    {"text": "Fits any tub up to 300L", "icon": "Target"},
    {"text": "Built-in filtration included", "icon": "Filter"},
    {"text": "Compact enough for any space", "icon": "CheckCircle"},
    {"text": "1-year warranty", "icon": "Shield"}
  ]'::jsonb,
  specifications = '[
    {"icon": "Thermometer", "title": "Temperature Range", "description": "Cools water down to 6°C (43°F). Effective for daily cold therapy and recovery.", "highlight": true},
    {"icon": "Target", "title": "Compatibility", "description": "Works with any ice tub or container up to 300 liters.", "highlight": true},
    {"icon": "Filter", "title": "Water Filtration", "description": "Built-in filter keeps water clean for weeks. Less maintenance, more plunging.", "highlight": true},
    {"icon": "Ruler", "title": "Dimensions", "description": "42.5 × 31 × 40 cm. Fits on a balcony, garage, or beside your tub."},
    {"icon": "Plug", "title": "Power", "description": "Standard 220V outlet. No electrician needed."},
    {"icon": "Shield", "title": "Safety", "description": "Automatic shutoff and built-in pump protection."},
    {"icon": "Wrench", "title": "Build Quality", "description": "Industrial-grade components built for daily use."},
    {"icon": "Package", "title": "What''s Included", "description": "Chiller unit, water pump, hoses, connectors, and manual."}
  ]'::jsonb,
  description = 'No more ice runs. No more waiting. The Warrior Chiller keeps any tub at 6°C automatically. Plug it in and your cold plunge is ready whenever you are.',
  seo_description = 'Ice bath chiller keeps water at 6°C automatically. No more ice runs. Works with any tub. Delivered across Lebanon.'
WHERE id = '1e5de76f-27f0-46e5-8c56-59e238f98f4e';

-- =====================================================
-- 2. WARRIOR CHILLER PRO ($1,700) - Cools to 3°C
-- =====================================================
UPDATE products
SET
  name = 'Warrior Chiller Pro',
  features = '[
    {"text": "Cools to 3°C for maximum intensity", "icon": "Thermometer"},
    {"text": "2x the power, faster recovery", "icon": "Gauge"},
    {"text": "Powers large or dual-person tubs", "icon": "Users"},
    {"text": "Built-in filtration included", "icon": "Filter"},
    {"text": "1-year warranty", "icon": "Shield"}
  ]'::jsonb,
  specifications = '[
    {"icon": "Thermometer", "title": "Temperature Range", "description": "Cools water down to 3°C (37°F) for those who want the coldest plunge possible.", "highlight": true},
    {"icon": "Gauge", "title": "Cooling Power", "description": "2x the cooling capacity of the standard Chiller. Faster cooling, quicker recovery between sessions.", "highlight": true},
    {"icon": "Users", "title": "Capacity", "description": "Powers large tubs up to 500L. Great for oval tubs or gym setups.", "highlight": true},
    {"icon": "Filter", "title": "Water Filtration", "description": "Built-in filter keeps water clean for weeks."},
    {"icon": "Plug", "title": "Power", "description": "220V outlet. Dedicated circuit recommended for best performance."},
    {"icon": "Shield", "title": "Safety", "description": "Automatic shutoff, surge protection, and dry-run prevention."},
    {"icon": "Wrench", "title": "Build Quality", "description": "Commercial-grade components made for gyms and heavy daily use."},
    {"icon": "Package", "title": "What''s Included", "description": "Chiller unit, high-flow pump, hoses, connectors, and manual."}
  ]'::jsonb,
  description = 'Colder. Faster. Built for serious recovery. The Warrior Chiller Pro reaches 3°C and powers larger tubs. Made for athletes, gyms, and anyone who wants maximum intensity.',
  seo_description = 'Professional cold plunge chiller reaches 3°C. Built for athletes & gyms. Powers large tubs. Delivery across Lebanon.'
WHERE id = '7745c58a-e5ae-47f9-8cb7-6980ef2d0bcd';

-- =====================================================
-- 3. WARRIOR TUB ($600)
-- =====================================================
UPDATE products
SET
  name = 'Warrior Tub',
  features = '[
    {"text": "Ready to use in 15 minutes", "icon": "Clock"},
    {"text": "Stays cold for hours", "icon": "Layers"},
    {"text": "Medical-grade, puncture-resistant", "icon": "Shield"},
    {"text": "Folds flat for easy storage", "icon": "CheckCircle"},
    {"text": "1-year warranty", "icon": "Shield"}
  ]'::jsonb,
  specifications = '[
    {"icon": "Maximize2", "title": "Size", "description": "90 × 80 cm. Fits full-body immersion up to 188 cm (6''2\").", "highlight": true},
    {"icon": "Clock", "title": "Setup Time", "description": "Inflates in 15 minutes with the included pump. No tools needed.", "highlight": true},
    {"icon": "Layers", "title": "Insulation", "description": "Double-layer thermal walls keep water cold 2-4 hours without a chiller.", "highlight": true},
    {"icon": "Shield", "title": "Materials", "description": "Medical-grade PVC with reinforced seams. Built to last."},
    {"icon": "Lock", "title": "Thermal Cover", "description": "Insulated lid locks in temperature and keeps debris out."},
    {"icon": "Droplet", "title": "Drainage", "description": "Quick-release valve connects to any garden hose."},
    {"icon": "CheckCircle", "title": "Safety", "description": "Slip-resistant interior base for safe entry and exit."},
    {"icon": "Package", "title": "What''s Included", "description": "Ice tub, thermal cover, inflation pump, repair kit, and carrying bag."}
  ]'::jsonb,
  description = 'Your first step into cold therapy. Sets up in 15 minutes, stays cold for hours, and folds flat when you''re done. Pair it with a Warrior Chiller anytime to go completely ice-free.',
  seo_description = 'Portable ice bath tub for cold therapy in Lebanon. Sets up in 15 minutes, stays cold for hours. Folds flat for easy storage.'
WHERE id = 'af65455c-33ce-4e6a-afca-c3a611b7c79f';

-- =====================================================
-- 4. WARRIOR TUB XL ($900)
-- =====================================================
UPDATE products
SET
  name = 'Warrior Tub XL',
  features = '[
    {"text": "Fits 2 people comfortably", "icon": "Users"},
    {"text": "Ready to use in 15 minutes", "icon": "Clock"},
    {"text": "Stays cold for hours", "icon": "Layers"},
    {"text": "Medical-grade, puncture-resistant", "icon": "Shield"},
    {"text": "1-year warranty", "icon": "Shield"}
  ]'::jsonb,
  specifications = '[
    {"icon": "Maximize2", "title": "Size", "description": "170 × 80 × 70 cm. Room for two adults or one person fully stretched out.", "highlight": true},
    {"icon": "Users", "title": "Capacity", "description": "Fits 2 people side-by-side. Perfect for couples, training partners, or gyms.", "highlight": true},
    {"icon": "Layers", "title": "Insulation", "description": "Double-layer thermal walls keep water cold 2-4 hours without a chiller.", "highlight": true},
    {"icon": "Clock", "title": "Setup Time", "description": "Inflates in 15 minutes with the included pump."},
    {"icon": "Shield", "title": "Materials", "description": "Medical-grade PVC with reinforced seams. Built to last."},
    {"icon": "Lock", "title": "Thermal Cover", "description": "Extra-large insulated lid maintains temperature."},
    {"icon": "Droplet", "title": "Drainage", "description": "Quick-release valve connects to any garden hose."},
    {"icon": "Package", "title": "What''s Included", "description": "Ice tub, thermal cover, electric pump, repair kit, and carrying bag."}
  ]'::jsonb,
  description = 'Room for two. Built for couples, training partners, or your gym''s recovery corner. Sets up in 15 minutes, stays cold for hours, and fits two adults comfortably side by side.',
  seo_description = 'Large ice bath tub fits 2 people. Premium cold plunge for couples, gyms & athletes. Free delivery across Lebanon.'
WHERE id = '77bcc903-55dc-4a94-a389-7b54501154b9';

-- =====================================================
-- 5. WARRIOR SYSTEM ($1,800) - Tub + Chiller
-- =====================================================
UPDATE products
SET
  name = 'Warrior System',
  features = '[
    {"text": "Complete system, just plug in", "icon": "Award"},
    {"text": "Always at 6°C, always ready", "icon": "Thermometer"},
    {"text": "Free delivery and installation", "icon": "CheckCircle"},
    {"text": "No ice needed, ever", "icon": "Target"},
    {"text": "1-year warranty", "icon": "Shield"}
  ]'::jsonb,
  specifications = '[
    {"icon": "Award", "title": "Complete System", "description": "Everything you need in one box: Warrior Tub + Warrior Chiller + all accessories. Plug in and plunge.", "highlight": true},
    {"icon": "Thermometer", "title": "Temperature", "description": "Maintains 6°C (43°F) automatically. Your ice bath is always ready.", "highlight": true},
    {"icon": "Wrench", "title": "Installation", "description": "Free delivery and professional setup anywhere in Lebanon (~1 hour).", "highlight": true},
    {"icon": "Maximize2", "title": "Tub Size", "description": "90 × 80 cm. Full-body immersion for one person."},
    {"icon": "Layers", "title": "Insulation", "description": "Double-layer thermal walls reduce energy use between sessions."},
    {"icon": "Filter", "title": "Filtration", "description": "Built-in filter keeps water clean for weeks."},
    {"icon": "Shield", "title": "Materials", "description": "Medical-grade PVC tub + industrial-grade chiller."},
    {"icon": "Package", "title": "What''s Included", "description": "Warrior Tub, Warrior Chiller, thermal cover, pump, filter, repair kit, carrying bag, and installation."}
  ]'::jsonb,
  description = 'Everything you need in one box. Warrior Tub + Warrior Chiller. No ice, no hassle. Just plug in, step in, and recover.',
  seo_description = 'Complete ice bath system: tub + chiller. Always at 6°C, always ready. No ice needed. Available in Lebanon.'
WHERE id = '79020f37-19cf-4d53-8c14-d43627551b9e';

-- =====================================================
-- 6. WARRIOR SYSTEM PRO ($2,600) - Tub XL + Chiller Pro
-- =====================================================
UPDATE products
SET
  name = 'Warrior System Pro',
  features = '[
    {"text": "Complete system, just plug in", "icon": "Award"},
    {"text": "Fits 2 people, cools to 3°C", "icon": "Users"},
    {"text": "Free delivery and installation", "icon": "CheckCircle"},
    {"text": "Built for athletes and gyms", "icon": "Target"},
    {"text": "1-year warranty", "icon": "Shield"}
  ]'::jsonb,
  specifications = '[
    {"icon": "Award", "title": "Complete System", "description": "Everything you need: Warrior Tub XL + Warrior Chiller Pro + all accessories.", "highlight": true},
    {"icon": "Users", "title": "Capacity", "description": "160 × 80 × 70 cm. Fits two adults for shared recovery sessions.", "highlight": true},
    {"icon": "Thermometer", "title": "Temperature", "description": "Maintains 3°C (37°F) automatically. Maximum cold for serious recovery.", "highlight": true},
    {"icon": "Wrench", "title": "Installation", "description": "Free delivery and professional setup anywhere in Lebanon (~1 hour)."},
    {"icon": "Layers", "title": "Insulation", "description": "Double-layer thermal walls for energy efficiency."},
    {"icon": "Filter", "title": "Filtration", "description": "Built-in filter keeps water clean for weeks."},
    {"icon": "Shield", "title": "Materials", "description": "Medical-grade PVC tub + commercial-grade chiller."},
    {"icon": "Package", "title": "What''s Included", "description": "Warrior Tub XL, Warrior Chiller Pro, thermal cover, pump, filter, repair kit, carrying bag, and installation."}
  ]'::jsonb,
  description = 'The complete cold therapy system. Warrior Tub XL paired with the Warrior Chiller Pro. Fits two people, cools to 3°C, and maintains temperature through back-to-back sessions without downtime.',
  seo_description = 'Premium cold plunge system fits 2 people, reaches 3°C. Tub + chiller bundle for athletes and gyms in Lebanon.'
WHERE id = '5445503b-b464-46d1-a4ff-75ae9e2e9f2a';


-- =====================================================
-- WARRANTY UPDATE
-- =====================================================
UPDATE warranties
SET
  name = 'Warrior Leap Guarantee',
  description = 'We stand behind every product we sell. If something goes wrong, we''ll make it right.',
  coverage_details = 'Full coverage for 12 months: manufacturing defects, parts, and labor. If your product fails, we''ll repair or replace it. No questions asked.',
  terms_and_conditions = 'Covers all manufacturing defects and normal use issues. Does not cover damage from misuse or unauthorized modifications. Contact us anytime for support.'
WHERE id = '07035829-7c2a-435b-af9a-9c5d1069efdc';


-- =====================================================
-- VERIFY THE UPDATES
-- =====================================================
SELECT 'Products updated:' as status;
SELECT name, price, LEFT(description, 60) as description_preview
FROM products
ORDER BY price;

SELECT 'Warranty updated:' as status;
SELECT name, duration_months, LEFT(coverage_details, 80) as coverage_preview
FROM warranties
WHERE is_active = true;

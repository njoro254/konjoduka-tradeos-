# Database Schema Documentation

## Core Tables

### 1. Users & Profiles
- `users`: id, email, password_hash, role (SME, Logistics, Admin)
- `businesses`: id, user_id, name, registration_no, country, verification_status

### 2. Trade & Products
- `products`: id, category, sub_category, name, grade
- `price_records`: id, product_id, location, price, date
- `seasonal_calendars`: id, product_id, harvest_start, peak_months

### 3. Policy & Compliance
- `policy_documents`: id, category (Customs, SPS, Immigration), content, country
- `policy_checklist_items`: id, policy_id, task, required_docs, fee_kes, processing_days

### 4. Commerce
- `directory_listings`: id, business_id, description, rating, verified_at
- `escrow_transactions`: id, buyer_id, seller_id, amount, currency, status (Pending, Held, Released, Disputed)
- `shipments`: id, escrow_id, carrier_id, current_lat, current_lng, status

### 5. Intelligence & Media
- `llm_configs`: id, provider, model_name, api_key_enc, priority
- `llm_logs`: id, user_id, prompt, response, token_count, cost
- `blog_posts`: id, title, content_html, lang_code, published_at
# Enterprise Secure Flask & Vanilla Project

This project implements a robust Flask backend with RSA 4096 JWT Authentication and a responsive Vanilla JS/CSS frontend.

## Features
- **Backend:** Flask 3.0, PostgreSQL, SQLAlchemy, Migrate.
- **Auth:** RSA 4096 asymmetric JWT signing (RS256).
- **Admin:** Dynamic CORS management and editable permissions tied to subscriptions.
- **Frontend:** Vanilla JS/CSS, SEO optimized, mobile responsive, nested navbars, and nested popups.

## Setup Instructions

### Backend
1. Create a virtual environment: `python -m venv venv`
2. Install dependencies: `pip install -r requirements.txt`
3. Generate RSA keys (save as `private_key.pem` and `public_key.pem` in backend root).
4. Run migrations: `flask db init`, `flask db migrate`, `flask db upgrade`.
5. Start server: `python app.py`.

### Frontend
Open `frontend/index.html` in any modern browser.

### API Documentation
Import `postman_collection.json` into Postman to test the endpoints.
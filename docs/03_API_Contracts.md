# API Contracts (OpenAPI Spec)

## Endpoints

### Price Discovery
- `GET /api/v1/prices`: Returns historical and current prices.
- `GET /api/v1/prices/forecast`: 30-day LSTM forecast data.

### Compliance
- `GET /api/v1/policy/checklist`: Returns dynamic JSON checklist based on product and route.
- `POST /api/v1/policy/subscribe`: Register for SMS/Email policy change alerts.

### BOQ Simulator
- `POST /api/v1/boq/simulate`:
  - Input: `{ crop, area_ha, processing_level, destination }`
  - Output: Full breakdown of production and trade costs.

### Payments & Escrow
- `POST /api/v1/escrow/create`: Initiate transaction.
- `POST /api/v1/payments/stk-push`: M-Pesa Daraja STK Push.
- `GET /api/v1/payments/query/{id}`: Polling endpoint for transaction status.

### Logistics
- `GET /api/v1/logistics/quotes`: Aggregate quotes from Sendy, CrossLogix, and brokers.
- `GET /api/v1/logistics/track/{id}`: Real-time GeoJSON for Leaflet.

### Directory
- `GET /api/v1/directory/search`: Natural language search powered by LLM.
- `POST /api/v1/directory/chat`: WebSocket-based secure messaging.
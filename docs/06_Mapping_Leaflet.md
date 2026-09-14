# Mapping & Logistics Implementation

## Leaflet.js Setup
- **Basemap:** OpenStreetMap.
- **Custom Layers:**
  - `Collection Points`: Markers for regional agro-hubs.
  - `Cold Storage`: Highlighting available refrigeration near border posts.
  - `Border Posts`: Moyale and Mandera entry points.
  - `Live Shipments`: Moving markers updated via WebSocket.

## Route Planning
- Uses **OpenRouteService (ORS)** for distance matrix and travel time.
- Considers "Trade Barriers" (e.g., seasonal road closures, border congestion) to provide realistic ETAs.

## UI Components
- Integrated sidebar showing shipment details when a marker is clicked.
- Temperature logging for sensitive agro-cargo (Coffee, Flowers).
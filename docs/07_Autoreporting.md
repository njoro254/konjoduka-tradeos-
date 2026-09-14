# Autoreporting & Notifications

## Celery Tasks
- `generate_weekly_prices`: Every Sunday, compiles CSV/PDF of regional price shifts.
- `policy_alert_daemon`: Daily check for regulatory updates.
- `directory_matchmaking`: Weekly "Recommended Partners" digest.

## Formats
- **PDF:** Generated via `WeasyPrint` with branded headers.
- **Excel:** Detailed BOQ breakdowns via `openpyxl`.

## Channels
1. **SMS:** Twilio integration for STK push alerts and shipment arrivals.
2. **Telegram:** Bot for real-time price queries and dashboard alerts.
3. **Email:** Monthly trade summaries via SendGrid.
4. **WebSocket:** In-app toast notifications for chat messages.
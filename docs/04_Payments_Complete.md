# Payments & Escrow Integration

## Supported Providers
- **Kenya:** M-Pesa (Daraja), KCB Buni (QR/API), Mastercard MPGS, Jenga, Pesalink.
- **Ethiopia:** Telebirr (Chapa), CBE Birr.
- **International:** Stripe Connect.

## Escrow Workflow
1. **Initiation:** Buyer creates a contract. Platform generates an `idempotency-key`.
2. **Deposit:** Buyer pays via selected provider. Platform holds funds in a dedicated KCB/CBE account.
3. **Verification:** Funds status checked via `/payments/query`.
4. **Fulfillment:** Seller uploads shipping docs.
5. **Release:** Buyer confirms receipt or platform auto-releases after X days.
6. **Dispute:** LLM summarizes chat logs + docs for Admin review.

## Currency Management
- Base storage in USD.
- Real-time conversion KES ↔ ETB via currency layer API (cached 1h).
- Platform fee: 1.5% fixed per transaction.
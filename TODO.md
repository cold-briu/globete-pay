# TODO — Globete Pay (MVP)

Scope: Non-custodial UX mocked as "already logged in". Core flows: scan QR or enter Bre-B recipient code, send cCOP/Mento, show history and details. Build under Next.js App Router at `globete/src/app/main/*`.

## 0. Foundation
- [x] Set up routing under `globete/src/app/main/*` (Dashboard, Send, Activity, Settings, tx details)
- [ ] Add base UI kit: buttons, inputs, modals, toasts
- [x] Basic State management with context api for session, balances, transactions
- [x] Utilities: COP formatting, token decimals, short addresses, date/time, clipboard


## 1. Splash / App Init (no sign-in)
- [x] Create `main/(app)/init` client component to run on first load
- [x] Simulate "connected wallet" state (mock Celo address)
- [x] Check and request camera permission (defer hard-fail to Scan screen)
- [x] Network banner: show Celo network (Alfajores/Mainnet switch in Settings)
- [x] Redirect to `main/dashboard` on ready

## 2. Home / Dashboard (`/main` → dashboard)
- [x] Replace `globete/src/app/main/page.tsx` with Dashboard shell
- [x] BalanceCard: show cCOP balance (mock), toggle token selector (cCOP default)
- [x] QuickActions: "Send" and "Receive" buttons
- [x] RecentTransactions list (last 5) with status chips (mocked)
- [x] Empty state visuals

## 3. Send Payment (`/main/send`)
- [ ] Screen layout with tabs: Scan QR | Enter Code
- [ ] QR Scan: camera preview, live decode, paste-from-clipboard fallback
- [ ] Manual Code: input with validation (Bre-B recipient/payment code format)
- [ ] Recipient preview card (name/alias if provided in payload; else address snippet)
- [ ] Amount entry (COP), auto-convert to token units (18 decimals), min/max rules
- [ ] Optional note/memo field
- [ ] Quote/Fee banner (mock rate + fee; slippage placeholder)
- [ ] Review screen: recipient, amount COP + token, fee, total, network
- [ ] Confirm modal with PIN placeholder (mock) and "Hold to confirm" button
- [ ] Success screen: confetti, status "Settled instantly", CTA to View details / Share receipt
- [ ] Error states: invalid QR/code, insufficient balance, camera denied, network error

## 4. Receive (`/main/receive`)
- [ ] Display user’s "payment code" (mock Bre-B alias or code) and QR
- [ ] Amount request builder (optional), embed amount in QR payload
- [ ] Share sheet: copy code, copy link, download QR
- [ ] Safety tips (only accept from trusted parties)

## 5. Transaction Details (`/main/tx/[id]`)
- [x] Layout with amount (COP + token), recipient/sender, status, timestamp
- [x] Reference IDs: on-chain tx hash (mock), internal reference, Bre-B ref (mock)
- [x] Copy buttons for IDs and recipient
- [ ] Receipt view (print/share), simple HTML export
- [x] Timeline: Created → Submitted → Settled (mock timestamps)
- [ ] Failure reason display when applicable

## 6. Activity / History (`/main/activity`)
- [x] Transactions list (sent/received/pending) mocked
- [x] Filters: type (sent/received), status (partial: no date range yet)
- [ ] Infinite scroll or pagination
- [x] Empty and error states
- [x] Row click → `/main/tx/[id]`

## 7. Settings (`/main/settings`)
- [ ] Profile card: display mock address, alias (editable), copy address
- [ ] Security: set/change 4-digit PIN (client-only mock)
- [ ] Network: selector (Celo Alfajores/Mainnet) with warning modal
- [ ] Notifications: enable app toasts; stub for push/email
- [ ] Language: EN/ES toggle (persist in localStorage)
- [ ] Legal: links to Privacy / Terms (from landing)

## 8. Shared Components
- [ ] `QRCodeScanner` (permission prompts, error fallbacks)
- [ ] `QRCodeCard` (generate QR with embedded payload)
- [ ] `AmountInput` (COP formatting, quick % chips)
- [ ] `TokenSelector` (cCOP default; placeholder for cUSD/cEUR)
- [ ] `QuoteBanner` (rate, fee, slippage note)
- [ ] `ConfirmModal` (PIN entry mock, hold-to-confirm)
- [x] `TransactionItem` (icon, direction, counterparty, amount, status)
- [ ] `FiltersBar` (chips/dropdowns)
- [ ] `Toast` system (success/error/info)

## 9. Data Models (types)
- [ ] `Recipient` (type, code, alias, celoAddress?)
- [ ] `PaymentDraft` (recipient, amount, token, note, quote)
- [x] `Transaction` (id, direction, amounts, fees, status, hashes/refs, timestamps)
- [ ] `Quote` (rate, fee, expiresAt)
- [x] `Network` (name, chainId)
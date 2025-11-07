## Globete Pay — Mock API Plan (Bre-B via Transfiya)

Links (specs reviewed):
- Transfiya Participant APIs (Banco): `https://transfiya.me/es/v1.85/generals/participant-apis/intro-apis`
- Transfiya B2B (Empresas): `https://transfiya.me/es/v1.85/b2b/intro/intro-b2b`
- Regulated Flows (MOL/DICE): `https://transfiya.me/es/v1.85/transfers-mol/intro/intro-mol`
- Directorio Federado (DICE): `https://transfiya.me/es/v1.85/directory/intro/intro-directory`


### 1) Goal & High-level Flow

Enable users to pay any Bre‑B alias (llave) using crypto (e.g., cCOP/cUSD on Celo). We swap crypto to COP off‑ramp, then send COP from our service’s Bre‑B account to the recipient’s account via Transfiya.

User flow:
1. User scans Bre‑B alias (llave) of recipient and enters amount.
2. User sends available crypto to Globete Pay deposit address.
3. We use an off‑ramp to swap crypto→COP into our bank account.
4. We instruct Transfiya to send COP from our bank account to the recipient’s account linked to the llave.


### 2) Which External APIs Map to Each Step

- Step 1 (resolve llave → account details): Use Directorio Federado (DICE) Signer resolution (Directory APIs) to resolve alias and validate destination before payment. See: `https://transfiya.me/es/v1.85/directory/intro/intro-directory`.

- Step 2 (receive crypto): Our blockchain wallet infra (Celo). Not a Transfiya API.

- Step 3 (off‑ramp swap to COP): Exchange/Liquidity Provider API (internal/3rd‑party). Not a Transfiya API.

- Step 4 (send COP to recipient): Use Transfiya for Empresas (B2B) to initiate the transfer from our company account:
  - Transfiya “APIs Transfiya”: Transfer, Action, Credentials, Token. See: `https://transfiya.me/es/v1.85/b2b/intro/intro-b2b`.
  - Behind the scenes, participant banks expose the “APIs de Participantes” (`/v1/debit`, `/v1/credit`, `/v1/action`, `/v1/status`) to Transfiya. We, as an enterprise, typically do NOT implement these; our sponsoring bank does. Reference: `https://transfiya.me/es/v1.85/generals/participant-apis/intro-apis`.
  - For 2025+ regulated flows (MOL/DICE), ensure compliance and timestamps while keeping compatibility. Reference: `https://transfiya.me/es/v1.85/transfers-mol/intro/intro-mol`.


### 3) Our Service — Public API Surface (Mock)

All endpoints are ours (Globete Pay), backing the mobile/web client. We integrate with DICE, Transfiya B2B, and off‑ramp under the hood.

Authentication: Bearer JWT (user), mTLS/OAuth2 client creds (server→server to partners), and offline signing for Transfiya Action where applicable.


#### 3.1 Resolve Recipient (llave)

POST /v1/recipients/resolve

Request:
```json
{
  "llave": "+57-3001234567",
  "llaveType": "PHONE", 
  "currency": "COP"
}
```

Response (success):
```json
{
  "recipient": {
    "llave": "+57-3001234567",
    "displayName": "Juan Perez",
    "institution": {
      "id": "BANK_ABC",
      "name": "Banco ABC"
    },
    "account": {
      "type": "SAVINGS",
      "maskedNumber": "****1234"
    },
    "validations": {
      "isPayable": true,
      "limits": {
        "maxPerTx": 11552000,
        "institutionalMaxPerTx": 5000000
      }
    }
  }
}
```

Notes: Calls DICE Directory resolve; surfaces validations/limits when available. Pre-flight checks before quotes.


#### 3.2 Get Off‑Ramp Quote (crypto→COP)

POST /v1/offramp/quotes

Request:
```json
{
  "sourceAsset": "cUSD",
  "targetCurrency": "COP",
  "targetAmount": 100000,
  "recipientLlave": "+57-3001234567"
}
```

Response:
```json
{
  "quoteId": "qt_01HV...",
  "rate": 3950.25,
  "fee": 1200,
  "totalCop": 100000,
  "requiredCrypto": "25.400123",
  "expiresAt": "2025-11-07T15:01:20Z"
}
```


#### 3.3 Lock Quote & Get Deposit Instructions

POST /v1/offramp/locks

Request:
```json
{
  "quoteId": "qt_01HV...",
  "chain": "CELO",
  "sourceAsset": "cUSD"
}
```

Response:
```json
{
  "lockId": "lk_01HV...",
  "deposit": {
    "address": "0xabc...",
    "memo": null,
    "minAmount": "25.400123",
    "expiresAt": "2025-11-07T15:06:20Z"
  },
  "status": "AWAITING_CRYPTO"
}
```


#### 3.4 Webhook: On‑chain Confirmation (internal)

POST /internal/webhooks/onchain/confirmed

Request (example):
```json
{
  "lockId": "lk_01HV...",
  "txHash": "0x...",
  "amount": "25.401000",
  "asset": "cUSD",
  "confirmedAt": "2025-11-07T15:03:10Z"
}
```

Action: Triggers off‑ramp swap. Moves status → SWAP_PENDING.


#### 3.5 Webhook: Off‑ramp Settlement (internal)

POST /internal/webhooks/offramp/settled

Request:
```json
{
  "lockId": "lk_01HV...",
  "copCredited": 100000,
  "bankRef": "BR123456",
  "settledAt": "2025-11-07T15:04:50Z"
}
```

Action: Initiate Transfiya transfer.


#### 3.6 Initiate COP Transfer via Transfiya

POST /v1/transfers

Request:
```json
{
  "lockId": "lk_01HV...",
  "recipientLlave": "+57-3001234567",
  "amountCop": 100000,
  "purpose": "Payment",
  "metadata": {
    "customerRef": "INV-9841"
  }
}
```

Response:
```json
{
  "transferId": "tf_01HV...",
  "transfiya": {
    "transferRef": "TFY-2025-...",
    "state": "SUBMITTED"
  }
}
```

Notes:
- Under the hood: obtain OAuth token (Transfiya Token), optionally sign Action, call Transfiya Transfer. B2B rails then orchestrate with participant banks (`/v1/debit`, `/v1/credit`).


#### 3.7 Webhook: Transfiya Status

POST /webhooks/transfiya/status

Request (example):
```json
{
  "transferRef": "TFY-2025-...",
  "state": "CREDITED",
  "creditedAt": "2025-11-07T15:05:30Z",
  "bank": {
    "src": "BANK_GLOBETE",
    "dst": "BANK_ABC"
  }
}
```

Response/action: Update internal transfer to SUCCESS; notify client.

Failure example (maps to participant error codes):
```json
{
  "transferRef": "TFY-2025-...",
  "state": "REJECTED",
  "error": {
    "code": 315,
    "message": "Fondos insuficientes"
  }
}
```


#### 3.8 Query Transfer Status

GET /v1/transfers/{transferId}

Response (example):
```json
{
  "transferId": "tf_01HV...",
  "lockId": "lk_01HV...",
  "state": "SUCCESS",
  "timeline": [
    { "t": "2025-11-07T15:00:20Z", "e": "QUOTE_LOCKED" },
    { "t": "2025-11-07T15:03:10Z", "e": "CRYPTO_CONFIRMED" },
    { "t": "2025-11-07T15:04:50Z", "e": "OFFRAMP_SETTLED" },
    { "t": "2025-11-07T15:05:30Z", "e": "CREDITED" }
  ]
}
```


### 4) Internal States

- CREATED → AWAITING_CRYPTO → CRYPTO_CONFIRMED → SWAP_PENDING → SWAP_SETTLED → TRANSFER_SUBMITTED → DEBITED → CREDITED/SUCCESS
- Terminal failures: REJECTED (with Transfiya/bank code), EXPIRED (quote/lock), SWAP_FAILED, COMPLIANCE_BLOCKED


### 5) Error Mapping (Participant Codes)

We surface normalized errors but retain Transfiya participant codes for transparency (see table in Participant APIs): 300–337 including timeouts, account status, insufficient funds (315), antifraud rejections (322), etc. Reference: `https://transfiya.me/es/v1.85/generals/participant-apis/intro-apis`.

Client-facing example:
```json
{
  "error": {
    "type": "BANK_REJECTION",
    "code": 315,
    "title": "Fondos insuficientes",
    "hint": "El banco del destinatario rechazó por saldo insuficiente."
  }
}
```


### 6) Security & Compliance

- Transfiya B2B: OAuth2 client credentials (Token), maintain Credentials, and use Action signing as required. Consider offline keys and claims best practices.
- DICE: follow validation schema; include timestamps where required for regulated flows (MOL).
- KYB/KYC: Align with `context.md` mission and regulated limits. Enforce per‑tx ceilings (e.g., 11,552,000 COP or bank-specific lower limits).


### 7) Sequence (Condensed)

1) Client → Globete: resolve llave → DICE (validate/payable)
2) Client → Globete: quote/lock
3) User → Globete: send crypto (Celo)
4) On‑chain confirm → trigger swap → COP in bank acct
5) Globete → Transfiya (B2B Transfer + Action) → participant banks handle `/v1/debit` and `/v1/credit`
6) Transfiya status → webhook → SUCCESS/REJECTED → client updated


### 8) Open Questions / Assumptions

- Sponsoring bank: We assume an existing corporate account integrated with Transfiya B2B; bank handles participant endpoints.
- Off‑ramp provider: SLA and cutoff alignment with real‑time payouts required.
- Limits: Enforce bank and regulatory per‑tx and per‑day limits before locking quotes.
- Refunds/Reversals: Implement reversal flows (see Transfiya guides) for edge cases.



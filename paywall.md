Here’s a prioritized task list to implement a centralized token system (1 token = 1 INR) with Razorpay integration, token spending on actions, dashboard balance, and transaction history, for both backend and frontend:

---

## 1. Backend

### 1.1. Token & Transaction Models

- Create models for:
  - UserTokenBalance (userId, availableToken)
  - PaymentGatewayLog (userId, amount, status, raw, timestamp)
  - TokenTransactionLog (userId, actionId, token, timestamp)

### 1.2. Payment Integration

- Integrate Razorpay (test mode)
- Endpoint to create payment order
- Endpoint to verify payment and credit tokens

### 1.3. Token Spend Logic

- Endpoint to spend tokens for actions (analyze, resume, template, etc.)
- Deduct tokens and log transaction

### 1.4. Token Balance & History APIs

- Endpoint to get current token balance
- Endpoint to get transaction history

---

## 2. Frontend

### 2.1. Token Balance Display

- Show user’s token balance on the dashboard (e.g., top bar or card)

### 2.2. Payment UI

- Add “Buy Tokens” button/modal
- Integrate Razorpay payment flow (test mode)
- Update balance after successful payment

### 2.3. Action Button Integration

- On action button click (analyze, resume, template, etc.):
  - Call backend to spend tokens
  - Show error if insufficient tokens

### 2.4. Transaction History UI

- Add a section/page/modal to show transaction history (spend & add)

---

## 3. (Optional, for polish)

- Notifications for successful/failed payments
- UI for token packages (e.g., 100, 500, 1000 tokens)
- Admin panel for manual adjustments

---

### Priority Order

1. **Backend: Models & Payment Integration**
2. **Backend: Token Spend Logic**
3. **Backend: Balance & History APIs**
4. **Frontend: Token Balance Display**
5. **Frontend: Payment UI & Integration**
6. **Frontend: Action Button Integration**
7. **Frontend: Transaction History UI**
8. (Optional) Notifications, packages, admin

---

Would you like to start with the backend models and payment integration? If yes, I can generate the code for the models and the initial payment endpoint.

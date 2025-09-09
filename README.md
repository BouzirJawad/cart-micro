# 🛒 Cart Service 

This microservice handles **shopping cart functionality** for both **logged-in users** and **guests** in the aluminum e-commerce platform.  
It supports adding/removing products, updating quantities, clearing cart, and merging guest cart into user cart on login.

---

## ✅ Features
- Add, update, remove items in cart.
- Separate carts for **users** and **guests**.
- Merge guest cart into user cart upon login.
- Clear entire cart.
- REST API built with **Express + MongoDB**.
- Validates request payloads using **Express Validator**.

---

## ✅ Tech Stack
- **Backend:** Node.js, Express.js, MongoDB, Mongoose.
- **Validation:** express-validator.
- **Communication:** REST API.
- **Others:** Axios (for external requests in future if needed).

---

## ✅ Folder Structure
```bash
cart-service/
│
├── config/
│ └── db.js # Database connection
│
├── controllers/
│ └── cart.controller.js
│
├── middlewares/
│ └── cart.validation.js
│ └── validateRequest.js
│
├── models/
│ └── Cart.js
│
├── routes/
│ └── cart.routes.js
│
│
├── server.js # Main entry point
├── .env # Environment variables
└── package.json
```

---

## ✅ Installation

### 1. Clone the repository
```bash
git clone https://github.com/BouzirJawad/cart-micro.git
cd cart-micro
````

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
PORT=port-of-your-choice
MONGODB_URL=mongodb://localhost:27017/name-of-your-choice
```

### 4. Run the service
```bash
npm start
```

### ✅ API Endpoints
1. Add item to cart
```bash
POST /api/cart/:type/:id/items
````
type → user or guest

id → userId or guestId

Request Body:
```bash
{
  "productId": "64fe5b30b21d",
  "quantity": 2
}
````
2. Get cart
```bash
GET /api/cart/:type/:id
```
Response:
```bash
{
  "type": "guest",
  "id": "12345",
  "items": [
    {
      "productId": "64fe5b30b21d",
      "quantity": 2
    }
  ]
}
```
3. Update item quantity
```bash
PUT /api/cart/:type/:id/items
```
Body:
```bash
{
  "productId": "64fe5b30b21d",
  "quantity": 5
}
```
4. Remove item
```bash
DELETE /api/cart/:type/:id/items
```
Body:
```bash
{
  "productId": "64fe5b30b21d"
}
```
5. Clear cart
```bash
DELETE /api/cart/:type/:id/clear
```
6. Merge guest cart into user cart
```bash
POST /api/cart/merge
```
Body:
```bash
{
  "userId": "USER_123",
  "guestId": "GUEST_456"
}
```

✅ How It Works

Guests are assigned a unique guestId (frontend stores in localStorage).

Logged-in users use userId from JWT.

Carts are stored separately but can be merged when user logs in.


✅ Future Enhancements

Add caching (Redis) for faster cart retrieval.

Validate product existence with Product Service.

Add expiration for guest carts.


---
✅ Author

Jawad Bouzir
Full Stack JavaScript Developer in progress 🚀

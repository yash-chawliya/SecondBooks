# 📚 SecondBooks

SecondBooks is a modern, full-stack MERN (MongoDB, Express, React, Node.js) web application designed for buying and selling refurbished and second-hand educational books. 

## 🌟 Key Features

* **Secure Authentication:** OTP-based phone login and registration powered by Twilio.
* **Shopping Experience:** Full shopping cart functionality and dynamic book search.
* **Payment Gateway:** Seamless and secure checkout process integrated with Razorpay.
* **Shipping Estimates:** Real-time delivery time estimates using the Delhivery API.
* **Automated Notifications:** Email confirmations for successful orders via Nodemailer.
* **Reviews & Ratings:** Users can leave detailed reviews and ratings on their purchased books.

## 📸 Screenshots

*Desktop and Mobile Previews*

| Desktop View | Mobile View |
| :---: | :---: |
| <img src="./scripts/home_desktop.png" width="500"/> | <img src="./scripts/home_mobile.png" width="250"/> |

## 🛠️ Technology Stack

**Frontend:**
- React 19 (via Vite)
- Tailwind CSS for modern, responsive styling
- React Router DOM for navigation
- React Hot Toast for elegant notifications

**Backend:**
- Node.js & Express.js (MVC Architecture)
- MongoDB & Mongoose (Data modeling)
- JWT (JSON Web Tokens) for secure, stateless sessions
- bcryptjs for password hashing
- Razorpay, Twilio, Nodemailer SDKs

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB instance)
- API Keys for Twilio, Razorpay, and Delhivery (optional, for full feature set)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/secondbooks.git
   cd secondbooks
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory based on the variables used (e.g., `MONGO_URI`, `JWT_SECRET`, `RAZORPAY_KEY_ID`, etc.).
   
   Start the backend server:
   ```bash
   npm run dev:server
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

## 📁 Project Structure

```
SecondBooks/
├── backend/
│   ├── src/
│   │   ├── config/       # 3rd party API & DB configs
│   │   ├── controllers/  # Business logic (MVC)
│   │   ├── middlewares/  # Custom Express middlewares (Auth)
│   │   ├── models/       # Mongoose DB Schemas
│   │   ├── routes/       # Express Route definitions
│   │   ├── app.js        # Express app setup
│   │   └── server.js     # Entry point
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/              # React application source code
    ├── public/           # Static assets
    ├── tailwind.config.js
    └── vite.config.js
```

## 📝 License
This project is open-source and available under the ISC License.

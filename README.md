# 💹 Stock Trading Platform

A Zerodha-inspired trading platform built using the MERN stack. This project simulates the core functionality of a stock trading application with real-time data rendering, user authentication, and a responsive interface that mirrors professional trading platforms.

<!---  ![Project Banner](https://via.placeholder.com/1200x400/1a1a1a/00d09c?text=Zerodha+Trading+Platform)  --->

## 🌟 Features

- **User Authentication** - Secure signup and login with JWT-based authentication
- **Real-Time Market Data** - Simulated live stock price updates and market movements
- **Interactive Dashboard** - Comprehensive trading dashboard with portfolio overview
- **Order Management** - Place buy/sell orders with real-time execution simulation
- **Portfolio Tracking** - Monitor investments and track P&L in real-time
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile devices
- **Holdings & Positions** - View current holdings and open positions
- **Watchlist** - Create and manage custom stock watchlists
- **React Context API** - Efficient global state management
- **Modular Architecture** - Clean, reusable, and scalable component structure

## 🛠️ Tech Stack

### Frontend
- **React** - UI library for building interactive interfaces
- **JavaScript (ES6+)** - Modern JavaScript features
- **HTML5** - Semantic markup
- **CSS3** - Custom styling with flexbox and grid
- **React Router** - Client-side routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **JWT** - JSON Web Tokens for authentication

### Database
- **MongoDB** - NoSQL database for user and market data

### Tools & Libraries
- **Git** - Version control
- **VS Code** - Code editor
- **React Hooks** - useState, useEffect, useContext
- **Context API** - Global state management

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/ShubhamJaiswal-Engg/zerodha-clone.git
cd zerodha-clone
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
cd ..
```

4. Create a `.env` file in the backend directory
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

5. Start MongoDB
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

6. Start the backend server
```bash
cd backend
npm start
```

7. Start the frontend development server (in a new terminal)
```bash
npm start
```

8. Open your browser and navigate to `http://localhost:3000`

### Frontend env config (CRA)

This repo contains multiple React apps. The landing app lives in `frontend/`.

- CRA only exposes env vars prefixed with `REACT_APP_`.
- Copy [frontend/.env.example](frontend/.env) to `frontend/.env` and restart the dev server.

Example:
```env
REACT_APP_FRONTEND_URL=http://localhost:3000
REACT_APP_DASHBOARD_URL=http://localhost:3001
REACT_APP_BACKEND_URL=http://localhost:3002
```

The landing app reads these values from [frontend/src/config/urls.js](frontend/src/config/urls.js) and falls back to localhost defaults if not set.

<!---
## 📂 Project Structure

```
zerodha-clone/
├── public/
│   ├── index.html
│   └── assets/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Holdings.jsx
│   │   │   └── Positions.jsx
│   │   ├── Market/
│   │   │   ├── Watchlist.jsx
│   │   │   └── StockCard.jsx
│   │   └── Common/
│   │       ├── Navbar.jsx
│   │       └── Footer.jsx
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── MarketContext.js
│   ├── utils/
│   │   ├── api.js
│   │   └── helpers.js
│   ├── App.js
│   └── index.js
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Stock.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── stocks.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── stockController.js
│   ├── middleware/
│   │   └── auth.js
│   └── server.js
└── package.json
```
 --->
## 🔑 Key Functionalities

### Authentication System
- User registration with email validation
- Secure login with JWT token generation
- Password hashing with bcrypt
- Protected routes for authenticated users
- Persistent login sessions

### Trading Features
- **Buy/Sell Orders** - Execute simulated stock transactions
- **Portfolio Management** - Track all your investments in one place
- **Holdings** - View detailed breakdown of owned stocks
- **Positions** - Monitor open trading positions
- **P&L Tracking** - Real-time profit and loss calculations

### Market Data
- Real-time stock price updates (simulated)
- Market overview dashboard
- Stock search functionality
- Custom watchlist creation
- Historical price charts

### State Management
- React Context API for global state
- Custom hooks for data fetching
- Optimized re-rendering with useMemo and useCallback
- Local storage for user preferences

## 📸 Screenshots

### Landing Page
<img width="1440" alt="Zerodha Landing Page" src="https://github.com/user-attachments/assets/e0397ec3-cffd-4dfd-a328-c454f8b5875e" />

### Trading Dashboard
<img width="1440" alt="Trading Dashboard" src="https://github.com/user-attachments/assets/274f8d2f-4956-4f7a-bf59-54260d1ba941" />

<!---
## 🎯 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| GET | `/api/stocks` | Get all stocks | Yes |
| GET | `/api/stocks/:id` | Get single stock | Yes |
| POST | `/api/orders` | Place new order | Yes |
| GET | `/api/portfolio` | Get user portfolio | Yes |
| GET | `/api/holdings` | Get user holdings | Yes |
| GET | `/api/positions` | Get open positions | Yes |

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the build folder
```

### Backend (Heroku/Railway)
```bash
# Follow platform-specific deployment guide
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Code Quality

This project follows:
- ESLint for code linting
- Prettier for code formatting
- Airbnb React style guide
- Component-based architecture
- Clean code principles

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Environment variables for sensitive data
- Input validation and sanitization
- CORS configuration

## 📈 Performance Optimizations

- Code splitting with React.lazy
- Memoization with useMemo and useCallback
- Debouncing for search inputs
- Lazy loading of images
- Optimized bundle size

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. --->

## 👤 Author

**Shubham Jaiswal**

- GitHub: [@ShubhamJaiswal-Engg](https://github.com/ShubhamJaiswal-Engg)
- LinkedIn: [shubhamjaiswalengg](https://linkedin.com/in/shubhamjaiswalengg)
- Email: shubhamjai8662@gmail.com

## 🙏 Acknowledgements

- UI/UX inspired by [Zerodha](https://zerodha.com/) - India's largest stock broker
- Market data simulation concepts from real trading platforms
- Thanks to the React and Node.js communities for excellent documentation
- Special thanks to all contributors and supporters
<!--- 

## 📌 Future Enhancements

- [ ] Real-time WebSocket integration for live market data
- [ ] Advanced charting with TradingView integration
- [ ] Technical indicators and analysis tools
- [ ] News and market insights integration
- [ ] Mobile app development (React Native)
- [ ] Cryptocurrency trading support
- [ ] Social trading features
- [ ] AI-powered stock recommendations
- [ ] Two-factor authentication (2FA)
- [ ] Email/SMS notifications for price alerts

## 🐛 Known Issues

- Market data is simulated and not real-time
- Order execution is simulated for demo purposes
- Limited to practice trading only

## 💡 Learning Outcomes

Through this project, I gained experience in:
- Building full-stack applications with MERN stack
- Implementing secure authentication systems
- Managing complex state with React Context API
- Creating responsive and intuitive user interfaces
- Working with RESTful APIs
- Database design and optimization
- Real-time data simulation
- Following industry best practices

---

⭐ If you found this project helpful, please give it a star!

**[View Live Demo](#)** | **[Report Bug](https://github.com/ShubhamJaiswal-Engg/zerodha-clone/issues)** | **[Request Feature](https://github.com/ShubhamJaiswal-Engg/zerodha-clone/issues)**

---

**⚠️ Disclaimer:** This is a clone project built for educational purposes only. It is not affiliated with or endorsed by Zerodha. Do not use for actual trading.  --->

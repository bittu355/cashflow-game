# 💰 Cashflow: The Multiplayer Financial Engine

![Deploy Status](https://github.com/bittu355/cashflow-game/actions/workflows/firebase-hosting-merge.yml/badge.svg)
[![Live Demo](https://img.shields.io/badge/PLAY-NOW-success?style=for-the-badge&logo=firebase)](https://cashflow-game-dd5b9.web.app)

A high-performance, real-time digital version of the classic financial literacy board game. Built with a focus on premium aesthetics, robust multiplayer synchronization, and a deep financial logic engine.

![Cashflow Game Banner](public/banner.png)

## 🚀 Experience the Game
**Click below to start playing instantly:**
### 👉 [PLAY CASHFLOW NOW](https://cashflow-game-dd5b9.web.app)

---

## 💎 Key Features

### 🏢 Dual-Phase Gameplay
- **The Rat Race**: Navigate the inner circle, managing salary, expenses, and small/big deals to build passive income.
- **The Fast Track**: Once your passive income exceeds your expenses, escape the Rat Race and enter the high-stakes world of massive investments and dreams.

### 🌐 Real-Time Multiplayer
- **Firebase Powered**: State-of-the-art synchronization ensures all players see moves, market events, and ledger updates instantly.
- **Matchmaking Lobby**: Create private rooms or join friends using unique room codes for seamless group play.
- **Cross-Platform**: Optimized for desktop and mobile browsers, with a fully responsive glassmorphism UI.

### 🤖 Advanced Game Engine
- **Financial Ledger**: A live dual-view ledger for personal financial statements and global audit logs.
- **3D Physics Dice**: Premium CSS-based 3D dice with realistic tumbling animations and immersive audio feedback.
- **Macro Events**: Global market shifts (Inflation, Tech Booms) that affect all players simultaneously.
- **Insert-Only Ledger**: A robust financial audit log tracking every dollar and cashflow change for total consistency.

## 🛠 Tech Stack

- **Core**: React 19 (Latest), TypeScript, Vite
- **State Management**: Zustand (with selective persistence middleware)
- **Real-time Backend**: Firebase Realtime Database
- **Mobile Bridge**: Capacitor (Android/iOS support)
- **Styling**: Premium Glassmorphism & Vanilla CSS
- **PWA**: Fully installable as a Progressive Web App

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bittu355/cashflow-game.git
   cd cashflow-game
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   ...
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

## 🎮 How to Play

1. **Join the Lobby**: Select your profession (Doctor, Teacher, Janitor, etc.) and your life's dream.
2. **The Goal**: Accumulate assets (Real Estate, Stocks, Businesses) until your **Passive Income > Total Expenses**.
3. **Manage Debt**: Use the Bank modal to take loans or pay off high-interest liabilities.
4. **Market Events**: Watch the Audit Log for market opportunities to sell your assets for massive capital gains.

---

Built with ❤️ by [bittu355](https://github.com/bittu355)

# 💰 Cashflow: The Multiplayer Financial Engine

A high-performance, real-time digital version of the classic financial literacy board game. Built with a focus on premium aesthetics, robust multiplayer synchronization, and a deep financial logic engine.

![Cashflow Game Banner](https://images.unsplash.com/photo-1554224155-1697469875bb?auto=format&fit=crop&q=80&w=1200&h=400)

## 🚀 Key Features

### 🏢 Dual-Phase Gameplay
- **The Rat Race**: Navigate the inner circle, managing salary, expenses, and small/big deals to build passive income.
- **The Fast Track**: Once your passive income exceeds your expenses, escape to the outer track and chase your ultimate dream.

### 🌐 Real-Time Multiplayer
- **Firebase Powered**: Seamless synchronization across multiple clients using Firebase Realtime Database.
- **Matchmaking Lobby**: Create private rooms or join friends using unique room codes.
- **Cross-Platform**: Optimized for web and mobile browsers, with native support via Capacitor.

### 🤖 Advanced Game Engine
- **AI Opponents**: Intelligent bots that make financial decisions based on risk/reward ratios.
- **3D Physics Dice**: Premium CSS-based 3D dice with realistic tumbling animations and audio feedback.
- **Macro Events**: Global market shifts (Inflation, Tech Booms) that affect all players simultaneously.
- **Insert-Only Ledger**: A robust financial audit log tracking every dollar and cashflow change for total consistency.

## 🛠 Tech Stack

- **Core**: React 19 (Latest), TypeScript, Vite
- **State Management**: Zustand (with selective persistence)
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

3. **Configure Firebase**:
   Update `src/utils/firebase.ts` with your Firebase credentials.

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

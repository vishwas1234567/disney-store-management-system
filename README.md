<div align="center">
  <h1>🏰 Disney Store Management System</h1>
  <p>A full-stack, enterprise-grade Point of Sale (POS) and retail management platform built specially for Disney Store operations.</p>
</div>

---

## 📖 Project Overview

The **Disney Store Management System** is a scalable, modern dashboard designed to provide fast-paced retail environments with real-time transactional integrity, atomic inventory synchronization, and frictionless billing capabilities. Built on a cutting-edge React/Next.js stack utilizing Firestore for lightning-fast concurrent updates, this system equips administrators and store staff with intuitive tools to manage products, analyze revenue, and serve magical shopping experiences seamlessly.

---

## ✨ Features

- ✅ **Auth System**: Secure Google Firebase email/password authentication preventing unauthorized external access.
- ✅ **Role-based Access**: Strict routing protocols ensuring `Admin` users have global control, while `Staff` accounts are limited to retail billing interactions.
- ✅ **Dashboard**: A comprehensive, responsive hub giving immediate macro-insights into store performance and low-stock threshold alerts.
- ✅ **Analytics Charts**: Beautiful, interactive Recharts integrations mapping revenue timelines and top-selling merchandise intuitively.
- ✅ **Product Management**: Full CRUD backend API interfaces connected dynamically to Firestore for organically updating warehouse supplies. 
- ✅ **Stock Management**: Automated local state synchronization physically preventing negative stock limits and cart overflows.
- ✅ **Billing System**: A fluid Point of Sale (POS) two-pane grid layout designed for rapid barcode-style item addition and secure transaction checkout.
- ✅ **Orders System**: Detailed, highly-structured historic mapping of all created orders, nested cart arrays, and pricing tiers.
- ✅ **📄 PDF Invoices**: One-click professional auto-generated PDF receipts using jsPDF directly from the transaction ledger.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons & UI**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) & [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth
- **Deployment**: Vercel

---

## 🚀 Live Demo

- **Live URL**: https://disney-store.vercel.app/

---


## 💻 Setup Instructions

Follow these instructions to run the Disney Store Management System locally on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/disney-store.git
cd disney-store
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Firebase Configuration
Create an environment `.env.local` file natively in your root directory and configure your explicit Firebase application parameters:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run the development server
```bash
npm run dev
```

### 5. Open your Browser
Navigate intuitively to [http://localhost:3000](http://localhost:3000) inside your web browser to view your compiled application. 

---

## 📝 License

This project is open-sourced software licensed under the [MIT license](LICENSE).

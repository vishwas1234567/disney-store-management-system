# 🏰 Disney Store Management System

![Disney Store Banner](screenshots/banner.png) <!-- Note: Add a placeholder or standard banner to a screenshots folder -->

A full-stack, scalable Point of Sale (POS) and inventory management system designed specifically for a modern Disney Store. Built with Next.js 14, React, Tailwind CSS, and Firebase, this elegant dashboard provides real-time transactional integrity, localized analytics, and frictionless billing capabilities for fast-paced retail environments.

---

## 🔗 Links
- **Live Demo**: [Insert Vercel Deployment Link Here]
- **Repository**: [Insert GitHub Repository Link Here]

---

## ✨ Features

- **Store Dashboard**: Robust analytics engine utilizing customized Lucide SVG iconography, mapping your Total Products, Orders, and aggregated Revenue precisely.
- **Automated Inventory Alerts**: Visually highlights statically compiled threshold alerts rendering distinct red warning cards for items with low stock (`< 5`) in real-time.
- **Fluid Point of Sale (Billing)**: A dedicated two-pane grid layout rendering available products alongside an interactive sticky Cart, physically preventing negative stock limits with atomic backend checks natively.
- **Atomic Transactions (Firebase)**: Complete protection against race-conditions. The order creation explicitly executes Firebase `runTransaction` payloads, enforcing strict stability rolling back transactions entirely if items sell out milliseconds before checkout completes!
- **Dynamic Order History**: Detailed `<table/>` UI interfaces fetching all created Orders securely mapping dates, nested cart arrays, and pricing scales beautifully using striped gradient Tailwind styles.
- **Product Management Backend**: Custom API routes executing GET, POST and DELETE behaviors connected directly to Firestore so administrators can update warehouse supplies organically.
- **Secure Authentication**: Encrypted Google Firebase Auth middleware enveloping private dashboard route layouts cleanly to prevent unauthorized external access.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore (NoSQL)
- **Deployment**: Vercel

---

## 📸 Screenshots

| Dashboard Overview | Point of Sale (Billing) |
|:---:|:---:|
| ![Dashboard UI](screenshots/dashboard.png) <br> *A responsive analytics dashboard tracking revenue and low stock levels* | ![Billing Page](screenshots/billing.png) <br> *A fully automated Cart tracking interactive stock parameters natively* |

| Product Management | Order Tracking History |
|:---:|:---:|
| ![Product Table](screenshots/products.png) <br> *Administrators editing the active database supplies* | ![Orders Map](screenshots/orders.png) <br> *Highly detailed tabular mapping of historical orders* |

*(Note: Create a `screenshots` folder in your root repository to map your exact layout images!)*

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

### 3. Setup Firebase Coordinates
Create an environment `.env.local` file natively in your root operating directory and configure your explicit Firebase application parameters:
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
Navigate intuitively to [http://localhost:3000](http://localhost:3000) inside your preferred web browser to view your local compilation. 

---

## 📝 License

This project is open-sourced software licensed under the [MIT license](LICENSE).

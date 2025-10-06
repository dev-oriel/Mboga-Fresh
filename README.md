# B2B2C Fresh Produce Marketplace

## Project Overview

This repository implements a **B2B2C marketplace** that connects **farmers**, **mama mboga vendors**, **riders**, and **urban buyers** using a **platform-controlled escrow mechanism**. The platform’s core promise is **freshness**, **trust**, and **simplicity** for vendors with **low digital literacy**.

---

## 🧩 Actors

- **Buyer** – Retail customers such as office workers, students, and urban dwellers seeking fresh produce with convenience.
- **Vendor (Mama Mboga)** – Local stall vendors selling vegetables and fruits. They require a simple, intuitive interface.
- **Supplier/Farmer** – Bulk producers who supply vendors with fresh produce directly from farms.
- **Rider/Logistics** – Delivery agents using motorbikes or trucks for last-mile fulfillment.
- **Admin** – Platform operator responsible for managing escrow accounts, resolving disputes, and overseeing platform activity.

---

## 🎯 Design Principles

- Keep **vendor UI extremely simple** – clear language, minimal form fields, and visual feedback.
- Hold **buyer funds in escrow** until the order is confirmed as delivered (or automatically released after a set period).
- **Track product batches** to maintain transparency and freshness.
- **Optimize delivery economics** by bundling small orders and enforcing minimum order thresholds.

---

## ⚙️ Features

### Buyer Portal

- Browse product categories (e.g., sukuma wiki, onions, tomatoes).
- Search and filter by type, price, freshness, or vendor location.
- Add to cart, checkout, and schedule delivery slots.
- Track order progress (Pending → Confirmed → Delivered → Complete).
- Confirm delivery and trigger escrow release.

### Vendor Portal (Mama Mboga)

- Simple dashboard showing new, pending, and completed orders.
- Product management tools (add/edit stock, mark items as unavailable).
- Order management (accept/reject orders, mark as delivered).
- Wallet view for pending escrow funds, released earnings, and withdrawal requests.
- Vendor profile with store info, reviews, and ratings.

### Supplier Portal

- Manage bulk supply and pricing.
- Track deliveries to vendors.
- View transaction summaries and order history.

### Rider/Logistics

- Accept delivery assignments.
- Update delivery status in real-time.
- Submit proof-of-delivery to trigger escrow release.

### Admin Portal

- Manage all users (buyers, vendors, riders).
- Oversee escrow accounts and resolve disputes.
- Maintain transaction ledger with timestamps.
- Remove expired or fraudulent listings.
- View analytics (best-selling produce, top vendors, delivery metrics).

### Escrow System

- Buyer funds are held in an **escrow wallet** until delivery confirmation.
- Automatic fund release after a defined time window if no dispute arises.
- Admin intervention for dispute resolution.

### Analytics and Reporting

- Vendor performance and sales trends.
- Transaction summaries and platform activity logs.

---

## 🏗️ Architecture Summary

- **Frontend:** React and Tailwind CSS — for buyer and vendor portals.
- **Backend:** Node.js with Express — RESTful API for business logic and integration.
- **Database:** MongoDB — flexible document storage supporting multiple user roles.
- **Payment Provider:** M-PesaAPI for escrow and payout flows.

---

🚀 _Future commits will include setup guides, API documentation, and deployment instructions._

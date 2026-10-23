# 📦 ProductFlow — Angular CRUD Product Management System

> A modern, high-performance Product Management System built with **Angular**, **Reactive Forms**, **JSON Server**, and **SweetAlert2**.

![Angular](https://img.shields.io/badge/Angular-22-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-Reactive-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)
![SweetAlert2](https://img.shields.io/badge/SweetAlert2-Notifications-7066E0?style=for-the-badge)
![JSON Server](https://img.shields.io/badge/JSON_Server-REST_API-000000?style=for-the-badge&logo=json)

---

## ✨ Features

- ⚡ **Full CRUD Operations**: Create, Read, Update, and Delete products seamlessly with HTTP requests to a RESTful JSON Server API.
- 📋 **Interactive Inventory Dashboard**:
  - **Metrics Summary**: Real-time counter cards for *Total Products*, *Inventory Value*, and *Low Stock Alerts* (<15 units).
  - **Live Search**: Instant keyword filtering across product name, category, SKU, and descriptions.
  - **Category Filtering & Sorting**: Filter by category chips (*Audio*, *Electronics*, *Wearables*, *Accessories*, *Photography*, etc.) and sort by price, name, or stock.
  - **Dual View Modes**: Switch between responsive modern **Grid Cards** and high-density **Table View**.
- 📝 **Reactive Forms**:
  - Implemented using Angular's `FormGroup`, `FormControl`, and `Validators`.
  - Comprehensive field validation (*required*, *minlength*, *min value*, *SKU patterns*) with contextual error feedback.
  - Interactive **Category Chips** for 1-click selection.
  - **Live Store Preview**: Real-time interactive preview card on the creation and edit pages that renders exactly as you type.
- 🔍 **Detailed Product Showcase**:
  - Dedicated View page displaying high-resolution images, rating badges, stock status pills, SKU identifiers, pricing, and full product specifications.
- 🔔 **SweetAlert2 Notifications**:
  - **Modal Delete Confirmations**: Protects against accidental deletions with clear "Are you sure?" confirmation dialogs.
  - **Animated Toast Alerts**: Non-intrusive top-right success notifications on product creation and updates.
- 🔄 **Reactive Component Communication**:
  - Employs an RxJS `Subject` (`refreshNeeded$`) in `ProductService` to auto-broadcast data modifications across components without manual page reloads.

---

## 🛠️ Tech Stack

- **Framework**: Angular 22 (Standalone Components)
- **Language**: TypeScript
- **Reactive Programming**: RxJS (`Subject`, `tap`, `catchError`)
- **Forms**: Angular Reactive Forms (`FormBuilder`, `FormGroup`, `Validators`)
- **Backend / Mock API**: JSON Server (`products.json`)
- **Alerts & Modals**: SweetAlert2
- **Styling**: Vanilla CSS (Custom Design System, Glassmorphism, Dark Mode)
- **Typography**: Google Fonts (*Plus Jakarta Sans* & *JetBrains Mono*)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)

### 2. Clone the Repository
```bash
git clone https://github.com/AiswaryaManoj06/Product-Management-System.git
cd Product-Management-System
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the JSON Server API
In your terminal, start the dummy REST API on port `3000`:
```bash
npm run server
```
The API endpoints will be accessible at:
- **Products**: `http://localhost:3000/products`

### 5. Run the Angular Frontend
In another terminal, start the Angular development server:
```bash
npm start
```
Navigate to **`http://localhost:4200`** in your browser. The application will automatically reload if you modify any source files.

---

## 🔌 API Endpoints (JSON Server)

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/products` | Retrieve all inventory products |
| `GET` | `/products/:id` | Retrieve single product by ID |
| `POST` | `/products` | Create a new product |
| `PUT` | `/products/:id` | Update an existing product |
| `DELETE` | `/products/:id` | Delete a product from inventory |

---

## 📁 Project Structure

```
Product-Management-System/
├── products.json                       # JSON Server dummy database
├── package.json                        # NPM scripts and dependencies
├── angular.json                        # Angular CLI configuration
├── src/
│   ├── index.html                      # App HTML entry
│   ├── styles.css                      # Global design system & theme tokens
│   ├── main.ts                         # Application bootstrap
│   └── app/
│       ├── app.routes.ts               # Routing definitions
│       ├── app.config.ts               # Application providers (HttpClient, Router)
│       ├── app.component.ts/.html/.css # Global header, navigation & footer
│       ├── models/
│       │   └── product.model.ts        # Product interface
│       ├── services/
│       │   ├── product.service.ts      # HTTP CRUD service + Subject communication
│       │   └── notification.service.ts # SweetAlert2 toasts & delete confirmation
│       └── components/
│           ├── product-list/           # Catalog grid/table, metrics & filters
│           ├── create-product/         # Reactive creation form + live preview
│           ├── view-product/           # Detail showcase & specifications
│           └── edit-product/           # Pre-populated reactive edit form
```

---

## 📜 Available Scripts

- `npm start` — Runs the Angular development server on `http://localhost:4200/`
- `npm run server` — Runs the JSON Server on `http://localhost:3000/`
- `npm run build` — Compiles the application for production in `dist/`

---

## 👩‍💻 Author

**Aiswarya Manoj**  
- GitHub: [@AiswaryaManoj06](https://github.com/AiswaryaManoj06)

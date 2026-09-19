# 🛒 Full-Stack E-Commerce Platform

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Laravel](https://img.shields.io/badge/laravel-%23FF2D20.svg?style=for-the-badge&logo=laravel&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

A comprehensive, real-world Single Page Application (SPA) e-commerce solution built with a decoupled architecture. This platform delivers a seamless, interactive shopping experience on the frontend and a powerful, secure management system on the backend.

## ✨ Key Features

### 🛍️ User Experience (Frontend)
- **Modern SPA Interface:** Built with React and styled with Tailwind CSS for a fully responsive, pixel-perfect design across all devices.
- **Advanced State Management:** Utilizes React Context API for instant, seamless updates to the Shopping Cart and Wishlist.
- **Optimistic UI & Interactions:** Features smooth page transitions, interactive "add-to-cart" animations (via Framer Motion), and dynamic Facebook-style product reactions (👍, ❤️, 😮, 😂, 😢).
- **Secure Authentication:** JWT-based authentication system for user login, registration, and profile management.
- **Real-time Product Reviews & Ratings:** Customers can leave reviews, rate products, and interact with the platform seamlessly.

### 🛡️ Admin Dashboard (Backend)
- **Role-Based Access Control (RBAC):** Secure admin panel restricted to authorized personnel, with underlying support for future Multi-Vendor scaling.
- **Catalog Management:** Full CRUD capabilities for Products, Categories, and Inventory management.
- **Order Processing:** Advanced order management system including status updates (Pending, Processing, Shipped, Completed) and customer invoice generation.
- **Marketing Tools:** Dynamic Coupon and Discount system with usage limits, minimum order values, and validity dates.
- **Dynamic System Settings:** Admins can update store contact details, shipping fees, and social links directly from the UI without touching the codebase.

## 🛠️ Tech Stack

### Frontend
* **Core:** React.js, Vite
* **Styling:** Tailwind CSS, Framer Motion (Animations), Lucide React (Icons)
* **Routing & State:** React Router DOM, Context API
* **Data Fetching:** Axios (with Interceptors for Auth tokens)

### Backend
* **Core:** Laravel (RESTful API Architecture)
* **Database:** MySQL
* **Authentication:** Laravel Sanctum (JWT/Token-based)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
* PHP (>= 8.1)
* Composer
* Node.js (>= 18.x)
* MySQL

### 1. Backend Setup (Laravel)
```bash
# Navigate to the backend directory
cd backend

# Install PHP dependencies
composer install

# Copy environment variables
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database credentials in the .env file, then run migrations:
php artisan migrate

# Link storage (for product images)
php artisan storage:link

# Start the Laravel development server (runs on port 8000)
php artisan serve
```

### 2. Frontend Setup (React)
```bash
# Navigate to the frontend directory
cd frontend

# Install Node modules
npm install

# Start the Vite development server
npm run dev
```

## 🤝 Future Roadmap
- [ ] Integration with Stripe/Paypal Payment Gateways.
- [ ] Multi-language support (i18n) for Arabic and English.
- [ ] Full Multi-Vendor Marketplace activation.

## 📝 License
Distributed under the MIT License.

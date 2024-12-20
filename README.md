# Wroom - Food Delivery Platform 🚴🍔

**Wroom** is a full-stack web application for food delivery, developed as part of my Web Development exam, built with **Next.js**, **MongoDB**, **Prisma**, **shadcn/ui** and **TailwindCSS**. It provides separate functionalities for restaurants, partners (couriers), customers, and admins. The platform is inspired by services like Wolt, allowing users to manage orders efficiently while providing seamless delivery experiences.

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, shadcn/ui, TailwindCSS
- **Backend:** Next.js API routes, Prisma ORM
- **Database:** MongoDB (Atlas)
- **Authentication:** NextAuth.js with JWT
- **Email Services:** Nodemailer
- **Mapping:** Google Maps API for geocoding, routes, and distance calculations
- **Image Storage:** AWS S3 Bucket
- **Deployment:** Vercel

## 🚀 Features

### Universal Features

- **Authentication:** Secure signup, login, e-mail verification, forgot password, and reset password workflows.
- **Profile Management:** Edit and delete profiles (soft delete).
- **Role-Based Access Control:** Separate dashboards and API endpoints for restaurants, couriers, customers, and admins.

### Customer Features

- Browse all restaurants and their items.
- Search for restaurants or items.
- Add items to the cart and place orders (no payment integration).
- View order status and overview.
- View order history.

### Restaurant Features

- Add, edit, and delete menu items (including image uploads).
- Manage orders and track delivery status.

### Partner (Courier) Features

- Accept, manage, and complete deliveries.
- View routes for pickup and delivery using Google Maps.

### Admin Features

- Manage all users, restaurants, and items.
- Block/unblock users or items (with e-mail notifications).

## 🌐 Live Demo

The project is online at [wroom.steffen.codes](https://wroom.steffen.codes/ "wroom.steffen.codes").

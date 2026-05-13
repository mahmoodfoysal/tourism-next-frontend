# Aura Tour - A Tourism Website

A full-stack tourism website featuring Redux state management, Firebase auth, and a robust admin dashboard.

## Live Demo

- Live URL: [https://aura-tour.netlify.app/](https://aura-tour.netlify.app/)

## Repository

- GitHub Client: [https://github.com/mahmoodfoysal/tourism-next-frontend](https://github.com/mahmoodfoysal/tourism-next-frontend)
-
- GitHub Backend: [https://github.com/mahmoodfoysal/aura-tour-backend](https://github.com/mahmoodfoysal/aura-tour-backend)

## Technologies Used

- Next.js
- Redux
- Firebase
- Node.js
- Express.js
- MongoDB
- Tailwind CSS
- Daisy UI
- ApexCharts

## Key Features

- Advanced filtering (Category, Price, Duration) and sorting
- Secure Admin & Super Admin dashboard for total site control
- Dynamic product details with reviews and ratings
- Customer Profile Section
- Product Review Section
- Booking Management Section
- Cupon code system
- Blog Section
- Gallery Section
- Contact Section
- Dashboard Overview
- Why Choose Us Section
- Customer Review Section
- Why Choose Us Section
- FAQ Section
- Coupon Claim Section
- Coupon show in client profile and that coupon only used one user one time. and show total used coupon.
- New member get 10% off coupon if they claim from landing page newsletter.

## Protected Routes

- Dashboard
- Checkout
- Profile
- Booking History

## Public routes

- Home
- Tour Package
- Tour Package Details
- Popular Destinations
- Blogs
- Gallery
- Contact
- Why Choose Us
- Customer Review
- FAQ
- Coupon Claim

## Short Description

- Navbar: switching routing and user information
- Landing Page: A attractive standard landing page for the tourism website. Where customer can see popular destinations, Featured tour packages, Blogs, Offers, Coupon codes, services
- Tour Package Page: This page show all tour packages. Here category, price and search filter.
- Tour Package Details Page: This page show specific tour package details. Related products also show in the bottom.
- Customer Authentication: Secure login and registration using Firebase authentication.
- Booking Management: Track and manage bookings with detailed status updates.
- Customer Profile: View and edit profile information with booking history.
- Blog System: Read and interact with blog posts.
- Blog Details Page: This page show specific blog details. In the bottom show related blog
- Dashboard Overview: Get insights into sales, orders, add products, add categories add coupon, add admin, add blog.
- Pagination: It add where many data comes.
- Products, category, blogs all have a status. If status 1 then only product show. If 0 then product is inactive.
- Footer have full functional. Footer email address use for promotional massage.
- Customer profile customer can update info and see his coupon.
- New member get 10% off coupon if they claim from landing page newsletter and if they already registered then they can claim from their profile. after claim they can not claim again.

## Setup and Installation

### 1) Clone the repository

```terminal
git clone https://github.com/mahmoodfoysal/tourism-next-frontend.git
cd tourism-next-frontend
```

### 2) Install dependencies

```terminal
npm install
```

### 3) Configure environment variables

Create a `.env.local` file in the root directory and add:

```env

NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

```

Do not commit `.env.local` to version control.

### 4) Run the development server

```terminal
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5) Build for production

```terminal
npm run build
```

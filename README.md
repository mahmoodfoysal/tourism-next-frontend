# Aura Tour - A Tourism Website

A full-stack tourism website. This website tourbooking, gathering information and see blogs. Here a dashboard for admin control. Dashboard menu are accessable role basis. Using redux state management. Authentication system using firebase authentication. User auto logout after 10 days and expire his login token.

## Live Demo

- Live URL: [https://aura-tour.netlify.app/](https://aura-tour.netlify.app/)

## Repository

- GitHub Client: [https://github.com/mahmoodfoysal/tourism-next-frontend](https://github.com/mahmoodfoysal/tourism-next-frontend)
-
- GitHub Backend: [https://github.com/mahmoodfoysal/aura-tour-backend](https://github.com/mahmoodfoysal/aura-tour-backend)

## Technologies Used

- TypeScript
- Next.js
- Redux Toolkit
- Firebase
- Node.js
- Express.js
- MongoDB
- Tailwind CSS
- Daisy UI
- ApexCharts
- Gemini AI for description and chat feature.

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
- FAQ Section and also ai description generate section.
- Coupon Claim Section
- Coupon show in client profile and that coupon only used one user one time. and show total used coupon.
- New member get 10% off coupon if they claim from landing page newsletter.
- Booking status section
- After complete tour give review and rating system.
- See tour guide profile.
- See coupon and Hostory

## Protected Routes

- Dashboard
- Booking
- Profile
- Booking History

## Public routes

- Home
- Tour Package
- Tour Package Details
- Popular Destinations
- Blogs
- Story
- Tour Guide
- Gallery
- Contact
- Why Choose Us
- Customer Review
- FAQ
- Coupon Claim
- Using all AI features

## Short Description

- Navbar: Here define all routes and user menu. After login user menu come. If click user menu show dropdown list. In dropdown have profile, dashboard, logout. Admin dashboard route show only admin. When Admin go to dashboard client NavBar and footer hide autometically. then show only dashboard.
- Landing Page: A attractive standard landing page for the tourism website. Here Where customer can see popular destinations, Featured tour packages, Blogs, Offers, Coupon codes, services, AI generate descript and AI chat
- Tour Package Page: This page show all tour packages. Here show features, package details price, basic information also here filter user can see applying filters and sorting options and pagination.
- Tour Package Details Page: This page show specific tour package details. Here client can see all the includes facilitis
- Customer Authentication: Secure login and registration using Firebase authentication and JWT token for stay login. After 10 days later token will expire and set auto logout.
- Booking History: After successful booking user can see his booking history. And user can cancel his booking if the status is not confirmed..
- Customer Profile: View and edit profile information, update password and see his coupon.
- Blog System: Read and interact with blog posts.
- Blog Details Page: This page show specific blog details. In the bottom show related blog
- Dashboard Overview: Get insights into sales, booking, active pending booking and total booking revinue.
- Pagination: It add where many data comes.
- Footer have full functional.
- New member get 10% off coupon if they claim from landing page newsletter and if they already registered then they can claim from their profile. after claim they can not claim again.
- Tour photo can see from story and photo galary.
- Using Ai Itinerary generator where give full tour plan.
- AI chat bot for customer help where client ask any question.
- Total Used coupon count system. If user give coupon then.
- Tour guide profile and details.
- Role base dashboard access.

## note: If you need admin dashboard credentials. Please contact with me.

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

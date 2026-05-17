# Aura Trip - A Tourism Website

A full-stack tourism website. This website is for tour booking, gathering information, and seeing blogs. Here is a dashboard for admin control. Dashboard menu are accessable role basis. Using redux state management. Authentication system using Firebase Authentication. User auto logout after 10 days and expires his login token.

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
- Coupon code system
- Blog Section
- Gallery Section
- Contact Section
- Dashboard Overview
- Why Choose Us Section
- Customer Review Section
- FAQ Section and also the AI description generation section.
- Coupon Claim Section
- Coupon shows in the client profile, and that coupon can only be used once by one user one time. and show the total used coupon.
- New members get 10% off coupon if they claim from the landing page newsletter.
- Booking status section
- After completing the tour, give a review and rating system.
- See tour guide profile.
- See the coupon and the history

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

- Navbar: Here define all routes and the user menu. After login user menu comes. If you click the user menu show dropdown list. In the dropdown have profile, dashboard, and logout. Admin dashboard route shows only admin. When Admin goes to the dashboard, the client's NavBar and footer hide automatically. Then show only the dashboard.
- Landing Page: An attractive standard landing page for the tourism website. Here, Where customer can see popular destinations, Featured tour packages, Blogs, Offers, Coupon codes, services, AI generate descript, and AI chat
- Tour Package Page: This page shows all tour packages. Here show features, package details, price, basic information, also here filter user can see applying filters, sorting options, and pagination.
- Tour Package Details Page: This page shows specific tour package details. Here, the client can see all the includes facilitis
- Customer Authentication: Secure login and registration using Firebase authentication and JWT token for stay login. After 10 days later token will expire and set the auto logout.
- Booking History: After a successful booking, the user can see their booking history. And the user can cancel their booking if the status is not confirmed.
- Customer Profile: View and edit profile information, update password, and see their coupon.
- Blog System: Read and interact with blog posts.
- Blog Details Page: This page shows specific blog details. At the bottom, show the related blog
- Dashboard Overview: Get insights into sales, bookings, active pending bookings, and total booking revenue.
- Pagination: It add where many data comes.
- The footer has full functionality.
- New member get 10% off coupon if they claim from the landing page newsletter, and if they have already registered, then they can claim from their profile. After a claim, they can not claim again.
- The tour photo can be seen from the story and the photo gallery.
- Using Ai Itinerary generator, where give full tour plan.
- AI chatbot for customer help, where the client can ask any question.
- Total Used coupon count system. If the user gives a coupon, then.
- Tour guide profile and details.
- Role-based dashboard access.

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

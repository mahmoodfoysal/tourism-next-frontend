# Aura Trip - A Tourism Website

Aura Trip is a scalable, user-centric web platform designed to streamline the discovery, planning, and execution of leisure travel. Rather than treating travel as fragmented steps, the application unifies the entire tourism lifecycle—from initial destination browsing and guide evaluation to post-journey evaluation—into a seamless digital experience. Architecturally, the platform features a clear separation of concerns, providing a rich, highly responsive client interface for travelers and a robust, data-driven back-office command center for operators. The result is a secure, reliable, and highly stable digital marketplace that minimizes the operational friction of tour management.

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

- Engineered a centralized administrative command center to efficiently streamline tourist management, real-time spot bookings, and global marketplace operations.

- Designed an intuitive client portal that enables users to seamlessly reserve spots and track their real-time booking history.

- Implemented a secure administrative interface providing operators with full lifecycle booking management and real-time access to user profile metrics.

- Aggregates booking trends and community metrics to dynamically surface high-demand travel hubs—eliminating decision fatigue and guiding users straight to top-rated experiences.

- A transparent profiling engine that explicitly maps vetted local experts to their precise geographic regions and specific service tiers, ensuring total user trust before checkout.

- A fully integrated, high-performance travel blog designed to boost onsite retention, deliver expert insider strategies, and seamlessly bridge editorial content with direct spot booking funnels.

- Integrated an automated Receipt Generation System that instantaneously computes pricing metrics, coupon applications, and breakdowns into an immutable, print-ready digital invoice.

- Advanced AI integration that delivers intelligent, context-aware spot recommendations and procedural guidance, ensuring travelers receive personalized trip planning assistance.

- Real-Time Chat for instantaneous customer assistance and prompt resolution of queries and concerns.

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

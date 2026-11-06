# 💰 PennyPal

<p align="center">
  <img src="./public/Screenshot 2026-07-29 220347.png" alt="PennyPal Logo" width="120"/>
</p>

<p align="center">
  <b>Your AI-Powered Personal Finance Assistant</b><br/>
  Track expenses, manage accounts, scan receipts, and gain intelligent financial insights—all in one place.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react"/>
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma"/>
  <img src="https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql"/>
  <img src="https://img.shields.io/badge/Clerk-Authentication-6C47FF"/>
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4"/>
  <img src="https://img.shields.io/badge/Inngest-Background_Jobs-000000"/>
  <img src="https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel"/>
</p>

---

## 🌐 Live Demo

🔗 **https://penny-pal-sooty.vercel.app**

---

## 📖 About

Managing personal finances shouldn't be complicated.

**PennyPal** is an AI-powered personal finance management platform that helps users track expenses, manage multiple accounts, monitor spending habits, and receive intelligent financial insights.

Built with modern web technologies, PennyPal combines automation, AI, and data visualization to make personal finance simpler and more accessible.

---

## ✨ Features

### 💳 Multi-Account Management

- Create and manage multiple accounts.
- Support for different account types.
- Default account selection.
- Automatic balance updates.

### 💸 Expense & Income Tracking

- Add, edit, and manage transactions.
- Categorize expenses and income.
- Track income sources.
- Automatic account balance calculations.
- Support for recurring transactions.

### 📄 AI Receipt Scanner

Upload a receipt and let AI extract:

- Merchant name.
- Transaction amount.
- Date.
- Category.

Reduce manual data entry with AI-powered receipt processing.

### 🤖 AI Financial Insights

Powered by **Google Gemini**.

Get intelligent insights about:

- Spending patterns.
- Budget analysis.
- Financial trends.
- Personalized recommendations.

### 📊 Dashboard Analytics

Visualize your financial activity through:

- Transaction summaries.
- Account balances.
- Spending trends.
- Category-wise breakdowns.
- Financial overviews.

### 🔐 Secure Authentication

Authentication powered by **Clerk**.

- Secure sign-up and login.
- Session management.
- Protected application routes.
- Authenticated server-side operations.

### ⚡ Background Jobs

Powered by **Inngest**.

- Automated workflows.
- Scheduled processing.
- Asynchronous task execution.
- Email automation.

### 📧 Email Notifications

Powered by **Resend**.

PennyPal supports automated email notifications, including:

- Monthly financial reports.
- Budget summaries.
- Important account notifications.
- AI-generated financial insights.

> **Note:** The live demo uses the Resend Free Plan. Due to its testing restrictions, emails can only be delivered to verified email addresses unless a custom domain is configured.

To enable email functionality in your own deployment:

1. Create a Resend account.
2. Generate an API key.
3. Verify your email address or configure a custom domain.
4. Add your `RESEND_API_KEY` to the environment variables.

### 🛡️ Rate Limiting & API Protection

Implemented using **Arcjet**.

- Protects application endpoints against abuse.
- Implements token bucket rate limiting.
- Adds an additional layer of API security.

---

## 🛠️ Recent Improvements & Updates

PennyPal has undergone several improvements to enhance reliability, security, compatibility, and user experience.

### UI & User Experience

- Redesigned the application interface with a cleaner, more professional dark theme.
- Improved dashboard and application layouts.
- Refined the overall user experience while preserving existing backend functionality.

### Backend & Database

- Improved transaction creation and update validation.
- Fixed a transaction amount type mismatch between frontend form data and backend Zod validation.
- Improved transaction data handling and server-side validation.
- Verified PostgreSQL database connectivity and core table availability through Prisma.

### Next.js Compatibility

- Fixed Next.js 15 asynchronous `searchParams` handling.
- Added dynamic rendering to authenticated pages that depend on request-time data.
- Updated transaction creation page handling to support asynchronous route parameters.

### Security & API Improvements

- Removed the public database seeding endpoint to prevent unauthorized access.
- Refactored email functionality into a dedicated server-side utility.
- Updated Arcjet to a stable release for API protection and rate limiting.

### Infrastructure & Reliability

- Added a health-check endpoint for deployment monitoring.
- Configured periodic health checks using UptimeRobot.
- Improved production build compatibility and deployment reliability.

### Bug Fixes

- Fixed transaction creation validation failures.
- Resolved local database connectivity issues caused by an inactive Supabase project.
- Addressed Next.js 15 dynamic API compatibility warnings.

---

## 🏗️ Tech Stack

### Frontend

- Next.js 15
- React 19
- Tailwind CSS
- Shadcn UI
- Framer Motion

### Backend

- Next.js Server Actions
- Prisma ORM
- PostgreSQL

### Authentication

- Clerk

### AI

- Google Gemini

### Background Jobs

- Inngest

### Emails

- Resend

### Security

- Arcjet

### Deployment & Monitoring

- Vercel
- UptimeRobot

---

## 📂 Project Structure

```text
app/
├── (auth)/
├── (main)/
├── api/
├── lib/
└── ...

actions/
components/
data/
hooks/
lib/
prisma/
public/
```

---

## 🚀 Getting Started

Follow these steps to run PennyPal locally.

### 1. Clone the Repository

```bash
git clone https://github.com/AnikKapat/ai-finance-tracker.git

cd ai-finance-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory.

Add the following environment variables:

```env
# Database
DATABASE_URL=
DIRECT_URL=

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Google Gemini
GEMINI_API_KEY=

# Resend
RESEND_API_KEY=

# Arcjet
ARCJET_KEY=
```

**Important:**
- Configure your own PostgreSQL database.
- Use the appropriate connection strings for `DATABASE_URL` and `DIRECT_URL`.
- Obtain your own Clerk, Gemini, Resend, and Arcjet credentials.
- Never commit your `.env` file or expose secret keys publicly.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Apply Database Migrations

```bash
npx prisma migrate deploy
```

Ensure your PostgreSQL database is configured correctly before running migrations.

### 6. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Create a Production Build

```bash
npm run build
```

---

## 🔒 Security

PennyPal incorporates multiple security measures:

- **Clerk Authentication:** Secure user authentication and session management.
- **Protected Server Actions:** Authentication checks for sensitive backend operations.
- **Arcjet:** API protection and rate limiting.
- **Environment Variables:** Sensitive credentials are kept outside the source code.
- **Database Access:** PostgreSQL operations are handled through Prisma.
- **Removed Public Seed Endpoint:** Prevents unauthorized database seeding through a public route.

---

## 📈 Future Roadmap

Planned features and improvements:

- Investment portfolio tracking.
- Enhanced savings goals.
- Advanced budget planning.
- Multi-currency support.
- Bank API integration.
- AI-powered chat assistant.
- Mobile application.
- Dark/Light theme toggle.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/my-feature
```

3. Commit your changes:

```bash
git commit -m "Add new feature"
```

4. Push your branch:

```bash
git push origin feature/my-feature
```

5. Open a Pull Request.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Developer

### Anik Kapat

Electronics & Communication Engineering  
Haldia Institute of Technology

**GitHub:**  
https://github.com/AnikKapat

---

<p align="center">
  ⭐ If you found this project helpful, consider giving it a star!
  <br/><br/>
  Made with ❤️ using Next.js, AI and a lot of ☕.
</p>

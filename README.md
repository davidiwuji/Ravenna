# Ravenna - Personal Finance Tracker

A modern, professional-grade personal finance tracker built with Next.js 14, Supabase, and Tailwind CSS v4. Features a premium dark-mode-first UI with purple/blue gradients and smooth animations.

## Features

✨ **Premium UI/UX** - Modern design with glassmorphism effects and smooth animations
📊 **Asset Management** - Track cash, investments, property, and other assets
💳 **Liability Tracking** - Manage loans, credit cards, and debts with interest rates
💰 **Expense Tracking** - Log daily expenses with category breakdowns
📈 **Investment Portfolio** - Monitor your investment holdings
📊 **Trading Journal** - Track trades with P&L analysis and win rate calculations
💎 **Net Worth Calculator** - Real-time net worth tracking with visual breakdowns
🔐 **Secure Authentication** - Supabase-powered auth with row-level security
🌓 **Dark/Light Mode** - Premium dark theme with light mode support
🚫 **No Sample Data** - Clean start with elegant empty states

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (Radix UI)
- **Fonts**: Geist Sans & Geist Mono
- **Analytics**: Vercel Analytics

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Supabase account and project

## Setup Instructions

### 1. Clone and Install

```bash
cd ravenna
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your `Project URL` and `anon/public` key

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Set up Database

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the sidebar
3. Open and run the `scripts/01-create-tables.sql` file
   - This will create all tables, RLS policies, and triggers
   - **NO seed data is included** - tables will be empty

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Create an Account

1. Navigate to `/auth/signup`
2. Create your account with email and password
3. Start tracking your finances!

## Project Structure

```
ravenna/
├── app/                      # Next.js app directory
│   ├── auth/                 # Authentication pages
│   ├── assets/               # Assets management
│   ├── liabilities/          # Liabilities tracking
│   ├── expenses/             # Expense tracking
│   ├── investments/          # Investment portfolio
│   ├── trading/              # Trading journal
│   ├── net-worth/            # Net worth calculator
│   ├── settings/             # User settings
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Dashboard
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   ├── sidebar-nav.tsx       # Navigation sidebar
│   ├── auth-button.tsx       # Auth UI
│   ├── main-layout.tsx       # Layout wrapper
│   ├── mode-toggle.tsx       # Theme toggle
│   └── theme-provider.tsx    # Theme context
├── lib/                      # Utilities
│   ├── supabase/             # Supabase clients
│   └── utils.ts              # Helper functions
├── scripts/                  # Database scripts
│   └── 01-create-tables.sql  # Schema (no seed data)
└── package.json              # Dependencies
```

## Database Schema

- **user_profiles** - User profile information
- **assets** - Assets (cash, investments, property)
- **liabilities** - Debts and loans
- **expenses** - Daily spending transactions
- **trades** - Trading journal entries

All tables have Row Level Security (RLS) enabled, ensuring users can only access their own data.

## Design System

The application features a premium purple/blue gradient theme with:
- **Primary**: Purple (#5D4B9C - oklch(0.55 0.22 260))
- **Accent**: Blue-Purple (#9C70E0 - oklch(0.70 0.20 270))
- **Dark Mode**: Optimized for dark-first experience
- **Glassmorphism**: Subtle backdrop blur effects
- **Smooth Animations**: Fade-in and slide-in transitions

## Key Features Detail

### Dashboard
- Financial overview with summary cards
- Real-time net worth calculation
- Recent expenses and trades
- Empty states for new users

### Assets & Liabilities
- CRUD operations for all financial items
- Type categorization
- Interest rate tracking for liabilities
- Due date management

### Expenses
- Monthly expense tracking
- Category-based organization
- Top categories analysis
- Transaction history

### Trading Journal
- Trade entry and exit tracking
- P&L calculation
- Win rate analysis
- Performance metrics

### Net Worth
- Real-time calculation
- Assets vs liabilities breakdown
- Visual progress indicators

## Contributing

This is a personal finance tracker. Feel free to fork and customize for your needs!

## License

MIT

---

Built with ❤️ using Next.js and Supabase

# Admin User Setup Guide

This guide walks you through creating an admin test user with sample data.

## Step 1: Run Database Schema

First, ensure you've run the main database schema:

1. Go to your Supabase dashboard: https://hnayvrmumoqommdwmowp.supabase.co
2. Click **SQL Editor** in the sidebar
3. Copy and paste the contents of `scripts/01-create-tables.sql`
4. Click **Run** to execute

## Step 2: Create Admin User Account

You have two options:

### Option A: Sign Up Through the App (Recommended)

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to: http://localhost:3000/auth/signup

3. Sign up with:
   - **Full Name**: Admin User
   - **Email**: admin@ravenna.local
   - **Password**: admin123

### Option B: Create Directly in Supabase Dashboard

1. Go to **Authentication** > **Users** in your Supabase dashboard
2. Click **Add User** > **Create new user**
3. Enter:
   - **Email**: admin@ravenna.local
   - **Password**: admin123
   - **Auto Confirm User**: Yes (check this box)
4. Click **Create user**

## Step 3: Add Sample Data

Once the user is created:

1. Go back to **SQL Editor** in Supabase
2. Copy and paste the contents of `scripts/02-create-admin-user.sql`
3. Click **Run** to execute

This will add:
- ✅ **7 Assets** (Savings, Checking, Stocks, Bitcoin, Real Estate, 401k)
- ✅ **4 Liabilities** (Mortgage, Car Loan, Credit Card, Student Loan)
- ✅ **20 Expenses** (Recent transactions across categories)
- ✅ **7 Trades** (Stock trading history with P&L)

## Step 4: Login and Explore

1. Go to: http://localhost:3000/auth/login
2. Login with:
   - **Email**: admin@ravenna.local
   - **Password**: admin123

3. You should now see:
   - Dashboard with financial overview
   - Net worth calculation
   - Recent transactions
   - All sample data populated

## What Sample Data is Included

### Assets ($508,500)
- Savings & Checking accounts
- Stock portfolio (TSLA, AAPL)
- Cryptocurrency (Bitcoin)
- Real estate property
- Retirement account

### Liabilities ($309,500)
- Home mortgage
- Car loan
- Credit card balance
- Student loan

### Net Worth: ~$199,000

### Monthly Expenses
- Food & Groceries
- Transportation
- Utilities
- Entertainment
- Other miscellaneous

### Trading Journal
- Multiple stock trades
- Win/loss tracking
- P&L calculations

## Troubleshooting

**If sample data doesn't appear:**
1. Check that you ran the schema script first
2. Verify the user was created successfully
3. Make sure you're logged in with the correct email
4. Check the Supabase SQL Editor output for errors

**If you get authentication errors:**
1. Clear browser cache and cookies
2. Try incognito/private browsing mode
3. Check your `.env.local` file has the correct credentials

---

**Note**: This is test data for development purposes only. You can delete this admin user and data anytime from the Supabase dashboard.

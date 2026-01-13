-- Create Admin User with Sample Data
-- Run this AFTER running 01-create-tables.sql

-- Step 1: Create the admin user in Supabase Auth
-- Note: In Supabase, you need to do this via the Dashboard or use the auth.users table
-- This creates a user profile entry that will be linked when the user signs up

-- For Supabase, you'll need to sign up manually with:
-- Email: admin@ravenna.local
-- Password: admin123

-- Then, get the user_id from the auth.users table and replace 'YOUR_USER_ID_HERE' below
-- Or run this after signing up to get the ID:
-- SELECT id FROM auth.users WHERE email = 'admin@ravenna.local';

-- IMPORTANT: Replace 'YOUR_USER_ID_HERE' with the actual UUID after creating the user
-- You can get it by signing up first, then running: SELECT id FROM auth.users WHERE email = 'admin@ravenna.local';

DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get the admin user ID (you must create the user first via signup)
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@ravenna.local';
    
    IF admin_user_id IS NULL THEN
        RAISE NOTICE 'Admin user not found. Please sign up with email: admin@ravenna.local and password: admin123 first!';
    ELSE
        -- Insert sample assets
        INSERT INTO assets (user_id, name, type, value, description) VALUES
        (admin_user_id, 'Savings Account', 'cash', 15000.00, 'Primary savings account'),
        (admin_user_id, 'Checking Account', 'cash', 3500.00, 'Daily expenses account'),
        (admin_user_id, 'Tesla Stock', 'investment', 25000.00, '100 shares of TSLA'),
        (admin_user_id, 'Apple Stock', 'investment', 18000.00, '150 shares of AAPL'),
        (admin_user_id, 'Bitcoin', 'investment', 12000.00, '0.5 BTC'),
        (admin_user_id, 'Real Estate', 'property', 350000.00, 'Rental property investment'),
        (admin_user_id, 'Retirement 401k', 'investment', 85000.00, 'Company 401k plan');

        -- Insert sample liabilities
        INSERT INTO liabilities (user_id, name, type, amount, interest_rate, due_date, description) VALUES
        (admin_user_id, 'Mortgage', 'mortgage', 280000.00, 3.5, '2045-12-31', 'Home mortgage'),
        (admin_user_id, 'Car Loan', 'loan', 15000.00, 4.2, '2027-06-30', 'Tesla Model 3 loan'),
        (admin_user_id, 'Credit Card', 'credit_card', 2500.00, 18.9, '2026-02-15', 'Main credit card'),
        (admin_user_id, 'Student Loan', 'loan', 12000.00, 5.5, '2030-12-31', 'Graduate school loan');

        -- Insert sample expenses (last 30 days)
        INSERT INTO expenses (user_id, description, amount, category, date) VALUES
        (admin_user_id, 'Grocery shopping at Whole Foods', 156.32, 'food', CURRENT_DATE - INTERVAL '2 days'),
        (admin_user_id, 'Gas station fill-up', 65.00, 'transport', CURRENT_DATE - INTERVAL '3 days'),
        (admin_user_id, 'Netflix subscription', 15.99, 'entertainment', CURRENT_DATE - INTERVAL '5 days'),
        (admin_user_id, 'Dinner at Italian restaurant', 89.50, 'food', CURRENT_DATE - INTERVAL '6 days'),
        (admin_user_id, 'Electricity bill', 124.00, 'utilities', CURRENT_DATE - INTERVAL '7 days'),
        (admin_user_id, 'Gym membership', 45.00, 'other', CURRENT_DATE - INTERVAL '8 days'),
        (admin_user_id, 'Coffee shop', 12.50, 'food', CURRENT_DATE - INTERVAL '9 days'),
        (admin_user_id, 'Amazon shopping', 78.99, 'other', CURRENT_DATE - INTERVAL '10 days'),
        (admin_user_id, 'Uber ride', 23.50, 'transport', CURRENT_DATE - INTERVAL '11 days'),
        (admin_user_id, 'Spotify premium', 9.99, 'entertainment', CURRENT_DATE - INTERVAL '12 days'),
        (admin_user_id, 'Lunch at cafe', 18.75, 'food', CURRENT_DATE - INTERVAL '13 days'),
        (admin_user_id, 'Grocery shopping', 134.22, 'food', CURRENT_DATE - INTERVAL '15 days'),
        (admin_user_id, 'Gas station', 58.00, 'transport', CURRENT_DATE - INTERVAL '16 days'),
        (admin_user_id, 'Movie tickets', 32.00, 'entertainment', CURRENT_DATE - INTERVAL '18 days'),
        (admin_user_id, 'Water bill', 45.00, 'utilities', CURRENT_DATE - INTERVAL '20 days'),
        (admin_user_id, 'Internet bill', 79.99, 'utilities', CURRENT_DATE - INTERVAL '22 days'),
        (admin_user_id, 'Phone bill', 65.00, 'utilities', CURRENT_DATE - INTERVAL '23 days'),
        (admin_user_id, 'Haircut', 35.00, 'other', CURRENT_DATE - INTERVAL '24 days'),
        (admin_user_id, 'Grocery shopping', 142.18, 'food', CURRENT_DATE - INTERVAL '25 days'),
        (admin_user_id, 'Gas station', 62.00, 'transport', CURRENT_DATE - INTERVAL '27 days');

        -- Insert sample trades
        INSERT INTO trades (user_id, symbol, type, quantity, entry_price, exit_price, profit_loss, trade_date, notes) VALUES
        (admin_user_id, 'AAPL', 'buy', 50, 178.50, 185.20, 335.00, CURRENT_DATE - INTERVAL '30 days', 'Strong earnings expected'),
        (admin_user_id, 'AAPL', 'sell', 50, 185.20, NULL, NULL, CURRENT_DATE - INTERVAL '10 days', 'Took profits after earnings'),
        (admin_user_id, 'TSLA', 'buy', 25, 240.00, 255.00, 375.00, CURRENT_DATE - INTERVAL '45 days', 'Support level bounce'),
        (admin_user_id, 'NVDA', 'buy', 30, 485.00, 510.00, 750.00, CURRENT_DATE - INTERVAL '60 days', 'AI chip demand'),
        (admin_user_id, 'MSFT', 'buy', 40, 380.00, 375.00, -200.00, CURRENT_DATE - INTERVAL '20 days', 'Lost on this trade'),
        (admin_user_id, 'GOOGL', 'buy', 35, 142.00, 148.50, 227.50, CURRENT_DATE - INTERVAL '15 days', 'Ad revenue growth'),
        (admin_user_id, 'META', 'buy', 20, 465.00, NULL, NULL, CURRENT_DATE - INTERVAL '5 days', 'Holding for Q1 earnings');

        RAISE NOTICE 'Successfully created sample data for admin user!';
        RAISE NOTICE 'Total Assets: 7 items';
        RAISE NOTICE 'Total Liabilities: 4 items';
        RAISE NOTICE 'Total Expenses: 20 items';
        RAISE NOTICE 'Total Trades: 7 items';
    END IF;
END $$;

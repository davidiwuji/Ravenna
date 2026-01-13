-- Run this in the Supabase SQL Editor to update your trades table

ALTER TABLE trades 
ADD COLUMN leverage NUMERIC,
ADD COLUMN exchange_rate NUMERIC DEFAULT 1;

COMMENT ON COLUMN trades.leverage IS 'Leverage used for the trade (e.g. 100 for 1:100)';
COMMENT ON COLUMN trades.exchange_rate IS 'Exchange rate from trade currency to account currency (e.g. USD to NGN)';

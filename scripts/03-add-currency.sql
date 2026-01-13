-- Add currency column to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

-- Create policy to allow users to update their own currency
CREATE POLICY "Users can update own currency"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = user_id);

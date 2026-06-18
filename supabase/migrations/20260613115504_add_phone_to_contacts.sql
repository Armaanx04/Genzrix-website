
-- Add phone column to contacts if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contacts' AND column_name = 'phone'
  ) THEN
    ALTER TABLE contacts ADD COLUMN phone text DEFAULT '';
  END IF;
END $$;

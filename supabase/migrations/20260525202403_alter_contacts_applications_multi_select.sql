/*
  # Alter contacts and applications for multi-select support

  1. Changes
    - `contacts.service` (text) → `contacts.services` (text[]) — supports multiple service selections
    - `applications.domain` (text) → `applications.domains` (text[]) — supports multiple domain selections
    - `applications.portfolio_link` renamed to `portfolio_url` for consistency

  2. Security
    - No security changes — existing policies remain valid
*/

-- Alter contacts: drop default, rename, change type, set new default
ALTER TABLE contacts ALTER COLUMN service DROP DEFAULT;
ALTER TABLE contacts RENAME COLUMN service TO services;
ALTER TABLE contacts ALTER COLUMN services TYPE text[] USING ARRAY[services];
ALTER TABLE contacts ALTER COLUMN services SET DEFAULT '{}';

-- Alter applications: drop default, rename, change type, set new default
ALTER TABLE applications ALTER COLUMN domain DROP DEFAULT;
ALTER TABLE applications RENAME COLUMN domain TO domains;
ALTER TABLE applications ALTER COLUMN domains TYPE text[] USING ARRAY[domains];
ALTER TABLE applications ALTER COLUMN domains SET DEFAULT '{}';

-- Rename portfolio_link to portfolio_url
ALTER TABLE applications RENAME COLUMN portfolio_link TO portfolio_url;

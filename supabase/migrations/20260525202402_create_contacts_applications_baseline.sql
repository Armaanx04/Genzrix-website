-- Bootstrap contacts/applications for form submissions (legacy column names).
-- Migrations 20260525202403 and 20260613115504 transform to final frontend schema.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL DEFAULT '',
  service text NOT NULL DEFAULT '',
  message text NOT NULL,
  CONSTRAINT contacts_name_not_blank CHECK (char_length(trim(name)) > 0),
  CONSTRAINT contacts_email_not_blank CHECK (char_length(trim(email)) > 0),
  CONSTRAINT contacts_message_not_blank CHECK (char_length(trim(message)) > 0)
);

CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  domain text NOT NULL DEFAULT '',
  portfolio_link text NOT NULL DEFAULT '',
  why_genzrix text NOT NULL,
  CONSTRAINT applications_name_not_blank CHECK (char_length(trim(name)) > 0),
  CONSTRAINT applications_email_not_blank CHECK (char_length(trim(email)) > 0),
  CONSTRAINT applications_why_not_blank CHECK (char_length(trim(why_genzrix)) > 0)
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY contacts_anon_insert
  ON public.contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY applications_anon_insert
  ON public.applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

GRANT INSERT ON TABLE public.contacts TO anon;
GRANT INSERT ON TABLE public.applications TO anon;

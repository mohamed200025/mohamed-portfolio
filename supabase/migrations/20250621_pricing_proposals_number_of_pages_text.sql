-- Store page range labels as text (e.g. "1–5 Pages"), not integers.

alter table public.pricing_proposals
  add column if not exists number_of_pages text;

alter table public.pricing_proposals
  alter column number_of_pages type text using number_of_pages::text;

notify pgrst, 'reload schema';

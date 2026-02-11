-- Seed data for AI Credit Risk Analyzer (matches schema: clients, applications, etc.)

insert into public.clients (id, name, email)
values
  ('11111111-1111-1111-1111-111111111101'::uuid, 'Alice Ngcobo', 'alice@example.com'),
  ('11111111-1111-1111-1111-111111111102'::uuid, 'Bob Dlamini', 'bob@example.com')
on conflict (id) do update set name = excluded.name, email = excluded.email;

insert into public.applications (id, client_id, product_type, requested_amount, currency, status)
values
  ('22222222-2222-2222-2222-222222222201'::uuid, '11111111-1111-1111-1111-111111111101'::uuid, 'personal_loan', 50000, 'ZAR', 'pending'),
  ('22222222-2222-2222-2222-222222222202'::uuid, '11111111-1111-1111-1111-111111111102'::uuid, 'personal_loan', 25000, 'ZAR', 'pending')
on conflict (id) do update set requested_amount = excluded.requested_amount, status = excluded.status;

-- Optional: one sample model run so Scores page shows a row
insert into public.model_runs (application_id, model_name, pd, lgd, ead)
values
  ('22222222-2222-2222-2222-222222222201'::uuid, 'pd_model_v1', 0.12, 0.45, 50000);

-- Allow contact forms to collect a callback / WhatsApp number.
alter table public.contact_messages
  add column if not exists phone text;

comment on column public.contact_messages.phone is
  'Client phone or WhatsApp number from the contact form.';

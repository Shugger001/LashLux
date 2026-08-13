-- Speed unread inbox counts and filtered reads.
create index if not exists idx_contact_messages_unread
  on public.contact_messages (created_at desc)
  where is_read = false;

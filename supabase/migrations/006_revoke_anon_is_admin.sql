-- Anon does not need RPC access to is_admin(); authenticated still needs
-- EXECUTE so RLS policies that call public.is_admin() keep working.
revoke execute on function public.is_admin() from public;
revoke execute on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

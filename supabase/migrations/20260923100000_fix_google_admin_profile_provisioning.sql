-- Supabase can set email_confirmed_at just after inserting a Google Auth user.
-- The exact-email allowlist plus Google's trusted app_metadata provider is the
-- reliable gate at INSERT time; promote the already-created TechLearn profile.
begin;

create or replace function public.handle_new_auth_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  assigned_role text := 'user';
begin
  if new.raw_app_meta_data ->> 'provider' = 'google'
    and lower(coalesce(new.email, '')) in (
      'techlearnsolutions@gmail.com',
      'chatpateroutes@gmail.com'
    ) then
    assigned_role := 'admin';
  end if;

  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    assigned_role
  )
  on conflict (id) do nothing;

  return new;
end;
$function$;

update public.profiles as profile
set role = 'admin', updated_at = now()
from auth.users as auth_user
where profile.id = auth_user.id
  and lower(auth_user.email) = 'techlearnsolutions@gmail.com'
  and auth_user.email_confirmed_at is not null
  and auth_user.raw_app_meta_data ->> 'provider' = 'google';

commit;

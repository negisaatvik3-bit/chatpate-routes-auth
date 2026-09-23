-- Provision profiles for newly created Supabase Auth users.
-- Only the two explicitly approved, verified Google accounts below receive admin.
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
  if new.email_confirmed_at is not null
    and new.raw_app_meta_data ->> 'provider' = 'google'
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

drop trigger if exists chatpate_create_profile_after_auth_signup on auth.users;

create trigger chatpate_create_profile_after_auth_signup
after insert on auth.users
for each row execute function public.handle_new_auth_profile();

commit;

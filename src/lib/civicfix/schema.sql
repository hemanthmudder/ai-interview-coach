-- Production persistence contract. Apply this to Postgres/Supabase when DATABASE_URL is configured.
create table users (id uuid primary key, identifier text unique not null, identifier_type text not null, name text not null, role text not null default 'citizen', created_at timestamptz not null default now());
create table departments (id text primary key, name text not null, category text unique not null);
create table reports (id uuid primary key, user_id uuid not null references users(id), image_urls text[] not null default '{}', description text not null, category text not null, severity text not null, severity_score integer not null, confidence numeric not null, status text not null default 'Submitted', department_id text not null references departments(id), latitude numeric not null, longitude numeric not null, address text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table notifications (id uuid primary key, user_id uuid not null references users(id), report_id uuid not null references reports(id), title text not null, message text not null, read boolean not null default false, created_at timestamptz not null default now());
create index reports_department_queue on reports(department_id, severity_score desc, created_at asc);
create index reports_user_history on reports(user_id, created_at desc);

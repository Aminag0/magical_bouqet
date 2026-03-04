# One-time Supabase setup (free)

Do this **once** so the share link can save and load your bouquet, card, drawing, and image.

---

## 1. Create a free Supabase project

1. Go to **[supabase.com](https://supabase.com)** and sign up or log in.
2. Click **New project**.
3. Pick a name, password for the DB, and region. Click **Create project** (wait until it’s ready).

---

## 2. Create the `shares` table

1. In the left sidebar, open **SQL Editor**.
2. Click **New query** and paste this exactly:

```sql
create table if not exists public.shares (
  id uuid primary key default gen_random_uuid(),
  theme_color text,
  pattern text,
  card_text text,
  drawing_url text,
  special_image_url text,
  bouquet_data jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Allow anyone to insert (create share) and read by id (view share link)
alter table public.shares enable row level security;

create policy "Allow insert for everyone"
  on public.shares for insert
  with check (true);

create policy "Allow read for everyone"
  on public.shares for select
  using (true);
```

3. Click **Run**. You should see “Success”.

---

## 3. Create the storage bucket (for drawing + image)

1. In the left sidebar, open **Storage**.
2. Click **New bucket**.
3. Name: **`share-assets`**.
4. Turn **Public bucket** ON (so shared links can show images without login).
5. Click **Create bucket**.

Then add a policy so the app can upload:

1. Open the **`share-assets`** bucket.
2. Go to **Policies** (or click the bucket → **New policy**).
3. Add a policy:
   - **Policy name:** `Allow uploads`
   - **Allowed operation:** INSERT (and SELECT if you want to list; not required for viewing).
   - **Target roles:** `anon`.
   - **WITH CHECK expression:** `true` (or `bucket_id = 'share-assets'`).

Or in SQL (Storage policies):

1. Go to **SQL Editor** again and run:

```sql
-- Allow anonymous uploads to share-assets bucket
insert into storage.buckets (id, name, public)
values ('share-assets', 'share-assets', true)
on conflict (id) do update set public = true;

create policy "Allow anon upload to share-assets"
on storage.objects for insert
to anon
with check (bucket_id = 'share-assets');

create policy "Allow public read from share-assets"
on storage.objects for select
to public
using (bucket_id = 'share-assets');
```

---

## 4. Add your keys to the project

1. In Supabase, go to **Project Settings** (gear icon) → **API**.
2. Copy **Project URL**.
3. Copy **anon public** key (under “Project API keys”).
4. Open **`supabase-config.js`** in this project.
5. Replace the placeholders:

- `YOUR_SUPABASE_PROJECT_URL` → your Project URL  
- `YOUR_SUPABASE_ANON_KEY` → your anon public key  

Save the file.

---

## 5. Test

1. Open your app (e.g. `index.html` in the browser or your hosted URL).
2. Make a bouquet, add a card (text and/or drawing), add a “Special Touch” image if you want, then click **All Done**.
3. Click **Copy Secure Share Link**.
4. Open the copied link in a new tab (or send it to a friend). You should see the **ending page** with the same bouquet, card text, drawing, and image.

---

Everything above uses Supabase’s **free tier** (no credit card required). If something doesn’t work, check the browser console (F12 → Console) for errors.

# Supabase setup – step-by-step (after you created the project)

You already have the project. Do these three things in order.

---

## Step 1: Run the SQL (create table + storage policies)

This creates the `shares` table and lets the app upload/read images.

1. **Open the SQL Editor**
   - In the **left sidebar** of your Supabase dashboard, click the **SQL Editor** icon (it looks like `</>` or a terminal/code icon).
   - If you don’t see it, scroll the sidebar – it’s usually under “Project” or near “Table Editor”.

2. **Start a new query**
   - Click **“New query”** (top right of the SQL Editor).

3. **Paste this whole block** (copy everything below, including the first and last line):

```sql
-- Table for share links (bouquet + card + drawing + image)
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

alter table public.shares enable row level security;

create policy "Allow insert for everyone"
  on public.shares for insert
  with check (true);

create policy "Allow read for everyone"
  on public.shares for select
  using (true);

-- Storage bucket and policies (for drawing + special image files)
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

4. **Run it**
   - Click the green **“Run”** button (or press Ctrl+Enter).
   - Wait a few seconds. You should see **“Success. No rows returned”** or similar at the bottom. That’s correct.

5. **Optional check**
   - In the left sidebar, open **Table Editor**. You should see a table named **`shares`**.
   - In the left sidebar, open **Storage**. You should see a bucket named **`share-assets`** (created by the SQL). If you see it, you can skip Step 2 below.

If you get an error: copy the full error message and check that you pasted the entire SQL block and didn’t add extra characters.

---

## Step 2: Create the bucket (only if it’s not there)

If **Storage** already shows a bucket **`share-assets`**, skip this step.

1. In the left sidebar, click **Storage** (folder/cloud icon).

2. Click **“New bucket”**.

3. Fill in:
   - **Name:** `share-assets` (exactly, with the hyphen).
   - **Public bucket:** turn this **ON** (so shared links can show images without login).

4. Click **“Create bucket”**.

5. **Add policy so the app can upload:**
   - Click the **`share-assets`** bucket to open it.
   - Go to the **“Policies”** tab (or “New policy”).
   - Add a policy:
     - Name: `Allow uploads`
     - Operation: **INSERT**
     - Role: **anon**
     - WITH CHECK: `true` or `bucket_id = 'share-assets'`
   - Save.

(If you already ran the full SQL in Step 1, the bucket and policies may already exist, so this is only if the bucket wasn’t created.)

---

## Step 3: Copy your anon key into the project

1. **Open Project Settings**
   - In the **left sidebar**, click the **gear icon** at the bottom (**Project Settings**).

2. **Open the API section**
   - In the settings menu, click **“API”**.

3. **Copy two things** (you’ll use the anon key in the next step):
   - **Project URL** – already in your `supabase-config.js` as  
     `https://kasvgskswfwywybjjcln.supabase.co`
   - **anon public** key – under “Project API keys”, find the row that says **anon** and **public**. Click **Copy** (or the copy icon) next to that long string. It looks like:  
     `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long).

4. **Paste the anon key into your project**
   - Open the file **`supabase-config.js`** in your flower_bouquet project.
   - Find the line:  
     `window.SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';`
   - Replace **`YOUR_SUPABASE_ANON_KEY`** with the long string you just copied. Keep the quotes. Example:
     - Before: `window.SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';`
     - After:  `window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxx...';`

5. **Save the file.**

You don’t need to change the Project URL in `supabase-config.js` – it’s already set to your project.

---

## Step 4: Test the app

1. Open your app (e.g. double‑click **`index.html`** or run it from your editor).
2. Make a bouquet, write/draw on the card, add a “Special Touch” image if you want, then click **“All Done”**.
3. Click **“Copy Secure Share Link”**.
4. Paste the link in a new tab (or send it to a friend). You should see the **same ending page**: bouquet, card, text, drawing, and image.

If something fails, open the browser **Developer Tools** (F12) → **Console** and check for red errors. Those messages will help debug the next step.

---

**Summary:**  
- **Step 1:** SQL Editor → New query → paste SQL → Run.  
- **Step 2:** Storage → New bucket `share-assets` (Public) if it’s not there.  
- **Step 3:** Project Settings → API → copy anon key → paste into `supabase-config.js`.  
- **Step 4:** Use the app and test the share link.

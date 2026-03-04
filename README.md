# 🌸 The Musical Bouquet

A little web app to build a virtual bouquet and card, then share it with someone special — no account needed to play, optional share links so they see exactly what you made.

---

## What it is

I wanted something light and fun to send a “thinking of you” moment: pick a color, drag flowers into a vase, design a card (type or draw), add a photo if you like, and get a link that shows your friend the same bouquet and card. Everything runs in the browser; the share link is optional and uses a free backend so there’s no cost.

---

## ✨ Features

- **Magic Garden** — Choose a theme color and step into the workshop.
- **Flower Shop** — Drag roses, tulips, sunflowers, and blossoms into the vase; they get stems and stay where you drop them.
- **Card Shop** — Pick a pattern (solid, dots, stripes, gingham), then type a message or draw on the card.
- **A Special Touch** — Optional: upload one image (e.g. a photo) that appears next to your card.
- **Share link** — When you’re done, copy a link. Anyone who opens it sees the same ending screen: your bouquet, card text, drawing, and image (no login).

---

## 🚀 Run it locally

1. Clone the repo and open the folder.
2. **Config (so the app loads):**  
   Copy `supabase-config.example.js` to `supabase-config.js`.  
   You can leave the placeholders as-is: the bouquet and card flow works; only “Copy Secure Share Link” needs real keys.
3. Open `index.html` in a browser (or use Live Server in VS Code).

No build step, no `npm install` — just open and use.

---

## 🔗 Optional: enable share links (free)

Share links save your bouquet + card + drawing + image so the link shows the full result. That uses [Supabase](https://supabase.com) (free tier, no credit card).

1. Create a free project at [supabase.com](https://supabase.com).
2. Follow **SUPABASE_SETUP.md** (or **SUPABASE_DETAILED_STEPS.md**) to create the table and storage bucket and get your API URL and anon key.
3. In `supabase-config.js`, set `SUPABASE_URL` and `SUPABASE_ANON_KEY` to your values.

Your keys stay in `supabase-config.js` only; that file is in `.gitignore` and is never committed, so your project stays free and no one else can use your Supabase quota.

---

## Tech

- Plain **HTML**, **CSS**, and **JavaScript** (no framework).
- **Supabase** (PostgreSQL + Storage) for optional share links — free tier only.

---

## How to push this repo to GitHub (safely)

So your **Supabase keys never get uploaded**:

1. **`.gitignore`** is set up to ignore `supabase-config.js`. Don’t remove that file from `.gitignore`.
2. On your machine, keep using your real **supabase-config.js** with your keys. It will stay local only.
3. In the project folder, run:

```bash
git init
git add .
git status
```

Check that **supabase-config.js does not appear** under “Changes to be committed”. If it does, do not commit — fix `.gitignore` so it contains `supabase-config.js` and run `git add .` again.

```bash
git commit -m "Add Musical Bouquet — personal creative project"
```

4. On [GitHub](https://github.com/Aminag0), create a **new repository** (e.g. `flower_bouquet` or `musical-bouquet`). Do **not** add a README, .gitignore, or license (you already have them).
5. Then run (replace `YOUR_USERNAME` and `REPO_NAME` with yours):

```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

After that, only the example config is on GitHub; your real keys stay on your computer. You’ll have no Supabase charges from the repo being public.

---

## License

Use it, change it, share it. Have fun with it.

---

*Made as a personal creative project because I love pink and flowers.*

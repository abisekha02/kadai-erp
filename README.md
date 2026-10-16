# Kadai & Co. – Storefront + Admin ERP

A full-stack e-commerce store with a built-in back-office (ERP) for a South Indian pantry shop.
Customers browse and order; staff manage inventory, fulfil orders, print invoices and restock through purchase orders.

**Live demo:** _add your Vercel URL here_  
**Admin demo:** `/admin` · password: _add your demo password here_

## Features

**Storefront**
- Designed landing page: hero, trust strip, category tiles, story and reviews sections
- Product catalogue with category filters and search, custom-illustrated product artwork (SVG, no image hosting needed)
- Product detail pages, persistent cart (localStorage)
- Checkout (cash on delivery) with server-side validation and order confirmation

**Admin ERP** (`/admin`)
- Dashboard: revenue, order counts, stock value, 7-day sales chart, low-stock alerts
- Inventory: add / edit products, reorder levels, optional photo URL per product, show/hide from store
- Orders: filter by status, move through placed → packed → shipped → delivered, cancel
- Printable invoices
- Purchasing: suppliers, purchase orders, "mark received" adds stock automatically

## Engineering notes (what makes it more than CRUD)

- **Atomic checkout.** `placeOrder` runs in one Postgres transaction: product rows are locked with `SELECT … FOR UPDATE`, prices are re-read from the DB (never trusted from the browser), stock is checked and decremented together. Two buyers can't oversell the last item.
- **Inventory stays consistent.** Cancelling an order restores stock; receiving a purchase order adds stock — both transactional.
- **Auth without a library.** Signed JWT (`jose`) in an httpOnly cookie, checked in Edge middleware *and* again inside every admin server action.
- **No ORM.** Plain parameterised SQL with `pg` (no injection risk), schema in `db/schema.sql`.
- **Server components + server actions.** Almost no client JS; only the cart and buttons are client components.

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · PostgreSQL · `pg` · `jose`

## Photography

The site is built for real food photography. Each photographic section, the hero banner and every product card has a named slot. Add a file such as `public/photos/idli-sambar.webp` and it appears automatically, resized to AVIF/WebP and lazy-loaded. Slots without a photo show an illustration instead of a broken image. See `public/photos/README.md` for the file names, sizes, licensing rules and how to credit photographers (credits appear on `/credits`).

## Run locally

```bash
npm install
cp .env.example .env.local     # fill in DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET
npm run dev                    # http://localhost:3000  ·  admin at /admin
```

Tables and demo data are created automatically on the first page load, so there is no migration step.

## Deploy (free): GitHub + Neon + Vercel

1. **Database:** create a free project at [neon.tech](https://neon.tech) and copy the connection string.
2. **GitHub:** create a new empty repository, then push this project to it.
   ```bash
   git init && git add . && git commit -m "Kadai & Co. store + ERP"
   git branch -M main
   git remote add origin https://github.com/<you>/kadai-erp.git
   git push -u origin main
   ```
3. **Vercel:** *Add New → Project →* import the repo. Under *Environment Variables* add
   `DATABASE_URL` (from Neon), `ADMIN_PASSWORD`, and `SESSION_SECRET` (any long random string). Click Deploy.
4. Open the live URL. The first visit sets up the database. Every later `git push` redeploys automatically.
5. Paste your live URL at the top of this README.

## Ideas to extend

- Online payments (Razorpay / Stripe) and order emails
- Product image uploads, customer accounts, reviews
- Multiple admin users with roles, audit log of stock movements
- Unit and end-to-end tests (Vitest + Playwright)

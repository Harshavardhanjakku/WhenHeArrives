## When He Arrives

A small Next.js App Router app to record and view arrivals (date + time). No auth.

### Features
- Fast add FAB (records now)
- Manual add form with optional note
- Timeline grouped by day, newest first
- Summary (7/30 day counts) with mini bar charts
- Date range filter
- Delete with confirmation
- CSV export
- Analytics: busiest days of week

### Tech
- Next.js (App Router), TypeScript, Tailwind CSS
- Icons: lucide-react
- Database: MongoDB Atlas using the official `mongodb` driver

### Environment
Create `.env.local` with:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/echotime_db?retryWrites=true&w=majority
NEXT_PUBLIC_SITE_NAME=When He Arrives
```

Example connection string pattern:
`mongodb+srv://<username>:<password>@cluster0.mongodb.net/arrivals?retryWrites=true&w=majority`

Database name: `echotime_db`
Collection name: `arrivals`

### MongoDB Atlas (free)
1. Create a free cluster at `https://www.mongodb.com/atlas`.
2. Network Access → allow your IP (for quick demo: `0.0.0.0/0`).
3. Database Access → create a user with password.
4. Get the connection string and paste into `MONGODB_URI`. Ensure the database name `echotime_db` is present in the URI.

### Local dev
```
npm install
npm run dev
```
Open `http://localhost:3000`.

### Deploy to Vercel
1. Push this repository to GitHub.
2. In Vercel, import the project.
3. Set environment variable `MONGODB_URI` in Project Settings.
4. Set `NEXT_PUBLIC_SITE_NAME` as desired.
5. Deploy. One-click: use the Vercel dashboard Import Project flow.

### API
- POST `/api/arrival` → create `{ timestamp?: ISOString, note?: string }`
- GET `/api/arrival?from=&to=&limit=` → list
- DELETE `/api/arrival/:id` → delete
- GET `/api/export` → CSV export

### Tests
Unit-test-friendly utilities in `lib/utils.ts`.

### Notes
- Public app; no authentication. Keep credentials in env only.
- The MongoDB client is cached to avoid multiple connections across requests.

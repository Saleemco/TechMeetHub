# TechMeetHub

A social event platform for tech professionals. Built with Node.js, Express, and vanilla JavaScript.

## Features

- **Authentication** — Login/Register with JWT tokens
- **3 User Roles** — Participant, Organizer, Admin
- **Event Management** — Create, edit, delete events
- **Registration System** — Register for events, track attendance
- **Role-Based Dashboards** — Different views for each role
- **Admin Panel** — Manage users and events platform-wide
- **Light/Dark Theme** — Toggle between themes with CSS variables
- **Responsive Design** — Works on mobile, tablet, desktop

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: Vanilla JS (ES Modules), Tailwind CSS (CDN)
- **Data**: In-memory storage (resets on server restart)
- **No build step** — Direct file serving

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Participant | jordan@techmeethub.dev | password |
| Organizer | sarah@techmeethub.dev | password |
| Admin | maya@techmeethub.dev | password |

## Run Locally

```bash
npm install
npm start
```

The server will start on `http://localhost:3000` (or `3001` if 3000 is busy).

## Deploy to Render (Free)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/techmeethub.git
git push -u origin main
```

### 2. Create Render Web Service

1. Go to [render.com](https://render.com) and sign up
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Fill in:
   - **Name**: `techmeethub`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. Click **Create Web Service**

Your app will be live at `https://techmeethub.onrender.com` in a few minutes.

### 3. Important Note

**Data is stored in-memory** — when the server restarts (happens daily on free plans), all demo data resets. For a production app, you'd want to add a database (MongoDB, PostgreSQL, etc.).

## Project Structure

```
techmeethub/
├── server.js           # Express API + demo data
├── package.json
├── public/
│   ├── index.html      # App shell
│   ├── css/
│   │   └── style.css   # Theme-aware styles
│   └── js/
│       ├── app.js      # Router & event handlers
│       ├── pages.js    # Page renderers
│       ├── components.js # Shared UI components
│       └── data.js     # API client
```

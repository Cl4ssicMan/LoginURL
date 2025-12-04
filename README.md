# LoginURL (Self-contained)

A minimal, self-contained LoginURL server that serves the login dashboard and validation endpoint using Hono. Includes SSL certificates and uses `assets/items-v5.37.dat` as the latest Items DAT (copied to `LoginURL/items.dat`).

## Quick Start (Windows PowerShell)

```powershell
Set-Location "C:\Users\trwii\Downloads\growtopia.js-main\growtopia.js-main\LoginURL"
npm install
$env:HTTPS_PORT="8443"; $env:LOGIN_PORT="8080"; npm start
```

- Dashboard: https://localhost:8443/player/login/dashboard
- Optional domain mapping for the wildcard cert:
  - Add `127.0.0.1 login.growserver.app` to `C:\Windows\System32\drivers\etc\hosts`
  - Then open https://login.growserver.app:8080/player/login/dashboard

## Environment variables
- `HTTPS_PORT` (default `8443`) – Local dev HTTPS port for localhost certs
- `LOGIN_PORT` (default `8080`) – Port for domain-specific login host
- `LOGIN_HOST` (default `login.growserver.app`) – Hostname used in `server_data.php`
- `GAME_HOST` (default `127.0.0.1`) – UDP/ENet game server host advertised to clients
- `GAME_PORT` (default `17091`) – UDP/ENet game server port

## Endpoints
- `GET /` – Health
- `ALL /growtopia/server_data.php` – Returns Growtopia server info (loginurl, host, ports)
- `POST /player/login/validate` – Accepts `growID` and `password`, returns success JSON as HTML string
- `GET /player/login/dashboard` – Serves `website/login.html`
- `GET /growtopia/cache/*` – Static files from `LoginURL/cache`

## Files
- `ssl/` – SSL keys/certs (copied from project assets)
- `website/login.html` – Login dashboard page
- `items.dat` – Copied from `assets/items-v5.37.dat` (latest)
- `cache/` – Optional directory to serve static cache files

## Notes
- Use proper SSL certs in production or terminate TLS at a reverse proxy (Caddy, Nginx, IIS) and run Node HTTP behind it.
- This folder is self-contained; you can zip and move it to another Windows machine and run with `npm install` then `npm start`.

## Deploy to Vercel
- This folder is Vercel-ready:
  - `public/` serves static files directly:
    - `public/player/login/dashboard/index.html` → `/player/login/dashboard`
    - `public/growtopia/cache/items.dat` → `/growtopia/cache/items.dat`
  - `api/server.js` implements:
    - `/growtopia/server_data.php`
    - `/player/login/validate`
  - `vercel.json` routes the above paths to the function.

### Steps
```powershell
# From the LoginURL folder
vercel
# Or deploy to production
vercel --prod
```

### Vercel env vars (Project → Settings → Environment Variables)
- `LOGIN_HOST` – e.g. `login.yourdomain.com` (Vercel handles TLS)
- `LOGIN_PORT` – usually leave empty or `443`
- `GAME_HOST` – your UDP/ENet server public host or IP
- `GAME_PORT` – default `17091`

No custom certificates are needed on Vercel; they terminate TLS.
# LoginURL (Self-contained)

A minimal, self-contained LoginURL server that serves the login dashboard and validation endpoint using Hono. Includes SSL certificates and uses `assets/items-v5.37.dat` as the latest Items DAT (copied to `LoginURL/items.dat`).

## Quick Start (Windows PowerShell)

```powershell
Set-Location "C:\Users\trwii\Downloads\growtopia.js-main\growtopia.js-main\LoginURL"
npm install
$env:HTTPS_PORT="8443"; $env:LOGIN_PORT="8080"; npm start
```

- Dashboard: https://localhost:8443/player/login/dashboard
- Optional domain mapping for the wildcard cert:
  - Add `127.0.0.1 login.growserver.app` to `C:\Windows\System32\drivers\etc\hosts`
  - Then open https://login.growserver.app:8080/player/login/dashboard

## Environment variables
- `HTTPS_PORT` (default `8443`) – Local dev HTTPS port for localhost certs
- `LOGIN_PORT` (default `8080`) – Port for domain-specific login host
- `LOGIN_HOST` (default `login.growserver.app`) – Hostname used in `server_data.php`
- `GAME_HOST` (default `127.0.0.1`) – UDP/ENet game server host advertised to clients
- `GAME_PORT` (default `17091`) – UDP/ENet game server port

## Endpoints
- `GET /` – Health
- `ALL /growtopia/server_data.php` – Returns Growtopia server info (loginurl, host, ports)
- `POST /player/login/validate` – Accepts `growID` and `password`, returns success JSON as HTML string
- `GET /player/login/dashboard` – Serves `website/login.html`
- `GET /growtopia/cache/*` – Static files from `LoginURL/cache`

## Files
- `ssl/` – SSL keys/certs (copied from project assets)
- `website/login.html` – Login dashboard page
- `items.dat` – Copied from `assets/items-v5.37.dat` (latest)
- `cache/` – Optional directory to serve static cache files

## Notes
- Use proper SSL certs in production or terminate TLS at a reverse proxy (Caddy, Nginx, IIS) and run Node HTTP behind it.
- This folder is self-contained; you can zip and move it to another Windows machine and run with `npm install` then `npm start`.

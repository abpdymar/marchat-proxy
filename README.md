# MarChat Proxy

TLS 1.2 Proxy für MarChat — ermöglicht Android 4.0.4 (z.B. Sony Xperia U) die Verbindung zu Supabase.

## Deployment auf Render (kostenlos)

1. Diesen Ordner als GitHub Repository hochladen
2. Auf https://render.com einloggen (kostenlos registrieren)
3. "New Web Service" → dein Repository auswählen
4. Einstellungen:
   - **Build Command:** (leer lassen)
   - **Start Command:** `node server.js`
   - **Plan:** Free
5. Deploy klicken
6. Render gibt dir eine URL wie: `https://marchat-proxy.onrender.com`
7. Diese URL in der APK eintragen (bereits erledigt wenn du die neue APK verwendest)

## Wie es funktioniert

Das Xperia U → HTTP/TLS1.0 → Proxy (Render) → TLS 1.2 → Supabase

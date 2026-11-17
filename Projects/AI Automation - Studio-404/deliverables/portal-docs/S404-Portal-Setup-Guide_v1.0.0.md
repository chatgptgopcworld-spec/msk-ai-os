# ICS Research Portal

Content research portal (TikTok, YouTube, Facebook, Spotify). Nebula design.
Frontend: static site (`site/`) on Netlify. Backend: Google Apps Script + Google Sheet + Google Docs. Dono free hain.

## Folder
- `site/` — deploy hone wali website (index.html, favicon, manifest)
- `google-apps-script/Code.gs` — backend (Sheets, Docs, login)
- `netlify.toml` — Netlify settings aur security headers
- `src/` — source (app.src.js, base.css, build scripts). `site/index.html` inhi se banta hai.

## Step 1: Google backend (5 minute, ek dafa)
1. https://script.google.com kholein > **New project**.
2. Jo code pehle se hai use delete kar ke `google-apps-script/Code.gs` ka poora code paste karein. Save.
3. Upar function list se **setup** chunein aur **Run** dabayein. Google permission maangega: Allow.
4. Neeche **Execution log** mein Sheet ka link, **USERNAME** (admin) aur **PASSWORD** likha hoga. Password note kar lein.
5. **Deploy > New deployment** > type **Web app** > Execute as: **Me**, Who has access: **Anyone** > Deploy.
6. **Web app URL** copy karein (aakhir mein `/exec` hota hai).

## Step 2: Login
Portal kholein, username `admin`, password (log wala) aur pehli dafa Web app URL daalein.
Login ke baad **Settings > Password badlein** se apna password rakh lein.

URL har device par na dalna pare to `site/index.html` mein `window.PORTAL_BACKEND_URL=''` ke andar URL likh kar dobara deploy karein.

## Security
- Login ke baghair koi data na parha ja sakta hai na likha.
- Password sirf salted hash ki shakal mein save hota hai. 5 ghalat tries par 15 minute lock.
- Session 30 din ka, logout par khatam. Password badalne par baqi devices logout.
- Password bhool jayein to Apps Script editor mein `resetPassword` chalayein.
- Code.gs badlein to Deploy > Manage deployments > Edit > **New version** zaroor karein.

## Netlify deploy
`netlify deploy --prod --dir site` ya https://app.netlify.com/drop par `site` folder drag karein.

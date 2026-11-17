---
name: content-research-portal
description: ICS Research Portal (TikTok/YouTube/FB/Instagram/Spotify research tracker) - live URLs, stack, how updates ship, current state
metadata:
  type: project
---

Personal content-research portal for the user (writes Roman Urdu; reply in Roman Urdu, portal UI text English). Not part of the `hamzipromtps` repo (that is the HamziPrompts WordPress LMS with its own plan-gate rules); never build it there.

**Live:** https://ics-research-portal.netlify.app (Netlify Drop). Design "Nebula". Branding ICS (black, red, blue).
**Backend:** Google Apps Script web app "ICS Research Portal Backend" under the thecreatorsclubhq Google account, data in Google Sheet "ICS Research Portal" (id 1AwHWirAmDWaAavVNrFF-G359jDfwepquUO2LxLfvnfU). Admin username is Script Property PORTAL_USER. Deployed Version 4 on 2026-11-16 (team logins with editor/viewer roles, "added by", daily YouTube refresh + Sunday Sheet backup triggers installed).
**Files:** /mnt/project-files/ics-research-portal/ (`site/`, `chrome-extension/`, `google-apps-script/Code.gs`, `src/`), plus zips ics-research-portal.zip, ics-portal-site.zip, ics-chrome-extension.zip.

**How updates ship:**
- Site: user drags the `site` folder onto Netlify > Deploys (I cannot upload; open https://app.netlify.com/projects/ics-research-portal/deploys for them).
- Backend: edit code in the Apps Script editor via the user's Chrome, then Deploy > Manage deployments > edit > New version. New Google scopes need the user to click Allow; authorise BEFORE deploying or the live portal breaks.
- Extension (v1.3.0, MV3; popup fixed 384x548, dark/light switch, in-popup "Paste links" tab (user rejected a separate tab); single save runs in the background worker, popup closes itself and the icon badge shows the result, because the user wants saving to feel instant): user loads `chrome-extension` folder via chrome://extensions > Load unpacked, and presses Reload there after each update.

**State 2026-11-16:** platforms TikTok, YouTube, Facebook, Spotify, Instagram; statuses New/Shortlisted/Selected/Active/Rejected; Import links page (bulk paste) in portal and extension; extension shares login with the portal through a content script on the portal origin. TikTok/Facebook/Instagram cannot be read server-side (bot walls), only through the extension in the user's browser. Scrapers for YouTube/Facebook/Instagram/Spotify are tested only against mock pages, not live sites.

**Preferences:** wants premium, ultra-modern, fully working UI (rejected basic mockups); wants things free and secure; mobile must feel like an app with the menu at the top (Netlify badge covers the bottom).

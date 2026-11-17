---
name: ics-studio404-site
description: ics-studio404.netlify.app (job application / staff / eval pages) - where data lives, deploy status, favicon work
metadata:
  type: project
  modified: 2026-11-16T10:06:27.920Z
---

- Site https://ics-studio404.netlify.app has 3 static pages: index.html (/), staff.html (/staff), eval.html (/eval). Deployed via Netlify Drop under the Netlify team "University Of Lahore". The user had no local zip/backup of it.
- All form submissions (applications, evaluations) go to a Google Apps Script backend that writes to a Google Sheet, not to Netlify. A redeploy does not touch submitted data. The user is anxious that this data must never be lost.
- 2026-11-16: the ICS logo favicon was prepared: 4 link tags after <head> plus favicon.ico, favicon-32.png, favicon-192.png, apple-touch-icon.png. Icon sources are in /mnt/project-files/ics-favicon/. It could NOT be deployed because Netlify paused production deploys (team credits used up for the billing cycle). Same day the user chose to move both sites to a new Netlify account. ics-studio404-site.zip (3 pages + favicon) was downloaded to their computer through Chrome. DONE 2026-11-16: both sites now live on a NEW Netlify account under the original names (ics-studio404, ics-research-portal) with the favicon; old team projects renamed to ics-studio404-old / ics-research-portal-old. Old plan was: deploy on the new account, then rename the old project and claim the same *.netlify.app name, or transfer the project to a new team. Otherwise: deploy once the credits reset or the team is upgraded, then check that the favicon shows on all 3 pages.
- When redeploying pages fetched from the live site, first strip the Netlify-injected `/.netlify/scripts/hud` script tag.
- 2026-11-16: staff page (hiring list): label "Waiting" (short, keeps pill size); 6 summary boxes in one row incl. Hired (purple); Result driven by Remarks only: Pending/Maybe(shown Waiting)=Waiting, Interview=Shortlist, Hired=Hired, Rejected/No reply/Not interested=Reject. Stored remark value is still "Maybe" in the Sheet. List box max-height min(740px,85vh) to show 5 rows. Deployed by me via Netlify Drop on the NEW account (Deploys page file input + DataTransfer). The new account injects a "This site is hosted on Netlify" HTML comment and the hud script; strip both before redeploying fetched pages.

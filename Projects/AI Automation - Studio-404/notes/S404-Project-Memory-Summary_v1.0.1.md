# Project memory
- User writes Roman Urdu; reply in Roman Urdu. Portal UI text must be English.
- Content research portal (TikTok/YouTube/FB/Instagram/Spotify research tracker): final design = "Nebula" concept (deep navy, glow accents). Backend: Google Sheets + Apps Script ("ICS Research Portal Backend", Sheet "ICS Research Portal"; username in Script Property PORTAL_USER). Never create a new Apps Script deployment (URL would change); edit existing one. Deployed on Netlify (Drop): https://ics-research-portal.netlify.app. Chrome extension depends on that exact site name. Updates are deployed by user dragging site folder into Netlify Deploys tab. Branding: ICS logo/colors (black, red, blue). Not in hamzipromtps repo (that's the HamziPrompts WordPress site).
- Second site: ICS Studio 404 hiring portal https://ics-studio404.netlify.app (/, /staff, /eval), data goes to Google Sheet via Apps Script; running ads point to it. Backup zip ics-studio404-site.zip in user's Downloads.
- Nov 16 2026: old Netlify team ran out of credits; both sites moved to a new Netlify account with same names; old copies renamed *-old.
- User wants premium, ultra-modern, fully working/testable UI; disliked basic mockups.
- Vault auto-save: after any change, sync project files to MSK AI OS vault `Projects/AI Automation - Studio-404/` (versioned v1.0.0+); steps in [[vault-auto-save]].

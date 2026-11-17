# ICS [PWD] Studio 404: Go-live steps (about 10 minutes)

Everything is created for you by one script: `ICS-Hiring-Setup.gs`.

## 1. Run the script (3 minutes)
1. Open https://script.google.com and sign in with the Google account that should own the hiring Form and Sheet.
2. Click **New project**. Delete the sample code. Paste the whole content of `ICS-Hiring-Setup.gs`. Click **Save**.
3. In the toolbar choose the function **setupHiring** and click **Run**.
4. Click **Review permissions** and allow access (it needs Forms, Sheets and Drive).
5. Open **Execution log**. It prints 4 links:
   - PUBLIC APPLICATION FORM: this goes into your job posts
   - Edit link of the application form
   - INTERVIEW EVALUATION FORM: staff only
   - HIRING SHEET

Run `setupHiring` only once. Running it again creates a second set.

## 2. Three small manual steps (Google does not allow a script to do these)
1. **CV upload question.** Open the Edit link. At the end of the questions (before the last tick box) click **Add question**, choose **File upload**, title it "Upload your CV and portfolio", allow all file types, set a size limit (for example 10 MB), switch on **Required**. Candidates must sign in to a Google account to upload. If that worries you, use a short answer "CV link (Google Drive)" question instead.
2. **Look.** In the form click the palette icon: add the ICS logo as the header image, set the colour to red and the background to black or white.
3. **Test.** Open the public link, fill it in with your own number, and check a new row appears in the Hiring Sheet with a score, a result and a green **Send WhatsApp** button.

## 3. How you use it every day
- **Summary** tab: total received, Shortlist, Maybe, Reject, new today. Use the **Show** dropdown for All / Shortlist / Maybe / Reject. All applications are always on the **Applications** tab.
- **Applications** tab: each new form is scored by itself. Click **Send WhatsApp** in a row, check the message, press Send in WhatsApp. Change **Status** with the dropdown.
- **Templates** tab: set the interview date, time, address and contact person in the yellow cells for each batch. The three messages (Shortlist, Maybe, Reject) are below them and can be edited.

## 4. What is automatic and what is not
- Automatic: scoring (Shortlist 75+, Maybe 50 to 74, Reject below 50, "doing another job" = Maybe), result colours, reason, WhatsApp link, summary counts.
- Not automatic: sending WhatsApp. You press Send, so nothing goes out without you.
- Candidates do not get an email or WhatsApp by themselves. Email is not collected.

## 5. Things to know
- The page with the pop-up, landing card and logos is the design mockup. Google Forms cannot show pop-ups, so the real Form shows the company details, shifts, pay and rules at the top, with a required "I have read and I agree" tick before the questions.
- The Form shows plain text only. It has no PSEB logos or QR. Add them in the header image if you want them.
- Keep the "Registered by Government of Pakistan" wording only if it is accurate for what you hold.

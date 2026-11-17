# WhatsApp message templates: ICS [PWD] Studio 404 HR

These are the messages the Hiring Sheet and the staff page put into WhatsApp. Text between *stars* shows **bold** in WhatsApp. The live copy is in the Google Sheet, tab **Templates** (cells B6 to B8); edit there or on the staff page under the templates section.

Filled in automatically: {name} = candidate's first name, {date}, {time}, {address}, {contact} (from Templates B1 to B4).

## Shortlist

```
Assalam o Alaikum {name},

Congratulations! You have been shortlisted for an interview at *ICS [PWD] Studio 404*.

📍 *Location:* {address}
📅 *Date:* {date}
⏰ *Time:* {time}
👤 *Contact:* {contact}

*Please bring:*
• One printed copy of your CV
• A copy of your CNIC
• Your portfolio or laptop (if you have one)

Please reply "OK" to confirm your attendance. If you cannot attend, kindly let us know at least 6 hours in advance.

Best regards,
*HR Team*
*ICS [PWD] Studio 404*
```

## Maybe

```
Assalam o Alaikum {name},

We have received your application for *ICS [PWD] Studio 404*.

Our team is currently reviewing all applications. If your profile matches our requirements, we will contact you shortly on this number.

Thank you for your patience.

Best regards,
*HR Team*
*ICS [PWD] Studio 404*
```

## Reject

```
Assalam o Alaikum {name},

Thank you for your interest in *ICS [PWD] Studio 404*. We have reviewed your application.

After careful consideration, we will not be moving forward with your application at this time. This decision reflects our current requirements for this role and is not a judgment of your skills or potential.

We wish you every success in your job search. If a suitable opening comes up in the future, we will be glad to contact you.

Best regards,
*HR Team*
*ICS [PWD] Studio 404*
```

## Notes

- Send only from the official ICS WhatsApp number, one person at a time, and only to people who applied.
- Shortlist message says shortlisted for interview only. It is not a job offer.
- Links use `https://api.whatsapp.com/send?phone=92XXXXXXXXXX&text=...` with the text UTF-8 percent-encoded (encodeURIComponent on the staff page, ENCODEURL in the Sheet). Do not use `wa.me` links: its redirect turns emojis like 📍 📅 ⏰ 👤 into a broken � sign.

# StartupDost website

A responsive static website for StartupDost with services, illustrative portfolio concepts, and a project inquiry form.

## Pages and files

- `index.html` — landing page, services, work concepts, about, contact form.
- `assets/css/styles.css` — responsive styling.
- `assets/js/main.js` — mobile navigation and form behavior.
- `google-apps-script/Code.gs` — optional Google Sheets endpoint for inquiries.

## Deploy on Vercel

1. Import this GitHub repository into Vercel.
2. Keep the framework preset as **Other** and the build command empty.
3. Set the output directory to the repository root (or leave the default if detected).
4. Deploy.

## Connect the inquiry form to Google Sheets

The form does **not** claim to save submissions until you configure the endpoint.

1. Open the spreadsheet: https://docs.google.com/spreadsheets/d/1IpcvG_D2pErfRErA5VLZC0mGBINznpgIQmzpf8VUx6Q/edit
2. Open https://script.google.com/ and create a new Apps Script project.
3. Replace its starter code with `google-apps-script/Code.gs`.
4. Save, then choose **Deploy → New deployment → Web app**.
5. Set **Execute as** to you and access to **Anyone** (review the access implications before enabling public access). Deploy and authorize it.
6. Copy the Web app URL ending in `/exec`.
7. Paste that URL into `GOOGLE_SHEETS_ENDPOINT` at the top of `assets/js/main.js`, commit the change, and redeploy.
8. Send a test inquiry and confirm a new row appears in the **StartupDost Inquiries** sheet tab.

The Apps Script creates the tab and headers automatically. Its endpoint uses a browser-compatible form POST; because `no-cors` responses cannot be inspected by the browser, test the sheet itself to confirm that the row was saved.

## Email notifications

This project does not promise automatic email notifications. To send notification emails, add a trusted server-side email integration (for example, a provider API behind a serverless function) and keep API secrets out of client-side JavaScript.

## Notes

- Portfolio tiles are locally drawn CSS concepts, not external image links, to avoid broken image assets.
- The budget option **₹5,000–₹20,000 (Newbie)** is included.
- No WhatsApp button or quote estimator is included.
- Contact: hello@startupdost.online
- LinkedIn: https://in.linkedin.com/company/startupdost2018

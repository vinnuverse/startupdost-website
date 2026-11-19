# StartupDost website

A responsive static website for StartupDost, built with HTML, CSS and vanilla JavaScript. The homepage presents six core service offerings, illustrative portfolio concepts, and a project enquiry form.

## Project structure

- `index.html` — homepage, six service cards, capability tabs, process overview, contact form and seven FAQs.
- `about.html` — company overview.
- `services.html` — service details.
- `work.html` — illustrative portfolio concepts.
- `contact.html` — contact information and project enquiry form.
- `assets/css/styles.css` — shared layout, components and responsive styles.
- `assets/css/contact.css` — contact-page styles.
- `assets/css/work.css` — portfolio-page styles.
- `assets/js/main.js` — mobile navigation, capability tabs, visual effects and contact-form submission.
- `google-apps-script/Code.gs` — optional Google Sheets endpoint code; it is not connected to the current website form by default.

## Contact form

The homepage and contact page use the same form pattern. The current JavaScript submits enquiries through the FormSubmit AJAX endpoint configured at the top of `assets/js/main.js`:

`https://formsubmit.co/ajax/hello@startupdost.online`

The form's HTML action also points to the corresponding FormSubmit recipient. The active frontend does **not** currently post enquiries to Google Apps Script or save them to Google Sheets.

`google-apps-script/Code.gs` is a separate, optional handler. If you choose to use it, connect it to the frontend deliberately, review the Apps Script access settings, and test that submissions are actually written to the intended spreadsheet before describing Sheets storage as active.

## Deploy on Vercel

This repository is a static site and does not require a framework build step.

1. Import the GitHub repository into Vercel.
2. Set the framework preset to **Other**.
3. Keep the build command empty.
4. Use the repository root as the output directory (or leave the default if Vercel detects it correctly).
5. Deploy the project.

The current FormSubmit configuration is in the client-side JavaScript; no Google Sheets endpoint is configured through an environment variable.

## Validation

There is no package manifest or automated test command in this repository. Before publishing a change, check the affected page in a browser, test the mobile navigation and responsive layout, and submit a test enquiry when the form flow is changed. Confirm receipt through the configured FormSubmit destination.

## Content notes

- Portfolio tiles are locally drawn CSS concepts, not verified client case studies. Keep the portfolio disclaimer visible unless real project details are added.
- The website contact address is `hello@startupdost.online`.
- LinkedIn: https://in.linkedin.com/company/startupdost2018

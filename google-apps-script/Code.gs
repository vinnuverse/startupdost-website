/**
 * StartupDost inquiry -> Google Sheets database.
 * Deploy as Web app: Execute as Me, access suitable for public form submissions.
 * Accepts URL-encoded fields: name, email, service, budget, message.
 */
const SPREADSHEET_ID = "1IpcvG_D2pErfRErA5VLZC0mGBINznpgIQmzpf8VUx6Q";
const SHEET_NAME = "StartupDost Inquiries";
const HEADERS = [
  "Timestamp", "Name", "Email", "Service", "Budget", "Message", "Source",
  "Inquiry ID", "Submission Status"
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const p = (e && e.parameter) || {};
    const name = clean_(p.name);
    const email = clean_(p.email);
    const service = clean_(p.service);
    const budget = clean_(p.budget);
    const message = clean_(p.message);

    if (!name || !email || !service || !message) {
      return json_({ success: false, message: "Name, email, service and message are required." });
    }
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      return json_({ success: false, message: "Please provide a valid email address." });
    }

    lock.waitLock(10000);
    try {
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      let sheet = spreadsheet.getSheetByName(SHEET_NAME);
      if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

      if (sheet.getLastRow() === 0) {
        sheet.appendRow(HEADERS);
        sheet.setFrozenRows(1);
      } else {
        // Preserve existing rows/columns and add tracking columns if this is the older schema.
        if (sheet.getLastColumn() < 7) {
          sheet.getRange(1, 1, 1, 7).setValues([HEADERS.slice(0, 7)]);
        }
        if (sheet.getLastColumn() < 8 || !sheet.getRange(1, 8).getValue()) {
          sheet.getRange(1, 8).setValue("Inquiry ID");
        }
        if (sheet.getLastColumn() < 9 || !sheet.getRange(1, 9).getValue()) {
          sheet.getRange(1, 9).setValue("Submission Status");
        }
        sheet.setFrozenRows(1);
      }

      const inquiryId = Utilities.getUuid();
      sheet.appendRow([
        new Date(), safeCell_(name), safeCell_(email), safeCell_(service),
        safeCell_(budget), safeCell_(message), "Website", inquiryId, "Saved"
      ]);

      return json_({ success: true, inquiryId: inquiryId, message: "Inquiry saved." });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    console.error(err);
    return json_({ success: false, message: "Unable to save inquiry. Check Apps Script executions and spreadsheet permissions." });
  }
}

function doGet() {
  return json_({ success: true, service: "StartupDost inquiry endpoint", message: "Endpoint is online. Submit the website form to save an inquiry." });
}

function clean_(value) {
  return String(value || "").trim().slice(0, 5000);
}

function safeCell_(value) {
  return /^[=+@\\-]/.test(value) ? "'" + value : value;
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

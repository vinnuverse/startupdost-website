const SPREADSHEET_ID = "1IpcvG_D2pErfRErA5VLZC0mGBINznpgIQmzpf8VUx6Q";
const SHEET_NAME = "StartupDost Inquiries";

function doPost(e) {
  try {
    const params = (e && e.parameter) || {};
    const sheet = getSheet_();
    if (!params.name || !params.email || !params.service || !params.message) {
      return json_({ success: false, error: "Please fill all required fields." });
    }
    sheet.appendRow([
      new Date(),
      clean_(params.name),
      clean_(params.email),
      clean_(params.service),
      clean_(params.budget || ""),
      clean_(params.message),
      "Website"
    ]);
    return json_({ success: true });
  } catch (error) {
    return json_({ success: false, error: String(error) });
  }
}

function doGet() {
  return json_({ success: true, service: "StartupDost inquiry endpoint", message: "POST an inquiry to save it to the sheet." });
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Name", "Email", "Service", "Budget", "Message", "Source"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function clean_(value) {
  return String(value || "").trim().replace(/^[=+@]/, "'");
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

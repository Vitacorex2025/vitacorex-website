/**
 * VitaCoreX lead capture endpoint for Google Sheets.
 * 1) Create a Google Sheet.
 * 2) Paste this code into Apps Script.
 * 3) Set SPREADSHEET_ID and SHEET_NAME.
 * 4) Deploy as Web App: Anyone with the link.
 * 5) Paste the deployed URL into healthcare-cfo_email_capture.html ENDPOINT constant.
 */
const SPREADSHEET_ID = 'PASTE_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Leads';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME) || SpreadsheetApp.openById(SPREADSHEET_ID).insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['timestamp','name','email','company','title','source_page','asset_name']);
    }
    sheet.appendRow([
      body.timestamp || new Date().toISOString(),
      body.name || '',
      body.email || '',
      body.company || '',
      body.title || '',
      body.source_page || '',
      body.asset_name || ''
    ]);
    return jsonResponse({ok:true});
  } catch (err) {
    return jsonResponse({ok:false, error:String(err)});
  }
}

function doOptions() {
  return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}


/**
 * VitaCoreX capture endpoint.
 * Configure SPREADSHEET_ID. Optional: DRIVE_FOLDER_ID if you want to store base64 attachments.
 */
const SPREADSHEET_ID = 'PASTE_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Leads';
const DRIVE_FOLDER_ID = '';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['timestamp','type','name','email','phone','company','title','source_page','asset_name','recommended_service','notes','attachment_name','attachment_url']);
    }
    let attachmentUrl = '';
    if (DRIVE_FOLDER_ID && body.attachment_base64 && body.attachment_name) {
      const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
      const bytes = Utilities.base64Decode(body.attachment_base64.split(',').pop());
      const blob = Utilities.newBlob(bytes, body.attachment_type || MimeType.PDF, body.attachment_name);
      const file = folder.createFile(blob);
      attachmentUrl = file.getUrl();
    }
    sheet.appendRow([
      body.timestamp || new Date().toISOString(),
      body.type || '',
      body.name || '',
      body.email || '',
      body.phone || '',
      body.company || '',
      body.title || body.role || '',
      body.source_page || '',
      body.asset_name || '',
      body.recommended_service || '',
      body.brief || body.intro || '',
      body.attachment_name || '',
      attachmentUrl || ''
    ]);
    return jsonResponse({ok:true, attachment_url: attachmentUrl});
  } catch (err) {
    return jsonResponse({ok:false, error:String(err)});
  }
}
function doOptions() { return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT); }
function jsonResponse(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }

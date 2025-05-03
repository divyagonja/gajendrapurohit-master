function doPost(e) {
  try {
    // Get the spreadsheet and the active sheet
    var ss = SpreadsheetApp.openById('1DV1KwLDOCuk3txwXZz9sm7PueaiWXVvInj-ve43ZSWY');
    var sheet = ss.getSheetByName('Leads') || ss.getActiveSheet();
    
    // Get form data
    var formData = e.parameter;
    
    // Prepare row data
    var rowData = [
      new Date(),           // Timestamp
      formData.name,        // Name
      formData.email,       // Email
      formData.phone,       // Phone
      formData.goal,        // Goal
    ];
    
    // Append data to sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function for checking setup
function doGet() {
  return ContentService
    .createTextOutput('The Apps Script is properly deployed and accessible!')
    .setMimeType(ContentService.MimeType.TEXT);
} 
function doPost(e) {
  try {
    // Get the spreadsheet
    var ss = SpreadsheetApp.openById('1DV1KwLDOCuk3txwXZz9sm7PueaiWXVvInj-ve43ZSWY');
    
    // Get form data
    var formData = e.parameter;
    var timestamp = new Date();
    
    // Determine which sheet to use based on the 'sheet' parameter
    var sheetName = formData.sheet === 'contact' ? 'Contact Form' : 'Leads';
    var sheet = ss.getSheetByName(sheetName) || ss.getActiveSheet();
    
    // Prepare row data based on form type
    var rowData;
    
    if (formData.sheet === 'contact') {
      // Contact form data
      rowData = [
        timestamp,              // Timestamp
        formData.name,          // Name
        formData.email,         // Email
        formData.subject,       // Subject
        formData.message        // Message
      ];
    } else {
      // Chatbot FAQ form data
      rowData = [
        timestamp,              // Timestamp
        formData.name,          // Name
        formData.email,         // Email
        formData.phone,         // Phone
        formData.goal           // Goal
      ];
    }
    
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
export async function getAllSpreadsheets(access_token: string) {
    const response = await fetch('https://www.googleapis.com/drive/v3/files?q=mimeType="application/vnd.google-apps.spreadsheet"', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error fetching spreadsheets: ${response.statusText} - ${errorText}`);
    }
  
    const data = await response.json();
    return data.files.map((file: { id: string; name: string }) => ({
      id: file.id,
      name: file.name,
    }));
  }
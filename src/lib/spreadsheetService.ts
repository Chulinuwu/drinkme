export async function getAllSpreadsheets(access_token: string) {
    const response = await fetch('https://www.googleapis.com/drive/v3/files?q=mimeType="application/vnd.google-apps.spreadsheet"&fields=files(id,name,modifiedTime)', {
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
    return data.files.map((file: { id: string; name: string; modifiedTime: string }) => ({
        id: file.id,
        name: file.name,
        modifiedTime: file.modifiedTime,
    }));
}

export async function getSpreadsheetData(access_token: string, spreadsheetId: string, sheetname : string) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetname}?`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching spreadsheet data: ${response.status} - ${response.statusText} - ${errorText}`);
        throw new Error(`Error fetching spreadsheet data: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const headers = data.values[0];
    const rows = data.values.slice(1);

    return rows.map((row: string[]) => {
        const rowData: { [key: string]: string } = {};
        headers.forEach((header: string, index: number) => {
            rowData[header] = row[index];
        });
        return rowData;
    });
}

export async function updateSpreadsheetData(access_token: string, spreadsheetId: string, spreadsheetData: any[] , selectedName: string) {
    const headers = Object.keys(spreadsheetData[0]);
    const values = [headers, ...spreadsheetData.map(row => headers.map(header => row[header]))];

    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${selectedName}?valueInputOption=RAW`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error updating spreadsheet data: ${response.statusText} - ${errorText}`);
    }

    return await response.json();
}

export async function getSheetNames(access_token: string, spreadsheetId: string): Promise<string[]> {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching sheet names: ${errorText}`);
        throw new Error('Failed to fetch sheet names');
    }

    const data = await response.json();
    return data.sheets.map((sheet: { properties: { title: string } }) => sheet.properties.title);
}
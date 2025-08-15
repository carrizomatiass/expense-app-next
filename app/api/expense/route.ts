export async function GET() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "A2:E"
    });
    
    const rows = response.data.values || [];
    
    const expenses = rows.map(row => ({
      description: row[0] || '',
      amount: row[1] || '',
      date: row[2] || '',
      category: row[3] || '',
      type: row[4] || 'expense'
    }));
    
    return NextResponse.json({ expenses });
  } catch (error) {
    console.error("Error al obtener gastos:", error);
    return NextResponse.json({ success: false, error: 'Error al obtener gastos' }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(request: Request) {
  const { description, amount, category, type } = await request.json();

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "A1", // Esto agregará después de la última fila con datos
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            description,
            amount,
            new Date().toISOString(),
            category,
            type
          ]
        ],
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al guardar gasto:", error);
    return NextResponse.json({ success: false, error: 'Error al guardar gasto' }, { status: 500 });
  }
}

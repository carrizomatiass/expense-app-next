export async function GET() {
  const googlePrivateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDUIi9Yrxe4tYAt\nmE+ZgM7wfubNd2Bpf4J2J4GXc90QKwIXUwCUhtVJwcJDqOFXmbgE3TIHFz8ZdoeV\nVSQ9t964u30m8vOkGOZR+f/dBMItZnDsyDrP8bCgLK8EVXVFZSq0hoR1d2bV+Jj2\nPjEZoY4T9olT7Cw5NpzTFtTvisUckhy3Wh+NR5pqScg26eftBj4jucBkJoSjLMT4\nDdsqn4wCv0U2mIIocgnNWH9ZQFpZAOJo547p57PJt5SpimBjzzFL9ROY9214X5HQ\nNKS0+20XaeVmWBuZnJ4S5IHCM9C80aFGZNFOPiLvfOQ6p5nqoDPIidEpyFzYl1yT\nnUV0EgwpAgMBAAECggEAMFc779syripaM8m2NfZW8hIRGXhfNZtTiQZWr0M9eJ48\nY0FMbAxP1Xd8g/ubomFKwH0BlgETpYNPwVV+JTxd2j4LdpE9uULdVYgBaQXZFAx4\nplS4pkNe6xlTpsqspyw3L51J2RTlD9SPUun4OW2J2X3AbKnwp/cMhMP6sT2vzmMJ\nLL2CP4iXaBwJNUx/NOrZxnkSqcbXsif57BT1H+G5la/gaM3vDJVu/MJIw/g5RDkj\n372rXgxfyRgftHa1oKwtO+OrzDmt6JAclN78N0ywQ5WhScbXO5yxJeNqdyFr263H\nz6WgFyEmmrb3ysIS1L0GKD2VQWj4tNdRfUMHVBBOiQKBgQDzmOp+8HYCf16ifdip\nm3WjGhLQum1+oheFltLxlHLz596qbzTjzt42LndVebdCjSDFHB4CXliy802Ga+jT\n3rlOmgeE1Jj9JXajn+w9dknDHWXEwpBlEbl70psGj/E0bvqTphfUDksO2GMM8mfL\ncSZbeOsZTIx32eKre1zXWCO41QKBgQDe7ypIFaBWmuLCfCSUN1rAknPcVqekdd+w\nBAZygdsCemqRA3+hW6J9cDc2rG2jAxtlj+MUViZqyjGldjMULgtRwypWmsrkDyqQ\nFPvbOmSjMUYMIax9+1P9NPj4VCANr1awa6A91a0ycz5yUJdFBRiaWTTgw5PqCara\n/uy+YZmwBQKBgQCVBBd3PexDDN28c1XGM6ab9whJjbILxGa1PxWd2R0VHeP1yP/G\n2DbRWE2CCWpVGPZR/ihRdJu4JORo9bxBV79uWQV+eXt5aKCR6fPfiWwIIwStgARK\n/7PDDovtUMLSO42oIvPysieyVicJtYRPTNGVJXxURqKrcquaEWYzCeUYXQKBgEyE\nTkDbm2LeWoJiVbPBpBaArd+spnGeO56QYx4eT+tz1OvdBYt+hjEDuQ+88wyGXnrn\nfgtW3my85XljLnj4rM3tbLS5AHZyditp6GAAlNYmbWJwlGHRR6ya5/Fj/nR0AA8h\ngah3lLDCOWbHHoSEEUO45ptWxYgItWnhIaTenv95AoGAehvLDrOUUDs5rFSE5tw7\n8aOx9EcQpAllYRflXAYGthyJFnlz5vXo2W3TzJ6gZb6mBuh3OSYQW6hiCHYIuF9N\nGNxqEJVxI0HexNDvpYrOrVLRHRdi1t1tN64JVuY2poBJGUSyobTqj1FzvbBK0W7C\n6sRsZqzKe+0tWxud7eJtbL0=\n-----END PRIVATE KEY-----\n";
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: "expense-api-sheet@video-browser-359614.iam.gserviceaccount.com",
      private_key: googlePrivateKey.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "16AQcO1frvt_z874oTUwDYrePp03YMegdEcuZPin7wmA";

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

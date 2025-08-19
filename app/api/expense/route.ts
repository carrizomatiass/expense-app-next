import { NextResponse, NextRequest } from 'next/server';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';

// Función helper para obtener el usuario autenticado
async function getAuthenticatedUser(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret'
    ) as any;
    return decoded;
  } catch (error) {
    console.error('Error al verificar token:', error);
    return null;
  }
}

// Función helper para obtener o crear hoja del usuario
async function getUserSheetName(userEmail: string) {
  // Crear nombre de hoja basado en el email (sin caracteres especiales)
  const sheetName = `expenses_${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
  return sheetName;
}

// Función helper para verificar/crear hoja de usuario
async function ensureUserSheet(
  sheets: any,
  spreadsheetId: string,
  sheetName: string
) {
  try {
    // Obtener información del spreadsheet
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId,
    });

    const sheetExists = spreadsheet.data.sheets?.some(
      (sheet: any) => sheet.properties.title === sheetName
    );

    if (!sheetExists) {
      // Crear nueva hoja para el usuario
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            },
          ],
        },
      });

      // Agregar headers a la nueva hoja
      await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: `${sheetName}!A1:E1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [['Descripción', 'Monto', 'Fecha', 'Categoría', 'Tipo']],
        },
      });

      console.log(`Nueva hoja creada para usuario: ${sheetName}`);
    }

    return sheetName;
  } catch (error) {
    console.error('Error al verificar/crear hoja:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'Error de configuración' },
        { status: 500 }
      );
    }

    // Obtener nombre de hoja del usuario
    const sheetName = await getUserSheetName(user.email);

    // Verificar/crear hoja del usuario
    await ensureUserSheet(sheets, spreadsheetId, sheetName);

    // Obtener datos del usuario específico
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A2:E`,
    });

    const rows = response.data.values || [];

    const expenses = rows.map((row) => ({
      description: row[0] || '',
      amount: row[1] || '',
      date: row[2] || '',
      category: row[3] || '',
      type: row[4] || 'expense',
    }));

    return NextResponse.json({ expenses });
  } catch (error) {
    console.error('Error al obtener gastos:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener gastos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { description, amount, category, type } = await request.json();

    // Validaciones
    if (!description || !amount) {
      return NextResponse.json(
        { error: 'Descripción y monto son requeridos' },
        { status: 400 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'Error de configuración' },
        { status: 500 }
      );
    }

    // Obtener nombre de hoja del usuario
    const sheetName = await getUserSheetName(user.email);

    // Verificar/crear hoja del usuario
    await ensureUserSheet(sheets, spreadsheetId, sheetName);

    // Agregar gasto a la hoja del usuario específico
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A2:E`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            description,
            amount,
            new Date().toISOString(),
            category || '',
            type || 'expense',
          ],
        ],
      },
    });

    console.log(
      `Gasto agregado para usuario ${user.email} en hoja ${sheetName}`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al guardar gasto:', error);
    return NextResponse.json(
      { success: false, error: 'Error al guardar gasto' },
      { status: 500 }
    );
  }
}

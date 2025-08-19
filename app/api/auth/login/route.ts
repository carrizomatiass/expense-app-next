import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('Intentando login para:', email);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
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
    const userSheetId = process.env.GOOGLE_USER_SHEET_ID;

    if (!userSheetId) {
      console.error('GOOGLE_USER_SHEET_ID no está configurado');
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      );
    }

    // Obtener usuarios de la sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: userSheetId,
      range: 'A1:E100', // Cambiamos para incluir headers y ver mejor
    });

    const rows = response.data.values || [];
    console.log('Datos completos de la sheet:', rows);
    console.log('Headers:', rows[0]);
    console.log('Total filas:', rows.length);

    // Buscar usuario por email (saltamos la primera fila que son headers)
    const userRows = rows.slice(1); // Saltamos headers
    console.log('Filas de usuarios:', userRows);

    const user = userRows.find((row) => {
      console.log('Comparando:', row[0], 'con', email.toLowerCase().trim());
      return (
        row[0] && row[0].toLowerCase().trim() === email.toLowerCase().trim()
      );
    });

    if (!user) {
      console.log('Usuario no encontrado:', email);
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 401 }
      );
    }

    // Comparar contraseña directamente (sin hash)
    const storedPassword = user[1] || '';
    console.log('Password almacenada:', storedPassword);
    console.log('Password enviada:', password);
    console.log('¿Coinciden?', storedPassword === password);

    if (storedPassword !== password) {
      console.log('Contraseña incorrecta para:', email);
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    console.log('Login exitoso para:', email);

    // Crear JWT token
    const token = jwt.sign(
      {
        email: user[0],
        name: user[2] || 'Usuario',
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Actualizar last_login
    try {
      const userRowIndex =
        userRows.findIndex(
          (row) =>
            row[0] && row[0].toLowerCase().trim() === email.toLowerCase().trim()
        ) + 2; // +2 porque saltamos headers y empezamos en 1
      console.log('Actualizando last_login en fila:', userRowIndex);
      await sheets.spreadsheets.values.update({
        spreadsheetId: userSheetId,
        range: `E${userRowIndex}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[new Date().toISOString()]],
        },
      });
    } catch (updateError) {
      console.log('Error actualizando last_login (no crítico):', updateError);
    }

    const responseObj = NextResponse.json({
      success: true,
      user: {
        email: user[0],
        name: user[2] || 'Usuario',
      },
    });

    // Establecer cookie httpOnly
    responseObj.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return responseObj;
  } catch (error) {
    console.error('Error completo en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

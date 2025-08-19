import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El email no es válido' },
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

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: userSheetId,
      range: 'A2:E100',
    });

    const rows = response.data.values || [];
    const existingUser = rows.find(
      (row) => row[0] && row[0].toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con este email' },
        { status: 409 }
      );
    }

    const userData = [
      email.toLowerCase().trim(),
      password,
      name.trim(),
      new Date().toISOString(),
      '',
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: userSheetId,
      range: 'A2:E',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [userData],
      },
    });

    console.log(`Nuevo usuario registrado: ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        email: email.toLowerCase(),
        name: name.trim(),
      },
    });
  } catch (error) {
    console.error('Error detallado en registro:', error);

    if (error instanceof Error) {
      if (error.message.includes('Unable to parse range')) {
        return NextResponse.json(
          { error: 'Error de configuración de la hoja de cálculo' },
          { status: 500 }
        );
      }
      if (error.message.includes('The caller does not have permission')) {
        return NextResponse.json(
          { error: 'Error de permisos del servidor' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Error interno del servidor. Inténtalo de nuevo.' },
      { status: 500 }
    );
  }
}

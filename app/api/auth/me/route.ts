import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Tipo para el payload del JWT
interface JWTPayload {
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Token no encontrado' },
        { status: 401 }
      );
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret'
    ) as JWTPayload;

    return NextResponse.json({
      email: decoded.email,
      name: decoded.name,
    });
  } catch (error) {
    console.error('Error al verificar token:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: 'Token expirado' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Error de autenticación' },
      { status: 500 }
    );
  }
}

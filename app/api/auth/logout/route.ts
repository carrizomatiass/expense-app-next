import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('Realizando logout...');

    const response = NextResponse.json({
      success: true,
      message: 'Logout exitoso',
    });

    // Eliminar la cookie de autenticación
    response.cookies.delete('auth-token');

    return response;
  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al cerrar sesión',
      },
      { status: 500 }
    );
  }
}

// import { NextResponse } from 'next/server';

// export async function POST() {
//   try {
//     console.log('Realizando logout...');

//     const response = NextResponse.json({
//       success: true,
//       message: 'Logout exitoso',
//     });

//     // Eliminar la cookie de autenticación
//     response.cookies.delete('auth-token');

//     return response;
//   } catch (error) {
//     console.error('Error en logout:', error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: 'Error al cerrar sesión',
//       },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logout exitoso',
    });

    // Eliminar la cookie del token
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expira inmediatamente
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json(
      { error: 'Error al cerrar sesión' },
      { status: 500 }
    );
  }
}

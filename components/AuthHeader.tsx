'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface User {
  email: string;
  name: string;
}

interface AuthHeaderProps {
  user?: User;
}

export default function AuthHeader({ user }: AuthHeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Redirigir al login
        window.location.href = '/login';
      } else {
        console.error('Error en logout');
        // Fallback: eliminar cookie manualmente y redirigir
        document.cookie =
          'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error al hacer logout:', error);
      // Fallback: eliminar cookie manualmente y redirigir
      document.cookie =
        'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.href = '/login';
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Control de Gastos
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-sm text-gray-600">
                Hola, <span className="font-medium">{user.name}</span>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

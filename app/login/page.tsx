'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    // Mostrar mensajes basados en parámetros URL
    const errorParam = searchParams.get('error');
    const messageParam = searchParams.get('message');

    if (errorParam === 'auth_required') {
      setError('Debes iniciar sesión para acceder a esa página');
    } else if (errorParam === 'invalid_token') {
      setError('Tu sesión ha expirado. Por favor inicia sesión nuevamente');
    } else if (messageParam === 'registered') {
      setSuccessMessage('¡Registro exitoso! Ahora puedes iniciar sesión');
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      console.log('Enviando petición de login...');

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log('Respuesta del login:', { status: response.status, data });

      if (response.ok && data.success) {
        console.log('Login exitoso, redirigiendo...');
        setSuccessMessage('¡Login exitoso! Redirigiendo...');

        // Pequeño delay para mostrar el mensaje, luego redirigir
        setTimeout(() => {
          // Usar window.location.href para forzar la navegación
          window.location.href = '/expenses';
        }, 500);
      } else {
        console.error('Error en login:', data.error);
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setError('Error de conexión. Verifica tu internet e inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <p className="text-gray-600">
            Accede a tu cuenta de control de gastos
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            {successMessage && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-700">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>

          <div className="mt-3 text-center">
            <Link
              href="/"
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              ← Volver al inicio
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

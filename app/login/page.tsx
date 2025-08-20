'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
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

        setTimeout(() => {
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
    <Card className="w-full max-w-sm sm:max-w-md mx-auto shadow-lg border-0 sm:border">
      <CardHeader className="text-center px-4 sm:px-6 pt-6 sm:pt-8">
        <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold">
          Iniciar Sesión
        </CardTitle>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          Accede a tu cuenta de control de gastos
        </p>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          <div className="space-y-2">
            <Input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="h-11 sm:h-12 text-base"
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
              className="h-11 sm:h-12 text-base"
            />
          </div>

          {successMessage && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-700 text-sm sm:text-base">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription className="text-sm sm:text-base">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full h-11 sm:h-12 text-base font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <span className="text-sm sm:text-base">
                  Iniciando sesión...
                </span>
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </Button>
        </form>

        <div className="mt-6 sm:mt-8 text-center space-y-3 sm:space-y-4">
          <p className="text-sm sm:text-base text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-800 font-medium underline-offset-4 hover:underline transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>

          <Link
            href="/"
            className="inline-block text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function LoginFormSkeleton() {
  return (
    <Card className="w-full max-w-sm sm:max-w-md mx-auto shadow-lg border-0 sm:border animate-pulse">
      <CardHeader className="text-center px-4 sm:px-6 pt-6 sm:pt-8">
        <div className="h-6 sm:h-8 bg-gray-200 rounded-md mx-auto w-32 sm:w-40"></div>
        <div className="h-4 sm:h-5 bg-gray-200 rounded mx-auto w-48 sm:w-64 mt-2"></div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
        <div className="space-y-4 sm:space-y-5">
          <div className="h-11 sm:h-12 bg-gray-200 rounded-md"></div>
          <div className="h-11 sm:h-12 bg-gray-200 rounded-md"></div>
          <div className="h-11 sm:h-12 bg-gray-200 rounded-md"></div>
        </div>
        <div className="mt-6 sm:mt-8 space-y-3">
          <div className="h-4 bg-gray-200 rounded mx-auto w-48"></div>
          <div className="h-3 bg-gray-200 rounded mx-auto w-24"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

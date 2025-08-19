'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (!formData.email.trim()) {
      setError('El email es requerido');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('El email no es válido');
      return false;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);

        setTimeout(() => {
          router.push('/login?message=registered');
        }, 2000);
      } else {
        setError(data.error || 'Error al registrar usuario');
      }
    } catch (error) {
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
        <Card className="w-full max-w-sm sm:max-w-md shadow-lg border-0 sm:border">
          <CardContent className="pt-8 pb-8 px-4 sm:px-6">
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="text-green-600 text-4xl sm:text-5xl lg:text-6xl">
                ✓
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">
                ¡Registro Exitoso!
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Tu cuenta ha sido creada exitosamente. Serás redirigido al login
                en unos segundos...
              </p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <Card className="w-full shadow-lg border-0 sm:border">
          <CardHeader className="text-center px-4 sm:px-6 pt-6 sm:pt-8">
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold">
              Crear Cuenta
            </CardTitle>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Regístrate para comenzar a controlar tus gastos
            </p>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
            <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <Input
                  type="text"
                  name="name"
                  placeholder="Nombre completo"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="h-11 sm:h-12 text-base"
                />
              </div>

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
                  placeholder="Contraseña (mín. 6 caracteres)"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  minLength={6}
                  className="h-11 sm:h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar contraseña"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="h-11 sm:h-12 text-base"
                />
              </div>

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
                      Creando cuenta...
                    </span>
                  </div>
                ) : (
                  'Crear Cuenta'
                )}
              </Button>
            </form>

            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-sm sm:text-base text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium underline-offset-4 hover:underline transition-colors"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <header className="w-full p-4 sm:p-6">
        <nav className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            ExpenseTracker
          </h1>
          <div className="flex space-x-3 sm:space-x-4">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="px-4 py-2 text-sm sm:px-6 sm:py-2 sm:text-base"
              >
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="px-4 py-2 text-sm sm:px-6 sm:py-2 sm:text-base"
              >
                Registrarse
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Controla tus
            <span className="text-blue-600 block">Gastos Personales</span>
          </h2>
          <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-2 leading-relaxed">
            Una aplicación simple y efectiva para llevar el control de tus
            finanzas personales. Registra, categoriza y analiza tus gastos de
            manera fácil.
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-center justify-center px-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
              >
                Comenzar Gratis
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
              >
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-20 px-2 sm:px-0">
          <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <CardTitle className="text-lg sm:text-xl">
                Registro Fácil
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Añade tus gastos rápidamente con una interfaz intuitiva y
                categorías personalizables.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <CardTitle className="text-lg sm:text-xl">
                Análisis Visual
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Visualiza tus patrones de gasto con gráficos y reportes que te
                ayuden a tomar mejores decisiones.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300 md:col-span-1 col-span-1">
            <CardHeader className="pb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <CardTitle className="text-lg sm:text-xl">
                Siempre Disponible
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Accede a tus datos desde cualquier dispositivo. Tus gastos
                siempre sincronizados y seguros.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 sm:mt-20 bg-white rounded-lg p-6 sm:p-12 shadow-sm mx-2 sm:mx-0">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            ¿Listo para tomar control de tus finanzas?
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2">
            Únete ahora y comienza a gestionar tus gastos de manera inteligente.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg"
            >
              Crear mi cuenta gratuita
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8 mt-12 sm:mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm sm:text-base leading-relaxed">
            &copy; 2025 ExpenseTracker by Matias Carrizo. Control inteligente de
            gastos personales.
          </p>
        </div>
      </footer>
    </div>
  );
}

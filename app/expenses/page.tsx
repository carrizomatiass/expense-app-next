'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingCart,
  Car,
  Home,
  Gamepad2,
  Heart,
  GraduationCap,
  MoreHorizontal,
  Calendar,
  Filter,
} from 'lucide-react';

// Utilidades para formato de moneda argentina
function formatCurrencyAR(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatInputCurrency(value: string): string {
  const numbers = value.replace(/\D/g, '');
  if (!numbers) return '';
  const num = parseInt(numbers, 10);
  return formatCurrencyAR(num);
}

function parseCurrencyInput(value: string): number {
  const cleanValue = value.replace(/\./g, '');
  return parseInt(cleanValue, 10) || 0;
}

function isValidCurrency(value: string): boolean {
  const cleanValue = value.replace(/\./g, '');
  return /^\d+$/.test(cleanValue) && cleanValue.length > 0;
}

// Componente AuthHeader
interface User {
  email: string;
  name: string;
}

interface AuthHeaderProps {
  user?: User;
}

function AuthHeader({ user }: AuthHeaderProps) {
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
        window.location.href = '/login';
      } else {
        console.error('Error en logout');
        document.cookie =
          'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error al hacer logout:', error);
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

type Transaction = {
  description: string;
  amount: string;
  date: string;
  category?: string;
  type: 'expense' | 'income';
};

const categories = [
  {
    value: 'comida',
    label: '🍔 Comida',
    icon: <ShoppingCart className="h-4 w-4" />,
    color: 'bg-orange-500',
  },
  {
    value: 'transporte',
    label: '🚗 Transporte',
    icon: <Car className="h-4 w-4" />,
    color: 'bg-blue-500',
  },
  {
    value: 'hogar',
    label: '🏠 Hogar',
    icon: <Home className="h-4 w-4" />,
    color: 'bg-green-500',
  },
  {
    value: 'entretenimiento',
    label: '🎮 Entretenimiento',
    icon: <Gamepad2 className="h-4 w-4" />,
    color: 'bg-purple-500',
  },
  {
    value: 'salud',
    label: '💊 Salud',
    icon: <Heart className="h-4 w-4" />,
    color: 'bg-red-500',
  },
  {
    value: 'educacion',
    label: '📚 Educación',
    icon: <GraduationCap className="h-4 w-4" />,
    color: 'bg-indigo-500',
  },
  {
    value: 'otros',
    label: '💰 Otros',
    icon: <MoreHorizontal className="h-4 w-4" />,
    color: 'bg-gray-500',
  },
];

export default function EnhancedExpenseTracker() {
  const [user, setUser] = useState<User | undefined>();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState(''); // Para mostrar el formato con puntos
  const [category, setCategory] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');

  // Obtener información del usuario al cargar el componente
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch('/api/auth/me', { method: 'GET' });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };
    fetchUserInfo();
  }, []);

  // Manejar cambios en el input de monto
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedValue = formatInputCurrency(inputValue);
    setDisplayAmount(formattedValue);

    // Guardar el valor sin formato para enviar a la API
    const numericValue = parseCurrencyInput(formattedValue);
    setAmount(numericValue.toString());
  };

  // Función para convertir el amount string a número (compatible con formato anterior)
  const parseAmount = (amount: string) => {
    // Si es el nuevo formato (solo números), convertir directamente
    if (/^\d+$/.test(amount)) {
      return parseInt(amount, 10) || 0;
    }

    // Si es el formato anterior con puntos como separadores
    return parseFloat(amount.replace(/\./g, '').replace(/,/g, '.')) || 0;
  };

  // Calcular totales
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + parseAmount(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + parseAmount(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  // Obtener transacciones desde la API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch('/api/expense', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          const formattedTransactions = (data.expenses || []).map(
            (exp: Transaction) => ({
              ...exp,
              type: exp.type || 'expense',
            })
          );
          setTransactions(formattedTransactions);
        }
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
      setFetching(false);
    };
    fetchTransactions();
  }, []);

  const handleAddTransaction = async (
    e: React.MouseEvent,
    type: 'expense' | 'income'
  ) => {
    e.preventDefault();
    if (!description || !amount || !isValidCurrency(displayAmount)) return;
    if (type === 'expense' && !category) return;

    setLoading(true);
    try {
      const res = await fetch('/api/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          amount: amount, // Enviar sin formato (solo números)
          category: type === 'expense' ? category : 'income',
          type,
        }),
      });

      if (res.ok) {
        const newTransaction: Transaction = {
          description,
          amount: amount, // Guardar sin formato
          date: new Date().toISOString(),
          category: type === 'expense' ? category : 'income',
          type,
        };
        setTransactions([...transactions, newTransaction]);
        setDescription('');
        setAmount('');
        setDisplayAmount('');
        setCategory('');
      } else {
        console.error('Error adding transaction');
      }
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  // Calcular gastos por categoría
  const expensesByCategory = categories
    .map((cat) => ({
      ...cat,
      total: transactions
        .filter((t) => t.type === 'expense' && t.category === cat.value)
        .reduce((acc, t) => acc + parseAmount(t.amount), 0),
    }))
    .filter((cat) => cat.total > 0);

  // Filtrar transacciones
  const filteredTransactions = transactions.filter((transaction) => {
    const categoryMatch =
      filterCategory === 'all' || transaction.category === filterCategory;
    const periodMatch =
      filterPeriod === 'all' || isInPeriod(transaction.date, filterPeriod);
    return categoryMatch && periodMatch;
  });

  function isInPeriod(date: string, period: string): boolean {
    const transactionDate = new Date(date);
    const now = new Date();

    switch (period) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return transactionDate >= weekAgo;
      case 'month':
        return (
          transactionDate.getMonth() === now.getMonth() &&
          transactionDate.getFullYear() === now.getFullYear()
        );
      case 'year':
        return transactionDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  }

  function getCategoryLabel(categoryValue: string) {
    const cat = categories.find((c) => c.value === categoryValue);
    return cat ? cat.label : categoryValue;
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('es-AR');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con autenticación */}
      <AuthHeader user={user} />

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Control de Finanzas
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gestiona tus ingresos y gastos de manera inteligente
          </p>
        </div>

        {/* Cards de resumen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Balance Total
              </CardTitle>
              <Wallet className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-lg sm:text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                ${formatCurrencyAR(balance)}
              </div>
              <p className="text-xs text-muted-foreground">
                {balance >= 0 ? 'Saldo positivo' : 'Saldo negativo'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Ingresos
              </CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                ${formatCurrencyAR(totalIncome)}
              </div>
              <p className="text-xs text-muted-foreground">Total de ingresos</p>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Gastos
              </CardTitle>
              <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-red-600">
                ${formatCurrencyAR(totalExpenses)}
              </div>
              <p className="text-xs text-muted-foreground">Total de gastos</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerta de balance */}
        {balance < 0 && (
          <Alert className="border-red-200 bg-red-50">
            <TrendingDown className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Tu balance es negativo. Considera revisar tus gastos o aumentar
              tus ingresos.
            </AlertDescription>
          </Alert>
        )}

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          {/* Tabs responsivos */}
          <div className="w-full">
            {/* Vista desktop/tablet */}
            <TabsList className="hidden sm:grid w-full grid-cols-4">
              <TabsTrigger value="dashboard" className="text-xs sm:text-sm">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="add-expense" className="text-xs sm:text-sm">
                Agregar Gasto
              </TabsTrigger>
              <TabsTrigger value="add-income" className="text-xs sm:text-sm">
                Agregar Ingreso
              </TabsTrigger>
              <TabsTrigger value="transactions" className="text-xs sm:text-sm">
                Transacciones
              </TabsTrigger>
            </TabsList>

            {/* Vista móvil - Botones apilados */}
            <div className="sm:hidden space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'transactions'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Transacciones
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveTab('add-expense')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'add-expense'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  + Gasto
                </button>
                <button
                  onClick={() => setActiveTab('add-income')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'add-income'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  + Ingreso
                </button>
              </div>
            </div>
          </div>

          <TabsContent value="dashboard" className="space-y-4">
            {expensesByCategory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">
                    Gastos por Categoría
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Distribución de tus gastos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {expensesByCategory.map((category, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${category.color}`}
                          ></div>
                          <span className="text-xs sm:text-sm">
                            {category.label}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-sm sm:text-base">
                            ${formatCurrencyAR(category.total)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {totalExpenses > 0
                              ? Math.round(
                                  (category.total / totalExpenses) * 100
                                )
                              : 0}
                            %
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Últimas transacciones */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Últimas Transacciones
                </CardTitle>
                <CardDescription className="text-sm">
                  Tus movimientos más recientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {transactions
                    .slice(-5)
                    .reverse()
                    .map((transaction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          {transaction.type === 'income' ? (
                            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-xs sm:text-sm truncate">
                              {transaction.description}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <span className="hidden sm:inline">
                                {getCategoryLabel(transaction.category || '')}{' '}
                                •{' '}
                              </span>
                              {formatDate(transaction.date)}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`font-medium text-xs sm:text-sm flex-shrink-0 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}$
                          {formatCurrencyAR(parseAmount(transaction.amount))}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-expense">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Agregar Gasto
                </CardTitle>
                <CardDescription className="text-sm">
                  Registra un nuevo gasto con su categoría
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Descripción del gasto"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="text-sm sm:text-base"
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      placeholder="0"
                      value={displayAmount}
                      onChange={handleAmountChange}
                      className="text-sm sm:text-base pl-8"
                    />
                  </div>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="text-sm sm:text-base">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={(e) => handleAddTransaction(e, 'expense')}
                    disabled={loading || !isValidCurrency(displayAmount)}
                    className="w-full text-sm sm:text-base"
                  >
                    {loading ? 'Guardando...' : 'Agregar Gasto'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-income">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Agregar Ingreso
                </CardTitle>
                <CardDescription className="text-sm">
                  Registra un nuevo ingreso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Descripción del ingreso"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="text-sm sm:text-base"
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      placeholder="0"
                      value={displayAmount}
                      onChange={handleAmountChange}
                      className="text-sm sm:text-base pl-8"
                    />
                  </div>
                  <Button
                    onClick={(e) => handleAddTransaction(e, 'income')}
                    disabled={loading || !isValidCurrency(displayAmount)}
                    className="w-full text-sm sm:text-base"
                  >
                    {loading ? 'Guardando...' : 'Agregar Ingreso'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Todas las Transacciones
                </CardTitle>
                <CardDescription className="text-sm">
                  Historial completo con filtros
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filtros responsivos */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
                  <Select
                    value={filterCategory}
                    onValueChange={setFilterCategory}
                  >
                    <SelectTrigger className="w-full sm:w-48 text-sm">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filtrar por categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      <SelectItem value="income">Ingresos</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                    <SelectTrigger className="w-full sm:w-48 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filtrar por período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todo el tiempo</SelectItem>
                      <SelectItem value="week">Esta semana</SelectItem>
                      <SelectItem value="month">Este mes</SelectItem>
                      <SelectItem value="year">Este año</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tabla responsiva */}
                <div className="space-y-2">
                  {/* Vista desktop */}
                  <div className="hidden md:block">
                    <div className="bg-white rounded-lg border overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b">
                        <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-900">
                          <div>Tipo</div>
                          <div>Descripción</div>
                          <div>Categoría</div>
                          <div>Fecha</div>
                          <div className="text-right">Monto</div>
                        </div>
                      </div>
                      <div className="divide-y max-h-96 overflow-y-auto">
                        {fetching ? (
                          <div className="px-4 py-8 text-center text-gray-500">
                            Cargando...
                          </div>
                        ) : filteredTransactions.length === 0 ? (
                          <div className="px-4 py-8 text-center text-gray-500">
                            No hay transacciones que mostrar
                          </div>
                        ) : (
                          filteredTransactions
                            .reverse()
                            .map((transaction, idx) => (
                              <div
                                key={idx}
                                className="px-4 py-3 grid grid-cols-5 gap-4 items-center hover:bg-gray-50"
                              >
                                <div>
                                  <Badge
                                    variant={
                                      transaction.type === 'income'
                                        ? 'default'
                                        : 'secondary'
                                    }
                                  >
                                    {transaction.type === 'income'
                                      ? 'Ingreso'
                                      : 'Gasto'}
                                  </Badge>
                                </div>
                                <div className="font-medium text-sm">
                                  {transaction.description}
                                </div>
                                <div className="text-sm">
                                  {getCategoryLabel(transaction.category || '')}
                                </div>
                                <div className="text-sm">
                                  {formatDate(transaction.date)}
                                </div>
                                <div
                                  className={`text-right font-medium text-sm ${
                                    transaction.type === 'income'
                                      ? 'text-green-600'
                                      : 'text-red-600'
                                  }`}
                                >
                                  {transaction.type === 'income' ? '+' : '-'}$
                                  {formatCurrencyAR(
                                    parseAmount(transaction.amount)
                                  )}
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Vista móvil - Cards */}
                  <div className="md:hidden space-y-3">
                    {fetching ? (
                      <div className="text-center text-gray-500 py-8">
                        Cargando...
                      </div>
                    ) : filteredTransactions.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        No hay transacciones que mostrar
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {filteredTransactions
                          .reverse()
                          .map((transaction, idx) => (
                            <div
                              key={idx}
                              className="bg-white border rounded-lg p-3 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <Badge
                                  variant={
                                    transaction.type === 'income'
                                      ? 'default'
                                      : 'secondary'
                                  }
                                  className="text-xs"
                                >
                                  {transaction.type === 'income'
                                    ? 'Ingreso'
                                    : 'Gasto'}
                                </Badge>
                                <div
                                  className={`font-bold text-sm ${
                                    transaction.type === 'income'
                                      ? 'text-green-600'
                                      : 'text-red-600'
                                  }`}
                                >
                                  {transaction.type === 'income' ? '+' : '-'}$
                                  {formatCurrencyAR(
                                    parseAmount(transaction.amount)
                                  )}
                                </div>
                              </div>
                              <div className="text-sm font-medium">
                                {transaction.description}
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>
                                  {getCategoryLabel(transaction.category || '')}
                                </span>
                                <span>{formatDate(transaction.date)}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

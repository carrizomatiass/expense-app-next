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
  Plus,
  Minus,
  Menu,
  X,
} from 'lucide-react';

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

interface User {
  email: string;
  name: string;
}

interface AuthHeaderProps {
  user?: User;
}

function AuthHeader({ user }: AuthHeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setShowUserMenu(false);
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
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              Control de Gastos
            </h1>
          </div>

          <div className="hidden sm:flex items-center space-x-4">
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

          <div className="sm:hidden relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Menú de usuario"
            >
              {showUserMenu ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                {user && (
                  <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-100">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {user.email}
                    </div>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
                </button>
              </div>
            )}
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
  const [displayAmount, setDisplayAmount] = useState('');
  const [category, setCategory] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');

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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedValue = formatInputCurrency(inputValue);
    setDisplayAmount(formattedValue);

    const numericValue = parseCurrencyInput(formattedValue);
    setAmount(numericValue.toString());
  };

  const parseAmount = (amount: string) => {
    if (/^\d+$/.test(amount)) {
      return parseInt(amount, 10) || 0;
    }

    return parseFloat(amount.replace(/\./g, '').replace(/,/g, '.')) || 0;
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + parseAmount(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + parseAmount(t.amount), 0);

  const balance = totalIncome - totalExpenses;

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
          amount: amount,
          category: type === 'expense' ? category : 'income',
          type,
        }),
      });

      if (res.ok) {
        const newTransaction: Transaction = {
          description,
          amount: amount,
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

  const expensesByCategory = categories
    .map((cat) => ({
      ...cat,
      total: transactions
        .filter((t) => t.type === 'expense' && t.category === cat.value)
        .reduce((acc, t) => acc + parseAmount(t.amount), 0),
    }))
    .filter((cat) => cat.total > 0);

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
      <AuthHeader user={user} />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-6 space-y-4 sm:space-y-6 pb-safe">
        <div className="text-center space-y-1 sm:space-y-2 py-2 sm:py-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Control de Finanzas
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Gestiona tus ingresos y gastos de manera inteligente
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Balance Total
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-xl sm:text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                ${formatCurrencyAR(balance)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {balance >= 0 ? 'Saldo positivo' : 'Saldo negativo'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                ${formatCurrencyAR(totalIncome)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total de ingresos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gastos</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-red-600">
                ${formatCurrencyAR(totalExpenses)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total de gastos
              </p>
            </CardContent>
          </Card>
        </div>

        {balance < 0 && (
          <Alert className="border-red-200 bg-red-50">
            <TrendingDown className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 text-sm">
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
          <div className="w-full">
            <TabsList className="hidden sm:grid w-full grid-cols-4 h-10">
              <TabsTrigger value="dashboard" className="text-sm">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="add-expense" className="text-sm">
                Agregar Gasto
              </TabsTrigger>
              <TabsTrigger value="add-income" className="text-sm">
                Agregar Ingreso
              </TabsTrigger>
              <TabsTrigger value="transactions" className="text-sm">
                Transacciones
              </TabsTrigger>
            </TabsList>

            <div className="sm:hidden">
              <div className="pb-20"></div>
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 py-2 safe-area-inset-bottom">
                <div className="max-w-6xl mx-auto">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === 'dashboard'
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => setActiveTab('transactions')}
                      className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === 'transactions'
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Historial
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActiveTab('add-expense')}
                      className={`flex items-center justify-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === 'add-expense'
                          ? 'bg-red-500 text-white shadow-lg'
                          : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                    >
                      <Minus className="h-4 w-4 mr-2" />
                      Gasto
                    </button>
                    <button
                      onClick={() => setActiveTab('add-income')}
                      className={`flex items-center justify-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === 'add-income'
                          ? 'bg-green-500 text-white shadow-lg'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ingreso
                    </button>
                  </div>
                </div>
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
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div
                            className={`w-3 h-3 rounded-full flex-shrink-0 ${category.color}`}
                          ></div>
                          <span className="text-sm font-medium truncate">
                            {category.label}
                          </span>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="font-semibold text-sm">
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
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="flex-shrink-0">
                            {transaction.type === 'income' ? (
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm truncate">
                              {transaction.description}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center space-x-1">
                              <span className="hidden xs:inline">
                                {getCategoryLabel(transaction.category || '')}
                              </span>
                              <span className="hidden xs:inline">•</span>
                              <span>{formatDate(transaction.date)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right ml-2">
                          <div
                            className={`font-bold text-sm ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {transaction.type === 'income' ? '+' : '-'}$
                            {formatCurrencyAR(parseAmount(transaction.amount))}
                          </div>
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
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Descripción
                    </label>
                    <Input
                      placeholder="¿En qué gastaste?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="text-base h-12"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Monto
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                        $
                      </span>
                      <Input
                        placeholder="0"
                        value={displayAmount}
                        onChange={handleAmountChange}
                        className="text-base h-12 pl-8 text-lg"
                        inputMode="numeric"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Categoría
                    </label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="text-base h-12">
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem
                            key={cat.value}
                            value={cat.value}
                            className="text-base py-3"
                          >
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={(e) => handleAddTransaction(e, 'expense')}
                    disabled={
                      loading ||
                      !isValidCurrency(displayAmount) ||
                      !description ||
                      !category
                    }
                    className="w-full text-base h-12 font-medium mt-6"
                    size="lg"
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
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Descripción
                    </label>
                    <Input
                      placeholder="¿De dónde viene este ingreso?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="text-base h-12"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Monto
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                        $
                      </span>
                      <Input
                        placeholder="0"
                        value={displayAmount}
                        onChange={handleAmountChange}
                        className="text-base h-12 pl-8 text-lg"
                        inputMode="numeric"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={(e) => handleAddTransaction(e, 'income')}
                    disabled={
                      loading || !isValidCurrency(displayAmount) || !description
                    }
                    className="w-full text-base h-12 font-medium mt-6"
                    size="lg"
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
                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Categoría
                      </label>
                      <Select
                        value={filterCategory}
                        onValueChange={setFilterCategory}
                      >
                        <SelectTrigger className="text-sm h-10">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Filtrar por categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            Todas las categorías
                          </SelectItem>
                          <SelectItem value="income">Ingresos</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Período
                      </label>
                      <Select
                        value={filterPeriod}
                        onValueChange={setFilterPeriod}
                      >
                        <SelectTrigger className="text-sm h-10">
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
                  </div>
                </div>

                <div className="space-y-2">
                  {fetching ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <p className="text-sm text-gray-500">
                        Cargando transacciones...
                      </p>
                    </div>
                  ) : filteredTransactions.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">
                        No hay transacciones que mostrar
                      </p>
                      <p className="text-gray-400 text-xs">
                        Intenta cambiar los filtros o agrega una nueva
                        transacción
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-2 border-b">
                        <span>{filteredTransactions.length} transacciones</span>
                        <div className="flex space-x-2">
                          {filterCategory !== 'all' && (
                            <Badge variant="secondary" className="text-xs">
                              {getCategoryLabel(filterCategory)}
                            </Badge>
                          )}
                          {filterPeriod !== 'all' && (
                            <Badge variant="secondary" className="text-xs">
                              {filterPeriod === 'week'
                                ? 'Esta semana'
                                : filterPeriod === 'month'
                                  ? 'Este mes'
                                  : filterPeriod === 'year'
                                    ? 'Este año'
                                    : filterPeriod}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="max-h-96 overflow-y-auto space-y-2">
                        {filteredTransactions
                          .slice()
                          .reverse()
                          .map((transaction, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-all duration-200 active:scale-98"
                            >
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <div className="flex-shrink-0">
                                  {transaction.type === 'income' ? (
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                      <TrendingUp className="h-5 w-5 text-green-600" />
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                      <TrendingDown className="h-5 w-5 text-red-600" />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="min-w-0 flex-1">
                                      <h4 className="font-medium text-sm truncate mb-1">
                                        {transaction.description}
                                      </h4>
                                      <div className="flex items-center text-xs text-gray-500 space-x-2">
                                        <span className="flex items-center">
                                          {getCategoryLabel(
                                            transaction.category || ''
                                          )}
                                        </span>
                                        <span>•</span>
                                        <span>
                                          {formatDate(transaction.date)}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-right ml-3 flex-shrink-0">
                                      <div
                                        className={`font-bold text-base ${
                                          transaction.type === 'income'
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                        }`}
                                      >
                                        {transaction.type === 'income'
                                          ? '+'
                                          : '-'}
                                        $
                                        {formatCurrencyAR(
                                          parseAmount(transaction.amount)
                                        )}
                                      </div>
                                      <Badge
                                        variant={
                                          transaction.type === 'income'
                                            ? 'default'
                                            : 'secondary'
                                        }
                                        className="text-xs mt-1"
                                      >
                                        {transaction.type === 'income'
                                          ? 'Ingreso'
                                          : 'Gasto'}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

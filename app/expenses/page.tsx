"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  Filter
} from "lucide-react";

type Transaction = {
  description: string;
  amount: string;
  date: string;
  category?: string;
  type: 'expense' | 'income';
};

const categories = [
  { value: "comida", label: "🍔 Comida", icon: <ShoppingCart className="h-4 w-4" />, color: "bg-orange-500" },
  { value: "transporte", label: "🚗 Transporte", icon: <Car className="h-4 w-4" />, color: "bg-blue-500" },
  { value: "hogar", label: "🏠 Hogar", icon: <Home className="h-4 w-4" />, color: "bg-green-500" },
  { value: "entretenimiento", label: "🎮 Entretenimiento", icon: <Gamepad2 className="h-4 w-4" />, color: "bg-purple-500" },
  { value: "salud", label: "💊 Salud", icon: <Heart className="h-4 w-4" />, color: "bg-red-500" },
  { value: "educacion", label: "📚 Educación", icon: <GraduationCap className="h-4 w-4" />, color: "bg-indigo-500" },
  { value: "otros", label: "💰 Otros", icon: <MoreHorizontal className="h-4 w-4" />, color: "bg-gray-500" }
];

export default function EnhancedExpenseTracker() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all");

  // Calcular totales (removiendo puntos para números argentinos)
  const parseAmount = (amount: string) => {
    // Remueve puntos de separadores de miles y convierte a número
    return parseFloat(amount.replace(/\./g, '').replace(/,/g, '.')) || 0;
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + parseAmount(t.amount), 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + parseAmount(t.amount), 0);
    
  const balance = totalIncome - totalExpenses;

  // Obtener transacciones desde la API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/expense", { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          const formattedTransactions = (data.expenses || []).map((exp: Transaction) => ({
            ...exp,
            type: exp.type || 'expense' // Por compatibilidad con datos existentes
          }));
          setTransactions(formattedTransactions);
        } else {
          
        }
      } catch (err) {
        
      }
      setFetching(false);
    };
    fetchTransactions();
  }, []);

  const handleAddTransaction = async (e: React.MouseEvent, type: 'expense' | 'income') => {
    e.preventDefault();
    if (!description || !amount) return;
    if (type === 'expense' && !category) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          description, 
          amount, 
          category: type === 'expense' ? category : 'income',
          type 
        }),
      });
      
      if (res.ok) {
        const newTransaction: Transaction = {
          description,
          amount,
          date: new Date().toISOString(),
          category: type === 'expense' ? category : 'income',
          type
        };
        setTransactions([...transactions, newTransaction]);
        setDescription("");
        setAmount("");
        setCategory("");
      } else {
       
      }
    } catch (err) {
      
    }
    setLoading(false);
  };

  // Calcular gastos por categoría
  const expensesByCategory = categories.map(cat => ({
    ...cat,
    total: transactions
      .filter(t => t.type === 'expense' && t.category === cat.value)
      .reduce((acc, t) => acc + parseAmount(t.amount), 0)
  })).filter(cat => cat.total > 0);

  // Filtrar transacciones
  const filteredTransactions = transactions.filter(transaction => {
    const categoryMatch = filterCategory === 'all' || transaction.category === filterCategory;
    const periodMatch = filterPeriod === 'all' || isInPeriod(transaction.date, filterPeriod);
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
        return transactionDate.getMonth() === now.getMonth() && 
               transactionDate.getFullYear() === now.getFullYear();
      case 'year':
        return transactionDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  }

  function getCategoryLabel(categoryValue: string) {
    const cat = categories.find(c => c.value === categoryValue);
    return cat ? cat.label : categoryValue;
  }

  function formatCurrency(amount: number) {
    return amount.toLocaleString('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('es-AR');
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Control de Finanzas</h1>
        <p className="text-muted-foreground">Gestiona tus ingresos y gastos de manera inteligente</p>
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance Total</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${formatCurrency(balance)}
            </div>
            <p className="text-xs text-muted-foreground">
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
            <div className="text-2xl font-bold text-green-600">
              ${formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
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
            <div className="text-2xl font-bold text-red-600">
              ${formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de gastos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerta de balance */}
      {balance < 0 && (
        <Alert className="border-red-200 bg-red-50">
          <TrendingDown className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Tu balance es negativo. Considera revisar tus gastos o aumentar tus ingresos.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="add-expense">Agregar Gasto</TabsTrigger>
          <TabsTrigger value="add-income">Agregar Ingreso</TabsTrigger>
          <TabsTrigger value="transactions">Transacciones</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          {expensesByCategory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Gastos por Categoría</CardTitle>
                <CardDescription>Distribución de tus gastos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expensesByCategory.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                        <span className="text-sm">{category.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${formatCurrency(category.total)}</div>
                        <div className="text-xs text-muted-foreground">
                          {totalExpenses > 0 ? Math.round((category.total / totalExpenses) * 100) : 0}%
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
              <CardTitle>Últimas Transacciones</CardTitle>
              <CardDescription>Tus movimientos más recientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {transactions.slice(-5).reverse().map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <div className="flex items-center space-x-2">
                      {transaction.type === 'income' ? 
                        <TrendingUp className="h-4 w-4 text-green-500" /> : 
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      }
                      <div>
                        <div className="font-medium text-sm">{transaction.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {getCategoryLabel(transaction.category || '')} • {formatDate(transaction.date)}
                        </div>
                      </div>
                    </div>
                    <div className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}${formatCurrency(parseAmount(transaction.amount))}
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
              <CardTitle>Agregar Gasto</CardTitle>
              <CardDescription>Registra un nuevo gasto con su categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <div onSubmit={(e) => handleAddTransaction(e, 'expense')} className="space-y-4">
                <Input
                  placeholder="Descripción del gasto"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Monto"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
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
                  disabled={loading} 
                  className="w-full"
                >
                  {loading ? "Guardando..." : "Agregar Gasto"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-income">
          <Card>
            <CardHeader>
              <CardTitle>Agregar Ingreso</CardTitle>
              <CardDescription>Registra un nuevo ingreso</CardDescription>
            </CardHeader>
            <CardContent>
              <div onSubmit={(e) => handleAddTransaction(e, 'income')} className="space-y-4">
                <Input
                  placeholder="Descripción del ingreso"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Monto"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Button 
                  onClick={(e) => handleAddTransaction(e, 'income')} 
                  disabled={loading} 
                  className="w-full"
                >
                  {loading ? "Guardando..." : "Agregar Ingreso"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Todas las Transacciones</CardTitle>
              <CardDescription>Historial completo con filtros</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="flex gap-4 mb-4">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-48">
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
                  <SelectTrigger className="w-48">
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

              <div className="overflow-x-auto">
                <div className="min-w-full bg-white rounded-lg border">
                  <div className="bg-gray-50 px-6 py-3 border-b">
                    <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-900">
                      <div>Tipo</div>
                      <div>Descripción</div>
                      <div>Categoría</div>
                      <div>Fecha</div>
                      <div className="text-right">Monto</div>
                    </div>
                  </div>
                  <div className="divide-y">
                    {fetching ? (
                      <div className="px-6 py-4 text-center text-gray-500">
                        Cargando...
                      </div>
                    ) : filteredTransactions.length === 0 ? (
                      <div className="px-6 py-4 text-center text-gray-500">
                        No hay transacciones que mostrar
                      </div>
                    ) : (
                      filteredTransactions.reverse().map((transaction, idx) => (
                        <div key={idx} className="px-6 py-4 grid grid-cols-5 gap-4 items-center hover:bg-gray-50">
                          <div>
                            <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'}>
                              {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                            </Badge>
                          </div>
                          <div className="font-medium text-sm">{transaction.description}</div>
                          <div className="text-sm">{getCategoryLabel(transaction.category || '')}</div>
                          <div className="text-sm">{formatDate(transaction.date)}</div>
                          <div className={`text-right font-medium text-sm ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}${formatCurrency(parseAmount(transaction.amount))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
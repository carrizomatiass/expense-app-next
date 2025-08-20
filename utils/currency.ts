// utils/currency.ts

/**
 * Formatea un número para mostrar en formato argentino
 * Ejemplo: 1200000 → "1.200.000"
 */
export function formatCurrencyAR(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formatea un input mientras el usuario escribe
 * Agrega puntos automáticamente como separadores de miles
 * Ejemplo: "1200000" → "1.200.000"
 */
export function formatInputCurrency(value: string): string {
  // Remover todo excepto números
  const numbers = value.replace(/\D/g, '');

  // Si está vacío, retornar vacío
  if (!numbers) return '';

  // Convertir a número y formatear
  const num = parseInt(numbers, 10);
  return formatCurrencyAR(num);
}

/**
 * Convierte el valor formateado del input a número
 * Ejemplo: "1.200.000" → 1200000
 */
export function parseCurrencyInput(value: string): number {
  // Remover puntos separadores de miles
  const cleanValue = value.replace(/\./g, '');
  return parseInt(cleanValue, 10) || 0;
}

/**
 * Valida si un string de moneda es válido
 */
export function isValidCurrency(value: string): boolean {
  // Debe contener solo números y puntos
  const cleanValue = value.replace(/\./g, '');
  return /^\d+$/.test(cleanValue) && cleanValue.length > 0;
}

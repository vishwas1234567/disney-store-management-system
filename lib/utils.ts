/**
 * Formats a currency value.
 * @param amount - The numeric value.
 * @param currency - The currency string (default 'USD')
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

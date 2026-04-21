/**
 * Format a number as currency (USD)
 */
export const formatCurrency = (amount: number, decimals = 2): string => {
  return `$${amount.toFixed(decimals)}`
}

/**
 * Format a number with thousand separators
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

/**
 * Capitalize first letter of a string
 */
export const capitalize = (str: string): string => {
  if (!str) return ''
  return str.charAt(0) + str.slice(1).toLowerCase()
}

/**
 * Calculate percentage of a value against total
 */
export const calcPercent = (value: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

/**
 * Truncate a string to a max length with ellipsis
 */
export const truncate = (str: string, max: number): string => {
  if (str.length <= max) return str
  return str.slice(0, max - 1) + '…'
}

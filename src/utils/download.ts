/** Small helpers for exporting table data as a downloadable CSV file. */

/** Escape a single CSV cell — wraps in quotes when it contains a comma, quote or newline. */
const escapeCell = (value: string | number | boolean): string => {
  const s = String(value ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** Build a CSV string from a header row and data rows. */
export const toCsv = (headers: string[], rows: (string | number | boolean)[][]): string =>
  [headers, ...rows].map((row) => row.map(escapeCell).join(',')).join('\n')

/**
 * Trigger a browser download of `content` as a file. Defaults to CSV.
 * Falls back gracefully — does nothing in a non-DOM environment.
 */
export const downloadFile = (filename: string, content: string, mime = 'text/csv;charset=utf-8') => {
  if (typeof document === 'undefined') return
  // Prepend a BOM so Excel opens UTF-8 correctly.
  const blob = new Blob(['﻿', content], { type: mime })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/** Convenience: build a CSV and download it in one call. */
export const downloadCsv = (filename: string, headers: string[], rows: (string | number | boolean)[][]) =>
  downloadFile(filename, toCsv(headers, rows))

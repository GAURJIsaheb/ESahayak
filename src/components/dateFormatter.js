// utils/dateFormatter.js
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // "2025-09-12" (YYYY-MM-DD)
}

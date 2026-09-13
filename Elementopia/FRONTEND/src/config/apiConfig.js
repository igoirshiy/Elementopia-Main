/**
 * Centralized API configuration.
 * Defaults to 'http://localhost:8080' for local development,
 * and uses VITE_API_URL when provided in production environments.
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:8080'
).replace(/\/$/, '');

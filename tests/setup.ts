import '@testing-library/jest-dom/vitest'

// Mock environment variables for tests
process.env = {
  ...process.env,
  NODE_ENV: 'test',
  NEXTAUTH_SECRET: 'test-secret',
  NEXTAUTH_URL: 'http://localhost:3000',
  JWT_SECRET: 'test-jwt-secret-key-must-be-at-least-32-characters-long',
  JWT_REFRESH_SECRET: 'test-jwt-refresh-secret-key-must-be-at-least-32-characters-long',
}
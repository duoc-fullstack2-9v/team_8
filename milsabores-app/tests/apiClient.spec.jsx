import { describe, test, expect, vi, beforeEach } from 'vitest';
import apiClient from '../src/services/apiClient';

// Mock simple de localStorage
const localStorageMock = {
  store: {},
  getItem(key) {
    return this.store[key] ?? null;
  },
  setItem(key, value) {
    this.store[key] = String(value);
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  },
};

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('apiClient (axios configurado)', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('usa la baseURL correcta al crear la instancia', () => {
    // Leemos directamente del apiClient real
    expect(apiClient.defaults.baseURL).toBe('http://localhost:8081/api/v1');
  });

  test('interceptor NO agrega Authorization si no hay token en localStorage', () => {
    // axios guarda los interceptores en un arreglo handlers
    const handler = apiClient.interceptors.request.handlers[0];

    expect(handler).toBeTruthy();
    expect(typeof handler.fulfilled).toBe('function');

    const configInicial = { headers: {} };

    const configFinal = handler.fulfilled(configInicial);

    expect(configFinal.headers.Authorization).toBeUndefined();
  });

  test('interceptor agrega Authorization Bearer <token> cuando existe token', () => {
    localStorage.setItem('token', 'fake.jwt.token');

    const handler = apiClient.interceptors.request.handlers[0];

    expect(handler).toBeTruthy();
    expect(typeof handler.fulfilled).toBe('function');

    const configInicial = { headers: {} };

    const configFinal = handler.fulfilled(configInicial);

    expect(configFinal.headers.Authorization).toBe('Bearer fake.jwt.token');
  });
});

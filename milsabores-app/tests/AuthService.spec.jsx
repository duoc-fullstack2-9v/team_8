import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/services/apiClient', () => ({
  default: {
    post: vi.fn(),
  },
}));

import apiClient from '../src/services/apiClient';
import { loginRequest } from '../src/services/AuthService';

describe('AuthService - loginRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('llama a POST /auth/login con email y password y devuelve data', async () => {
    const emailUsuario = 'rene@garrido.cl';
    const passwordUsuario = 'secreto123';

    const mockResponse = {
      tipo: 'Bearer',
      token: 'fake.jwt.token',
      usuario: {
        idUsuario: 5,
        nombreUsuario: 'Rene',
        rolUsuario: 'CLIENTE',
      },
    };

    apiClient.post.mockResolvedValueOnce({ data: mockResponse });

    const res = await loginRequest(emailUsuario, passwordUsuario);

    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
      emailUsuario,
      passwordUsuario,
    });

    expect(res).toEqual(mockResponse);
  });
});

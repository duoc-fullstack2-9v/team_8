// tests/UsuariosService.spec.js
import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/services/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import apiClient from '../src/services/apiClient';
import {
  getUsuarios,
  getUsuarioById,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  getUsuarioPorEmail,
  getUsuariosPorRol,
  getClientes,
  getAdministradores,
  usuarioExists,
} from '../src/services/UsuariosService';

describe('UsuariosService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('getUsuarios llama a GET /usuarios y devuelve data', async () => {
    const mockData = [{ idUsuario: 1 }];
    apiClient.get.mockResolvedValueOnce({ data: mockData });

    const res = await getUsuarios();

    expect(apiClient.get).toHaveBeenCalledWith('/usuarios');
    expect(res).toEqual(mockData);
  });

  test('getUsuarioById llama a GET /usuarios/{id}', async () => {
    const mockData = { idUsuario: 5 };
    apiClient.get.mockResolvedValueOnce({ data: mockData });

    const res = await getUsuarioById(5);

    expect(apiClient.get).toHaveBeenCalledWith('/usuarios/5');
    expect(res).toEqual(mockData);
  });

  test('crearUsuario llama a POST /usuarios con el body correcto', async () => {
    const body = { nombreUsuario: 'Rene' };
    const mockData = { idUsuario: 10, ...body };

    apiClient.post.mockResolvedValueOnce({ data: mockData });

    const res = await crearUsuario(body);

    expect(apiClient.post).toHaveBeenCalledWith('/usuarios', body);
    expect(res).toEqual(mockData);
  });

  test('actualizarUsuario llama a PUT /usuarios/{id} con body', async () => {
    const body = { nombreUsuario: 'Editado' };
    const mockData = { idUsuario: 3, ...body };

    apiClient.put.mockResolvedValueOnce({ data: mockData });

    const res = await actualizarUsuario(3, body);

    expect(apiClient.put).toHaveBeenCalledWith('/usuarios/3', body);
    expect(res).toEqual(mockData);
  });

  test('eliminarUsuario llama a DELETE /usuarios/{id}', async () => {
    const mockData = 'Usuario eliminado correctamente';
    apiClient.delete.mockResolvedValueOnce({ data: mockData });

    const res = await eliminarUsuario(7);

    expect(apiClient.delete).toHaveBeenCalledWith('/usuarios/7');
    expect(res).toBe(mockData);
  });

  test('getUsuarioPorEmail llama a GET /usuarios/email/{email}', async () => {
    const email = 'rene@garrido.cl';
    const mockData = { idUsuario: 1, emailUsuario: email };

    apiClient.get.mockResolvedValueOnce({ data: mockData });

    const res = await getUsuarioPorEmail(email);

    expect(apiClient.get).toHaveBeenCalledWith(
      `/usuarios/email/${encodeURIComponent(email)}`
    );
    expect(res).toEqual(mockData);
  });

  test('getUsuariosPorRol llama a GET /usuarios/rol/{rol}', async () => {
    const mockData = [{ idUsuario: 2, rolUsuario: 'ADMIN' }];

    apiClient.get.mockResolvedValueOnce({ data: mockData });

    const res = await getUsuariosPorRol('ADMIN');

    expect(apiClient.get).toHaveBeenCalledWith('/usuarios/rol/ADMIN');
    expect(res).toEqual(mockData);
  });

  test('getClientes llama a GET /usuarios/clientes', async () => {
    const mockData = [{ idUsuario: 3, rolUsuario: 'CLIENTE' }];
    apiClient.get.mockResolvedValueOnce({ data: mockData });

    const res = await getClientes();

    expect(apiClient.get).toHaveBeenCalledWith('/usuarios/clientes');
    expect(res).toEqual(mockData);
  });

  test('getAdministradores llama a GET /usuarios/administradores', async () => {
    const mockData = [{ idUsuario: 1, rolUsuario: 'ADMIN' }];
    apiClient.get.mockResolvedValueOnce({ data: mockData });

    const res = await getAdministradores();

    expect(apiClient.get).toHaveBeenCalledWith('/usuarios/administradores');
    expect(res).toEqual(mockData);
  });

  test('usuarioExists llama a GET /usuarios/{id}/exists y devuelve boolean', async () => {
    apiClient.get.mockResolvedValueOnce({ data: true });

    const res = await usuarioExists(9);

    expect(apiClient.get).toHaveBeenCalledWith('/usuarios/9/exists');
    expect(res).toBe(true);
  });
});

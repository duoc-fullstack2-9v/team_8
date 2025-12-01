import apiClient from './apiClient';

// 🔹 GET /api/v1/usuarios
export const getUsuarios = async () => {
  const res = await apiClient.get('/usuarios');
  return res.data;
};

// 🔹 GET /api/v1/usuarios/{id}
export const getUsuarioById = async (idUsuario) => {
  const res = await apiClient.get(`/usuarios/${idUsuario}`);
  return res.data;
};

// 🔹 POST /api/v1/usuarios
export const crearUsuario = async (usuarioCreateDTO) => {
  const res = await apiClient.post('/usuarios', usuarioCreateDTO);
  return res.data;
};

// 🔹 PUT /api/v1/usuarios/{id}
export const actualizarUsuario = async (idUsuario, usuarioCreateDTO) => {
  const res = await apiClient.put(`/usuarios/${idUsuario}`, usuarioCreateDTO);
  return res.data;
};

// 🔹 DELETE /api/v1/usuarios/{id}
export const eliminarUsuario = async (idUsuario) => {
  const res = await apiClient.delete(`/usuarios/${idUsuario}`);
  return res.data; // "Usuario eliminado correctamente"
};

// 🔹 GET /api/v1/usuarios/email/{email}
export const getUsuarioPorEmail = async (emailUsuario) => {
  const res = await apiClient.get(`/usuarios/email/${encodeURIComponent(emailUsuario)}`);
  return res.data;
};

// 🔹 GET /api/v1/usuarios/rol/{rol}
export const getUsuariosPorRol = async (rolUsuario) => {
  const res = await apiClient.get(`/usuarios/rol/${rolUsuario}`);
  return res.data;
};

// 🔹 GET /api/v1/usuarios/clientes
export const getClientes = async () => {
  const res = await apiClient.get('/usuarios/clientes');
  return res.data;
};

// 🔹 GET /api/v1/usuarios/administradores
export const getAdministradores = async () => {
  const res = await apiClient.get('/usuarios/administradores');
  return res.data;
};

// 🔹 GET /api/v1/usuarios/{id}/exists
export const usuarioExists = async (idUsuario) => {
  const res = await apiClient.get(`/usuarios/${idUsuario}/exists`);
  return res.data; // boolean
};

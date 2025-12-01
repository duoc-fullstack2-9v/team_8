import apiClient from './apiClient';

// Ajusta la URL o los nombres de campos según tu AuthController
export const loginRequest = async (emailUsuario, passwordUsuario) => {
  const res = await apiClient.post('/auth/login', {
    emailUsuario,      
    passwordUsuario,    
  });
  return res.data;
};

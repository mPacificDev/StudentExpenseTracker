import apiClient from './apiClient';

export const authService = {
  register: async (name, email, password, confirmPassword) => {
    const response = await apiClient.post('/auth/register', {
      name,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },
};

export default authService;

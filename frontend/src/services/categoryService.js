import apiClient from './apiClient';

export const categoryService = {
  getAll: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  getByType: async (type) => {
    const response = await apiClient.get(`/categories/${type}`);
    return response.data;
  },
};

export default categoryService;

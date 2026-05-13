import apiClient from './apiClient';

export const transactionService = {
  getAll: async () => {
    const response = await apiClient.get('/transactions');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/transactions/${id}`);
    return response.data;
  },

  create: async (transactionData) => {
    const response = await apiClient.post('/transactions', transactionData);
    return response.data;
  },

  update: async (id, transactionData) => {
    const response = await apiClient.put(`/transactions/${id}`, transactionData);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/transactions/${id}`);
    return response.data;
  },

  getIncome: async () => {
    const response = await apiClient.get('/transactions/income');
    return response.data;
  },

  getExpense: async () => {
    const response = await apiClient.get('/transactions/expense');
    return response.data;
  },

  getByDateRange: async (startDate, endDate) => {
    const response = await apiClient.get('/transactions/date-range', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};

export default transactionService;

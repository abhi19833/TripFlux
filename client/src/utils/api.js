import axios from "axios";

const api = axios.create({
  baseURL: "https://tripflux-j04l.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export const getExpenses = async () => {
  const res = await api.get("/expenses");
  return res.data;
};

export const getExpenseById = async (id) => {
  const res = await api.get(`/expenses/${id}`);
  return res.data;
};

export const createExpense = async (expenseData) => {
  const res = await api.post("/expenses", expenseData);
  return res.data;
};

export const updateExpense = async (id, expenseData) => {
  const res = await api.put(`/expenses/${id}`, expenseData);
  return res.data;
};

export const deleteExpense = async (id) => {
  const res = await api.delete(`/expenses/${id}`);
  return res.data;
};

export const getTravelLogs = async () => {
  const res = await api.get("/travelLogs");
  return res.data;
};

export const getMedia = async () => {
  const res = await api.get("/media");
  return res.data;
};

export const getMediaById = async (id) => {
  const res = await api.get(`/media/${id}`);
  return res.data;
};

export const createMedia = async (mediaData) => {
  const res = await api.post("/media", mediaData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateMedia = async (id, mediaData) => {
  const res = await api.put(`/media/${id}`, mediaData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteMedia = async (id) => {
  const res = await api.delete(`/media/${id}`);
  return res.data;
};

export default api;

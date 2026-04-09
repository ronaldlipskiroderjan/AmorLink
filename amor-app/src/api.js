import axios from 'axios';

/**
 * Cliente axios pré-configurado para a API de amor 💕
 * Usando proxy do Vite (vite.config.js) então não precisa colocar o host aqui.
 * O interceptor adiciona automaticamente o token JWT em todas as requisições.
 */
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========================= INTERCEPTOR JWT =========================

/** Adiciona o token em todas as requisições automaticamente */
api.interceptors.request.use(config => {
  const token = localStorage.getItem('amor_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========================= AUTENTICAÇÃO =========================

/** Faz login e retorna { token, role, username } */
export const loginUser = (credentials) =>
  api.post('/auth/login', credentials).then(r => r.data);

// ========================= CASAL =========================

export const getCoupleInfo = () => api.get('/couple-info').then(r => r.data);

// ========================= LINHA DO TEMPO =========================

export const getTimeline  = () => api.get('/timeline').then(r => r.data);
export const addMoment    = (moment) => api.post('/timeline', moment).then(r => r.data);
export const deleteMoment = (id) => api.delete(`/timeline/${id}`);

// ========================= POTINHO DE AMOR =========================

export const getRandomLoveReason = () => api.get('/love-reasons/random').then(r => r.data);
export const getAllLoveReasons    = () => api.get('/love-reasons').then(r => r.data);
export const addLoveReason       = (data) => api.post('/love-reasons', data).then(r => r.data);
export const deleteLoveReason    = (id) => api.delete(`/love-reasons/${id}`);

// ========================= CUPONS =========================

export const getCoupons     = () => api.get('/coupons').then(r => r.data);
export const addCoupon      = (data) => api.post('/coupons', data).then(r => r.data);
export const deleteCoupon   = (id) => api.delete(`/coupons/${id}`);
export const redeemCoupon   = (id) => api.patch(`/coupons/${id}/redeem`).then(r => r.data);
export const unredeemCoupon = (id) => api.patch(`/coupons/${id}/unredeem`).then(r => r.data);

// ========================= TEXTOS =========================

export const getTexts    = () => api.get('/textos').then(r => r.data);
export const addText     = (textData) => api.post('/textos', textData).then(r => r.data);
export const deleteTexto = (id) => api.delete(`/textos/${id}`);

export default api;

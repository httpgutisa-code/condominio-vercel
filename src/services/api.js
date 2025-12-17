import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const auth = {
    login: (username, password) => api.post('token/', { username, password }),
};

// Residentes
export const residentes = {
    getAll: () => api.get('residentes/'),
    getById: (id) => api.get(`residentes/${id}/`),
    create: (data) => api.post('residentes/', data),
    update: (id, data) => api.put(`residentes/${id}/`, data),
    patch: (id, data) => api.patch(`residentes/${id}/`, data),
    delete: (id) => api.delete(`residentes/${id}/`),
    actualizarScoreIA: (id, score) => api.post(`residentes/${id}/actualizar-score-ia/`, { score_morosidad_ia: score }),
};

// Unidades Habitacionales
export const unidadesHabitacionales = {
    getAll: () => api.get('unidades-habitacionales/'),
    getById: (id) => api.get(`unidades-habitacionales/${id}/`),
    create: (data) => api.post('unidades-habitacionales/', data),
    update: (id, data) => api.put(`unidades-habitacionales/${id}/`, data),
    delete: (id) => api.delete(`unidades-habitacionales/${id}/`),
};

// Administradores
export const administradores = {
    getAll: () => api.get('administradores/'),
    getById: (id) => api.get(`administradores/${id}/`),
    create: (data) => api.post('administradores/', data),
    update: (id, data) => api.put(`administradores/${id}/`, data),
    delete: (id) => api.delete(`administradores/${id}/`),
};

// Personal de Seguridad
export const seguridad = {
    getAll: () => api.get('seguridad/'),
    getById: (id) => api.get(`seguridad/${id}/`),
    create: (data) => api.post('seguridad/', data),
    update: (id, data) => api.put(`seguridad/${id}/`, data),
    delete: (id) => api.delete(`seguridad/${id}/`),
    validarQR: (codigoQr) => api.post('seguridad/validar-qr/', { codigo_qr: codigoQr }),
    validarPlaca: (placa) => api.post('seguridad/validar-placa/', { placa }),
};

// Personal de Mantenimiento
export const personalMantenimiento = {
    getAll: () => api.get('personal-mantenimiento/'),
    getById: (id) => api.get(`personal-mantenimiento/${id}/`),
    create: (data) => api.post('personal-mantenimiento/', data),
    update: (id, data) => api.put(`personal-mantenimiento/${id}/`, data),
    delete: (id) => api.delete(`personal-mantenimiento/${id}/`),
};

// Cuotas
export const cuotas = {
    getAll: (params) => api.get('cuotas/', { params }),
    getById: (id) => api.get(`cuotas/${id}/`),
    create: (data) => api.post('cuotas/', data),
    update: (id, data) => api.put(`cuotas/${id}/`, data),
    patch: (id, data) => api.patch(`cuotas/${id}/`, data),
    delete: (id) => api.delete(`cuotas/${id}/`),
};

// Pagos
export const pagos = {
    getAll: (params) => api.get('pagos/', { params }),
    getById: (id) => api.get(`pagos/${id}/`),
    create: (data) => api.post('pagos/', data),
    update: (id, data) => api.put(`pagos/${id}/`, data),
    delete: (id) => api.delete(`pagos/${id}/`),
};

// Áreas Comunes
export const areasComunes = {
    getAll: () => api.get('areas-comunes/'),
    getById: (id) => api.get(`areas-comunes/${id}/`),
    create: (data) => api.post('areas-comunes/', data),
    update: (id, data) => api.put(`areas-comunes/${id}/`, data),
    delete: (id) => api.delete(`areas-comunes/${id}/`),
};

// Reservas
export const reservas = {
    getAll: (params) => api.get('reservas/', { params }),
    getById: (id) => api.get(`reservas/${id}/`),
    create: (data) => api.post('reservas/', data),
    update: (id, data) => api.put(`reservas/${id}/`, data),
    patch: (id, data) => api.patch(`reservas/${id}/`, data),
    delete: (id) => api.delete(`reservas/${id}/`),
};

// Tickets de Mantenimiento
export const ticketsMantenimiento = {
    getAll: (params) => api.get('tickets-mantenimiento/', { params }),
    getById: (id) => api.get(`tickets-mantenimiento/${id}/`),
    create: (data) => api.post('tickets-mantenimiento/', data),
    update: (id, data) => api.put(`tickets-mantenimiento/${id}/`, data),
    patch: (id, data) => api.patch(`tickets-mantenimiento/${id}/`, data),
    delete: (id) => api.delete(`tickets-mantenimiento/${id}/`),
};

// Visitas
export const visitas = {
    getAll: (params) => api.get('visitas/', { params }),
    getById: (id) => api.get(`visitas/${id}/`),
    create: (data) => api.post('visitas/', data),
    update: (id, data) => api.put(`visitas/${id}/`, data),
    delete: (id) => api.delete(`visitas/${id}/`),
};

// Vehículos Autorizados
export const vehiculosAutorizados = {
    getAll: (params) => api.get('vehiculos-autorizados/', { params }),
    getById: (id) => api.get(`vehiculos-autorizados/${id}/`),
    create: (data) => api.post('vehiculos-autorizados/', data),
    update: (id, data) => api.put(`vehiculos-autorizados/${id}/`, data),
    delete: (id) => api.delete(`vehiculos-autorizados/${id}/`),
};

// Alertas de Seguridad
export const alertasSeguridad = {
    getAll: (params) => api.get('alertas-seguridad/', { params }),
    getById: (id) => api.get(`alertas-seguridad/${id}/`),
    create: (data) => api.post('alertas-seguridad/', data),
    update: (id, data) => api.put(`alertas-seguridad/${id}/`, data),
    patch: (id, data) => api.patch(`alertas-seguridad/${id}/`, data),
    delete: (id) => api.delete(`alertas-seguridad/${id}/`),
};

// Dashboard
export const dashboard = {
    getAdminStats: () => api.get('dashboard/admin/'),
};

export default api;

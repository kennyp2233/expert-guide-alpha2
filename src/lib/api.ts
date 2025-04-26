import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

// Creamos una instancia base de axios con la configuración común
const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',

    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token de autenticación a las peticiones
api.interceptors.request.use((config) => {
    // Obtenemos el token desde localStorage (será guardado por zustand/persist)
    const token = typeof window !== 'undefined'
        ? localStorage.getItem('auth-storage')
            ? JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.accessToken
            : null
        : null;

    // Si hay token, lo agregamos al header de Authorization
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Aquí podemos manejar errores comunes como 401 (no autorizado)
        if (error.response?.status === 401) {
            // Si es un error de autenticación, podemos limpiar el storage y redirigir al login
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth-storage');
                window.location.href = '/auth/login';
            }
        }

        return Promise.reject(error);
    }
);

// Funciones auxiliares para simplificar las llamadas

export const apiGet = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.get<T>(url, config);

    return response.data;
};

export const apiPost = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.post<T>(url, data, config);
    return response.data;
};

export const apiPut = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.put<T>(url, data, config);
    return response.data;
};

export const apiPatch = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.patch<T>(url, data, config);
    return response.data;
};

export const apiDelete = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.delete<T>(url, config);
    return response.data;
};

// Para subida de archivos
export const apiUpload = async <T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.post<T>(url, formData, {
        ...config,
        headers: {
            ...config?.headers,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export default api;
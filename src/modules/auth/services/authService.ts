import { apiPost } from '@/lib/api';
import {
    LoginRequest,
    LoginResponse,
    RegisterClientRequest,
    RegisterFarmRequest,
    User
} from '@/types/auth';

// Servicio para la autenticación
export const authService = {
    /**
     * Inicia sesión del usuario
     */
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        return await apiPost<LoginResponse>('/auth/login', credentials);
    },

    /**
     * Registra un nuevo cliente
     */
    registerClient: async (userData: RegisterClientRequest): Promise<{ message: string }> => {
        return await apiPost<{ message: string }>('/auth/register/client', userData);
    },

    /**
     * Registra una nueva finca
     */
    registerFarm: async (farmData: RegisterFarmRequest): Promise<{ message: string }> => {
        return await apiPost<{ message: string }>('/auth/register/farm', farmData);
    },

    /**
     * Obtiene el perfil del usuario actual
     */
    getProfile: async (): Promise<User> => {
        return await apiPost<User>('/auth/profile');
    }
};
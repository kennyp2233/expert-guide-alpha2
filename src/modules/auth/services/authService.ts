// src/modules/auth/services/authService.ts
import { apiPost, apiGet } from '@/lib/api';
import {
    LoginRequest,
    LoginResponse,
    RegisterClientRequest,
    RegisterClientResponse,
    RegisterFarmRequest,
    RegisterFarmResponse,
} from '@/types/auth';
import { User, UserProfileResponse } from '@/types/user';

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
    registerClient: async (clientData: RegisterClientRequest): Promise<RegisterClientResponse> => {
        return await apiPost<RegisterClientResponse>('/auth/register/client', clientData);
    },

    /**
     * Registra una nueva finca
     */
    registerFarm: async (farmData: RegisterFarmRequest): Promise<RegisterFarmResponse> => {
        return await apiPost<RegisterFarmResponse>('/auth/register/farm', farmData);
    },

    /**
     * Obtiene el perfil del usuario actual
     */
    getProfile: async (): Promise<User> => {
        const profile = await apiGet<UserProfileResponse>('/auth/profile');

        const user: User = {
            id: profile.id,
            email: profile.email,
            usuario: profile.usuario,
            roles: profile.roles || [],
            finca: profile.finca,
            cliente: profile.cliente,
            activo: profile.activo,
            createdAt: profile.createdAt,
        };

        return user;
    }
};

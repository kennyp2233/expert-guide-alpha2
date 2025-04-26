// src/modules/auth/services/authService.ts
import { apiPost, apiGet } from '@/lib/api';
import {
    LoginRequest,
    LoginResponse,
    RegisterClientRequest,
    RegisterClientResponse,
    RegisterFarmRequest,
    RegisterFarmResponse,
    User
} from '@/types/auth';
import { UserProfileResponse } from '@/types/user';

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
    registerClient: async (userData: RegisterClientRequest): Promise<RegisterClientResponse> => {
        return await apiPost<RegisterClientResponse>('/auth/register/client', userData);
    },

    /**
     * Registra una nueva finca
     */
    registerFarm: async (farmData: RegisterFarmRequest): Promise<RegisterFarmResponse> => {
        return await apiPost<RegisterFarmResponse>('/auth/register/farm', farmData);
    },

    /**
     * Obtiene el perfil del usuario actual
     * La respuesta debe ser adaptada al formato User que espera el store
     */
    getProfile: async (): Promise<User> => {
        const profileResponse = await apiGet<UserProfileResponse>('/auth/profile');

        // Adaptamos la respuesta al formato que espera el store
        const user: User = {
            id: profileResponse.id,
            email: profileResponse.email,
            username: profileResponse.usuario, // Usamos usuario como username
            roles: profileResponse.roles || [],
            finca: profileResponse.finca,
            cliente: profileResponse.cliente,
            activo: profileResponse.activo,
            createdAt: profileResponse.createdAt,
            // Asignamos usuario para mantener compatibilidad con ambos formatos
            usuario: profileResponse.usuario
        };

        return user;
    }
};
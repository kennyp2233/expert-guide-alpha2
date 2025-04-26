import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/modules/auth/services/authService';
import {
    LoginRequest,
    RegisterClientRequest,
    RegisterFarmRequest,
    User
} from '@/types/auth';
import { AxiosError } from 'axios';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (credentials: LoginRequest) => Promise<boolean>;
    logout: () => void;
    registerClient: (userData: RegisterClientRequest) => Promise<boolean>;
    registerFarm: (farmData: RegisterFarmRequest) => Promise<boolean>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (credentials: LoginRequest) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.login(credentials);
                    set({
                        user: response.user,
                        accessToken: response.access_token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    return true;
                } catch (error) {
                    const axiosError = error as AxiosError<{ message: string | string[] }>;
                    const errorMessage = typeof axiosError.response?.data.message === 'string'
                        ? axiosError.response?.data.message
                        : Array.isArray(axiosError.response?.data.message)
                            ? axiosError.response?.data.message[0]
                            : 'Error al iniciar sesión';

                    set({
                        isLoading: false,
                        error: errorMessage
                    });
                    return false;
                }
            },

            logout: () => {
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            registerClient: async (userData: RegisterClientRequest) => {
                set({ isLoading: true, error: null });
                try {
                    await authService.registerClient(userData);
                    set({ isLoading: false });
                    return true;
                } catch (error) {
                    const axiosError = error as AxiosError<{ message: string | string[] }>;
                    const errorMessage = typeof axiosError.response?.data.message === 'string'
                        ? axiosError.response?.data.message
                        : Array.isArray(axiosError.response?.data.message)
                            ? axiosError.response?.data.message[0]
                            : 'Error al registrar usuario';

                    set({
                        isLoading: false,
                        error: errorMessage
                    });
                    return false;
                }
            },

            registerFarm: async (farmData: RegisterFarmRequest) => {
                set({ isLoading: true, error: null });
                try {
                    await authService.registerFarm(farmData);
                    set({ isLoading: false });
                    return true;
                } catch (error) {
                    const axiosError = error as AxiosError<{ message: string | string[] }>;
                    const errorMessage = typeof axiosError.response?.data.message === 'string'
                        ? axiosError.response?.data.message
                        : Array.isArray(axiosError.response?.data.message)
                            ? axiosError.response?.data.message[0]
                            : 'Error al registrar finca';

                    set({
                        isLoading: false,
                        error: errorMessage
                    });
                    return false;
                }
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: 'auth-storage',
            // Solo persistimos lo esencial
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);
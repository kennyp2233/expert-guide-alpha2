// src/modules/auth/stores/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/modules/auth/services/authService';
import {
    LoginRequest,
    RegisterClientRequest,
    RegisterFarmRequest,
    User
} from '@/types/auth';

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
    getProfile: () => Promise<void>;
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
                    set({
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Error al iniciar sesión'
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
                    set({
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Error al registrar usuario'
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
                    set({
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Error al registrar finca'
                    });
                    return false;
                }
            },

            getProfile: async () => {
                // Solo intentamos obtener el perfil si hay un token
                if (!get().accessToken) return;

                set({ isLoading: true });
                try {
                    const userData = await authService.getProfile();
                    set({
                        user: userData,
                        isLoading: false
                    });
                } catch (error) {
                    // Si hay un error al obtener el perfil, probablemente el token es inválido
                    set({
                        user: null,
                        accessToken: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Error al obtener el perfil'
                    });
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
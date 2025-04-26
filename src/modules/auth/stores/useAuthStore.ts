// src/modules/auth/stores/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/modules/auth/services/authService';
import {
    LoginRequest,
    RegisterClientRequest,
    RegisterFarmRequest,
    LoginResponse,
} from '@/types/auth';
import { User } from '@/types/user';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (credentials: LoginRequest) => Promise<boolean>;
    logout: () => void;
    registerClient: (clientData: RegisterClientRequest) => Promise<boolean>;
    registerFarm: (farmData: RegisterFarmRequest) => Promise<boolean>;
    getProfile: () => Promise<void>;
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
                    const { user, access_token }: LoginResponse = await authService.login(credentials);

                    set({
                        user: {
                            ...user,
                            usuario: user.username,
                            activo: true
                        },
                        accessToken: access_token,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    return true;
                } catch (error) {
                    set({
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Error al iniciar sesión',
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

            registerClient: async (clientData: RegisterClientRequest) => {
                set({ isLoading: true, error: null });
                try {
                    await authService.registerClient(clientData);
                    set({ isLoading: false });
                    return true;
                } catch (error) {
                    set({
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Error al registrar cliente',
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
                        error: error instanceof Error ? error.message : 'Error al registrar finca',
                    });
                    return false;
                }
            },

            getProfile: async () => {
                if (!get().accessToken) return;

                set({ isLoading: true });
                try {
                    const userData = await authService.getProfile();
                    set({
                        user: userData,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    set({
                        user: null,
                        accessToken: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Error al obtener el perfil',
                    });
                }
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

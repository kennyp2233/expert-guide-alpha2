// src/modules/auth/stores/useAuthStore.ts
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { authService } from '@/modules/auth/services/authService';
import {
    LoginRequest,
    RegisterClientRequest,
    RegisterFarmRequest,
    LoginResponse,
} from '@/types/auth';
import { User } from '@/types/user';

type AuthState = {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Flag para indicar que ya se rehidrató del storage
    hasHydrated: boolean;

    // Helpers internos
    setLoading: (loading: boolean) => void;
    setError: (message: string | null) => void;
};

type AuthActions = {
    login: (credentials: LoginRequest) => Promise<boolean>;
    logout: () => void;
    registerClient: (data: RegisterClientRequest) => Promise<boolean>;
    registerFarm: (data: RegisterFarmRequest) => Promise<boolean>;
    getProfile: () => Promise<void>;
    clearError: () => void;
};

const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    hasHydrated: false,
    setLoading: () => { },
    setError: () => { },
};

export const useAuthStore = create<AuthState & AuthActions>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                // Helpers
                setLoading: (loading: boolean) => set({ isLoading: loading }),
                setError: (message: string | null) => set({ error: message }),

                login: async (credentials) => {
                    set({ isLoading: true, error: null });
                    try {
                        const { user, access_token }: LoginResponse =
                            await authService.login(credentials);

                        set({
                            user: { ...user, usuario: user.username, activo: true },
                            accessToken: access_token,
                            isAuthenticated: true,
                        });
                        return true;
                    } catch (err) {
                        const message =
                            err instanceof Error ? err.message : 'Error al iniciar sesión';
                        set({ error: message });
                        return false;
                    } finally {
                        set({ isLoading: false });
                    }
                },

                logout: () => {
                    set((state) => ({
                        // preservamos hasHydrated para no volver a mostrar spinner
                        hasHydrated: state.hasHydrated,

                        // limpiamos todo lo demás
                        user: null,
                        accessToken: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null,
                    }));
                },


                registerClient: async (data) => {
                    set({ isLoading: true, error: null });
                    try {
                        await authService.registerClient(data);
                        return true;
                    } catch (err) {
                        const message =
                            err instanceof Error
                                ? err.message
                                : 'Error al registrar cliente';
                        set({ error: message });
                        return false;
                    } finally {
                        set({ isLoading: false });
                    }
                },

                registerFarm: async (data) => {
                    set({ isLoading: true, error: null });
                    try {
                        await authService.registerFarm(data);
                        return true;
                    } catch (err) {
                        const message =
                            err instanceof Error
                                ? err.message
                                : 'Error al registrar finca';
                        set({ error: message });
                        return false;
                    } finally {
                        set({ isLoading: false });
                    }
                },

                getProfile: async () => {
                    const token = get().accessToken;
                    if (!token) return;
                    set({ isLoading: true });
                    try {
                        const userData = await authService.getProfile();
                        set({ user: userData, isAuthenticated: true });
                    } catch (err) {
                        const message =
                            err instanceof Error
                                ? err.message
                                : 'Error al obtener el perfil';
                        set({ ...initialState, error: message });
                    } finally {
                        set({ isLoading: false });
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
                onRehydrateStorage: () => (state, error) => {
                    if (error) {
                        console.error('Error al rehidratar auth store:', error);
                    } else if (state) {
                        // Una vez cargado desde localStorage, marcamos hydrated
                        state.hasHydrated = true;
                    }
                },
            }
        )
    )
);

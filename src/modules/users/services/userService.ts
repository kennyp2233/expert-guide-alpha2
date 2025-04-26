// src/modules/users/services/userService.ts
import { apiGet, apiPost, apiPatch } from '@/lib/api';
import {
    User,
    UserRole,
    UserRoleAssignRequest,
    UserRoleApprovalResponse,
    PendingApprovalsResponse
} from '@/types/user';

export const userService = {
    /**
     * Obtiene la lista de todos los usuarios (solo ADMIN)
     */
    getUsers: async (): Promise<User[]> => {
        return await apiGet<User[]>('/users');
    },

    /**
     * Obtiene los datos de un usuario específico
     */
    getUser: async (userId: string): Promise<User> => {
        return await apiGet<User>(`/users/${userId}`);
    },

    /**
     * Actualiza los datos de un usuario
     */
    updateUser: async (userId: string, data: Partial<User>): Promise<User> => {
        return await apiPatch<User>(`/users/${userId}`, data);
    },

    /**
     * Aprueba un rol para un usuario
     */
    approveUserRole: async (userId: string, roleId: number): Promise<UserRoleApprovalResponse> => {
        return await apiPost<UserRoleApprovalResponse>(`/users/${userId}/roles/${roleId}/approve`);
    },

    /**
     * Rechaza un rol para un usuario
     */
    rejectUserRole: async (userId: string, roleId: number): Promise<UserRoleApprovalResponse> => {
        return await apiPost<UserRoleApprovalResponse>(`/users/${userId}/roles/${roleId}/reject`);
    },

    /**
     * Obtiene las solicitudes de roles pendientes de aprobación
     */
    getPendingApprovals: async (): Promise<PendingApprovalsResponse[]> => {
        return await apiGet<PendingApprovalsResponse[]>('/users/pending/approvals');
    },

    /**
     * Asigna un rol a un usuario
     */
    assignRole: async (data: UserRoleAssignRequest): Promise<UserRole> => {
        return await apiPost<UserRole>('/roles/assign', data);
    },

    /**
     * Obtiene los roles asignados a un usuario
     */
    getUserRoles: async (userId: string): Promise<UserRole[]> => {
        return await apiGet<UserRole[]>(`/roles/user/${userId}`);
    },

    /**
     * Obtiene los usuarios con un rol específico
     */
    getUsersWithRole: async (roleId: number): Promise<UserRole[]> => {
        return await apiGet<UserRole[]>(`/roles/${roleId}/users`);
    }
};
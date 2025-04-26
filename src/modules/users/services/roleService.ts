import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';
import { Role } from '@/types/user';

interface CreateRoleRequest {
    nombre: string;
    descripcion?: string;
}

export const roleService = {
    /**
     * Obtiene todos los roles disponibles
     */
    getRoles: async (): Promise<Role[]> => {
        return await apiGet<Role[]>('/roles');
    },

    /**
     * Obtiene un rol específico por su ID
     */
    getRole: async (roleId: number): Promise<Role> => {
        return await apiGet<Role>(`/roles/${roleId}`);
    },

    /**
     * Crea un nuevo rol (solo ADMIN)
     */
    createRole: async (roleData: CreateRoleRequest): Promise<Role> => {
        return await apiPost<Role>('/roles', roleData);
    },

    /**
     * Actualiza un rol existente (solo ADMIN)
     */
    updateRole: async (roleId: number, roleData: Partial<CreateRoleRequest>): Promise<Role> => {
        return await apiPatch<Role>(`/roles/${roleId}`, roleData);
    },

    /**
     * Elimina un rol (solo ADMIN)
     */
    deleteRole: async (roleId: number): Promise<Role> => {
        return await apiDelete<Role>(`/roles/${roleId}`);
    }
};
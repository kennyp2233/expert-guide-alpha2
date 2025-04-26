// src/types/user.ts
// Interfaces para usuario y roles basadas en las respuestas de la API

export interface Farm {
    id: number;
    nombre_finca: string;
    tag: string;
    ruc_finca: string;
    documentos?: any[];
}

export interface Cliente {
    id: number;
    nombre: string;
    ruc: string;
    puntosFidelizacion?: any;
}

export interface Role {
    id: number;
    nombre: string;
    descripcion?: string;
    estado?: string; // 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'
    metadata?: Record<string, any>;
}

export interface UserRole {
    id: string;
    id_usuario: string;
    id_rol: number;
    estado: string; // 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'
    metadata?: Record<string, any>;
    createdAt?: string;
    updatedAt?: string;
    rol?: Role;
}

export interface User {
    id: string;
    usuario: string;
    email: string;
    activo: boolean;
    createdAt?: string;
    updatedAt?: string;
    roles: Role[];
    finca?: Farm;
    cliente?: Cliente;
    asignacionRoles?: UserRole[];
}

export interface UserProfileResponse {
    id: string;
    usuario: string;
    email: string;
    activo: boolean;
    createdAt: string;
    roles: Role[];
    finca?: Farm;
    cliente?: Cliente;
}

export interface UserRoleAssignRequest {
    userId: string;
    roleId: number;
    metadata?: Record<string, any>;
}

export interface UserRoleApprovalResponse {
    message: string;
    userRole: UserRole & {
        usuario: {
            id: string;
            usuario: string;
            email: string;
        };
        rol: Role;
    };
}

export interface PendingApprovalsResponse {
    id: string;
    id_usuario: string;
    id_rol: number;
    estado: string;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
    usuario: {
        id: string;
        usuario: string;
        email: string;
        createdAt: string;
    };
    rol: {
        id: number;
        nombre: string;
        descripcion: string;
    };
}
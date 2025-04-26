// src/types/user.ts
import { Document } from "./document";

/**
 * Información de una finca asociada al usuario (rol FINCA)
 */
export interface Farm {
    id: number;
    nombre_finca: string;
    tag: string;
    ruc_finca: string;
    documentos?: Document[];
}

/**
 * Información de un cliente asociado al usuario (rol CLIENTE)
 */
export interface Cliente {
    id: number;
    nombre: string;
    ruc?: string;
    puntosFidelizacion?: any; // No está definido en la doc, puedes ajustar luego si quieres tiparlo mejor
}

/**
 * Representa un rol asignado a un usuario
 */
export interface Role {
    id: number;
    nombre: string;
    descripcion?: string;
    estado?: "PENDIENTE" | "APROBADO" | "RECHAZADO"; // Mejor definido como union type
    metadata?: Record<string, any>; // Metadata adicional (ej: id_finca, id_cliente)
}

/**
 * Relación Usuario-Rol (cuando se asigna un rol)
 */
export interface UserRole {
    id: string;
    id_usuario: string;
    id_rol: number;
    estado: "PENDIENTE" | "APROBADO" | "RECHAZADO";
    metadata?: Record<string, any>;
    createdAt?: string;
    updatedAt?: string;
    rol?: Role;
    usuario?: {
        id: string;
        usuario: string;
        email: string;
        createdAt?: string;
        activo?: boolean;
    };
}

/**
 * Representa un usuario completo (admin, finca o cliente)
 */
export interface User {
    id: string;
    usuario: string;
    email: string;
    activo: boolean;
    createdAt?: string;
    updatedAt?: string;
    roles: Role[]; // Roles actuales aprobados
    finca?: Farm;  // Si es rol finca
    cliente?: Cliente; // Si es rol cliente
    asignacionRoles?: UserRole[]; // Historial de asignaciones de roles
}

/**
 * Respuesta del perfil del usuario
 */
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

/**
 * Petición para asignar rol
 */
export interface UserRoleAssignRequest {
    userId: string;
    roleId: number;
    metadata?: Record<string, any>;
}

/**
 * Respuesta al aprobar/rechazar un rol
 */
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

/**
 * Respuesta de aprobaciones pendientes
 */
export interface PendingApprovalsResponse {
    id: string;
    id_usuario: string;
    id_rol: number;
    estado: "PENDIENTE";
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

// src/types/auth.ts
import { Role, Farm, Cliente } from './user';

/**
 * Representa a un usuario autenticado
 */
export interface User {
    id: string;
    email: string;
    username?: string; // Se llama username en login/registro
    usuario?: string;  // Se llama usuario en el profile
    roles: Role[];
    finca?: Farm;       // Solo si tiene rol FINCA
    cliente?: Cliente;  // Solo si tiene rol CLIENTE
    activo?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Petición para login
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Respuesta del login
 */
export interface LoginResponse {
    user: {
        id: string;
        email: string;
        username: string;
        roles: Role[];
    };
    access_token: string;
}

/**
 * Petición para registrar cliente
 */
export interface RegisterClientRequest {
    username: string;     // aquí corriges, no es nombre, es username
    email: string;
    password: string;
    nombre: string;       // nombre de la empresa cliente
    telefono: string;
    ruc?: string;
    direccion?: string;
    ciudad?: string;
    pais?: string;
}

/**
 * Respuesta al registrar cliente
 */
export interface RegisterClientResponse {
    message: string;
    user: {
        id: string;
        email: string;
        username: string;
    };
    access_token: string;
}

/**
 * Petición para registrar finca
 */
export interface RegisterFarmRequest {
    username: string;        // corregir: username no nombre
    email: string;
    password: string;
    nombre_finca: string;    // corregir: no es nombre, es nombre_finca
    tag?: string;
    ruc_finca: string;
    tipo_documento: string;  // siempre envías el tipo de documento (ej: "RUC")
    genera_guias_certificadas?: boolean;
    i_general_telefono?: string;
    i_general_email?: string;
    i_general_ciudad?: string;
    i_general_provincia?: string;
    i_general_pais?: string;
    i_general_cod_sesa?: string;
    i_general_cod_pais?: string;
}

/**
 * Respuesta al registrar finca
 */
export interface RegisterFarmResponse {
    message: string;
    user: {
        id: string;
        email: string;
        username: string;
    };
    finca: {
        id: number;
        nombre: string;
        tag: string;
    };
    access_token: string;
}

/**
 * Error genérico de API
 */
export interface ApiError {
    statusCode: number;
    message: string | string[];
    error: string;
}

export interface Roles {
    id: number;
    nombre: string;
    metadata?: any;
}

export interface User {
    id: string;
    email: string;
    username: string;
    roles: Roles[];
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    access_token: string;
}

export interface RegisterClientRequest {
    nombre: string;
    email: string;
    password: string;
    telefono: string;
    empresa?: string;
    pais?: string;
    ciudad?: string;
}

export interface RegisterFarmRequest {
    nombre: string;
    tag: string;
    email: string;
    password: string;
    ruc: string;
    telefono: string;
    direccion?: string;
    ciudad?: string;
    pais?: string;
}

export interface ApiError {
    statusCode: number;
    message: string | string[];
    error: string;
}
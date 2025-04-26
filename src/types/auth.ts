// src/types/auth.ts
import { Role, Farm, Cliente } from './user';

export interface User {
    id: string;
    email: string;
    username: string;
    usuario?: string; // Algunos endpoints devuelven usuario en vez de username
    roles: Role[];
    finca?: Farm;
    cliente?: Cliente;
    activo?: boolean;
    createdAt?: string;
    updatedAt?: string;
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

export interface RegisterClientResponse {
    message: string;
    user: {
        id: string;
        email: string;
        username: string;
    };
    access_token: string;
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

export interface ApiError {
    statusCode: number;
    message: string | string[];
    error: string;
}
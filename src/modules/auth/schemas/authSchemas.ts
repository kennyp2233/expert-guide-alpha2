// src/modules/auth/schemas/authSchemas.ts
import { z } from 'zod';

/**
 * Esquema de validación para el login
 */
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'El email es requerido' })
        .email({ message: 'Email inválido' }),
    password: z
        .string()
        .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
});

/**
 * Esquema de validación para el registro de clientes
 */
export const registerClientSchema = z.object({
    username: z.string().min(1, { message: 'El nombre de usuario es requerido' }),
    nombre: z.string().min(1, { message: 'El nombre de la empresa es requerido' }),
    telefono: z.string().min(1, { message: 'El teléfono es requerido' }),
    email: z
        .string()
        .min(1, { message: 'El email es requerido' })
        .email({ message: 'Email inválido' }),
    password: z
        .string()
        .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    passwordConfirm: z
        .string()
        .min(1, { message: 'La confirmación de contraseña es requerida' }),
    ruc: z.string().optional(), // RUC es opcional según la doc
    direccion: z.string().optional(),
    ciudad: z.string().optional(),
    pais: z.string().optional(),
    terms: z.boolean().refine(val => val === true, {
        message: 'Debes aceptar los términos y condiciones'
    })
}).refine(data => data.password === data.passwordConfirm, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirm'],
});

/**
 * Esquema de validación para el registro de fincas
 */
export const registerFarmSchema = z.object({
    username: z.string().min(1, { message: 'El nombre de usuario es requerido' }),
    nombre_finca: z.string().min(1, { message: 'El nombre de la finca es requerido' }),
    tag: z.string().optional(), // El tag es opcional según la doc
    email: z
        .string()
        .min(1, { message: 'El email es requerido' })
        .email({ message: 'Email inválido' }),
    password: z
        .string()
        .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    passwordConfirm: z
        .string()
        .min(1, { message: 'La confirmación de contraseña es requerida' }),
    ruc_finca: z
        .string()
        .min(1, { message: 'El RUC de la finca es requerido' }),
    tipo_documento: z
        .string()
        .min(1, { message: 'El tipo de documento es requerido' }),
    i_general_telefono: z
        .string()
        .min(1, { message: 'El teléfono general es requerido' }),
    i_general_email: z
        .string()
        .min(1, { message: 'El email de contacto es requerido' }),
    i_general_ciudad: z.string().optional(),
    i_general_provincia: z.string().optional(),
    i_general_pais: z.string().optional(),
    i_general_cod_sesa: z.string().optional(),
    i_general_cod_pais: z.string().optional(),
    genera_guias_certificadas: z.boolean().optional(),
    terms: z.boolean().refine(val => val === true, {
        message: 'Debes aceptar los términos y condiciones'
    })
}).refine(data => data.password === data.passwordConfirm, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirm'],
});

/**
 * Tipos inferidos a partir de los esquemas
 */
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterClientFormValues = z.infer<typeof registerClientSchema>;
export type RegisterFarmFormValues = z.infer<typeof registerFarmSchema>;

import { z } from 'zod';

// Esquema de validación para el login
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'El email es requerido' })
        .email({ message: 'Email inválido' }),
    password: z
        .string()
        .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
});

// Esquema de validación para el registro de clientes
export const registerClientSchema = z.object({
    nombre: z.string().min(1, { message: 'El nombre es requerido' }),
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
    telefono: z
        .string()
        .min(1, { message: 'El teléfono es requerido' }),
    empresa: z.string().optional(),
    pais: z.string().optional(),
    ciudad: z.string().optional(),
    terms: z.boolean().refine(val => val === true, {
        message: 'Debes aceptar los términos y condiciones'
    })
}).refine(data => data.password === data.passwordConfirm, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirm'],
});

// Esquema de validación para el registro de fincas
export const registerFarmSchema = z.object({
    nombre: z.string().min(1, { message: 'El nombre es requerido' }),
    tag: z.string().min(1, { message: 'El tag es requerido' }),
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
    ruc: z
        .string()
        .min(1, { message: 'El RUC es requerido' }),
    telefono: z
        .string()
        .min(1, { message: 'El teléfono es requerido' }),
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

// Tipos inferidos a partir de los esquemas
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterClientFormValues = z.infer<typeof registerClientSchema>;
export type RegisterFarmFormValues = z.infer<typeof registerFarmSchema>;
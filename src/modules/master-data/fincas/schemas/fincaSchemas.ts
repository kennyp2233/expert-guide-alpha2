// src/modules/fincas/schemas/fincaSchemas.ts

import * as z from 'zod';

export const fincaFormSchema = z.object({
    nombre_finca: z.string().min(3, 'El nombre de la finca debe tener al menos 3 caracteres'),
    tag: z.string().min(1, 'El código identificador es requerido'),
    ruc_finca: z.string().min(10, 'El RUC debe tener al menos 10 dígitos'),
    tipo_documento: z.string().optional(),
    genera_guias_certificadas: z.boolean().optional(),
    i_general_telefono: z.string().min(7, 'El teléfono debe tener al menos 7 dígitos').optional(),
    i_general_email: z.string().email('Email inválido').optional(),
    i_general_ciudad: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres').optional(),
    i_general_provincia: z.string().min(2, 'La provincia debe tener al menos 2 caracteres').optional(),
    i_general_pais: z.string().min(2, 'El país debe tener al menos 2 caracteres').optional(),
    i_general_cod_sesa: z.string().optional(),
    i_general_cod_pais: z.string().optional(),
    a_nombre: z.string().optional(),
    a_codigo: z.string().optional(),
    a_direccion: z.string().optional(),
});

export type FincaFormValues = z.infer<typeof fincaFormSchema>;
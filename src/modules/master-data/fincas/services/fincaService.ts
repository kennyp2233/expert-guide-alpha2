// src/modules/fincas/services/fincaService.ts

import { apiGet, apiPut, apiPatch } from '@/lib/api';
import { Farm, FarmValidation, FarmInVerification, FarmDocumentVerification } from '@/types/master-data/farm';

export const fincaService = {
    /**
     * Obtiene los datos de una finca específica
     */
    getFinca: async (fincaId: number): Promise<Farm> => {
        return await apiGet<Farm>(`/fincas/${fincaId}`);
    },

    /**
     * Actualiza los datos de una finca
     */
    updateFinca: async (fincaId: number, data: Partial<Farm>): Promise<Farm> => {
        return await apiPut<Farm>(`/fincas/${fincaId}`, data);
    },

    /**
     * Verifica si faltan campos por completar o documentos por subir
     */
    validateFincaRegistration: async (fincaId: number): Promise<FarmValidation> => {
        return await apiGet<FarmValidation>(`/fincas/${fincaId}/validar-registro`);
    },

    /**
     * Obtiene las fincas en proceso de verificación (solo para administradores)
     */
    getFincasEnVerificacion: async (
        params?: { con_documentos?: boolean; estado_documentos?: string }
    ): Promise<{ total: number; fincas: FarmInVerification[] }> => {
        return await apiGet<{ total: number; fincas: FarmInVerification[] }>(
            '/fincas/en-verificacion',
            { params }
        );
    },

    /**
     * Verifica el estado de los documentos de una finca
     */
    verifyFincaDocuments: async (fincaId: number): Promise<FarmDocumentVerification> => {
        return await apiGet<FarmDocumentVerification>(`/fincas/${fincaId}/verificar-documentos`);
    },

    /**
     * Actualiza campos específicos de una finca
     */
    patchFinca: async (fincaId: number, data: Partial<Farm>): Promise<Farm> => {
        return await apiPatch<Farm>(`/fincas/${fincaId}`, data);
    }
};
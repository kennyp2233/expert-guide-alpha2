// src/modules/master-data/fincas/hooks/useFinca.ts
import { useState, useEffect, useCallback } from 'react';
import { fincaService } from '../services/fincaService';
import { useToast } from '@/shared/hooks/useToast';
import { Farm, FarmValidation, FarmInVerification, FarmDocumentVerification } from '@/types/master-data/farm';
import { Document } from '@/types/document';
import { documentService } from '@/modules/documents/services/documentService';

/**
 * Hook for managing farm data and operations
 */
export const useFinca = (fincaId?: number) => {
    const [finca, setFinca] = useState<Farm | null>(null);
    const [validation, setValidation] = useState<FarmValidation | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Fetch farm data
    const fetchFinca = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const farmData = await fincaService.getFinca(id);
            setFinca(farmData);
            return farmData;
        } catch (error) {
            toast('Error loading farm data', 'error');
            console.error('Error loading farm data:', error);
            return null;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    // Fetch farm validation status
    const fetchValidation = useCallback(async (id: number) => {
        try {
            const validationData = await fincaService.validateFincaRegistration(id);
            setValidation(validationData);
            return validationData;
        } catch (error) {
            console.error('Error validating farm:', error);
            return null;
        }
    }, []);

    // Fetch farm documents
    const fetchDocuments = useCallback(async (id: number) => {
        try {
            const docsData = await documentService.getFarmDocuments(id);
            setDocuments(docsData);
            return docsData;
        } catch (error) {
            console.error('Error loading farm documents:', error);
            return [];
        }
    }, []);

    // Load initial data if fincaId is provided
    useEffect(() => {
        if (fincaId) {
            const loadData = async () => {
                setLoading(true);
                try {
                    await fetchFinca(fincaId);
                    await fetchValidation(fincaId);
                    await fetchDocuments(fincaId);
                } finally {
                    setLoading(false);
                }
            };

            loadData();
        }
    }, [fincaId, fetchFinca, fetchValidation, fetchDocuments]);

    // Update farm data
    const updateFinca = useCallback(async (id: number, data: Partial<Farm>) => {
        setLoading(true);
        try {
            const updatedFinca = await fincaService.updateFinca(id, data);
            setFinca(updatedFinca);
            toast('Farm updated successfully', 'success');

            // Refresh validation after update
            await fetchValidation(id);

            return updatedFinca;
        } catch (error) {
            toast('Error updating farm', 'error');
            console.error('Error updating farm:', error);
            return null;
        } finally {
            setLoading(false);
        }
    }, [toast, fetchValidation]);

    return {
        finca,
        validation,
        documents,
        loading,
        fetchFinca,
        fetchValidation,
        fetchDocuments,
        updateFinca,
        refreshData: useCallback(async (id: number) => {
            await fetchFinca(id);
            await fetchValidation(id);
            await fetchDocuments(id);
        }, [fetchFinca, fetchValidation, fetchDocuments])
    };
};

/**
 * Hook for farm verification by admin
 */
export const useFarmVerification = () => {
    const [farms, setFarms] = useState<FarmInVerification[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFarm, setSelectedFarm] = useState<FarmInVerification | null>(null);
    const [farmDocuments, setFarmDocuments] = useState<Document[]>([]);
    const [verification, setVerification] = useState<FarmDocumentVerification | null>(null);
    const [filter, setFilter] = useState('all');
    const { toast } = useToast();

    // Fetch farms in verification
    const fetchFarmsInVerification = useCallback(async () => {
        setLoading(true);
        try {
            const params: { con_documentos?: boolean; estado_documentos?: string } = {};

            if (filter === 'with-documents') {
                params.con_documentos = true;
            } else if (filter === 'pending') {
                params.estado_documentos = 'PENDIENTE';
            } else if (filter === 'rejected') {
                params.estado_documentos = 'RECHAZADO';
            } else if (filter === 'approved') {
                params.estado_documentos = 'APROBADO';
            }

            const result = await fincaService.getFincasEnVerificacion(params);
            setFarms(result.fincas);
            return result.fincas;
        } catch (error) {
            toast('Error loading farms in verification', 'error');
            console.error('Error loading farms:', error);
            return [];
        } finally {
            setLoading(false);
        }
    }, [filter, toast]);

    // Load farms when filter changes
    useEffect(() => {
        fetchFarmsInVerification();
    }, [fetchFarmsInVerification]);

    // Fetch farm verification data
    const fetchFarmVerification = useCallback(async (farmId: number) => {
        try {
            const [documents, verificationData] = await Promise.all([
                documentService.getFarmDocuments(farmId),
                fincaService.verifyFincaDocuments(farmId)
            ]);

            setFarmDocuments(documents);
            setVerification(verificationData);

            return { documents, verification: verificationData };
        } catch (error) {
            toast('Error loading verification data', 'error');
            console.error('Error loading verification data:', error);
            return null;
        }
    }, [toast]);

    // Select a farm for verification
    const selectFarm = useCallback(async (farm: FarmInVerification) => {
        setSelectedFarm(farm);
        await fetchFarmVerification(farm.finca.id);
    }, [fetchFarmVerification]);

    // Clear selected farm
    const clearSelectedFarm = useCallback(() => {
        setSelectedFarm(null);
        setFarmDocuments([]);
        setVerification(null);
    }, []);

    return {
        farms,
        loading,
        selectedFarm,
        farmDocuments,
        verification,
        filter,
        setFilter,
        fetchFarmsInVerification,
        fetchFarmVerification,
        selectFarm,
        clearSelectedFarm
    };
};
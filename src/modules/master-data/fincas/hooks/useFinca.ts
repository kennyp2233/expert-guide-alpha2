// src/modules/fincas/hooks/useFincas.ts
import { useState, useEffect, useCallback } from 'react';
import { fincaService } from '../services/fincaService';
import { useToast } from '@/shared/hooks/useToast';
import { Farm, FarmValidation } from '@/types/master-data/farm';
import { documentService } from '@/modules/documents/services/documentService';
import { Document } from '@/types/document';
import { userService } from '@/modules/users/services/userService';

/**
 * Hook para gestionar los datos de una finca específica
 */
export const useFinca = (fincaId?: number) => {
    const [finca, setFinca] = useState<Farm | null>(null);
    const [validation, setValidation] = useState<FarmValidation | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Cargar datos de finca
    const fetchFinca = useCallback(async (id: number) => {
        try {
            setLoading(true);
            const farmData = await fincaService.getFinca(id);
            setFinca(farmData);
            return farmData;
        } catch (error) {
            toast('Error al cargar los datos de la finca', 'error');
            console.error('Error loading farm data:', error);
            return null;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    // Cargar validación de finca
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

    // Cargar documentos de finca
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

    // Actualizar finca
    const updateFinca = useCallback(async (id: number, data: Partial<Farm>) => {
        setLoading(true);
        try {
            const updatedFinca = await fincaService.updateFinca(id, data);
            setFinca(updatedFinca);
            toast('Datos de la finca actualizados correctamente', 'success');

            // Refrescar validación
            await fetchValidation(id);

            return updatedFinca;
        } catch (error) {
            toast('Error al actualizar datos de la finca', 'error');
            console.error('Error updating farm:', error);
            return null;
        } finally {
            setLoading(false);
        }
    }, [toast, fetchValidation]);

    // Cargar datos iniciales si se proporciona fincaId
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

    // Refrescar todos los datos
    const refreshData = useCallback(async (id: number) => {
        await fetchFinca(id);
        await fetchValidation(id);
        await fetchDocuments(id);
    }, [fetchFinca, fetchValidation, fetchDocuments]);

    return {
        finca,
        validation,
        documents,
        loading,
        fetchFinca,
        fetchValidation,
        fetchDocuments,
        updateFinca,
        refreshData
    };
};

/**
 * Hook para gestión de verificación de fincas (admin)
 */
export const useFincasVerification = () => {
    const [farms, setFarms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedFarm, setSelectedFarm] = useState<any | null>(null);
    const [verificationModalOpen, setVerificationModalOpen] = useState(false);
    const { toast } = useToast();

    // Cargar fincas en verificación
    const fetchFarms = useCallback(async () => {
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
            toast('Error al cargar fincas en verificación', 'error');
            console.error('Error loading farms:', error);
            return [];
        } finally {
            setLoading(false);
        }
    }, [filter]);

    // Cargar fincas cuando cambia el filtro
    useEffect(() => {
        fetchFarms();
    }, [fetchFarms]);

    // Filtrar fincas por búsqueda
    const filteredFarms = farms.filter(farm => {
        const searchTerm = search.toLowerCase().trim();
        if (!searchTerm) return true;

        return (
            farm.finca.nombre_finca?.toLowerCase().includes(searchTerm) ||
            farm.finca.tag?.toLowerCase().includes(searchTerm) ||
            farm.finca.ruc_finca?.toLowerCase().includes(searchTerm) ||
            farm.usuario.usuario?.toLowerCase().includes(searchTerm) ||
            farm.usuario.email?.toLowerCase().includes(searchTerm)
        );
    });

    // Abrir modal de verificación
    const openVerificationModal = useCallback((farm: any) => {
        setSelectedFarm(farm);
        setVerificationModalOpen(true);
    }, []);

    // Cerrar modal de verificación
    const closeVerificationModal = useCallback(() => {
        setVerificationModalOpen(false);
        setSelectedFarm(null);
    }, []);

    // Aprobar rol de finca
    const approveRole = useCallback(async (userId: string, roleId: number) => {
        try {
            await userService.approveUserRole(userId, roleId);
            toast('Rol de finca aprobado correctamente', 'success');
            await fetchFarms();
            closeVerificationModal();
            return true;
        } catch (error) {
            toast('Error al aprobar el rol de finca', 'error');
            console.error('Error approving role:', error);
            return false;
        }
    }, [closeVerificationModal, fetchFarms, toast]);

    // Rechazar rol de finca
    const rejectRole = useCallback(async (userId: string, roleId: number) => {
        try {
            await userService.rejectUserRole(userId, roleId);
            toast('Rol de finca rechazado', 'success');
            await fetchFarms();
            closeVerificationModal();
            return true;
        } catch (error) {
            toast('Error al rechazar el rol de finca', 'error');
            console.error('Error rejecting role:', error);
            return false;
        }
    }, [closeVerificationModal, fetchFarms, toast]);

    return {
        farms: filteredFarms,
        loading,
        search,
        setSearch,
        filter,
        setFilter,
        selectedFarm,
        verificationModalOpen,
        fetchFarms,
        openVerificationModal,
        closeVerificationModal,
        approveRole,
        rejectRole
    };
};
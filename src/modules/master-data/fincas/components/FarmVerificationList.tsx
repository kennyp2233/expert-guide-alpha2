// src/modules/fincas/components/FarmVerificationList.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Search, Filter, Eye, Loader2 } from 'lucide-react';
import { FarmVerificationModal } from './FarmVerificationModal';
import { fincaService } from '../services/fincaService';
import { FarmInVerification } from '@/types/master-data/farm';
import { useToast } from '@/shared/hooks/useToast';
import { formatDate } from '@/shared/utils/formatters';

export function FarmVerificationList() {
    const [fincas, setFincas] = useState<FarmInVerification[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedFarm, setSelectedFarm] = useState<FarmInVerification | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const { toast } = useToast();

    // Cargar fincas en verificación
    const loadFincas = async () => {
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
            setFincas(result.fincas);
        } catch (error) {
            toast('Error al cargar fincas en verificación', 'error');
            console.error('Error loading farms:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFincas();
    }, [filter]);

    // Filtrar fincas por búsqueda
    const filteredFincas = fincas.filter(item => {
        const searchTerm = search.toLowerCase();
        return (
            item.finca.nombre_finca.toLowerCase().includes(searchTerm) ||
            item.finca.tag.toLowerCase().includes(searchTerm) ||
            item.finca.ruc_finca.toLowerCase().includes(searchTerm) ||
            item.usuario.usuario.toLowerCase().includes(searchTerm) ||
            item.usuario.email.toLowerCase().includes(searchTerm)
        );
    });

    // Manejar la verificación de una finca
    const handleViewFarm = (farm: FarmInVerification) => {
        setSelectedFarm(farm);
        setModalOpen(true);
    };

    // Refrescar datos después de una verificación
    const handleVerificationComplete = () => {
        loadFincas();
        setModalOpen(false);
        setSelectedFarm(null);
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Fincas en Verificación</h2>
                    <p className="text-muted-foreground">
                        Gestione y verifique las fincas pendientes de aprobación
                    </p>
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre, tag, RUC, usuario o email..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[180px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filtrar" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las fincas</SelectItem>
                        <SelectItem value="with-documents">Con documentos</SelectItem>
                        <SelectItem value="pending">Documentos pendientes</SelectItem>
                        <SelectItem value="approved">Documentos aprobados</SelectItem>
                        <SelectItem value="rejected">Documentos rechazados</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                        <p className="text-muted-foreground">Cargando fincas...</p>
                    </div>
                </div>
            ) : filteredFincas.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                            {fincas.length === 0
                                ? 'No hay fincas en proceso de verificación'
                                : 'No se encontraron fincas que coincidan con la búsqueda'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredFincas.map((item) => (
                        <Card key={item.finca.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <CardTitle>
                                        {item.finca.nombre_finca}
                                    </CardTitle>
                                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                                        Pendiente
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Usuario</p>
                                        <p className="font-medium">{item.usuario.usuario}</p>
                                        <p className="text-sm">{item.usuario.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Identificación</p>
                                        <p>Tag: <span className="font-medium">{item.finca.tag}</span></p>
                                        <p>RUC: <span className="font-medium">{item.finca.ruc_finca}</span></p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Fecha de registro</p>
                                        <p>{formatDate(item.usuario.createdAt)}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Documentos requeridos</span>
                                        <span>
                                            {item.finca.progreso_verificacion.documentos_aprobados}/
                                            {item.finca.progreso_verificacion.total_documentos_requeridos}
                                        </span>
                                    </div>
                                    <Progress
                                        value={item.finca.progreso_verificacion.porcentaje_aprobado}
                                        className="h-2"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        onClick={() => handleViewFarm(item)}
                                        className="gap-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        Verificar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal de verificación de finca */}
            {modalOpen && selectedFarm && (
                <FarmVerificationModal
                    farm={selectedFarm}
                    open={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setSelectedFarm(null);
                    }}
                    onVerificationComplete={handleVerificationComplete}
                />
            )}
        </div>
    );
}
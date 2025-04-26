'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Datos de ejemplo para las solicitudes
const solicitudesEjemplo = [
    {
        id: 'SOL-001',
        cliente: 'Flowery Inc.',
        tipo: 'Exportación',
        estado: 'Pendiente',
        fechaCreacion: '2025-04-20',
        fechaEntrega: '2025-05-02',
        productos: ['Rosas', 'Claveles']
    },
    {
        id: 'SOL-002',
        cliente: 'Bloom Express',
        tipo: 'Nacional',
        estado: 'Aprobada',
        fechaCreacion: '2025-04-22',
        fechaEntrega: '2025-04-29',
        productos: ['Girasoles', 'Liliums']
    },
    {
        id: 'SOL-003',
        cliente: 'Global Flowers',
        tipo: 'Exportación',
        estado: 'En proceso',
        fechaCreacion: '2025-04-23',
        fechaEntrega: '2025-05-05',
        productos: ['Rosas', 'Astromelias']
    },
    {
        id: 'SOL-004',
        cliente: 'European Bouquets',
        tipo: 'Exportación',
        estado: 'Pendiente',
        fechaCreacion: '2025-04-24',
        fechaEntrega: '2025-05-10',
        productos: ['Cartuchos', 'Orquídeas']
    },
    {
        id: 'SOL-005',
        cliente: 'Local Gardens',
        tipo: 'Nacional',
        estado: 'Completada',
        fechaCreacion: '2025-04-18',
        fechaEntrega: '2025-04-25',
        productos: ['Margaritas', 'Claveles']
    }
];

export default function SolicitudesPage() {
    const [busqueda, setBusqueda] = useState('');
    const [solicitudes, setSolicitudes] = useState(solicitudesEjemplo);

    // Función para obtener el color del badge según el estado
    const getEstadoColor = (estado: string) => {
        switch (estado.toLowerCase()) {
            case 'pendiente':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
            case 'aprobada':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'en proceso':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'completada':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'rechazada':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    // Filtrar solicitudes según la búsqueda
    const solicitudesFiltradas = solicitudes.filter(sol =>
        sol.id.toLowerCase().includes(busqueda.toLowerCase()) ||
        sol.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
        sol.tipo.toLowerCase().includes(busqueda.toLowerCase()) ||
        sol.estado.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Solicitudes</h1>
                    <p className="text-muted-foreground">
                        Gestione las solicitudes de sus clientes
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Solicitud
                </Button>
            </div>

            {/* Búsqueda y Filtros */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar solicitudes..."
                        className="pl-8"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                </Button>
            </div>

            {/* Lista de Solicitudes */}
            <div className="grid gap-4">
                {solicitudesFiltradas.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center">
                            <p className="text-muted-foreground">No se encontraron solicitudes que coincidan con la búsqueda.</p>
                        </CardContent>
                    </Card>
                ) : (
                    solicitudesFiltradas.map((solicitud) => (
                        <Card key={solicitud.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <CardTitle>{solicitud.id}</CardTitle>
                                        <Badge variant="outline">{solicitud.tipo}</Badge>
                                    </div>
                                    <Badge className={getEstadoColor(solicitud.estado)}>
                                        {solicitud.estado}
                                    </Badge>
                                </div>
                                <CardDescription>
                                    Cliente: {solicitud.cliente}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Fecha de Creación</p>
                                        <p>{solicitud.fechaCreacion}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Fecha de Entrega</p>
                                        <p>{solicitud.fechaEntrega}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-muted-foreground">Productos</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {solicitud.productos.map((producto, idx) => (
                                                <Badge key={idx} variant="secondary">
                                                    {producto}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Search, Filter, MoreHorizontal, Globe, Mail, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Datos de ejemplo para los clientes
const clientesEjemplo = [
    {
        id: 'CLI-001',
        nombre: 'Flowery Inc.',
        contacto: 'Maria González',
        email: 'maria@floweryinc.com',
        telefono: '+1 (555) 123-4567',
        pais: 'Estados Unidos',
        ciudad: 'Miami',
        tipo: 'Premium',
        ultimaCompra: '2025-04-15',
        estado: 'Activo'
    },
    {
        id: 'CLI-002',
        nombre: 'Bloom Express',
        contacto: 'John Smith',
        email: 'john@bloomexpress.co.uk',
        telefono: '+44 (20) 5555-1234',
        pais: 'Reino Unido',
        ciudad: 'Londres',
        tipo: 'Regular',
        ultimaCompra: '2025-04-10',
        estado: 'Activo'
    },
    {
        id: 'CLI-003',
        nombre: 'Global Flowers',
        contacto: 'Hans Schmidt',
        email: 'hans@globalflowers.de',
        telefono: '+49 (30) 5555-6789',
        pais: 'Alemania',
        ciudad: 'Berlín',
        tipo: 'Premium',
        ultimaCompra: '2025-03-28',
        estado: 'Activo'
    },
    {
        id: 'CLI-004',
        nombre: 'European Bouquets',
        contacto: 'Sophie Dupont',
        email: 'sophie@europeanbouquets.fr',
        telefono: '+33 (1) 5555-8910',
        pais: 'Francia',
        ciudad: 'París',
        tipo: 'Regular',
        ultimaCompra: '2025-04-05',
        estado: 'Inactivo'
    },
    {
        id: 'CLI-005',
        nombre: 'Local Gardens',
        contacto: 'Carlos Rodríguez',
        email: 'carlos@localgardens.ec',
        telefono: '+593 (2) 555-1122',
        pais: 'Ecuador',
        ciudad: 'Quito',
        tipo: 'Nuevo',
        ultimaCompra: '2025-04-22',
        estado: 'Activo'
    }
];

export default function ClientesPage() {
    const [busqueda, setBusqueda] = useState('');
    const [clientes, setClientes] = useState(clientesEjemplo);

    // Función para obtener el color del badge según el tipo de cliente
    const getTipoColor = (tipo: string) => {
        switch (tipo.toLowerCase()) {
            case 'premium':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'regular':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'nuevo':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    // Función para obtener el color del badge según el estado
    const getEstadoColor = (estado: string) => {
        switch (estado.toLowerCase()) {
            case 'activo':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'inactivo':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    // Filtrar clientes según la búsqueda
    const clientesFiltrados = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        cliente.contacto.toLowerCase().includes(busqueda.toLowerCase()) ||
        cliente.email.toLowerCase().includes(busqueda.toLowerCase()) ||
        cliente.pais.toLowerCase().includes(busqueda.toLowerCase()) ||
        cliente.ciudad.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
                    <p className="text-muted-foreground">
                        Gestione su cartera de clientes y contratos
                    </p>
                </div>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Nuevo Cliente
                </Button>
            </div>

            {/* Búsqueda y Filtros */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar clientes..."
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

            {/* Lista de Clientes */}
            <div className="grid gap-4 md:grid-cols-2">
                {clientesFiltrados.length === 0 ? (
                    <Card className="col-span-2">
                        <CardContent className="py-8 text-center">
                            <p className="text-muted-foreground">No se encontraron clientes que coincidan con la búsqueda.</p>
                        </CardContent>
                    </Card>
                ) : (
                    clientesFiltrados.map((cliente) => (
                        <Card key={cliente.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg">{cliente.nombre}</CardTitle>
                                    <div className="flex gap-2">
                                        <Badge className={getTipoColor(cliente.tipo)}>
                                            {cliente.tipo}
                                        </Badge>
                                        <Badge className={getEstadoColor(cliente.estado)}>
                                            {cliente.estado}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-sm">
                                    <p className="font-medium">{cliente.contacto}</p>
                                    <div className="grid gap-2 mt-2">
                                        <div className="flex items-center text-muted-foreground">
                                            <Mail className="h-4 w-4 mr-2" />
                                            {cliente.email}
                                        </div>
                                        <div className="flex items-center text-muted-foreground">
                                            <Phone className="h-4 w-4 mr-2" />
                                            {cliente.telefono}
                                        </div>
                                        <div className="flex items-center text-muted-foreground">
                                            <Globe className="h-4 w-4 mr-2" />
                                            {cliente.ciudad}, {cliente.pais}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Última compra</p>
                                        <p>{cliente.ultimaCompra}</p>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
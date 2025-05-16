// src/modules/fincas/components/DocumentReviewCard.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Document } from '@/types/document';
import { formatDate } from '@/shared/utils/formatters';
import {
    FileText,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Loader2,
    MessageCircle
} from 'lucide-react';

interface DocumentReviewCardProps {
    document: Document;
    onView: () => void;
    onApprove: (comentario?: string) => Promise<void>;
    onReject: (comentario?: string) => Promise<void>;
}

export function DocumentReviewCard({ document, onView, onApprove, onReject }: DocumentReviewCardProps) {
    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [comentario, setComentario] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleApprove = async () => {
        setProcessing(true);
        try {
            await onApprove(comentario || undefined);
            setApproveModalOpen(false);
            setComentario('');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        setProcessing(true);
        try {
            await onReject(comentario || undefined);
            setRejectModalOpen(false);
            setComentario('');
        } finally {
            setProcessing(false);
        }
    };

    const getStatusBadge = () => {
        switch (document.estado) {
            case 'PENDIENTE':
                return (
                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                        <Clock className="mr-1 h-3 w-3" />
                        Pendiente
                    </Badge>
                );
            case 'APROBADO':
                return (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Aprobado
                    </Badge>
                );
            case 'RECHAZADO':
                return (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                        <XCircle className="mr-1 h-3 w-3" />
                        Rechazado
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline">
                        Desconocido
                    </Badge>
                );
        }
    };

    return (
        <>
            <Card className="overflow-hidden hover:shadow-sm transition-shadow">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center text-lg">
                            <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                            {document.tipoDocumento?.nombre || 'Documento'}
                        </CardTitle>
                        {getStatusBadge()}
                    </div>
                </CardHeader>

                <CardContent className="py-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        {document.nombre_archivo && (
                            <div className="col-span-2">
                                <p className="text-muted-foreground">Archivo:</p>
                                <p className="font-medium truncate">{document.nombre_archivo}</p>
                            </div>
                        )}

                        <div>
                            <p className="text-muted-foreground">Subido:</p>
                            <p>{document.fecha_subida ? formatDate(document.fecha_subida) : 'N/A'}</p>
                        </div>

                        {document.fecha_revision && (
                            <div>
                                <p className="text-muted-foreground">Revisado:</p>
                                <p>{formatDate(document.fecha_revision)}</p>
                            </div>
                        )}
                    </div>

                    {document.comentario && (
                        <div className="mt-2 bg-muted p-2 rounded-md text-sm">
                            <p className="text-muted-foreground">Comentario:</p>
                            <p>{document.comentario}</p>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="pt-0 flex justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onView}
                    >
                        <Eye className="mr-1 h-4 w-4" />
                        Ver
                    </Button>

                    {document.estado === 'PENDIENTE' && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => setRejectModalOpen(true)}
                            >
                                <XCircle className="mr-1 h-4 w-4" />
                                Rechazar
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => setApproveModalOpen(true)}
                            >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Aprobar
                            </Button>
                        </>
                    )}
                </CardFooter>
            </Card>

            {/* Modal de aprobación */}
            <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Aprobar Documento</DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        <p className="mb-4">
                            ¿Está seguro de que desea aprobar el documento <span className="font-medium">{document.tipoDocumento?.nombre}</span>?
                        </p>

                        <div className="space-y-2">
                            <Label htmlFor="comentario">Comentario (opcional)</Label>
                            <Textarea
                                id="comentario"
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                                placeholder="Añadir comentario a la aprobación"
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setApproveModalOpen(false)}
                            disabled={processing}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleApprove}
                            disabled={processing}
                            className="text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Aprobar
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de rechazo */}
            <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Rechazar Documento</DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        <p className="mb-4">
                            ¿Está seguro de que desea rechazar el documento <span className="font-medium">{document.tipoDocumento?.nombre}</span>?
                        </p>

                        <div className="space-y-2">
                            <Label htmlFor="comentario-rechazo">
                                Motivo del rechazo <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="comentario-rechazo"
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                                placeholder="Explique el motivo del rechazo para que el usuario pueda corregirlo"
                                rows={3}
                                required
                            />
                            {comentario.length === 0 && (
                                <p className="text-sm text-destructive">
                                    Debe proporcionar un motivo para el rechazo
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setRejectModalOpen(false)}
                            disabled={processing}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleReject}
                            disabled={processing || comentario.length === 0}
                            variant="destructive"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Rechazar
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
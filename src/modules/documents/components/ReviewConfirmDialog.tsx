// src/modules/documents/components/ReviewConfirmDialog.tsx

'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface ReviewConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (comentario: string) => Promise<void>;
    action: 'approve' | 'reject';
    documentName: string;
}

export function ReviewConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    action,
    documentName
}: ReviewConfirmDialogProps) {
    const [comentario, setComentario] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            await onConfirm(comentario);
            setComentario('');
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {action === 'approve' ? 'Aprobar' : 'Rechazar'} Documento
                    </DialogTitle>
                    <DialogDescription>
                        {action === 'approve'
                            ? `¿Está seguro que desea aprobar el documento "${documentName}"?`
                            : `¿Está seguro que desea rechazar el documento "${documentName}"?`}
                    </DialogDescription>
                </DialogHeader>

                <Textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder={
                        action === 'approve'
                            ? 'Comentario opcional'
                            : 'Por favor, indique el motivo del rechazo'
                    }
                    className="min-h-[100px]"
                    disabled={isSubmitting}
                    required={action === 'reject'}
                />

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || (action === 'reject' && !comentario.trim())}
                        variant={action === 'approve' ? 'default' : 'destructive'}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Procesando...
                            </>
                        ) : action === 'approve' ? (
                            'Aprobar'
                        ) : (
                            'Rechazar'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
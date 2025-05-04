'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from '@/components/ui/card';
import { Loader2, Upload, X } from 'lucide-react';
import { documentService } from '../services/documentService';
import { DocumentType } from '@/types/document';
import { useToast } from '@/shared/hooks/useToast';

// Esquema de validación para el formulario
const uploadDocumentSchema = z.object({
    comentario: z.string().optional(),
    id_tipo_documento: z.number({
        required_error: 'El tipo de documento es requerido',
        invalid_type_error: 'Debe ser un número'
    }),
    file: z.instanceof(File, { message: 'El archivo es requerido' }).optional()
});

type UploadDocumentFormValues = z.infer<typeof uploadDocumentSchema>;

interface UploadDocumentFormProps {
    onSuccess?: () => void;
}

export function UploadDocumentForm({ onSuccess }: UploadDocumentFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<UploadDocumentFormValues>({
        resolver: zodResolver(uploadDocumentSchema),
        defaultValues: {
            comentario: '',
            id_tipo_documento: undefined,
        }
    });

    // Cargar los tipos de documentos disponibles
    useEffect(() => {
        const fetchDocumentTypes = async () => {
            try {
                const types = await documentService.getDocumentTypes();
                setDocumentTypes(types);
            } catch (error) {
                toast('Error al cargar los tipos de documentos', 'error');
                console.error('Error fetching document types:', error);
            }
        };

        fetchDocumentTypes();
    }, [toast]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setValue('file', file);
        }
    };

    const clearSelectedFile = () => {
        setSelectedFile(null);
        setValue('file', undefined);

        // Limpiar el input de archivo
        const fileInput = document.getElementById('file') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const onSubmit = async (data: UploadDocumentFormValues) => {
        if (!selectedFile) {
            toast('Debe seleccionar un archivo', 'error');
            return;
        }

        setIsLoading(true);
        try {
            // 1. Crear el documento
            const documentData = {
                id_tipo_documento: data.id_tipo_documento,
                comentario: data.comentario,
            };

            const response = await documentService.createDocument(documentData);
            const newDocumentId = response.documento.id;

            // 2. Subir el archivo asociado al documento
            await documentService.uploadDocumentFile(newDocumentId, selectedFile);

            toast('Documento creado y archivo subido correctamente', 'success');

            // Limpiar el formulario
            reset();
            setSelectedFile(null);

            // Callback de éxito si existe
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            toast('Error al crear el documento', 'error');
            console.error('Error creating document:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-xl mx-auto">
            <CardHeader>
                <CardTitle>Subir Nuevo Documento</CardTitle>
                <CardDescription>
                    Complete el formulario para crear un nuevo documento y subir su archivo
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="id_tipo_documento">Tipo de Documento <span className="text-destructive">*</span></Label>
                        <select
                            id="id_tipo_documento"
                            className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.id_tipo_documento ? 'border-destructive' : ''
                                }`}
                            {...register('id_tipo_documento', {
                                valueAsNumber: true
                            })}
                        >
                            <option value="">Seleccione un tipo</option>
                            {documentTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.nombre} {type.es_obligatorio ? '(Requerido)' : ''}
                                </option>
                            ))}
                        </select>
                        {errors.id_tipo_documento && (
                            <p className="text-sm text-destructive">{errors.id_tipo_documento.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comentario">Comentario</Label>
                        <Input
                            id="comentario"
                            placeholder="Descripción opcional o comentarios"
                            {...register('comentario')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file">
                            Archivo <span className="text-destructive">*</span>
                        </Label>
                        <div>
                            <Input
                                id="file"
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('file')?.click()}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Seleccionar Archivo
                                </Button>
                                {selectedFile && (
                                    <div className="flex items-center bg-secondary px-3 py-1 rounded-md">
                                        <span className="text-sm truncate max-w-[200px]">
                                            {selectedFile.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={clearSelectedFile}
                                            className="ml-2 text-muted-foreground hover:text-foreground"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            {!selectedFile && errors.file && (
                                <p className="text-sm text-destructive mt-1">{errors.file.message}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Subiendo...
                            </>
                        ) : (
                            'Subir Documento'
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
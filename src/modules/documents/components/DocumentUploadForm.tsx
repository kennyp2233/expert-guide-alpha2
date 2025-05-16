// src/modules/documents/components/DocumentUploadForm.tsx
import React, { useState, useRef } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DocumentType, Document } from '@/types/document';
import { documentUploadSchema, DocumentUploadValues } from '../schemas/documentSchemas';
import { AlertCircle, Upload, Loader2, FileText } from 'lucide-react';

interface DocumentUploadFormProps {
    open: boolean;
    onClose: () => void;
    documentTypeId?: number | null;
    document?: Document | null;
    isUpdate?: boolean;
    onSubmit: (values: any, file: File) => Promise<boolean>;
    documentTypes: DocumentType[];
}

export const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({
    open,
    onClose,
    documentTypeId,
    document,
    isUpdate = false,
    onSubmit,
    documentTypes
}) => {
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Encontrar tipo de documento
    const documentType = documentTypeId
        ? documentTypes.find(t => t.id === documentTypeId)
        : document?.tipoDocumento || null;

    // Valores iniciales del formulario
    const initialValues = {
        comentario: document?.comentario || '',
        file: undefined,
    };

    // Manejar cambio de archivo
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setFieldValue('file', selectedFile);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isUpdate ? 'Actualizar documento' : 'Subir nuevo documento'}</DialogTitle>
                </DialogHeader>

                {documentType && (
                    <div className="mb-4">
                        <div className="flex items-center mb-2">
                            <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                            <h3 className="font-medium">{documentType.nombre}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{documentType.descripcion}</p>
                    </div>
                )}

                {document && isUpdate && document.estado === 'RECHAZADO' && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Documento rechazado</AlertTitle>
                        <AlertDescription>
                            {document.comentario || 'Por favor, revise el documento y vuelva a subirlo.'}
                        </AlertDescription>
                    </Alert>
                )}

                <Formik
                    initialValues={initialValues}
                    validationSchema={documentUploadSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        if (!file && !isUpdate) {
                            return;
                        }

                        if (file) {
                            const success = await onSubmit(values, file);
                            if (success) {
                                onClose();
                            }
                        } else if (isUpdate && document) {
                            // Si solo actualizamos el comentario sin archivo
                            const dummyFile = new File([""], document.nombre_archivo || "document", { type: document.tipo_mime });
                            await onSubmit(values, dummyFile);
                            onClose();
                        }

                        setSubmitting(false);
                    }}
                >
                    {({ setFieldValue, isSubmitting, errors, touched }) => (
                        <Form className="space-y-4">
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="file">
                                        {isUpdate ? 'Actualizar archivo' : 'Seleccionar archivo'}
                                        {!isUpdate && <span className="text-destructive ml-1">*</span>}
                                    </Label>
                                    <Input
                                        id="file"
                                        name="file"
                                        type="file"
                                        onChange={(e) => handleFileChange(e, setFieldValue)}
                                        ref={fileInputRef}
                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                        className={errors.file && touched.file ? "border-destructive" : ""}
                                    />
                                    <ErrorMessage name="file" component="p" className="text-sm text-destructive" />

                                    {file && (
                                        <p className="text-sm text-muted-foreground">
                                            Archivo seleccionado: {file.name} ({Math.round(file.size / 1024)} KB)
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="comentario">Comentario (opcional)</Label>
                                    <Textarea
                                        id="comentario"
                                        name="comentario"
                                        placeholder="Añada información adicional sobre este documento"
                                        onChange={(e) => setFieldValue('comentario', e.target.value)}
                                        defaultValue={initialValues.comentario}
                                        rows={3}
                                    />
                                    <ErrorMessage name="comentario" component="p" className="text-sm text-destructive" />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={onClose} type="button" disabled={isSubmitting}>
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || (!file && !isUpdate)}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {isUpdate ? 'Actualizando...' : 'Subiendo...'}
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            {isUpdate ? 'Actualizar' : 'Subir'}
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default DocumentUploadForm;
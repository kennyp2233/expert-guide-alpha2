// src/modules/fincas/components/FarmVerificationForm.tsx
import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FincaForm } from './FincaForm';
import DocumentList from '@/modules/documents/components/DocumentsList';
import { fincaService } from '../services/fincaService';
import { documentService } from '@/modules/documents/services/documentService';
import { fincaVerificationSchema, FincaVerificationValues } from '../schemas/fincaSchemas';
import { useToast } from '@/shared/hooks/useToast';
import {
    AlertCircle,
    CheckCircle,
    XCircle,
    FileText,
    Home,
    ShieldCheck,
    Loader2
} from 'lucide-react';
import { formatDate } from '@/shared/utils/formatters';

interface FarmVerificationFormProps {
    farm: any;
    open: boolean;
    onClose: () => void;
    onApprove: (userId: string, roleId: number) => Promise<boolean>;
    onReject: (userId: string, roleId: number) => Promise<boolean>;
}

export const FarmVerificationForm: React.FC<FarmVerificationFormProps> = ({
    farm,
    open,
    onClose,
    onApprove,
    onReject
}) => {
    const [activeTab, setActiveTab] = useState('info');
    const [documentsVerification, setDocumentsVerification] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [processingApproval, setProcessingApproval] = useState(false);
    const { toast } = useToast();

    // Verificar estado de documentos al cargar
    useEffect(() => {
        const verifyDocuments = async () => {
            try {
                setLoading(true);
                const verification = await fincaService.verifyFincaDocuments(farm.finca.id);
                setDocumentsVerification(verification);
            } catch (error) {
                console.error('Error verifying documents:', error);
            } finally {
                setLoading(false);
            }
        };

        if (open && farm) {
            verifyDocuments();
        }
    }, [farm, open]);

    // Manejar aprobación de rol
    const handleApproveRole = async (values: FincaVerificationValues) => {
        if (!documentsVerification?.documentos_completos) {
            toast('No se puede aprobar, faltan documentos obligatorios', 'error');
            return;
        }

        setProcessingApproval(true);
        try {
            const success = await onApprove(farm.rol_pendiente.id_usuario, farm.rol_pendiente.id_rol);
            if (success) {
                toast('Rol de finca aprobado correctamente', 'success');
                onClose();
            }
        } catch (error) {
            toast('Error al aprobar el rol de finca', 'error');
            console.error('Error approving farm role:', error);
        } finally {
            setProcessingApproval(false);
        }
    };

    // Manejar rechazo de rol
    const handleRejectRole = async (values: FincaVerificationValues) => {
        if (!values.comentario) {
            toast('Debe proporcionar un motivo de rechazo', 'error');
            return;
        }

        setProcessingApproval(true);
        try {
            const success = await onReject(farm.rol_pendiente.id_usuario, farm.rol_pendiente.id_rol);
            if (success) {
                toast('Rol de finca rechazado', 'success');
                onClose();
            }
        } catch (error) {
            toast('Error al rechazar el rol de finca', 'error');
            console.error('Error rejecting farm role:', error);
        } finally {
            setProcessingApproval(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto min-w-[80vw]">
                <DialogHeader>
                    <DialogTitle>Verificación de Finca</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">{farm.finca.nombre_finca}</h2>
                            <p className="text-muted-foreground">
                                Usuario: {farm.usuario.usuario} ({farm.usuario.email})
                            </p>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 mt-2 md:mt-0">
                            Pendiente de verificación
                        </Badge>
                    </div>

                    <Card className="mb-6">
                        <CardContent className="py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Identificación</p>
                                    <p>Tag: <span className="font-medium">{farm.finca.tag}</span></p>
                                    <p>RUC: <span className="font-medium">{farm.finca.ruc_finca}</span></p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Fecha de registro</p>
                                    <p>{formatDate(farm.usuario.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Progreso de verificación</p>
                                    <div className="flex items-center">
                                        <Progress
                                            value={farm.finca.progreso_verificacion.porcentaje_aprobado}
                                            className="h-2 flex-1 mr-2"
                                        />
                                        <span className="text-sm font-medium">
                                            {farm.finca.progreso_verificacion.porcentaje_aprobado}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-4">
                            <TabsTrigger value="info">
                                <Home className="mr-2 h-4 w-4" />
                                Información
                            </TabsTrigger>
                            <TabsTrigger value="documents">
                                <FileText className="mr-2 h-4 w-4" />
                                Documentos
                            </TabsTrigger>
                            <TabsTrigger value="approval">
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Aprobación
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="info" className="mt-0 space-y-4">
                            <FincaForm
                                finca={farm.finca}
                                readOnly={true}
                                onSubmit={async () => { }}
                            />
                        </TabsContent>

                        <TabsContent value="documents" className="mt-0 space-y-4">
                            <DocumentList fincaId={farm.finca.id} readOnly={true} />
                        </TabsContent>

                        <TabsContent value="approval" className="mt-0 space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Aprobación de Rol de Finca</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {loading ? (
                                        <div className="flex justify-center py-4">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                                                <p className="text-muted-foreground">Verificando documentos...</p>
                                            </div>
                                        </div>
                                    ) : documentsVerification?.documentos_completos ? (
                                        <Alert className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-300">
                                            <CheckCircle className="h-4 w-4" />
                                            <AlertTitle>Documentación completa y verificada</AlertTitle>
                                            <AlertDescription>
                                                Todos los documentos obligatorios han sido subidos y aprobados.
                                                Puede proceder a aprobar el rol de finca.
                                            </AlertDescription>
                                        </Alert>
                                    ) : (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle>Documentación incompleta</AlertTitle>
                                            <AlertDescription>
                                                No se puede aprobar el rol de finca hasta que todos los documentos obligatorios
                                                estén subidos y aprobados.
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <Separator />

                                    <div className="space-y-2">
                                        <h3 className="font-medium">Información del Rol</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Usuario</p>
                                                <p className="font-medium">{farm.usuario.usuario}</p>
                                                <p className="text-sm">{farm.usuario.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Rol solicitado</p>
                                                <p className="font-medium">FINCA</p>
                                                <p className="text-sm">Finca productora registrada en el sistema</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <Formik
                                        initialValues={{ comentario: '' }}
                                        validationSchema={fincaVerificationSchema}
                                        onSubmit={() => { }}
                                    >
                                        {({ values, handleChange }) => (
                                            <Form className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="comentario">Comentario (requerido para rechazar)</Label>
                                                    <Textarea
                                                        id="comentario"
                                                        name="comentario"
                                                        value={values.comentario}
                                                        onChange={handleChange}
                                                        placeholder="Proporcione información adicional o motivo de rechazo"
                                                        rows={3}
                                                    />
                                                </div>

                                                <div className="flex justify-end gap-2 pt-4">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => handleRejectRole(values)}
                                                        disabled={processingApproval || !values.comentario}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        {processingApproval ? (
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                        )}
                                                        Rechazar Rol
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={() => handleApproveRole(values)}
                                                        disabled={processingApproval || !documentsVerification?.documentos_completos}
                                                        className="text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100"
                                                    >
                                                        {processingApproval ? (
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                        )}
                                                        Aprobar Rol
                                                    </Button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FarmVerificationForm;
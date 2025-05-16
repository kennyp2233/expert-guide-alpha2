// src/modules/fincas/components/FincaDataForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Info, CheckCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/shared/hooks/useToast';
import { fincaService } from '../services/fincaService';
import { fincaFormSchema, type FincaFormValues } from '@/modules/master-data/fincas/schemas/fincaSchemas';
import { Farm, FarmValidation } from '@/types/master-data/farm';

interface FincaDataFormProps {
    finca: Farm;
    onUpdate?: (updatedFinca: Farm) => void;
    readOnly?: boolean;
}

export function FincaDataForm({ finca, onUpdate, readOnly = false }: FincaDataFormProps) {
    const [loading, setLoading] = useState(false);
    const [validation, setValidation] = useState<FarmValidation | null>(null);
    const { toast } = useToast();

    const form = useForm<FincaFormValues>({
        resolver: zodResolver(fincaFormSchema),
        defaultValues: {
            nombre_finca: finca.nombre_finca || '',
            tag: finca.tag || '',
            ruc_finca: finca.ruc_finca || '',
            tipo_documento: finca.tipo_documento || 'RUC',
            genera_guias_certificadas: finca.genera_guias_certificadas || false,
            i_general_telefono: finca.i_general_telefono || '',
            i_general_email: finca.i_general_email || '',
            i_general_ciudad: finca.i_general_ciudad || '',
            i_general_provincia: finca.i_general_provincia || '',
            i_general_pais: finca.i_general_pais || '',
            i_general_cod_sesa: finca.i_general_cod_sesa || '',
            i_general_cod_pais: finca.i_general_cod_pais || '',
            a_nombre: finca.a_nombre || '',
            a_codigo: finca.a_codigo || '',
            a_direccion: finca.a_direccion || '',
        },
    });

    // Cargar la validación cuando cargue el componente
    useEffect(() => {
        if (readOnly) return;
        const validateFinca = async () => {
            try {
                const validationData = await fincaService.validateFincaRegistration(finca.id);
                setValidation(validationData);
            } catch (error) {
                console.error('Error validando datos de finca:', error);
            }
        };
        validateFinca();
    }, [finca.id, readOnly]);

    // Resaltar campos faltantes en el formulario
    useEffect(() => {
        if (validation?.camposFaltantes?.length) {
            validation.camposFaltantes.forEach(field => {
                form.setError(field as any, {
                    type: 'manual',
                    message: 'Este campo es obligatorio para completar el registro',
                });
            });
        }
    }, [validation, form]);

    const onSubmit = async (values: FincaFormValues) => {
        if (readOnly) return;

        setLoading(true);
        try {
            const updatedFinca = await fincaService.updateFinca(finca.id, values);
            toast('Datos de la finca actualizados correctamente', 'success');

            if (onUpdate) {
                onUpdate(updatedFinca);
            }

            // Actualizar la validación después de guardar
            const validationData = await fincaService.validateFincaRegistration(finca.id);
            setValidation(validationData);
        } catch (error) {
            toast('Error al actualizar datos de la finca', 'error');
            console.error('Error actualizando finca:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Datos de la Finca</CardTitle>
                <CardDescription>Información principal y de contacto</CardDescription>
            </CardHeader>

            {/* Alerta si hay campos obligatorios pendientes */}
            {validation && !validation.registroCompleto && (
                <CardContent>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Registro incompleto</AlertTitle>
                        <AlertDescription>
                            {validation.mensaje}
                        </AlertDescription>
                    </Alert>
                </CardContent>
            )}

            {/* Alerta si el registro está completo */}
            {validation && validation.registroCompleto && (
                <CardContent>
                    <Alert variant="default" className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Registro completo</AlertTitle>
                        <AlertDescription>
                            Todos los datos necesarios han sido completados.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Información Principal</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="nombre_finca"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre de la Finca <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={readOnly} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tag"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Código Identificador (Tag) <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={readOnly} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="ruc_finca"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>RUC <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={readOnly} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="genera_guias_certificadas"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    disabled={readOnly}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Genera guías certificadas</FormLabel>
                                                <FormDescription>
                                                    Marque si la finca genera guías de remisión certificadas
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Información de Contacto</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="i_general_telefono"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Teléfono</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={readOnly} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="i_general_email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={readOnly} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="i_general_ciudad"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ciudad</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={readOnly} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="i_general_provincia"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Provincia</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={readOnly} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="i_general_pais"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>País</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={readOnly} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="i_general_cod_sesa"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Código SESA</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={readOnly} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="i_general_cod_pais"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Código de País</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={readOnly} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Información Adicional</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="a_nombre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre Adicional</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={readOnly} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="a_codigo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Código Adicional</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={readOnly} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="a_direccion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dirección</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={readOnly} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>

                    {!readOnly && (
                        <CardFooter>
                            <Button
                                type="submit"
                                className="ml-auto"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    'Guardar Cambios'
                                )}
                            </Button>
                        </CardFooter>
                    )}
                </form>
            </Form>
        </Card>
    );
}
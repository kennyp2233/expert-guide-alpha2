// src/modules/fincas/components/FincaForm.tsx
import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { fincaFormSchema, type FincaFormValues } from '../schemas/fincaSchemas';
import { Farm, FarmValidation } from '@/types/master-data/farm';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface FincaFormProps {
    finca: Farm;
    validation?: FarmValidation | null;
    onSubmit: (values: FincaFormValues) => Promise<void>;
    readOnly?: boolean;
    loading?: boolean;
}

export const FincaForm: React.FC<FincaFormProps> = ({
    finca,
    validation,
    onSubmit,
    readOnly = false,
    loading = false,
}) => {
    // Valores iniciales para el formulario
    const initialValues: FincaFormValues = {
        nombre_finca: finca.nombre_finca || '',
        tag: finca.tag || '',
        ruc_finca: finca.ruc_finca || '',
        tipo_documento: (finca.tipo_documento as "RUC" | "CI" | "PASSPORT") || 'RUC',
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
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Datos de la Finca</CardTitle>
                <CardDescription>Información principal y de contacto</CardDescription>
            </CardHeader>

            {/* Alerta si hay campos obligatorios pendientes */}
            {validation && (
                <CardContent>
                    {!validation.registroCompleto ? (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Registro incompleto</AlertTitle>
                            <AlertDescription>
                                {validation.mensaje}
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-300">
                            <CheckCircle className="h-4 w-4" />
                            <AlertTitle>Registro completo</AlertTitle>
                            <AlertDescription>
                                Todos los datos necesarios han sido completados.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            )}

            <Formik
                initialValues={initialValues}
                validationSchema={fincaFormSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    await onSubmit(values);
                    setSubmitting(false);
                }}
                enableReinitialize={true}
            >
                {({ errors, touched, values, handleChange, setFieldValue, isSubmitting }) => (
                    <Form>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Información Principal</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Nombre de la Finca */}
                                    <div className="space-y-2">
                                        <Label htmlFor="nombre_finca" className="flex">
                                            Nombre de la Finca <span className="text-destructive ml-1">*</span>
                                        </Label>
                                        <Field
                                            as={Input}
                                            id="nombre_finca"
                                            name="nombre_finca"
                                            disabled={readOnly}
                                            className={errors.nombre_finca && touched.nombre_finca ? "border-destructive" : ""}
                                        />
                                        <ErrorMessage name="nombre_finca" component="p" className="text-sm text-destructive" />
                                    </div>

                                    {/* Tag / Código Identificador */}
                                    <div className="space-y-2">
                                        <Label htmlFor="tag" className="flex">
                                            Código Identificador (Tag) <span className="text-destructive ml-1">*</span>
                                        </Label>
                                        <Field
                                            as={Input}
                                            id="tag"
                                            name="tag"
                                            disabled={readOnly}
                                            className={errors.tag && touched.tag ? "border-destructive" : ""}
                                        />
                                        <ErrorMessage name="tag" component="p" className="text-sm text-destructive" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* RUC */}
                                    <div className="space-y-2">
                                        <Label htmlFor="ruc_finca" className="flex">
                                            RUC <span className="text-destructive ml-1">*</span>
                                        </Label>
                                        <Field
                                            as={Input}
                                            id="ruc_finca"
                                            name="ruc_finca"
                                            disabled={readOnly}
                                            className={errors.ruc_finca && touched.ruc_finca ? "border-destructive" : ""}
                                        />
                                        <ErrorMessage name="ruc_finca" component="p" className="text-sm text-destructive" />
                                    </div>

                                    {/* Guías Certificadas */}
                                    <div className="flex items-start space-x-3 space-y-0 pt-6">
                                        <Checkbox
                                            id="genera_guias_certificadas"
                                            checked={values.genera_guias_certificadas}
                                            onCheckedChange={(checked) => {
                                                setFieldValue('genera_guias_certificadas', checked);
                                            }}
                                            disabled={readOnly}
                                        />
                                        <div className="space-y-1 leading-none">
                                            <Label htmlFor="genera_guias_certificadas">Genera guías certificadas</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Marque si la finca genera guías de remisión certificadas
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Información de Contacto</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Teléfono */}
                                    <div className="space-y-2">
                                        <Label htmlFor="i_general_telefono">Teléfono</Label>
                                        <Field
                                            as={Input}
                                            id="i_general_telefono"
                                            name="i_general_telefono"
                                            disabled={readOnly}
                                            className={errors.i_general_telefono && touched.i_general_telefono ? "border-destructive" : ""}
                                        />
                                        <ErrorMessage name="i_general_telefono" component="p" className="text-sm text-destructive" />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="i_general_email">Email</Label>
                                        <Field
                                            as={Input}
                                            id="i_general_email"
                                            name="i_general_email"
                                            disabled={readOnly}
                                            className={errors.i_general_email && touched.i_general_email ? "border-destructive" : ""}
                                        />
                                        <ErrorMessage name="i_general_email" component="p" className="text-sm text-destructive" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Ciudad */}
                                    <div className="space-y-2">
                                        <Label htmlFor="i_general_ciudad">Ciudad</Label>
                                        <Field
                                            as={Input}
                                            id="i_general_ciudad"
                                            name="i_general_ciudad"
                                            disabled={readOnly}
                                        />
                                        <ErrorMessage name="i_general_ciudad" component="p" className="text-sm text-destructive" />
                                    </div>

                                    {/* Provincia */}
                                    <div className="space-y-2">
                                        <Label htmlFor="i_general_provincia">Provincia</Label>
                                        <Field
                                            as={Input}
                                            id="i_general_provincia"
                                            name="i_general_provincia"
                                            disabled={readOnly}
                                        />
                                        <ErrorMessage name="i_general_provincia" component="p" className="text-sm text-destructive" />
                                    </div>

                                    {/* País */}
                                    <div className="space-y-2">
                                        <Label htmlFor="i_general_pais">País</Label>
                                        <Field
                                            as={Input}
                                            id="i_general_pais"
                                            name="i_general_pais"
                                            disabled={readOnly}
                                        />
                                        <ErrorMessage name="i_general_pais" component="p" className="text-sm text-destructive" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Código SESA */}
                                    <div className="space-y-2">
                                        <Label htmlFor="i_general_cod_sesa">Código SESA</Label>
                                        <Field
                                            as={Input}
                                            id="i_general_cod_sesa"
                                            name="i_general_cod_sesa"
                                            disabled={readOnly}
                                        />
                                        <ErrorMessage name="i_general_cod_sesa" component="p" className="text-sm text-destructive" />
                                    </div>

                                    {/* Código de País */}
                                    <div className="space-y-2">
                                        <Label htmlFor="i_general_cod_pais">Código de País</Label>
                                        <Field
                                            as={Input}
                                            id="i_general_cod_pais"
                                            name="i_general_cod_pais"
                                            disabled={readOnly}
                                        />
                                        <ErrorMessage name="i_general_cod_pais" component="p" className="text-sm text-destructive" />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Información Adicional</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Nombre Adicional */}
                                    <div className="space-y-2">
                                        <Label htmlFor="a_nombre">Nombre Adicional</Label>
                                        <Field
                                            as={Input}
                                            id="a_nombre"
                                            name="a_nombre"
                                            disabled={readOnly}
                                        />
                                        <ErrorMessage name="a_nombre" component="p" className="text-sm text-destructive" />
                                    </div>

                                    {/* Código Adicional */}
                                    <div className="space-y-2">
                                        <Label htmlFor="a_codigo">Código Adicional</Label>
                                        <Field
                                            as={Input}
                                            id="a_codigo"
                                            name="a_codigo"
                                            disabled={readOnly}
                                        />
                                        <ErrorMessage name="a_codigo" component="p" className="text-sm text-destructive" />
                                    </div>
                                </div>

                                {/* Dirección */}
                                <div className="space-y-2">
                                    <Label htmlFor="a_direccion">Dirección</Label>
                                    <Field
                                        as={Input}
                                        id="a_direccion"
                                        name="a_direccion"
                                        disabled={readOnly}
                                    />
                                    <ErrorMessage name="a_direccion" component="p" className="text-sm text-destructive" />
                                </div>
                            </div>
                        </CardContent>

                        {!readOnly && (
                            <CardFooter>
                                <Button
                                    type="submit"
                                    className="ml-auto"
                                    disabled={isSubmitting || loading}
                                >
                                    {(isSubmitting || loading) ? (
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
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default FincaForm;
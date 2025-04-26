// src/shared/components/forms/FormWrapper.tsx
import React from 'react';
import { Formik, Form as FormikForm, FormikHelpers, FormikValues } from 'formik';
import { AnyObjectSchema } from 'yup';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormWrapperProps<Values extends FormikValues> {
    initialValues: Values;
    validationSchema?: AnyObjectSchema;  // Ahora acepta esquema de Yup
    onSubmit: (values: Values, formikHelpers: FormikHelpers<Values>) => void | Promise<void>;
    children: React.ReactNode;
    title?: React.ReactNode;
    description?: React.ReactNode;
    submitText?: React.ReactNode;
    className?: string;
}

export function FormWrapper<Values extends FormikValues>({
    initialValues,
    validationSchema,
    onSubmit,
    children,
    title,
    description,
    submitText = 'Guardar',
    className,
}: FormWrapperProps<Values>) {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}  // Formik usa yup directamente
            onSubmit={onSubmit}
        >
            {({ isSubmitting }) => (
                <Card className={cn('w-full', className)}>
                    {(title || description) && (
                        <CardHeader>
                            {title && <CardTitle>{title}</CardTitle>}
                            {description && <CardDescription>{description}</CardDescription>}
                        </CardHeader>
                    )}
                    <FormikForm>
                        <CardContent className="space-y-4">{children}</CardContent>
                        <CardFooter className="flex flex-col gap-2">
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...
                                    </>
                                ) : (
                                    submitText
                                )}
                            </Button>
                        </CardFooter>
                    </FormikForm>
                </Card>
            )}
        </Formik>
    );
}

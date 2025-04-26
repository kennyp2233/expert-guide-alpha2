// src/modules/auth/components/ForgotPasswordForm.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { useToast } from '@/shared/hooks/useToast';
import { ForgotPasswordFormValues, forgotPasswordSchema } from '@/modules/auth/schemas/authSchemas';
import { useFormWithToast } from '@/shared/hooks/useFormWithToast';
import { FormField } from '@/shared/components/ui/form';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from '@/components/ui/card';
import { Loader2, CheckCircle } from 'lucide-react';

export function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();

    const form = useFormWithToast<ForgotPasswordFormValues, typeof forgotPasswordSchema>(forgotPasswordSchema, {
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        setIsLoading(true);

        try {
            // Aquí iría la llamada a la API para recuperar contraseña
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulación

            setIsSubmitted(true);
            toast('Se ha enviado un correo con instrucciones para restablecer su contraseña', 'success');
        } catch (error) {
            toast('Error al enviar el correo de recuperación', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <Card className="w-full max-w-md mx-auto shadow-md">
                <CardContent className="pt-6 pb-6 text-center">
                    <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
                    <CardTitle className="mb-2">Correo Enviado</CardTitle>
                    <CardDescription className="mb-6">
                        Hemos enviado instrucciones para restablecer su contraseña a su correo electrónico.
                        Por favor, revise su bandeja de entrada.
                    </CardDescription>
                    <Button asChild className="mt-2">
                        <Link href="/auth/login">Volver al inicio de sesión</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto shadow-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-xl font-bold">Recuperar Contraseña</CardTitle>
                <CardDescription>
                    Ingrese su correo electrónico y le enviaremos instrucciones para restablecer su contraseña
                </CardDescription>
            </CardHeader>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <FormField
                            name="email"
                            label="Correo Electrónico"
                            type="email"
                            placeholder="ejemplo@correo.com"
                            required
                        />
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                                </>
                            ) : (
                                'Enviar Instrucciones'
                            )}
                        </Button>
                        <p className="text-center text-sm">
                            <Link href="/auth/login" className="text-primary hover:underline">
                                Volver al inicio de sesión
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </FormProvider>
        </Card>
    );
}
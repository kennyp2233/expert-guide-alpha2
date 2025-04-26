// src/modules/auth/components/LoginForm.tsx
'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { FormikHelpers } from 'formik';

import { useAuthStore } from '@/modules/auth/stores/useAuthStore';
import { useToast } from '@/shared/hooks/useToast';
import { LoginFormValues, loginSchema } from '@/modules/auth/schemas/authSchemas';
import { FormWrapper } from '@/shared/components/forms/FormWrapper';
import { FormField } from '@/shared/components/ui/form';

export function LoginForm() {
    const { login, isLoading, error, clearError } = useAuthStore();
    const { toast } = useToast();
    const router = useRouter();
    const returnUrl = useSearchParams().get('returnUrl') || '/dashboard';

    const initialValues: LoginFormValues = {
        email: '',
        password: '',
    };

    const handleSubmit = async (
        values: LoginFormValues,
        { setSubmitting }: FormikHelpers<LoginFormValues>
    ) => {
        clearError();
        const success = await login(values);
        if (success) {
            toast('Sesión iniciada correctamente', 'success');
            router.push(returnUrl);
        }
        setSubmitting(false);
    };

    return (
        <FormWrapper<LoginFormValues>
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
            title="Iniciar Sesión"
            description="Ingrese sus credenciales para acceder a su cuenta"
            submitText="Iniciar Sesión"
            className="max-w-md mx-auto shadow-md"
        >
            <FormField
                name="email"
                type="email"
                label="Correo Electrónico"
                placeholder="ejemplo@correo.com"
                required
            />

            <div className="flex items-center justify-between">
                <FormField
                    name="password"
                    type="password"
                    label="Contraseña"
                    placeholder="••••••••"
                    required
                />
                <Link
                    href="/auth/forgot-password"
                    className="text-xs text-primary hover:underline"
                >
                    ¿Olvidó su contraseña?
                </Link>
            </div>

            {error && (
                <div className="p-3 text-sm rounded-md bg-destructive/10 text-destructive">
                    {error}
                </div>
            )}

            <p className="text-center text-sm">
                ¿No tiene una cuenta?{' '}
                <Link
                    href="/auth/register/client"
                    className="text-primary hover:underline"
                >
                    Regístrese aquí
                </Link>
            </p>
        </FormWrapper>
    );
}

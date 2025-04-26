// src/modules/auth/components/RegisterClientForm.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { FormWrapper } from '@/shared/components/forms/FormWrapper';
import { FormField } from '@/shared/components/ui/form';
import { useAuthStore } from '@/modules/auth/stores/useAuthStore';
import { useToast } from '@/shared/hooks/useToast';
import { RegisterClientFormValues, registerClientSchema } from '@/modules/auth/schemas/authSchemas';

export function RegisterClientForm() {
    const { registerClient, isLoading, error, clearError } = useAuthStore();
    const { toast } = useToast();
    const router = useRouter();

    const initialValues: RegisterClientFormValues = {
        username: '',
        nombre: '',
        telefono: '',
        email: '',
        password: '',
        passwordConfirm: '',
        terms: false,
    };

    const handleSubmit = async (
        values: RegisterClientFormValues,
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        clearError();
        try {
            const success = await registerClient(values);
            if (success) {
                toast('Registro exitoso', 'success');
                router.push('/auth/login');
            }
        } catch (err) {
            toast(
                err instanceof Error ? err.message : 'Error al registrar cliente',
                'error'
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <FormWrapper<RegisterClientFormValues>
            initialValues={initialValues}
            validationSchema={registerClientSchema}
            onSubmit={handleSubmit}
            title="Crear cuenta de cliente"
            description="Complete sus datos para registrarse como cliente"
            submitText="Registrarse"
            className="max-w-md mx-auto"
        >
            <FormField
                name="username"
                label="Nombre de Usuario"
                placeholder="Ingrese un nombre de usuario"
                required
            />

            <FormField
                name="nombre"
                label="Nombre de la Empresa"
                placeholder="Ingrese el nombre de su empresa"
                required
            />

            <FormField
                name="telefono"
                label="Teléfono"
                placeholder="Ingrese su teléfono"
                required
            />

            <FormField
                name="email"
                type="email"
                label="Email"
                placeholder="ejemplo@correo.com"
                required
            />

            <FormField
                name="password"
                type="password"
                label="Contraseña"
                placeholder="••••••••"
                required
            />

            <FormField
                name="passwordConfirm"
                type="password"
                label="Confirmar Contraseña"
                placeholder="••••••••"
                required
            />

            <FormField
                name="terms"
                type="checkbox"
                label={
                    <>
                        Acepto los{' '}
                        <Link href="/terms" className="text-primary hover:underline">
                            términos y condiciones
                        </Link>
                    </>
                }
                required
            />

            {error && (
                <div className="p-3 text-sm rounded-md bg-destructive/10 text-destructive">
                    {error}
                </div>
            )}
        </FormWrapper>
    );
}
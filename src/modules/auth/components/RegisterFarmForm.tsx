// src/modules/auth/components/RegisterFarmForm.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { FormikHelpers } from 'formik';

import { useAuthStore } from '@/modules/auth/stores/useAuthStore';
import { useToast } from '@/shared/hooks/useToast';
import {
    RegisterFarmFormValues,
    registerFarmSchema,
} from '@/modules/auth/schemas/authSchemas';
import { FormWrapper } from '@/shared/components/forms/FormWrapper';
import { FormField } from '@/shared/components/ui/form';

export function RegisterFarmForm() {
    const { registerFarm, isLoading, error, clearError } = useAuthStore();
    const { toast } = useToast();
    const router = useRouter();

    const initialValues: RegisterFarmFormValues = {
        username: '',
        nombre_finca: '',
        tag: '',
        email: '',
        password: '',
        passwordConfirm: '',
        ruc_finca: '',
        tipo_documento: 'RUC',
        terms: false,
    };

    const handleSubmit = async (
        values: RegisterFarmFormValues,
        { setSubmitting }: FormikHelpers<RegisterFarmFormValues>
    ) => {
        clearError();
        const { passwordConfirm, terms, ...requestData } = values;
        const success = await registerFarm(requestData);
        if (success) {
            toast(
                'Registro de finca exitoso, ahora puede iniciar sesión',
                'success'
            );
            router.push('/auth/login');
        }
        setSubmitting(false);
    };

    return (
        <FormWrapper<RegisterFarmFormValues>
            initialValues={initialValues}
            validationSchema={registerFarmSchema}
            onSubmit={handleSubmit}
            title="Registro de Finca Florícola"
            description="Complete el formulario para crear su cuenta de finca"
            submitText="Registrar Finca"
            className="max-w-lg mx-auto"
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                    name="nombre_finca"
                    label="Nombre de la Finca"
                    placeholder="Nombre legal de la finca"
                    required
                />
                <FormField
                    name="tag"
                    label="Tag/Código"
                    placeholder="Código identificador"
                    required
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                    name="username"
                    label="Nombre de Usuario"
                    placeholder="Nombre para iniciar sesión"
                    required
                />
                <FormField
                    name="email"
                    label="Correo Electrónico"
                    type="email"
                    placeholder="contacto@finca.com"
                    required
                />
            </div>

            <FormField
                name="ruc_finca"
                label="RUC"
                placeholder="Número de RUC"
                required
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            </div>

            <FormField
                name="terms"
                type="checkbox"
                label={
                    <>
                        Acepto los{' '}
                        <Link
                            href="/terms"
                            className="text-primary hover:underline"
                        >
                            términos y condiciones
                        </Link>{' '}
                        y la{' '}
                        <Link
                            href="/privacy"
                            className="text-primary hover:underline"
                        >
                            política de privacidad
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

            <p className="text-center text-sm">
                ¿Ya tiene una cuenta?{' '}
                <Link
                    href="/auth/login"
                    className="text-primary hover:underline"
                >
                    Inicie sesión aquí
                </Link>
            </p>
        </FormWrapper>
    );
}

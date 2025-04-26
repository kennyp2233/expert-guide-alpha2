'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { useAuthStore } from '../stores/useAuthStore';
import { useToast } from '@/shared/hooks/useToast';
import { LoginFormValues, loginSchema } from '@/modules/auth/schemas/authSchemas';

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

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error, clearError } = useAuthStore();
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl') || '/dashboard';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    // Manejar errores del store
    useEffect(() => {
        if (error) {
            toast(error, 'error');
            clearError();
        }
    }, [error, toast, clearError]);

    const onSubmit = async (data: LoginFormValues) => {
        const success = await login(data);

        if (success) {
            toast('Sesión iniciada correctamente', 'success');
            router.push(returnUrl);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
                <CardDescription>
                    Ingrese sus credenciales para acceder a su cuenta
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="ejemplo@correo.com"
                            {...register('email')}
                            className={errors.email ? 'border-destructive' : ''}
                            aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                {...register('password')}
                                className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                                aria-invalid={!!errors.password}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-destructive">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center justify-end">
                        <Link
                            href="/auth/forgot-password"
                            className="text-sm text-primary hover:underline"
                        >
                            ¿Olvidó su contraseña?
                        </Link>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Iniciando sesión...
                            </>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </Button>
                    <div className="text-center text-sm">
                        ¿No tiene una cuenta?{' '}
                        <Link href="/auth/register/client" className="text-primary hover:underline">
                            Regístrese aquí
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { useAuthStore } from '../stores/useAuthStore';
import { useToast } from '@/shared/hooks/useToast';
import {
    RegisterClientFormValues,
    registerClientSchema
} from '@/modules/auth/schemas/authSchemas';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from '@/components/ui/card';

export function RegisterClientForm() {
    const [showPassword, setShowPassword] = useState(false);
    const { registerClient, isLoading, error, clearError } = useAuthStore();
    const { toast } = useToast();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<RegisterClientFormValues>({
        resolver: zodResolver(registerClientSchema),
        defaultValues: {
            nombre: '',
            email: '',
            password: '',
            passwordConfirm: '',
            telefono: '',
            empresa: '',
            pais: '',
            ciudad: '',
            terms: false,
        },
    });

    // Manejar errores del store
    useEffect(() => {
        if (error) {
            toast(error, 'error');
            clearError();
        }
    }, [error, toast, clearError]);

    const onSubmit = async (data: RegisterClientFormValues) => {
        // Eliminar campos no necesarios para la API
        const { passwordConfirm, terms, ...requestData } = data;

        const success = await registerClient(requestData);

        if (success) {
            toast('Registro exitoso, ahora puede iniciar sesión', 'success');
            router.push('/auth/login');
        }
    };

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Registro de Cliente</CardTitle>
                <CardDescription>
                    Complete el formulario para crear su cuenta de cliente
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    {/* Información personal */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre Completo <span className="text-destructive">*</span></Label>
                            <Input
                                id="nombre"
                                placeholder="Su nombre completo"
                                {...register('nombre')}
                                className={errors.nombre ? 'border-destructive' : ''}
                                aria-invalid={!!errors.nombre}
                            />
                            {errors.nombre && (
                                <p className="text-sm text-destructive">{errors.nombre.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico <span className="text-destructive">*</span></Label>
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
                    </div>

                    {/* Contraseñas */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña <span className="text-destructive">*</span></Label>
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
                                <p className="text-sm text-destructive">{errors.password.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="passwordConfirm">Confirmar Contraseña <span className="text-destructive">*</span></Label>
                            <Input
                                id="passwordConfirm"
                                type="password"
                                placeholder="••••••••"
                                {...register('passwordConfirm')}
                                className={errors.passwordConfirm ? 'border-destructive' : ''}
                                aria-invalid={!!errors.passwordConfirm}
                            />
                            {errors.passwordConfirm && (
                                <p className="text-sm text-destructive">{errors.passwordConfirm.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Contacto e información adicional */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="telefono">Teléfono <span className="text-destructive">*</span></Label>
                            <Input
                                id="telefono"
                                type="tel"
                                placeholder="+593 xxxxxxxxx"
                                {...register('telefono')}
                                className={errors.telefono ? 'border-destructive' : ''}
                                aria-invalid={!!errors.telefono}
                            />
                            {errors.telefono && (
                                <p className="text-sm text-destructive">{errors.telefono.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="empresa">Empresa</Label>
                            <Input
                                id="empresa"
                                placeholder="Nombre de su empresa (opcional)"
                                {...register('empresa')}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="pais">País</Label>
                            <Input
                                id="pais"
                                placeholder="Su país (opcional)"
                                {...register('pais')}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ciudad">Ciudad</Label>
                            <Input
                                id="ciudad"
                                placeholder="Su ciudad (opcional)"
                                {...register('ciudad')}
                            />
                        </div>
                    </div>

                    {/* Términos y condiciones */}
                    <div className="space-y-4">
                        <div className="flex items-start space-x-2">
                            <Checkbox
                                id="terms"
                                checked={watch('terms')}
                                onCheckedChange={(checked) => setValue('terms', checked as boolean)}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label
                                    htmlFor="terms"
                                    className={errors.terms ? 'text-destructive font-normal' : 'font-normal'}
                                >
                                    Acepto los <Link href="/terms" className="text-primary hover:underline">
                                        términos y condiciones
                                    </Link> y la <Link href="/privacy" className="text-primary hover:underline">
                                        política de privacidad
                                    </Link>
                                </Label>
                                {errors.terms && (
                                    <p className="text-sm text-destructive">{errors.terms.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...
                            </>
                        ) : (
                            'Registrarse'
                        )}
                    </Button>
                    <div className="text-center text-sm">
                        ¿Ya tiene una cuenta?{' '}
                        <Link href="/auth/login" className="text-primary hover:underline">
                            Inicie sesión aquí
                        </Link>
                    </div>
                    <div className="text-center text-sm">
                        ¿Es una finca florícola?{' '}
                        <Link href="/auth/register/farm" className="text-primary hover:underline">
                            Regístrese como finca
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}
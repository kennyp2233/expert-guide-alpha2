'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Rocket, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';

import { AuthGuard } from '@/modules/auth/components/AuthGuard';
import { useAuthStore } from '@/modules/auth/stores/useAuthStore';
import { useToast } from '@/shared/hooks/useToast';
import { RegisterFarmFormValues, registerFarmSchema } from '@/modules/auth/schemas/authSchemas';

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

export default function RegisterFarmPage() {
    const [showPassword, setShowPassword] = useState(false);
    const { registerFarm, isLoading, error, clearError } = useAuthStore();
    const { toast } = useToast();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<RegisterFarmFormValues>({
        resolver: zodResolver(registerFarmSchema),
        defaultValues: {
            nombre: '',
            tag: '',
            email: '',
            password: '',
            passwordConfirm: '',
            ruc: '',
            telefono: '',
            terms: false,
        },
    });

    const onSubmit = async (data: RegisterFarmFormValues) => {
        // Eliminar campos no necesarios para la API
        const { passwordConfirm, terms, ...requestData } = data;

        try {
            const success = await registerFarm(requestData);
            if (success) {
                toast('Registro de finca exitoso', 'success');
                router.push('/auth/login');
            }
        } catch (error) {
            // Los errores ya son manejados por el store
        }
    };

    // Mostrar mensaje de error del store
    if (error) {
        toast(error, 'error');
        clearError();
    }

    return (
        <AuthGuard requireAuth={false}>
            <div className="flex min-h-screen flex-col bg-muted/5">
                <header className="flex h-16 items-center border-b px-4 md:px-6 bg-background">
                    <div className="flex items-center justify-between w-full">
                        <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
                            <Rocket className="h-6 w-6 text-primary" />
                            <span className="text-primary">EHC ERP</span>
                        </Link>
                        <Link href="/auth/login" className="flex items-center text-sm font-medium hover:text-primary transition-colors">
                            <ArrowLeft className="mr-1 h-4 w-4" /> Volver al inicio de sesión
                        </Link>
                    </div>
                </header>

                <main className="flex-1 flex items-center justify-center p-4 md:p-6">
                    <div className="w-full max-w-md">
                        <div className="mb-6 text-center">
                            <h1 className="text-2xl font-bold">Registro de Finca Florícola</h1>
                            <p className="mt-2 text-muted-foreground">
                                Complete el registro para empezar a utilizar nuestra plataforma
                            </p>
                        </div>

                        <Card className="w-full shadow-md">
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-xl">Información de la Finca</CardTitle>
                                <CardDescription>
                                    Ingrese los datos de su finca florícola
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <CardContent className="space-y-4">
                                    {/* Información principal */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nombre">Nombre <span className="text-destructive">*</span></Label>
                                            <Input
                                                id="nombre"
                                                placeholder="Nombre de su finca"
                                                {...register('nombre')}
                                                aria-invalid={!!errors.nombre}
                                            />
                                            {errors.nombre && (
                                                <p className="text-sm text-destructive">{errors.nombre.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tag">Código <span className="text-destructive">*</span></Label>
                                            <Input
                                                id="tag"
                                                placeholder="Código identificador"
                                                {...register('tag')}
                                                aria-invalid={!!errors.tag}
                                            />
                                            {errors.tag && (
                                                <p className="text-sm text-destructive">{errors.tag.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Información de contacto */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Correo Electrónico <span className="text-destructive">*</span></Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="contacto@finca.com"
                                            {...register('email')}
                                            aria-invalid={!!errors.email}
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-destructive">{errors.email.message}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="ruc">RUC <span className="text-destructive">*</span></Label>
                                            <Input
                                                id="ruc"
                                                placeholder="Número de RUC"
                                                {...register('ruc')}
                                                aria-invalid={!!errors.ruc}
                                            />
                                            {errors.ruc && (
                                                <p className="text-sm text-destructive">{errors.ruc.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="telefono">Teléfono <span className="text-destructive">*</span></Label>
                                            <Input
                                                id="telefono"
                                                type="tel"
                                                placeholder="+593 xxxxxxxxx"
                                                {...register('telefono')}
                                                aria-invalid={!!errors.telefono}
                                            />
                                            {errors.telefono && (
                                                <p className="text-sm text-destructive">{errors.telefono.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Contraseñas */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Contraseña <span className="text-destructive">*</span></Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    {...register('password')}
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
                                            <Label htmlFor="passwordConfirm">Confirmar <span className="text-destructive">*</span></Label>
                                            <Input
                                                id="passwordConfirm"
                                                type="password"
                                                placeholder="••••••••"
                                                {...register('passwordConfirm')}
                                                aria-invalid={!!errors.passwordConfirm}
                                            />
                                            {errors.passwordConfirm && (
                                                <p className="text-sm text-destructive">{errors.passwordConfirm.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Términos y condiciones */}
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="terms"
                                                checked={watch('terms')}
                                                onCheckedChange={(checked) => setValue('terms', checked as boolean)}
                                            />
                                            <Label
                                                htmlFor="terms"
                                                className={errors.terms ? 'text-destructive font-normal' : 'font-normal'}
                                            >
                                                Acepto los <Link href="/terms" className="text-primary hover:underline">
                                                    términos y condiciones
                                                </Link>
                                            </Label>
                                        </div>
                                        {errors.terms && (
                                            <p className="text-sm text-destructive">{errors.terms.message}</p>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col space-y-4">
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...
                                            </>
                                        ) : (
                                            'Registrar Finca'
                                        )}
                                    </Button>
                                    <p className="text-center text-sm text-muted-foreground">
                                        ¿Ya tiene una cuenta?{' '}
                                        <Link href="/auth/login" className="text-primary hover:underline">
                                            Inicie sesión aquí
                                        </Link>
                                    </p>
                                    <p className="text-center text-sm text-muted-foreground">
                                        ¿Es un cliente comprador?{' '}
                                        <Link href="/auth/register/client" className="text-primary hover:underline">
                                            Regístrese como cliente
                                        </Link>
                                    </p>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
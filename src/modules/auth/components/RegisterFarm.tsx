'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { useAuthStore } from '../stores/useAuthStore';
import { useToast } from '@/shared/hooks/useToast';
import {
    RegisterFarmFormValues,
    registerFarmSchema,
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
    CardFooter,
} from '@/components/ui/card';

export function RegisterFarmForm() {
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
            username: '',
            nombre_finca: '',
            tag: '',
            email: '',
            password: '',
            passwordConfirm: '',
            ruc_finca: '',
            tipo_documento: '',

            terms: false,
        },
    });

    const onSubmit = async (data: RegisterFarmFormValues) => {
        try {
            const {
                passwordConfirm,
                terms,
                ...rest
            } = data;

            // Mapeo correcto según API
            const requestData = {
                username: rest.username,
                email: rest.email,
                password: rest.password,
                nombre_finca: rest.nombre_finca,
                tag: rest.tag || undefined, // opcional
                ruc_finca: rest.ruc_finca,
                tipo_documento: rest.tipo_documento,
            };

            await registerFarm(requestData);
            toast('Registro de finca exitoso, ahora puede iniciar sesión', 'success');
            router.push('/auth/login');
        } catch (error) {
            // Los errores ya son manejados en el store
        }
    };

    if (error) {
        toast(error, 'error');
        clearError();
    }

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Registro de Finca Florícola</CardTitle>
                <CardDescription>
                    Complete el formulario para crear su cuenta de finca
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    {/* Información principal de la finca */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="nombre_finca">Nombre de la Finca <span className="text-destructive">*</span></Label>
                            <Input
                                id="nombre_finca"
                                placeholder="Nombre legal de la finca"
                                {...register('nombre_finca')}
                                className={errors.nombre_finca ? 'border-destructive' : ''}
                            />
                            {errors.nombre_finca && (
                                <p className="text-sm text-destructive">{errors.nombre_finca.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tag">Tag/Código <span className="text-destructive">*</span></Label>
                            <Input
                                id="tag"
                                placeholder="Código identificador"
                                {...register('tag')}
                                className={errors.tag ? 'border-destructive' : ''}
                            />
                            {errors.tag && (
                                <p className="text-sm text-destructive">{errors.tag.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Información de usuario */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="username">Nombre de Usuario <span className="text-destructive">*</span></Label>
                            <Input
                                id="username"
                                placeholder="Nombre para iniciar sesión"
                                {...register('username')}
                                className={errors.username ? 'border-destructive' : ''}
                            />
                            {errors.username && (
                                <p className="text-sm text-destructive">{errors.username.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico <span className="text-destructive">*</span></Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="contacto@finca.com"
                                {...register('email')}
                                className={errors.email ? 'border-destructive' : ''}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ruc_finca">RUC <span className="text-destructive">*</span></Label>
                        <Input
                            id="ruc_finca"
                            placeholder="Número de RUC"
                            {...register('ruc_finca')}
                            className={errors.ruc_finca ? 'border-destructive' : ''}
                        />
                        {errors.ruc_finca && (
                            <p className="text-sm text-destructive">{errors.ruc_finca.message}</p>
                        )}
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
                            />
                            {errors.passwordConfirm && (
                                <p className="text-sm text-destructive">{errors.passwordConfirm.message}</p>
                            )}
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
                            'Registrar Finca'
                        )}
                    </Button>
                    <div className="text-center text-sm">
                        ¿Ya tiene una cuenta?{' '}
                        <Link href="/auth/login" className="text-primary hover:underline">
                            Inicie sesión aquí
                        </Link>
                    </div>
                    <div className="text-center text-sm">
                        ¿Es un cliente comprador?{' '}
                        <Link href="/auth/register/client" className="text-primary hover:underline">
                            Regístrese como cliente
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}

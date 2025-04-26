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
    registerFarmSchema
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
            nombre: '',
            tag: '',
            email: '',
            password: '',
            passwordConfirm: '',
            ruc: '',
            telefono: '',
            direccion: '',
            ciudad: '',
            pais: '',
            terms: false,
        },
    });

    const onSubmit = async (data: RegisterFarmFormValues) => {
        try {
            // Eliminar campos no necesarios para la API
            const { passwordConfirm, terms, ...requestData } = data;

            await registerFarm(requestData);
            toast('Registro de finca exitoso, ahora puede iniciar sesión', 'success');
            router.push('/auth/login');
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
                            <Label htmlFor="nombre">Nombre de la Finca <span className="text-destructive">*</span></Label>
                            <Input
                                id="nombre"
                                placeholder="Nombre legal de la finca"
                                {...register('nombre')}
                                className={errors.nombre ? 'border-destructive' : ''}
                            />
                            {errors.nombre && (
                                <p className="text-sm text-destructive">{errors.nombre.message}</p>
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

                    {/* Información de contacto */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        <div className="space-y-2">
                            <Label htmlFor="ruc">RUC <span className="text-destructive">*</span></Label>
                            <Input
                                id="ruc"
                                placeholder="Número de RUC"
                                {...register('ruc')}
                                className={errors.ruc ? 'border-destructive' : ''}
                            />
                            {errors.ruc && (
                                <p className="text-sm text-destructive">{errors.ruc.message}</p>
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

                    {/* Información adicional de contacto */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="telefono">Teléfono <span className="text-destructive">*</span></Label>
                            <Input
                                id="telefono"
                                type="tel"
                                placeholder="+593 xxxxxxxxx"
                                {...register('telefono')}
                                className={errors.telefono ? 'border-destructive' : ''}
                            />
                            {errors.telefono && (
                                <p className="text-sm text-destructive">{errors.telefono.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="direccion">Dirección</Label>
                            <Input
                                id="direccion"
                                placeholder="Dirección física (opcional)"
                                {...register('direccion')}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="pais">País</Label>
                            <Input
                                id="pais"
                                placeholder="País (opcional)"
                                {...register('pais')}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ciudad">Ciudad</Label>
                            <Input
                                id="ciudad"
                                placeholder="Ciudad (opcional)"
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
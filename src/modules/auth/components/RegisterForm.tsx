import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/shared/hooks/useToast';

// Esquema de validación corregido
const registerSchema = z.object({
    username: z.string().min(1, 'El nombre de usuario es requerido'),
    nombre: z.string().min(1, 'El nombre de la empresa es requerido'),
    telefono: z.string().min(1, 'El teléfono es requerido'),
    email: z.string().min(1, 'El email es requerido').email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'La confirmación de contraseña es requerida'),
    terms: z.boolean().refine(val => val === true, {
        message: 'Debes aceptar los términos y condiciones'
    })
}).refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
    onSubmit: (data: RegisterFormValues) => Promise<boolean>;
    title: string;
    description: string;
    submitText: string;
    redirectText: string;
    redirectLink: string;
    redirectLinkText: string;
    isLoading?: boolean;
}

export function RegisterForm({
    onSubmit,
    title,
    description,
    submitText,
    redirectText,
    redirectLink,
    redirectLinkText,
    isLoading = false,
}: RegisterFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            nombre: '',
            telefono: '',
            email: '',
            password: '',
            confirmPassword: '',
            terms: false,
        },
    });

    const handleFormSubmit = async (data: RegisterFormValues) => {
        const apiData = {
            username: data.username,
            nombre: data.nombre,
            telefono: data.telefono,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
            terms: data.terms
        };

        try {
            const success = await onSubmit(apiData);

            if (success) {
                toast('Registro exitoso', 'success');
                router.push('/auth/login');
            }
        } catch (error) {
            toast('Error al registrar usuario', 'error');
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto shadow-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
                <CardDescription className="text-center">
                    {description}
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Nombre de Usuario</Label>
                        <Input
                            id="username"
                            placeholder="Ingrese un nombre de usuario"
                            {...register('username')}
                            aria-invalid={!!errors.username}
                        />
                        {errors.username && (
                            <p className="text-sm text-destructive">{errors.username.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre de la Empresa</Label>
                        <Input
                            id="nombre"
                            placeholder="Ingrese el nombre de su empresa"
                            {...register('nombre')}
                            aria-invalid={!!errors.nombre}
                        />
                        {errors.nombre && (
                            <p className="text-sm text-destructive">{errors.nombre.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                            id="telefono"
                            placeholder="Ingrese su teléfono"
                            {...register('telefono')}
                            aria-invalid={!!errors.telefono}
                        />
                        {errors.telefono && (
                            <p className="text-sm text-destructive">{errors.telefono.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="ejemplo@correo.com"
                            {...register('email')}
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
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            {...register('confirmPassword')}
                            aria-invalid={!!errors.confirmPassword}
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                        )}
                    </div>

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
                            Acepto los <Link href="/terms" className="text-primary hover:underline">términos y condiciones</Link>
                        </Label>
                    </div>
                    {errors.terms && (
                        <p className="text-sm text-destructive">{errors.terms.message}</p>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...
                            </>
                        ) : (
                            submitText
                        )}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                        {redirectText}{' '}
                        <Link href={redirectLink} className="text-primary hover:underline">
                            {redirectLinkText}
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}

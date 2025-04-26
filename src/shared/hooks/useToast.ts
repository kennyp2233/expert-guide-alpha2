// Este archivo inicialmente contiene un wrapper para usar toast en toda la aplicación
// Debes instalar los componentes toast de shadcn/ui primero:
// npx shadcn-ui@latest add toast

import { toast as sonnerToast } from 'sonner';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
    duration?: number;
    position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const useToast = () => {
    const toast = (
        message: string,
        type: ToastType = 'info',
        options?: ToastOptions
    ) => {
        const { duration = 5000, ...restOptions } = options || {};

        switch (type) {
            case 'success':
                sonnerToast.success(message, {
                    duration,
                    ...restOptions
                });
                break;
            case 'error':
                sonnerToast.error(message, {
                    duration,
                    ...restOptions
                });
                break;
            case 'warning':
                sonnerToast(message, {
                    duration,
                    ...restOptions
                });
                break;
            case 'info':
            default:
                sonnerToast(message, {
                    duration,
                    ...restOptions
                });
        }
    };

    return {
        toast,
        success: (message: string, options?: ToastOptions) => toast(message, 'success', options),
        error: (message: string, options?: ToastOptions) => toast(message, 'error', options),
        warning: (message: string, options?: ToastOptions) => toast(message, 'warning', options),
        info: (message: string, options?: ToastOptions) => toast(message, 'info', options),
    };
};
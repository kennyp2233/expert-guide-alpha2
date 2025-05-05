// src/shared/hooks/useToast.ts

import { toast as sonnerToast } from 'sonner';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
    duration?: number;
    position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
    action?: {
        label: string;
        onClick: () => void;
    };
    description?: string;
    closeButton?: boolean;
}

export const useToast = () => {
    const toast = (
        message: string,
        type: ToastType = 'info',
        options?: ToastOptions
    ) => {
        const { duration = 5000, description, ...restOptions } = options || {};

        switch (type) {
            case 'success':
                sonnerToast.success(message, {
                    duration,
                    description,
                    ...restOptions
                });
                break;
            case 'error':
                sonnerToast.error(message, {
                    duration,
                    description,
                    ...restOptions
                });
                break;
            case 'warning':
                sonnerToast(message, {
                    duration,
                    description,
                    ...restOptions
                });
                break;
            case 'info':
            default:
                sonnerToast(message, {
                    duration,
                    description,
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
// src/shared/utils/formatters.ts

/**
 * Formatea una fecha ISO a formato legible
 * @param dateString - Fecha en formato ISO string
 * @param includeTime - Si se debe incluir la hora
 * @returns Fecha formateada
 */
export const formatDate = (dateString?: string, includeTime: boolean = false): string => {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);

        // Verificar si es una fecha válida
        if (isNaN(date.getTime())) {
            return 'Fecha inválida';
        }

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }

        return date.toLocaleDateString('es-ES', options);
    } catch (error) {
        console.error('Error formateando fecha:', error);
        return 'Error de formato';
    }
};

/**
 * Formatea un número como porcentaje
 * @param value - Número a formatear
 * @param decimals - Cantidad de decimales
 * @returns Porcentaje formateado
 */
export const formatPercentage = (value: number, decimals: number = 0): string => {
    return `${value.toFixed(decimals)}%`;
};

/**
 * Formatea bytes a una unidad legible (KB, MB, etc)
 * @param bytes - Bytes a formatear
 * @param decimals - Cantidad de decimales
 * @returns Tamaño formateado
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};
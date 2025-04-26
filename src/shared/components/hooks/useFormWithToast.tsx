// src/shared/hooks/useFormWithToast.tsx
import { useForm, UseFormProps, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/shared/hooks/useToast";

/**
 * useFormWithToast
 * Custom hook que combina useForm con toast para manejar errores
 */
export function useFormWithToast<
    TFieldValues extends FieldValues,
    Schema extends z.ZodType<any, any>
>(
    schema: Schema,
    options?: Omit<UseFormProps<TFieldValues>, "resolver">
) {
    const form = useForm<TFieldValues>({
        ...options,
        resolver: zodResolver(schema),
    });
    const { toast } = useToast();

    const handleSubmit = async (
        onValid: (data: TFieldValues) => Promise<boolean | void> | boolean | void,
        onInvalid?: (errors: any) => void
    ) => {
        return form.handleSubmit(
            async (data) => {
                try {
                    await onValid(data);
                } catch (error) {
                    toast(
                        error instanceof Error ? error.message : "Ha ocurrido un error",
                        "error"
                    );
                }
            },
            (errors) => {
                onInvalid?.(errors);
                if (Object.keys(errors).length > 0) {
                    toast("Por favor, corrija los errores en el formulario", "error");
                }
            }
        );
    };

    return {
        ...form,
        handleSubmit,
    };
}
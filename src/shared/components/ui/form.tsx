// src/shared/components/ui/form.tsx
import * as React from 'react';
import { useFormikContext, Field, ErrorMessage } from 'formik';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface FormFieldProps {
  name: string;
  label?: string | React.ReactNode;
  placeholder?: string;
  description?: string;
  required?: boolean;
  className?: string;
  type?: 'text' | 'email' | 'password' | 'checkbox';
  children?: React.ReactNode;
}

export function FormField({
  name,
  label,
  placeholder,
  description,
  required = false,
  className,
  type = 'text',
  children,
}: FormFieldProps) {
  const { values } = useFormikContext<any>();
  const [showPassword, setShowPassword] = React.useState(false);
  const togglePassword = () => setShowPassword(v => !v);

  // Custom children if provided
  if (children) {
    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <Label htmlFor={name} className="flex">
            {label}{required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        {React.cloneElement(children as React.ReactElement<{ name?: string, id?: string }>, { name, id: name })}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        <ErrorMessage name={name} component="p" className="text-sm text-destructive" />
      </div>
    );
  }

  if (type === 'checkbox') {
    return (
      <div className={cn('flex items-start space-x-2', className)}>
        <Field type="checkbox" id={name} name={name} />
        <div className="grid gap-1.5 leading-none">
          {label && (
            <Label htmlFor={name} className="font-normal">
              {label}{required && <span className="text-destructive ml-1">*</span>}
            </Label>
          )}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
          <ErrorMessage name={name} component="p" className="text-sm text-destructive" />
        </div>
      </div>
    );
  }

  if (type === 'password') {
    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <Label htmlFor={name} className="flex">
            {label}{required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <div className="relative">
          <Field
            as={Input}
            id={name}
            name={name}
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            className={cn('pr-10', values[name] ? '' : '', 'border', values[name] ? '' : '')}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={togglePassword}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        <ErrorMessage name={name} component="p" className="text-sm text-destructive" />
      </div>
    );
  }

  // Default text/email
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name} className="flex">
          {label}{required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Field
        as={Input}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={cn(values[name] ? '' : '')}
      />
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <ErrorMessage name={name} component="p" className="text-sm text-destructive" />
    </div>
  );
}

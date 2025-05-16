// src/app/dashboard/admin/fincas/page.tsx
import { Metadata } from 'next';
import { FarmVerificationPage } from '@/modules/master-data/fincas/pages/FarmVerificationPage';

export const metadata: Metadata = {
    title: 'Verificación de Fincas',
    description: 'Administración y verificación de fincas',
};

export default function AdminFarmsPage() {
    return <FarmVerificationPage />;
}
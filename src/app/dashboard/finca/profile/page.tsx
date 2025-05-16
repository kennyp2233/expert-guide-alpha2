// src/app/dashboard/finca/profile/page.tsx
import { Metadata } from 'next';
import { FarmProfilePage } from '@/modules/master-data/fincas/pages/FarmProfilePage';

export const metadata: Metadata = {
    title: 'Perfil de Finca',
    description: 'Gestión de datos y documentos de su finca',
};

export default function ProfilePage() {
    return <FarmProfilePage />;
}
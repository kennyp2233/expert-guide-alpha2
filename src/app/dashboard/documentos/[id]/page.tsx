// src/app/dashboard/documentos/[id]/page.tsx

'use client';

import { DocumentDetails } from '@/modules/documents/components/DocumentDetails';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/modules/auth/stores/useAuthStore';

interface DocumentDetailsPageProps {
    params: {
        id: string;
    };
}

export default function DocumentDetailsPage({ params }: DocumentDetailsPageProps) {
    const router = useRouter();
    const { user } = useAuthStore();
    const isAdmin = user?.roles.some(role => role.nombre === 'ADMIN');

    return (
        <div className="p-4 md:p-6">
            <DocumentDetails
                documentId={params.id}
                isAdmin={isAdmin}
                onBack={() => router.push('/dashboard/documentos')}
            />
        </div>
    );
}
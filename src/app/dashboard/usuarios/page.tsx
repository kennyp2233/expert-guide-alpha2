import { UsersPage } from "@/modules/users/pages/UsersPage";
import { Metadata } from "next";



export const metadata: Metadata = {
    title: "Usuarios",
    description: "Administración de usuarios",
};

export default function UsersPageWrapper() {

    return (
        <UsersPage />
    );
}
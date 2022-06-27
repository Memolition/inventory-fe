import React from "react";
import BreadCrumbs from "../components/breadcrumbs";
import classNames from "classnames";
import { Navigate, Route, Routes } from "react-router-dom";
import SecondarySidebar from "../components/secondary-sidebar";
import ProductsPage from "./Settings/ProductsPage";
import ProvidersPage from "./Settings/ProvidersPage";
import UsersPage from "./Settings/UsersPage";
import InventoryPage from "./Settings/InventoryPage";

const SettingsPage = () => {
    return (
        <>
            <SecondarySidebar
                links={
                    [
                        {
                            name: 'Proveedores',
                            route: '/settings/providers'
                        },
                        {
                            name: 'Productos',
                            route: '/settings/products'
                        },
                        {
                            name: 'Usuarios',
                            route: '/settings/users'
                        },
                        {
                            name: 'Importar Inventario',
                            route: '/settings/inventory'
                        },
                    ]
                }
            />
            <main className={ classNames('content') }>
                <article>
                    <Routes>
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="providers" element={<ProvidersPage />} />
                        <Route path="users" element={<UsersPage />} />
                        <Route path="inventory" element={<InventoryPage />} />
                        <Route index element={<Navigate to="products" />} />
                    </Routes>
                </article>
            </main>
        </>
    );
};

export default SettingsPage;
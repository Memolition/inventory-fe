import React from "react";
import BreadCrumbs from "../components/breadcrumbs";
import classNames from "classnames";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import SecondarySidebar from "../components/secondary-sidebar";
import OrdersPage from "./Reports/OrdersPage";
import ExpensesPage from "./Reports/ExpensesPage";

const ReportsPage = () => {
    return (
        <>
            <SecondarySidebar
                links={
                    [
                        {
                            name: 'Movimientos',
                            route: '/reports/orders'
                        },
                        {
                            name: 'Gastos',
                            route: '/reports/expenses'
                        },
                    ]
                }
            />
            <main className={ classNames('content') }>
                <article>
                    <Routes>
                        <Route index element={<span>Default view</span>} />
                        <Route path="orders" element={<OrdersPage />} />
                        <Route path="expenses" element={<ExpensesPage />} />
                    </Routes>
                </article>
            </main>
        </>
    );
};

export default ReportsPage;
import React from "react";
import classNames from "classnames";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import SecondarySidebar from "../components/secondary-sidebar";
import OrdersPage from "./OrdersPage";
import ExpensesPage from "./ExpensesPage";

const HomePage = () => {
    return (
        <>
            <SecondarySidebar
                links={
                    [
                        {
                            name: 'Nueva     Venta',
                            route: '/orders'
                        },
                        {
                            name: 'Regitrar Gasto',
                            route: '/expenses'
                        },
                    ]
                }
            />
            <main className={ classNames('content') }>
                <article>
                    <Routes>
                        <Route path="orders" element={<OrdersPage />} />
                        <Route path="expenses" element={<ExpensesPage />} />
                    </Routes>
                </article>
            </main>
        </>
    );
};

export default HomePage;
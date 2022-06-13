import React from "react";
import classNames from "classnames";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import SecondarySidebar from "../components/secondary-sidebar";
import OrdersPage from "./OrdersPage";
import ExpensesPage from "./ExpensesPage";

const MainLayout = (props:any) => {
    return (
        <main className={ classNames('content') }>
            <article className="container">
                {props.children}
            </article>
        </main>
    );
};

export default MainLayout;
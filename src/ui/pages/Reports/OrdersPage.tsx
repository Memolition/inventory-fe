import axios from "axios";
import React, { useEffect, useState } from "react";
import { inputDate } from "../../../hooks/date.fns";
import classNames from "classnames";

import { API_ROOT } from '../../../renderer';
import ReportOrderItem from "../../components/ReportOrderItem";
import ReportPurchaseItem from "../../components/ReportPurchaseItem";

const OrdersPage = () => {
    const [productsMinimum, setProductsMinimum] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [orders, setOrders] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [startDate, setStartDate] = useState(inputDate(new Date()))
    const [endDate, setEndDate] = useState(inputDate(new Date()))

    useEffect(() => {
        axios.get(`${API_ROOT}/products/minimum`)
        .then((data:any) => {
            setProductsMinimum(data.data);
        });

        axios.get(`${API_ROOT}/purchases?start=${startDate}&end=${endDate}`)
        .then((data:any) => {
            setPurchases(data.data);
        });

        axios.get(`${API_ROOT}/orders?start=${startDate}&end=${endDate}`)
        .then((data:any) => {
            setOrders(data.data);
        });

        axios.get(`${API_ROOT}/expenses?start=${startDate}&end=${endDate}`)
        .then((data:any) => {
            setExpenses(data.data);
        });
    }, [startDate, endDate]);

    return (
        <div className={classNames('reports')}>
            <h1>Reportes</h1>

            <div className={classNames('reports-filters')}>
                <label>
                    <span>Fecha de Inicio: </span>
                    <input
                        type="date"
                        placeholder="Inicio"
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                        }}
                    />
                </label>
                <label>
                    <span>Fecha de Fin: </span>
                    <input
                        type="date"
                        placeholder="Fin"
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value);
                        }}
                    />
                </label>
                <button onClick={() => {
                    setStartDate(inputDate(new Date()));
                    setEndDate(inputDate(new Date()));
                }}>Hoy</button>
            </div>
            <div className={classNames('reports-expenses')}>
                <ul style={{
                    listStyle: 'none',
                }}>
                    <li className={classNames('report-title')}>
                        Productos bajos en Inventario
                    </li>
                    <li>
                        <span>Producto</span>
                        <span>Minimo</span>
                        <span>Inventario</span>
                    </li>
                    {
                        !!productsMinimum.length ? (productsMinimum.map((product:any, productIndex:number) => (
                            <li key={`expense_item_${productIndex}`}>
                                <span>{product.name}</span>
                                <span>{product.minimumQuantity}</span>
                                <span>{product.stock}</span>
                            </li>
                        ))) : (
                            <li>No hay productos bajos en inventario.</li>
                        )
                    }
                </ul>

            </div>
            <div className={classNames('reports-expenses')}>
                <ul style={{
                    listStyle: 'none',
                }}>
                    <li className={classNames('report-title')}>
                        Gastos
                    </li>
                    {
                        !!expenses.length ? (expenses.map((expense:any, expenseIndex:number) => (
                            <li key={`expense_item_${expenseIndex}`}>
                                <span>{expense.note}</span>
                                <span>Q. {parseFloat(expense?.amount ?? 0).toFixed(2)}</span>
                            </li>
                        ))) : (
                            <li>No hay gastos registrados para este periodo.</li>
                        )
                    }
                </ul>

            </div>
            <div className={classNames('reports-orders')}>
                <ul style={{
                    listStyle: 'none',
                }}>
                    <li className={classNames('report-title')}>
                        Ventas
                    </li>
                    {
                        !!orders.length ? (orders.map((order:any, orderIndex:number) => (
                            <ReportOrderItem  key={`order_item_${orderIndex}`} order={order} />
                        ))) : (
                            <li>No hay ventas registradas para este periodo.</li>
                        )
                    }
                </ul>
            </div>
            {
                /*
                */
            }
            <div className={classNames('reports-orders')}>
                <ul style={{
                    listStyle: 'none',
                }}>
                    <li className={classNames('report-title')}>
                        Pedidos
                    </li>
                    {
                        !!purchases.length ? (purchases.map((purchase:any, purchaseIndex:number) => (
                            <ReportPurchaseItem key={`purchase_item_${purchaseIndex}`}  purchase={purchase} />
                        ))) : (
                            <li>No hay pedidos registrados para este periodo.</li>
                        )
                    }
                </ul>
            </div>
        </div>
    );
};

export default OrdersPage;
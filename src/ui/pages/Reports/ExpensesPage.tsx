import axios from "axios";
import React, { useEffect, useState } from "react";

import { API_ROOT } from '../../../renderer';

const ExpensesPage = () => {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        axios.get(`${API_ROOT}/expenses`)
        .then((data:any) => {
            setExpenses(data.data);
        });
    }, []);

    return (
        <div>
            <ul>
                {
                    expenses.map((expense:any, expenseIndex:number) => (
                        <li key={`expense_item_${expenseIndex}`}>
                            <div>
                                <span>{expense.note}</span>
                                <span>{expense.amount}</span>
                            </div>
                        </li>
                    ))
                }
            </ul>

        </div>
    );
};

export default ExpensesPage;
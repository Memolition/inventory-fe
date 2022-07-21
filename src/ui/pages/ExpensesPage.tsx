import axios from 'axios';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { API_ROOT } from '../../renderer';
import { useNavigate } from 'react-router-dom';

const blankExpense = {
    note: '',
    amount: 0,
};

const ExpensesPage = () => {
    const navigate = useNavigate();
    const [newExpense, setNewExpense] = useState(blankExpense);

    const changeExpense = (attr:string, val:string) => {
        setNewExpense((prevNewExpense:any) => ({
            ...prevNewExpense,
            [attr]: val,
        }));
    };

    const persistExpense = () => {
        axios.post(`${API_ROOT}/expenses`, newExpense)
        .then((r:any) => {
            setNewExpense(blankExpense);
            navigate("/orders");
        });
    };

    return (
        <div>
            <h1>Registrar un nuevo gasto</h1>

            <form
                className="new-expense-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    persistExpense();
                }}
            >
                <input type="text" placeholder="Nota" onChange={(e) => { changeExpense('note', e.target.value) }} value={newExpense.note} />
                <input type="text" placeholder="Monto" onChange={(e) => { changeExpense('amount', e.target.value) }} value={newExpense.amount} />
                <input className="btn" type="submit" value="Guardar" />
            </form>
        </div>
    );
};

export default ExpensesPage;
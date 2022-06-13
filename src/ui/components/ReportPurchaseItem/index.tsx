import React, { useState } from "react";
import classNames from "classnames";
import { readableDate } from "../../../hooks/date.fns";

interface IProps {
    purchase: any;
}

const ReportPurchaseItem = ({purchase}:IProps) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <li style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '15px',
            cursor: 'pointer',
        }}>
            <div
                className={classNames('header')}
                onClick={() => {
                    setExpanded((prevExpanded:boolean) => !prevExpanded);
                }}
            >
                <span>
                    {purchase.id}
                </span>
                <span>
                    {purchase?.Provider?.name}
                </span>
                <span>
                    {purchase.createdAt}
                </span>
            </div>
            <div className={classNames({'content': true, 'shown': expanded})}>
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            purchase?.Movements?.map((movement:any, movementIndex:number) => (
                                <tr key={`order_product_${movementIndex}`}>
                                    <td>{movement.Product.name}</td>
                                    <td>{movement.quantity}</td>
                                    <td>{movement.price}</td>
                                    <td>{movement.quantity * movement.price}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </li>
    );
};

export default ReportPurchaseItem;
import React, { useState } from "react";
import classNames from "classnames";
import { readableDate } from "../../../hooks/date.fns";

interface IProps {
    order: any;
}

const ReportOrderItem = ({order}:IProps) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <li>
            <div
                className={classNames('header')}
                onClick={() => {
                    setExpanded((prevExpanded:boolean) => !prevExpanded);
                }}
            >
                <span>{order.id}</span>
                <span>{order.invoice}</span>
                <span>{order.Person.tax_id}</span>
                <span>{order.Person.name}</span>
                <span>{readableDate(order.createdAt)}</span>
                <span>Q. {
                            order?.Movements?.reduce((prevVal:any, currentProduct:any) => prevVal + (parseFloat(currentProduct.Product.sellingPrice) * currentProduct.quantity), 0.00).toFixed(2)
                        }
                </span>
            </div>
            <div className={classNames({'content': true, 'shown': expanded})}>
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            order?.Movements?.map((movement:any, movementIndex:number) => (
                                <tr key={`order_product_${movementIndex}`}>
                                    <td>{movement.Product.name}</td>
                                    <td>{movement.quantity}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </li>
    );
};

export default ReportOrderItem
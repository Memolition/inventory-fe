import axios from "axios";
import React, { useEffect, useState } from "react";

import { API_ROOT } from '../../../renderer';

const InventoryItemDetails = ({id}:{id:string}) => {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(`${API_ROOT}/products/${id}`)
        .then((data:any) => {
            setProduct(data.data);
            console.log('data', data);
        });
    }, []);

    return !product?.Movements?.length ? (
        <span>Este producto no tiene movimientos.</span>
    ) : (
        <table>
            <thead>
                <tr>
                    <th>
                        Documento
                    </th>
                    <th>
                        Entradas
                    </th>
                    <th>
                        Salidas
                    </th>
                    <th>
                        Existencias
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    product?.Movements?.map((movement:any, movementIndex:number) => movement.load ? (
                        <tr key={`product_movement_${movementIndex}`}>
                            <td>Pedido No. { movement.PurchaseId } - { movement.Purchase.createdAt }</td>
                            <td>{ movement.quantity }</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    ) : (
                        <tr key={`product_movement_${movementIndex}`}>
                            <td>Orden No. { movement.OrderId } - { movement.Order.Person.name } - { movement.Order.createdAt }</td>
                            <td>-</td>
                            <td>{ movement.quantity }</td>
                            <td>-</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
};

export default InventoryItemDetails;
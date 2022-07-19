import React, { useState } from "react";
import classNames from "classnames";
import InventoryItemDetails from "../InventoryItemDetails";
import InventoryItemForm from "../InventoryItemForm";

interface IProps {
    product: any;
}

const InventoryItem = ({product}:IProps) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <li>
            <div
                className={classNames({'header': true, 'shown': expanded})}
                onClick={() => {
                    setExpanded((prevExpanded:boolean) => !prevExpanded);
                }}
            >
                <span>{ product.name }</span>
                <span>{ product.stock }</span>
                <span>{ product.buyingPrice }</span>
                <span>{ product.sellingPrice }</span>
            </div>

            <div className={classNames({'inventory-item-content': true, 'content': true, 'shown': expanded})}>
                { expanded && <InventoryItemForm product={product} /> }
                { expanded && <InventoryItemDetails id={product.id} /> }
            </div>
        </li>
    );
};

export default InventoryItem;
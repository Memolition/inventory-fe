import React, { useState } from "react";
import classNames from "classnames";
import InventoryItemDetails from "../InventoryItemDetails";

interface IProps {
    product: any;
}

const InventoryItem = ({product}:IProps) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <li>
            <div
                className={classNames('header')}
                onClick={() => {
                    setExpanded((prevExpanded:boolean) => !prevExpanded);
                }}
            >
                <span>{ product.name }</span>
                <span>{ product.stock }</span>
                <span>{ product.buyingPrice }</span>
                <span>{ product.sellingPrice }</span>
            </div>
            <div className={classNames({'content': true, 'shown': expanded})}>
                {
                    expanded && <InventoryItemDetails id={product.id} />
                }
            </div>
        </li>
    );
};

export default InventoryItem;
import classNames from "classnames";
import React from "react";

interface IProps {
    Title: string;
    Items: any[];
    SetItems?: Function;
}

const SelectableList = ({Title, Items, SetItems}:IProps) => {
    const changeItems = (callback:Function) => {
        if(!!SetItems) {
            SetItems(callback);
        }
    }

    return (
        <ul className={classNames("selectable-list")}>
            <li className={classNames('title')}>
                {Title}
            </li>
            { Items?.map((item:any, itemIndex:number) => (
                <li
                key={`provider_brand_item_${itemIndex}`}
                className={classNames({"active": item.active && !!SetItems})}
                onClick={() => {
                    changeItems((prevItems:any) => prevItems.map((prevItem:any) => {
                        if(prevItem?.id === item?.id) {
                            return {
                                ...prevItem,
                                active: !prevItem?.active
                            };
                        }

                        return prevItem;
                    }));
                }}
            >
                    {item.name}
                </li>
            ))}
        </ul>
    );
};

export default SelectableList;
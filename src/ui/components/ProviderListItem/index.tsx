import classNames from "classnames";
import React, { useState } from "react";

interface IProps {
    provider: any;
    children?: any;
};

const ProviderListItem = ({provider, children}:IProps) => {
    const [shown, setShown] = useState(false);

    return (
        <li>
            <div
                className={classNames("provider-header")}
                onClick={() => {
                    setShown(prevShown => !prevShown);  
                }}
            >
                <span>{ provider.name }</span>
                <span>{ provider.address }</span>
                <span>{ provider.phone }</span>
                <span>{ provider.account }</span>
            </div>
            <div className={classNames({"provider-content": true, "active": shown})}>
                {
                    children
                }
            </div>
        </li>
    );
};

export default ProviderListItem;
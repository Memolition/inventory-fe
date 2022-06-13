import React from "react";
import classNames from "classnames";
import { useLocation } from "react-router-dom";

const BreadCrumbs = () => {
    const route = useLocation();

    console.log('route', route);

    return (
        <div className={classNames(['bradcrumbs', 'app-drag'])}>
            <ul>
               <li>Dashboard</li>
               <li className="is-active">Home</li>
            </ul>
        </div>
    );
};

export default BreadCrumbs;
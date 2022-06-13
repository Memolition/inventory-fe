import React from "react";
import classNames from "classnames";
import { Link, NavLink } from "react-router-dom";

type linkProps = {
    name: string,
    route: string,
};

interface IProps {
    links: linkProps[]
};

const SecondarySidebar = ({links} : IProps) => {
    return (
        <aside className={ classNames("secondary-sidebar") }>
            <div className={classNames(['secondary-sidebar-drag-padding', 'app-drag'])}></div>
            <ul>
                {
                    links.map((link:linkProps, linkIndex:number) => (
                        <li key={`secondary_sidebar_item_${linkIndex}`}>
                            <NavLink to={link.route}>{link.name}</NavLink>
                        </li>
                    ))
                }
            </ul>
        </aside>
    );
};

export default SecondarySidebar;
import React from 'react';
import classNames from 'classnames';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faBagShopping, faCoins, faFileAlt, faFileCirclePlus, faGear, faHouse } from '@fortawesome/free-solid-svg-icons';
import useAuth from "../../../hooks/useAuth";
import { AuthContext } from "../../app";

const MainSidebar = () => {
    const navigate = useNavigate();
    const auth:any = useAuth(AuthContext);

    return (
        <aside className={ classNames('main-sidebar') }>
            <div  className={ classNames(['grabbable','logo-container', 'app-drag']) }>
            </div>
            <ul>
                <li>
                    <Link to="/">
                        <FontAwesomeIcon icon={faHouse} />
                    </Link>
                </li>
                <li>
                    <Link to="/new-order">
                        <FontAwesomeIcon icon={faFileCirclePlus} />
                    </Link>
                </li>
                <li>
                    <Link to="/new-expense">
                        <FontAwesomeIcon icon={faCoins} />
                    </Link>
                </li>
                <li>
                    <Link to="/new-purchase">
                        <FontAwesomeIcon icon={faBagShopping} />
                    </Link>
                </li>
                <li>
                    <Link to="/reports">
                        <FontAwesomeIcon icon={faFileAlt} />
                    </Link>
                </li>
                <li>
                    <Link to="/settings">
                        <FontAwesomeIcon icon={faGear} />
                    </Link>
                </li>
                <li>
                    <a href="#" onClick={() => { auth.signout(() => navigate("/login")); }}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} />
                    </a>
                </li>
            </ul>
        </aside>
    );
};

export default MainSidebar;
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { API_ROOT } from '../../../renderer';
import SelectableList from '../../components/SelectableList';

type TUser = {
    name: string;
    password: string;
    role?: any;
};

const blankUser:TUser = {
    name: '',
    password: '',
    role: null,
};

const blankRole = {
    name: '',
};

const blankPermission = {
    name: '',
};

const UsersPage = () => {
    const [newUser, setNewUser] = useState(blankUser);
    const [newRole, setNewRole] = useState(blankRole);
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        axios.get(`${API_ROOT}/users`)
        .then((data:any) => {
            setUsers(data.data);
        });

        axios.get(`${API_ROOT}/roles`)
        .then((data:any) => {
            setRoles(data.data);
        });

        axios.get(`${API_ROOT}/permissions`)
        .then((data:any) => {
            setPermissions(data.data);
        });
    }, []);

    const changeNewUser = (attr:string, val:any) => {
        setNewUser(prevNewUser => ({
            ...prevNewUser,
            [attr]: val
        }));
    };

    const changeNewRole = (attr:string, val:any) => {
        setNewRole(prevNewRole => ({
            ...prevNewRole,
            [attr]: val
        }));
    };

    const persistUser = () => {
        if(!newUser.name.length) {
            return;
        }

        axios.post(`${API_ROOT}/users`, newUser)
        .then((r:any) => {
            if(r?.data) {
                setUsers(prevUsers => [r.data, ...prevUsers]);
            }
        });
    };

    const persistRole = () => {
        if(!newRole.name.length) {
            return;
        }

        axios.post(
            `${API_ROOT}/roles`,
            {
                name: newRole.name,
                permissions: permissions.filter(permission => !!permission.active).map(permission => permission.id)
            }
        )
        .then((r:any) => {
            if(r?.data) {
                setRoles(prevRoles => [r.data, ...prevRoles]);
                setNewRole(blankRole);
            }
        });
    };

    return (
        <div className={ classNames(['products-view']) }>
            <div className={classNames('providers-forms-row')}>
                <div>
                    <fieldset>
                        <legend>Nuevo Rol</legend>
                        <form onSubmit={ (e) => {
                            e.preventDefault();
                            persistRole();
                        }}>
                            <label>
                                <span>Nombre: </span>
                                <input type="text" placeholder="Rol" value={newRole.name} onChange={(e) => { changeNewRole('name', e.target.value); }} />
                            </label>
                            <div className={classNames('new-provider-lists')}>
                                <SelectableList Title="Permisos" Items={permissions} SetItems={setPermissions} />
                            </div>
                            <input type="submit" value="Guardar" />
                        </form>
                    </fieldset>
                </div>
                <div style={{flex: 1, display: 'flex'}}>
                    <fieldset style={{display: 'flex', 'flex': 1, flexDirection: 'column'}}>
                        <legend>Nuevo Usuario</legend>
                        <div className={ classNames(['new-product-form']) }>
                            <form onSubmit={ (e) => {
                                e.preventDefault();
                                persistUser();
                            }}>
                                <label>
                                    <span>Nombre: </span>
                                    <input type="text" placeholder="Nombre de Usuario" value={newUser.name} onChange={(e) => { changeNewUser('name', e.target.value); }} />
                                </label>
                                <label>
                                    <span>Contraseña: </span>
                                    <input type="password" placeholder="Contraseña" value={newUser.password} onChange={(e) => { changeNewUser('password', e.target.value); }} min="0" />
                                </label>
                                <label>
                                    <span>Rol: </span>
                                    <select
                                        value={newUser.role}
                                        onChange={(e) => { changeNewUser('role', e.target.value) } }
                                    >
                                        <option>Seleccionar Rol</option>
                                        {
                                            roles.map((role:any, roleIndex:number) => (
                                                <option key={`role_option_${roleIndex}`} value={role.id}>{role.name}</option>
                                            ))
                                        }
                                    </select>
                                </label>
                                
                                <input className={classNames('btn')} type="submit" value="Guardar" />
                            </form>
                        </div>
                    </fieldset>
                </div>
            </div>

            <ul className={classNames("list")}>
                {
                    users.map((user:any, userIndex:number) => (
                        <li
                            key={`user_item_${userIndex}`}
                            onClick={() => {
                                axios.post(`${API_ROOT}/users/login`, {name: user.name, password: "12345"})
                                .then((r:any) => {
                                    console.log(r);
                                    localStorage.setItem(
                                        'user',
                                        JSON.stringify(
                                            {
                                                user: r.data,
                                                loggedIn: new Date().getTime(),
                                            }
                                        )
                                    );
                                });
                            }}
                        >
                            <span>{user.name}</span>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
};

export default UsersPage;
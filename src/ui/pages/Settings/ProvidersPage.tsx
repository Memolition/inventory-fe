import axios from 'axios';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { API_ROOT } from '../../../renderer';
import SelectableList from '../../components/SelectableList';
import ProviderListItem from '../../components/ProviderListItem';
import ProviderItem from '../../components/ProviderItem';

const blankProvider = {
    name: '',
    address: '',
    phone: '',
    account: '',
};

const blankProviderLine = {
    name: '',
};

const blankProviderBrand = {
    name: '',
};

const ProvidersPage = () => {
    const [newProvider, setNewProvider] = useState(blankProvider);
    const [newProviderLine, setNewProviderLine] = useState(blankProviderLine);
    const [newProviderBrand, setNewProviderBrand] = useState(blankProviderBrand);
    const [providers, setProviders] = useState([]);
    const [providerLines, setProviderLines] = useState([]);
    const [providerBrands, setProviderBrands] = useState([]);

    useEffect(() => {
        axios.get(`${API_ROOT}/providers`)
        .then((data:any) => {
            setProviders(data.data);
        });

        axios.get(`${API_ROOT}/providerLines`)
        .then((data:any) => {
            setProviderLines(data.data);
        });

        axios.get(`${API_ROOT}/providerBrands`)
        .then((data:any) => {
            setProviderBrands(data.data);
        });
    }, []);

    const changeNewProvider = (attr:string, val:any) => {
        setNewProvider(prevNewProvider => ({
            ...prevNewProvider,
            [attr]: val
        }));
    };

    const changeNewProviderLine = (attr:string, val:any) => {
        setNewProviderLine(prevNewProviderLine => ({
            ...prevNewProviderLine,
            [attr]: val
        }));
    };

    const changeNewProviderBrand = (attr:string, val:any) => {
        setNewProviderBrand(prevNewProviderBrand => ({
            ...prevNewProviderBrand,
            [attr]: val
        }));
    };

    const persistProvider = () => {
        if(!newProvider.name.length) {
            return;
        }

        axios.post(
            `${API_ROOT}/providers`,
            {
                ...newProvider,
                brands: providerBrands.filter(providerBrand => providerBrand.active),
                lines: providerLines.filter(providerLine => providerLine.active),
            }
        )
        .then((r:any) => {
            if(r?.data) {
                setProviders(prevProviders => [r.data, ...prevProviders]);
            }
        });
    };

    const persistProviderLine = () => {
        if(!newProviderLine.name.length) {
            return;
        }

        axios.post(`${API_ROOT}/providerLines`, newProviderLine)
        .then((r:any) => {
            if(r?.data) {
                setProviderLines(prevProviderLines => [r.data, ...prevProviderLines]);
                setNewProviderLine(blankProviderLine);
            }
        });
    };

    const persistProviderBrand = () => {
        if(!newProviderBrand.name.length) {
            return;
        }

        axios.post(`${API_ROOT}/providerBrands`, newProviderBrand)
        .then((r:any) => {
            if(r?.data) {
                setProviderBrands(prevProviderBrands => [r.data, ...prevProviderBrands]);
                setNewProviderBrand(blankProviderBrand);
            }
        });
    };

    return (
        <div className={ classNames(['products-view']) }>
            <div className={classNames('providers-forms-row')}>
                <div>
                    <fieldset>
                        <legend>Nueva Linea</legend>
                        <form onSubmit={ (e) => {
                            e.preventDefault();
                            persistProviderLine();
                        }}>
                            <label>
                                <span>Nombre: </span>
                                <input type="text" placeholder="Linea" value={newProviderLine.name} onChange={(e) => { changeNewProviderLine('name', e.target.value); }} />
                            </label>
                            <input type="submit" value="Guardar" />
                        </form>
                    </fieldset>
                </div>
                <div>
                    <fieldset>
                        <legend>Nueva Marca</legend>
                        <form onSubmit={ (e) => {
                            e.preventDefault();
                            persistProviderBrand();
                        }}>
                            <label>
                                <span>Nombre: </span>
                                <input type="text" placeholder="Marca" value={newProviderBrand.name} onChange={(e) => { changeNewProviderBrand('name', e.target.value); }} />
                            </label>
                            <input type="submit" value="Guardar" />
                        </form>
                    </fieldset>
                </div>
            </div>

            <div className={ classNames(['new-product-form']) }>
                <form onSubmit={ (e) => {
                    e.preventDefault();
                    persistProvider();
                }}>
                    <label>
                        <span>Nombre: </span>
                        <input type="text" placeholder="Proveedor" value={newProvider.name} onChange={(e) => { changeNewProvider('name', e.target.value); }} />
                    </label>
                    <label>
                        <span>Direccion: </span>
                        <input type="text" placeholder="Direccion" value={newProvider.address} onChange={(e) => { changeNewProvider('address', e.target.value); }} min="0" />
                    </label>
                    <label>
                        <span>Telefono: </span>
                        <input type="text" placeholder="Telefono" value={newProvider.phone} onChange={(e) => { changeNewProvider('phone', e.target.value); }} min="0" />
                    </label>
                    <label>
                        <span>No. de Cuenta: </span>
                        <input type="text" placeholder="Cuenta Bancaria" value={newProvider.account} onChange={(e) => { changeNewProvider('account', e.target.value); }} min="0" />
                    </label>

                    <div className={classNames('new-provider-lists')}>
                        <SelectableList Title="Lineas" Items={providerLines} SetItems={setProviderLines} />
                        <SelectableList Title="Marcas" Items={providerBrands} SetItems={setProviderBrands} />
                    </div>
                    <input className={classNames('btn')} type="submit" value="Guardar" />
                </form>
            </div>

            <ul className={classNames("providers-list")}>
                <li className='title'>Proveedores</li>
                <li className='title'>
                    <span>Nombre</span>
                    <span>Direccion</span>
                    <span>Telefono</span>
                    <span>No. de Cuenta</span>
                </li>
                {
                    providers.map((provider:any, providerIndex:number) => (
                        <ProviderItem key={`provider_item_${providerIndex}`}  provider={provider} lines={providerLines} brands={providerBrands} />
                    ))
                }
            </ul>
        </div>
    );
};

export default ProvidersPage;
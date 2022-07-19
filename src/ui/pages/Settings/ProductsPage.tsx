import axios from 'axios';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { API_ROOT } from '../../../renderer';
import InventoryItem from '../../components/InventoryItem';

const blankProduct = {
    name: '',
    stock: 0,
    buyingPrice: 0,
    sellingPrice: 0,
    barcode: '',
    partNumber: '',
    provider: '',
    minimumQuantity: 0,
    hasSellingPrice: true,
};

const ProductsPage = () => {
    const [newProduct, setNewProduct] = useState(blankProduct);
    const [products, setProducts] = useState([]);
    const [providers, setProviders] = useState([]);
    const [viewProducts, setViewProducts] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        axios.get(`${API_ROOT}/products`)
        .then((data:any) => {
            setProducts(data.data);
            setViewProducts(data.data);
        });

        axios.get(`${API_ROOT}/providers`)
        .then((data:any) => {
            setProviders(data.data);
        });
    }, []);

    useEffect(() => {
        setViewProducts(products.filter((p) => {
            const querySanitized = query.toLowerCase();

            const nameSearch = p?.name?.toLowerCase()?.indexOf(querySanitized) >= 0;
            const barcodeSearch = p?.barcode?.toLowerCase()?.indexOf(querySanitized) >= 0;
            const partNumberSearch = p?.partNumber?.toLowerCase()?.indexOf(querySanitized) >= 0;

            return nameSearch || barcodeSearch || partNumberSearch;
        }));
    }, [query]);

    const changeNewProduct = (attr:string, val:any) => {
        setNewProduct(prevNewProduct => ({
            ...prevNewProduct,
            [attr]: val
        }));
    };

    const persistProduct = () => {
        axios.post(`${API_ROOT}/products`, newProduct)
        .then((r:any) => {
            if(r?.data) {
                setProducts(prevProducts => [r.data, ...prevProducts]);
                setNewProduct(blankProduct);
            }
        });
    };

    return (
        <div className={ classNames(['products-view']) }>
            <div className={ classNames(['new-product-form']) }>
                <form onSubmit={ (e) => {
                    e.preventDefault();
                    persistProduct();
                }}>
                    <label>
                        <span>Producto: </span>
                        <input type="text" placeholder="Producto" value={newProduct.name} onChange={(e) => { changeNewProduct('name', e.target.value); }} />
                    </label>
                    <label>
                        <span>Proveedor: </span>
                        {
                            /*
                            <input type="text" placeholder="Proveedor"  />
                            */
                        }
                        <select
                            value={newProduct.provider}
                            onChange={(e) => { changeNewProduct('provider', e.target.value); }}
                        >
                            <option value={null}>Proveedor</option>
                            {
                                providers.map(provider => (
                                    <option value={provider.id}>{provider.name}</option>
                                ))
                            }
                        </select>
                    </label>
                    <label>
                        <span>Precio de Venta: </span>
                        <input type="text" placeholder="Precio de Venta" value={newProduct.sellingPrice} onChange={(e) => { changeNewProduct('sellingPrice', e.target.value); }} />
                    </label>
                    <label>
                        <span>Cantidad Minima en Inventario: </span>
                        <input type="text" placeholder="Cantidad Minima" value={newProduct.minimumQuantity} onChange={(e) => { changeNewProduct('minimumQuantity', e.target.value); }} />
                    </label>
                    <label>
                        <span>Codigo de Barras: </span>
                        <input type="text" placeholder="Codigo de Barras" value={newProduct.barcode} onChange={(e) => { changeNewProduct('barcode', e.target.value); }} />
                    </label>
                    <label>
                        <span>No. de Parte: </span>
                        <input type="text" placeholder="No. de Parte" value={newProduct.partNumber} onChange={(e) => { changeNewProduct('partNumber', e.target.value); }} />
                    </label>
                    <input className={classNames("btn", "primary")} type="submit" value="Guardar" />
                </form>
            </div>

            <div className='inventory-product-query'>
                <input placeholder="Buscar Producto" onChange={(e) => { setQuery(e.target.value) }} />
            </div>

            <ul className='inventory-products-list'>
                <li className='title'>
                    <span>Nombre</span>
                    <span>Stock</span>
                    <span>Precio Costo</span>
                    <span>Precio Venta</span>
                </li>
                {
                    viewProducts.map((product:any, productIndex:number) => (
                        <InventoryItem product={product} key={`product_item_${productIndex}`} />
                    ))
                }
            </ul>
        </div>
    );
};

export default ProductsPage;
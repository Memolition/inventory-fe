import axios from 'axios';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { API_ROOT } from '../../renderer';

const blankProduct = {
    name: '',
    stock: 0,
    buyingPrice: 0,
    sellingPrice: 0,
    barcode: '',
    provider: '',
    minimumQuantity: 0,
    hasSellingPrice: true,
};

const ProductsPage = () => {
    const [newProduct, setNewProduct] = useState(blankProduct);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get(`${API_ROOT}/products`)
        .then((data:any) => {
            setProducts(data.data);
        });
    }, []);

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
                        <span>Stock: </span>
                        <input type="number" placeholder="Stock" value={newProduct.stock} onChange={(e) => { changeNewProduct('stock', e.target.value); }} min="0" />
                    </label>
                    <label>
                        <input type="checkbox" checked={newProduct.hasSellingPrice} onChange={(e) => { changeNewProduct('hasSellingPrice', !newProduct.hasSellingPrice); }} />
                        Precio de venta diferente al precio de costo
                    </label>
                    <label>
                        <span>Precio Costo: </span>
                        <input type="text" placeholder="Precio Costo" value={newProduct.buyingPrice} onChange={(e) => { changeNewProduct('buyingPrice', e.target.value); }} />
                    </label>
                    {
                        newProduct.hasSellingPrice && (
                            <label>
                                <span>Precio Venta: </span>
                                <input type="text" placeholder="Precio Venta" value={newProduct.sellingPrice} onChange={(e) => { changeNewProduct('sellingPrice', e.target.value); }} />
                            </label>
                        )
                    }
                    <label>
                        <span>Codigo de Barras: </span>
                        <input type="text" placeholder="Codigo de Barras" value={newProduct.barcode} onChange={(e) => { changeNewProduct('barcode', e.target.value); }} />
                    </label>
                    <label>
                        <span>Proveedor: </span>
                        <input type="text" placeholder="Proveedor" value={newProduct.provider} onChange={(e) => { changeNewProduct('provider', e.target.value); }} />
                    </label>
                    <label>
                        <span>Cantidad Minima en Inventario: </span>
                        <input type="text" placeholder="Cantidad Minima" value={newProduct.minimumQuantity} onChange={(e) => { changeNewProduct('minimumQuantity', e.target.value); }} />
                    </label>
                    <input type="submit" value="Guardar" />
                </form>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Stock</th>
                        <th>Precio Costo</th>
                        <th>Precio Venta</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.map((product:any, productIndex:number) => (
                            <tr>
                                <td>{ product.name }</td>
                                <td>{ product.stock }</td>
                                <td>{ product.buyingPrice }</td>
                                <td>{ product.sellingPrice }</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

export default ProductsPage;
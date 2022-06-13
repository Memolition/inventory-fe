import axios from "axios";
import React, { useEffect, useState } from "react";
import classNames from 'classnames';

import { API_ROOT } from '../../renderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SelectableList from "../components/SelectableList";
import { faMinusCircle, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

interface IOrder {
    products: any[];
    provider: any;
};

const blankPurchase:IOrder = {
    products: [],
    provider: 0,
};

const PurchasesPage = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('');
    const [newOrder, setNewOrder] = useState(blankPurchase);
    const [products, setProducts] = useState([]);
    const [providers, setProviders] = useState([]);
    const [viewProducts, setViewProducts] = useState([]);

    useEffect(() => {
        axios.get(`${API_ROOT}/products`)
        .then((data:any) => {
            setProducts(data.data);
        });

        axios.get(`${API_ROOT}/providers`)
        .then((data:any) => {
            setProviders(data.data);
        });
    }, []);

    const setActiveViewProduct = (down:boolean = true) => {
        setViewProducts(prevViewProducts => {
            const activeProduct = prevViewProducts.findIndex(prevViewProductFind => !!prevViewProductFind?.active);

            console.log(activeProduct);
            
            return prevViewProducts.map((prevViewProduct:any,prevViewProductIndex:number) => {
                const newIndex = down ? (activeProduct >= prevViewProducts.length - 1 ? 0 : activeProduct + 1) : (activeProduct <= 0 ? prevViewProducts.length -1 : activeProduct - 1);
                if(
                    (activeProduct < 0 && prevViewProductIndex === 0)
                    || (activeProduct >= 0 && newIndex === prevViewProductIndex)
                ) {
                    return {
                        ...prevViewProduct,
                        active: true,
                    }
                }

                return {
                    ...prevViewProduct,
                    active: false,
                };
            });
        });
    };

    const addProductToOrder = (product:any, quantity:number = 1, sellingPrice:number = 0) => {
        setNewOrder((prevNewOrder) => {
            return {
                ...prevNewOrder,
                products: [
                    ...prevNewOrder.products,
                    {
                        product,
                        quantity,
                        sellingPrice,
                    }
                ]
            };
        });

        setViewProducts([]);
        setFilter('');
    }

    useEffect(() => {
        setViewProducts(prevViewProducts => {
            if(!filter?.length) {
                return [];
            }

            return products.filter((realProduct) => {
                const productInOrder = newOrder.products.find(orderProduct => orderProduct.product.id === realProduct.id);

                if(!!productInOrder) {
                    return false;
                }

                if(!!filter?.length) {
                    return realProduct.barcode.indexOf(filter) >= 0 || realProduct.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
                }

                return true;
            });
        })
    }, [filter]);

    const persistPurchase = (purchase:any = newOrder) => {
        axios.post(`${API_ROOT}/purchases`, purchase)
        .then((r:any) => {
            setNewOrder(blankPurchase);
            setViewProducts([]);

            navigate('/settings/products');
        });
    };

    return (

        <div className="new-purchase">
            <h1>Ingresar un nuevo Pedido</h1>
            <label>
                <span>
                    Proveedor
                </span>
                <select
                    value={newOrder.provider}
                    onChange={(e) => {
                        setNewOrder((prevNewOrder:IOrder) => ({...prevNewOrder, provider: e.target.value}));
                    }}
                >
                    <option value={0}>Proveedor</option>
                    {
                        providers?.map((provider:any, providerIndex:number) => (
                            <option key={`provider_option_${providerIndex}`} value={provider.id}>{provider.name}</option>
                        ))
                    }
                </select>
            </label>

            <div className={classNames('order-product-list')}>
                <ul className={classNames('available-products')}>
                    <form onSubmit={() => {
                        const scannedProduct = products.find((realProduct) => realProduct.barcode === filter);
                        const addingProduct = !!scannedProduct ? scannedProduct : viewProducts.find((realProduct) => !!realProduct.active);

                        if(!!addingProduct) {
                            const productInOrder = newOrder.products.find((orderProduct) => orderProduct.product.id === filter);

                            if(!!productInOrder) {
                                setNewOrder((prevNewProduct:any) => {
                                    return {
                                        ...prevNewProduct,
                                        products: prevNewProduct.products.map((existingProduct:any) => ({...existingProduct, quantity: existingProduct.quantity + 1}))
                                    };
                                });
                            } else {
                                addProductToOrder(addingProduct);
                            }
                        } else {
                            return false;
                        }
                    }}>
                        <li>
                            <input type="text" placeholder="Buscar producto"
                                className={classNames('product-filter')}
                                value={filter}
                                onChange={ (e) => {
                                    setFilter(e.target.value);
                                }}
                                onKeyDown={(e) => {
                                    if(e.key === "ArrowDown") {
                                        setActiveViewProduct();
                                    } else if(e.key === "ArrowUp") {
                                        setActiveViewProduct(false);
                                    }
                                }}
                            />
                        </li>
                    </form>

                    {
                        viewProducts.filter((product) => !newOrder.products.find(((customerProducts) => customerProducts.id === product.id))).map((product, productIndex) => (
                            <li
                                key={`view_product_${productIndex}`}
                                className={classNames({'product-item': true, "active": product.active})}
                                onClick={() => {
                                    addProductToOrder(product);
                                }}
                            >
                                <span
                                    style={{
                                        display: 'flex',
                                        flex: 1
                                    }}
                                >
                                    {product.name}
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        flex: '0 0 50px',
                                    }}
                                >Q. {product.sellingPrice}</span>
                            </li>
                        ))
                    }
                </ul>

                <ul className={classNames('order-products')}>
                    {
                        newOrder.products.map((product, productIndex) => (
                            <li
                                key={`order_product_${productIndex}`}
                                className={classNames('product-item order-product')}
                            >
                                <span>
                                    {product.product.name}
                                </span>
                                <div className={classNames('order_product_quantity')}>
                                    <span
                                        className={classNames('quantity-minus')}
                                        onClick={() => {
                                            if(product.quantity > 1) {
                                                setNewOrder(prevNewCustomer => ({
                                                    ...prevNewCustomer,
                                                    products: prevNewCustomer.products.map((prevProduct) => {
                                                        if(prevProduct.product.id === product.product.id) {
                                                            return {
                                                                ...prevProduct,
                                                                quantity: prevProduct.quantity - 1,
                                                            };
                                                        }

                                                        return prevProduct;
                                                    })
                                                }));
                                            }
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faMinusCircle} />
                                    </span>
                                    <input
                                        type="text"
                                        value={product.quantity}
                                        onChange={(e) => {
                                            setNewOrder(prevNewCustomer => ({
                                                ...prevNewCustomer,
                                                products: prevNewCustomer.products.map((prevProduct) => {
                                                    if(prevProduct.product.id === product.product.id) {
                                                        return {
                                                            ...prevProduct,
                                                            quantity: e.target.value,
                                                        };
                                                    }

                                                    return prevProduct;
                                                })
                                            }));
                                        }}
                                    />
                                    <span
                                        className={classNames('quantity-plus')}
                                        onClick={() => {
                                            setNewOrder(prevNewCustomer => ({
                                                ...prevNewCustomer,
                                                products: prevNewCustomer.products.map((prevProduct) => {
                                                    if(prevProduct.product.id === product.product.id) {
                                                        return {
                                                            ...prevProduct,
                                                            quantity: prevProduct.quantity + 1,
                                                        };
                                                    }

                                                    return prevProduct;
                                                })
                                            }));
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPlusCircle} />
                                    </span>
                                </div>
                                <div className={classNames('order_product_price')}>
                                    <span>
                                        Q.
                                    </span>
                                    <input
                                        type="text"
                                        value={product.sellingPrice}
                                        onChange={(e) => {
                                            setNewOrder(prevNewCustomer => ({
                                                ...prevNewCustomer,
                                                products: prevNewCustomer.products.map((prevProduct) => {
                                                    if(prevProduct.product.id === product.product.id) {
                                                        return {
                                                            ...prevProduct,
                                                            sellingPrice: e.target.value,
                                                        }
                                                    }

                                                    return prevProduct;
                                                })
                                            }));
                                        }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className={classNames('remove-product')}
                                    onClick={() => {
                                        setNewOrder((prevNewOrder:any) => ({
                                            ...prevNewOrder,
                                            products: prevNewOrder.products.filter((currentProduct:any) => currentProduct.product.id !== product.product.id)
                                        }));
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </li>
                        ))
                    }
                    <li className={classNames('total-row')}>
                        <span
                            style={{
                                display: 'flex',
                                flex: 1
                            }}
                        >
                            Total
                        </span>
                        <span
                            style={{
                                display: 'flex',
                                flex: '0 0 150px',
                                justifyContent: 'end',
                            }}
                        >
                            Q. {
                                newOrder
                                    .products
                                    .reduce((prevVal:any, currentProduct:any) => prevVal + (parseFloat(currentProduct.sellingPrice)), 0)
                                    .toFixed(2)
                            }
                        </span>
                    </li>
                    <li className={classNames('save-order')} onClick={() => {
                        if(newOrder?.products?.length <= 0) return;

                        const finalOrder = {
                            products: newOrder.products.map((orderProduct: any) => ({
                                product: orderProduct.product.id,
                                quantity: orderProduct.quantity ?? 1,
                            }))
                        }
                        
                        //TODO: Show validation errors

                        persistPurchase();
                    }}>
                        Guardar
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default PurchasesPage;
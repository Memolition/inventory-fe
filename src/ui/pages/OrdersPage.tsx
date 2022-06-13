import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { API_ROOT } from '../../renderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';

interface IOrder {
    customer: string;
    invoice: string;
    invoiceSeries: string;
    differentBillingAddress: Boolean;
    billingAddress: string;
    products: any[];
}

interface ICustomer {
    id: string;
    name: string;
    tax_id: string;
    address: string;
    email: string;
    phone: string;
}

const blankOrder:IOrder = {
    customer: '',
    invoice: '',
    invoiceSeries: "",
    differentBillingAddress: false,
    billingAddress: "",
    products: [],
};

const blankCustomer:ICustomer = {
    id: null,
    name: '',
    tax_id: '',
    address: "",
    email: '',
    phone: '',
};

const ProductsPage = () => {
    const [newOrder, setNewOrder] = useState(blankOrder);
    const [newCustomer, setNewCustomer] = useState(blankCustomer);
    const [modifyingCustomer, setModifyingCustomer] = useState(false);
    const [customerReady, setCustomerReady] = useState(false);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [viewProducts, setViewProducts] = useState([]);
    const [filter, setFilter] = useState('');
    const customerNameRef = useRef(null);
    const productFilterRef = useRef(null);
    const customerQueryRef = useRef(null);

    useEffect(() => {
        axios.get(`${API_ROOT}/products`)
        .then((data:any) => {
            setProducts(data.data);
        });
    }, []);

    const changeNewOrder = (attr:string, val:any) => {
        setNewOrder(prevNewProduct => ({
            ...prevNewProduct,
            [attr]: val
        }));
    };

    const changeNewCustomer = (attr:string, val:any) => {
        setNewCustomer(prevNewCustomer => ({
            ...prevNewCustomer,
            [attr]: val
        }));

        setCustomerReady(false);

        //TODO: Ask to persist edition
    };

    useEffect(() => {
        if(!!customerQueryRef?.current) {
            customerQueryRef?.current?.focus();
        }
    }, [customerQueryRef?.current]);

    const persistCustomer = () => {
        if(!newCustomer?.id) {
            axios.post(`${API_ROOT}/people`, newCustomer)
            .then((r:any) => {
                console.log('Successfully registered customer', r);
                setNewCustomer((prevCustomer) => ({
                    ...prevCustomer,
                    id: r?.data?.id,
                }));
                setCustomerReady(true);
            });
        } else {
            axios.put(`${API_ROOT}/people/${newCustomer.id}`, newCustomer)
            .then((r:any) => {
                console.log('Successfully modified customer', r);
                setNewCustomer((prevCustomer) => ({
                    ...prevCustomer,
                    id: r?.data?.id,
                }));
                setCustomerReady(true);
                setModifyingCustomer(false);
            });
        }
    };

    const persistOrder = (order:any = newOrder) => {
        axios.post(`${API_ROOT}/orders`, order)
        .then((r:any) => {
            console.log('Successfully saved order', r);
            setNewOrder(blankOrder);
            setNewCustomer(blankCustomer);
            setCustomerReady(false);
            setViewProducts([]);
        });
    };

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

    const fetchCustomerByTaxId = (tax_id:any) => {
        const fetchingId = tax_id ? tax_id : newOrder.customer;

        axios.get(`${API_ROOT}/people/tax/${encodeURIComponent(fetchingId)}`)
        .then((data:any) => {
            setCustomers(data.data);
        });
    }

    useEffect(() => {
        if(newOrder?.customer?.length > 4) {
            fetchCustomerByTaxId(newOrder.customer);
        }
    }, [newOrder?.customer]);

    useEffect(() => {
        if(!customers?.length && newOrder.customer?.length > 3) {
            setNewCustomer({
                ...blankCustomer,
                tax_id: newOrder.customer
            });
            setCustomerReady(false);
            setModifyingCustomer(true);
        } else if(customers?.length > 0) {
            setNewCustomer(customers[0]);
            setCustomerReady(true);
        }
    }, [customers]);

    useEffect(() => {
        if(!!customerReady) {
            productFilterRef?.current?.focus();
        }
    }, [customerReady]);

    const addProductToOrder = (product:any, quantity:number = 1) => {
        setNewOrder((prevNewOrder:IOrder) => {
            return {
                ...prevNewOrder,
                products: [
                    ...prevNewOrder.products,
                    {
                        product,
                        quantity,
                    }
                ]
            };
        });

        setViewProducts([]);
        setFilter('');
        productFilterRef?.current?.focus();
    }

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
    }

    return (
        <div className={ classNames(['products-view']) }>
            <h1>Crear una nueva venta</h1>

            <div className={ classNames(['new-product-form']) }>
                <form onSubmit={ (e) => {
                    e.preventDefault();
                    fetchCustomerByTaxId(newOrder.customer);
                    customerNameRef?.current?.focus();
                }}>
                    <label>
                        <span>Cliente: </span>
                        <input
                            ref={customerQueryRef}
                            type="text"
                            placeholder="Buscar cliente por NIT"
                            value={newOrder.customer}
                            onChange={(e) => {
                                changeNewOrder('customer', e.target.value.replace(/[^\d]/g, ''));
                                setNewCustomer(blankCustomer);
                                setModifyingCustomer(false);
                            }}
                            onKeyDown={(e) => {
                                if(e?.key === "c") {
                                    fetchCustomerByTaxId('C/F');
                                }
                            }}
                        />
                    </label>
                    {
                        /*
                        <label>
                            <input type="checkbox" checked={!!newOrder.differentBillingAddress} onChange={(e) => { changeNewOrder('differentBillingAddress', !newOrder.differentBillingAddress); }} />
                            Direccion de facturacion diferente
                        </label>
                        */
                    }
                </form>
            </div>
            <div className={classNames('suggest-new-customer')}>
                No se encontro ningun cliente, registar como nuevo cliente?
            </div>
            {
                modifyingCustomer ? (
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        console.log('New Customer', newCustomer);
                        persistCustomer();
                    }}>
                        <div className={classNames('new-customer')}>
                            <div className={classNames('row')}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flex: 1,
                                        padding: '5px',
                                    }}
                                >
                                    <label>
                                        <span>Nombre</span>
                                        <input
                                            type="text"
                                            ref={customerNameRef}
                                            value={newCustomer.name}
                                            onChange={(e) => {changeNewCustomer('name', e.target.value)}}
                                        />
                                    </label>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flex: 1,
                                        padding: '5px',
                                    }}
                                >
                                    <label>
                                        <span>NIT</span>
                                        <input
                                            type="text"
                                            value={newCustomer.tax_id}
                                            onChange={(e) => {changeNewCustomer('tax_id', e.target.value)}}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className={classNames('row')}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flex: 1,
                                        padding: '5px',
                                    }}
                                >
                                    <label>
                                        <span>Direccion</span>
                                        <input
                                            type="text"
                                            value={newCustomer.address}
                                            onChange={(e) => {changeNewCustomer('address', e.target.value)}}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className={classNames('row')}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flex: 1,
                                        padding: '5px',
                                    }}
                                >
                                    <label>
                                        <span>Telefono</span>
                                        <input
                                            type="text"
                                            value={newCustomer.phone}
                                            onChange={(e) => {changeNewCustomer('phone', e.target.value)}}
                                            //TODO: Validate phone length
                                        />
                                    </label>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flex: 1,
                                        padding: '5px',
                                    }}
                                >
                                    <label>
                                        <span>Correo Electronico</span>
                                        <input
                                            type="text"
                                            value={newCustomer.email}
                                            onChange={(e) => {changeNewCustomer('email', e.target.value)}}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className={classNames('row')}>
                                <button type="submit">Guardar</button>
                                <button
                                    onClick={() => {
                                        setModifyingCustomer(false);
                                    }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                ) : customerReady && (
                    <div className={classNames('readonly-customer')}>
                        <div className={classNames('row')}>
                            <div>
                                <span>Nombre:</span>
                                <span>{newCustomer.name}</span>
                            </div>
                            <div>
                                <span>NIT:</span>
                                <span>{newCustomer.tax_id}</span>
                            </div>
                        </div>
                        <div className={classNames('row')}>
                            <div>
                                <span>Direccion:</span>
                                <span>{newCustomer.address}</span>
                            </div>
                        </div>
                        <div className={classNames('row')}>
                            <div>
                                <span>Telefono:</span>
                                <span>{newCustomer.phone}</span>
                            </div>
                            <div>
                                <span>Correo Electronico:</span>
                                <span>{newCustomer.email}</span>
                            </div>
                        </div>
                        <div className={classNames('row', 'end')}>
                            <button onClick={() => {  setModifyingCustomer(true); }}>Editar Cliente</button>
                        </div>
                    </div>
                )
            }

            {

                customerReady && (
                    <div style={{
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'column',
                    }}>

                        <div className={classNames('order-product-list')}>
                            <ul className={classNames('available-products')}>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const scannedProduct = products.find((realProduct) => realProduct.barcode === filter);
                                    const addingProduct = !!scannedProduct ? scannedProduct : viewProducts.find((realProduct) => !!realProduct.active);

                                    if(!!addingProduct) {
                                        const productInOrder = newOrder.products.find((orderProduct) => orderProduct.product.id === filter);

                                        if(!!productInOrder) {
                                            setNewOrder((prevNewProduct:IOrder) => {
                                                return {
                                                    ...prevNewProduct,
                                                    products: prevNewProduct.products.map((existingProduct) => ({...existingProduct, quantity: existingProduct.quantity + 1}))
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
                                                ref={productFilterRef}
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

                            <div>
                                <label>
                                    <span>No. de Factura</span>
                                    <input type="text" value={newOrder.invoice} onChange={(e) => {changeNewOrder('invoice', e.target.value)}} />
                                </label>
                                <label>
                                    <span>No. de Serie</span>
                                    <input type="text" value={newOrder.invoiceSeries} onChange={(e) => {changeNewOrder('invoiceSeries', e.target.value)}} />
                                </label>
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
                                                <span>
                                                    Q. { product.product.sellingPrice }
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
                                                                products: prevNewCustomer.products.map((prevProduct) => ({
                                                                    ...prevProduct,
                                                                    quantity: e.target.value,
                                                                }))
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
                                                    .reduce((prevVal:any, currentProduct:any) => prevVal + (parseFloat(currentProduct.product.sellingPrice) * currentProduct.quantity), 0.00)
                                                    .toFixed(2)
                                            }
                                        </span>
                                    </li>
                                    <li className={classNames('save-order')} onClick={() => {
                                        if(newOrder?.products?.length <= 0) return;

                                        const finalOrder = {
                                            customer: newCustomer?.id ?? null,
                                            invoice: newOrder?.invoice,
                                            products: newOrder.products.map((orderProduct: any) => ({
                                                product: orderProduct.product.id,
                                                quantity: orderProduct.quantity ?? 1,
                                            }))
                                        }
                                        
                                        //TODO: Show validation errors
                                        persistOrder(finalOrder);
                                    }}>
                                        Guardar
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default ProductsPage;
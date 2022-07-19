import axios from "axios";
import React, { useState } from "react";
import { API_ROOT } from "../../../renderer";

interface IProps {
  product: any;
}

const InventoryItemForm = ({product}:IProps) => {
  const [productObject, setProductObject] = useState(product);

  const modifyProduct = (prop:string, val:string) => {
    setProductObject((prevObj:any) => ({
      ...prevObj,
      [prop]: val,
    }))
  }

  return (
    <form
      className="inventory-product-form"
      onSubmit={(e) => {
        e.preventDefault();
        console.log('Upating product', productObject.id, productObject);

        axios.put(`${API_ROOT}/products/${productObject.id}`, productObject);
      }}
    >
      <div className="row">
          <label>
              <span>Producto: </span>
              <input type="text" placeholder="Nombre" value={productObject.name ?? ""} onChange={(e) => { modifyProduct('name', e.target.value) }} />
          </label>
          <label>
              <span>Codigo de Barras: </span>
              <input type="text" placeholder="Codigo de Barras" value={productObject.barcode ?? ""} onChange={(e) => { modifyProduct('barcode', e.target.value) }}  />
          </label>
          <label>
              <span>No. de Parte: </span>
              <input type="text" placeholder="Numero de Parte" value={productObject.partNumber ?? ""} onChange={(e) => { modifyProduct('partNumber', e.target.value) }}  />
          </label>
      </div>
      <div className="row">
          <label>
              <span>Precio de Venta: </span>
              <input type="text" placeholder="Precio de Venta" value={parseFloat(productObject.sellingPrice).toFixed(2)} onChange={(e) => { modifyProduct('sellingPrice', parseFloat(e.target.value.replace(/[^\d\.]/g, '')).toFixed(2)) }}  />
          </label>
          <label>
              <span>Cantidad Minima: </span>
              <input type="text" placeholder="Cantidad Minima en Inventario" value={productObject.minimumQuantity} onChange={(e) => { modifyProduct('minimumQuantity', e.target.value) }}  />
          </label>
      </div>
      <div className="row">
          <input type="submit" className="btn" value="Editar" />
      </div>
    </form>
  );
};

export default InventoryItemForm;
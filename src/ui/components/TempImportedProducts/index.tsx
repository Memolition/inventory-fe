import React, { useRef } from "react";
import ImportProductItem from "../ImportProductItem";
import TagGenerator from "../TagGenerator";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { API_ROOT } from "../../../renderer";

interface IProps {
  products: any[];
  setProducts: Function;
}

const productProps = {
  "name": "Nombre",
  "barcode": "Codigo de Barras",
  "partNumber": "No. de Partes",
  "sellingPrice": "Precio de Venta",
  "stock": "Stock",
  "tag": "Etiqueta",
}

export const persistTempBarcode = (productId:number, barcode:string) => {
  axios.put(`${API_ROOT}/products/import/${productId}`, {barcode})
  .then((r:any) => {
      if(r?.data) {
          console.log(r.data);
      }
  });
}

const TempImportedProducts = ({products, setProducts}:IProps) => {
  const printableDivRef = useRef<HTMLDivElement>();
  const printingIframeRef = useRef<HTMLIFrameElement>();

  const setBarcode = (code:string, product:number) => {
    persistTempBarcode(product, code);

    setProducts((prevState:any) => {
        return prevState.map((stateProduct:any) => {
            if(stateProduct.id === product) {
                return {
                    ...stateProduct,
                    barcode: code,
                }
            }

            return stateProduct;
        })
    });
}

  const generateBarCode = (productId:number, name:string) => {
    const barcode = uuidv4();

    setBarcode(barcode, productId);

    return barcode;
  };

  return (
    <div>
      <div className="row">
        <button
          className="btn"
          onClick={() => {
            const importingProducts = products.filter((product) => !!product?.barcode?.length);
            axios.post(`${API_ROOT}/products/import`, {products: importingProducts}).then((r) => {
              setProducts([]);
            })
          }}
        >Completar</button>
        <button
          className="btn"
          style={{ marginRight: "5px", marginLeft: "5px" }}
          onClick={() => {
            products.forEach((prod) => {
              if (!prod?.barcode?.length) {
                generateBarCode(prod.id, prod.name);
              }
            })
          }}
        >
          Generar codigos faltantes
        </button>
        <button className="btn btn-primary" onClick={() => {
          const pri = printingIframeRef.current.contentWindow;
          pri.document.open();
          pri.document.write(`<style>
                  @media print {
                      @page {
                          size: portrait;
                          size: 5cm 4cm;
                          margin: 5mm;
                      }
                  }
                  body {
                      margin: 0;
                      padding: 0;
                      border: 0;
                  }
                  img {
                      page-break-before: always; /* 'always,' 'avoid,' 'left,' 'inherit,' or 'right' */
                      page-break-after: always; /* 'always,' 'avoid,' 'left,' 'inherit,' or 'right' */
                      page-break-inside: avoid;
                      width: 4cm;
                      height: 3cm;
                  }
              </style>`);
          pri.document.write(printableDivRef.current.innerHTML);
          pri.document.close();
          pri.focus();
          pri.print();
        }}>Imprimir codigos</button>
      </div>
      <iframe ref={printingIframeRef} style={{ width: 0, height: 0, position: "absolute", top: 0, right: 0 }} />
      <table className="temp-imported-products">
        <thead>
          <tr>
            {
              Object.keys(productProps).map((column: string, columnIndex: number) => (
                <th key={`missing_codebar_column_name_${columnIndex}`}>
                  {productProps[column as keyof typeof productProps]}
                </th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            products.map((product: any, productIndex: number) => (
              <ImportProductItem key={`product_item_${productIndex}`} product={product} generateBarCode={generateBarCode} setBarcode={setBarcode} columnMap={productProps} />
            ))
          }
        </tbody>
      </table>
      <div ref={printableDivRef} className="tags_preview">
        {products.filter(tag => !!tag?.barcode?.length).map((tag: any, tagIndex: number) => (
          <TagGenerator key={`tag_${tagIndex}`} productName={tag.name} productBarCode={tag.barcode} />
        ))}
      </div>
    </div>
  );
};

export default TempImportedProducts;
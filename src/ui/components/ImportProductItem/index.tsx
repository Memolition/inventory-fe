import React from "react";
import TagGenerator from "../TagGenerator";
import { persistTempBarcode } from "../TempImportedProducts";

interface IProps {
    product: any;
    columnMap: any;
    generateBarCode: Function;
    setBarcode: Function;
}

const ImportProductItem = ({product, generateBarCode, setBarcode, columnMap}:IProps) => {

    return (
        <tr>
            {
                Object.keys(columnMap).map((column: string, columnIndex: number) => (
                    <td key={`column_name_${columnIndex}`}>
                        {
                            column === "barcode" ? (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();

                                        persistTempBarcode(product.id, product.barcode);
                                    }}
                                >
                                    <input
                                        type="text"
                                        placeholder="Escanear Codigo"
                                        value={product.barcode}
                                        onChange={(e) => { setBarcode(e.target.value, product.id) }}
                                    />
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={() => { generateBarCode(product.id, product.name); }}
                                    >
                                        Generar Codigo
                                    </button>
                                </form>
                            ) : column==="tag" ? (
                                <TagGenerator productName={product.name} productBarCode={product.barcode} />
                            ) : product[column] 
                        }
                    </td>
                ))
            }
        </tr>
    );
};

export default ImportProductItem;
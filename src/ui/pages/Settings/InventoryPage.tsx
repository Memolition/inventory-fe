import React, { useRef, useState } from "react";
import classNames from "classnames";
import CSVReader from 'react-csv-reader'
import axios from "axios";
import { API_ROOT } from "../../../renderer";

const InventoryPage = () => {
    const [file, setFile] = useState([]);
    const inputRef = useRef<HTMLInputElement>();

    return file?.length ? (
        <div>
            <button onClick={() => { setFile([]); }}>Cambiar archivo</button>
            <button
                onClick={() => {
                    axios.post(`${API_ROOT}/products/import`, {file})
                    .then((r:any) => {
                        console.log('Successfully imported inventory', r);
                        setFile([]);
                    });
                }}
            >Importar</button>
            <table>
                <thead>
                    <tr>
                        {
                            Object.keys(file[0]).map((column:any, columnIndex:number) => (
                                <th key={`file_column_name_${columnIndex}`}>
                                    {column}
                                </th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        file.map((line:any, lineIndex:number) => (
                            <tr>
                            {
                                Object.values(line).map((cell:any, cellIndex:number) => (
                                    <td key={`file_column_${lineIndex}_${cellIndex}`}>
                                        {cell}
                                    </td>
                                ))
                            }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    ) : (
        <label className={ classNames("dropzone") }>
            <div
                onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = "all";
                    e.dataTransfer.dropEffect = "move"
                }}
                onDrop={(e) => {
                    console.log('changed')
                    inputRef.current.files = e.dataTransfer.files;
                    inputRef.current.dispatchEvent(new Event('change'));
                }}
                onDragOver={(e) => {e.preventDefault()}}
            >
                <span>Arrastre o seleccione un archivo aqui</span>
            </div>
            <CSVReader inputRef={(ref) => (inputRef.current = ref)} parserOptions={{ header: true }} onFileLoaded={(data:any, fileInfo:any) => {setFile(data)}} />
        </label>
    );
};

export default InventoryPage;
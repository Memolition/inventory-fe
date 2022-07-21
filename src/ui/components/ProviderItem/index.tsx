import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_ROOT } from "../../../renderer";
import ProviderListItem from "../ProviderListItem";
import SelectableList from "../SelectableList";

interface IProps {
  provider: any;
  lines: any[];
  brands: any [];
}

const ProviderItem = ({provider, lines, brands}:IProps) => {
  const [edit, setEdit] = useState(false);
  const [currentLines, setCurrentLines] = useState([]);
  const [currentBrands, setCurrentBrands] = useState([]);

  useEffect(() => {
    console.log('provider lines', lines, provider);
    setCurrentLines(lines.map((line, lineIndex) => {
      const found = provider.ProviderLines.find((providerLine:any) => providerLine.id === line.id);

      line.active = !!found;

      return line;
    }))
  }, [lines, edit])

  useEffect(() => {

  }, [brands]);

  return (
    <ProviderListItem provider={provider}>
      <div className="row">
        {
          !!edit && <button
            className="btn"
            onClick={ () => {
              axios.put(`${API_ROOT}/providers/${provider.id}`, {provider, ProviderLines: currentLines.filter((activeLine:any) => activeLine.active ).map((activeLine:any) => activeLine.id)})
            } }
          >
            Editar
          </button>
        }
        <button
          className="btn"
          onClick={ () => {
            setEdit(!edit);
          } }
        >
          { edit ? "Cancelar" : "Editar" }
        </button>
      </div>
      <div className="row">
        <SelectableList Title="Lineas" Items={!!edit ? currentLines : provider.ProviderLines} SetItems={setCurrentLines} />
        <SelectableList Title="Marcas" Items={provider.ProviderBrands} />
      </div>
    </ProviderListItem>
  );
};

export default ProviderItem;
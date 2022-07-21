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
    setCurrentLines(lines.map((line, lineIndex) => {
      const found = provider.ProviderLines.find((providerLine:any) => providerLine.id === line.id);

      line.active = !!found;

      return line;
    }))
  }, [lines])

  useEffect(() => {
    setCurrentBrands(brands.map((line, lineIndex) => {
      const found = provider.ProviderBrands.find((providerLine:any) => providerLine.id === line.id);

      line.active = !!found;

      return line;
    }))
  }, [brands])

  return (
    <ProviderListItem provider={provider}>
      <div className="row">
        {
          !!edit && <button
            className="btn"
            onClick={ () => {
              axios.put(`${API_ROOT}/providers/${provider.id}`,
                {
                  provider,
                  ProviderLines: currentLines.filter((activeLine:any) => activeLine.active ).map((activeLine:any) => activeLine.id),
                  ProviderBrands: currentBrands.filter((activeBrand:any) => activeBrand.active ).map((activeBrand:any) => activeBrand.id)
                }).then(r => {
                  setEdit(false);
                });
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
        <SelectableList Title="Marcas" Items={!!edit ? currentBrands : provider.ProviderBrands} SetItems={setCurrentBrands} />
      </div>
    </ProviderListItem>
  );
};

export default ProviderItem;
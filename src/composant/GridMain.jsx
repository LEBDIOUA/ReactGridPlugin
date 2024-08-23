import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import DataUtils from "../data/DataUtils";
import { CustomSelect } from "@lebdioua/react-select-plugin";
import "@lebdioua/react-select-plugin/dist/style.css";

function GridMain({ data, pageSizesArray, rowsSelected, isDelete, searchEnabled }) {
  // Définir les tailles de pages
  const pageSizes = pageSizesArray || [10, 25, 50, 100];
  const PageSizeSelector = pageSizes.map((element, index) => ({
    value: element,
    disabled: index !== 0 && data.length < element - 5,
  }));

  const [finalData, setFinalData] = useState(data && data.length > 0 ? data : []);
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortingState, setSortingState] = useState({ columnIndex: null, order: "none" });
  const [isSearching, SetIsSearching] = useState(false);

  const [pageSize, setPageSize] = useState(PageSizeSelector[0].value); // Nombre de lignes affiché dans chaque page
  const [currentRange, setCurrentRange] = useState(1); // La page acctuelle

  const [totalEntries, setTotalEntries] = useState(data.length ?? 0); // Nombre de lignes
  const totalRanges = Math.ceil(totalEntries / pageSize); // Nombre de pages

  const labels = data && data.length > 0 ? Object.keys(data[0]) : null; // Récuperer les titres des colonnes
  const searchRef = useRef(null);

  // Mémoriser les données paginées et triées pour optimiser les recalculs
  const rangeData = useMemo(() => {
    const startEntry = currentRange * pageSize - pageSize;
    const endEntry = Math.min(currentRange * pageSize, finalData.length) - 1;
    return finalData.slice(startEntry, endEntry + 1);
  }, [finalData, currentRange, pageSize]);

  // Formater les titres de labels, exp: firstName ou first_name ==> First name
  const formatLabel = (str) => {
    let newLabel = str[0].toUpperCase();
    for (let i = 1; i < str.length; i++) {
      if (str[i].match(/[A-Z]/)) {
        // Vérification des majuscules
        newLabel += " " + str[i].toLowerCase();
      } else if (str[i].match(/_/)) {
        // Vérification des underscores
        newLabel += " ";
      } else {
        newLabel += str[i];
      }
    }
    return newLabel;
  };

  // Effet déclenché à chaque changement de page, tri ou données
  useEffect(() => {
    if (isDelete || (data.length > finalData.length && !isSearching)) {
      setFinalData(data);
      handleSelectAll(false);
      if (searchRef.current) searchRef.current.value = "";
    }
    setCurrentRange(1);
    setTotalEntries(finalData.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length, isDelete, finalData, isSearching]);

  const previewRange = () => {
    if (currentRange > 1) setCurrentRange(currentRange - 1);
  };

  const nextRange = () => {
    if (currentRange < totalRanges) setCurrentRange(currentRange + 1);
  };

  // Met à jour le nombre de lignes affichées par page et réinitialise la pagination à la première page
  const itemSelectedChange = (value) => {
    setPageSize(value);
    setCurrentRange(1);
  };

  // Trie les données en fonction de l'index de la colonne et de l'état de tri actuel
  const sortData = (index) => {
    let newOrder;
    if (sortingState.columnIndex === index) {
      // Alternance entre asc, desc, et notSort
      newOrder = sortingState.order === "asc" ? "desc" : sortingState.order === "desc" ? "notSort" : "asc";
      setSortingState({ columnIndex: index, order: newOrder });
    } else {
      // Nouvelle colonne, trier par ordre ascendant
      newOrder = "asc";
      setSortingState({ columnIndex: index, order: "asc" });
    }
    setFinalData(DataUtils.sortDate(newOrder, finalData, index));
  };

  // Gère la sélection ou la désélection de toutes les lignes
  const handleSelectAll = (isChecked) => {
    setSelectedRows(isChecked ? [...finalData] : []);
  };

  // Mise à jour de la sélection des lignes lorsque l'utilisateur coche/décoche une case
  useEffect(() => {
    if (rowsSelected) {
      rowsSelected(selectedRows);
    }
  }, [selectedRows, rowsSelected]);

  // Gère la sélection individuelle de chaque ligne
  const handleRowCheckboxChange = (row, isChecked) => {
    setSelectedRows((prevSelectedRows) => {
      if (isChecked) {
        return [...prevSelectedRows, row];
      } else {
        return prevSelectedRows.filter((selectedRow) => selectedRow !== row);
      }
    });
  };

  const handleSearch = (value) => {
    setSortingState({ columnIndex: null, order: "notSort" });
    if (value) {
      setFinalData(DataUtils.searchData(data, value));
      SetIsSearching(true);
    } else {
      setFinalData(data);
      SetIsSearching(false);
    }
  };
  // Retourne un message si aucune donnée n'est disponible
  if (!data || data.length === 0) return <div className="emptyList">No items to display</div>;

  return (
    <div className="gridContainer">
      <div className="gridHeader">
        <div className="PageSizeSelector">
          <label htmlFor="pageSize">Page size :</label>
          <CustomSelect id="pageSize" data={PageSizeSelector ?? null} onSelect={itemSelectedChange} />
        </div>
        <div className={`searchZone ${!searchEnabled ? "disabled" : ""}`}>
          <label htmlFor="search">Search :</label>
          <input type="text" id="search" onChange={(e) => handleSearch(e.target.value)} ref={searchRef} />
        </div>
      </div>

      <div className="gridMain">
        <table className="gridMain-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={finalData.length > 0 ? rangeData.every((row) => selectedRows.includes(row)) : false}
                />
              </th>
              {labels.map((label, index) => (
                <th key={index} onClick={() => sortData(index)}>
                  <div className="th-content">
                    <p>{formatLabel(label)}</p>
                    <p
                      className={`btnSort ${finalData.length > 0 ? (sortingState.columnIndex === index ? sortingState.order : "notSort") : ""}`}
                    ></p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {finalData.length > 0 ? (
            <tbody>
              {rangeData.map((row, rowIndex) => {
                return (
                  <tr key={rowIndex}>
                    <td>
                      <input
                        type="checkbox"
                        id={`checkbox-${rowIndex}`}
                        onChange={(e) => handleRowCheckboxChange(row, e.target.checked)}
                        checked={selectedRows.includes(row)}
                      />
                    </td>
                    {labels.map((cell, cellIndex) => (
                      <td key={cellIndex}>{row[cell]}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td className="emptyList" colSpan={labels.length + 1}>
                  No items to display
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      <div className="gridControls">
        <div className="gridControls-infos">
          <p>
            {totalEntries > 0
              ? `From ${(currentRange - 1) * pageSize + 1} to ${Math.min(currentRange * pageSize, totalEntries)} in ${totalEntries}`
              : `From 0 to 0 in 0`}
          </p>
        </div>

        <div className="gridControls-btns">
          <button onClick={previewRange} disabled={totalEntries === 0 || currentRange === 1}>
            Preview
          </button>
          <p>{currentRange}</p>
          <button onClick={nextRange} disabled={totalEntries === 0 || currentRange === totalRanges}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

GridMain.propTypes = {
  data: PropTypes.array.isRequired,
  pageSizesArray: PropTypes.array,
  rowsSelected: PropTypes.func,
  isDelete: PropTypes.bool,
  searchEnabled: PropTypes.bool,
};

export default GridMain;

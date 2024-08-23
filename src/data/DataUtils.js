class DataUtils {
  static basicData = [];

  /**
   * Convertit une chaîne de caractères en date
   * @param {string} dateStr - La chaîne à convertir en date
   * @returns {Date|null} - Un objet Date ou null si la conversion échoue
   */
  static parseDate = (dateStr) => {
    // Convertir la date au format YYYY-MM-DD pour faciliter le tri
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
    return new Date(dateStr);
  };

  /**
   * Trie les données en fonction du type de tri et de l'index de colonne
   * @param {string} sortType - Le type de tri ('ascending', 'descending', 'notSort')
   * @param {Array} data - Les données à trier
   * @param {number} index - L'index de la colonne à trier
   * @returns {Array} - Les données triées
   */
  static sortDate = (sortType, data, index) => {
    if (data && data.length > 0) {
      let sortedData = [...data];
      const labels = Object.keys(data[0]);
      if (DataUtils.basicData.length === 0) DataUtils.basicData = [...data];

      const key = labels[index];
      if (sortType === "notSort" || !key) {
        return [...DataUtils.basicData];
      }
      if (key) {
        sortedData.sort((a, b) => {
          const valA = a[key];
          const valB = b[key];

          const isDate = /^\d{2}\/\d{2}\/\d{4}$/.test(valA) || /^\d{2}-\d{2}-\d{4}$/.test(valA);
          const isNumber = !isNaN(valA);

          // Traitement des dates
          if (isDate) {
            const dateA = DataUtils.parseDate(valA);
            const dateB = DataUtils.parseDate(valB);
            return sortType === "asc" ? dateA - dateB : dateB - dateA;
          }

          // Traitement des nombres
          if (isNumber) {
            const numA = parseFloat(valA);
            const numB = parseFloat(valB);
            return sortType === "asc" ? numA - numB : numB - numA;
          }

          // Traitement des chaînes de caractères
          const strA = valA ? valA.toString().toLowerCase().trim() : "";
          const strB = valB ? valB.toString().toLowerCase().trim() : "";
          return sortType === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
        });
      }
      return sortedData;
    } else {
      return [];
    }
  };

  /**
   * Chercher une valeur dans un tableau de données
   * @param {Array} data - Les données à trier
   * @param {string} value - La valeur à rechercher
   * * @returns {Array} - Les resultats de recherche
   */
  static searchData = (data, value) => {
    let result = [];
    if (data && data.length > 0) {
      if (value.length === 0) result = data;
      else {
        result = data.filter((item) =>
          Object.values(item).some((val) => {
            if (val.toString().toLowerCase().includes(value.toString().toLowerCase())) return item;
          }),
        );
      }
    }
    return result;
  };
}
export default DataUtils;

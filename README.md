# @lebdioua/react-grid-plugin

Un composant de grille personnalisable pour React avec des fonctionnalités de tri, de pagination et de sélection de taille de page.

## Installation

Vous pouvez installer le package en utilisant npm :
`npm install @lebdioua/react-grid-plugin`

ou en utilisant yarn :
`yarn add @lebdioua/react-grid-plugin`

## Utilisation
Voici un exemple de base de l'utilisation du composant **GridMain** :

```
import React from 'react';
import GridMain from '@lebdioua/react-grid-plugin';
import '@lebdioua/react-grid-plugin/dist/style.css'; // Assurez-vous d'importer le CSS

const App = () => {
  const data = [
    { firstName: 'John', lastName: 'Doe', city: 'New York' },
    { firstName: 'Jane', lastName: 'Smith', city: 'Los Angeles' },
    { firstName: 'Jim', lastName: 'Brown', city: 'Chicago' },
    // Ajoutez plus de données ici
  ];

  const pageSizes = [10, 25, 50, 100];

  // Fonction de callback pour gérer les lignes sélectionnées
  const handleRowsSelected = (selectedRows) => {
    console.log('Lignes sélectionnées:', selectedRows);
  };

  return (
    <div>
      <h1>Exemple de Grid</h1>
      <GridMain data={data} pageSizesArray={pageSizes} rowsSelected={handleRowsSelected} />
    </div>
  );
};

export default App;
```

## Fonctionnalités
* Tri des données : Cliquez sur les en-têtes de colonne pour trier les données dans l'ordre croissant ou décroissant.
- Pagination : Naviguez entre les pages en utilisant les boutons de prévisualisation et suivant.
+ Sélection de taille de page : Choisissez combien d'éléments afficher par page.
* Réinitialisation : Réinitialisez tous les champs de tri à l'état non trié (notSort) lorsque le tri sur une colonne est annulé.
- Gestion dynamique des tailles de page : Les options de taille de page sont automatiquement ajustées en fonction du nombre total d'entrées.
+ Sélection de lignes : Sélectionnez ou désélectionnez toutes les lignes avec une case à cocher en haut de la grille, ou sélectionnez des lignes individuelles avec les cases à cocher dans chaque ligne.
* Affichage d'un message lorsqu'il n'y a pas de données : Un message "No items to display" est affiché lorsque les données sont vides.
- Recherche : Filtrez les données en fonction d'une chaîne de recherche saisie dans la barre de recherche. Chaque modification de la recherche réaffichera les résultats correspondants, même avec de grands ensembles de données. Si aucun résultat ne correspond à la recherche, le message "No items to display" s'affichera.

## Props
Le composant **GridMain** accepte les props suivantes :
| Prop Name    | Type     | Required | Description                                                                 |
|--------------|----------|----------|-----------------------------------------------------------------------------|
| `data`       | `array`  | oui      | Tableau d'objets représentant les lignes de la grille. |
| `pageSizesArray` | `array` | non    | Tableau d'entiers représentant les tailles de page disponibles.   |
| `rowsSelected` | `function` | non    | Fonction de callback appelée avec les lignes sélectionnées lorsqu'elles changent.   |
| `searchEnabled` | `boolean` | non    | Active ou désactive la barre de recherche (par défaut activée).   |

## Styles
Assurez-vous d'importer le fichier CSS pour appliquer les styles par défaut :
`import '@lebdioua/react-grid-plugin/dist/style.css';`

Vous pouvez personnaliser les styles en surchargant les classes CSS par défaut :

```
.gridContainer {
  /* Vos styles personnalisés */
}

.PageSizeSelector {
  /* Vos styles personnalisés */
}

.gridMain {
  /* Vos styles personnalisés */
}

.gridMain-table {
  /* Vos styles personnalisés */
}

.gridControls {
  /* Vos styles personnalisés */
}

.gridControls-infos {
  /* Vos styles personnalisés */
}

.gridControls-btns {
  /* Vos styles personnalisés */
}

.btnSort {
  /* Vos styles personnalisés pour les boutons de tri */
}

.emptyList {
  /* Vos styles pour le message lorsque aucune donnée n'est disponible */
}

.searchZone {
  /* Styles pour la zone de recherche */
}
```

## Contribution
Les contributions sont les bienvenues ! Veuillez ouvrir une issue ou soumettre une pull request pour tout bug ou amélioration.

## Remerciements
Inspiré par le besoin d'un composant de grille personnalisable et performant dans React.

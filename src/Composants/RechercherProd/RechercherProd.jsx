import React from 'react'

export default function RechercherProd(props) {

    const filtrerListe = (e) => {
        const liste = props.listeProduitsSauvegarde.filter(item => (item.designation.toLowerCase().indexOf(e.target.value.trim().toLowerCase()) !== -1));
        props.setListeProduits(liste);
    }

  return (
    <div className="search-zone">
        <input type="text" className="rechercher" placeholder="recherchez un produit" onChange={filtrerListe} />
    </div>
  )
}

import React from 'react';
import { useState, useEffect } from 'react';
import './ListeProduits.css'
import AfficherListe from './AfficherListe/AfficherListe';
import RechercherProd from '../RechercherProd/RechercherProd';


export default function ListeProduits() {

    const listeClasses = [
        'antibiotiques',
        'antipaludiques',
        'antiinflammatoiresetantalgiques',
        'antispamodiques',
        'antigrippaux',
        'antihistaminiqueh1',
        'antiulcereuxetantiacide',
        'vermifuges',
        'vitaminesetelectrolytes',
        'antianemiques',
    ]

    const [listeProduits, setListeProduits] = useState([]);
    const [listeProduitsSauvegarde, setListeProduitsSauvegarde] = useState([]);
    const [msgErreur, setMsgErreur] = useState('')

    useEffect(() => {
        fetch('http://serveur/backend-cmab/liste_produits_par_classe.php')
        .then(response => response.json())
        .then(data => {
            
            setMsgErreur('')
            setListeProduits(data);
            setListeProduitsSauvegarde(data);
        })
        .catch(error => {
            setMsgErreur("erreur réseau");
        })
    }, []);

  return (
    <div className='liste-prod'>
        <RechercherProd
            listeProduitsSauvegarde={listeProduitsSauvegarde}
            setListeProduits={setListeProduits}
        />
        <p className='erreur-message'>{msgErreur}</p>
        {listeClasses.map(classe => (
            <AfficherListe
                listeProduits={listeProduits}
                classe={classe}
            />
        ))}
    </div>
  )
}

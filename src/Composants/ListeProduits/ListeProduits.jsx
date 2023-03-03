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

    useEffect(() => {
        const req = new XMLHttpRequest();
        req.open('GET', 'http://192.168.8.103/backend-cmab/liste_produits_par_classe.php');

        req.addEventListener('load', () => {
            const result = JSON.parse(req.responseText);
            setListeProduits(result);
            setListeProduitsSauvegarde(result);
        });

        req.send()
    }, []);

  return (
    <div className='liste-prod'>
        <RechercherProd
            listeProduitsSauvegarde={listeProduitsSauvegarde}
            setListeProduits={setListeProduits}
        />
        {listeClasses.map(classe => (
            <AfficherListe
                listeProduits={listeProduits}
                classe={classe}
            />
        ))}
    </div>
  )
}

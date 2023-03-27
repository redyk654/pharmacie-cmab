import React, { useEffect, useState, useContext } from 'react';
import AfficherBordereau from './AfficherBordereau';
import './Bordereau.css';
import { useSpring, animated } from 'react-spring';
import { ContextChargement } from '../../Context/Chargement';
import { mois } from '../../shared/Globals';

export default function Bordereau() {

    const props1 = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });

    const {darkLight} = useContext(ContextChargement)

    const [listeCommandes, setListeCommandes] = useState([]);
    const [listeCommandesSauvegardes, setListeCommandesSauvegardes] = useState([]);
    const [commandesSelectionne, setCommandeSelectionne] = useState([]);
    const [infosCommande, setInfosCommande] = useState({});


    useEffect(() => {
        const req = new XMLHttpRequest();
        req.open('GET', `http://serveur/backend-cmab/recuperer_commandes.php?`);

        req.addEventListener('load', () => {
            const result = JSON.parse(req.responseText);
            setListeCommandes(result);
            setListeCommandesSauvegardes(result);
        })

        req.send();
    }, [])

    const filtrerListe = (e) => {
        const medocFilter = listeCommandesSauvegardes.filter(item => (item.date_commande.indexOf(e.target.value) !== -1))
        setListeCommandes(medocFilter);
    }

    const afficherCommandes = (e) => {

        // Récupération des détails de la commande selectionné
        const data = new FormData();
        data.append('id_commande', e.target.id);

        const req = new XMLHttpRequest();

        req.open('POST', 'http://serveur/backend-cmab/recuperer_commandes.php');

        req.addEventListener('load', () => {
            const result = JSON.parse(req.responseText);
            const infos = listeCommandes.filter(item => e.target.id == item.id_commande)[0];
            setInfosCommande(infos);
            setCommandeSelectionne(result);
        });

        req.send(data);
    }

    return (
        <animated.div style={props1}>
            <section className="container-bordereaux">
                <div className="box-liste">
                    <h1>Liste des commandes</h1>
                    <p className="search-zone">
                        <input type="text" placeholder="entrez une date" onChange={filtrerListe} />
                    </p>
                    <ul>
                        {listeCommandes.length > 0 ? listeCommandes.map(item => (
                            <li id={item.id_commande} key={item.id} onClick={afficherCommandes}>{item.date_commande}</li>
                        )) : null}
                    </ul>
                </div>
                <div className="box-bordereau">
                    <h1>Bordereau de la commande</h1>
                    <div className="entete-bordereau">Fournisseur : &nbsp;<span className="span-entete" style={{color: `${darkLight ? '#fff' : '#000'}`}}>{infosCommande.fournisseur && infosCommande.fournisseur}</span></div>
                    <div className="entete-bordereau">Commandé par : &nbsp;<span className="span-entete" style={{color: `${darkLight ? '#fff' : '#000'}`}}>{infosCommande.vendeur && infosCommande.vendeur}</span></div>
                    <div className="entete-bordereau">Le : &nbsp;<span className="span-entete" style={{color: `${darkLight ? '#fff' : '#000'}`}}>{infosCommande.date_commande && mois(infosCommande.date_commande.substr(0, 10))}</span></div>
                    <div className="entete-bordereau">Montant : &nbsp;<span className="span-entete" style={{color: `${darkLight ? '#fff' : '#000'}`}}>{infosCommande.montant && infosCommande.montant + ' Fcfa'}</span></div>
                    <h1>Produits commandés</h1>
                    <AfficherBordereau commandesSelectionne={commandesSelectionne} />
                </div>
            </section>
        </animated.div>
    )
}

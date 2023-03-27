import React, { useEffect, useState, useContext } from 'react';
import '../Bordereau/Bordereau.css';
import { useSpring, animated } from 'react-spring';
import { ContextChargement } from '../../Context/Chargement';
import { filtrerListe, mois } from '../../shared/Globals';
import UseMsgErreur from '../../Customs/UseMsgErreur';
import AfficherInventaire from '../../shared/AfficherInventaire';
import TitleH2 from '../../shared/TitleH2';
import SearchInput from '../../shared/SearchInput';
import TitleH1 from '../../shared/TitleH1';
import AfficherListe from '../../shared/AfficherListe';

export default function Inventaires(props) {

    const props1 = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });

    const {darkLight} = useContext(ContextChargement)

    const [listeInventaires, setListeInventaires] = useState([]);
    // const [listeCommandesSauvegardes, setListeCommandesSauvegardes] = useState([]);
    const [inventaireSelectionne, setInventaireSelectionne] = useState([]);
    const [infosInventaire, setInfosInventaire] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchProd, setSearchProd] = useState('');
    const [msgErreur, setMsgErreur] = useState('');

    const propSearchDate = "date_effectue"
    const propSearchDesignation = "designation"
    const vueListeInventaire = filtrerListe(propSearchDate, searchTerm, listeInventaires);
    const vueInfosInventaire = filtrerListe(propSearchDesignation, searchProd, infosInventaire);

    useEffect(() => {
      fetch('http://serveur/backend-cmab/sauvegarder_inventaire.php?liste')
      .then(response => response.json())
      .then(data => {
        setMsgErreur('');
        setListeInventaires(data);
      })
      .catch(error => setMsgErreur('Erreur réseau'));
    }, [])

    const afficherInventaire = (e) => {
      fetch(`http://serveur/backend-cmab/sauvegarder_inventaire.php?id_inventaire=${e.target.id}`)
      .then(response => response.json())
      .then(data => {
        setMsgErreur('');
        setInfosInventaire(data);
        setInventaireSelectionne(listeInventaires.filter(item => item.id_inventaire === e.target.id)[0]);
      })
      .catch(error => setMsgErreur('Erreur réseau'));
    }

    const handleChange = (e) => {
      setSearchTerm(e.target.value);
    }

    const handleChangeProd = (e) => {
      setSearchProd(e.target.value);
    }

    return (
        <animated.div style={props1}>
            <section className="container-bordereaux">
                <div className="box-liste">
                    <TitleH1 val="Liste des commandes"/>
                    <SearchInput
                      placeholder="entrez une date"
                      searchTerm={searchTerm}
                      handleChange={handleChange}
                    />
                    {UseMsgErreur(msgErreur)}
                    <h1>Liste des inventaires</h1>
                    <AfficherListe
                      liste={vueListeInventaire}
                      handleClick={afficherInventaire}
                      id="id_inventaire"
                      cle="id"
                      val="date_effectue"
                    />
                </div>
                <div className="box-bordereau">
                    {/* <h1>Information sur l'inventaire</h1> */}
                    <TitleH1 val="Information sur l'inventaire"/>
                    <div className="entete-bordereau">Auteur : &nbsp;<span className="span-entete" style={{color: `${darkLight ? '#fff' : '#000'}`}}>{inventaireSelectionne.auteur && inventaireSelectionne.auteur}</span></div>
                    <div className="entete-bordereau">Le : &nbsp;<span className="span-entete" style={{color: `${darkLight ? '#fff' : '#000'}`}}>{inventaireSelectionne.date_effectue && mois(inventaireSelectionne.date_effectue.substr(0, 10))}</span></div>
                    <TitleH2 val="Liste des produits" />
                    <SearchInput
                      placeholder="rechercher un produit"
                      searchTerm={searchProd}
                      handleChange={handleChangeProd}
                      styles1={{textAlign: 'center'}}
                      styles2={{width: '20%'}}
                    />
                    <AfficherInventaire
                      listeProds={vueInfosInventaire}
                    />
                </div>

            </section>
        </animated.div>
    )
}

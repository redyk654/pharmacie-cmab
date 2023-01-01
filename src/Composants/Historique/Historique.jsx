import React, { useEffect, useState, useContext, useRef } from 'react';
import './Historique.css';
import { ContextChargement } from '../../Context/Chargement';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import Modal from 'react-modal';
import { Toaster, toast } from "react-hot-toast";
import { useSpring, animated } from 'react-spring';

const customStyles2 = {
    content: {
        top: '30%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#fa222a',
      },
};

const customStyles1 = {
    content: {
      top: '25%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '40vw',
      borderRadius: '10px',
    },
};

export default function Historique(props) {

    const props1 = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });
    const {chargement, stopChargement, startChargement, darkLight} = useContext(ContextChargement);
    Modal.defaultStyles.overlay.backgroundColor = '#18202ed3';

    let date_filtre = useRef();
    const date_e = new Date('2023-12-15');
    const date_j = new Date();

    const [listeHistorique, setListeHistorique] = useState([]);
    const [listeSauvegarde, setListeSauvegarde] = useState([]);
    const [medocSelectionne, setMedocSelectionne] = useState(false);
    const [medocSelectionneSauvegarde, setMedocSelectionneSauvegarde] = useState(false);
    const [qteEntre, setQteEntre] = useState(0);
    const [qteSortie, SetQteSortie] = useState(0);
    const [designation, setDesignation] = useState('');
    const [stockSorti, setStockSorti] = useState(false);
    const [stockRestant, setStockRestant] = useState(false);
    const [datePeremption, setDatePeremtion] = useState(false);
    const [dateApprov, setDateApprov] = useState(false);
    const [dateAffiche, setDateAffiche] = useState('');
    const [alerteStock, setAlerteStock] = useState('');
    const [modalReussi, setModalReussi] = useState(false);
    const [non_paye, setNonPaye] = useState(false);
    const [ecart, setEcart] = useState(0);
    const [stockPhy, setStockPhy] = useState('');
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [state, setState] = useState(false);
    const [messageErreur, setMessageErreur] = useState('');

    useEffect(() => {
        startChargement();
        if (date_j.getTime() <= date_e.getTime()) {
            // Récupération de la liste de produits
            const req = new XMLHttpRequest();
            req.open('GET', 'http://serveur/backend-cmab/recuperer_historique.php');

            req.addEventListener('load', () => {
                const result = JSON.parse(req.responseText);
                setListeHistorique(result);
                setListeSauvegarde(result);
                stopChargement();
            });

            req.send();

            req.addEventListener("error", function () {
                // La requête n'a pas réussi à atteindre le serveur
                setMessageErreur('Erreur réseau');
            });
        } else {
            setTimeout(() => {
                props.setConnecter(false);
                props.setOnglet(1);
            }, 10000);
        }

    }, [state]);

    useEffect(() => {

        if (parseInt(stockPhy) > 0 && parseInt(stockPhy) !== parseInt(stockRestant)) {
            const data = new FormData();

            data.append('id_prod', medocSelectionne[0].id);
            data.append('designation', designation);
            data.append('par', props.nomConnecte);
            data.append('qte_dispo', stockPhy);
            data.append('pu_vente', medocSelectionne[0].pu_vente);

            const req = new XMLHttpRequest();
            req.open('POST', 'http://serveur/backend-cmab/gestion_stock.php?rem=inventaire');
    
            req.addEventListener('load', () => {
                fermerModalConfirmation();
                setMedocSelectionne(false);
                setState(!state);
            });

            req.addEventListener("error", function () {
                // La requête n'a pas réussi à atteindre le serveur
                setMessageErreur('Erreur réseau');
            });
    
            req.send(data);
        }
    }, [stockPhy]);

    useEffect(() => {
        if (medocSelectionne && medocSelectionneSauvegarde) {
            if (non_paye) {
                const d = dateApprov ? new Date(dateApprov) : new Date();
                setMedocSelectionne(medocSelectionneSauvegarde.filter(item => (item.date_heure.indexOf(d.toLocaleDateString()) !== -1)));
                setDateAffiche(d.toLocaleDateString());
            } else {
                setMedocSelectionne(medocSelectionneSauvegarde);
            }
        }
    }, [non_paye, dateApprov, medocSelectionneSauvegarde]);

    useEffect(() => {
        if (medocSelectionne && medocSelectionneSauvegarde) {
            let Tentre=0, Tsortie=0;
            medocSelectionne.forEach(item => {
                Tentre += parseInt(item.qte_entre);
                Tsortie += parseInt(item.qte_sortie);
            });

            setQteEntre(Tentre);
            SetQteSortie(Tsortie);
        }
    }, [medocSelectionne]);

    const filtrerListe = (e) => {
        const medocFilter = listeSauvegarde.filter(item => (item.designation.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1 || item.id === e.target.value));
        setListeHistorique(medocFilter);
    }

    const trierAffichage = (e) => {
        if (e.target.value === "tout") {
            setListeHistorique(listeSauvegarde);
        } else {
            setListeHistorique(listeSauvegarde.filter(item => (item.genre.toLowerCase() == e.target.value)));
        }
    }

    const afficherHistorique = (e) => {
        setDateApprov(false);
        const medocSelectionne = listeHistorique.filter(item => (item.id == e.target.value));

        if (parseInt(medocSelectionne[0].en_stock) === 0) {
            var msgAlerteStock = 'le stock de ' + medocSelectionne[0].designation + ' est épuisé ! Pensez à vous approvisionner';
            toastAlerteStock(msgAlerteStock, '#dd4c47');
        } else if (parseInt(medocSelectionne[0].en_stock) <= parseInt(medocSelectionne[0].min_rec)) {
            var msgAlerteStock = medocSelectionne[0].designation + ' bientôt en rupture de stock ! Pensez à vous approvisionner';
            toastAlerteStock(msgAlerteStock, '#FFB900');
        }

        setStockRestant(medocSelectionne[0].en_stock);
        setDatePeremtion(medocSelectionne[0].date_peremption);

        const data1 = new FormData();
        data1.append('id', medocSelectionne[0].id);

        const req1 = new XMLHttpRequest();
        req1.open('POST', 'http://serveur/backend-cmab/gestion_stock.php');
        req1.addEventListener('load', () => {
            if (req1.status >= 200 && req1.status < 400) {
                const result = JSON.parse(req1.responseText);
                setMedocSelectionne(result);
                setMedocSelectionneSauvegarde(result);
                setNonPaye(true);
                setDesignation(medocSelectionne[0].designation);
            } else {
                console.error(req1.status + " " + req1.statusText);
            }
        });

        req1.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req1.send(data1);
    }

    const handleChange = (e) => {
        if (stockRestant) {
            let valeur = parseInt(e.target.value.trim());
            setEcart(valeur - parseInt(stockRestant));
        }
    }

    const mois = (str) => {

        switch(parseInt(str.substring(3, 5))) {
            case 1:
                return str.substring(0, 2) + " janvier " + str.substring(6, 10);
            case 2:
                return str.substring(0, 2) + " fevrier " + str.substring(6, 10);
            case 3:
                return str.substring(0, 2) + " mars " + str.substring(6, 10);
            case 4:
                return str.substring(0, 2) + " avril " +  str.substring(6, 10);
            case 5:
                return str.substring(0, 2) + " mai " + str.substring(6, 10);
            case 6:
                return str.substring(0, 2) + " juin " + str.substring(6, 10);
            case 7:
                return str.substring(0, 2) + " juillet " + str.substring(6, 10);
            case 8:
                return str.substring(0, 2) + " août " + str.substring(6, 10);
            case 9:
                return str.substring(0, 2) + " septembre " + str.substring(6, 10);
            case 10:
                return str.substring(0, 2) + " octobre " + str.substring(6, 10);
            case 11:
                return str.substring(0, 2) + " novembre " + str.substring(6, 10);
            case 12:
                return str.substring(0, 2) + " décembre " + str.substring(6, 10);
        }
    }

    const afterModal = () => {
        customStyles1.content.color = darkLight ? '#fff' : '#000';
        customStyles1.content.background = darkLight ? '#18202e' : '#fff';
    }

    const fermerModalReussi = () => {
        setModalReussi(false);
    }

    const fermerModalConfirmation = () => {
        setModalConfirmation(false);
        setEcart(0);
        setStockPhy(0);
    }

    const toastAlerteStock = (msg, bg) => {
        toast.error(msg, {
            style: {
                fontWeight: 'bold',
                fontSize: '18px',
                color: '#fff',
                backgroundColor: bg,
                letterSpacing: '1px',
            },
            
        });
    }

    return (
        <animated.div style={props1}>
        <div><Toaster/></div>
        <section className="historique">
            <Modal
                isOpen={modalReussi}
                style={customStyles2}
                onRequestClose={fermerModalReussi}
            >
                <h2 style={{color: '#fff'}}>{alerteStock}</h2>
                <button style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '15px', fontSize: 'large'}} onClick={fermerModalReussi}>Fermer</button>
            </Modal>
            <Modal
                isOpen={modalConfirmation}
                onRequestClose={fermerModalConfirmation}
                style={customStyles1}
                contentLabel="validation commande"
            >
                <h2 style={{textAlign: 'center', marginBottom: '10px'}}>Correction du stock</h2>
                <div style={{lineHeight: '22px'}}>
                    <div style={{textAlign: 'center'}} className='modal-button'>
                        <label htmlFor="">Stock théorique: </label>
                        <strong>{stockRestant && stockRestant}</strong>
                    </div>
                    <div style={{textAlign: 'center'}} className='modal-button'>
                        <label htmlFor="">Stock réel : </label>
                        <input type="text" style={{width: '75px'}} id="" onChange={handleChange} />
                    </div>
                    <div style={{display: `${ecart > 0 || ecart < 0 ? 'block' : 'none'}`, textAlign: 'center'}}>
                        <label htmlFor="">Ecart : </label>
                        <strong style={{color: '#ffca18'}}>{ecart > 0 ?  '+' + ecart : ecart}</strong>
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <button className='bootstrap-btn' style={{cursor: 'pointer', width: '180px'}} onClick={() => setStockPhy(parseInt(stockRestant) + ecart)}>Enregistrer</button>
                    </div>
                </div>
            </Modal>
            <h1>Inventaires des produits</h1>
            <div className='erreur-message'>{messageErreur}</div>
            <div className="container-historique">
                <div className="medocs-sortis">
                    <p className="search-zone">
                        <input type="text" placeholder="recherchez un produit" onChange={filtrerListe} />
                    </p>
                    <p>afficher: &nbsp;
                        <select name="genre" id="" onChange={trierAffichage}>
                            <option value="tout">tout</option>
                            <option value="generique">générique</option>
                            <option value="sp">spécialité</option>
                        </select>
                    </p>
                    <h1>Produits</h1>
                    <ul>
                        {chargement ? <div className="loader"><Loader type="Circles" color="#0e771a" height={100} width={100}/></div> : listeHistorique.map(item => (
                            <li value={item.id} key={item.id} onClick={afficherHistorique} style={{color: `${parseInt(item.en_stock) < parseInt(item.min_rec) ? '#dd4c47' : ''}`}}>{item.designation.toLowerCase() + ' (' + item.en_stock + ')'}</li>
                            ))}
                    </ul>
                </div>
                <div className="table-commandes">
                    <div className="entete-historique">Désignation: <span style={{fontWeight: '600'}}>{designation}</span></div>
                    <div className="entete-historique">Stock Disponible : <span style={{fontWeight: '600'}}>{stockRestant && stockRestant}</span></div>
                    <div className="entete-historique">Date péremption : <span style={{fontWeight: '600'}}>{datePeremption && datePeremption}</span></div>
                    <div className="entete-historique" style={{display: 'none'}}>
                        <label htmlFor="filtre">Filtrer : </label>
                        <input type="checkbox" id="filtre" checked={non_paye} onChange={(e) => setNonPaye(!non_paye)} />
                    </div>
                    <div className="entete-historique">
                        <button className='bootstrap-btn' onClick={() => {setModalConfirmation(true); afterModal();}}>Modifier</button>
                    </div>
                    <div className="entete-historique" style={{display: `${non_paye ? 'block' : 'none'}`}}>
                        <label htmlFor="">Date : </label>
                        <input type="date" id="" ref={date_filtre} onChange={(e) => setDateApprov(e.target.value)} />
                    </div>
                    <div className="entete-historique">
                        Listing du : <span style={{fontWeight: '600'}}>{mois(dateAffiche)}</span>
                    </div>
                    <div className="entete-historique">
                        Total entrées : <span style={{fontWeight: '600'}}>{qteEntre}</span>
                    </div>
                    <div className="entete-historique">
                        Total sorties : <span style={{fontWeight: '600'}}>{qteSortie}</span>
                    </div>
                    <h1>Mouvements</h1>
                    <table>
                        <thead>
                            <tr>
                                <td>Le</td>
                                <td>À</td>
                                <td>Par</td>
                                <td>Entrée</td>
                                <td>Sortie</td>
                                <td>Dispo</td>
                                <td>Note</td>
                            </tr>
                        </thead>
                        <tbody>
                            {medocSelectionne ? medocSelectionne.map(item => (
                                <tr key={item.id_table}>
                                    <td>{mois(item.date_heure.substring(0, 10))}</td>
                                    <td>{item.date_heure.substring(11)}</td>
                                    <td>{item.par.toUpperCase()}</td>
                                    <td>{item.qte_entre}</td>
                                    <td>{item.qte_sortie}</td>
                                    <td>{item.qte_dispo}</td>
                                    <td>{item.remarque}</td>
                                </tr>
                            )) : null}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
        </animated.div>
    )
}

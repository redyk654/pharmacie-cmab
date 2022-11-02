import React, { useState, useEffect, useContext, useRef, Fragment } from 'react';
import './Commande.css';
import DetailsMedoc from './DetailsMedoc';
import AfficherProd from '../AfficherProd/AfficherProd';
import { ContextChargement } from '../../Context/Chargement';

// Importation des librairies installées
import Modal from 'react-modal';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import ReactToPrint from 'react-to-print';
import Facture from '../Facture/Facture';
// Styles pour las fenêtres modales
const customStyles1 = {
    content: {
      top: '15%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#0e771a',
    },
};

const customStyles2 = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#0e771a',
      },
};

const customStyles3 = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#fa222a',
      },
};

const customStyles4 = {
    content: {
      top: '40%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#0e771a',
      width: '400px',
      height: '75vh'
    }, 
};

const stylePatient = {
    marginTop: '5px',
    height: '50vh',
    border: '1px solid gray',
    overflow: 'auto',
    position: 'relative',
    backgroundColor: '#fff'
}

export default function Commande(props) {

    const componentRef = useRef();
    const elt = useRef();
    const elt2 = useRef();
    const refPatient= useRef();
    const assuranceDefaut = 'aucune';
    const {chargement, stopChargement, startChargement} = useContext(ContextChargement);
    let interval = null;

    const date_e = new Date('2022-12-15');
    const date_j = new Date();

    const [listeMedoc, setListeMedoc] = useState([]);
    const [listeMedocSauvegarde, setListeMedocSauvegarde] = useState([]);
    const [qteDesire, setQteDesire] = useState('');
    const [medocSelect, setMedoSelect] = useState(false);
    const [medocCommandes, setMedocCommandes] = useState([]);
    const [qtePrixTotal, setQtePrixTotal] = useState({});
    const[actualiserQte, setActualiserQte] = useState(false);
    const [messageErreur, setMessageErreur] = useState('');
    const [verse, setverse] = useState('');
    const [montantVerse, setmontantVerse] = useState(0);
    const [relicat, setrelicat] = useState(0);
    const [resteaPayer, setresteaPayer] = useState(0);
    const [idFacture, setidFacture] = useState('');
    const [alerteStock, setAlerteStock] = useState('');
    const [modalAlerte, setModalAlerte] = useState(false);
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [modalReussi, setModalReussi] = useState(false);
    const [statePourRerender, setStatePourRerender] = useState(true);
    const [patient, setpatient] = useState('');
    const [nomPatient, setNomPatient] = useState(false);
    const [clientSelect, setClientSelect] = useState([]);
    const [listePatient, setlistePatient] = useState([]);
    const [listePatientSauvegarde, setlistePatientSauvegarde] = useState([]);
    const [modalPatient, setModalPatient] = useState(false);
    const [assurance, setAssurance] = useState(assuranceDefaut);
    const [typeAssurance, setTypeAssurance] = useState(0);
    const [statu, setStatu] = useState('done');
    const [rafraichir, setRafraichir] = useState(false);

    useEffect(() => {
        startChargement();
        // Récupération des médicaments dans la base via une requête Ajax
        if (date_j.getTime() <= date_e.getTime()) {
            fetchProduits();
        } else {
            setTimeout(() => {
                props.setConnecter(false);
                props.setOnglet(1);
            }, 10000);
        }
    }, [rafraichir]);

    useEffect(() => {
        /* Hook exécuter lors de la mise à jour de la liste de médicaments commandés,
           L'exécution du hook va permettre d'actualier les prix et les quantités
        */

        /*
         ***IMPORTANT*** : Il y a un bug non résolu qui fais que lors de la suppression d'un médicament de la liste des commandes,
         les prix et quantités ne sont pas mis à jour correctement
         */
        if (medocSelect) {
            let qteTotal = 0, prixTotal = 0;
            medocCommandes.map(item => {
                if(item.designation != medocSelect[0].designation) {
                    qteTotal += parseInt(item.qte_commander);
                    prixTotal += item.prix;
                }
            });
            
            qteTotal += parseInt(medocSelect[0].qte_commander);
            prixTotal += medocSelect[0].prix;
            
            Object.defineProperty(qtePrixTotal, 'qte_total', {
                value: qteTotal,
                configurable: true,
                enumerable: true
            });
            
            Object.defineProperty(qtePrixTotal, 'prix_total', {
                value: prixTotal,
                configurable: true,
                enumerable: true
            });

            Object.defineProperty(qtePrixTotal, 'a_payer', {
                value: prixTotal * ((100 - typeAssurance) / 100),
                configurable: true,
                enumerable: true,
            });

            setStatePourRerender(!statePourRerender); // état modifié pour rerendre le composant
        }

    }, [medocCommandes]);

    useEffect(() => {
        // Pour mettre à jour le relicat et le reste à payer
        if (medocCommandes.length > 0) {
            if (montantVerse >= parseInt(qtePrixTotal.a_payer)) {
                setrelicat(montantVerse - parseInt(qtePrixTotal.a_payer));
                setresteaPayer(0);
            } else {
                if (montantVerse < parseInt(qtePrixTotal.a_payer)) {
                    setresteaPayer(parseInt(qtePrixTotal.a_payer) - montantVerse);
                    setrelicat(0);
                }
            }
        } else {
            setresteaPayer(0);
        }

        
    }, [montantVerse, medocCommandes, assurance, nomPatient]);

    useEffect(() => {
        if(assurance.toLowerCase() !== assuranceDefaut) {
            if(parseInt(qtePrixTotal.a_payer)) {
                Object.defineProperty(qtePrixTotal, 'a_payer', {
                    value: (parseInt(qtePrixTotal.prix_total) * (100 - typeAssurance)) / 100,
                    configurable: true,
                    enumerable: true,
                });
    
            }
        }
        setStatePourRerender(!statePourRerender);
    }, [assurance]);

    const fetchProduits = () => {
        // Récupération des médicaments dans la base via une requête Ajax
        const req = new XMLHttpRequest();
        req.open('GET', 'http://serveur/backend-cma/recuperer_medoc.php');
        req.addEventListener("load", () => {
            if (req.status >= 200 && req.status < 400) { // Le serveur a réussi à traiter la requête
                setMessageErreur('');
                const result = JSON.parse(req.responseText);

                // Mise à jour de la liste de médicament et sauvegarde de la même liste pour la gestion du filtrage de médicament
                setListeMedoc(result);
                setListeMedocSauvegarde(result);
                stopChargement();

            } else {
                // Affichage des informations sur l'échec du traitement de la requête
                console.error(req.status + " " + req.statusText);
            }
        });
        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req.send();
    } 

    // permet de récolter les informations sur le médicament sélectioné
    const afficherInfos = (e) => {
        const medocSelectionne = listeMedoc.filter(item => (item.id == e.target.value));
        setMedoSelect(medocSelectionne);
        if (parseInt(medocSelectionne[0].en_stock) === 0) {
            setAlerteStock('le stock de ' + medocSelectionne[0].designation + ' est épuisé ! Pensez à vous approvisionner');
            setModalAlerte(true);
        } else if (parseInt(medocSelectionne[0].en_stock) < parseInt(medocSelectionne[0].min_rec)) {
            setAlerteStock('Vous serez bientôt à cour de ' + medocSelectionne[0].designation + ' ! Pensez à vous approvisionner');
            setModalAlerte(true);
        }
    }

    // Filtrage de la liste de médicaments affichés lors de la recherche d'un médicament
    const filtrerListe = (e) => {
        const medocFilter = listeMedocSauvegarde.filter(item => (item.designation.toLowerCase().indexOf(e.target.value.trim().toLowerCase()) !== -1))
        setListeMedoc(medocFilter);
    }

    // Enregistrement d'un médicament dans la commande
    const ajouterMedoc = () => {
        /* 
            - Mise à jour de la quantité du médicament commandé dans la liste des commandes
            - Mise à jour du prix total du médicament commandé

            - Mise à jour du nombre total de médicaments commandés
            - Mise à jour de la quantité total des médicaments commandés
            - Mise à jour du prix total de la commande
        */

        if (qteDesire && !isNaN(qteDesire) && medocSelect) {

            if (parseInt(qteDesire) > medocSelect[0].en_stock) {
                setMessageErreur('La quantité commandé ne peut pas être supérieure au stock')
            } else if (medocSelect[0].en_stock == 0) {
                setMessageErreur('Le stock de ' + medocSelect[0].designation + ' est épuisé')
            } else {
                setMessageErreur('');
                Object.defineProperty(medocSelect[0], 'qte_commander', {
                    value: qteDesire,
                    configurable: true,
                    enumerable: true
                });
                
                Object.defineProperty(medocSelect[0], 'prix', {
                    value: parseInt(medocSelect[0].pu_vente) * parseInt(qteDesire),
                    configurable: true,
                    enumerable: true
                });
                
                // Utilisation d'une variable intermédiare pour empêcher les doublons dans les commandes
                let varIntermediaire = medocCommandes.filter(item => (item.designation !== medocSelect[0].designation));
                setMedocCommandes([...varIntermediaire, medocSelect[0]]);
                
                setQteDesire('');
                document.querySelector('.recherche').value = "";
                document.querySelector('.recherche').focus();
            }
        } else {
            setMessageErreur("La quantité désiré est manquante ou n'est pas un nombre")
        }

    }

    const handleClick = (e) => {
        if (medocCommandes.length > 0) {
            setmontantVerse(verse);
            setverse('');
        }
    }

    const removeMedoc = (id) => {

        /**
         * Fonctionnalité abandonné à cause d'un bug: c'était pour retirer
         * un médicament de la liste des médicaments commandés
         */
        const varIntermediaire = medocCommandes.filter(item => (item.id !== id));
        setMedocCommandes([...varIntermediaire]);
    }

    const annulerCommande = () => {
        setMedocCommandes([]);
        setQtePrixTotal({});
        setmontantVerse('')
        setrelicat(0);
        setMessageErreur('');
        setMedoSelect(false);
        setverse('');
        setNomPatient(false);
        setAssurance(assuranceDefaut);
        setTypeAssurance(0);
        setClientSelect([]);
        document.querySelector('.recherche').value = "";
    }

    const sauvegarder = () => {
        const req = new XMLHttpRequest();
        req.open('POST', 'http://serveur/backend-cma/backup.php');
        req.send();

        req.addEventListener('load', () => {
            setMessageErreur('');
        })

        // req.addEventListener("error", function () {
        //     // La requête n'a pas réussi à atteindre le serveur
        //     setMessageErreur('Erreur réseau');
        // });
    }

    const idUnique = () => {
        // Création d'un identifiant unique pour la facture
        return Math.floor((1 + Math.random()) * 0x10000000000)
               .toString(16)
               .substring(1) + qtePrixTotal.prix_total;
    }

    const enregisterFacture = (id) => {

        // Enregistrement de la facture


        const data = new FormData();

        data.append('id', id);
        data.append('vendeur', props.nomConnecte);
        data.append('prix_total', qtePrixTotal.prix_total);
        data.append('patient', nomPatient);
        data.append('a_payer', qtePrixTotal.a_payer);
        data.append('montant_verse', montantVerse);
        data.append('relicat', relicat);
        data.append('reste_a_payer', resteaPayer);
        data.append('assurance', assurance);
        data.append('type_assurance', typeAssurance);
        data.append('statu', statu);

        const req = new XMLHttpRequest();
        req.open('POST', 'http://serveur/backend-cma/factures_pharmacie.php');

        req.addEventListener('load', () => {
            setMedoSelect(false);
            setMessageErreur('');
            // Activation de la fenêtre modale qui indique la réussite de la commmande
            setModalReussi(true);
            // Désactivation de la fenêtre modale de confirmation
            setModalConfirmation(false);
            annulerCommande();
        });

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req.send(data);

    }

    // const enregistrerAssurance = (data) => {
    //     data.append('catego', 'pharmacie');

    //     const req = new XMLHttpRequest();
    //     req.open('POST', 'http://serveur/backend-cma/data_assurance.php');

    //     req.send(data);

    //     req.addEventListener("load", function () {
    //         // La requête n'a pas réussi à atteindre le serveur
    //         setMessageErreur('');
    //     });

    //     req.addEventListener("error", function () {
    //         // La requête n'a pas réussi à atteindre le serveur
    //         setMessageErreur('Erreur réseau');
    //     });
    // }

    const validerCommande = () => {

        enregisterPatient();

        /* 
            Organisation des données qui seront envoyés au serveur :
                - pour la mise à jour des stocks de médicaments
                - pour la mise à jour de l'historique des ventes
        */
        
        if(medocCommandes.length > 0) {

            // document.querySelector('.valider').disabled = true;
            // console.log(elt.current.disabled);
            elt.current.disabled = true;
            elt2.current.disabled = true;

            
            medocCommandes.map(item => {
                item.stock_restant = parseInt(item.en_stock) - parseInt(item.qte_commander);
            });

            const id = idUnique();
            setidFacture(id);

            let i = 0;
            medocCommandes.map(item => {

                const data2 = new FormData();
                data2.append('code', item.code);
                data2.append('designation', item.designation);
                data2.append('id_prod', item.id);
                data2.append('id_facture', id);
                data2.append('categorie', item.categorie);
                data2.append('genre', item.genre);
                data2.append('date_peremption', item.date_peremption);
                data2.append('quantite', item.qte_commander);
                data2.append('prix_total', item.prix);
                data2.append('nom_vendeur', props.nomConnecte);
                data2.append('status_vente', 'non payé');
                data2.append('patient', nomPatient);
                // assurance !== assuranceDefaut && enregistrerAssurance(data2);

                // Envoi des données
                const req2 = new XMLHttpRequest();
                req2.open('POST', 'http://serveur/backend-cma/maj_historique.php');
                
                // Une fois la requête charger on vide tout les états
                req2.addEventListener('load', () => {
                    if (req2.status >= 200 && req2.status < 400) {
                        setMessageErreur('');
                        listeMedocSauvegarde.map(item2 => {
                            if (item2.id == item.id) {
                                Object.defineProperty(item2, 'en_stock', {
                                    value: parseInt(item.en_stock) - parseInt(item.qte_commander),
                                    configurable: true,
                                    enumerable: true,
                                });
                            }
                        });
                        i++;
                        if (i === medocCommandes.length) {
                            enregisterFacture(id);
                        }
                    }
                });

                req2.addEventListener("error", function () {
                    // La requête n'a pas réussi à atteindre le serveur
                    setMessageErreur('Erreur réseau');
                });
                req2.send(data2);
            });
        }
    }

    const contenuModal = () => {
            return (
            <Fragment>
                <h2 style={{color: '#fff'}}>informations du patient</h2>
                <div className="detail-item">
                    <div style={{display: 'flex', flexDirection: 'column' , width: '100%', marginTop: 10, color: '#f1f1f1'}}>
                        <label htmlFor="" style={{display: 'block',}}>Nom et prénom</label>
                        <div>
                            <input ref={refPatient} type="text" name="qteDesire" style={{width: '250px', height: '4vh'}} value={patient} onChange={filtrerPatient} autoComplete='off' />
                            <button style={{cursor: 'pointer', width: '45px', height: '4vh', marginLeft: '5px'}} onClick={ajouterPatient}>OK</button>
                        </div>
                        {
                            clientSelect.length > 0 && (
                                <div style={{marginTop: '10px', lineHeight: '25px', display: `${clientSelect[0].nomAssurance === assuranceDefaut ? 'none' : 'block'}`}}>
                                    <div>assurance <strong>{clientSelect[0].nomAssurance}</strong></div>
                                    <div>pourcentage <strong>{clientSelect[0].type_assurance}</strong></div>
                                </div>
                            )
                        }
                        <div style={{marginTop: '10px'}}>
                            <h2>Liste des patients</h2>
                            <ul style={stylePatient}>
                                {listePatient.length > 0 && listePatient.map(item => (
                                    <li style={{padding: '6px', color: '#0e771a', cursor: 'pointer', fontWeight: 'bold'}} onClick={(e) => selectionnePatient(e, item.assurance, item.type_assurance)} id={item.nom}>{item.nom.toUpperCase()}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }

    const infosPatient = () => {

        // Affiche la fenêtre des informations du patient
        setModalPatient(true);

        const req = new XMLHttpRequest();
        req.open('GET', 'http://serveur/backend-cma/gestion_patients.php');

        req.addEventListener('load', () => {
            refPatient.current.focus();
            setMessageErreur('');
            const result = JSON.parse(req.responseText);
            setlistePatient(result);
            setlistePatientSauvegarde(result);
        })

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });
        req.send();

    }

    const filtrerPatient = (e) => {
        setpatient(e.target.value);

        const req = new XMLHttpRequest();

        req.open('GET', `http://serveur/backend-cma/rechercher_patient.php?str=${e.target.value}`);

        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                const result = JSON.parse(req.responseText);

                setlistePatient(result);
                setlistePatientSauvegarde(result);
            }
            
        });

        req.send();
    }

    const ajouterPatient = () => {
        setNomPatient(patient.trim());
        setpatient('');

        if(assurance.toLowerCase() !== assuranceDefaut) {
            if(parseInt(qtePrixTotal.a_payer)) {
                Object.defineProperty(qtePrixTotal, 'a_payer', {
                    value: (parseInt(qtePrixTotal.prix_total) * (100 - typeAssurance)) / 100,
                    configurable: true,
                    enumerable: true,
                });
            }
            setStatu('pending');
        } else {
            setStatu('done');
        }

        setStatePourRerender(!statePourRerender);
        fermerModalPatient();
        enregisterPatient();
        setMessageErreur('');
    }

    const enregisterPatient = () => {
        // On enregistre le patient dans la base de donnés s'il n'y est pas encore
        if (nomPatient) {

            const patient = listePatientSauvegarde.filter(item => (item.nom.toLowerCase().indexOf(nomPatient.toLowerCase()) !== -1));
            if(patient.length === 0) {
                const data = new FormData();
                data.append('nom_patient', nomPatient);
                data.append('assurance', assuranceDefaut);
                data.append('type_assurance', 0);
                
                const req = new XMLHttpRequest();
                req.open('POST', 'http://serveur/backend-cma/gestion_patients.php');

                req.addEventListener("load", function () {
                    // La requête n'a pas réussi à atteindre le serveur
                    setMessageErreur('');
                });

                req.addEventListener("error", function () {
                    // La requête n'a pas réussi à atteindre le serveur
                    setMessageErreur('Erreur réseau');
                });
    
                req.send(data);
            }
        }
    }

    const selectionnePatient = (e, nomAssurance, type_assurance) => {
        setpatient(e.target.id);
        setClientSelect([{nomAssurance: nomAssurance, type_assurance: type_assurance}])
        setAssurance(nomAssurance);
        setTypeAssurance(type_assurance);
    }

    const fermerModalPatient = () => {
        setModalPatient(false);
        setpatient('');
    }
  
    const fermerModalConfirmation = () => {
      setModalConfirmation(false);
    }

    const fermerModalReussi = () => {
        setModalReussi(false);
        sauvegarder();
        setMedocCommandes([]);
        annulerCommande();
    }

    const fermModalAlerte = () => {
        setModalAlerte(false);
    }

    return (
        <section className="commande">
            <Modal
                isOpen={modalPatient}
                style={customStyles4}
                contentLabel="information du patient"
                ariaHideApp={false}
                onRequestClose={fermerModalPatient}
            >
                {contenuModal()}
            </Modal>
            <Modal
                isOpen={modalAlerte}
                style={customStyles3}
                onRequestClose={fermModalAlerte}
            >
                <h2 style={{color: '#fff'}}>{alerteStock}</h2>
                <button style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '15px', fontSize: 'large'}} onClick={fermModalAlerte}>Fermer</button>
            </Modal>
            <Modal
                isOpen={modalConfirmation}
                style={customStyles1}
                contentLabel="validation commande"
            >
                <h2 style={{color: '#fff'}}>êtes-vous sûr de vouloir valider la vente ?</h2>
                <div style={{textAlign: 'center'}} className='modal-button'>
                    <button ref={elt2}  style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '10px'}} onClick={fermerModalConfirmation}>Annuler</button>
                    <button ref={elt} className="valider" style={{width: '20%', height: '5vh', cursor: 'pointer'}} onClick={validerCommande}>Confirmer</button>
                </div>
            </Modal>
            <Modal
                isOpen={modalReussi}
                style={customStyles2}
                contentLabel="Commande réussie"
                onRequestClose={fermerModalReussi}
            >
                <h2 style={{color: '#fff'}}>La vente a bien été enregistré !</h2>
                <button style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '15px', fontSize: 'large'}} onClick={fermerModalReussi}>Fermer</button>
            </Modal>
            <div className="left-side">

                <p className="search-zone">
                    <input type="text" placeholder="recherchez un produit" className="recherche" onChange={filtrerListe} />
                </p>
                <p>
                    {/* <button className="rafraichir" onClick={() => {setRafraichir(!rafraichir)}}>rafraichir</button> */}
                </p>
                <div className="liste-medoc">
                    <h1>Liste de produits</h1>
                    <ul>
                        {chargement ? <div className="loader"><Loader type="Circles" color="#0e771a" height={100} width={100}/></div> : listeMedoc.map(item => (
                            <li value={item.id} key={item.id} onClick={afficherInfos} style={{color: `${parseInt(item.en_stock) < parseInt(item.min_rec) ? 'red' : ''}`}}>{item.designation.toLowerCase()}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="right-side">
                <h1>{medocSelect ? "Détails du produit" : "Selectionnez un produit pour voir les détails"}</h1>

                <div className="infos-medoc">
                    {medocSelect && medocSelect.map(item => (
                    <AfficherProd
                        key={item.id}
                        code={item.code}
                        designation={item.designation}
                        pu_vente={item.pu_vente}
                        en_stock={item.en_stock}
                        min_rec={item.min_rec}
                        categorie={item.categorie}
                        conditionnement={item.conditionnement}
                        date_peremption={item.date_peremption}
                        />
                    ))}
                </div>
                <div className="box">
                    <div className="detail-item">
                        <input type="text" name="qteDesire" value={qteDesire} onChange={(e) => {setQteDesire(e.target.value)}} autoComplete='off' />
                        <button onClick={ajouterMedoc}>ajouter</button>
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <button style={{backgroundColor: '#6d6f94', width: '30%'}} onClick={infosPatient}>Infos du patient</button>
                    </div>
                    <div style={{textAlign: 'center'}}>
                        {nomPatient ? (
                            <div>
                                Patient: <span style={{color: '#0e771a', fontWeight: '700'}}>{nomPatient.toLocaleUpperCase()}</span>
                            </div>
                        ) : null}
                        {assurance !== assuranceDefaut ? (
                            <div style={{}}>
                                Couvert par: <span style={{color: '#0e771a', fontWeight: '700'}}>{assurance.toLocaleUpperCase()}</span>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className='erreur-message'>{messageErreur}</div>

                <div className="details-commande">
                    <h1>Vente en cours</h1>

                    <table>
                        <thead>
                            <tr>
                                <td>Produits</td>
                                <td>Quantités</td>
                                <td>Pu</td>
                                <td>Total</td>
                            </tr>
                        </thead>
                        <tbody>
                            {medocCommandes.map(item => (
                                <tr key={item.id} style={{fontWeight: '600'}}>
                                    <td>{item.designation}</td>
                                    <td style={{color: `${parseInt(item.en_stock) < parseInt(item.qte_commander) ? 'red' : ''}`}}>{item.qte_commander}</td>
                                    <td>{item.pu_vente + ' Fcfa'}</td>
                                    <td>{item.prix + ' Fcfa' }</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="valider-annuler">

                        <div className="totaux">
                            Produits : <span style={{color: "#0e771a", fontWeight: "600"}}>{medocCommandes.length}</span>
                        </div>
                        <div className="totaux">
                            Prix total : <span style={{color: "#0e771a", fontWeight: "600"}}>{medocCommandes.length > 0 ? qtePrixTotal.prix_total + ' Fcfa': 0 + ' Fcfa'}</span>
                        </div>
                        <div>
                            Net à payer : <span style={{color: "#0e771a", fontWeight: "600"}}>{qtePrixTotal.a_payer ? qtePrixTotal.a_payer + ' Fcfa': 0 + ' Fcfa'}</span>
                        </div>
                        <button onClick={annulerCommande}>Annnuler</button>
                        <button onClick={() => { if(medocCommandes.length > 0 && nomPatient) {setModalConfirmation(true)} else {setMessageErreur("Entrez le nom et le prénom du patient")}}}>Valider</button>

                    </div>
                    <div>
                        <div style={{display: 'none'}}>
                            <Facture 
                            ref={componentRef}
                            medocCommandes={medocCommandes}
                            nomConnecte={props.nomConnecte} 
                            idFacture={idFacture}
                            prixTotal={qtePrixTotal.prix_total}
                            aPayer={qtePrixTotal.a_payer}
                            montantVerse={montantVerse}
                            relicat={relicat}
                            resteaPayer={resteaPayer}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

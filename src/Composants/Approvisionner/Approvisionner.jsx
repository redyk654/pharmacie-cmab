import React, { useState, useEffect, useRef, useContext } from 'react';
import './Approvisionner.css';
import Modal from 'react-modal';
import { useSpring, animated } from 'react-spring';
import EditerProd from './EditerProd';
import { Toaster, toast } from "react-hot-toast";
import Loader from "react-loader-spinner";
import { ContextChargement } from '../../Context/Chargement';


const medocs = {
    code: '',
    designation: '',
    classe: '',
    pu_achat: '',
    pu_vente: '',
    conditionnement: '',
    stock_ajoute: '',
    min_rec: '',
    categorie: '',
    date_peremption: '',
    montant_commande: '',
    genre: 'generique',
}

const customStyles1 = {
    content: {
    //   top: '15%',
    //   left: '50%',
    //   right: 'auto',
    //   bottom: 'auto',
    //   marginRight: '-50%',
    //   transform: 'translate(-50%, -50%)',
    //   background: '#0e771a',
    top: '40%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: '#18202e',
    color: '#fff',
    height: '45vh',
    width: '40vw',
    display: 'flex',
    flexDirection: 'column',
  //   alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '30px',
    border: '1px solid lightgray'
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
        background: '#18202e',
        color: '#fff',
        // fontSize: 'medium',
        height: '70vh',
        width: '78vw',
        // display: 'flex',
        // flexDirection: 'column',
        // alignItems: 'center',
        // justifyContent: 'center',
        borderRadius: '30px',
        lineHeight: '28px',
        border: '1px solid lightgray'
    },
};


export default function Approvisionner(props) {

    const props1 = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });

    const elt = useRef();
    const elt2 = useRef();

    const {darkLight} = useContext(ContextChargement);
    Modal.defaultStyles.overlay.backgroundColor = '#18202ed3';

    const [afficherListe, setAfficherListe] = useState(false)
    const [listeProduit, setListeProduit] = useState([]);
    const [listeSauvegarde, setListeSauvegarde] = useState([]);
    const [produitsCommandes, setProduitsCommandes] = useState([]);
    const [infosMedoc, setInfosMedoc] = useState(medocs);
    const [montantCommande, setMontantCommande] = useState('');
    const [medocsSelectionne, setMedocSelectionne] = useState({});
    const [listeFournisseurs, setListeFournisseurs] = useState([]);
    const [msgErreur, setMsgErreur] = useState('');
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [modalReussi, setModalReussi] = useState(false);
    const [modalNouveauProduit, setModalNouveauProduit] = useState(false);
    const [nvProd, setNvProd] = useState(false);
    const [refecth, setRefetch] = useState(false)
    const [enCours, setEncours] = useState(false);

    
    const {code, designation, classe, pu_achat, pu_vente, conditionnement, stock_ajoute, min_rec, categorie, date_peremption, montant_commande, genre} = infosMedoc;

    useEffect(() => {
        // Récupération de la liste de produits via Ajax
        const req = new XMLHttpRequest();
        req.open('GET', 'http://serveur/backend-cmab/recuperer_medoc.php?stock=filtre');

        req.addEventListener('load', () => {
            const result = JSON.parse(req.responseText);
            setListeProduit(result);
            setListeSauvegarde(result);
            setAfficherListe(true);
        });

        req.send();

    }, [refecth]);


    useEffect(() => {
        // Récupération de la des fournisseurs
        const req = new XMLHttpRequest();
        req.open('GET', 'http://serveur/backend-cmab/recuperer_fournisseurs.php');

        req.addEventListener('load', () => {
            const result = JSON.parse(req.responseText);
            setListeFournisseurs(result);
        });

        req.send();

    }, []);

    const filtrerListe = (e) => {
        const medocFilter = listeSauvegarde.filter(item => (item.designation.toLowerCase().indexOf(e.target.value.trim().toLowerCase()) !== -1));
        setListeProduit(medocFilter);
    }

    const handleChange = (e) => {
        if (e.target.name === "code") {
            setInfosMedoc({...infosMedoc, [e.target.name]: e.target.value.toUpperCase()});
        } else {
            setInfosMedoc({...infosMedoc, [e.target.name]: e.target.value});
        }
    }

    const afficherDetails = (e) => {
        // Afficher les informations du médicament selectionné dans les champs
        const medocSelect = listeProduit.filter(item => (item.id == e.target.value));
        setMedocSelectionne(medocSelect[0]);
        setInfosMedoc(medocSelect[0]);
    }

    const ajouterMedoc = (e) => {
        /**
         * Ajouter un médicament dans la commande
         */
        e.preventDefault();
        const regex = /^\d+-\d+$/;
        if (isNaN(stock_ajoute)) {
                setMsgErreur('veuillez saisir un nombre dans la quantité commandé');
        } else if (designation.length === 0) {
            setMsgErreur('Le produit doit avoir une designation')
        } else {
            if(parseInt(stock_ajoute) > 0) {
                if (!isNaN(pu_vente) && !isNaN(min_rec) && !isNaN(pu_achat)) {

                    setMsgErreur('');
                    const filtrerDoublons = produitsCommandes.filter(item => (item.id != infosMedoc.id));
                    
                    filtrerDoublons.push(infosMedoc);
                    setProduitsCommandes(filtrerDoublons);
                    setInfosMedoc(medocs);
                    document.querySelector('.rechercher').value = "";
                    document.querySelector('.rechercher').focus();
                } else {
                    setMsgErreur("Le prix de vente, le prix d'achat et le stock minimum doivent être des nombres");
                }
            } else {
                setMsgErreur("la quantité commandé n'est pas défini");
            }
        }
    }


    const ajouterNouveauProduit = (e) => {
        e.preventDefault();

        if (isNaN(parseInt(pu_vente)) || isNaN(parseInt(min_rec)) || isNaN(parseInt(pu_achat))) {
            setMsgErreur("Le prix de vente, le prix d'achat et le stock minimum doivent être des nombres");
        } else if (designation.length === 0) {
            setMsgErreur('Le produit doit avoir une designation')
        } else if (classe.length === 0) {
            setMsgErreur('le champ classe ne peut pas être vide')
        } else if (parseInt(pu_vente) === 0) {
            setMsgErreur('Le prix unitaire de vente doit supérieur à 0')
        } else {
            setMsgErreur('');
            const data = new FormData();
            data.append('produit', JSON.stringify(infosMedoc));
    
            const req = new XMLHttpRequest();
    
            req.open('POST', 'http://serveur/backend-cmab/ajouter_produit.php');
                
            req.addEventListener('load', () => {
                setInfosMedoc(medocs);
                setRefetch(!refecth);
                fermerModalNouveauProd();
                toastProduitEnregistrer();
            });
            req.send(data);
        }
    }

    const genererId = () => {
        // Fonction pour générer un identifiant unique pour une commande
        return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1) + montantCommande;

    }

    const mettreAjourStock = () => {
        // Mise à jour stock
        let i = 0;
        produitsCommandes.map(item => {
            // Préparation des données à envoyer au serveur
            const data = new FormData();
            data.append('par', props.nomConnecte);
            data.append('produit', JSON.stringify(item));
            
            const req = new XMLHttpRequest();
            req.open('POST', 'http://serveur/backend-cmab/gestion_stock.php?remarque=livraison');
            
            req.addEventListener('load', () => {
                i++
                if (i === produitsCommandes.length) {
                    setModalConfirmation(false);
                    setRefetch(!refecth);
                    document.querySelector('.rechercher').value = "";
                    setEncours(false);
                    toastApproReussi();
                    setMedocSelectionne({});
                    setProduitsCommandes([]);
                }
            });
            
            req.send(data);
            
        });
    }

    const enregistrerCommande = (idCommande) => {
        // Remplissage de la table d'approvisionnement
        let i = 0;
        produitsCommandes.map(item => {
            
            const data = new FormData();
            data.append('id_commande', idCommande);
            data.append('produit', JSON.stringify(item));

            const req = new XMLHttpRequest();
            req.open('POST', 'http://serveur/backend-cmab/approvisionnement.php');
            
            req.addEventListener('load', () => {
                i++
                if (i === produitsCommandes.length) {
                    mettreAjourStock();
                }
            });
            
            req.send(data);
        })
    }

    const finaliserCommande = () => {
        /**
         * Enregistrement des produits Commandés dans la table des produits
         * Enregistrement du borderau de la commande éffectué
         */
        setMsgErreur('');
        // document.querySelectorAll('.btn-confirmation').forEach(item => {
        //     item.disabled = true;
        // });
        setEncours(true)
        elt.current.disabled = true;
        elt2.current.disabled = true;

        const idCommande = genererId();
        const fournisseur = document.getElementById('fournisseur').value;

        const data = new FormData();
        
        // Données relatives aux informations de la commande
        data.append('id_commande', idCommande);
        data.append('fournisseur', fournisseur);
        data.append('vendeur', props.nomConnecte);
        data.append('montant', montantCommande);
        
        const req = new XMLHttpRequest();
        req.open('POST', 'http://serveur/backend-cmab/approvisionnement.php');
        
        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                enregistrerCommande(idCommande);
            }
        });
        
        req.send(data);
    }

    const fermerModalConfirmation = () => {
        setModalConfirmation(false);
    }

    const fermerModalNouveauProd = () => {
        setModalNouveauProduit(false);
        setNvProd(false);
        setMsgErreur('');
    }

    const ouvrirModalNouveauProd = () => {
        setModalNouveauProduit(true);
        setNvProd(true);
        setMsgErreur('');
        setInfosMedoc(medocs);
    }
  
    const fermerModalReussi = () => {
        setModalReussi(false);
        setMedocSelectionne({});
        setProduitsCommandes([]);
    }

    const afterModal = () => {
        customStyles1.content.color = darkLight ? '#fff' : '#000';
        customStyles1.content.background = darkLight ? '#18202e' : '#fff';
    }

    const toastProduitEnregistrer = () => {
        toast.success("Produit ajouté !", {
            style: {
                fontWeight: 'bold',
                fontSize: '18px',
                backgroundColor: '#fff',
                letterSpacing: '1px'
            },
            
        });
    }

    const toastApproReussi = () => {
        toast.success("Approvisionnement réussi !", {
            style: {
                fontWeight: 'bold',
                fontSize: '18px',
                backgroundColor: '#fff',
                letterSpacing: '1px'
            },
            
        });
    }

    return (
        <animated.div style={props1}>
            <div><Toaster/></div>
            <section className="approvisionner">
                <Modal
                    isOpen={modalConfirmation}
                    style={customStyles1}
                    contentLabel="validation commande"
                >
                <h2 style={{color: `${darkLight ? '#fff' : '#18202e'}`, textAlign: 'center', marginBottom: '30px'}}>Confirmation</h2>
                <p style={{fontWeight: '600', textAlign: 'center', opacity: '.8'}}>
                    Vous allez valider la commande. Etes-vous sûr ?
                </p>
                <div style={{textAlign: 'center', marginTop: '12px'}} className=''>
                    {enCours ? 
                    <Loader type="TailSpin" color="#03ca7e" height={50} width={50}/> 
                        : 
                    <div>
                        <button ref={elt2} className='bootstrap-btn annuler' style={{width: '30%', height: '5vh', cursor: 'pointer', marginRight: '10px', borderRadius: '15px'}} onClick={fermerModalConfirmation}>Annuler</button>
                        <button ref={elt} className="bootstrap-btn valider" style={{width: '30%', height: '5vh', cursor: 'pointer', borderRadius: '15px'}} onClick={finaliserCommande}>Confirmer</button>
                    </div>
                    }
                </div>
                    {/* <h2 style={{color: '#fff'}}>êtes-vous sûr de vouloir valider la commande ?</h2>
                    <div style={{textAlign: 'center'}} className='modal-button'>
                        <button className='btn-confirmation' style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '10px'}} onClick={fermerModalConfirmation}>Annuler</button>
                        <button className='btn-confirmation' style={{width: '20%', height: '5vh', cursor: 'pointer'}} onClick={finaliserCommande}>Confirmer</button>
                    </div> */}
                </Modal>
                <Modal
                    isOpen={modalReussi}
                    onRequestClose={fermerModalReussi}
                    style={customStyles2}
                    contentLabel="Commande réussie"
                >
                    <h2 style={{color: '#fff'}}>La commande a bien été enregistré !</h2>
                    <button style={{width: '10%', height: '5vh', cursor: 'pointer', marginRight: '10px'}} onClick={fermerModalReussi}>OK</button>
                </Modal>
                <Modal
                    isOpen={modalNouveauProduit}
                    onRequestClose={fermerModalNouveauProd}
                    style={customStyles3}
                >
                    <h1 style={{textAlign: 'center'}}>Nouveau Produit</h1>
                    <EditerProd
                        code={code}
                        min_rec={min_rec}
                        designation={designation}
                        classe={classe}
                        categorie={categorie}
                        pu_vente={pu_vente}
                        conditionnement={conditionnement}
                        date_peremption={date_peremption}
                        stock_ajoute={stock_ajoute}
                        pu_achat={pu_achat}
                        handleChange={handleChange}
                        ajouterMedoc={ajouterNouveauProduit}
                        nvProd={nvProd}
                    />
                    <div style={{color: 'red', backgroundColor: '#fff'}}>{msgErreur}</div>
                </Modal>
                <div className="infos-approv">
                    <h1>Fournisseurs et montant</h1>
                    <div>
                        <label htmlFor="">Choisissez un fournisseur : </label>
                        <select name="fournisseur" id="fournisseur">
                            {listeFournisseurs.length > 0 && listeFournisseurs.map(item => (
                                <option value={item.nom_fournisseur}>{item.nom_fournisseur}</option>
                            ))}
                        </select>
                    </div>
                    <div className="montant-commande">
                        <label htmlFor="">montant de la commande : </label>
                        <input type="number" name="montant_commande" value={montantCommande} onChange={(e) => setMontantCommande(e.target.value)} />
                    </div>
                    <p className="search-zone">
                        <input type="text" className="rechercher" placeholder="recherchez un produit" onChange={filtrerListe} />
                    </p>
                    <h1>Produits en stock</h1>
                    <ul>
                        {afficherListe ? listeProduit.map(item => (
                            <li value={item.id} key={item.id} onClick={afficherDetails} style={{color: `${parseInt(item.en_stock) < parseInt(item.min_rec) ? 'red' : ''}`}}>{item.designation.toLowerCase()}</li>
                            )) : null}
                    </ul>
                </div>

                <div className="details-approv">
                    <h1>Détails produit</h1>
                    <form>
                        <EditerProd
                            code={code}
                            min_rec={min_rec}
                            designation={designation}
                            classe={classe}
                            categorie={categorie}
                            pu_vente={pu_vente}
                            conditionnement={conditionnement}
                            date_peremption={date_peremption}
                            stock_ajoute={stock_ajoute}
                            pu_achat={pu_achat}
                            genre={genre}
                            handleChange={handleChange}
                            ajouterMedoc={ajouterMedoc}
                            nvProd={nvProd}
                        />
                        <div style={{color: 'red', backgroundColor: `#fff`}}>{msgErreur}</div>
                        <div>
                            <label htmlFor="nvProd">nouveau produit</label>
                            <input type="checkbox" name="" id="nvProd" checked={nvProd} onChange={ouvrirModalNouveauProd} />
                        </div>
                    </form>
                    <div className="produits-commandes">
                        <h1>Produits Commandés</h1>
                        <table>
                            <thead>
                                <tr>
                                    <td>Désignation</td>
                                    <td>Qté entrée</td>
                                    <td>Pu vente</td>
                                    <td>Forme</td>
                                    <td>Date exp</td>
                                    <td>Stock minimum</td>
                                </tr>
                            </thead>
                            <tbody>
                                {produitsCommandes.length > 0 ? produitsCommandes.map(item => (
                                    <tr>
                                        <td>{item.designation}</td>
                                        <td>{item.stock_ajoute}</td>
                                        <td>{item.pu_vente}</td>
                                        <td>{item.categorie}</td>
                                        <td>{item.date_peremption}</td>
                                        <td>{item.min_rec}</td>
                                    </tr>
                                )) : null}
                            </tbody>
                        </table>
                        <div className="valider-btn">
                            <button onClick={() => { if(produitsCommandes.length > 0) {afterModal(); setModalConfirmation(true);}}}>Valider</button>
                        </div>
                    </div>
                </div>
            </section>
        </animated.div>
    )
}

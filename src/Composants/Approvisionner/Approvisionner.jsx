import React, { useState, useEffect } from 'react';
import './Approvisionner.css';
import Modal from 'react-modal';


const medocs = {
    code: '',
    designation: '',
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


export default function Approvisionner(props) {


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
    const [nvProd, setNvProd] = useState(false);
    const [refecth, setRefetch] = useState(false)
    
    const {code, designation, pu_achat, pu_vente, conditionnement, stock_ajoute, min_rec, categorie, date_peremption, montant_commande, genre} = infosMedoc;

    useEffect(() => {
        // Récupération de la liste de produits via Ajax
        const req = new XMLHttpRequest();
        req.open('GET', 'http://serveur/backend-cma/recuperer_medoc.php?stock=filtre');

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
        req.open('GET', 'http://serveur/backend-cma/recuperer_fournisseurs.php');

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


        if (!isNaN(pu_vente) && !isNaN(min_rec) && !isNaN(pu_achat)) {
    
            setMsgErreur('');
            const data = new FormData();
            data.append('produit', JSON.stringify(infosMedoc));
    
            const req = new XMLHttpRequest();
    
            req.open('POST', 'http://serveur/backend-cma/ajouter_produit.php');
                
            req.addEventListener('load', () => {
                setInfosMedoc(medocs);
                setRefetch(!refecth);
            });
    
            req.send(data);
        } else {
            setMsgErreur("Le prix de vente, le prix d'achat et le stock minimum doivent être des nombres");
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
            req.open('POST', 'http://serveur/backend-cma/gestion_stock.php?remarque=livraison');
            
            req.addEventListener('load', () => {
                i++
                if (i === produitsCommandes.length) {
                    setModalConfirmation(false);
                    setModalReussi(true);
                    setRefetch(!refecth);
                    document.querySelector('.rechercher').value = "";
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
            req.open('POST', 'http://serveur/backend-cma/approvisionnement.php');
            
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
        document.querySelectorAll('.btn-confirmation').forEach(item => {
            item.disabled = true;
        });

        const idCommande = genererId();
        const fournisseur = document.getElementById('fournisseur').value;

        const data = new FormData();
        
        // Données relatives aux informations de la commande
        data.append('id_commande', idCommande);
        data.append('fournisseur', fournisseur);
        data.append('vendeur', props.nomConnecte);
        data.append('montant', montantCommande);
        
        const req = new XMLHttpRequest();
        req.open('POST', 'http://serveur/backend-cma/approvisionnement.php');
        
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
  
    const fermerModalReussi = () => {
        setModalReussi(false);
        setMedocSelectionne({});
        setProduitsCommandes([]);
    }

    return (
        <section className="approvisionner">
            <Modal
                isOpen={modalConfirmation}
                onRequestClose={fermerModalConfirmation}
                style={customStyles1}
                contentLabel="validation commande"
            >
                <h2 style={{color: '#fff'}}>êtes-vous sûr de vouloir valider la commande ?</h2>
                <div style={{textAlign: 'center'}} className='modal-button'>
                    <button className='btn-confirmation' style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '10px'}} onClick={fermerModalConfirmation}>Annuler</button>
                    <button className='btn-confirmation' style={{width: '20%', height: '5vh', cursor: 'pointer'}} onClick={finaliserCommande}>Confirmer</button>
                </div>
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
                    <div className="box-container">
                        <div className="box">
                            <div className="detail-item">
                                <label htmlFor="">Code</label>
                                <input type="text" name="code" value={code} onChange={handleChange} autoComplete="off" />
                            </div>
                            <div className="detail-item">
                                <label htmlFor="">Stock Minimum</label>
                                <input type="text" name="min_rec" value={min_rec} onChange={handleChange} autoComplete="off" />
                            </div>
                        </div>
                        <div className="box">
                            <div className="detail-item">
                                <label htmlFor="">Désignation</label>
                                <input type="text" name="designation" value={designation} onChange={handleChange} autoComplete="off" />
                            </div>
                            <div className="detail-item">
                                <label htmlFor="">Catégorie</label>
                                <input type="text" name="categorie" value={categorie} onChange={handleChange} autoComplete="off" />
                            </div>
                        </div>
                        <div className="box">
                            <div className="detail-item">
                                <label htmlFor="">Prix de vente</label>
                                <input type="text" name="pu_vente" value={pu_vente} onChange={handleChange} autoComplete="off" />
                            </div>
                            <div className="detail-item">
                                <label htmlFor="">Conditionnement</label>
                                <input type="text" name="conditionnement" value={conditionnement} onChange={handleChange} autoComplete="off" />
                            </div>
                        </div>
                    </div>
                    <div className="box-container">
                        <div className="box">
                            <div className="detail-item">
                                <label htmlFor="">Date Péremption</label>
                                <input type="text" name="date_peremption" placeholder="mm-aa" value={date_peremption} onChange={handleChange} autoComplete="off" />
                            </div>
                            <div className="detail-item">
                                <label htmlFor="">Quantité commandé</label>
                                <input type="text" name="stock_ajoute" value={stock_ajoute} onChange={handleChange} autoComplete="off" />
                            </div>
                            <div className="detail-item">
                                <button onClick={ajouterMedoc}>Ajouter</button>
                            </div>
                        </div>
                        <div className="box">
                            <div className="detail-item">
                                <label htmlFor="">Prix d'achat</label>
                                <input type="text" name="pu_achat" value={pu_achat} onChange={handleChange} autoComplete="off" />
                            </div>
                            <div className="detail-item">
                                <label htmlFor="">Genre</label>
                                <select name="genre" id="genre" onChange={handleChange} value={genre}>
                                    <option value="generique">générique</option>
                                    <option value="sp">spécialité</option>
                                </select>
                                {/* <input type="text" name="genre" value={genre} onChange={handleChange} autoComplete="off" /> */}
                            </div>
                        </div>
                    </div>
                    <div style={{color: 'red'}}>{msgErreur}</div>
                    <div>
                        <label htmlFor="nvProd">nouveau produit</label>
                        <input type="checkbox" name="" id="nvProd" checked={nvProd} onChange={() => setNvProd(!nvProd)} />
                    </div>
                    <div style={{display: `${nvProd ? 'block' : 'none'}`, width: '20%'}}>
                                <button onClick={ajouterNouveauProduit}>Nouveau</button>
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
                                <td>Code</td>
                                <td>Catégorie</td>
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
                                    <td>{item.code}</td>
                                    <td>{item.categorie}</td>
                                    <td>{item.date_peremption}</td>
                                    <td>{item.min_rec}</td>
                                </tr>
                            )) : null}
                        </tbody>
                    </table>
                    <div className="valider-btn">
                        <button onClick={() => { if(produitsCommandes.length > 0) {setModalConfirmation(true)}}}>Valider</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

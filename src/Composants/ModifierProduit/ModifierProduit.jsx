import React, { useEffect, useState, useContext } from 'react';
import AfficherProd from '../AfficherProd/AfficherProd';
import './ModifierProduit.css';
import Modal from 'react-modal';
import { useSpring, animated } from 'react-spring';
import { ContextChargement } from '../../Context/Chargement';

const customStyles1 = {
    content: {
      top: '15%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '10px',
    //   background: '#0e771a',
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

export default function ModifierProduit() {

    const props1 = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });
    const {darkLight} = useContext(ContextChargement);

    const [afficherListe, setAfficherListe] = useState(false);
    const [listeProduit, setListeProduit] = useState([]);
    const [listeSauvegarde, setListeSauvegarde] = useState([]);
    const [nvprix, setnvprix] = useState('');
    const [produitSelectionne, setproduitSelectionne] = useState([]);
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [modalModifPrix, setModalModifPrix] = useState(false)
    const [modalReussi, setModalReussi] = useState(false);
    const [messageReussi, setMessageReussi] = useState('');
    const [refecth, setRefetch] = useState(false)

    useEffect(() => {
        // Récupération de la liste de produits via Ajax
        const req = new XMLHttpRequest();
        req.open('GET', 'http://serveur/backend-cmab/recuperer_medoc.php');

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                const result = JSON.parse(req.responseText);
                setListeProduit(result);
                setListeSauvegarde(result);
                setAfficherListe(true);
            }
        });

        req.send();

    }, [refecth]);

    const filtrerListe = (e) => {
        const medocFilter = listeSauvegarde.filter(item => (item.designation.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1))
        setListeProduit(medocFilter);
    }

    const selectionneProduit = (e) => {
        const prod = listeProduit.filter(item => (item.id == e.target.value));
        setproduitSelectionne(prod);
    }

    const supprimerProduit = () => {
        // Suppression du produit selectionné
        document.querySelector('#confirmer').disabled = true;
        if (produitSelectionne.length > 0) {
            const data = new FormData();
            data.append('id', produitSelectionne[0].id);

            const req = new XMLHttpRequest();
            req.open('POST', 'http://serveur/backend-cmab/supprimer_produit.php');

            req.addEventListener('load', () => {
                if (req.status >= 200 && req.status < 400) {
                    setMessageReussi('Le produit a bien été supprimé');
                    setRefetch(!refecth);
                    setproduitSelectionne([]);
                    setModalReussi(true);
                    setModalConfirmation(false);
                }
            });

            req.send(data);
        }
    }

    const handleChange = (e) => {
        setnvprix(e.target.value);
    }

    const modifierPrix = () => {
        // Mettre à jour le prix
        if (!isNaN(nvprix)) {

            const data = new FormData();
            data.append('nvprix', nvprix);
            data.append('designation', produitSelectionne[0].designation);
            
            const req = new XMLHttpRequest();
            req.open('POST', 'http://serveur/backend-cmab/maj_prix.php');
            
            req.addEventListener('load', () => {
                if (req.status >= 200 && req.status < 400) {
                    setMessageReussi('le prix a bien été modifié');
                    setModalModifPrix(false);
                    setModalReussi(true);
                    setproduitSelectionne([]);
                    setRefetch(!refecth);
                }
            });

            req.send(data);
            setnvprix('');
        }
    }

    const supprimerProduitEpuise = () => {
        const req = new XMLHttpRequest();
        req.open('POST', 'http://serveur/backend-cmab/vider.php?stock=0');
        
        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                setRefetch(!refecth);
            }
        });

        req.send();
    }

    const fermerModalConfirmation = () => {
        setModalConfirmation(false);
    }
  
    const fermerModalReussi = () => {
        setModalReussi(false);
    }
    
    const fermerModalModifPrix = () => {
        setModalModifPrix(false);
        setnvprix('');
    }

    const afterModal = () => {
        customStyles1.content.color = darkLight ? '#fff' : '#000';
        customStyles1.content.background = darkLight ? '#18202e' : '#fff';
    }

    return (
        <animated.div style={props1}>
            <section className="modif-produit">
                <Modal
                    isOpen={modalConfirmation}
                    onRequestClose={setModalConfirmation}
                    style={customStyles1}
                    contentLabel="validation suppression"
                >
                    <h2>êtes-vous sûr de vouloir supprimer ce produit ?</h2>
                    <div style={{textAlign: 'center'}} className='modal-button'>
                        <button className='bootstrap-btn annuler' style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '10px'}} onClick={fermerModalConfirmation}>Annuler</button>
                        <button id='confirmer' className='bootstrap-btn' style={{width: '20%', height: '5vh', cursor: 'pointer'}} onClick={supprimerProduit}>Confirmer</button>
                    </div>
                </Modal>
                <Modal
                    isOpen={modalModifPrix}
                    onRequestClose={fermerModalModifPrix}
                    style={customStyles1}
                    contentLabel="modif prix"
                >
                    <h2>Entrez le nouveau prix</h2>
                    <div style={{textAlign: 'center'}}>
                        <input style={{marginBottom: '10px', outline: 'none'}} value={nvprix} type="text" onChange={handleChange} />
                        <div>
                            <button className='bootstrap-btn annuler' style={{width: '40%', height: '5vh', cursor: 'pointer', marginRight: '10px'}} onClick={fermerModalModifPrix}>Annuler</button>
                            <button className='bootstrap-btn' style={{width: '40%', height: '5vh', cursor: 'pointer'}} onClick={modifierPrix}>Confirmer</button>
                        </div>
                    </div>
                </Modal>
                <Modal
                    isOpen={modalReussi}
                    onRequestClose={fermerModalReussi}
                    style={customStyles2}
                    contentLabel="réussi"
                >
                    <h2 style={{color: '#fff'}}>{messageReussi}!</h2>
                    <button style={{width: '10%', height: '5vh', cursor: 'pointer', marginRight: '10px'}} onClick={fermerModalReussi}>OK</button>
                </Modal>
                <div className="col-1">
                    <h1>Produits en stock</h1>
                    {/* <button onClick={supprimerProduitEpuise}>Vider</button> */}
                    <p className="search-zone">
                        <input type="text" placeholder="recherchez un produit" onChange={filtrerListe} />
                    </p>
                    <ul>
                        {afficherListe ? listeProduit.map(item => (
                            <li value={item.id} key={item.id} onClick={selectionneProduit} style={{color: `${parseInt(item.en_stock) < parseInt(item.min_rec) ? 'red' : ''}`}}>{item.designation.toLowerCase()}</li>
                            )) : null}
                    </ul>
                </div>
                <div className="col-2">
                    <h1>Détails du produit</h1>
                    <div className="details-prod">
                        {produitSelectionne.length > 0 && produitSelectionne.map(item => (
                            <AfficherProd
                            key={item.id}
                            code={item.code}
                            designation={item.designation}
                            pu_achat={item.pu_achat}
                            pu_vente={item.pu_vente}
                            en_stock={item.en_stock}
                            min_rec={item.min_rec}
                            categorie={item.categorie}
                            conditionnement={item.conditionnement}
                            date_peremption={item.date_peremption}
                            />
                        ))}
                    </div>
                    <div className="buttons">
                        <button className='bootstrap-btn annuler' onClick={() => { if (produitSelectionne.length > 0) {setModalConfirmation(true); afterModal();}}}>Supprimer</button>
                        <button className='bootstrap-btn valider' onClick={() => { if (produitSelectionne.length > 0) {setModalModifPrix(true); afterModal();}}}>Modifier le prix</button>
                    </div>
                </div>
            </section>
        </animated.div>
    )
}

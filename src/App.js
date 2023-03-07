import './App.css';
import { Fragment, useState, useEffect, useContext } from 'react';
import Entete from './Composants/Entete/Entete';
import Connexion from './Composants/Connexion/Connexion';
import Commande from './Composants/Commande/Commande';
import Historique from './Composants/Historique/Historique';
import Maj from './Composants/Maj/Maj';
import Comptes from './Composants/Comptes/Comptes';
import GestionFactures from './Composants/GestionFactures/GestionFactures';
import Etats from './Composants/Etats/Etats';
import Stats from './Composants/Stats/Stats.jsx';
import { FaChartBar, FaClipboardList, FaLayerGroup, FaReceipt, FaStore, FaTruck, FaUsers } from 'react-icons/fa';
import { ContextChargement } from './Context/Chargement';
import ListeProduits from './Composants/ListeProduits/ListeProduits';


function App() {

  const admin = "admin";
  const major = "major";
  const vendeur = "vendeur";
  const medecin = "medecin";

  const {darkLight} = useContext(ContextChargement)

  const [onglet, setOnglet] = useState(1);
  const [connecter, setConnecter] = useState(false);
  const [nomConnecte, setNomConnecte] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if(role === admin) {
      setOnglet(6);
    } else {
      setOnglet(1);
    }
  }, [role, connecter]);

  let contenu;
  switch(onglet) {
    case 1:
      contenu = <Commande nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
      break;
    case 2:
      contenu = <Historique nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
      break;
    case 3:
      contenu = <Maj nomConnecte={nomConnecte} />
      break;
    case 4:
      contenu = <Comptes nomConnecte={nomConnecte} />
      break;
    case 5:
      contenu = <GestionFactures nomConnecte={nomConnecte} />
      break;
    case 6:
      contenu = <Etats nomConnecte={nomConnecte} role={role} setConnecter={setConnecter} setOnglet={setOnglet} />
      break;
    case 7:
      contenu = <Stats nomConnecte={nomConnecte} />
      break;
  }

  if (connecter) {
    if(role === admin) {
      return (
        <main className={`app ${darkLight ? 'dark' : ''}`}>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
          <section className="conteneur-onglets">
            <div className="onglets-blocs" style={{width: '97%', fontSize: '12px'}}>
              <div className={`tab ${onglet === 6 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(6)}}>
                <FaReceipt size={18} />
                &nbsp;
                Etats
              </div>
              <div className={`tab ${onglet === 2 ? 'active' : ''}  ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(2)}}>
                <FaClipboardList size={19} />
                &nbsp;
                Inventaires
              </div>
              <div className={`tab ${onglet === 3 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(3)}}>
                <FaLayerGroup size={18} />
                &nbsp;
                Gestion des stocks
              </div>
              <div className={`tab ${onglet === 4 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(4)}}>
                <FaUsers size={20} />
                &nbsp;
                Comptes
              </div>
              <div className={`tab ${onglet === 7 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(7)}}>
                <FaChartBar size={19} />
                &nbsp;
                Statistiques
              </div>
            </div>
            <div className="onglets-contenu">
                {contenu}
            </div>
          </section>
        </main>
      );
    } else if (role === major) {
      return (
        <main className={`app ${darkLight ? 'dark' : ''}`}>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
          <section className="conteneur-onglets">
            <div className="onglets-blocs" style={{width: '75%'}}>
              <div className={`tab ${onglet === 1 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(1)}}>
                <FaStore size={22} />
                &nbsp;
                Ventes
              </div>
              <div className={`tab ${onglet === 3 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(3)}}>
                <FaLayerGroup size={22} />
                &nbsp;
                Gestion des stocks
              </div>
              <div className={`tab ${onglet === 6 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(6)}}>
                <FaReceipt size={22} />
                &nbsp;
                Etats
              </div>
            </div>
            <div className="onglets-contenu">
                {contenu}
            </div>
          </section>
        </main>
      );
    } else if (role === vendeur) {
      return (
        <main className={`app ${darkLight ? 'dark' : ''}`}>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
          <section className="conteneur-onglets">
            <div className="onglets-blocs" style={{width: '28%'}}>
              <div className={`tab ${onglet === 1 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(1)}}>
                <FaStore size={22} />
                &nbsp;
                Ventes
              </div>
              <div className={`tab ${onglet === 6 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(6)}}>
                <FaReceipt size={22} />
                &nbsp;
                Etats
              </div>
            </div>
            <div className="onglets-contenu">
                {contenu}
            </div>
          </section>
        </main>
      );
    } else if (role === medecin) {
      return (
        <main className={`app ${darkLight ? 'dark' : ''}`}>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
          <ListeProduits />
        </main>
      );
    } else {
      <main className='app'>
        vous n'avez pas le droit d'accéder à cette application
      </main>
    }
  } else {
    return (
      <Connexion
        connecter={connecter}
        setConnecter={setConnecter}
        nomConnecte={nomConnecte}
        setNomConnecte={setNomConnecte}
        role={role}
        setRole={setRole}
      />
    )
  }
}

export default App;
import './App.css';
import { Fragment, useState, useEffect } from 'react';
import Entete from './Composants/Entete/Entete';
import Connexion from './Composants/Connexion/Connexion';
import Commande from './Composants/Commande/Commande';
import Historique from './Composants/Historique/Historique';
import Maj from './Composants/Maj/Maj';
import Comptes from './Composants/Comptes/Comptes';
import GestionFactures from './Composants/GestionFactures/GestionFactures';
import Etats from './Composants/Etats/Etats';
import Stats from './Composants/Stats/Stats.jsx';


function App() {

  const role1 = "admin";
  const role2 = "major";
  const role3 = "vendeur";

  const [onglet, setOnglet] = useState(1);
  const [connecter, setConnecter] = useState(false);
  const [nomConnecte, setNomConnecte] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if(role === role1) {
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
    if(role === role1) {
      return (
        <main className='app'>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
          <section className="conteneur-onglets">
            <div className="onglets-blocs" style={{width: '85%'}}>
              <div className={`tab ${onglet === 6 ? 'active' : ''}`} onClick={ () => {setOnglet(6)}}>Etats</div>
              <div className={`tab ${onglet === 2 ? 'active' : ''}`} onClick={ () => {setOnglet(2)}}>Inventaires</div>
              <div className={`tab ${onglet === 3 ? 'active' : ''}`} onClick={ () => {setOnglet(3)}}>Gestion des stocks</div>
              <div className={`tab ${onglet === 4 ? 'active' : ''}`} onClick={ () => {setOnglet(4)}}>Comptes</div>
              <div className={`tab ${onglet === 7 ? 'active' : ''}`} onClick={ () => {setOnglet(7)}}>Statistiques</div>
            </div>
            <div className="onglets-contenu">
                {contenu}
            </div>
          </section>
        </main>
      );
    } else if (role === role2) {
      return (
        <main className='app'>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
          <section className="conteneur-onglets">
            <div className="onglets-blocs" style={{width: '58%'}}>
              <div className={`tab ${onglet === 1 ? 'active' : ''}`} onClick={ () => {setOnglet(1)}}>Ventes</div>
              <div className={`tab ${onglet === 3 ? 'active' : ''}`} onClick={ () => {setOnglet(3)}}>Gestion des stocks</div>
              <div className={`tab ${onglet === 6 ? 'active' : ''}`} onClick={ () => {setOnglet(6)}}>Etats</div>
            </div>
            <div className="onglets-contenu">
                {contenu}
            </div>
          </section>
        </main>
      );
    } else if (role === role3) {
      return (
        <main className='app'>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
          <section className="conteneur-onglets">
            <div className="onglets-blocs" style={{width: '28%'}}>
              <div className={`tab ${onglet === 1 ? 'active' : ''}`} onClick={ () => {setOnglet(1)}}>Ventes</div>
              <div className={`tab ${onglet === 6 ? 'active' : ''}`} onClick={ () => {setOnglet(6)}}>Etats</div>
            </div>
            <div className="onglets-contenu">
                {contenu}
            </div>
          </section>
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
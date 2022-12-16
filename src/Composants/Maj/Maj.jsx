import React, { useState, useContext } from 'react';
import Approvisionner from '../Approvisionner/Approvisionner';
import Bordereau from '../Bordereau/Bordereau';
import ModifierProduit from '../ModifierProduit/ModifierProduit';
import './Maj.css';
import { FaList, FaPen, FaTruck } from 'react-icons/fa';
import { ContextChargement } from '../../Context/Chargement';

export default function Maj(props) {

    const {darkLight} = useContext(ContextChargement)

    const [onglet, setOnglet] = useState(1);
    let contenu;
    
    switch(onglet) {
      case 1:
        contenu = <Approvisionner nomConnecte={props.nomConnecte} />
        break;
      case 2:
        contenu = <ModifierProduit />
        break;
      case 3:
        contenu = <Bordereau nomConnecte={props.nomConnecte} />
        break;
    }

    return (
        <section className="conteneur-sous-onglets">
          <div className="onglets-blocs" style={{width: '65%'}}>
            <div className={`tab ${onglet === 1 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(1)}}>
              <FaTruck size={24} />
              &nbsp;
              Approvisionner
            </div>
            <div className={`tab ${onglet === 2 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(2)}}>
              <FaPen size={20} />
              &nbsp;
              Modifier infos
            </div>
            <div className={`tab ${onglet === 3 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(3)}}>
              <FaList size={22} />
              &nbsp;
              Commandes
            </div>
          </div>
          <div className="onglets-contenu">
              {contenu}
          </div>
        </section>
    )
}

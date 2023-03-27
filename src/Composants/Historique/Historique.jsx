import React, { useState, useContext } from 'react';
import Approvisionner from '../Approvisionner/Approvisionner';
import Bordereau from '../Bordereau/Bordereau';
import ModifierProduit from '../ModifierProduit/ModifierProduit';
import Activites from '../Activites/Activites';
import '../Maj/Maj.css';
import { FaList, FaPen, FaTruck } from 'react-icons/fa';
import { AiFillSave } from 'react-icons/ai';
import { TbActivity } from "react-icons/tb";
import { ContextChargement } from '../../Context/Chargement';
import Inventaires from '../Inventaires/Inventaires';

export default function Historique(props) {

    const {darkLight} = useContext(ContextChargement)
    const [onglet, setOnglet] = useState(1);
    let contenu;
    
    switch(onglet) {
      case 1:
        contenu = <Activites nomConnecte={props.nomConnecte} />
        break;
      case 2:
        contenu = <Inventaires nomConnecte={props.nomConnecte} />
        break;
      default:
        break;
    }

    return (
        <section className="conteneur-sous-onglets">
          <div className="onglets-blocs" style={{width: '40%', fontSize: '14px'}}>
            <div className={`tab ${onglet === 1 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(1)}}>
              <TbActivity size={23} />
              &nbsp;
              Activites
            </div>
            <div className={`tab ${onglet === 2 ? 'active' : ''} ${darkLight ? 'dark' : ''}`} onClick={ () => {setOnglet(2)}}>
              <AiFillSave size={21} />
              &nbsp;
              Sauvegardes
            </div>
          </div>
          <div className="onglets-contenu">
              {contenu}
          </div>
        </section>
    )
}

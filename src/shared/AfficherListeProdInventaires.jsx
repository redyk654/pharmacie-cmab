import React, { Fragment, useContext } from 'react';
import Loader from "react-loader-spinner";
import { ContextChargement } from "../Context/Chargement";
import UseColorProd from '../Customs/UseColorProd';
import { colors } from "../shared/Globals";

export default function AfficherListeProdInventaires(props) {

    const {chargement} = useContext(ContextChargement);

  return (
    <Fragment>
        {chargement ?
            <div className="loader"><Loader type="TailSpin" color="#03ca7e" height={100} width={100}/></div> 
            :
            props.listeHistorique.map(item => (
            <li 
                value={item.id}
                key={item.id}
                onClick={props.afficherHistorique}
                style={{color: `${UseColorProd(item.en_stock, item.min_rec, colors.danger, colors.undef)}`}}>
                {item.designation.toLowerCase() + ' (' + item.en_stock + ')'}
            </li>))
        }
    </Fragment>
  )
}

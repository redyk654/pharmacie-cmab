import React, { Fragment, useContext } from 'react';
import { ContextChargement } from '../../Context/Chargement';

export default function AfficherProd(props) {

    const genres = {
        sp: "spécialité",
        generique: "générique",
    }

    const {darkLight, role} = useContext(ContextChargement)


    return (
        <Fragment>
            <div className="box">
                <div className="item">
                    <p>Désignation</p>
                    <p>{props.designation}</p>
                </div>
                <div className="item">
                    <p>Prix de vente</p>
                    <p>{props.pu_vente + ' Fcfa'}</p> 
                </div>
                <div className="item">
                    <p>En stock</p>
                    <p style={{color: `${parseInt(props.en_stock) < parseInt(props.min_rec) ? '#ec4641' : ''}`}}>{props.en_stock}</p>
                </div>
                <div className="item">
                    <p>Genre</p>
                    <p>{genres[props.genre]}</p> 
                </div>
            </div>
            <div className="box">
                <div className="item">
                    <p>Forme</p>
                    <p>{props.categorie}</p> 
                </div>
                <div className="item">
                    <p>stock minimum</p>
                    <p>{props.min_rec}</p> 
                </div>
                <div className="item">
                    <p>Conditionnement</p>
                    <p>{props.conditionnement}</p> 
                </div>
            </div>
            <div className="box" style={{display: `${role === "admin" ? 'flex' : 'none'}`}}>
                <div className="item">
                    <p>Classe</p>
                    <p>{props.classe}</p>
                </div>
                <div className="item">
                    <p>Prix d'achat</p>
                    <p>{props.pu_achat}</p>
                </div>
                <div className="item">
                    <p>Date depéremption</p>
                    <p>{props.date_peremption}</p>
                </div>
            </div>
        </Fragment>
    )
}

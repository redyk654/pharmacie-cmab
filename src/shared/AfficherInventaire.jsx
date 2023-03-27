import React from 'react';
import "./AfficherInventaire.css"

export default function AfficherInventaire(props) {
  return (
    <div className='modal-inventaire' style={{width: '100%', height: '60vh', overflowY: 'scroll'}}>
        <table style={{width: '100%'}} cellSpacing={0}>
            <thead>
                <tr>
                    <td>Designation</td>
                    <td>Dispo</td>
                </tr>
            </thead>
            <tbody>
                {props.listeProds ? props.listeProds.map(item => (
                    <tr key={item.id_table}>
                        <td>{item.designation.toLowerCase()}</td>
                        <td>{item.en_stock}</td>
                    </tr>
                )) : null}
            </tbody>
        </table>
    </div>
  )
}

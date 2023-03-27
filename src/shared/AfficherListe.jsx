import React from 'react'

export default function AfficherListe(props) {
  return (
    <ul>
        {props.liste.length > 0 && props.liste.map(item => (
            <li id={item[props.id]} key={item[props.cle]} onClick={props.handleClick}>{item[props.val]}</li>
        ))}
    </ul>
  )
}

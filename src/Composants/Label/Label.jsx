import React from 'react';

export default function Label(props) {
  return (
    <label htmlFor={`${props.titre.toLowerCase()}`} style={{textTransform: 'capitalize'}}>
        {props.titre}
    </label>
  )
}

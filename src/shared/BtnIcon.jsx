import React from 'react';
import "./BtnIcon.css"

export default function BtnIcon(props) {
  return (
    <button className='btn-icon' onClick={props.handleClick} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
        {props.children}
    </button>
  )
}

import React from 'react'

export default function Btn(props) {
  return (
    <button className={props.classe} style={props.styles} onClick={props.handleClick}>
        {props.text}
    </button>
  )
}

import React from 'react';
import "./TitleH1.css"

export default function TitleH1(props) {
  return (
    <h1 className='h1'>
        {props.val}
    </h1>
  )
}

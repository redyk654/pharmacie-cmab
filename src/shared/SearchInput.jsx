import React from 'react'

export default function SearchInput(props) {
  return (
    <p className="search-zone" style={props.styles1 ? props.styles1 : {}}>
        <input style={props.styles2 ? props.styles2 : {}} type="text" placeholder={props.placeholder} value={props.searchTerm} onChange={props.handleChange} />
    </p>
  )
}

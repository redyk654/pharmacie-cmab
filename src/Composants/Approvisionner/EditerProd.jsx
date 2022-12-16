import React from 'react'

export default function EditerProd(props) {
  return (
    <>
        <div className="box-container">
            <div className="box">
                <div className="detail-item">
                    <label htmlFor="">Code</label>
                    <input type="text" name="code" value={props.code} onChange={props.handleChange} autoComplete="off" />
                </div>
                <div className="detail-item">
                    <label htmlFor="">Stock Minimum</label>
                    <input type="text" name="min_rec" value={props.min_rec} onChange={props.handleChange} autoComplete="off" />
                </div>
            </div>
            <div className="box">
                <div className="detail-item">
                    <label htmlFor="">Désignation</label>
                    <input type="text" name="designation" value={props.designation} onChange={props.handleChange} autoComplete="off" />
                </div>
                <div className="detail-item">
                    <label htmlFor="">Forme</label>
                    <input type="text" name="categorie" value={props.categorie} onChange={props.handleChange} autoComplete="off" />
                </div>
            </div>
            <div className="box">
                <div className="detail-item">
                    <label htmlFor="">Prix de vente</label>
                    <input type="text" name="pu_vente" value={props.pu_vente} onChange={props.handleChange} autoComplete="off" />
                </div>
                <div className="detail-item">
                    <label htmlFor="">Conditionnement</label>
                    <input type="text" name="conditionnement" value={props.conditionnement} onChange={props.handleChange} autoComplete="off" />
                </div>
            </div>
        </div>
        <div className="box-container">
            <div className="box">
                <div className="detail-item">
                    <label htmlFor="">Date Péremption</label>
                    <input type="text" name="date_peremption" placeholder="mm-aa" value={props.date_peremption} onChange={props.handleChange} autoComplete="off" />
                </div>
                <div className="detail-item" style={{display: `${!props.nvProd ? 'block' : 'none'}`}}>
                    <label htmlFor="">Quantité commandé</label>
                    <input type="text" name="stock_ajoute" value={props.stock_ajoute} onChange={props.handleChange} autoComplete="off" />
                </div>
                <div className="detail-item">
                    <button onClick={props.ajouterMedoc}>Ajouter</button>
                </div>
            </div>
            <div className="box">
                <div className="detail-item">
                    <label htmlFor="">Prix d'achat</label>
                    <input type="text" name="pu_achat" value={props.pu_achat} onChange={props.handleChange} autoComplete="off" />
                </div>
                <div className="detail-item">
                    <label htmlFor="">Genre</label>
                    <select name="genre" id="genre" onChange={props.handleChange} value={props.genre}>
                        <option value="generique">générique</option>
                        <option value="sp">spécialité</option>
                    </select>
                </div>
            </div>
            <div className='box'>
                <div className="detail-item">
                    <label htmlFor="">Classe</label>
                    <input type="text" name="classe" value={props.classe} onChange={props.handleChange} autoComplete="off" />
                </div>
            </div>
        </div>
    </>
  )
}

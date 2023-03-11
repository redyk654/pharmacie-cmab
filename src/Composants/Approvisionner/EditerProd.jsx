import React from 'react'

export default function EditerProd(props) {

    const handleChange = (e) => {
        if (props.nvProd) {
            props.handleChange(e);
        }
    }

  return (
    <>
        <div className="box-container">
            <div className="box">
                <div className="detail-item">
                    <label htmlFor="">Code</label>
                    <input type="text" name="code" value={props.code} onChange={handleChange} autoComplete="off" />
                </div>
                <div className="detail-item">
                    <label htmlFor="">Stock Minimum</label>
                    <input type="text" name="min_rec" value={props.min_rec} onChange={handleChange} autoComplete="off" />
                </div>
            </div>
            <div className="box">
                <div className="detail-item">
                    <label htmlFor="">Désignation</label>
                    <input type="text" name="designation" value={props.designation} onChange={handleChange} autoComplete="off" />
                </div>
                <div className="detail-item">
                    <label htmlFor="">Forme</label>
                    <input type="text" name="categorie" value={props.categorie} onChange={handleChange} autoComplete="off" />
                </div>
            </div>
            <div className="box">
                <div className="detail-item">
                    <label htmlFor="">Prix de vente</label>
                    <input type="text" name="pu_vente" value={props.pu_vente} onChange={handleChange} autoComplete="off" />
                </div>
                <div className="detail-item">
                    <label htmlFor="">Conditionnement</label>
                    <input type="text" name="conditionnement" value={props.conditionnement} onChange={handleChange} autoComplete="off" />
                </div>
            </div>
        </div>
        <div className="box-container">
            <div className="box">
                <div className="detail-item">
                    <label htmlFor="">Date Péremption</label>
                    <input type="text" name="date_peremption" placeholder="mm-aa" value={props.date_peremption} onChange={handleChange} autoComplete="off" />
                </div>
                <div className="detail-item" style={{display: `${!props.nvProd ? 'block' : 'none'}`}}>
                    <label htmlFor="">Quantité commandé</label>
                    <input type="text" name="stock_ajoute" value={props.stock_ajoute} onChange={handleChange} autoComplete="off" />
                </div>
                <div className="detail-item">
                    <button onClick={props.ajouterMedoc}>Ajouter</button>
                </div>
            </div>
            <div className="box">
                <div className="detail-item">
                    <label htmlFor="">Prix d'achat</label>
                    <input type="text" name="pu_achat" value={props.pu_achat} onChange={handleChange} autoComplete="off" />
                </div>
                <div className="detail-item">
                    <label htmlFor="">Genre</label>
                    <select name="genre" id="genre" onChange={handleChange} value={props.genre}>
                        <option value="generique">générique</option>
                        <option value="sp">spécialité</option>
                    </select>
                </div>
            </div>
            <div className='box'>
                <div className="detail-item">
                    <label htmlFor="">Classe</label>
                    <select name="classe" id="classe" onChange={handleChange} value={props.classe}>
                        <option value="antibiotiques">antibiotiques</option>
                        <option value="antipaludiques">antipaludiques</option>
                        <option value="antiinflammatoiresetantalgiques">anti-inflammatoires et antalgiques</option>
                        <option value="antispamodiques">antispamodiques</option>
                        <option value="antigrippaux">antigrippaux</option>
                        <option value="antihistaminiqueh1">anti histaminique h1</option>
                        <option value="antiulcereuxetantiacide">anti ulcereux et anti acides</option>
                        <option value="vermifuges">vermifuges</option>
                        <option value="vitaminesetelectrolytes">vitamines et electrolytes</option>
                        <option value="antianemiques">anti anemiques</option>
                    </select>
                </div>
            </div>
        </div>
    </>
  )
}

import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { ContextChargement } from '../../Context/Chargement';
import UseMsgErreur from '../../customs/UseMsgErreur/UseMsgErreur';
import Label from '../Label/Label'

export default function CreerPatient(props) {

  const {role} = useContext(ContextChargement)
  const styleShowOrHide = {
    display: `${role === "secretaire" ? "block" : "none"}`,
  }

  const [listeAssurances, setListeAssurances] = useState([]);
  const [msgErreur, setMsgErreur] = useState('');

  useEffect(() => {
    fetch('http://serveur/backend-cmab/assurances.php?liste')
    .then(response => response.json())
    .then(data => {
      setMsgErreur('');
      setListeAssurances(data);
    })
    .catch(error => {
      setMsgErreur('Erreur réseau');
    })
  }, []);

  return (
    <form action="" className="form-compte" style={{width: '60%', color: '#fff'}}>
      <h2 style={{textAlign: 'center',}}>Nouveau patient</h2>
      <div className="box-input">
          <p className="input-zone">
              <Label titre="code" />
              <input style={{color: '#fff', letterSpacing: '1px'}} type="text" name="codeP" value={props.codeP} autoComplete="off" />
          </p>
          <p className="input-zone">
              <Label titre="nom" />
              <input style={{color: '#fff', letterSpacing: '1px'}} type="text" name="nomP" value={props.nomP} onChange={props.handleChange} autoComplete="off" />
          </p>
          <p className="input-zone">
              <Label titre="age" />
              <input style={{color: '#fff', letterSpacing: '1px'}} type="number" name="ageP" value={props.ageP} onChange={props.handleChange} autoComplete="off" />
          </p>
          <p className="input-zone">
              <Label titre="quartier" />
              <input style={{color: '#fff', letterSpacing: '1px'}} type="text" name="quartierP" value={props.quartierP} onChange={props.handleChange} autoComplete="off" />
          </p>
          <p className="input-zone" style={styleShowOrHide}>
              <Label titre="assurance" />
              <select name="assuranceP">
                {listeAssurances.map(item => (
                  <option value={props.assuranceP}>{item.designation}</option>
                ))}
              </select>
          </p>
          <p className="input-zone" style={styleShowOrHide}>
              <Label titre="pourcentage" />
              <input type="text" name="type_assuranceP" value={props.type_assuranceP} autoComplete="off" />
          </p>
      </div>
      {UseMsgErreur(msgErreur)}
      <div className="btn-control">
          <button className='bootstrap-btn annuler' type="reset" >annuler</button>
          <button className='bootstrap-btn' type="submit" >valider</button>
      </div>
  </form>
  )
}

import React, { useContext } from 'react';
import { ContextChargement } from '../Context/Chargement';
import Btn from './Btn';
import Modal from "react-modal";
import Loader from "react-loader-spinner";

Modal.setAppElement('#root')

export default function ModalConfirmation(props) {
    
  const { darkLight } = useContext(ContextChargement);

  return (
    <Modal
        ariaHideApp={false}
        isOpen={props.isOpen}
        style={props.styles}
        contentLabel="validation commande"
    >
        <h2 style={{color: `${darkLight ? '#fff' : '#18202e'}`, textAlign: 'center', marginBottom: '30px'}}>Confirmation</h2>
        <p style={{fontWeight: '600', textAlign: 'center', opacity: '.8'}}>
            Vous allez valider la vente. Etes-vous sûr ?
            {props.text}
        </p>
        <div style={{textAlign: 'center', marginTop: '12px'}} className=''>
            {props.enCours ?
            <Loader type="TailSpin" color="#03ca7e" height={50} width={50}/> 
                : 
            <div>
                <Btn
                    text="annuler"
                    classe='bootstrap-btn annuler'
                    styles={{width: '30%', height: '5vh', cursor: 'pointer', marginRight: '10px'}}
                    handleClick={props.fermerModalConfirmation}
                />
                <Btn
                    className="bootstrap-btn valider"
                    styles={{width: '30%', height: '5vh', cursor: 'pointer', borderRadius: '15px'}}
                    handleClick={props.enregistrer}
                />
            </div>
            }
        </div>
    </Modal>
  )
}

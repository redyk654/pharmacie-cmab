import React from 'react'
import { useState, useContext } from 'react'
import AfficherInventaire from '../../shared/AfficherInventaire'
import Btn from '../../shared/Btn'
import TitleH1 from '../../shared/TitleH1'
import TitleH2 from '../../shared/TitleH2'
import { colors, currentDateString } from '../../shared/Globals'
import { ContextChargement } from '../../Context/Chargement';
import Loader from "react-loader-spinner";
import { FaArrowLeft, FaCross, FaRegArrowAltCircleDown } from 'react-icons/fa'
import { VscError } from "react-icons/vsc";
import BtnIcon from '../../shared/BtnIcon'


export default function SaveInventaire(props) {

  const { darkLight } = useContext(ContextChargement);

  return (
    <div id='save-inventaire'>
      {/* <ModalConfirmation
        isOpen={isOpen}
        enregister={props.handleClick}
        fermerModalConfirmation={fermerModalConfirmation}
        enCours={props.enCours}
        styles={customStyles1}

      /> */}
        {props.enCours ?
            <div className="loader"><Loader type="TailSpin" color="#03ca7e" height={100} width={100}/></div>
            :
          <>
            <BtnIcon handleClick={props.fermerModalInventaire}>
              <VscError size={40} color={colors.danger} />
            </BtnIcon>
            <TitleH1 val="Inventaires par dates" />
            <TitleH2 val={`Inventaire du ${currentDateString()}`} />
            <AfficherInventaire listeProds={props.listeProds} />
            <div style={{textAlign: 'center'}}>        
              <Btn
                  text="Sauvegarder"
                  classe="bootstrap-btn"
                  handleClick={props.handleClick}
                  styles={{width: '20%', marginTop: '25px'}}
              />
            </div>
          </>
        }
    </div>
  )
}

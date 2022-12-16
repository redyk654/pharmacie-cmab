import React , {createContext, useState} from 'react';

/*
    - Context pour gerer l'état du loader
*/

export const ContextChargement = createContext();

const ContextChargementProvider = (props) => {
    const [chargement, setChargement] = useState(true);
    const [darkLight, setDarkLight] = useState(false);

    const stopChargement = () => {
        setChargement(false);
    }

    const startChargement = () => {
        setChargement(true);
    }

    const toogleTheme = () => {
        setDarkLight(!darkLight);
    }
    
    return (
        <ContextChargement.Provider value={{chargement, stopChargement, startChargement, darkLight, toogleTheme}}>
            {props.children}
        </ContextChargement.Provider>
    )
}

export default ContextChargementProvider;
import React, { Component } from 'react';

const styles = {
    // display: 'flex',
    // justifyContent: 'center',
    fontWeight: '600',
    marginTop: '7px',
    width: '100%',
    // border: '1px solid #333',
}

const table_styles1 = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 10,
    textAlign: 'left'
}

const table_styles2 = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 10,
    textAlign: 'right'
}

const table_styles = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 10,
    width: '100%',
    marginTop: '15px',
    fontSize: 8
}

export default class ImprimerStats extends Component {

    moisStats = (str) => {
        
        switch(parseInt(str.substring(5, 7))) {
            case 1:
                return "janvier " + str.substring(0, 4);
            case 2:
                return "fevrier " + str.substring(0, 4);
            case 3:
                return "mars " + str.substring(0, 4);
            case 4:
                return "avril " + str.substring(0, 4);
            case 5:
                return "mai " + str.substring(0, 4);
            case 6:
                return "juin " + str.substring(0, 4);
            case 7:
                return "juillet " + str.substring(0, 4);
            case 8:
                return "août " + str.substring(0, 4);
            case 9:
                return "septembre " + str.substring(0, 4);
            case 10:
                return "octobre " + str.substring(0, 4);
            case 11:
                return "novembre " + str.substring(0, 4);
            case 12:
                return "décembre " + str.substring(0, 4);
            default:
                return "";
        }
    }

    render() {
        return (
            <div style={{backgroundColor: '#f1f1f1', height: '100vh', marginTop: '70px'}}>
                <div style={{textTransform: 'uppercase', padding: '15px 135px', fontSize: 7, marginBottom: '12px', width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{ lineHeight: '20px'}}>
                        <div style={{color: 'black', borderBottom: '1px dotted #000'}}><strong>Republique du Cameroun <br/><em style={{textTransform: 'capitalize'}}>Paix-Travail-Patrie</em></strong></div>
                        <div style={{color: 'black', borderBottom: '1px dotted #000'}}><strong>Ministere de la sante publique</strong></div>
                        <div style={{color: 'black', borderBottom: '1px dotted #000'}}><strong>Delegation regionale du Littoral</strong></div>
                        <div style={{color: 'black', borderBottom: '1px dotted #000'}}><strong>District sante de Deido</strong></div>
                        <div style={{color: 'black',}}><strong>CMA de Bepanda</strong></div> 
                    </div>
                    <div style={{ lineHeight: '20px'}}>
                        <div style={{color: 'black', borderBottom: '1px dotted #000'}}><strong>Republic of Cameroon <br/><em style={{textTransform: 'capitalize'}}>Peace-Work-Fatherland</em></strong></div>
                        <div style={{color: 'black', borderBottom: '1px dotted #000'}}><strong>Minister of Public Health</strong></div>
                        <div style={{color: 'black', borderBottom: '1px dotted #000'}}><strong>Littoral regional delegation</strong></div>
                        <div style={{color: 'black', borderBottom: '1px dotted #000'}}><strong>Deido Health District</strong></div>
                        <div style={{color: 'black',}}><strong>Bepanda CMA</strong></div> 
                    </div>
                </div>
                <div style={{fontSize: 9, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10px',}}>
                    <div style={{textAlign: 'center', width: '410px'}}>
                        <div style={{marginTop: 5}}>Fiche des stats de <span style={{fontWeight: '600', marginTop: '15px'}}>{this.moisStats(this.props.moisActu)}</span></div>
                        <div style={{textAlign: 'center', marginBottom: 15}}>
                            <table style={table_styles}>
                                <thead>
                                    <th style={table_styles1}>Désignation</th>
                                    <th style={table_styles2}>Qte sortie</th>
                                    <th style={table_styles2}>Qte entrée</th>
                                </thead>
                                <tbody>
                                    {this.props.historique.length > 0  ? this.props.historique.map(item => (
                                        <tr>
                                            <td style={table_styles1}>{item.designation}</td>
                                            <td style={table_styles2}>{item.qte_out}</td>
                                            <td style={table_styles2}>{item.qte_in}</td>
                                        </tr>
                                    )) : null
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>    
        )
    }
}

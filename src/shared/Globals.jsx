import { toast } from "react-hot-toast";

const toastAlerteStock = (msg, bg) => {
    toast.error(msg, {
        style: {
            fontWeight: 'bold',
            fontSize: '18px',
            color: '#fff',
            backgroundColor: bg,
            letterSpacing: '1px',
        },
        
    });
}

const getMsgAlerteStock = (designation, stock) => {
    if (parseInt(stock) === 0)
        return 'le stock de ' + designation + ' est épuisé ! Pensez à vous approvisionner';
    else
        return designation + ' bientôt en rupture de stock ! Pensez à vous approvisionner';
}

export function mois(str) {

    switch(parseInt(str.substring(3, 5))) {
        case 1:
            return str.substring(0, 2) + " janvier " + str.substring(6, 10);
        case 2:
            return str.substring(0, 2) + " fevrier " + str.substring(6, 10);
        case 3:
            return str.substring(0, 2) + " mars " + str.substring(6, 10);
        case 4:
            return str.substring(0, 2) + " avril " +  str.substring(6, 10);
        case 5:
            return str.substring(0, 2) + " mai " + str.substring(6, 10);
        case 6:
            return str.substring(0, 2) + " juin " + str.substring(6, 10);
        case 7:
            return str.substring(0, 2) + " juillet " + str.substring(6, 10);
        case 8:
            return str.substring(0, 2) + " août " + str.substring(6, 10);
        case 9:
            return str.substring(0, 2) + " septembre " + str.substring(6, 10);
        case 10:
            return str.substring(0, 2) + " octobre " + str.substring(6, 10);
        case 11:
            return str.substring(0, 2) + " novembre " + str.substring(6, 10);
        case 12:
            return str.substring(0, 2) + " décembre " + str.substring(6, 10);
    }
}

export function mois2(str) {

    switch(parseInt(str.substring(5, 7))) {
        case 1:
            return str.substring(8, 10) + " janvier " + str.substring(0, 4);
        case 2:
            return str.substring(8, 10) + " fevrier " + str.substring(0, 4);
        case 3:
            return str.substring(8, 10) + " mars " + str.substring(0, 4);
        case 4:
            return str.substring(8, 10) + " avril " +  str.substring(0, 4);
        case 5:
            return str.substring(8, 10) + " mai " + str.substring(0, 4);
        case 6:
            return str.substring(8, 10) + " juin " + str.substring(0, 4);
        case 7:
            return str.substring(8, 10) + " juillet " + str.substring(0, 4);
        case 8:
            return str.substring(8, 10) + " août " + str.substring(0, 4);
        case 9:
            return str.substring(8, 10) + " septembre " + str.substring(0, 4);
        case 10:
            return str.substring(8, 10) + " octobre " + str.substring(0, 4);
        case 11:
            return str.substring(8, 10) + " novembre " + str.substring(0, 4);
        case 12:
            return str.substring(8, 10) + " décembre " + str.substring(0, 4);
    }
}

export const colors = {
    danger: "#dd4c47",
    undef: '',
}

export function isAlertStockShow (produit) {
    if (parseInt(produit.en_stock) === 0) {
        var msgAlerteStock = getMsgAlerteStock(produit.designation, produit.en_stock);
        toastAlerteStock(msgAlerteStock, '#dd4c47');
    } else if (parseInt(produit.en_stock) <= parseInt(produit.min_rec)) {
        var msgAlerteStock = getMsgAlerteStock(produit.designation, produit.en_stock);
        toastAlerteStock(msgAlerteStock, '#FFB900');
    }
}

export function selectProd (val, liste) {
    return liste.filter(item => (item.id == val))[0];
}

export function currentDateString() {
    return mois(new Date().toLocaleDateString());
}

export function genererId() {
    // Fonction pour générer un identifiant unique pour une commande
    return Math.floor((1 + Math.random()) * 0x10000000)
           .toString(16)
           .substring(1);

}

export function filtrerListe(prop, val, liste) {
    return liste.filter(item => (item[prop].toLowerCase().includes(val.toLowerCase())));
}
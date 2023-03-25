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

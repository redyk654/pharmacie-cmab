export default function UseColorProd(stock, min_rec, color1, color2) {

    if (parseInt(stock) < parseInt(min_rec))
        return color1;
    else
        return color2;
}

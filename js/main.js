let cantCafe = 0;
let cantPancito = 0;
let cantAzucar = 0;
let cantManteca = 0;
let cantDDL = 0;

let precioCafe = 1000;
let precioPancito = 150;
let precioAzucar = 100;
let precioManteca = 650;
let precioDDL = 620;

let totalCompra = 0;

function eligeProducto(producto) {
    let cantidad;
    switch (producto) {
        case "1":
            cantidad = prompt("Ingrese la cantidad de unidades de 'Café' que desea.");
            cantCafe += cantidad;
            totalCompra += precioCafe * cantidad;
            break;
        case "2":
            cantidad = prompt("Ingrese la cantidad de unidades de 'Azúcar' que desea.");
            cantAzucar += cantidad;
            totalCompra += precioAzucar * cantidad;
            break;
        case "3":
            cantidad = prompt("Ingrese la cantidad de unidades de 'Pancito' que desea.");
            cantPancito += cantidad;
            totalCompra += precioPancito * cantidad;
            break;
        case "4":
            cantidad = prompt("Ingrese la cantidad de unidades de 'Manteca' que desea.");
            cantManteca += cantidad;
            totalCompra += precioManteca * cantidad;
            break;
        case "5":
            cantidad = prompt("Ingrese la cantidad de unidades de 'Dulce de leche' que desea");
            cantDDL += cantidad;
            totalCompra += precioDDL * cantidad;
            break;
        default:
            alert ("Opción no valida");
        break;
    }
}

function calculaTotalCompra() {
    let producto = prompt("Ingrese el producto que desea: \n 1 - Café ------------------ $1000\n 2 - Azúcar --------------- $100 \n 3 - Pancito --------------- $150\n 4 - Manteca -------------- $650 \n 5 - Dulce de leche -------- $620 \n 0 - Finalizar");
    while (producto != "0") {
        eligeProducto(producto);
        let producto = prompt("Ingrese el producto que desea: \n 1 - Café ------------------ $1000\n 2 - Azúcar --------------- $100 \n 3 - Pancito --------------- $150\n 4 - Manteca -------------- $650 \n 5 - Dulce de leche -------- $620 \n 0 - Finalizar");
    }
    alert("El total de su compra es: $" + totalCompra + " Productos ingresados: \nCafé: " + cantCafe + "\nAzúcar: " + cantAzucar + "\nPancito: " + cantPancito + "\nManteca: " + cantManteca + "\nDulce de Leche: " + cantDDL);
}


calculaTotalCompra();
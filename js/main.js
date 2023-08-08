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
            cantidad = parseInt(prompt("Ingrese la cantidad de unidades de 'Café' que desea."));
            cantCafe += cantidad;
            totalCompra += precioCafe * cantidad;
            break;
        case "2":
            cantidad = parseInt(prompt("Ingrese la cantidad de unidades de 'Azúcar' que desea."));
            cantAzucar += cantidad;
            totalCompra += precioAzucar * cantidad;
            break;
        case "3":
            cantidad = parseInt(prompt("Ingrese la cantidad de unidades de 'Pancito' que desea."));
            cantPancito += cantidad;
            totalCompra += precioPancito * cantidad;
            break;
        case "4":
            cantidad = parseInt(prompt("Ingrese la cantidad de unidades de 'Manteca' que desea."));
            cantManteca += cantidad;
            totalCompra += precioManteca * cantidad;
            break;
        case "5":
            cantidad = parseInt(prompt("Ingrese la cantidad de unidades de 'Dulce de leche' que desea"));
            cantDDL += cantidad;
            totalCompra += precioDDL * cantidad;
            break;
        default:
            alert ("Opción no valida");
        break;
    }
}

function calculaTotalCompra() {
    let producto = prompt("Ingrese el producto que desea: \n 1 - Café ------------------ $"+precioCafe+ "\n 2 - Azúcar --------------- $"+precioAzucar+ " \n 3 - Pancito --------------- $"+precioPancito+ "\n 4 - Manteca -------------- $"+precioManteca+ " \n 5 - Dulce de leche -------- $"+precioDDL+ " \n 0 - Finalizar");
    while (producto != "0") {
        eligeProducto(producto);
        producto = prompt("Ingrese el producto que desea: \n 1 - Café ------------------ $"+precioCafe+ "\n 2 - Azúcar --------------- $"+precioAzucar+ " \n 3 - Pancito --------------- $"+precioPancito+ "\n 4 - Manteca -------------- $"+precioManteca+ " \n 5 - Dulce de leche -------- $"+precioDDL+ " \n 0 - Finalizar \n\n Total de su compra: $"+totalCompra);
    }
    alert("El total de su compra es: $" + totalCompra + " \nProductos ingresados: \n Café: " + cantCafe + "\n Azúcar: " + cantAzucar + "\n Pancito: " + cantPancito + "\n Manteca: " + cantManteca + "\n Dulce de Leche: " + cantDDL+ "\n\nGracias por su visita! 😁");
}


calculaTotalCompra();
class Producto {
    constructor(nombre, caracteristica, precio, descuento, cant = 0, stock) {
        this.nombre = nombre;
        this.caracteristica = caracteristica;
        this.precio = precio;
        this.descuento = descuento;
        this.cant = cant;
        this.stock = stock;
    }
}

// class productoElegido {
//     constructor(nombre, caracteristica, precio, descuento, total = 0, cant = 0) {
//         this.nombre = nombre;
//         this.caracteristica = caracteristica;
//         this.precio = precio;
//         this.total = total;
//         this.descuento = descuento;
//         this.cant = cant;
//     }
// }

const producto1 = new Producto('Cabezada', 'Cuero', 80000, 0, 0, 5);
const producto2 = new Producto('Cabezada', 'Cuero crudo', 50000, 0, 0, 5);
const producto3 = new Producto('Cabezada', 'Plata', 120000, 0, 0, 2);
const producto4 = new Producto('Montura', 'Cuero', 60000, 0, 0, 10);
const producto5 = new Producto('Recado', 'Plata', 200000, 0, 0, 6);
const producto6 = new Producto('Montura chilena', 'Plata', 90000, 0, 0, 3);

const productosDisponibles = [producto1, producto2, producto3, producto4, producto5, producto6];
const productosElegidos = [];


// Funcion inicial --- el usuario debe elegir accion a realizar
function eligeOpcion() {
    let opcionAccion = -1;
    opcionAccion = prompt("Qué acción desea realizar? \n 1 - Buscar producto \n 2 - Ver listado de productos \n 3 - Finalizar");
    while (opcionAccion != '3'){
        while (opcionAccion != "1" && opcionAccion != "2" && opcionAccion != "3") {
            alert("Ingrese una opción válida entre 1, 2 y 3");
            opcionAccion = prompt("Qué acción desea realizar? \n 1 - Buscar producto \n 2 - Ver listado de productos \n 3 - Finalizar");
        }
        if (opcionAccion == '1') {
            busquedaDisponibles();
        }
        else if (opcionAccion=='2'){
            compra();
        }
        opcionAccion = prompt("Qué acción desea realizar? \n 1 - Buscar producto \n 2 - Ver listado de productos \n 3 - Finalizar");
    }
}

// Funcion compra --- el usuario elige productos para agregar al carrito
function compra() {
    let indice = 0;
    let i = 0;
    let listado = "";
    productosDisponibles.forEach((element, i) => {
        count = i + 1;
        listado += count + ". " + element.nombre + " " + element.caracteristica + "-------------- $" + element.precio + "\n";
    });
    let opcion = prompt("Ingrese el producto que desea: \n 0 - Finalizar \n" + listado);
    while (opcion != "0") {
        while (opcion < 0) {
            alert("El numero ingresado debe ser mayor a 0");
            opcion = prompt("Ingrese el producto que desea: \n " + listado);
        }
        cargaProductos(opcion, indice);
        indice++;
        opcion = prompt("Ingrese el producto que desea: \n 0 - Finalizar \n" + listado);
    }
    alert("El total de su compra es: $" + calculaTotalCompra() + " \nCarrito: \n" + muestraProductos());
    alert("Gracias por su visita! 😁")
}


// Funcion calcula total de los productos del carrito 
function calculaTotalCompra() {
    let totalCompra = 0;
    productosElegidos.forEach((element, i) => {
        totalCompra += element.precio;
    });
    return totalCompra;
}


// Funcion muestra productos del carrito
function muestraProductos() {
    let listadoElegidos = "";
    productosElegidos.forEach((element) => {
        listadoElegidos += element.cantidad + " " + element.nombre + " " +element.caracteristica + "-------------- $" + element.precio + "\n";
    });
    return listadoElegidos;
}


// Funcion ingresa productos al carrito
function cargaProductos(opcion, indice) {
    let cantidad;
    productosElegidos[indice] = {nombre: productosDisponibles[opcion - 1].nombre, caracteristica: productosDisponibles[opcion - 1].caracteristica, cantidad: 0, precio: 0};
    // productosElegidos[indice] = productosDisponibles[opcion - 1];
    cantidad = parseInt(prompt("Ingrese la cantidad de unidades de " + `${productosElegidos[indice].nombre} ${productosElegidos[indice].caracteristica}` + " que desea."));
    while (cantidad < 0){
        alert("Ingrese una cantidad mayor o igual 0");
        cantidad = parseInt(prompt("Ingrese la cantidad de unidades de " + `${productosElegidos[indice].nombre} ${productosElegidos[indice].caracteristica}` + " que desea."));
    }
    productosElegidos[indice].cantidad += cantidad;
    productosElegidos[indice].precio = productosElegidos[indice].cantidad * productosDisponibles[opcion - 1].precio;
    productosDisponibles[opcion - 1].stock = productosDisponibles[opcion - 1].stock - cantidad;
}


// Funcion busca producto ingresado por el usuario en los disponibles y los muestra
function busquedaDisponibles() {
    let productoBuscado = prompt("Ingrese su búsqueda:");
    while (productoBuscado.length == 0) {
        alert("Ingrese un producto o parte del mismo.");
        productoBuscado = prompt("Ingrese su búsqueda:");
    }
    let arrayBusqueda = buscaProducto(productosDisponibles, productoBuscado);
    if (arrayBusqueda.length > 0) {
        let listadoBuscados = "";
        arrayBusqueda.forEach((element) => {
            listadoBuscados += element.nombre + " " + element.caracteristica + "-------------- $" + element.precio + "\n";
        });
        alert("Los productos disponibles son los siguientes: \n" + listadoBuscados);
    }
}

function buscaProducto(productosDisponibles, productoBuscado) {
    return productosDisponibles.filter((el) => el.nombre.includes(productoBuscado));
}

eligeOpcion();

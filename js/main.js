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

// const producto1 = new Producto('Cabezada', 'Cuero', 80000, 0, 0, 5);
// const producto2 = new Producto('Cabezada', 'Cuero crudo', 50000, 0, 0, 5);
// const producto3 = new Producto('Cabezada', 'Plata', 120000, 0, 0, 2);
// const producto4 = new Producto('Montura', 'Cuero', 60000, 0, 0, 10);
// const producto5 = new Producto('Recado', 'Plata', 200000, 0, 0, 6);
// const producto6 = new Producto('Montura chilena', 'Plata', 90000, 0, 0, 3);

// const productosDisponibles = [producto1, producto2, producto3, producto4, producto5, producto6];
// const productosElegidos = [];
const carrito = document.getElementById('carrito');
const productosDisponibles = document.getElementById('lista-productos')
const carritoProductos = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');


eventslisteners();

function eventslisteners() {

    productosDisponibles.addEventListener('click', comprarProducto);

    //eliminar curso en el carrito
    carrito.addEventListener('click', eliminarProducto);

    //vaciar carrit de compras
    vaciarCarritoBtn.addEventListener('click', vaciarcarrito);

    //mostrar lista de cursos en carrito de compra al cargar DOM-LS
    document.addEventListener('DOMContentLoaded', leerLS);
}

function comprarProducto(e) {
    e.preventDefault();
    //delegation para agregar carrito
    if (e.target.classList.contains("agregar-carrito")) {
        const prod = e.target.parentElement.parentElement;
        //enviamos el producto seleccionado para tomar sus datos
        leeDatosProducto(prod);
    }
}

//Funcion lee datos del producto
function leeDatosProducto(prod) {
    const infoProducto = {
        imagen: prod.querySelector('img').src,
        nombre: prod.querySelector('h4').textContent,
        precio: prod.querySelector('.precio').textContent,
        // descuento:
        id: prod.querySelector('a').getAttribute('data-id')
    }

    insertaProducto(infoProducto);
}

// Funcion inserta producto en el carrito
function insertaProducto(prod) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><img src="${prod.imagen}" width="100"></td>
        <td>${prod.nombre}</td>
        <td>${prod.precio}</td>
        <td><a href="#" class="borrar-producto" data-id="${prod.id}">X</a></td>     
    `;
    carritoProductos.appendChild(row);
    guardarProdLocalStorage(prod);

    const total = document.getElementById('total-carrito');
    total.innerHTML = (parseFloat(total.innerHTML) + parseFloat(prod.precio)).toFixed(2);
}

//eliminar curso del carrito en el DOM
function eliminarProducto(e) {
    e.preventDefault();

    let prod, prodID;

    if (e.target.classList.contains('borrar-producto')) {
        e.target.parentElement.parentElement.remove();
    }
    prod = e.target.parentElement.parentElement;
    prodID = prod.querySelector('a').getAttribute('data-id');
    eliminarProdLS(prodID);
}

function guardarProdLocalStorage(producto) {
    let productos;
    productos = obtenerProductosLocalStorage();
    //El curso seleccionado se agrega al Array
    productos.push(producto);
    localStorage.setItem('productos', JSON.stringify(productos));
}

//comprobar que hayan elementos en el LS
function obtenerProductosLocalStorage() {
    let productosLS;
    //comprobamos si no hay naad o es nulo, creamos el array vacío
    // if (localStorage.getItem('productos') === null) {
    //     productosLS = [];
    // } else {
    //     productosLS = JSON.parse(localStorage.getItem('productos'));
    // }
    if (localStorage.getItem('productos') === null ? productosLS = [] : productosLS = JSON.parse(localStorage.getItem('productos')));
    return productosLS;
}


//pinta los productos desde LS en el carrito
// function leerLS() {
//     let productosLS;

//     productosLS = obtenerProductosLocalStorage();

//     productosLS.forEach(function (producto) {
//         //Construimos el template
//         const row = document.createElement("tr");
//         row.innerHTML = `
//         <td><img src="${producto.imagen}" width="100"></td>
//         <td>${producto.nombre}</td>
//         <td>${producto.precio}</td>
//         <td><a href="#" class="borrar-producto" data-id="${producto.id}">X</a></td>    
//     `;
//         carritoProductos.appendChild(row);
//     })
// }


//vacia Carrito
function vaciarcarrito() {
    while (carritoProductos.firstChild) {
        carritoProductos.removeChild(carritoProductos.firstChild);
    }
    //vaciar carrito  de LS
    vaciarLs();

    return false;
}


//eliminar producto del LS
function eliminarProdLS(producto) {
    let productosLS;
    //obtnemos el arreglo con los productos
    productosLS = obtenerProductosLocalStorage();
    //iteramo para buscar coincidencias y eliminar
    productosLS.forEach(function (productoLS, index) {
        if (productoLS.id === producto) {
            productosLS.splice(index, 1);
        }
    });

    localStorage.setItem('productos', JSON.stringify(productosLS));

}

//eliminar todos los productos del LS
function vaciarLs() {
    localStorage.clear();
}




/*
// Funcion inicial --- el usuario debe elegir accion a realizar
function eligeOpcion() {
    let opcionAccion = -1;
    opcionAccion = prompt("Qué acción desea realizar? \n 1 - Buscar producto \n 2 - Ver listado de productos \n 3 - Finalizar");
    while (opcionAccion != '3') {
        while (opcionAccion != "1" && opcionAccion != "2" && opcionAccion != "3") {
            alert("Ingrese una opción válida entre 1, 2 y 3");
            opcionAccion = prompt("Qué acción desea realizar? \n 1 - Buscar producto \n 2 - Ver listado de productos \n 3 - Finalizar");
        }
        if (opcionAccion == '1') {
            busquedaDisponibles();
        }
        else if (opcionAccion == '2') {
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
        listadoElegidos += element.cantidad + " " + element.nombre + " " + element.caracteristica + "-------------- $" + element.precio + "\n";
    });
    return listadoElegidos;
}


// Funcion ingresa productos al carrito
function cargaProductos(opcion, indice) {
    let cantidad;
    productosElegidos[indice] = { nombre: productosDisponibles[opcion - 1].nombre, caracteristica: productosDisponibles[opcion - 1].caracteristica, cantidad: 0, precio: 0 };
    // productosElegidos[indice] = productosDisponibles[opcion - 1];
    cantidad = parseInt(prompt("Ingrese la cantidad de unidades de " + `${productosElegidos[indice].nombre} ${productosElegidos[indice].caracteristica}` + " que desea."));
    while (cantidad < 0) {
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

// eligeOpcion();
*/

// const inputUser = document.querySelector('#user'),
// inputPass = document.querySelector('#pass'),
// check = document.querySelector('#check'),
// formulario = document.querySelector('#form-login'),
// message = document.querySelector('#message');

// function guardar(valor){
//     const user = {
//         usuario: inputUser.value,
//         pass: inputPass.value    
//         //validar que los campos no estén vacíos
//     }
//     if (valor == 'localStorage'){
//         localStorage.setItem('user', JSON.stringify(user));
//     }
//     if (valor == 'sessionStorage'){
//         localStorage.setItem('user', JSON.stringify(user));
//     }
// }

// formulario.addEventListener('submit', ()=>{

// })
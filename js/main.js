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
    actualizaTotalLocalStorage();
}

//eliminar producto del carrito en el DOM
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


function obtenerTotalLocalStorage() {
    const total = 0.00;
    if (localStorage.getItem('total') !== null) {
        return localStorage.getItem('total');
    }
    return total;
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

    if (localStorage.getItem('productos') === null ? productosLS = [] : productosLS = JSON.parse(localStorage.getItem('productos')));
    return productosLS;
}


// pinta los productos desde LS en el carrito
function leerLS() {
    let productosLS;

    productosLS = obtenerProductosLocalStorage();
    const total = document.getElementById('total-carrito');
    total.innerHTML = obtenerTotalLocalStorage();

    productosLS.forEach(function (producto) {
        //Construimos el template
        const row = document.createElement("tr");
        row.innerHTML = `
        <td><img src="${producto.imagen}" width="100"></td>
        <td>${producto.nombre}</td>
        <td>${producto.precio}</td>
        <td><a href="#" class="borrar-producto" data-id="${producto.id}">X</a></td>    
    `;
        carritoProductos.appendChild(row);
    })
    actualizaTotalLocalStorage();
}


//vacia Carrito
function vaciarcarrito() {
    while (carritoProductos.firstChild) {
        carritoProductos.removeChild(carritoProductos.firstChild);
    }
    //vaciar carrito  de LS
    vaciarLs();

    return false;
}

function actualizaTotalLocalStorage() {
    // Obtén la referencia a la tabla por su ID
    const tablaCarrito = document.getElementById("lista-carrito");

    // Obtén todas las filas de la tabla (excepto la primera fila que contiene las cabeceras)
    const filas = tablaCarrito.querySelectorAll("tbody tr");

    // Inicializa una variable para almacenar la suma de precios
    let total = 0;

    // Recorre las filas y suma los precios
    filas.forEach((fila) => {
        // Encuentra el elemento que contiene el precio en cada fila (suponiendo que esté en la tercera columna)
        const precioElement = fila.querySelector("td:nth-child(3)");
        // Obtén el precio como texto y conviértelo a número (elimina el signo "$" si es necesario)
        const precioTexto = precioElement.textContent.trim().replace("$", "");
        const precio = parseFloat(precioTexto);

        // Verifica si la conversión fue exitosa y suma el precio
        if (!isNaN(precio)) {
            total += precio;
        }
    });

    const totalCarrito = document.getElementById('total-carrito');
    totalCarrito.innerHTML = total.toFixed(2);
    // console.log("Total de precios:", total);
}

//eliminar producto del LS
function eliminarProdLS(producto) {
    let productosLS;
    let precio = 0;
    //obtnemos el arreglo con los productos
    productosLS = obtenerProductosLocalStorage();
    //iteramo para buscar coincidencias y eliminar
    productosLS.forEach(function (productoLS, index) {
        if (productoLS.id === producto) {
            precio = productoLS.precio;
            productosLS.splice(index, 1);
        }
    });

    localStorage.setItem('productos', JSON.stringify(productosLS));
    actualizaTotalLocalStorage();
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
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
    //El producto seleccionado se agrega al Array
    productos.push(producto);
    localStorage.setItem('productos', JSON.stringify(productos));
}

//devuelve los elementos que haya en el LS o un array vacio en caso de que no haya
function obtenerProductosLocalStorage() {
    const productosLS = JSON.parse(localStorage.getItem('productos')) || [];
    // if (localStorage.getItem('productos') === null ? productosLS = [] : productosLS = JSON.parse(localStorage.getItem('productos')));
    return productosLS;
}


// pinta los productos desde LS en el carrito
function leerLS() {
    let productosLS;

    productosLS = obtenerProductosLocalStorage();
    const total = document.getElementById('total-carrito');
    total.innerHTML = obtenerTotalLocalStorage();

    productosLS.forEach(function (producto) {
        
        //Desestructuracion
        const {imagen, nombre, precio, id} = producto;

        //Construimos el template
        const row = document.createElement("tr");
        row.innerHTML = `
        <td><img src="${imagen}" width="100"></td>
        <td>${nombre}</td>
        <td>${precio}</td>
        <td><a href="#" class="borrar-producto" data-id="${id}">X</a></td>    
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
        //Operador avanzado &&
        productoLS.id === producto && productosLS.splice(index, 1);
    });

    localStorage.setItem('productos', JSON.stringify(productosLS));
    actualizaTotalLocalStorage();
}

//eliminar todos los productos del LS
function vaciarLs() {
    localStorage.clear();
}




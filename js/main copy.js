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
const finalizarCompra = document.querySelector('#finalizar-compra');
const div_productos=document.getElementById("lista-productos");

eventslisteners();


// Llenado de productos
const llenarMain=(arr)=>{
    setTimeout(() => {  //para simular retraso desde la BD
        arr.forEach((elem) => {
            const {imagen,precio,nombre, descripcion, id}=elem
    
            div_productos.innerHTML += `
            <div class="col-lg-4">
                    <div class="card">
                        <img href="#" src="./img/${imagen}" class=" u-full-width img-carrito">
                        <div class="info-card">
                            <h4>${nombre}</h4>
                            <p>${descripcion}</p>
                            <img src="http://programacion.net/files/article/20160811120805_estrellas.png" width="50">
                            <p class="precio">$${precio}</p>
                            <!-- <span class="u-pull-right ">$15</span> -->
                            <a href="#" class="u-full-width button-primary button input agregar-carrito" data-id="${id}">Agregar
                                Al Carrito</a>
                        </div>
                    </div> <!--.card-->
            </div>
            `;
        })
    }, 1000);
}

// llamado a llenar main
fetch('../json/data.json')
    .then( (resp) => resp.json() )
    .then( (data) => {
        let productos;
        const {cabezadas, recados, monturas} = data;
        productos = cabezadas.concat(recados, monturas);
        llenarMain(productos);
        
})



function eventslisteners() {

    productosDisponibles.addEventListener('click', comprarProducto);

    //eliminar curso en el carrito
    carrito.addEventListener('click', eliminarProducto);

    //vaciar carrit de compras
    vaciarCarritoBtn.addEventListener('click', confirmacionVaciarCarrito);

    //finalizar compra
    finalizarCompra.addEventListener('click', finalizaCompra);

    //mostrar lista de cursos en carrito de compra al cargar DOM-LS
    document.addEventListener('DOMContentLoaded', leerLS);

    carritoProductos.addEventListener('click', (e) => {
        if (e.target.classList.contains('aumentar-cantidad')) {
            const inputCantidad = e.target.nextElementSibling;
            inputCantidad.value = parseInt(inputCantidad.value) + 1;
        }
    
        if (e.target.classList.contains('disminuir-cantidad')) {
            const inputCantidad = e.target.previousElementSibling;
            if (parseInt(inputCantidad.value) > 1) {
                inputCantidad.value = parseInt(inputCantidad.value) - 1;
            }
        }
        actualizaTotalLocalStorage();
    });

    
}

function comprarProducto(e) {
    e.preventDefault();
    //delegation para agregar carrito
    if (e.target.classList.contains("agregar-carrito")) {
        const prod = e.target.parentElement.parentElement;
        //enviamos el producto seleccionado para tomar sus datos
        leeDatosProducto(prod);
        Toastify({
            text: "Producto agregado al carrito",
            duration: 500,
            gravity: 'top',
            position: 'right',
        }).showToast();
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
    const {imagen, nombre, precio, id}=prod;
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><img src="${imagen}" width="100"></td>
        <td>${nombre}</td>
        <td>${precio}</td>
        <td>
            <div class="cantidad-control">
                <span class="disminuir-cantidad">-</span>
                <input type="number" class="cantidad-producto" value="1" min="1">
                <span class="aumentar-cantidad">+</span>
            </div>
        </td>
        <td class="precio-total">${precio}</td> <!-- Nuevo campo para el precio total -->
        <td><a href="#" class="borrar-producto" data-id="${id}">X</a></td>     
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
        const { imagen, nombre, precio, id } = producto;

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


function actualizaTotalLocalStorage() {
    // Obtén la referencia a la tabla por su ID
    const tablaCarrito = document.getElementById("lista-carrito");

    // Obtén todas las filas de la tabla (excepto la primera fila que contiene las cabeceras)
    const filas = tablaCarrito.querySelectorAll("tbody tr");

    // Inicializa una variable para almacenar el precio total del carrito
    let totalCarrito = 0;

    // Recorre las filas y actualiza el precio total de cada producto
    filas.forEach((fila) => {
        const cantidadElement = fila.querySelector(".cantidad-producto");
        const precioUnitarioElement = fila.querySelector("td:nth-child(3)");
        const precioTotalElement = fila.querySelector(".precio-total");

        const cantidad = parseInt(cantidadElement.value);
        const precioUnitarioTexto = precioUnitarioElement.textContent.trim().replace("$", "");
        const precioUnitario = parseFloat(precioUnitarioTexto);

        // Verifica si la conversión fue exitosa
        if (!isNaN(cantidad) && !isNaN(precioUnitario)) {
            const precioTotal = cantidad * precioUnitario;
            precioTotalElement.textContent = `$${precioTotal.toFixed(2)}`;
            totalCarrito += precioTotal;
        }
    });

    const totalCarritoElement = document.getElementById('total-carrito');
    totalCarritoElement.textContent = totalCarrito.toFixed(2);
    // console.log("Total del carrito:", totalCarrito);
}

// function actualizaTotalLocalStorage() {
//     // Obtén la referencia a la tabla por su ID
//     const tablaCarrito = document.getElementById("lista-carrito");

//     // Obtén todas las filas de la tabla (excepto la primera fila que contiene las cabeceras)
//     const filas = tablaCarrito.querySelectorAll("tbody tr");

//     // Inicializa una variable para almacenar la suma de precios
//     let total = 0;

//     // Recorre las filas y suma los precios
//     filas.forEach((fila) => {
//         // Encuentra el elemento que contiene el precio en cada fila (suponiendo que esté en la tercera columna)
//         const precioElement = fila.querySelector("td:nth-child(3)");
//         // Obtén el precio como texto y conviértelo a número (elimina el signo "$" si es necesario)
//         const precioTexto = precioElement.textContent.trim().replace("$", "");
//         const precio = parseFloat(precioTexto);

//         // Verifica si la conversión fue exitosa y suma el precio
//         if (!isNaN(precio)) {
//             total += precio;
//         }
//     });

//     const totalCarrito = document.getElementById('total-carrito');
//     totalCarrito.innerHTML = total.toFixed(2);
//     // console.log("Total de precios:", total);
// }

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

//vacia Carrito
function confirmacionVaciarCarrito() {
    const productos = obtenerProductosLocalStorage();
    if (productos.length > 0) {
        Swal.fire({
            title: 'Estás seguro que deseas vaciar el carrito?',
            text: "No podrás revertirlo",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si'
        }).then((result) => {
            if (result.isConfirmed) {
                vaciarCarrito();
                Swal.fire(
                    'Eliminado!',
                )
                // return false;
            }
        })
    }
    else {
        Swal.fire({
            title: 'No tienes productos en el carrito',
            icon: 'info'
        })
    }
}

function vaciarCarrito(){
    while (carritoProductos.firstChild) {
        carritoProductos.removeChild(carritoProductos.firstChild);
    }
    vaciarLs();
}

//eliminar todos los productos del LS
function vaciarLs() {
    actualizaTotalLocalStorage();
    localStorage.clear();
}


//finalizar compra
function finalizaCompra() {
    const productos = obtenerProductosLocalStorage();
    if (productos.length > 0) {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Compra realizada con éxito',
            showConfirmButton: false,
            timer: 1500
        })
        vaciarCarrito();
    }
    else {
        Swal.fire({
            title: 'No tienes productos en el carrito',
            icon: 'info'
        })
    }
}



//animacion agregar al carrito
// $('.agregar-carrito').on('click', function () {
//     var cart = $('.carrito');
//     var imgtodrag = $(this).parent('.item').find("img").eq(0);
//     if (imgtodrag) {
//         var imgclone = imgtodrag.clone()
//             .offset({
//             top: imgtodrag.offset().top,
//             left: imgtodrag.offset().left
//         })
//             .css({
//             'opacity': '0.5',
//                 'position': 'absolute',
//                 'height': '150px',
//                 'width': '150px',
//                 'z-index': '100'
//         })
//             .appendTo($('body'))
//             .animate({
//             'top': cart.offset().top + 10,
//                 'left': cart.offset().left + 10,
//                 'width': 75,
//                 'height': 75
//         }, 1000, 'easeInOutExpo');
        
//         setTimeout(function () {
//             cart.effect("shake", {
//                 times: 2
//             }, 200);
//         }, 1500);

//         imgclone.animate({
//             'width': 0,
//                 'height': 0
//         }, function () {
//             $(this).detach()
//         });
//     }
// });


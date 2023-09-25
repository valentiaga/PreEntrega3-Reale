const productosDisponibles = document.getElementById('lista-productos')
const carritoProductos = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const finalizarCompra = document.querySelector('#finalizar-compra');
const div_productos = document.getElementById("lista-productos");

eventslisteners();

// llamado a llenar main
fetch('../json/data.json')
    .then((resp) => resp.json())
    .then((data) => {
        let productos;
        const { cabezadas, recados, monturas } = data;
        productos = cabezadas.concat(recados, monturas);
        llenarMain(productos);

    })

// Llenado de productos
const llenarMain = (arr) => {
    setTimeout(() => {  //para simular retraso desde la BD
        arr.forEach((elem) => {
            const { imagen, precio, nombre, descripcion, id } = elem

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



function eventslisteners() {

    //mostrar lista de cursos en carrito de compra al cargar DOM-LS
    document.addEventListener('DOMContentLoaded', leerLS);

    productosDisponibles.addEventListener('click', comprarProducto);

    //vaciar carrit de compras
    vaciarCarritoBtn.addEventListener('click', confirmacionVaciarCarrito);

    //finalizar compra
    finalizarCompra.addEventListener('click', finalizaCompra);


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
        if (e.target.classList.contains('borrar-producto')) {
            eliminarProducto(e);
        }
        actualizaTotalLocalStorage();
    });
}


// pinta los productos desde LS en el carrito
function leerLS() {
    let productosLS;

    productosLS = obtenerProductosLocalStorage();
    console.log(productosLS);
    const total = document.getElementById('total-carrito');
    total.innerHTML = obtenerTotalLocalStorage();

    productosLS.forEach(function (producto) {

        //Desestructuracion
        const { imagen, nombre, precio, id, cantidad } = producto;

        //Construimos el template
        const row = document.createElement("tr");
        row.innerHTML = `
        <td><img src="${imagen}" width="100"></td>
        <td>${nombre}</td>
        <td>${precio}</td>
        <td>
            <div class="cantidad-control">
                <span class="aumentar-cantidad">+</span>
                <input type="number" class="cantidad-producto" value="${cantidad}" min="1">
                <span class="disminuir-cantidad">-</span>
            </div>
        </td>
        <td><a href="#" class="borrar-producto" data-id="${id}">X</a></td>       
    `;
        carritoProductos.appendChild(row);
    })
    actualizaTotalLocalStorage();
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

    let bandera = 0;
    let productosLS = obtenerProductosLocalStorage();
    productosLS.forEach((elem, i) => {
        if (elem.id == prod.querySelector('a').getAttribute('data-id') && bandera == 0) {
            elem.cantidad = parseInt(elem.cantidad) + 1;
            console.log("Cantidad de " + elem.nombre + " " + elem.cantidad);
            bandera = 1;
            localStorage.setItem('productos', JSON.stringify(productosLS));
            //actualizar cantidad en interfaz de usuario
            actualizaCantidadProducto(elem);
            actualizaTotalLocalStorage();
            i++;
        }
    });
    if (bandera == 0) {
        const infoProducto = {
            imagen: prod.querySelector('img').src,
            nombre: prod.querySelector('h4').textContent,
            precio: prod.querySelector('.precio').textContent,
            id: prod.querySelector('a').getAttribute('data-id'),
            cantidad: 1
        }
        insertaProducto(infoProducto);
    }
}

// Funcion inserta producto en el carrito
function insertaProducto(prod) {
    const { imagen, nombre, precio } = prod;
    const row = document.createElement('tr');
    row.innerHTML = `
            <td><img src="${imagen}" width="100"></td>
            <td>${nombre}</td>
            <td>${precio}</td>
            <td>
                <div class="cantidad-control">
                    <span class="aumentar-cantidad">+</span>
                    <input type="number" class="cantidad-producto" value="1" min="1">
                    <span class="disminuir-cantidad">-</span>
                </div>
            </td>
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

    e.target.parentElement.parentElement.remove();

    prod = e.target.parentElement.parentElement;
    prodID = prod.querySelector('a').getAttribute('data-id');
    eliminarProdLS(prodID);
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
    // actualizaTotalLocalStorage();
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
    productos.push(producto);
    localStorage.setItem('productos', JSON.stringify(productos));
}

//devuelve los elementos que haya en el LS o un array vacio en caso de que no haya
function obtenerProductosLocalStorage() {
    const productosLS = JSON.parse(localStorage.getItem('productos')) || [];
    return productosLS;
}



function actualizaCantidadProducto(prod) {
    const tablaCarrito = document.getElementById("lista-carrito");
    const filas = tablaCarrito.querySelectorAll("tbody tr");
    filas.forEach((fila) => {
        let cantidadElement = fila.querySelector(".cantidad-producto");
        let id = fila.querySelector("a").getAttribute('data-id');
        if (prod.id == id) {
            cantidadElement.value = parseInt(cantidadElement.value) + 1;
            const cantidad = parseInt(cantidadElement.value);
        }
    });
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
        let cantidadElement = fila.querySelector(".cantidad-producto");
        const precioUnitarioElement = fila.querySelector("td:nth-child(3)");
        // const precioTotalElement = fila.querySelector(".precio-total");
        if (cantidadElement) {

            // cantidadElement.value = parseInt(cantidadElement.value)+1;
            const cantidad = parseInt(cantidadElement.value);
            console.log("Cantidad:", cantidad);
            const precioUnitarioTexto = precioUnitarioElement.textContent.trim().replace("$", "");
            const precioUnitario = parseFloat(precioUnitarioTexto);

            // Verifica si la conversión fue exitosa
            if (!isNaN(cantidad) && !isNaN(precioUnitario)) {
                const precioTotal = cantidad * precioUnitario;
                // precioTotalElement.textContent = `$${precioTotal.toFixed(2)}`;
                totalCarrito += precioTotal;
            }
        }
    });

    const totalCarritoElement = document.getElementById('total-carrito');
    totalCarritoElement.innerHTML = totalCarrito.toFixed(2);
    console.log("Total del carrito:", totalCarrito);
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

function vaciarCarrito() {
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


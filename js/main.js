// let cantCafe = 0;
// let cantPancito = 0;
// let cantAzucar = 0;
// let cantManteca = 0;
// let cantDDL = 0;

// let precioCafe = 1000;
// let precioPancito = 150;
// let precioAzucar = 100;
// let precioManteca = 650;
// let precioDDL = 620;

// let totalCompra = 0;

// function eligeProducto(producto) {
//     let cantidad;
//     switch (producto) {
//         case "1":
//             cantidad = parseInt(prompt("Ingrese la cantidad de unidades de 'Café' que desea."));
//             cantCafe += cantidad;
//             totalCompra += precioCafe * cantidad;
//             break;
//         case "2":
//             cantidad = parseInt(prompt("Ingrese la cantidad de unidades de 'Azúcar' que desea."));
//             cantAzucar += cantidad;
//             totalCompra += precioAzucar * cantidad;
//             break;
//         case "3":
//             cantidad = parseInt(prompt("Ingrese la cantidad de unidades de 'Pancito' que desea."));
//             cantPancito += cantidad;
//             totalCompra += precioPancito * cantidad;
//             break;
//         case "4":
//             cantidad = parseInt(prompt("Ingrese la cantidad de unidades de 'Manteca' que desea."));
//             cantManteca += cantidad;
//             totalCompra += precioManteca * cantidad;
//             break;
//         case "5":
//             cantidad = parseInt(prompt("Ingrese la cantidad de unidades de 'Dulce de leche' que desea"));
//             cantDDL += cantidad;
//             totalCompra += precioDDL * cantidad;
//             break;
//         default:
//             alert ("Opción no valida");
//         break;
//     }
// }

// function calculaTotalCompra() {
//     let producto = prompt("Ingrese el producto que desea: \n 1 - Café ------------------ $"+precioCafe+ "\n 2 - Azúcar --------------- $"+precioAzucar+ " \n 3 - Pancito --------------- $"+precioPancito+ "\n 4 - Manteca -------------- $"+precioManteca+ " \n 5 - Dulce de leche -------- $"+precioDDL+ " \n 0 - Finalizar");
//     while (producto != "0") {
//         eligeProducto(producto);
//         producto = prompt("Ingrese el producto que desea: \n 1 - Café ------------------ $"+precioCafe+ "\n 2 - Azúcar --------------- $"+precioAzucar+ " \n 3 - Pancito --------------- $"+precioPancito+ "\n 4 - Manteca -------------- $"+precioManteca+ " \n 5 - Dulce de leche -------- $"+precioDDL+ " \n 0 - Finalizar \n\n Total de su compra: $"+totalCompra);
//     }
//     alert("El total de su compra es: $" + totalCompra + " \nProductos ingresados: \n Café: " + cantCafe + "\n Azúcar: " + cantAzucar + "\n Pancito: " + cantPancito + "\n Manteca: " + cantManteca + "\n Dulce de Leche: " + cantDDL+ "\n\nGracias por su visita! 😁");
// }


// calculaTotalCompra();

const carrito = document.getElementById('carrito');
const cursos = document.getElementById('lista-cursos');
const listaCursos = document.querySelector('#lista-carrito tbody')
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');

eventslisteners();

function eventslisteners() 
{
    //atento a cuando se presiona agregar carrito
    cursos.addEventListener('click', comprarCurso);

    //eliminar curso en el carrito
    carrito.addEventListener('click', eliminarCurso);

    //vaciar carrit de compras
    vaciarCarritoBtn.addEventListener('click', vaciarcarrito);

    //mostrar lista de cursos en carrito de compra al cargar DOM-LS
    document.addEventListener('DOMContentLoaded', leerLS)

}

function comprarCurso(e) 
{
    e.preventDefault();
    //delegation para agregar carrito
    if (e.target.classList.contains("agregar-carrito")) {
        const curso = e.target.parentElement.parentElement;
        //enviamos el curso seleccionado para tomar sus datos
        leerDatosCurso(curso);
    }    
}


//leer Datos del Curso
function leerDatosCurso(curso) {
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id')
    }

    insertarCurso(infoCurso);
}

// insertar Curso en el carrito
function insertarCurso(curso) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><img src="${curso.imagen}" width="100"></td>
        <td>${curso.titulo}</td>
        <td>${curso.precio}</td>
        <td><a href="#" class="borrar-curso" data-id="${curso.id}">X</a></td>    
    `;
    listaCursos.appendChild(row);
    guardarCursoLocalStorage(curso);

}

//eliminar curso del carrito en el DOM
function eliminarCurso(e) 
{
    e.preventDefault();

    let curso, cursoId;

    if (e.target.classList.contains('borrar-curso')) {
        e.target.parentElement.parentElement.remove(); 
    }  
    curso = e.target.parentElement.parentElement;
    cursoId = curso.querySelector('a').getAttribute('data-id');   
    eliminarCursoLS(cursoId);
}

//vacias Carrito
function vaciarcarrito() 
{
    //listaCursos.innerHTML = '';
    while(listaCursos.firstChild){
        listaCursos.removeChild(listaCursos.firstChild);
    }    
    //vaciar carrito  de LS
    vaciarLs();

    return false;    
}

//almacenar curso al LS
function guardarCursoLocalStorage(curso)
{
    let cursos;
    cursos = obtenerCursosLocalStorage();
    //El curso seleccionado se agrega al Array
    cursos.push(curso);
    localStorage.setItem('cursos', JSON.stringify(cursos));
}


//comprobar que hayan elementos en el LS
function obtenerCursosLocalStorage() 
{
    let cursosLS;
    //comprobamos si no hay naad o es nulo, creamos el array vacío
    if (localStorage.getItem('cursos') === null) {
        cursosLS = [];        
    } else {
        cursosLS = JSON.parse(localStorage.getItem('cursos'));
    }
    return cursosLS;
}

//pinta los cursos desde LS en el carrito
function leerLS() 
{
    let cursosLS;

    cursosLS = obtenerCursosLocalStorage();

    cursosLS.forEach(function (curso) {
        //Construimos el template
        const row = document.createElement("tr");
        row.innerHTML = `
        <td><img src="${curso.imagen}" width="100"></td>
        <td>${curso.titulo}</td>
        <td>${curso.precio}</td>
        <td><a href="#" class="borrar-curso" data-id="${curso.id}">X</a></td>    
    `;
        listaCursos.appendChild(row);

    })
}

//eliminar curso del LS
function eliminarCursoLS(curso) 
{
    let cursosLS;
    //obtnemos el arreglo con los cursos
    cursosLS = obtenerCursosLocalStorage();
    //iteramo para buscar coincidencias y eliminar
    cursosLS.forEach(function(cursoLS, index) {
      if (cursoLS.id === curso) {
        cursosLS.splice(index, 1);
      }
    });

    localStorage.setItem('cursos', JSON.stringify(cursosLS));

}

//eliminar todos los cursos del LS
function vaciarLs() {
    localStorage.clear();
}
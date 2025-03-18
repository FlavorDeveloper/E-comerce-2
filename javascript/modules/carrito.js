export function carrito() {
    /**
     * 1. DECLARACIÓN DE VARIABLES Y SELECTORES
     * Contiene todos los selectores y variables globales utilizados en el carrito.
     */
    const carrito = document.getElementById("carrito");
    const listaProductos = document.querySelectorAll('#lista-productos');
    const limpiarCarritoBtn = document.querySelector('#limpiar-carrito');
    const carBtn = document.querySelector('.fa-cart-shopping');
    const greenColor = getComputedStyle(document.documentElement).getPropertyValue('--addbtn-color');
    const vacioText = document.querySelector('.carrito-vacio-text');
    let productosCarrito = [];
    const DolarBolivarContainer = document.querySelector('.dolar-bolivar-container')
    let totalPrecio = document.querySelector('#total');
    let totalBolivares = document.querySelector('#total-bs');
    const horarioContainer = document.querySelector('.container-horario');

    /**
     * 2. EVENTOS
     * Se registran todos los eventos necesarios para el funcionamiento del carrito.
     */
    listaProductos.forEach(articulo => {
        articulo.addEventListener('click', agregarProducto);
    });
    
    limpiarCarritoBtn.addEventListener('click', limpiarCarrito);
    carrito.addEventListener('click', eraseProducto);
    document.addEventListener('DOMContentLoaded', recuperarCarrito);

    document.getElementById("enviar-whatsapp").addEventListener("click", enviarCarritoWhatsApp);
    document.getElementById("enviar-whatsapp2").addEventListener("click", enviarCarritoWhatsApp);

    /**
     * 3. FUNCIONES PRINCIPALES
     * Contiene las funciones clave para agregar o eliminar productos del carrito.
     */
    function agregarProducto(e) {
        e.preventDefault();
        if (e.target.classList.contains('add-to-cart')) {
            const productoSeleccionado = e.target.parentElement.parentElement;
            datosProducto(productoSeleccionado);
        }
    }
    
    function eraseProducto(e) {
        e.stopPropagation();
        if (e.target.classList.contains('item-erase')) {
            const productoId = e.target.getAttribute('data-id');
            const producto = productosCarrito.find(producto => producto.id === productoId);
            
            if (producto) {
                producto.cantidad--;
                if (producto.cantidad <= 0) {
                    productosCarrito = productosCarrito.filter(producto => producto.id !== productoId);
                }
                actualizarCarrito();
            }
        }
    }

    function limpiarCarrito() {
        productosCarrito = [];
        actualizarCarrito();
        localStorage.clear();
    }
    
    function recuperarCarrito() {
        const datosCarrito = JSON.parse(localStorage.getItem('carrito')) || { productos: [], total: 0 };
        productosCarrito = datosCarrito.productos;
        actualizarCarrito();
    }

    /**
     * 4. FUNCIONES AUXILIARES
     * Contiene funciones de cálculo de total, renderización, almacenamiento, etc.
     */
    function datosProducto(producto) {
        const infoProducto = {
            imagen: producto.querySelector('img').src,
            nombre: producto.querySelector('h2').textContent,
            precio: producto.querySelector('p.product-price').textContent,
            id: producto.querySelector('a').getAttribute('data-id'),
            cantidad: 1,
        };
        
        const existe = productosCarrito.some(articulo => articulo.id === infoProducto.id);
        if (existe) {
            productosCarrito = productosCarrito.map(productoItem => {
                if (productoItem.id === infoProducto.id) {
                    productoItem.cantidad++;
                }
                return productoItem;
            });
        } else {
            productosCarrito.push(infoProducto);
        }
        actualizarCarrito();
    }

    function actualizarCarrito() {
        limpiarHtml();
        renderCarrito();
        totalPrice();
        Bolivares();
        sincronizarStorage();
        actualizarColorYMovimiento();
    }
    
    function limpiarHtml() {
        const botonesContainer = document.querySelector('.vaciar-comprar-container');
        carrito.innerHTML = '';
        carrito.appendChild(botonesContainer);
        carrito.prepend(vacioText);
        vacioText.insertAdjacentElement("afterend", DolarBolivarContainer);
    }
    
    function renderCarrito() {
        productosCarrito.forEach(article => {
            const { imagen, nombre, precio, cantidad, id } = article;
            const obj = document.createElement('div');
            obj.innerHTML = `
                <div class="productos-item">
                    <img class="item-img" src="${imagen}">
                    <p class="item-nombre">${nombre}</p> 
                    <p class="item-precio">${precio}</p> 
                    <p class="item-cantidad">${cantidad} U</p> 
                    <p class="item-erase" data-id="${id}">✖︎</p> 
                </div>
            `;
            carrito.prepend(obj);
            vacioText.remove();
        });
        sincronizarStorage();
    }
    
    function totalPrice() {
        const total = productosCarrito.reduce((acumulador, producto) => {
            const precio = Number(producto.precio.replace('$', ''));
            return acumulador + (precio * producto.cantidad);
        }, 0);
        totalPrecio.textContent = 'Total $' + ' ' + total;
        return total;
    }

    async function Bolivares() {
        const tasaDolar = await obtenerBCV(); 
        
        const bolivares = productosCarrito.reduce((acumulador, producto) => {
            const precioDolares = Number(producto.precio.replace('$', '').trim());
            return acumulador + (precioDolares * producto.cantidad * tasaDolar);
        }, 0);
    
        // Formatear el número con separadores de miles
        const formateado = new Intl.NumberFormat('es-VE', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(bolivares);
    
        totalBolivares.textContent = `Total Bs ${formateado}`;
        return bolivares;
    }
    
    function sincronizarStorage() {
        const datosCarrito = { productos: productosCarrito, total$: totalPrice(), totalBs: Bolivares()};
        localStorage.setItem('carrito', JSON.stringify(datosCarrito));
    }
    
    function actualizarColorYMovimiento() {
        if (productosCarrito.length > 0) {
            carBtn.style.color = greenColor;
            carBtn.classList.add('shake');
        } else {
            carBtn.style.color = '';
            carBtn.classList.remove('shake');
        }
    }

    function cerrado(){
        const fechaActual = new Date();
        const diasDeLaSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        const diaSemana = diasDeLaSemana[fechaActual.getDay()]; // Obtiene el día de la semana (0-6)
        
        const horaActual = new Date();
        let horas = horaActual.getHours();

        if ((diaSemana !== 'domingo') && (horas >= 8 && horas < 20)) {
            return true; // Se puede enviar
        } else {
            return false; // No se puede enviar
        }
    }
    
    function enviarCarritoWhatsApp() {

        if(!cerrado()){
            horarioContainer.style.display = 'flex';
            setTimeout(() => {
                horarioContainer.style.display = 'none';
            }, 3000);
            return;
        }

        const numeroWhatsApp = "12345678";
        let finalMessage = "";
        
        // Paso 1: Comprobar si el carrito está vacío
        if (productosCarrito.length === 0) {
            // Carrito vacío: se envía un mensaje básico sin datos extra
            finalMessage = "Hola, necesito información.";
        } else {
            // Paso 2: Armar el mensaje completo para un carrito con productos
            let mensaje = "Hola! Quiero comprar:\n\n";
            productosCarrito.forEach(producto => {
                mensaje += `${producto.nombre}\nPrecio: ${producto.precio}\nCantidad: ${producto.cantidad}\n\n`;
            });
            let precio = `${totalPrecio.textContent}\n`;
            let precioBs = `${totalBolivares.textContent}\n\n`
            let datosUsuario = `Nombre:\nTipo de pago:\nDelivery:\n\n`;
            
            // Concatenar todas las partes en el mensaje final
            finalMessage = mensaje + precio + precioBs + datosUsuario;
        }
        
        // Paso 3: Codificar el mensaje final y abrir WhatsApp
        const finalMessageEncoded = encodeURIComponent(finalMessage);
        window.open(`https://wa.me/${numeroWhatsApp}?text=${finalMessageEncoded}`, "_blank");
    }

    async function obtenerBCV() {
        const url = 'https://pydolarve.org/api/v1/dollar?page=bcv';
    
        try {
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();
            const precioDollar = resultado.monitors.usd.price;
            return precioDollar;
        } catch (error) {
            console.error('Error al obtener la tasa del dólar:', error);
            return null; // Devuelve null en caso de error
        }
    }
}

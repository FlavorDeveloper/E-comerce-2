export function showCarrito () {
    // Selectores y variables.
    const carritoBtn = document.querySelector('.car-btn');
    const carritoContainer = document.querySelector('.shop-conatiner');
    const body = document.querySelector('body');
    
    // Eventos.
    carritoBtn.addEventListener('click', mostrarCarrito);
    body.addEventListener('click', cerrarCarrito);
    window.addEventListener('scroll',cerrarCarrito);
    
    // Funciones.
    function mostrarCarrito (e) {
        e.stopPropagation();
        carritoContainer.classList.toggle('shop-conatiner--active');
    };

    function cerrarCarrito(e) {
        // Si el evento es scroll, simplemente cierra el carrito
        if (e.type === 'scroll') {
            carritoContainer.classList.remove('shop-conatiner--active');
            return;
        }
    
        // Si el clic se realizó en el botón "add-to-cart" o dentro de él, no cerrar.
        if (e.target.closest('.add-to-cart')) {
            return;
        }
        
        // Verificar que el clic NO sea en el botón del carrito ni dentro del contenedor
        if (!e.target.closest('.shop-conatiner') && e.target !== carritoBtn) {
            carritoContainer.classList.remove('shop-conatiner--active');
        }
    }
};

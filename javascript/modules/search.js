export function search() {
// Selectores y variables.

    const inputSearch = document.querySelector('#search');
    const allProductos = document.querySelectorAll('.product-card');
    const banners = document.querySelectorAll('.banner-container');
    const noFound = document.querySelector('.no-encontrado'); // Asegúrate de que está en el HTML
// Eventos.

    inputSearch.addEventListener('input', captarProductos);
// Funciones.

    function captarProductos(e) {
        const termino = e.target.value.toLowerCase().trim();
        const idsVistos = new Set();
        let hayCoincidencias = false; // ✅ Reiniciar en cada búsqueda

        // Si el input está vacío
        if (termino === '') {
            allProductos.forEach(item => item.classList.remove('oculto'));
            banners.forEach(banner => banner.classList.remove('oculto'));
            noFound.style.display = 'none';
            return;
        }

        // Procesar productos
        allProductos.forEach(item => {
            const nombreProducto = item.querySelector('.product-name').dataset.producto.toLowerCase();
            const coincide = nombreProducto.includes(termino);
            const idProducto = item.querySelector('.add-to-cart').dataset.id;

            if (idsVistos.has(idProducto)) {
                item.classList.add('oculto');
                return;
            }

            if (coincide) {
                item.classList.remove('oculto');
                idsVistos.add(idProducto);
                hayCoincidencias = true; // ✅ Actualizar estado
            } else {
                item.classList.add('oculto');
            }
        });

        // Mostrar mensaje después de procesar TODOS los productos
        if (hayCoincidencias) {
            noFound.style.display = 'none';
        } else {
            noFound.style.display = 'block';
        }
        eliminarBanners();
    }

    function eliminarBanners() {
        banners.forEach(banner => {
            const idValue = banner.getAttribute('id');
            banner.classList.toggle('oculto', idValue !== 'todos');
        });
    }
}
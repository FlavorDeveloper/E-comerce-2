export function zoomImg() {
    const productCards = document.querySelectorAll('.product-card');
    const body = document.querySelector('body');

    body.addEventListener('click', (event) => {
        // Click en imagen de un producto específico
        if (event.target.classList.contains('product-image')) {
            const card = event.target.closest('.product-card');
            productCards.forEach(c => c.classList.remove('product-card--active')); // Cerrar otras
            card.classList.add('product-card--active');
        }
        // Click en botón de cerrar
        else if (event.target.classList.contains('fa-circle-xmark')) {
            const card = event.target.closest('.product-card');
            card.classList.remove('product-card--active');
        }
        // Click fuera de las cards
        else {
            productCards.forEach(card => {
                if (card.classList.contains('product-card--active')) {
                    card.classList.remove('product-card--active');
                }
            });
        }
    });
}
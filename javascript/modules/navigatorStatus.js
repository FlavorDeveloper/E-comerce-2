export function navigatorStatus() {
// Selectores y variables.
    const status = document.querySelector('.status-container');
    const statusParagraph = document.querySelector('.status-paragraph');

// Eventos.
    window.addEventListener('online', actualizarEstado);
    window.addEventListener('offline', actualizarEstado);

// Funciones.
    function actualizarEstado () {
        if(navigator.onLine){
            status.style.marginBottom = '0rem';
            status.style.backgroundColor = 'var(--addbtn-color)';
            statusParagraph.innerHTML = 'En línea <i class="fa-solid fa-fade fa-wifi"></i>';
            setTimeout(() => {
                status.style.marginBottom = '-40rem'
            }, 5000);
        }else{
            status.style.marginBottom = '0rem';
            statusParagraph.innerHTML = 'Sin conexion <i class="fa-solid fa-fade fa-wifi fa-wifi--red"></i>';
            status.style.backgroundColor = 'var(--texts-color)';
            setTimeout(() => {
                status.style.marginBottom = '-40rem'
            }, 5000);
        };
    };
};

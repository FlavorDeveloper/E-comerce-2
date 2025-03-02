export function addBtn () {
// Selectores y variables.
    const addCartBtn  = document.querySelectorAll('.add-to-cart');
    const root        = document.documentElement;
    const textsColor2 = getComputedStyle(root).getPropertyValue('--background-color').trim();
    const textos      = document.querySelector('.add-to-cart').textContent;
    const addBtnColor = getComputedStyle(root).getPropertyValue('--addbtn-color');

// Eventos.
    addCartBtn.forEach(boton => {
        boton.addEventListener('click', (e) => {
            boton.style.backgroundColor = addBtnColor;
            boton.style.color = textsColor2;
            boton.textContent = 'Listo ✔︎';
            const padre = e.target.parentElement.parentElement;
            padre.style.backgroundColor = `${addBtnColor}`;

            setTimeout(() => {
                boton.style.backgroundColor = ""; 
                boton.style.color = ""; 
                boton.textContent = textos;
                padre.style.backgroundColor = '';
            }, 2000);
        });
    });
};

contenedor = document.getElementById('container');

contenedor.innerHTML = "<button id='cambiar_fondo'> cambiar modo oscuro </button>";

boton = document.getElementById('cambiar_fondo') //variable que apunta al boton 

boton.addEventListener('click', function(){
    document.body.style.backgroundColor = 'skyblue';
});
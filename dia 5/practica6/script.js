
lista = new Array("images/producto2.jpg", "images/producto3.jpg", "images/producto1.jpg"); /*lista[0] = imagen cargada en html*/ 
galeria = document.getElementById('galeria');


indice = 0;
function cambiarImagen(event){
    if (event.target.id == "btn-siguiente"){
        x = 1;
    } else{
        x = -1;
    }
    indice = indice + x;  

    if (indice >= lista.length){
        indice = 0;
    } else if (indice < 0){        
        indice = lista.length - 1; 
    }
    galeria.src = lista[indice];
}

botonAnterior = document.getElementById('btn-anterior')
botonAnterior.addEventListener('click', cambiarImagen)
botonSiguiente = document.getElementById('btn-siguiente')
botonSiguiente.addEventListener('click', cambiarImagen)



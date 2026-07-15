var contenido = document.getElementById('contenido');
document.getElementById('agrandar').addEventListener('click', function() {
    var actual = parseInt(getComputedStyle(contenido).fontSize);
    contenido.style.fontSize = (actual + 2)+'px';
});

document.getElementById('achicar').addEventListener('click', function() {
    var actual = parseInt(getComputedStyle(contenido).fontSize);
    contenido.style.fontSize = (actual - 2)+'px';
});
var TELEFONO = '595981000000'; // tu numero con codigo de pais
var productos = document.querySelectorAll('.producto');
productos.forEach(function(producto){
    producto.addEventListener('click', function() {
        var nombre = producto.getAttribute('data-nombre1');
        var precio = producto.getAttribute('data-nombre2');
        var mensaje = 'Hola, me interesa: ' + nombre + ', ' + precio;
        var url = 'https://wa.me/' + TELEFONO+ '?text=' + encodeURIComponent(mensaje);
        window.open(url, '_blank');
    });
});


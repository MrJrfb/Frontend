document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('menu-icon-open');
    const iconClose = document.getElementById('menu-icon-close');

    if (menuBtn && mobileMenu && iconOpen && iconClose) {
        menuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenu.classList.contains('hidden');
            
            if (isExpanded) {
                mobileMenu.classList.remove('hidden');
                menuBtn.setAttribute('aria-expanded', 'true');
                iconOpen.classList.add('hidden');
                iconClose.classList.remove('hidden');
            } else {
                mobileMenu.classList.add('hidden');
                menuBtn.setAttribute('aria-expanded', 'false');
                iconOpen.classList.remove('hidden');
                iconClose.classList.add('hidden');
            }
        });

        // Cerrar menú al hacer click en una opción
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuBtn.setAttribute('aria-expanded', 'false');
                iconOpen.classList.remove('hidden');
                iconClose.classList.add('hidden');
            });
        });
    }
});

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Seleccionar los elementos clave del DOM
    const cotizadorSection = document.querySelector('#cotizador');
    const totalDisplay = document.getElementById('total-cotizacion');

    // Salir del script si los elementos esenciales no existen en la página actual
    if (!cotizadorSection || !totalDisplay) return;

    // 2. Función principal para calcular y actualizar el total
    function calcularTotal() {
        // Buscar el plan base que esté seleccionado actualmente
        const planSeleccionado = cotizadorSection.querySelector('input[name="plan_base"]:checked');
        
        // Validación obligatoria por si no hay ningún plan elegido
        if (!planSeleccionado) {
            totalDisplay.textContent = 'Selecciona un plan para comenzar';
            return;
        }

        // Inicializar la suma con el precio del plan base (convertido a entero)
        let total = parseInt(planSeleccionado.getAttribute('data-precio'), 10) || 0;

        // Buscar todos los checkboxes de extras que estén marcados
        const extrasMarcados = cotizadorSection.querySelectorAll('input[type="checkbox"]:checked');
        
        // Sumar el valor de cada extra al total
        extrasMarcados.forEach(checkbox => {
            const precioExtra = parseInt(checkbox.getAttribute('data-precio'), 10) || 0;
            total += precioExtra;
        });

        // 3. Formatear el total con separadores de miles usando el estándar regional (es-PY)
        const totalFormateado = new Intl.NumberFormat('es-PY', {
            style: 'decimal',
            useGrouping: true
        }).format(total);

        // Actualizar el texto en el panel de resumen
        totalDisplay.textContent = `${totalFormateado} Gs`;
    }

    // 4. Asignar los escuchadores de eventos (addEventListener)
    // Escuchar cambios ('change') en cualquier input (radio o checkbox) dentro de la sección del cotizador
    cotizadorSection.addEventListener('change', (event) => {
        if (event.target.matches('input[name="plan_base"]') || event.target.matches('input[type="checkbox"]')) {
            calcularTotal();
        }
    });

    // 5. Ejecución inicial para calcular el valor por defecto al cargar la página (ej: el plan Landing premarcado)
    calcularTotal();
});

// Asegurar que el código corra dentro del DOMContentLoaded global si ya lo tenías abierto
document.addEventListener('DOMContentLoaded', () => {

    const formulario = document.getElementById('presupuesto-form');
    const alertaBox = document.getElementById('form-alerta');

    if (!formulario || !alertaBox) return;

    // Función auxiliar para mostrar alertas de éxito o error
    function mostrarAlerta(mensaje, tipo) {
        alertaBox.textContent = mensaje;
        alertaBox.classList.remove('hidden', 'bg-red-500/10', 'text-red-400', 'border-red-500/30', 'bg-emerald-500/10', 'text-emerald-400', 'border-emerald-500/30', 'border');
        
        if (tipo === 'error') {
            alertaBox.classList.add('bg-red-500/10', 'text-red-400', 'border', 'border-red-500/30');
        } else if (tipo === 'exito') {
            alertaBox.classList.add('bg-emerald-500/10', 'text-emerald-400', 'border', 'border-emerald-500/30');
        }
        
        // Auto-scroll sutil hacia la alerta para que sea visible
        alertaBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Escuchador del evento de envío
    formulario.addEventListener('submit', (event) => {
        // 1. Evitar la recarga por defecto de la página
        event.preventDefault();

        // 2. Capturar valores limpiando espacios en blanco innecesarios
        const nombre = document.getElementById('form-nombre').value.trim();
        const correo = document.getElementById('form-correo').value.trim();
        const telefono = document.getElementById('form-telefono').value.trim();
        const plan = document.getElementById('form-plan').value;
        const mensaje = document.getElementById('form-mensaje').value.trim();

        // 3. Validación: Campos Obligatorios Vacíos
        if (!nombre || !correo || !telefono || !plan) {
            mostrarAlerta('Por favor, completa todos los campos marcados como obligatorios (*).', 'error');
            return;
        }

        // 4. Validación: Formato de Correo Electrónico (Regex estándar)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            mostrarAlerta('Por favor, ingresa un correo electrónico válido (ejemplo@dominio.com).', 'error');
            return;
        }

        // 5. Validación: Teléfono básico (Mínimo de dígitos razonable)
        if (telefono.length < 6) {
            mostrarAlerta('Por favor, ingresa un número de teléfono o WhatsApp válido.', 'error');
            return;
        }

        // 6. ¡Éxito! Si pasa todas las validaciones
        mostrarAlerta('✓ ¡Solicitud enviada con éxito! Nos comunicaremos contigo en la brevedad para enviarte el presupuesto.', 'exito');
        
        // Limpiar/Resetear los campos del formulario tras el éxito
        formulario.reset();
    });
});
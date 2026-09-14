/**
 * CUSTOM TECHNICAL CURSOR ENGINE
 * Punto rojo + anillo de mira reactivo.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Desactivar estrictamente si el dispositivo es táctil o no soporta puntero fino (móviles, tablets)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let dot = document.getElementById('cursorDot');
    let ring = document.getElementById('cursorRing');

    if (!dot) {
        dot = document.createElement('div');
        dot.id = 'cursorDot';
        dot.className = 'custom-cursor-dot';
        document.body.appendChild(dot);
    }

    if (!ring) {
        ring = document.createElement('div');
        ring.id = 'cursorRing';
        ring.className = 'custom-cursor-ring';
        document.body.appendChild(ring);
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isVisible = false;

    // Actualización instantánea de las coordenadas del ratón
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isVisible) {
            isVisible = true;
            dot.style.opacity = '1';
            ring.style.opacity = '1';
        }

        // El punto rojo se mueve inmediatamente con el puntero
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }, { passive: true });

    // Ocultar cursor cuando sale de la ventana del navegador
    document.addEventListener('mouseleave', () => {
        isVisible = false;
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
    });

    // Animación fluida con interpolación lineal (Lerp) para el anillo exterior
    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Delegación de eventos global para detectar elementos interactivos dinámicos
    const interactiveSelectors = 'a, button, .loop-node, .garage-card, .tarjeta-horizontal-garage, .tarjeta-stack-3d, code, input, textarea';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            ring.classList.add('expanded');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            ring.classList.remove('expanded');
        }
    });
});
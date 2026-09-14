/**
 * MAIN ENTRYPOINT & SYSTEM INITIALIZER
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('/// SG-RACETRACK v1.0 INITIALIZED');
    console.log('/// ENGINE: JAVA / SPRING BOOT READY');

    // 1. Manejo del estado idle en la dona circular
    const track = document.getElementById('mainTrack');
    let scrollTimeout;

    if (track) {
        // Asegura que la dona inicie en modo reposo/rotación suave por defecto
        track.classList.add('idle');

        window.addEventListener('scroll', () => {
            // Remueve temporalmente la rotación suave constante durante el scroll activo
            track.classList.remove('idle');
            clearTimeout(scrollTimeout);

            // Reanuda el estado en reposo 1 segundo después de detener el scroll
            scrollTimeout = setTimeout(() => {
                track.classList.add('idle');
            }, 1000);
        }, { passive: true });
    }

    // 2. Navegación fluida para botones del Hero y enlaces del HUD
    const heroButtons = document.querySelectorAll('.hero-actions a, .hud-header a, .nav-link');
    
    heroButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');

            // Solo intercepta si es una ancla interna válida
            if (href && href.startsWith('#') && href.length > 1) {
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    e.preventDefault();
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});
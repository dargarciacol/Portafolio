/**
 * MAIN — comportamiento común de las páginas con barra Bootstrap
 */
document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const menu = document.getElementById('menuPrincipal');

    // Desplazamiento suave a anclas internas y cierre del menú móvil al elegir una opción
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href.length < 2) return;
            const target = document.getElementById(href.slice(1));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
            if (menu && menu.classList.contains('show') && window.bootstrap) {
                window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
            }
        });
    });
});

/**
 * NAVEGACIÓN — scrollspy
 * Marca como activo el enlace de la barra superior cuya sección está visible.
 * (La versión anterior movía una "rotonda" circular que no existe en ninguna página.)
 */
document.addEventListener('DOMContentLoaded', () => {
    const links = Array.from(document.querySelectorAll('.navbar .nav-link[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    const byId = new Map(links.map((l) => [l.getAttribute('href').slice(1), l]));
    const sections = Array.from(byId.keys()).map((id) => document.getElementById(id)).filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((l) => l.removeAttribute('aria-current'));
            byId.get(entry.target.id)?.setAttribute('aria-current', 'true');
        });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

    sections.forEach((s) => observer.observe(s));
});

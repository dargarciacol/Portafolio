/**
 * NAVIGATION ENGINE — RACING LOOP
 * Vincula el scroll y los clics de la dona con las secciones.
 */
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('mainTrack');
    const nodes = document.querySelectorAll('.loop-node');
    const sections = document.querySelectorAll('.circuit-section, .seccion-circuito');

    // Ángulos exactos de rotación para cada sección (grados)
    const sectionAngles = {
        'start': 0,
        'garage': -51.4,
        'nova': -102.8,
        'backend-lab': -154.2,
        'telemetry': -205.6,
        'about': -257,
        'pit-wall': -308.4
    };

    /**
     * Actualiza la rotación de la dona y el estado visual de los nodos/secciones
     */
    function navigateToSection(sectionId) {
        if (!sectionAngles.hasOwnProperty(sectionId)) return;

        // 1. Girar el circuito con clase de aceleración
        const angle = sectionAngles[sectionId];
        if (track) {
            track.classList.add('shifting');
            track.style.transform = `rotate(${angle}deg)`;
        }

        // 2. Resaltar nodo activo en la dona
        nodes.forEach(node => {
            if (node.dataset.section === sectionId) {
                node.classList.add('active');
            } else {
                node.classList.remove('active');
            }
        });

        // 3. Activar/Enfocar la sección en pantalla
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }

    // --- EVENTO 1: Clic en los números de la dona ---
    nodes.forEach(node => {
        node.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = node.dataset.section;
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                navigateToSection(targetId);
            }
        });
    });

    // --- EVENTO 2: Detectar Scroll automáticamente (IntersectionObserver) ---
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -40% 0px', // Activa cuando la sección entra al centro
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.id) {
                navigateToSection(entry.target.id);
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Inicializar en la sección inicial si existe
    if (sections.length > 0) {
        const initialId = sections[0].id || 'start';
        navigateToSection(initialId);
    }
});
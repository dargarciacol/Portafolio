/**
 * ANIMATION ENGINE & 3D GRAPHICS (Three.js + Tilt FX)
 * Maneja los efectos tridimensionales y animaciones de scroll.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. INICIALIZACIÓN DE THREE.JS (Donas 3D en tarjetas Stack)
    initThreeCanvas();

    // 2. EFECTO TILT 3D EN TARJETAS (Garage & Nova)
    initCardTiltEffect();

    // 3. REVELADO AL HACER SCROLL (Fade & Slide)
    initScrollReveal();
});

/**
 * Monta las donas 3D en los 3 canvas del Stack Tecnológico.
 */
function initThreeCanvas() {
    if (typeof THREE === 'undefined') return;

    // Configuración para cada canvas individual
    const stackNodes = [
        { id: 'canvas-3d-backend', color: 0x38bdf8 },  // Rojo
        { id: 'canvas-3d-frontend', color: 0x0dcaf0 }, // Cían
        { id: 'canvas-3d-devops', color: 0x6c757d }    // Gris
    ];

    stackNodes.forEach(node => {
        const canvas = document.getElementById(node.id);
        if (!canvas) return;

        const parent = canvas.parentElement;

        // Escena y Cámara
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            50, 
            parent.clientWidth / parent.clientHeight || 1, 
            0.1, 
            1000
        );
        camera.position.z = 3.5;

        // Renderizador ligado directamente al canvas del HTML
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            alpha: true, 
            antialias: true 
        });
        
        const width = parent.clientWidth || 200;
        const height = parent.clientHeight || 150;
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Creación de la Dona (TorusGeometry)
        const geometry = new THREE.TorusGeometry(1, 0.35, 16, 100);
        const material = new THREE.MeshBasicMaterial({
            color: node.color,
            wireframe: true,
            transparent: true,
            opacity: 0.85
        });

        const dona = new THREE.Mesh(geometry, material);
        scene.add(dona);

        // Bucle de animación (Rotación continua)
        function animate() {
            requestAnimationFrame(animate);

            dona.rotation.x += 0.008;
            dona.rotation.y += 0.012;

            renderer.render(scene, camera);
        }
        animate();

        // Responsive Canvas al redimensionar la ventana
        window.addEventListener('resize', () => {
            const newWidth = parent.clientWidth;
            const newHeight = parent.clientHeight;

            if (newWidth > 0 && newHeight > 0) {
                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(newWidth, newHeight);
            }
        });
    });
}

/**
 * Añade perspectiva 3D realista a las tarjetas interactivas al mover el cursor.
 * Desactiva el efecto en dispositivos táctiles para evitar conflictos de rendimiento o gestos.
 */
function initCardTiltEffect() {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouchDevice || reduceMotion) return;

    // Solo tarjetas pequeñas: inclinar tarjetas grandes con texto dificulta la lectura
    const cards = document.querySelectorAll('.tarjeta-stack-3d');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });
}

/**
 * Animación suave de entrada para elementos al hacer scroll.
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.circuit-section, .garage-card, .diag-node, .tarjeta-stack-3d');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));
}
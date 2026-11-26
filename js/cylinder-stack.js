/**
 * CYLINDER STACK 3D ENGINE — Rotor con Imágenes Locales Personalizadas (Corregido)
 */
// Las rutas de los iconos se calculan respecto a este archivo: funcionan desde cualquier página.
const CYLINDER_SCRIPT_SRC = document.currentScript && document.currentScript.src;
const iconUrl = (name) => new URL('../assets/icons/' + name, CYLINDER_SCRIPT_SRC).href;

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas-cilindro-stack');
    const container = document.getElementById('contenedor-cilindro-3d');
    const telemetriaRotacion = document.getElementById('telemetria-rotacion');

    if (!canvas || !container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
        45, 
        container.clientWidth / container.clientHeight, 
        0.1, 
        1000
    );
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const techNodes = [
        { name: "JAVA", level: "CORE SE", color: "#f89820", img: iconUrl("images (2).png") },
        { name: "SPRING BOOT", level: "REST APIs", color: "#6db33f", img: iconUrl("images (3).png") },
        { name: "POSTGRESQL", level: "DATABASE", color: "#336791", img: iconUrl("images (4).png") },
        { name: "NODE.JS", level: "BACKEND", color: "#68a063", img: iconUrl("images (5).png") },
        { name: "REST APIS", level: "ARCHITECTURE", color: "#38bdf8", img: iconUrl("images (9).png") },
        { name: "PYTHON", level: "SCRIPTING", color: "#3776ab", img: iconUrl("images (6).png") },
        { name: "GIT", level: "VERSION CTRL", color: "#f05032", img: iconUrl("images (8).png") }
    ];

    const cylinderGroup = new THREE.Group();
    scene.add(cylinderGroup);

    const radius = 2.8;
    const totalNodes = techNodes.length;

    // Crear cada nodo de forma independiente asegurando la carga de su imagen
    techNodes.forEach((tech, index) => {
        const angle = (index / totalNodes) * Math.PI * 2;

        const nodeCanvas = document.createElement('canvas');
        nodeCanvas.width = 256;
        nodeCanvas.height = 128;
        const ctx = nodeCanvas.getContext('2d');

        // Dibujar estructura base de la tarjeta HUD de inmediato
        function renderCard(imageElement = null) {
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, 256, 128);

            ctx.strokeStyle = tech.color;
            ctx.lineWidth = 4;
            ctx.strokeRect(3, 3, 250, 122);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 18px monospace';
            ctx.textAlign = 'left';
            ctx.fillText(tech.name, 96, 52);

            ctx.fillStyle = tech.color;
            ctx.font = '11px monospace';
            ctx.fillText(`// ${tech.level}`, 96, 78);

            // Si la imagen cargó correctamente, la dibujamos a la izquierda
            if (imageElement) {
                ctx.drawImage(imageElement, 16, 32, 64, 64);
            }

            // Crear textura para Three.js
            const canvasTexture = new THREE.CanvasTexture(nodeCanvas);
            canvasTexture.generateMipmaps = true;
            canvasTexture.minFilter = THREE.LinearMipmapLinearFilter;

            const geometry = new THREE.PlaneGeometry(1.8, 0.9);
            const material = new THREE.MeshBasicMaterial({ 
                map: canvasTexture, 
                transparent: true,
                side: THREE.DoubleSide 
            });

            const mesh = new THREE.Mesh(geometry, material);
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            
            mesh.position.set(x, 0, z);
            mesh.rotation.y = angle;

            cylinderGroup.add(mesh);
        }

        // Carga segura usando Image() nativo para evitar fallos de sincronía en el Canvas 2D
        const imgObj = new Image();
                imgObj.onload = () => {
            renderCard(imgObj);
        };
        imgObj.onerror = () => {
            console.warn(`No se pudo cargar la imagen local: ${tech.img}. Renderizando tarjeta sin imagen.`);
            renderCard(null); // Renderiza la tarjeta con texto aunque falle la imagen
        };
        imgObj.src = tech.img;
    });

    const ringGeometry = new THREE.TorusGeometry(radius, 0.03, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.4 });
    
    const ringTop = new THREE.Mesh(ringGeometry, ringMaterial);
    ringTop.rotation.x = Math.PI / 2;
    ringTop.position.y = 1.1;
    scene.add(ringTop);

    const ringBottom = new THREE.Mesh(ringGeometry, ringMaterial);
    ringBottom.rotation.x = Math.PI / 2;
    ringBottom.position.y = -1.1;
    scene.add(ringBottom);

    // Rendimiento y accesibilidad: no animar fuera de pantalla ni con 'reducir movimiento'
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isVisible = true;
    new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; }, { threshold: 0 }).observe(container);

    let isDragging = false;
    let previousMouseX = 0;
    let targetRotationY = 0;
    let currentRotationY = 0;
    let velocityY = 0;

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMouseX = e.clientX;
        container.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - previousMouseX;
        velocityY = deltaX * 0.0025;
        targetRotationY += velocityY;
        previousMouseX = e.clientX;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'grab';
    });

    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        previousMouseX = e.touches[0].clientX;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaX = e.touches[0].clientX - previousMouseX;
        velocityY = deltaX * 0.0025;
        targetRotationY += velocityY;
        previousMouseX = e.touches[0].clientX;
    }, { passive: true });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });

    function animate() {
        requestAnimationFrame(animate);
        if (!isVisible || document.hidden) return;

        if (!isDragging) {
            velocityY *= 0.92;
            targetRotationY += (reduceMotion ? 0 : 0.0008) + velocityY;
        }

        currentRotationY += (targetRotationY - currentRotationY) * 0.08;
        cylinderGroup.rotation.y = currentRotationY;

        if (telemetriaRotacion) {
            const degrees = Math.round((currentRotationY * (180 / Math.PI)) % 360);
            telemetriaRotacion.innerText = `${degrees >= 0 ? degrees : degrees + 360}°`;
        }

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;

        if (width > 0 && height > 0) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }
    });
});
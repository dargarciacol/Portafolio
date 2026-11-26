/**
 * UTILIDADES DE INTERFAZ (telemetry.js)
 * Antes simulaba ping, CPU y estado "ONLINE" con números aleatorios. Se retiró: esos valores
 * no eran mediciones reales y podían interpretarse como tales. Se conserva la interacción útil.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Clic para copiar en elementos marcados con data-copy (p. ej. endpoints de ejemplo)
    document.querySelectorAll('[data-copy]').forEach((node) => {
        node.style.cursor = 'pointer';
        node.title = 'Clic para copiar';
        node.addEventListener('click', () => {
            navigator.clipboard?.writeText(node.dataset.copy || node.textContent.trim()).catch(() => {});
            node.classList.add('copiado');
            setTimeout(() => node.classList.remove('copiado'), 450);
        });
    });
});

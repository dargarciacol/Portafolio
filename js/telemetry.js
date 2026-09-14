/**
 * TELEMETRY & DIAGNOSTIC SYSTEM (Unificado)
 * Simula el monitoreo en tiempo real del motor backend y métricas del sistema.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Simulación de latencia en vivo para el indicador de la API
    const apiMetricValue = document.querySelector('#telemetry .metric-value.live, #metric-api-value, #telemetria-db');
    const pingEl = document.getElementById('telemetria-ping');
    const cpuEl = document.getElementById('telemetria-cpu');
    const uptimeEl = document.getElementById('telemetria-uptime');

    let seconds = 0;

    // Cronómetro de uptime del sistema
    setInterval(() => {
        seconds++;
        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;
        if (uptimeEl) {
            uptimeEl.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }, 1000);

    // Bucle de métricas en tiempo real
    setInterval(() => {
        // Latencia / Ping realista para Spring Boot / Node.js
        const randomPing = Math.floor(Math.random() * (42 - 22 + 1)) + 22;
        if (pingEl) {
            pingEl.innerText = `${randomPing}ms`;
        }

        // Carga de CPU simulada
        if (cpuEl) {
            const randomCpu = (Math.random() * (19.5 - 12.0) + 12.0).toFixed(1);
            cpuEl.innerText = `${randomCpu}%`;
        }

        // Estado de la API / Base de datos
        if (apiMetricValue) {
            apiMetricValue.innerHTML = `<span class="status-indicator active"></span> ONLINE (${randomPing}ms)`;
            apiMetricValue.style.color = "#198754";
        }
    }, 3000);

    // 2. Interacción y copiado rápido para los endpoints en BACKEND LAB
    const endpoints = document.querySelectorAll('.endpoint-board code, .codigo-endpoint');
    endpoints.forEach(endpoint => {
        endpoint.style.cursor = 'pointer';
        endpoint.title = 'Clic para copiar endpoint';

        endpoint.addEventListener('click', () => {
            const originalText = endpoint.innerText;
            
            // Copiar el texto del endpoint al portapapeles
            navigator.clipboard.writeText(originalText).catch(() => {});

            // Retroalimentación visual al hacer clic
            endpoint.style.borderColor = 'var(--rojo-hud, #dc3545)';
            endpoint.style.backgroundColor = 'rgba(220, 53, 69, 0.15)';
            
            setTimeout(() => {
                endpoint.style.borderColor = '';
                endpoint.style.backgroundColor = '';
            }, 450);
        });
    });

    // 3. Animación escalonada (Stagger) para bloques diagnósticos
    const diagNodes = document.querySelectorAll('.diag-node, .tarjeta-stack-3d');
    diagNodes.forEach((node, index) => {
        node.style.transitionDelay = `${index * 0.08}s`;
    });
});
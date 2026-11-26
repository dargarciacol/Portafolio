/**
 * CERTIFICACIONES — render desde assets/docs/certificaciones.json
 * Uso: <div data-certifications data-category="backend,general"></div>
 * Todo el contenido se inserta con textContent / atributos validados (sin innerHTML).
 * Las rutas se resuelven respecto a este archivo, así funciona desde cualquier página.
 */
(function () {
    const SCRIPT_SRC = document.currentScript && document.currentScript.src;
    if (!SCRIPT_SRC) return;
    const PROJECT_ROOT = new URL('../', SCRIPT_SRC);
    const JSON_URL = new URL('assets/docs/certificaciones.json', PROJECT_ROOT);

    const el = (tag, cls, text) => {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text !== undefined) n.textContent = text;
        return n;
    };

    /** Solo https, o rutas que queden dentro del proyecto (la URL se normaliza, así que "../" no escapa). */
    function safeUrl(value) {
        if (typeof value !== 'string' || !value.trim()) return null;
        if (/(^|[\\/])\.\.([\\/]|$)/.test(value)) return null; // rutas con ".." no permitidas
        try {
            const u = new URL(value.trim(), PROJECT_ROOT);
            if (u.protocol === 'https:' || u.href.startsWith(PROJECT_ROOT.href)) return u.href;
        } catch (e) { /* URL inválida */ }
        return null;
    }

    function formatDate(raw) {
        if (!raw) return null;
        const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(String(raw));
        if (!m) return String(raw);
        const d = new Date(Date.UTC(+m[1], +m[2] - 1, +(m[3] || 1)));
        return d.toLocaleDateString('es-CO', { timeZone: 'UTC', year: 'numeric', month: 'long', ...(m[3] ? { day: 'numeric' } : {}) });
    }

    function row(label, value, pendingText) {
        const wrap = el('div', 'cert-row');
        wrap.append(el('dt', 'cert-label', label));
        wrap.append(el('dd', value ? 'cert-value' : 'cert-value cert-pending', value || pendingText));
        return wrap;
    }

    function button(label, href, download) {
        const a = el('a', 'cert-btn', label);
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        if (download) a.setAttribute('download', '');
        return a;
    }

    function card(c) {
        const art = el('article', 'cert-card');
        art.append(el('h3', 'cert-title', c.nombre));
        art.append(el('p', 'cert-inst', c.institucion || 'Institución pendiente'));

        const dl = el('dl', 'cert-meta');
        dl.append(row('Expedición', formatDate(c.fechaExpedicion), 'pendiente'));
        dl.append(row('ID', c.identificador && String(c.identificador), 'pendiente'));
        art.append(dl);

        const actions = el('div', 'cert-actions');
        const doc = safeUrl(c.documento);
        const ver = c.enlaceVerificacion && /^https:\/\//i.test(c.enlaceVerificacion) ? safeUrl(c.enlaceVerificacion) : null;
        if (doc) {
            actions.append(button('Ver certificado', doc, false));
            actions.append(button('Descargar', doc, true));
        } else {
            actions.append(el('span', 'cert-pending', 'Documento pendiente'));
        }
        if (ver) actions.append(button('Verificar', ver, false));
        else actions.append(el('span', 'cert-pending', 'Verificación pendiente'));
        art.append(actions);
        return art;
    }

    let dataPromise = null;
    const load = () => dataPromise || (dataPromise = fetch(JSON_URL, { cache: 'no-cache' })
        .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }));

    function render(container, data) {
        const wanted = (container.dataset.category || '').split(',').map((s) => s.trim()).filter(Boolean);
        const list = (Array.isArray(data.certificaciones) ? data.certificaciones : [])
            .filter((c) => c && typeof c.nombre === 'string' && c.nombre.trim())
            .filter((c) => !wanted.length || wanted.includes(c.categoria || 'general') || (c.categoria || 'general') === 'general');
        if (!list.length) {
            container.replaceChildren(el('p', 'cert-empty', 'Certificaciones en proceso de registro. Se publicarán aquí cuando estén verificadas.'));
            return;
        }
        const grid = el('div', 'cert-grid');
        list.forEach((c) => grid.append(card(c)));
        container.replaceChildren(grid);
    }

    function init() {
        const containers = document.querySelectorAll('[data-certifications]');
        if (!containers.length) return;
        load().then((data) => containers.forEach((c) => render(c, data)))
            .catch(() => containers.forEach((c) => c.replaceChildren(
                el('p', 'cert-empty', 'No se pudieron cargar las certificaciones. Si abriste el archivo directamente, usa un servidor local (ver README).'))));
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

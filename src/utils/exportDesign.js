import {
    APP_INFO,
    EXPORT_TYPES,
    EXPORT_FILE_PREFIXES,
    EXPORT_MIME_TYPES,
    DEFAULT_TEXT_CONTENT,
    BUSINESS_DEFAULTS,
} from "../constants/appConstants.js";

import {
    createExportableDesignState,
} from "../data/defaultDesignState.js";

import {
    formatEstimatorPrice,
    estimateKickOffBoxPrice,
    createCommercialReport,
    createReadableEstimateSummary,
    formatEstimateForExport,
} from "./priceEstimator.js";

import {
    prepareConfiguratorForScene,
    getConfiguratorCommercialSummary,
    createConfiguratorSnapshot,
    validateConfiguratorState,
} from "../services/configuratorService.js";

export const EXPORT_DESIGN_VERSION = "1.0.0";

export const EXPORT_FORMATS = Object.freeze({
    JSON: "json",
    PNG: "png",
    JPEG: "jpeg",
    WEBP: "webp",
    PDF_PRINT: "pdf-print",
    HTML_REPORT: "html-report",
    SUMMARY_TXT: "summary-txt",
});

export const IMAGE_EXPORT_QUALITY = Object.freeze({
    LOW: 0.72,
    MEDIUM: 0.84,
    HIGH: 0.92,
    ULTRA: 0.98,
});

export const EXPORT_TARGETS = Object.freeze({
    DOWNLOAD: "download",
    BLOB: "blob",
    DATA_URL: "data-url",
    CLIPBOARD: "clipboard",
    PRINT: "print",
});

export const EXPORT_STATUS = Object.freeze({
    READY: "ready",
    EXPORTED: "exported",
    FAILED: "failed",
    UNSUPPORTED: "unsupported",
});

export const REPORT_SECTIONS = Object.freeze({
    COVER: "cover",
    DESIGN: "design",
    PRICE: "price",
    CONTENT: "content",
    TECHNICAL: "technical",
    COMMERCIAL: "commercial",
    VALIDATION: "validation",
});

export const DEFAULT_EXPORT_OPTIONS = Object.freeze({
    imageFormat: EXPORT_FORMATS.PNG,
    imageQuality: IMAGE_EXPORT_QUALITY.HIGH,
    includeState: true,
    includeScenePayload: true,
    includeCommercialSummary: true,
    includePricing: true,
    includeValidation: true,
    includeScreenshot: true,
    includeCustomerData: false,
    prettyJson: true,
    filePrefix: EXPORT_FILE_PREFIXES.DESIGN,
});

function nowISO() {
    return new Date().toISOString();
}

function padNumber(value) {
    return String(value).padStart(2, "0");
}

function slugify(value = "") {
    return String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
        .slice(0, 90);
}

function safeText(value = "") {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function isPlainObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cloneDeep(value) {
    if (typeof structuredClone === "function") {
        try {
            return structuredClone(value);
        } catch {
            return cloneDeepFallback(value);
        }
    }

    return cloneDeepFallback(value);
}

function cloneDeepFallback(value) {
    if (Array.isArray(value)) {
        return value.map((item) => cloneDeepFallback(item));
    }

    if (isPlainObject(value)) {
        return Object.fromEntries(
            Object.entries(value).map(([key, item]) => [key, cloneDeepFallback(item)]),
        );
    }

    return value;
}

function getDateStamp(date = new Date()) {
    return [
        date.getFullYear(),
        padNumber(date.getMonth() + 1),
        padNumber(date.getDate()),
    ].join("-");
}

function getTimeStamp(date = new Date()) {
    return [
        padNumber(date.getHours()),
        padNumber(date.getMinutes()),
        padNumber(date.getSeconds()),
    ].join("-");
}

function getMimeTypeForFormat(format = EXPORT_FORMATS.PNG) {
    if (format === EXPORT_FORMATS.JPEG) return "image/jpeg";
    if (format === EXPORT_FORMATS.WEBP) return "image/webp";
    if (format === EXPORT_FORMATS.PNG) return "image/png";
    if (format === EXPORT_FORMATS.JSON) return "application/json";
    if (format === EXPORT_FORMATS.HTML_REPORT) return "text/html";
    if (format === EXPORT_FORMATS.SUMMARY_TXT) return "text/plain";

    return "application/octet-stream";
}

function getExtensionForFormat(format = EXPORT_FORMATS.JSON) {
    if (format === EXPORT_FORMATS.JPEG) return "jpg";
    if (format === EXPORT_FORMATS.PDF_PRINT) return "html";
    if (format === EXPORT_FORMATS.HTML_REPORT) return "html";
    if (format === EXPORT_FORMATS.SUMMARY_TXT) return "txt";

    return format;
}

function getBlobFromCanvas(canvas, format = EXPORT_FORMATS.PNG, quality = IMAGE_EXPORT_QUALITY.HIGH) {
    return new Promise((resolve, reject) => {
        if (!canvas || typeof canvas.toBlob !== "function") {
            reject(new Error("El canvas no está disponible para exportación."));
            return;
        }

        const mimeType = getMimeTypeForFormat(format);

        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("No se pudo generar la imagen desde el canvas."));
                    return;
                }

                resolve(blob);
            },
            mimeType,
            quality,
        );
    });
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = filename;
    anchor.rel = "noopener";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    return {
        filename,
        size: blob.size,
        type: blob.type,
    };
}

function createTextBlob(content, mimeType = "text/plain") {
    return new Blob([content], {
        type: `${mimeType};charset=utf-8`,
    });
}

function createJsonBlob(payload, pretty = true) {
    const json = JSON.stringify(payload, null, pretty ? 2 : 0);

    return createTextBlob(json, EXPORT_MIME_TYPES.JSON ?? "application/json");
}

function createExportFilename(options = {}) {
    const date = new Date();
    const projectName = options.projectName ?? DEFAULT_TEXT_CONTENT.FRONT_LABEL ?? APP_INFO.SHORT_NAME;
    const prefix = options.prefix ?? EXPORT_FILE_PREFIXES.DESIGN;
    const format = options.format ?? EXPORT_FORMATS.JSON;
    const extension = options.extension ?? getExtensionForFormat(format);
    const slug = slugify(projectName) || "kickoff-box";

    return `${prefix}-${slug}-${getDateStamp(date)}-${getTimeStamp(date)}.${extension}`;
}

function resolveRendererCanvas(rendererOrCanvas) {
    if (!rendererOrCanvas) return null;

    if (rendererOrCanvas instanceof HTMLCanvasElement) {
        return rendererOrCanvas;
    }

    if (rendererOrCanvas.domElement instanceof HTMLCanvasElement) {
        return rendererOrCanvas.domElement;
    }

    if (rendererOrCanvas.canvas instanceof HTMLCanvasElement) {
        return rendererOrCanvas.canvas;
    }

    return null;
}

function resolveRenderTargetCanvas(input = {}) {
    return (
        resolveRendererCanvas(input.renderer) ??
        resolveRendererCanvas(input.canvas) ??
        resolveRendererCanvas(input.domElement) ??
        null
    );
}

function normalizeExportOptions(options = {}) {
    return {
        ...DEFAULT_EXPORT_OPTIONS,
        ...options,
        imageQuality: Number.isFinite(options.imageQuality)
            ? Math.min(Math.max(options.imageQuality, 0.1), 1)
            : DEFAULT_EXPORT_OPTIONS.imageQuality,
    };
}

function createExportMetadata(options = {}) {
    return {
        type: "kickoff-box-export",
        version: EXPORT_DESIGN_VERSION,
        appName: APP_INFO.NAME,
        appVersion: APP_INFO.VERSION,
        format: options.format,
        generatedAt: nowISO(),
        locale: APP_INFO.DEFAULT_LOCALE,
        currency: APP_INFO.CURRENCY,
    };
}

export function createDesignExportPayload(state, options = {}) {
    const normalized = normalizeExportOptions(options);
    const exportableState = normalized.includeState
        ? createExportableDesignState(state)
        : null;

    const validation = normalized.includeValidation
        ? validateConfiguratorState(state)
        : null;

    const commercialSummary = normalized.includeCommercialSummary
        ? getConfiguratorCommercialSummary(state)
        : null;

    const scenePayload = normalized.includeScenePayload
        ? prepareConfiguratorForScene(state, {
            pricing: options.pricing,
        })
        : null;

    const pricing = normalized.includePricing
        ? estimateKickOffBoxPrice({
            state,
            quantity: state.customer?.orderQuantity,
            urgency: state.price?.urgency,
            delivery: state.price?.delivery,
        })
        : null;

    return {
        metadata: createExportMetadata({
            format: EXPORT_FORMATS.JSON,
        }),
        project: cloneDeep(state.project ?? {}),
        product: cloneDeep(state.product ?? {}),
        customer: normalized.includeCustomerData ? cloneDeep(state.customer ?? {}) : null,
        state: exportableState,
        scenePayload,
        commercialSummary,
        pricing: pricing ? formatEstimateForExport(pricing) : null,
        validation,
    };
}

export function exportDesignJson(state, options = {}) {
    const normalized = normalizeExportOptions(options);
    const payload = createDesignExportPayload(state, normalized);
    const filename = options.filename ?? createExportFilename({
        prefix: EXPORT_FILE_PREFIXES.DESIGN,
        projectName: state.project?.projectName,
        format: EXPORT_FORMATS.JSON,
    });

    const blob = createJsonBlob(payload, normalized.prettyJson);

    if (options.target === EXPORT_TARGETS.BLOB) {
        return {
            status: EXPORT_STATUS.EXPORTED,
            filename,
            blob,
            payload,
        };
    }

    const download = downloadBlob(blob, filename);

    return {
        status: EXPORT_STATUS.EXPORTED,
        filename,
        payload,
        download,
    };
}

export function createDesignSnapshotFile(state, options = {}) {
    const snapshot = createConfiguratorSnapshot(state, {
        includeScenePayload: options.includeScenePayload !== false,
    });

    const filename = options.filename ?? createExportFilename({
        prefix: "kickoff-box-snapshot",
        projectName: state.project?.projectName,
        format: EXPORT_FORMATS.JSON,
    });

    const blob = createJsonBlob(snapshot, options.prettyJson !== false);

    return {
        status: EXPORT_STATUS.EXPORTED,
        filename,
        blob,
        snapshot,
    };
}

export async function exportRenderImage(input = {}) {
    const options = normalizeExportOptions(input);
    const canvas = resolveRenderTargetCanvas(input);
    const format = input.format ?? options.imageFormat ?? EXPORT_FORMATS.PNG;
    const quality = input.quality ?? options.imageQuality;
    const filename = input.filename ?? createExportFilename({
        prefix: EXPORT_FILE_PREFIXES.IMAGE,
        projectName: input.projectName ?? input.state?.project?.projectName,
        format,
    });

    if (!canvas) {
        return {
            status: EXPORT_STATUS.FAILED,
            error: "No se encontró canvas o renderer para exportar la imagen.",
        };
    }

    try {
        const blob = await getBlobFromCanvas(canvas, format, quality);

        if (input.target === EXPORT_TARGETS.BLOB) {
            return {
                status: EXPORT_STATUS.EXPORTED,
                filename,
                blob,
                format,
                quality,
            };
        }

        const download = downloadBlob(blob, filename);

        return {
            status: EXPORT_STATUS.EXPORTED,
            filename,
            blob,
            format,
            quality,
            download,
        };
    } catch (error) {
        return {
            status: EXPORT_STATUS.FAILED,
            filename,
            format,
            quality,
            error: error.message,
        };
    }
}

export async function exportRenderPng(input = {}) {
    return exportRenderImage({
        ...input,
        format: EXPORT_FORMATS.PNG,
        quality: IMAGE_EXPORT_QUALITY.ULTRA,
    });
}

export async function exportRenderJpeg(input = {}) {
    return exportRenderImage({
        ...input,
        format: EXPORT_FORMATS.JPEG,
        quality: input.quality ?? IMAGE_EXPORT_QUALITY.HIGH,
    });
}

export async function exportRenderWebp(input = {}) {
    return exportRenderImage({
        ...input,
        format: EXPORT_FORMATS.WEBP,
        quality: input.quality ?? IMAGE_EXPORT_QUALITY.HIGH,
    });
}

export function createPlainTextSummary(state, options = {}) {
    const estimate = estimateKickOffBoxPrice({
        state,
        quantity: state.customer?.orderQuantity,
        urgency: state.price?.urgency,
        delivery: state.price?.delivery,
    });

    const lines = [
        "KICKOFF BOX - RESUMEN DEL DISEÑO",
        "===================================",
        "",
        `Proyecto: ${state.project?.projectName ?? "Sin nombre"}`,
        `Destinatario: ${state.project?.recipientName ?? "No definido"}`,
        `Equipo: ${state.project?.teamName ?? "No definido"}`,
        `Carrera: ${state.project?.career ?? APP_INFO.CAREER}`,
        `Universidad: ${state.project?.university ?? APP_INFO.UNIVERSITY}`,
        "",
        "Producto",
        "--------",
        `Versión: ${state.product?.preset ?? "No definido"}`,
        `Plantilla: ${state.product?.templateId ?? "No definido"}`,
        `Tema: ${state.product?.themeId ?? "No definido"}`,
        `Bebida: ${state.beverage?.labelText ?? state.beverage?.type ?? "No definida"}`,
        `QR: ${state.qr?.enabled ? "Activo" : "Inactivo"}`,
        "",
        "Precio",
        "------",
        `Precio unitario: ${formatEstimatorPrice(estimate.totals.unitSalePrice)}`,
        `Cantidad: ${estimate.product.quantity}`,
        `Descuento: ${estimate.totals.discountPercent}%`,
        `Total estimado: ${formatEstimatorPrice(estimate.totals.total)}`,
        `Margen estimado: ${estimate.margin.grossMarginPercent}%`,
        `Clasificación: ${estimate.accessibility.label}`,
        "",
        "Mensaje",
        "-------",
        state.project?.message ?? "Sin mensaje definido",
        "",
        "Resumen",
        "-------",
        createReadableEstimateSummary(estimate),
        "",
        `Generado: ${nowISO()}`,
    ];

    if (options.includeBreakdown) {
        lines.push("", "Desglose", "--------");

        estimate.breakdown.forEach((item) => {
            lines.push(`- ${item.label}: ${formatEstimatorPrice(item.amount)}`);
        });
    }

    return lines.join("\n");
}

export function exportPlainTextSummary(state, options = {}) {
    const content = createPlainTextSummary(state, {
        includeBreakdown: options.includeBreakdown ?? true,
    });

    const filename = options.filename ?? createExportFilename({
        prefix: EXPORT_FILE_PREFIXES.SUMMARY,
        projectName: state.project?.projectName,
        format: EXPORT_FORMATS.SUMMARY_TXT,
    });

    const blob = createTextBlob(content, "text/plain");

    if (options.target === EXPORT_TARGETS.BLOB) {
        return {
            status: EXPORT_STATUS.EXPORTED,
            filename,
            blob,
            content,
        };
    }

    const download = downloadBlob(blob, filename);

    return {
        status: EXPORT_STATUS.EXPORTED,
        filename,
        content,
        download,
    };
}

function renderTableRows(items = []) {
    return items.map((item) => `
        <tr>
            <td>${safeText(item.label)}</td>
            <td>${safeText(item.category ?? "-")}</td>
            <td class="num">${safeText(formatEstimatorPrice(item.amount ?? 0))}</td>
        </tr>
    `).join("");
}

function renderValidationList(validation) {
    if (!validation) return "<p>No se incluyó validación.</p>";

    const warnings = validation.warnings ?? [];
    const errors = validation.errors ?? [];

    if (!warnings.length && !errors.length) {
        return "<p class=\"ok\">Configuración validada sin observaciones críticas.</p>";
    }

    return `
        ${errors.length ? `
            <h4>Errores</h4>
            <ul>${errors.map((item) => `<li>${safeText(item)}</li>`).join("")}</ul>
        ` : ""}
        ${warnings.length ? `
            <h4>Advertencias</h4>
            <ul>${warnings.map((item) => `<li>${safeText(item)}</li>`).join("")}</ul>
        ` : ""}
    `;
}

export function createPrintableReportHtml(state, options = {}) {
    const estimate = estimateKickOffBoxPrice({
        state,
        quantity: state.customer?.orderQuantity,
        urgency: state.price?.urgency,
        delivery: state.price?.delivery,
    });

    const report = createCommercialReport({
        state,
        quantity: state.customer?.orderQuantity,
        urgency: state.price?.urgency,
        delivery: state.price?.delivery,
    });

    const commercialSummary = getConfiguratorCommercialSummary(state);
    const validation = validateConfiguratorState(state);

    const renderImageHtml = options.renderImageDataUrl
        ? `<img class="render-image" src="${options.renderImageDataUrl}" alt="Render 3D de la caja personalizada" />`
        : `<div class="render-placeholder">Render 3D no adjuntado</div>`;

    return `<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <title>Reporte KickOff Box</title>
    <style>
        :root {
            --black: #111111;
            --brown: #2b2118;
            --cream: #fff7e8;
            --gold: #c59a4a;
            --soft-gold: #e9c678;
            --red: #b92d2d;
            --green: #2f7d55;
            --muted: #6f6255;
            --line: #e8dac4;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
            color: var(--brown);
            background: #f7efe3;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.45;
        }

        .page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 18mm;
            background: #fffdf8;
        }

        .cover {
            border: 2px solid var(--gold);
            border-radius: 24px;
            padding: 26px;
            background:
                linear-gradient(135deg, rgba(197,154,74,.12), transparent 45%),
                linear-gradient(315deg, rgba(17,17,17,.08), transparent 55%);
        }

        .tag {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 999px;
            background: var(--black);
            color: var(--soft-gold);
            font-size: 12px;
            font-weight: 800;
            letter-spacing: .08em;
            text-transform: uppercase;
        }

        h1 {
            margin: 18px 0 8px;
            color: var(--black);
            font-size: 34px;
            line-height: 1.05;
        }

        h2 {
            margin: 26px 0 12px;
            color: var(--black);
            font-size: 22px;
            border-bottom: 2px solid var(--line);
            padding-bottom: 8px;
        }

        h3 {
            margin: 18px 0 8px;
            color: var(--black);
            font-size: 16px;
        }

        h4 {
            margin: 12px 0 6px;
        }

        p {
            margin: 6px 0;
        }

        .muted {
            color: var(--muted);
        }

        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
        }

        .card {
            border: 1px solid var(--line);
            border-radius: 16px;
            padding: 14px;
            background: #ffffff;
        }

        .metric {
            border-radius: 18px;
            padding: 16px;
            color: #fff;
            background: linear-gradient(135deg, var(--black), #3a2a18);
        }

        .metric b {
            display: block;
            color: var(--soft-gold);
            font-size: 26px;
            line-height: 1.1;
        }

        .render-image,
        .render-placeholder {
            width: 100%;
            border-radius: 18px;
            border: 1px solid var(--line);
            background: #f3eadb;
            margin-top: 14px;
        }

        .render-placeholder {
            height: 230px;
            display: grid;
            place-items: center;
            color: var(--muted);
            font-weight: 700;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 13px;
        }

        th,
        td {
            border-bottom: 1px solid var(--line);
            padding: 8px 6px;
            text-align: left;
            vertical-align: top;
        }

        th {
            color: var(--black);
            background: #f7efe3;
        }

        .num {
            text-align: right;
            white-space: nowrap;
        }

        ul {
            margin: 8px 0 0 18px;
            padding: 0;
        }

        li {
            margin: 4px 0;
        }

        .ok {
            color: var(--green);
            font-weight: 700;
        }

        .footer {
            margin-top: 28px;
            padding-top: 12px;
            border-top: 1px solid var(--line);
            color: var(--muted);
            font-size: 12px;
        }

        .break-before {
            page-break-before: always;
        }

        @media print {
            body {
                background: white;
            }

            .page {
                width: auto;
                min-height: auto;
                margin: 0;
                padding: 14mm;
                box-shadow: none;
            }

            .no-print {
                display: none !important;
            }

            .card,
            .metric,
            .cover {
                break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <main class="page">
        <section class="cover">
            <span class="tag">Reporte comercial y diseño 3D</span>
            <h1>${safeText(state.project?.projectName ?? "KickOff Box")}</h1>
            <p class="muted">
                Caja personalizada académica con identidad Bolivia, Mundial 2026,
                Ingeniería de Sistemas y UNIFRANZ.
            </p>

            ${renderImageHtml}
        </section>

        <h2>Resumen ejecutivo</h2>
        <div class="grid">
            <div class="metric">
                <span>Total estimado</span>
                <b>${safeText(formatEstimatorPrice(estimate.totals.total))}</b>
                <small>${safeText(estimate.product.quantity)} unidad(es)</small>
            </div>
            <div class="metric">
                <span>Precio unitario</span>
                <b>${safeText(formatEstimatorPrice(estimate.totals.unitSalePrice))}</b>
                <small>${safeText(estimate.accessibility.label)}</small>
            </div>
            <div class="metric">
                <span>Margen estimado</span>
                <b>${safeText(estimate.margin.grossMarginPercent)}%</b>
                <small>Score: ${safeText(estimate.commercialScore.level)}</small>
            </div>
            <div class="metric">
                <span>Tiempo estimado</span>
                <b>${safeText(estimate.production.estimatedTotalDays)} día(s)</b>
                <small>Producción + entrega</small>
            </div>
        </div>

        <div class="card">
            <h3>Lectura comercial</h3>
            <p>${safeText(createReadableEstimateSummary(estimate))}</p>
        </div>

        <h2>Datos del diseño</h2>
        <div class="grid">
            <div class="card">
                <h3>Proyecto</h3>
                <p><b>Destinatario:</b> ${safeText(state.project?.recipientName)}</p>
                <p><b>Equipo:</b> ${safeText(state.project?.teamName)}</p>
                <p><b>Carrera:</b> ${safeText(state.project?.career)}</p>
                <p><b>Universidad:</b> ${safeText(state.project?.university)}</p>
            </div>
            <div class="card">
                <h3>Producto</h3>
                <p><b>Versión:</b> ${safeText(state.product?.preset)}</p>
                <p><b>Plantilla:</b> ${safeText(state.product?.templateId)}</p>
                <p><b>Tema:</b> ${safeText(state.product?.themeId)}</p>
                <p><b>Bebida:</b> ${safeText(state.beverage?.labelText ?? state.beverage?.type)}</p>
            </div>
        </div>

        <div class="card">
            <h3>Mensaje principal</h3>
            <p>${safeText(state.project?.message)}</p>
        </div>

        <h2>Desglose económico</h2>
        <table>
            <thead>
                <tr>
                    <th>Concepto</th>
                    <th>Categoría</th>
                    <th class="num">Monto</th>
                </tr>
            </thead>
            <tbody>
                ${renderTableRows(estimate.breakdown)}
            </tbody>
        </table>

        <h2>Recomendaciones</h2>
        <div class="card">
            <ul>
                ${estimate.recommendations.map((item) => `
                    <li><b>${safeText(item.title)}:</b> ${safeText(item.detail)}</li>
                `).join("")}
            </ul>
        </div>

        <section class="break-before">
            <h2>Análisis de viabilidad</h2>
            <div class="grid">
                <div class="card">
                    <h3>Punto de equilibrio</h3>
                    <p><b>Unidades:</b> ${safeText(report.breakEven.breakEvenUnits)}</p>
                    <p><b>Margen contribución:</b> ${safeText(formatEstimatorPrice(report.breakEven.contributionMargin))}</p>
                    <p><b>Viable:</b> ${report.breakEven.viable ? "Sí" : "Revisar"}</p>
                </div>
                <div class="card">
                    <h3>Decisión comercial</h3>
                    <p>${safeText(report.decision.recommendation)}</p>
                </div>
            </div>

            <h2>Validación técnica</h2>
            <div class="card">
                ${renderValidationList(validation)}
            </div>

            <h2>Resumen técnico exportable</h2>
            <div class="card">
                <p><b>App:</b> ${safeText(APP_INFO.NAME)} ${safeText(APP_INFO.VERSION)}</p>
                <p><b>Generado:</b> ${safeText(nowISO())}</p>
                <p><b>QR:</b> ${state.qr?.enabled ? "Activo" : "Inactivo"}</p>
                <p><b>Contenido digital:</b> ${safeText(state.qr?.value ?? "-")}</p>
                <p><b>Posicionamiento:</b> ${safeText(commercialSummary.template?.positioning ?? "-")}</p>
            </div>

            <div class="footer">
                Reporte generado para simulación, validación comercial y presentación académica.
                Los precios son referenciales y deben contrastarse con proveedores reales antes de producción.
            </div>
        </section>
    </main>
</body>
</html>`;
}

export function exportPrintableHtmlReport(state, options = {}) {
    const html = createPrintableReportHtml(state, options);
    const filename = options.filename ?? createExportFilename({
        prefix: "kickoff-box-reporte",
        projectName: state.project?.projectName,
        format: EXPORT_FORMATS.HTML_REPORT,
    });

    const blob = createTextBlob(html, "text/html");

    if (options.target === EXPORT_TARGETS.BLOB) {
        return {
            status: EXPORT_STATUS.EXPORTED,
            filename,
            blob,
            html,
        };
    }

    const download = downloadBlob(blob, filename);

    return {
        status: EXPORT_STATUS.EXPORTED,
        filename,
        html,
        download,
    };
}

export function openPrintableReport(state, options = {}) {
    const html = createPrintableReportHtml(state, options);
    const reportWindow = window.open("", "_blank", "noopener,noreferrer");

    if (!reportWindow) {
        return {
            status: EXPORT_STATUS.FAILED,
            error: "El navegador bloqueó la ventana emergente del reporte.",
        };
    }

    reportWindow.document.open();
    reportWindow.document.write(html);
    reportWindow.document.close();

    if (options.autoPrint !== false) {
        reportWindow.addEventListener("load", () => {
            reportWindow.focus();
            reportWindow.print();
        });
    }

    return {
        status: EXPORT_STATUS.EXPORTED,
        target: EXPORT_TARGETS.PRINT,
        html,
    };
}

export async function createRenderDataUrl(input = {}) {
    const canvas = resolveRenderTargetCanvas(input);

    if (!canvas) {
        throw new Error("No se encontró canvas para crear dataURL.");
    }

    const format = input.format ?? EXPORT_FORMATS.PNG;
    const quality = input.quality ?? IMAGE_EXPORT_QUALITY.HIGH;
    const mimeType = getMimeTypeForFormat(format);

    return canvas.toDataURL(mimeType, quality);
}

export async function exportPdfReadyReport(state, input = {}) {
    let renderImageDataUrl = input.renderImageDataUrl;

    if (!renderImageDataUrl && input.includeRenderImage !== false) {
        try {
            renderImageDataUrl = await createRenderDataUrl({
                renderer: input.renderer,
                canvas: input.canvas,
                format: EXPORT_FORMATS.JPEG,
                quality: IMAGE_EXPORT_QUALITY.HIGH,
            });
        } catch {
            renderImageDataUrl = null;
        }
    }

    return openPrintableReport(state, {
        ...input,
        renderImageDataUrl,
        autoPrint: input.autoPrint ?? true,
    });
}

export async function exportCompleteDesignPackage(state, input = {}) {
    const files = [];

    const jsonExport = exportDesignJson(state, {
        target: EXPORT_TARGETS.BLOB,
        includeScenePayload: true,
        includeCommercialSummary: true,
        includePricing: true,
        includeValidation: true,
        includeCustomerData: input.includeCustomerData ?? false,
    });

    files.push({
        kind: EXPORT_FORMATS.JSON,
        filename: jsonExport.filename,
        blob: jsonExport.blob,
    });

    const summaryExport = exportPlainTextSummary(state, {
        target: EXPORT_TARGETS.BLOB,
        includeBreakdown: true,
    });

    files.push({
        kind: EXPORT_FORMATS.SUMMARY_TXT,
        filename: summaryExport.filename,
        blob: summaryExport.blob,
    });

    const htmlExport = exportPrintableHtmlReport(state, {
        target: EXPORT_TARGETS.BLOB,
        renderImageDataUrl: input.renderImageDataUrl ?? null,
    });

    files.push({
        kind: EXPORT_FORMATS.HTML_REPORT,
        filename: htmlExport.filename,
        blob: htmlExport.blob,
    });

    const canvas = resolveRenderTargetCanvas(input);

    if (canvas) {
        const imageExport = await exportRenderImage({
            ...input,
            target: EXPORT_TARGETS.BLOB,
            format: input.imageFormat ?? EXPORT_FORMATS.PNG,
            quality: input.imageQuality ?? IMAGE_EXPORT_QUALITY.ULTRA,
            state,
        });

        if (imageExport.status === EXPORT_STATUS.EXPORTED) {
            files.push({
                kind: input.imageFormat ?? EXPORT_FORMATS.PNG,
                filename: imageExport.filename,
                blob: imageExport.blob,
            });
        }
    }

    return {
        status: EXPORT_STATUS.EXPORTED,
        files,
        generatedAt: nowISO(),
        note: "Paquete lógico de exportación. Para ZIP se puede integrar JSZip después.",
    };
}

export function copySummaryToClipboard(state) {
    const content = createPlainTextSummary(state, {
        includeBreakdown: true,
    });

    if (!navigator.clipboard?.writeText) {
        return Promise.resolve({
            status: EXPORT_STATUS.UNSUPPORTED,
            error: "Clipboard API no disponible en este navegador.",
        });
    }

    return navigator.clipboard.writeText(content)
        .then(() => ({
            status: EXPORT_STATUS.EXPORTED,
            target: EXPORT_TARGETS.CLIPBOARD,
            content,
        }))
        .catch((error) => ({
            status: EXPORT_STATUS.FAILED,
            error: error.message,
        }));
}

export function validateExportReadiness(state, input = {}) {
    const validation = validateConfiguratorState(state);
    const warnings = [...(validation.warnings ?? [])];
    const errors = [...(validation.errors ?? [])];

    if (input.requireCanvas && !resolveRenderTargetCanvas(input)) {
        errors.push("No existe canvas de render para exportar imagen.");
    }

    if (!state.project?.projectName) {
        warnings.push("El proyecto no tiene nombre definido.");
    }

    if (!state.project?.recipientName) {
        warnings.push("El destinatario no está definido.");
    }

    if (state.qr?.enabled && !state.qr?.value) {
        warnings.push("El QR está activo, pero no tiene URL o contenido.");
    }

    return {
        ready: errors.length === 0,
        errors,
        warnings,
        checkedAt: nowISO(),
    };
}

export function getRecommendedExportFormats(context = {}) {
    const formats = [];

    formats.push({
        format: EXPORT_FORMATS.JSON,
        label: "Configuración JSON",
        reason: "Permite guardar, restaurar y editar el diseño después.",
        recommended: true,
    });

    formats.push({
        format: EXPORT_FORMATS.PNG,
        label: "Render PNG",
        reason: "Mejor para máxima fidelidad visual, detalles y uso en presentación.",
        recommended: true,
    });

    formats.push({
        format: EXPORT_FORMATS.JPEG,
        label: "Render JPG",
        reason: "Más liviano para compartir por WhatsApp, correo o vista rápida.",
        recommended: Boolean(context.shareFast),
    });

    formats.push({
        format: EXPORT_FORMATS.HTML_REPORT,
        label: "Reporte HTML imprimible",
        reason: "Puede abrirse en navegador y guardarse como PDF con impresión.",
        recommended: true,
    });

    formats.push({
        format: EXPORT_FORMATS.PDF_PRINT,
        label: "PDF desde imprimir",
        reason: "Ideal para entrega formal académica sin agregar librerías pesadas.",
        recommended: Boolean(context.academicPresentation ?? true),
    });

    return formats;
}

export const exportDesign = Object.freeze({
    version: EXPORT_DESIGN_VERSION,
    formats: EXPORT_FORMATS,
    targets: EXPORT_TARGETS,
    status: EXPORT_STATUS,
    quality: IMAGE_EXPORT_QUALITY,

    createExportFilename,
    createDesignExportPayload,
    exportDesignJson,
    createDesignSnapshotFile,

    exportRenderImage,
    exportRenderPng,
    exportRenderJpeg,
    exportRenderWebp,

    createPlainTextSummary,
    exportPlainTextSummary,

    createPrintableReportHtml,
    exportPrintableHtmlReport,
    openPrintableReport,
    exportPdfReadyReport,

    createRenderDataUrl,
    exportCompleteDesignPackage,
    copySummaryToClipboard,

    validateExportReadiness,
    getRecommendedExportFormats,
});
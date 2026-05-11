import * as THREE from "three";
import QRCode from "qrcode";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import {
    applyTransform,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

import {
    createQRCardTexture,
    createMaterialFromTexture,
} from "../utils/textureFactory.js";

export const QR_CARD_VERSION = "2.0.0";

export const QR_CARD_STYLES = Object.freeze({
    PREMIUM: "premium",
    DEFENSE: "defense",
    JURY: "jury",
    INSTITUTIONAL: "institutional",
    BOLIVIA_WORLD_CUP: "bolivia-world-cup",
    TECH_ACADEMIC: "tech-academic",
    MINIMAL: "minimal",
});

export const QR_CARD_ORIENTATION = Object.freeze({
    FLAT: "flat",
    LEANING: "leaning",
    STANDING: "standing",
    SLOT: "slot",
});

export const QR_CARD_FINISHES = Object.freeze({
    MATTE: "matte",
    SATIN: "satin",
    GLOSSY: "glossy",
    LAMINATED: "laminated",
});

export const QR_CARD_SCAN_STATUS = Object.freeze({
    REAL: "real",
    VISUAL_ONLY: "visual-only",
    FAILED: "failed",
});

const DEFAULT_QR_DATA = Object.freeze({
    title: "Contenido digital",
    subtitle: "Escanea para ver el proyecto",
    footer: "KickOff Box 2026",
    qrValue: "https://example.com/kickoff-box",
    helperText: "Mensaje · Proyecto · Galería · Certificado digital",
    accessLabel: "Acceso digital",
});

const DEFAULT_QR_OPTIONS = Object.freeze({
    style: QR_CARD_STYLES.PREMIUM,
    orientation: QR_CARD_ORIENTATION.FLAT,
    finish: QR_CARD_FINISHES.SATIN,

    width: 0.92,
    height: 0.052,
    depth: 0.92,

    cornerRadius: 0.036,
    cornerSegments: 5,

    surfaceInset: 0.055,
    surfaceLift: 0.007,

    canvasWidth: 1400,
    canvasHeight: 1400,
    qrSize: 620,
    errorCorrectionLevel: "H",
    margin: 2,

    paperColor: "#fff7e8",
    paperBackColor: "#e5d2b2",
    darkColor: "#2b2118",
    lightColor: "#fffdf8",
    textColor: "#2b2118",
    accentColor: "#c59a4a",
    secondaryAccent: "#b92d2d",
    greenAccent: "#2f7d55",

    showBody: true,
    showSurface: true,
    showBack: true,
    showGoldBorder: true,
    showCornerMarks: true,
    showMiniLogo: true,
    showStand: false,
    showSlotBase: true,
    showScanBeam: true,
    showPhysicalSeal: true,
    showShadow: true,
    showPaperLayers: true,

    opacity: 1,
    renderOrder: 9,
});

const STYLE_PRESETS = Object.freeze({
    [QR_CARD_STYLES.PREMIUM]: Object.freeze({
        paperColor: "#fff7e8",
        paperBackColor: "#e5d2b2",
        textColor: "#2b2118",
        darkColor: "#2b2118",
        lightColor: "#fffdf8",
        accentColor: "#c59a4a",
        secondaryAccent: "#b92d2d",
        greenAccent: "#2f7d55",
        showCornerMarks: true,
        showMiniLogo: true,
        showPhysicalSeal: true,
    }),

    [QR_CARD_STYLES.DEFENSE]: Object.freeze({
        paperColor: "#fffaf0",
        paperBackColor: "#e8d5b7",
        textColor: "#24180f",
        darkColor: "#24180f",
        lightColor: "#fffdf8",
        accentColor: "#c59a4a",
        secondaryAccent: "#8b1f1f",
        greenAccent: "#2f7d55",
        showCornerMarks: true,
        showMiniLogo: true,
        showPhysicalSeal: true,
    }),

    [QR_CARD_STYLES.JURY]: Object.freeze({
        paperColor: "#fff7e8",
        paperBackColor: "#dcc7a7",
        textColor: "#2b2118",
        darkColor: "#2b2118",
        lightColor: "#fffdf8",
        accentColor: "#c59a4a",
        secondaryAccent: "#7a4f2a",
        greenAccent: "#2f7d55",
        showCornerMarks: false,
        showMiniLogo: true,
        showPhysicalSeal: true,
    }),

    [QR_CARD_STYLES.INSTITUTIONAL]: Object.freeze({
        paperColor: "#f8f3ea",
        paperBackColor: "#dfd1bd",
        textColor: "#111827",
        darkColor: "#111827",
        lightColor: "#ffffff",
        accentColor: "#2f86c7",
        secondaryAccent: "#c59a4a",
        greenAccent: "#2f7d55",
        showCornerMarks: true,
        showMiniLogo: true,
        showPhysicalSeal: true,
    }),

    [QR_CARD_STYLES.BOLIVIA_WORLD_CUP]: Object.freeze({
        paperColor: "#fff7e8",
        paperBackColor: "#e4cda8",
        textColor: "#2b2118",
        darkColor: "#2b2118",
        lightColor: "#fffdf8",
        accentColor: "#f0c84b",
        secondaryAccent: "#b92d2d",
        greenAccent: "#2f7d55",
        showCornerMarks: true,
        showMiniLogo: true,
        showPhysicalSeal: true,
    }),

    [QR_CARD_STYLES.TECH_ACADEMIC]: Object.freeze({
        paperColor: "#f8fbff",
        paperBackColor: "#dce8f4",
        textColor: "#111827",
        darkColor: "#111827",
        lightColor: "#ffffff",
        accentColor: "#2f86c7",
        secondaryAccent: "#c59a4a",
        greenAccent: "#2f7d55",
        showCornerMarks: true,
        showMiniLogo: true,
        showPhysicalSeal: false,
    }),

    [QR_CARD_STYLES.MINIMAL]: Object.freeze({
        paperColor: "#ffffff",
        paperBackColor: "#e8e2d7",
        textColor: "#1f2937",
        darkColor: "#111827",
        lightColor: "#ffffff",
        accentColor: "#c59a4a",
        secondaryAccent: "#374151",
        greenAccent: "#2f7d55",
        showCornerMarks: false,
        showMiniLogo: false,
        showPhysicalSeal: false,
    }),
});

function normalizeOptions(config = {}, extraOptions = {}) {
    const source = config.qrCard ?? config.qr ?? config;
    const visual = config.visual ?? config.sceneConfig?.visual ?? {};
    const qr = config.qr ?? config.content?.qr ?? {};
    const project = config.project ?? config.content?.project ?? {};

    const style =
        source.style ??
        visual.qrCardStyle ??
        QR_CARD_STYLES.PREMIUM;

    const preset = STYLE_PRESETS[style] ?? STYLE_PRESETS[QR_CARD_STYLES.PREMIUM];

    const qrData = {
        ...DEFAULT_QR_DATA,
        title:
            qr.title ??
            source.title ??
            extraOptions.title ??
            DEFAULT_QR_DATA.title,
        subtitle:
            qr.subtitle ??
            source.subtitle ??
            extraOptions.subtitle ??
            DEFAULT_QR_DATA.subtitle,
        footer:
            qr.footer ??
            source.footer ??
            extraOptions.footer ??
            DEFAULT_QR_DATA.footer,
        qrValue:
            qr.value ??
            qr.qrValue ??
            source.value ??
            source.qrValue ??
            extraOptions.qrValue ??
            DEFAULT_QR_DATA.qrValue,
        helperText:
            qr.helperText ??
            source.helperText ??
            DEFAULT_QR_DATA.helperText,
        accessLabel:
            qr.accessLabel ??
            source.accessLabel ??
            DEFAULT_QR_DATA.accessLabel,
        projectName:
            project.projectName ??
            source.projectName ??
            "Proyecto académico",
        teamName:
            project.teamName ??
            source.teamName ??
            "Equipo",
    };

    return {
        ...DEFAULT_QR_OPTIONS,
        ...preset,
        ...source,
        ...extraOptions,
        style,
        qrData,

        paperColor:
            visual.qrPaperColor ??
            source.paperColor ??
            preset.paperColor,
        textColor:
            visual.qrTextColor ??
            source.textColor ??
            preset.textColor,
        accentColor:
            visual.accentColor ??
            source.accentColor ??
            preset.accentColor,
        darkColor:
            source.darkColor ??
            preset.darkColor,
        lightColor:
            source.lightColor ??
            preset.lightColor,

        showCornerMarks:
            source.showCornerMarks ??
            preset.showCornerMarks ??
            DEFAULT_QR_OPTIONS.showCornerMarks,
        showMiniLogo:
            source.showMiniLogo ??
            preset.showMiniLogo ??
            DEFAULT_QR_OPTIONS.showMiniLogo,
        showPhysicalSeal:
            source.showPhysicalSeal ??
            preset.showPhysicalSeal ??
            DEFAULT_QR_OPTIONS.showPhysicalSeal,
    };
}

function createRoundedMesh({
    name,
    width,
    height,
    depth,
    radius = 0.035,
    segments = 4,
    material,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    userData = {},
}) {
    const safeRadius = Math.min(radius, width / 2, height / 2, depth / 2);

    const geometry = new RoundedBoxGeometry(
        width,
        height,
        depth,
        segments,
        safeRadius,
    );

    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(position[0], position[1], position[2]);
    mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
    mesh.userData = {
        generatedBy: "QRCard",
        version: QR_CARD_VERSION,
        ...userData,
    };

    setMeshShadow(mesh, true, true);

    return mesh;
}

function createPaperMaterial(name, color, options = {}) {
    const finishSettings = {
        [QR_CARD_FINISHES.MATTE]: {
            roughness: 0.92,
            metalness: 0.0,
            clearcoat: 0,
            clearcoatRoughness: 0.7,
        },
        [QR_CARD_FINISHES.SATIN]: {
            roughness: 0.62,
            metalness: 0.01,
            clearcoat: 0.18,
            clearcoatRoughness: 0.32,
        },
        [QR_CARD_FINISHES.GLOSSY]: {
            roughness: 0.28,
            metalness: 0.02,
            clearcoat: 0.45,
            clearcoatRoughness: 0.12,
        },
        [QR_CARD_FINISHES.LAMINATED]: {
            roughness: 0.18,
            metalness: 0.015,
            clearcoat: 0.68,
            clearcoatRoughness: 0.08,
        },
    }[options.finish] ?? {};

    const material = new THREE.MeshPhysicalMaterial({
        name,
        color,
        roughness: finishSettings.roughness ?? 0.62,
        metalness: finishSettings.metalness ?? 0.01,
        clearcoat: finishSettings.clearcoat ?? 0.18,
        clearcoatRoughness: finishSettings.clearcoatRoughness ?? 0.32,
        transparent: options.opacity < 1,
        opacity: options.opacity,
        side: THREE.DoubleSide,
    });

    material.userData = {
        generatedBy: "QRCard",
        version: QR_CARD_VERSION,
        finish: options.finish,
    };

    return material;
}

function createGoldMaterial(options = {}) {
    return new THREE.MeshStandardMaterial({
        name: "QRCardGoldDetailMaterial",
        color: options.accentColor,
        roughness: 0.32,
        metalness: 0.3,
    });
}

function createDarkMaterial(options = {}) {
    return new THREE.MeshStandardMaterial({
        name: "QRCardDarkSupportMaterial",
        color: options.darkColor,
        roughness: 0.72,
        metalness: 0.04,
    });
}

function createTransparentGuideMaterial(options = {}) {
    return new THREE.MeshBasicMaterial({
        name: "QRCardTransparentGuideMaterial",
        color: options.accentColor,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        side: THREE.DoubleSide,
    });
}

function roundedRectPath(ctx, x, y, width, height, radius) {
    const safeRadius = Math.min(radius, width / 2, height / 2);

    ctx.beginPath();
    ctx.moveTo(x + safeRadius, y);
    ctx.lineTo(x + width - safeRadius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
    ctx.lineTo(x + width, y + height - safeRadius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
    ctx.lineTo(x + safeRadius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
    ctx.lineTo(x, y + safeRadius);
    ctx.quadraticCurveTo(x, y, x + safeRadius, y);
    ctx.closePath();
}

function drawMultilineText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 2) {
    const words = String(text ?? "").split(/\s+/);
    const lines = [];
    let line = "";

    words.forEach((word) => {
        const testLine = line ? `${line} ${word}` : word;

        if (ctx.measureText(testLine).width > maxWidth && line) {
            lines.push(line);
            line = word;
        } else {
            line = testLine;
        }
    });

    if (line) lines.push(line);

    const visibleLines = lines.slice(0, maxLines);
    const startY = y - ((visibleLines.length - 1) * lineHeight) / 2;

    visibleLines.forEach((currentLine, index) => {
        const finalLine =
            index === maxLines - 1 && lines.length > maxLines
                ? `${currentLine.replace(/\.*$/, "")}...`
                : currentLine;

        ctx.fillText(finalLine, x, startY + index * lineHeight);
    });
}

function drawCornerMarks(ctx, width, height, options) {
    if (!options.showCornerMarks) return;

    const margin = 72;
    const length = 92;
    const thickness = 13;

    ctx.save();
    ctx.fillStyle = options.accentColor;

    const corners = [
        [margin, margin, 1, 1],
        [width - margin, margin, -1, 1],
        [margin, height - margin, 1, -1],
        [width - margin, height - margin, -1, -1],
    ];

    corners.forEach(([x, y, dirX, dirY]) => {
        ctx.fillRect(x, y, length * dirX, thickness * dirY);
        ctx.fillRect(x, y, thickness * dirX, length * dirY);
    });

    ctx.restore();
}

function drawBoliviaHeader(ctx, width, options) {
    ctx.fillStyle = options.secondaryAccent;
    ctx.fillRect(0, 0, width, 46);

    ctx.fillStyle = "#f0c84b";
    ctx.fillRect(0, 46, width, 46);

    ctx.fillStyle = options.greenAccent;
    ctx.fillRect(0, 92, width, 46);
}

function drawTechLines(ctx, width, height, options) {
    ctx.save();

    ctx.strokeStyle = hexToRgba(options.darkColor, 0.15);
    ctx.lineWidth = 5;

    const lines = [
        [[120, 230], [220, 230], [280, 290]],
        [[width - 120, 230], [width - 235, 230], [width - 300, 300]],
        [[160, height - 170], [280, height - 170], [340, height - 245]],
        [[width - 160, height - 170], [width - 280, height - 170], [width - 340, height - 245]],
    ];

    lines.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line[0][0], line[0][1]);

        for (let index = 1; index < line.length; index += 1) {
            ctx.lineTo(line[index][0], line[index][1]);
        }

        ctx.stroke();
    });

    ctx.fillStyle = hexToRgba(options.accentColor, 0.72);

    [
        [280, 290],
        [width - 300, 300],
        [340, height - 245],
        [width - 340, height - 245],
    ].forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.restore();
}

function drawMiniLogo(ctx, x, y, radius, options) {
    if (!options.showMiniLogo) return;

    ctx.save();

    ctx.fillStyle = options.lightColor;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = options.accentColor;
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.fillStyle = options.darkColor;
    ctx.font = "900 50px Arial, Helvetica, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("IS", x, y - 4);

    ctx.fillStyle = options.accentColor;
    ctx.font = "800 14px Arial, Helvetica, sans-serif";
    ctx.fillText("UNIFRANZ", x, y + 35);

    ctx.restore();
}

function drawPhysicalSeal(ctx, width, height, options) {
    if (!options.showPhysicalSeal) return;

    const x = width - 170;
    const y = height - 160;
    const radius = 58;

    ctx.save();

    ctx.fillStyle = options.accentColor;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = options.darkColor;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.75, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = options.accentColor;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.56, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = options.accentColor;
    ctx.font = "900 34px Arial, Helvetica, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("2026", x, y - 4);

    ctx.font = "800 12px Arial, Helvetica, sans-serif";
    ctx.fillText("KICKOFF", x, y + 28);

    ctx.restore();
}

function drawPaperNoise(ctx, width, height) {
    ctx.save();

    for (let index = 0; index < 700; index += 1) {
        const alpha = Math.random() * 0.028;
        ctx.fillStyle = `rgba(80, 55, 30, ${alpha})`;
        ctx.fillRect(
            Math.random() * width,
            Math.random() * height,
            Math.random() * 2 + 0.4,
            Math.random() * 2 + 0.4,
        );
    }

    ctx.restore();
}

function drawBaseQRCard(canvas, options, qrCanvas = null, status = QR_CARD_SCAN_STATUS.VISUAL_ONLY) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const backgroundGradient = ctx.createLinearGradient(0, 0, width, height);
    backgroundGradient.addColorStop(0, options.paperColor);
    backgroundGradient.addColorStop(0.55, "#fffdf8");
    backgroundGradient.addColorStop(1, options.paperBackColor);

    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, width, height);

    drawBoliviaHeader(ctx, width, options);
    drawTechLines(ctx, width, height, options);
    drawCornerMarks(ctx, width, height, options);

    ctx.strokeStyle = hexToRgba(options.darkColor, 0.25);
    ctx.lineWidth = 18;
    roundedRectPath(ctx, 70, 180, width - 140, height - 250, 48);
    ctx.stroke();

    ctx.strokeStyle = hexToRgba(options.accentColor, 0.68);
    ctx.lineWidth = 8;
    roundedRectPath(ctx, 105, 215, width - 210, height - 320, 36);
    ctx.stroke();

    ctx.fillStyle = options.secondaryAccent;
    ctx.font = "900 72px Arial, Helvetica, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    drawMultilineText(ctx, options.qrData.title, width / 2, 270, width - 350, 78, 2);

    ctx.fillStyle = options.textColor;
    ctx.font = "700 38px Arial, Helvetica, sans-serif";
    drawMultilineText(ctx, options.qrData.subtitle, width / 2, 350, width - 350, 44, 2);

    const qrBoxSize = 620;
    const qrBoxX = width / 2 - qrBoxSize / 2;
    const qrBoxY = 420;

    ctx.fillStyle = options.lightColor;
    roundedRectPath(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 38);
    ctx.fill();

    ctx.strokeStyle = hexToRgba(options.darkColor, 0.22);
    ctx.lineWidth = 10;
    roundedRectPath(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 38);
    ctx.stroke();

    if (qrCanvas) {
        const qrDrawSize = 510;
        const qrDrawX = width / 2 - qrDrawSize / 2;
        const qrDrawY = qrBoxY + 55;

        ctx.drawImage(qrCanvas, qrDrawX, qrDrawY, qrDrawSize, qrDrawSize);
    } else {
        drawVisualQR(ctx, width / 2 - 255, qrBoxY + 55, 510, options);
    }

    drawMiniLogo(ctx, width / 2, qrBoxY + qrBoxSize / 2, 62, options);

    ctx.fillStyle =
        status === QR_CARD_SCAN_STATUS.REAL
            ? hexToRgba(options.greenAccent, 0.92)
            : hexToRgba(options.accentColor, 0.92);

    ctx.font = "900 28px Arial, Helvetica, sans-serif";
    ctx.fillText(
        status === QR_CARD_SCAN_STATUS.REAL ? "QR ESCANEABLE" : "VISTA QR",
        width / 2,
        qrBoxY + qrBoxSize + 52,
    );

    ctx.fillStyle = options.textColor;
    ctx.font = "900 34px Arial, Helvetica, sans-serif";
    drawMultilineText(ctx, options.qrData.footer, width / 2, height - 150, width - 360, 40, 2);

    ctx.fillStyle = hexToRgba(options.textColor, 0.62);
    ctx.font = "700 24px Arial, Helvetica, sans-serif";
    drawMultilineText(ctx, options.qrData.helperText, width / 2, height - 93, width - 340, 30, 2);

    drawPhysicalSeal(ctx, width, height, options);
    drawPaperNoise(ctx, width, height);
}

function drawVisualQR(ctx, x, y, size, options) {
    const modules = 29;
    const cell = size / modules;
    const seed = String(options.qrData.qrValue ?? "kickoff-box");

    ctx.save();

    ctx.fillStyle = options.lightColor;
    ctx.fillRect(x, y, size, size);

    function hashAt(index) {
        let hash = 0;
        const text = `${seed}:${index}`;

        for (let i = 0; i < text.length; i += 1) {
            hash = (hash << 5) - hash + text.charCodeAt(i);
            hash |= 0;
        }

        return Math.abs(hash);
    }

    function drawFinder(col, row) {
        const fx = x + col * cell;
        const fy = y + row * cell;

        ctx.fillStyle = options.darkColor;
        ctx.fillRect(fx, fy, cell * 7, cell * 7);

        ctx.fillStyle = options.lightColor;
        ctx.fillRect(fx + cell, fy + cell, cell * 5, cell * 5);

        ctx.fillStyle = options.darkColor;
        ctx.fillRect(fx + cell * 2, fy + cell * 2, cell * 3, cell * 3);
    }

    for (let row = 0; row < modules; row += 1) {
        for (let col = 0; col < modules; col += 1) {
            const inFinder =
                (col < 8 && row < 8) ||
                (col > modules - 9 && row < 8) ||
                (col < 8 && row > modules - 9);

            if (inFinder) continue;

            const hash = hashAt(row * modules + col);
            const shouldFill = hash % 5 === 0 || hash % 7 === 0 || hash % 11 === 0;

            if (shouldFill) {
                ctx.fillStyle = options.darkColor;
                ctx.fillRect(
                    Math.round(x + col * cell),
                    Math.round(y + row * cell),
                    Math.ceil(cell * 0.92),
                    Math.ceil(cell * 0.92),
                );
            }
        }
    }

    drawFinder(0, 0);
    drawFinder(modules - 7, 0);
    drawFinder(0, modules - 7);

    ctx.restore();
}

function hexToRgba(hex, alpha = 1) {
    const value = String(hex).replace("#", "");
    const bigint = Number.parseInt(
        value.length === 3
            ? value.split("").map((char) => char + char).join("")
            : value,
        16,
    );

    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function createQRTextureFallback(options) {
    const resource = createQRCardTexture({
        title: options.qrData.title,
        subtitle: options.qrData.subtitle,
        footer: options.qrData.footer,
        value: options.qrData.qrValue,
        background: options.paperColor,
        foreground: options.darkColor,
        accentColor: options.accentColor,
    });

    return {
        canvas: resource.canvas,
        texture: resource.texture,
        status: QR_CARD_SCAN_STATUS.VISUAL_ONLY,
        error: null,
    };
}

function createQRCanvasTexture(options) {
    const canvas = document.createElement("canvas");
    canvas.width = options.canvasWidth;
    canvas.height = options.canvasHeight;

    drawBaseQRCard(canvas, options, null, QR_CARD_SCAN_STATUS.VISUAL_ONLY);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    texture.userData = {
        generatedBy: "QRCard",
        version: QR_CARD_VERSION,
        status: QR_CARD_SCAN_STATUS.VISUAL_ONLY,
        qrValue: options.qrData.qrValue,
    };

    const qrCanvas = document.createElement("canvas");

    QRCode.toCanvas(
        qrCanvas,
        options.qrData.qrValue,
        {
            width: options.qrSize,
            margin: options.margin,
            errorCorrectionLevel: options.errorCorrectionLevel,
            color: {
                dark: options.darkColor,
                light: options.lightColor,
            },
        },
        (error) => {
            if (error) {
                texture.userData.status = QR_CARD_SCAN_STATUS.FAILED;
                texture.userData.error = error.message;
                drawBaseQRCard(canvas, options, null, QR_CARD_SCAN_STATUS.FAILED);
                texture.needsUpdate = true;
                return;
            }

            texture.userData.status = QR_CARD_SCAN_STATUS.REAL;
            drawBaseQRCard(canvas, options, qrCanvas, QR_CARD_SCAN_STATUS.REAL);
            texture.needsUpdate = true;
        },
    );

    return {
        canvas,
        texture,
        status: QR_CARD_SCAN_STATUS.REAL,
    };
}

function createSurfaceMaterial(options, textureSet = {}) {
    const texture =
        textureSet.qrCard?.texture ??
        createQRCanvasTexture(options).texture;

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    const material = createMaterialFromTexture
        ? createMaterialFromTexture(texture, {
            materialType: options.finish === QR_CARD_FINISHES.MATTE ? "standard" : "physical",
            transparent: true,
            opacity: options.opacity,
            roughness: options.finish === QR_CARD_FINISHES.GLOSSY ? 0.22 : 0.48,
            metalness: 0.01,
            clearcoat: options.finish === QR_CARD_FINISHES.LAMINATED ? 0.62 : 0.28,
            clearcoatRoughness: 0.14,
        })
        : new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: options.opacity,
            side: THREE.DoubleSide,
        });

    material.name = "QRCardSurfaceMaterial";
    material.userData = {
        ...(material.userData ?? {}),
        generatedBy: "QRCard",
        texture,
        options,
    };

    return material;
}

function createQRCardBody(options) {
    const material = createPaperMaterial(
        "QRCardBodyMaterial",
        options.paperColor,
        options,
    );

    const body = createRoundedMesh({
        name: "QRCardBody",
        width: options.width,
        height: options.height,
        depth: options.depth,
        radius: options.cornerRadius,
        segments: options.cornerSegments,
        material,
        userData: {
            part: "body",
        },
    });

    body.visible = Boolean(options.showBody);

    return body;
}

function createQRCardBack(options) {
    const material = createPaperMaterial(
        "QRCardBackMaterial",
        options.paperBackColor,
        {
            ...options,
            finish: QR_CARD_FINISHES.MATTE,
        },
    );

    const back = createRoundedMesh({
        name: "QRCardBack",
        width: options.width * 0.96,
        height: options.height * 0.38,
        depth: options.depth * 0.96,
        radius: options.cornerRadius * 0.82,
        segments: options.cornerSegments,
        material,
        position: [0, -options.height * 0.58, 0],
        userData: {
            part: "back",
        },
    });

    back.visible = Boolean(options.showBack);

    return back;
}

function createQRCardSurface(options, textureSet = {}) {
    const surfaceWidth = options.width - options.surfaceInset * 2;
    const surfaceDepth = options.depth - options.surfaceInset * 2;

    const surface = new THREE.Mesh(
        new THREE.PlaneGeometry(surfaceWidth, surfaceDepth, 4, 4),
        createSurfaceMaterial(options, textureSet),
    );

    surface.name = "QRCardSurface";
    surface.rotation.x = -Math.PI / 2;
    surface.position.y = options.height / 2 + options.surfaceLift;
    surface.renderOrder = options.renderOrder;
    surface.visible = Boolean(options.showSurface);
    surface.userData = {
        generatedBy: "QRCard",
        part: "surface",
        editable: true,
        qrData: options.qrData,
    };

    setMeshShadow(surface, false, true);

    return surface;
}

function createQRCardBorder(options) {
    const group = new THREE.Group();
    group.name = "QRCardBorder";
    group.visible = Boolean(options.showGoldBorder);

    const material = createGoldMaterial(options);
    const y = options.height / 2 + options.surfaceLift + 0.014;
    const borderThickness = 0.014;
    const w = options.width - options.surfaceInset * 1.15;
    const d = options.depth - options.surfaceInset * 1.15;

    const top = createRoundedMesh({
        name: "QRBorderTop",
        width: w,
        height: borderThickness,
        depth: borderThickness,
        radius: 0.006,
        segments: 2,
        material,
        position: [0, y, -d / 2],
        userData: { part: "border" },
    });

    const bottom = createRoundedMesh({
        name: "QRBorderBottom",
        width: w,
        height: borderThickness,
        depth: borderThickness,
        radius: 0.006,
        segments: 2,
        material: material.clone(),
        position: [0, y, d / 2],
        userData: { part: "border" },
    });

    const left = createRoundedMesh({
        name: "QRBorderLeft",
        width: borderThickness,
        height: borderThickness,
        depth: d,
        radius: 0.006,
        segments: 2,
        material: material.clone(),
        position: [-w / 2, y, 0],
        userData: { part: "border" },
    });

    const right = createRoundedMesh({
        name: "QRBorderRight",
        width: borderThickness,
        height: borderThickness,
        depth: d,
        radius: 0.006,
        segments: 2,
        material: material.clone(),
        position: [w / 2, y, 0],
        userData: { part: "border" },
    });

    group.add(top, bottom, left, right);

    return group;
}

function createQRCardStand(options) {
    const group = new THREE.Group();
    group.name = "QRCardStand";
    group.visible = Boolean(options.showStand || options.orientation === QR_CARD_ORIENTATION.STANDING);

    const material = createDarkMaterial(options);

    const backSupport = createRoundedMesh({
        name: "QRBackSupport",
        width: 0.07,
        height: 0.32,
        depth: 0.04,
        radius: 0.012,
        segments: 3,
        material,
        position: [0, -0.05, -options.depth * 0.42],
        rotation: [-0.32, 0, 0],
        userData: {
            part: "stand-back-support",
        },
    });

    const foot = createRoundedMesh({
        name: "QRStandFoot",
        width: options.width * 0.72,
        height: 0.032,
        depth: 0.15,
        radius: 0.018,
        segments: 3,
        material: material.clone(),
        position: [0, -0.082, options.depth * 0.34],
        userData: {
            part: "stand-foot",
        },
    });

    group.add(backSupport, foot);

    return group;
}

function createQRCardSlotBase(options) {
    const group = new THREE.Group();
    group.name = "QRCardSlotBase";
    group.visible = Boolean(options.showSlotBase);

    const material = createTransparentGuideMaterial(options);

    const base = createRoundedMesh({
        name: "QRSlotSoftBase",
        width: options.width * 1.04,
        height: 0.012,
        depth: options.depth * 1.04,
        radius: 0.04,
        segments: 4,
        material,
        position: [0, -options.height * 0.76, 0],
        userData: {
            part: "slot-base",
            role: "qr-card-placement-guide",
        },
    });

    group.add(base);

    return group;
}

function createQRCardPhysicalSeal(options) {
    const group = new THREE.Group();
    group.name = "QRCardPhysicalSeal";
    group.visible = Boolean(options.showPhysicalSeal);

    const y = options.height / 2 + options.surfaceLift + 0.032;

    const sealMaterial = createGoldMaterial(options);
    const innerMaterial = createDarkMaterial(options);

    const seal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.046, 0.046, 0.016, 48),
        sealMaterial,
    );
    seal.name = "QRGoldSeal";
    seal.rotation.x = Math.PI / 2;
    seal.position.set(options.width * 0.33, y, options.depth * 0.33);

    const inner = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.018, 48),
        innerMaterial,
    );
    inner.name = "QRGoldSealInner";
    inner.rotation.x = Math.PI / 2;
    inner.position.copy(seal.position);
    inner.position.y += 0.002;

    group.add(seal, inner);
    setGroupShadow(group, true, true);

    return group;
}

function createScanBeam(options) {
    const group = new THREE.Group();
    group.name = "QRCardScanBeam";
    group.visible = Boolean(options.showScanBeam);

    const material = new THREE.MeshBasicMaterial({
        name: "QRCardScanBeamMaterial",
        color: options.accentColor,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

    const beam = new THREE.Mesh(
        new THREE.PlaneGeometry(options.width * 0.58, 0.018, 1, 1),
        material,
    );

    beam.name = "QRScanBeamLine";
    beam.rotation.x = -Math.PI / 2;
    beam.position.y = options.height / 2 + options.surfaceLift + 0.024;
    beam.position.z = 0;
    beam.renderOrder = options.renderOrder + 2;

    group.add(beam);

    return group;
}

function createPaperLayers(options) {
    const group = new THREE.Group();
    group.name = "QRCardPaperLayers";
    group.visible = Boolean(options.showPaperLayers);

    const colors = [
        options.paperBackColor,
        "#f5e5ca",
        options.paperColor,
    ];

    colors.forEach((color, index) => {
        const material = createPaperMaterial(
            `QRCardPaperLayerMaterial_${index + 1}`,
            color,
            {
                ...options,
                finish: QR_CARD_FINISHES.MATTE,
            },
        );

        const layer = createRoundedMesh({
            name: `QRCardPaperLayer_${index + 1}`,
            width: options.width * (0.985 - index * 0.01),
            height: 0.006,
            depth: options.depth * (0.985 - index * 0.01),
            radius: options.cornerRadius * 0.86,
            segments: 3,
            material,
            position: [0, -options.height * 0.5 - index * 0.009, 0],
            userData: {
                part: "paper-layer",
                layerIndex: index,
            },
        });

        group.add(layer);
    });

    return group;
}

function createQRCardContactShadow(options) {
    const group = new THREE.Group();
    group.name = "QRCardSoftShadow";
    group.visible = Boolean(options.showShadow);

    const material = new THREE.MeshBasicMaterial({
        name: "QRCardContactShadowMaterial",
        color: "#000000",
        transparent: true,
        opacity: 0.13,
        depthWrite: false,
        side: THREE.DoubleSide,
    });

    const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(0.63, 64),
        material,
    );

    shadow.name = "QRCardContactShadow";
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -options.height * 0.78;
    shadow.scale.set(1.12, 0.86, 1);
    shadow.renderOrder = -1;

    group.add(shadow);

    return group;
}

function applyCardOrientation(group, options) {
    if (options.orientation === QR_CARD_ORIENTATION.LEANING) {
        group.rotation.x += -0.18;
        group.position.y += 0.08;
        group.position.z -= 0.02;
    }

    if (options.orientation === QR_CARD_ORIENTATION.STANDING) {
        group.rotation.x += -Math.PI / 2.85;
        group.position.y += 0.34;
        group.position.z -= 0.1;
    }

    if (options.orientation === QR_CARD_ORIENTATION.SLOT) {
        group.rotation.x += -0.05;
        group.position.y += 0.012;
    }
}

function applyConfigTransform(group, config = {}) {
    const layout =
        config.layout ??
        config.transform ??
        config.contentLayout?.qrCard ??
        {};

    applyTransform(group, {
        position: layout.position ?? [0.74, 0.34, -0.36],
        rotation: layout.rotation ?? [0, 0, 0],
        scale: layout.scale ?? [1, 1, 1],
    });
}

function createMetadata(options) {
    return {
        objectType: "QRCard",
        version: QR_CARD_VERSION,
        style: options.style,
        orientation: options.orientation,
        finish: options.finish,
        dimensions: {
            width: options.width,
            height: options.height,
            depth: options.depth,
        },
        editable: true,
        exportable: true,
        qrData: options.qrData,
        scanStatus: QR_CARD_SCAN_STATUS.VISUAL_ONLY,
        purpose: "physical-digital-access-card",
        createdAt: new Date().toISOString(),
    };
}

export function createQRCard(config = {}, materials = {}, textureSet = {}, extraOptions = {}) {
    const options = normalizeOptions(config, extraOptions);

    const group = new THREE.Group();
    group.name = "KickOffBoxQRCard";
    group.userData = createMetadata(options);

    const shadow = createQRCardContactShadow(options);
    const paperLayers = createPaperLayers(options);
    const back = createQRCardBack(options);
    const body = createQRCardBody(options);
    const surface = createQRCardSurface(options, textureSet);
    const border = createQRCardBorder(options);
    const stand = createQRCardStand(options);
    const slotBase = createQRCardSlotBase(options);
    const seal = createQRCardPhysicalSeal(options);
    const scanBeam = createScanBeam(options);

    group.add(
        shadow,
        slotBase,
        paperLayers,
        back,
        body,
        surface,
        border,
        stand,
        seal,
        scanBeam,
    );

    group.userData.parts = {
        shadow: shadow.name,
        slotBase: slotBase.name,
        paperLayers: paperLayers.name,
        back: back.name,
        body: body.name,
        surface: surface.name,
        border: border.name,
        stand: stand.name,
        seal: seal.name,
        scanBeam: scanBeam.name,
    };

    applyConfigTransform(group, config);
    applyCardOrientation(group, options);

    setGroupShadow(group, true, true);

    return group;
}

export function createQrCard(config = {}, materials = {}, textureSet = {}, extraOptions = {}) {
    return createQRCard(config, materials, textureSet, extraOptions);
}

export function updateQRCard(qrCardGroup, nextOptions = {}, textureSet = {}) {
    if (!qrCardGroup) return null;

    const surface = qrCardGroup.getObjectByName("QRCardSurface");

    if (!surface?.material) return null;

    const currentData = qrCardGroup.userData?.qrData ?? DEFAULT_QR_DATA;
    const currentOptions = {
        ...qrCardGroup.userData,
        qrData: currentData,
    };

    const updatedOptions = normalizeOptions({
        ...currentOptions,
        ...nextOptions,
        qr: {
            ...currentData,
            ...nextOptions,
        },
    });

    const previousMaterial = surface.material;
    const nextMaterial = createSurfaceMaterial(updatedOptions, textureSet);

    surface.material = nextMaterial;
    surface.userData.qrData = updatedOptions.qrData;

    disposeMaterial(previousMaterial);

    qrCardGroup.userData = {
        ...qrCardGroup.userData,
        qrData: updatedOptions.qrData,
        style: updatedOptions.style,
        finish: updatedOptions.finish,
        updatedAt: new Date().toISOString(),
    };

    return qrCardGroup;
}

export function setQRCardVisibility(qrCardGroup, visible = true) {
    if (!qrCardGroup) return;

    qrCardGroup.visible = Boolean(visible);
    qrCardGroup.userData.visible = Boolean(visible);
    qrCardGroup.userData.updatedAt = new Date().toISOString();
}

export function setQRCardStandVisibility(qrCardGroup, visible = true) {
    const stand = qrCardGroup?.getObjectByName("QRCardStand");

    if (!stand) return;

    stand.visible = Boolean(visible);
}

export function setQRCardScanBeamVisibility(qrCardGroup, visible = true) {
    const beam = qrCardGroup?.getObjectByName("QRCardScanBeam");

    if (!beam) return;

    beam.visible = Boolean(visible);
}

export function setQRCardOrientation(qrCardGroup, orientation = QR_CARD_ORIENTATION.FLAT) {
    if (!qrCardGroup) return;

    qrCardGroup.userData.orientation = orientation;
    qrCardGroup.userData.updatedAt = new Date().toISOString();
}

export function setQRCardTransform(
    qrCardGroup,
    {
        position,
        rotation,
        scale,
    } = {},
) {
    if (!qrCardGroup) return;

    if (position) {
        qrCardGroup.position.set(position[0], position[1], position[2]);
    }

    if (rotation) {
        qrCardGroup.rotation.set(rotation[0], rotation[1], rotation[2]);
    }

    if (scale) {
        qrCardGroup.scale.set(scale[0], scale[1], scale[2]);
    }

    qrCardGroup.userData.updatedAt = new Date().toISOString();
}

export function getQRCardData(qrCardGroup) {
    return qrCardGroup?.userData?.qrData ?? null;
}

export function getQRCardParts(qrCardGroup) {
    if (!qrCardGroup) return {};

    return {
        body: qrCardGroup.getObjectByName("QRCardBody"),
        back: qrCardGroup.getObjectByName("QRCardBack"),
        paperLayers: qrCardGroup.getObjectByName("QRCardPaperLayers"),
        surface: qrCardGroup.getObjectByName("QRCardSurface"),
        border: qrCardGroup.getObjectByName("QRCardBorder"),
        stand: qrCardGroup.getObjectByName("QRCardStand"),
        slotBase: qrCardGroup.getObjectByName("QRCardSlotBase"),
        seal: qrCardGroup.getObjectByName("QRCardPhysicalSeal"),
        scanBeam: qrCardGroup.getObjectByName("QRCardScanBeam"),
        shadow: qrCardGroup.getObjectByName("QRCardSoftShadow"),
    };
}

export function updateQRCardAnimation(qrCardGroup, elapsedTime = 0) {
    if (!qrCardGroup) return;

    const beamLine = qrCardGroup.getObjectByName("QRScanBeamLine");
    const seal = qrCardGroup.getObjectByName("QRCardPhysicalSeal");

    if (beamLine) {
        const amplitude = 0.24;
        beamLine.position.z = Math.sin(elapsedTime * 1.2) * amplitude;

        if (beamLine.material) {
            beamLine.material.opacity = 0.12 + Math.sin(elapsedTime * 2.4) * 0.04;
        }
    }

    if (seal) {
        seal.rotation.y = Math.sin(elapsedTime * 0.28) * 0.018;
    }
}

function disposeTexture(texture) {
    if (texture?.dispose) {
        texture.dispose();
    }
}

function disposeMaterial(material) {
    if (!material) return;

    const materials = Array.isArray(material) ? material : [material];

    materials.forEach((item) => {
        if (!item) return;

        disposeTexture(item.map);
        disposeTexture(item.normalMap);
        disposeTexture(item.roughnessMap);
        disposeTexture(item.metalnessMap);
        disposeTexture(item.alphaMap);
        disposeTexture(item.emissiveMap);

        if (item.userData?.texture) {
            disposeTexture(item.userData.texture);
        }

        if (item.dispose) {
            item.dispose();
        }
    });
}

export function disposeQRCard(qrCardGroup) {
    if (!qrCardGroup) return;

    qrCardGroup.traverse((object) => {
        if (object.geometry?.dispose) {
            object.geometry.dispose();
        }

        if (object.material) {
            disposeMaterial(object.material);
        }
    });

    qrCardGroup.removeFromParent();
}

export const QRCard = Object.freeze({
    version: QR_CARD_VERSION,
    styles: QR_CARD_STYLES,
    orientation: QR_CARD_ORIENTATION,
    finishes: QR_CARD_FINISHES,
    scanStatus: QR_CARD_SCAN_STATUS,

    createQRCard,
    createQrCard,
    updateQRCard,
    updateQRCardAnimation,

    setQRCardVisibility,
    setQRCardStandVisibility,
    setQRCardScanBeamVisibility,
    setQRCardOrientation,
    setQRCardTransform,

    getQRCardData,
    getQRCardParts,
    disposeQRCard,
});
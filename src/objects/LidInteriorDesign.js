import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import {
    applyTransform,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

export const LID_INTERIOR_DESIGN_VERSION = "2.0.0";

export const LID_INTERIOR_STYLES = Object.freeze({
    PREMIUM_BLACK_GOLD: "premium-black-gold",
    BOLIVIA_2026: "bolivia-2026",
    ACADEMIC_SYSTEMS: "academic-systems",
    DEFENSE_CEREMONY: "defense-ceremony",
    JURY_ELEGANT: "jury-elegant",
    MINIMAL_LUXURY: "minimal-luxury",
});

export const LID_INTERIOR_FINISHES = Object.freeze({
    MATTE: "matte",
    SATIN: "satin",
    GLOSSY: "glossy",
    FOIL: "foil",
    LAMINATED: "laminated",
});

export const LID_INTERIOR_LAYOUTS = Object.freeze({
    CENTERED: "centered",
    HERO_MESSAGE: "hero-message",
    LOGO_TOP: "logo-top",
    DIAGONAL_PREMIUM: "diagonal-premium",
    WORLD_CUP_FRAME: "world-cup-frame",
});

const LOGO_PATHS = Object.freeze({
    claro: "/image/Logo-Claro.png",
    oscuro: "/image/Logo-Oscuro.png",
});

const DEFAULT_OPTIONS = Object.freeze({
    style: LID_INTERIOR_STYLES.PREMIUM_BLACK_GOLD,
    finish: LID_INTERIOR_FINISHES.SATIN,
    layout: LID_INTERIOR_LAYOUTS.HERO_MESSAGE,

    width: 2.42,
    height: 1.38,
    depth: 0.035,

    cornerRadius: 0.055,
    cornerSegments: 6,

    title: "Gracias por acompañarnos",
    subtitle: "Presentación académica",
    message: "Este detalle fue preparado para reconocer tu tiempo, criterio y apoyo en nuestro proyecto.",
    footer: "KickOff Box · Ingeniería de Sistemas · UNIFRANZ",
    recipient: "Jurado Académico",
    projectName: "Proyecto final",
    teamName: "Equipo académico",

    logoVariant: "claro",
    logoScale: 1,

    backgroundColor: "#111111",
    panelColor: "#fff7e8",
    textColor: "#fff7e8",
    darkTextColor: "#2b2118",
    accentColor: "#c59a4a",
    secondaryAccent: "#b92d2d",
    greenAccent: "#2f7d55",
    blueAccent: "#2f86c7",

    showBacking: true,
    showPrintedSurface: true,
    showLogo: true,
    showMessagePanel: true,
    showGoldFrame: true,
    showBoliviaRibbon: true,
    showTechPattern: true,
    showWorldCupMarks: true,
    showCornerProtectors: true,
    showFoilDetails: true,
    showGlossOverlay: true,
    showMountStrips: true,
    showShadow: true,

    canvasWidth: 2200,
    canvasHeight: 1300,

    opacity: 1,
    renderOrder: 7,
});

const STYLE_PRESETS = Object.freeze({
    [LID_INTERIOR_STYLES.PREMIUM_BLACK_GOLD]: Object.freeze({
        backgroundColor: "#111111",
        panelColor: "#fff7e8",
        textColor: "#fff7e8",
        darkTextColor: "#2b2118",
        accentColor: "#c59a4a",
        secondaryAccent: "#b92d2d",
        greenAccent: "#2f7d55",
        logoVariant: "oscuro",
        showBoliviaRibbon: true,
        showTechPattern: true,
        showWorldCupMarks: true,
    }),

    [LID_INTERIOR_STYLES.BOLIVIA_2026]: Object.freeze({
        backgroundColor: "#fff7e8",
        panelColor: "#111111",
        textColor: "#2b2118",
        darkTextColor: "#fff7e8",
        accentColor: "#f0c84b",
        secondaryAccent: "#b92d2d",
        greenAccent: "#2f7d55",
        logoVariant: "claro",
        showBoliviaRibbon: true,
        showTechPattern: true,
        showWorldCupMarks: true,
    }),

    [LID_INTERIOR_STYLES.ACADEMIC_SYSTEMS]: Object.freeze({
        backgroundColor: "#111827",
        panelColor: "#f8fbff",
        textColor: "#f8fbff",
        darkTextColor: "#111827",
        accentColor: "#2f86c7",
        secondaryAccent: "#c59a4a",
        greenAccent: "#2f7d55",
        logoVariant: "oscuro",
        showBoliviaRibbon: false,
        showTechPattern: true,
        showWorldCupMarks: false,
    }),

    [LID_INTERIOR_STYLES.DEFENSE_CEREMONY]: Object.freeze({
        backgroundColor: "#17110c",
        panelColor: "#fff7e8",
        textColor: "#fff7e8",
        darkTextColor: "#2b2118",
        accentColor: "#c59a4a",
        secondaryAccent: "#8b1f1f",
        greenAccent: "#2f7d55",
        logoVariant: "oscuro",
        showBoliviaRibbon: true,
        showTechPattern: true,
        showWorldCupMarks: true,
    }),

    [LID_INTERIOR_STYLES.JURY_ELEGANT]: Object.freeze({
        backgroundColor: "#23170e",
        panelColor: "#fff7e8",
        textColor: "#fff7e8",
        darkTextColor: "#2b2118",
        accentColor: "#c59a4a",
        secondaryAccent: "#7a4f2a",
        greenAccent: "#2f7d55",
        logoVariant: "oscuro",
        showBoliviaRibbon: false,
        showTechPattern: false,
        showWorldCupMarks: true,
    }),

    [LID_INTERIOR_STYLES.MINIMAL_LUXURY]: Object.freeze({
        backgroundColor: "#fffaf0",
        panelColor: "#111111",
        textColor: "#2b2118",
        darkTextColor: "#fff7e8",
        accentColor: "#c59a4a",
        secondaryAccent: "#374151",
        greenAccent: "#2f7d55",
        logoVariant: "claro",
        showBoliviaRibbon: false,
        showTechPattern: false,
        showWorldCupMarks: false,
    }),
});

const textureLoader = new THREE.TextureLoader();
const textureCache = new Map();

function normalizeOptions(config = {}, extraOptions = {}) {
    const source = config.lidInteriorDesign ?? config.lidDesign ?? config.lid ?? config;
    const visual = config.visual ?? config.sceneConfig?.visual ?? {};
    const text = config.text ?? config.content?.text ?? {};
    const project = config.project ?? config.content?.project ?? {};
    const product = config.product ?? config.sceneConfig?.product ?? {};

    const style =
        source.style ??
        visual.lidInteriorStyle ??
        DEFAULT_OPTIONS.style;

    const preset =
        STYLE_PRESETS[style] ??
        STYLE_PRESETS[LID_INTERIOR_STYLES.PREMIUM_BLACK_GOLD];

    return {
        ...DEFAULT_OPTIONS,
        ...preset,
        ...source,
        ...extraOptions,

        style,

        title:
            text.lidTitle ??
            source.title ??
            DEFAULT_OPTIONS.title,

        subtitle:
            text.lidSubtitle ??
            source.subtitle ??
            project.projectName ??
            DEFAULT_OPTIONS.subtitle,

        message:
            text.lidMessage ??
            source.message ??
            project.message ??
            DEFAULT_OPTIONS.message,

        footer:
            text.lidFooter ??
            source.footer ??
            DEFAULT_OPTIONS.footer,

        recipient:
            text.recipient ??
            source.recipient ??
            project.recipientName ??
            DEFAULT_OPTIONS.recipient,

        projectName:
            project.projectName ??
            source.projectName ??
            DEFAULT_OPTIONS.projectName,

        teamName:
            project.teamName ??
            source.teamName ??
            DEFAULT_OPTIONS.teamName,

        logoVariant:
            source.logoVariant ??
            product.logoVariant ??
            preset.logoVariant ??
            DEFAULT_OPTIONS.logoVariant,

        accentColor:
            visual.accentColor ??
            source.accentColor ??
            preset.accentColor,

        backgroundColor:
            source.backgroundColor ??
            visual.lidBackgroundColor ??
            preset.backgroundColor,

        panelColor:
            source.panelColor ??
            visual.lidPanelColor ??
            preset.panelColor,
    };
}

function setTextureQuality(texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;

    return texture;
}

function getLogoPath(variant = "claro") {
    return LOGO_PATHS[variant] ?? LOGO_PATHS.claro;
}

function createFallbackLogoTexture(options = {}) {
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 900;

    const ctx = canvas.getContext("2d");
    const isDark = options.logoVariant === "oscuro";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createRadialGradient(450, 370, 70, 450, 450, 360);
    gradient.addColorStop(0, isDark ? "#2b2118" : "#fffdf8");
    gradient.addColorStop(1, isDark ? "#111111" : "#fff7e8");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(450, 450, 345, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = options.accentColor ?? "#c59a4a";
    ctx.lineWidth = 24;
    ctx.stroke();

    ctx.fillStyle = isDark ? "#fff7e8" : "#2b2118";
    ctx.font = "900 150px Arial, Helvetica, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SIS", 450, 380);

    ctx.fillStyle = options.accentColor ?? "#c59a4a";
    ctx.font = "900 50px Arial, Helvetica, sans-serif";
    ctx.fillText("UNIFRANZ", 450, 510);

    ctx.fillStyle = isDark ? "#fff7e8" : "#2b2118";
    ctx.font = "800 36px Arial, Helvetica, sans-serif";
    ctx.fillText("2026", 450, 590);

    const texture = new THREE.CanvasTexture(canvas);
    setTextureQuality(texture);

    texture.userData = {
        generatedBy: "LidInteriorDesignFallbackLogo",
        createdAt: new Date().toISOString(),
    };

    return texture;
}

function loadLogoTexture(options = {}) {
    const variant = options.logoVariant === "oscuro" ? "oscuro" : "claro";
    const path = getLogoPath(variant);
    const cacheKey = `${path}:${variant}:${options.accentColor}`;

    if (textureCache.has(cacheKey)) {
        return textureCache.get(cacheKey).clone();
    }

    const fallback = createFallbackLogoTexture({
        ...options,
        logoVariant: variant,
    });

    const texture = textureLoader.load(
        path,
        (loadedTexture) => {
            setTextureQuality(loadedTexture);
        },
        undefined,
        () => {
            texture.image = fallback.image;
            texture.needsUpdate = true;
            texture.userData.fallbackUsed = true;
        },
    );

    setTextureQuality(texture);

    texture.userData = {
        generatedBy: "LidInteriorDesignLogo",
        path,
        variant,
        fallback,
        fallbackUsed: false,
    };

    textureCache.set(cacheKey, texture);

    return texture.clone();
}

function createFinishSettings(finish) {
    if (finish === LID_INTERIOR_FINISHES.MATTE) {
        return {
            roughness: 0.92,
            metalness: 0.01,
            clearcoat: 0,
            clearcoatRoughness: 0.72,
        };
    }

    if (finish === LID_INTERIOR_FINISHES.GLOSSY) {
        return {
            roughness: 0.22,
            metalness: 0.02,
            clearcoat: 0.58,
            clearcoatRoughness: 0.1,
        };
    }

    if (finish === LID_INTERIOR_FINISHES.FOIL) {
        return {
            roughness: 0.28,
            metalness: 0.2,
            clearcoat: 0.42,
            clearcoatRoughness: 0.12,
        };
    }

    if (finish === LID_INTERIOR_FINISHES.LAMINATED) {
        return {
            roughness: 0.18,
            metalness: 0.015,
            clearcoat: 0.72,
            clearcoatRoughness: 0.06,
        };
    }

    return {
        roughness: 0.58,
        metalness: 0.01,
        clearcoat: 0.22,
        clearcoatRoughness: 0.28,
    };
}

function createPhysicalMaterial(name, color, options = {}) {
    const finish = createFinishSettings(options.finish);

    return new THREE.MeshPhysicalMaterial({
        name,
        color,
        roughness: finish.roughness,
        metalness: finish.metalness,
        clearcoat: finish.clearcoat,
        clearcoatRoughness: finish.clearcoatRoughness,
        transparent: options.opacity < 1,
        opacity: options.opacity,
        side: THREE.DoubleSide,
    });
}

function createGoldMaterial(options) {
    return new THREE.MeshStandardMaterial({
        name: "LidInteriorGoldMaterial",
        color: options.accentColor,
        roughness: options.finish === LID_INTERIOR_FINISHES.FOIL ? 0.2 : 0.32,
        metalness: options.finish === LID_INTERIOR_FINISHES.FOIL ? 0.48 : 0.28,
    });
}

function createGlossMaterial(options) {
    return new THREE.MeshBasicMaterial({
        name: "LidInteriorGlossMaterial",
        color: "#ffffff",
        transparent: true,
        opacity: options.finish === LID_INTERIOR_FINISHES.MATTE ? 0.05 : 0.16,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });
}

function createRoundedMesh({
    name,
    width,
    height,
    depth,
    radius = 0.04,
    segments = 5,
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
        generatedBy: "LidInteriorDesign",
        version: LID_INTERIOR_DESIGN_VERSION,
        ...userData,
    };

    setMeshShadow(mesh, true, true);

    return mesh;
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

function hexToRgba(hex, alpha = 1) {
    const value = String(hex).replace("#", "");
    const normalized = value.length === 3
        ? value.split("").map((char) => char + char).join("")
        : value;

    const numeric = Number.parseInt(normalized, 16);

    if (Number.isNaN(numeric)) {
        return `rgba(197,154,74,${alpha})`;
    }

    const r = (numeric >> 16) & 255;
    const g = (numeric >> 8) & 255;
    const b = numeric & 255;

    return `rgba(${r},${g},${b},${alpha})`;
}

function drawMultilineText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
    const words = String(text ?? "").split(/\s+/);
    const lines = [];
    let line = "";

    words.forEach((word) => {
        const test = line ? `${line} ${word}` : word;

        if (ctx.measureText(test).width > maxWidth && line) {
            lines.push(line);
            line = word;
        } else {
            line = test;
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

function drawBackground(ctx, width, height, options) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, options.backgroundColor);
    gradient.addColorStop(0.52, options.backgroundColor);
    gradient.addColorStop(1, "#2b2118");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const radial = ctx.createRadialGradient(width * 0.5, height * 0.18, 50, width * 0.5, height * 0.3, width * 0.7);
    radial.addColorStop(0, hexToRgba(options.accentColor, 0.24));
    radial.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);
}

function drawBoliviaRibbon(ctx, width, options) {
    if (!options.showBoliviaRibbon) return;

    const bandHeight = 42;

    ctx.fillStyle = options.secondaryAccent;
    ctx.fillRect(0, 0, width, bandHeight);

    ctx.fillStyle = "#f0c84b";
    ctx.fillRect(0, bandHeight, width, bandHeight);

    ctx.fillStyle = options.greenAccent;
    ctx.fillRect(0, bandHeight * 2, width, bandHeight);
}

function drawTechPattern(ctx, width, height, options) {
    if (!options.showTechPattern) return;

    ctx.save();

    ctx.strokeStyle = hexToRgba(options.textColor, 0.13);
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const nodes = [
        [160, 230], [300, 230], [390, 320],
        [width - 160, 230], [width - 300, 230], [width - 390, 320],
        [230, height - 220], [360, height - 220], [450, height - 300],
        [width - 230, height - 220], [width - 360, height - 220], [width - 450, height - 300],
        [width * 0.5 - 190, height * 0.52], [width * 0.5 - 80, height * 0.47],
        [width * 0.5 + 190, height * 0.52], [width * 0.5 + 80, height * 0.47],
    ];

    const paths = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [9, 10, 11],
        [12, 13],
        [14, 15],
    ];

    paths.forEach((path) => {
        ctx.beginPath();
        ctx.moveTo(nodes[path[0]][0], nodes[path[0]][1]);

        for (let i = 1; i < path.length; i += 1) {
            ctx.lineTo(nodes[path[i]][0], nodes[path[i]][1]);
        }

        ctx.stroke();
    });

    ctx.fillStyle = hexToRgba(options.accentColor, 0.72);

    nodes.forEach(([x, y], index) => {
        const radius = index % 3 === 0 ? 13 : 9;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.restore();
}

function drawWorldCupMarks(ctx, width, height, options) {
    if (!options.showWorldCupMarks) return;

    ctx.save();

    ctx.strokeStyle = hexToRgba(options.accentColor, 0.38);
    ctx.lineWidth = 8;

    const ballX = width - 250;
    const ballY = height * 0.45;
    const radius = 95;

    ctx.beginPath();
    ctx.arc(ballX, ballY, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(ballX, ballY, radius * 0.52, 0, Math.PI * 2);
    ctx.stroke();

    for (let index = 0; index < 6; index += 1) {
        const angle = (index / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(ballX, ballY);
        ctx.lineTo(ballX + Math.cos(angle) * radius, ballY + Math.sin(angle) * radius);
        ctx.stroke();
    }

    ctx.fillStyle = hexToRgba(options.textColor, 0.12);
    ctx.font = "900 92px Arial, Helvetica, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("2026", ballX, ballY + radius + 88);

    ctx.restore();
}

function drawMessagePanel(ctx, width, height, options) {
    if (!options.showMessagePanel) return;

    const panelWidth = width * 0.62;
    const panelHeight = height * 0.58;
    const panelX = width * 0.5 - panelWidth / 2;
    const panelY = height * 0.32;

    ctx.save();

    ctx.fillStyle = hexToRgba(options.panelColor, options.style === LID_INTERIOR_STYLES.PREMIUM_BLACK_GOLD ? 0.94 : 0.9);
    roundedRectPath(ctx, panelX, panelY, panelWidth, panelHeight, 52);
    ctx.fill();

    ctx.strokeStyle = options.accentColor;
    ctx.lineWidth = 9;
    roundedRectPath(ctx, panelX + 22, panelY + 22, panelWidth - 44, panelHeight - 44, 38);
    ctx.stroke();

    ctx.strokeStyle = hexToRgba("#ffffff", 0.48);
    ctx.lineWidth = 3;
    roundedRectPath(ctx, panelX + 46, panelY + 46, panelWidth - 92, panelHeight - 92, 28);
    ctx.stroke();

    ctx.fillStyle = options.darkTextColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "900 66px Arial, Helvetica, sans-serif";
    drawMultilineText(ctx, options.title, width / 2, panelY + 125, panelWidth - 170, 72, 2);

    ctx.fillStyle = options.secondaryAccent;
    ctx.font = "900 38px Arial, Helvetica, sans-serif";
    drawMultilineText(ctx, options.recipient, width / 2, panelY + 228, panelWidth - 220, 42, 1);

    ctx.fillStyle = hexToRgba(options.darkTextColor, 0.78);
    ctx.font = "600 36px Arial, Helvetica, sans-serif";
    drawMultilineText(ctx, options.message, width / 2, panelY + 350, panelWidth - 230, 48, 4);

    ctx.fillStyle = options.accentColor;
    ctx.fillRect(width / 2 - 240, panelY + panelHeight - 135, 480, 7);

    ctx.fillStyle = hexToRgba(options.darkTextColor, 0.72);
    ctx.font = "800 28px Arial, Helvetica, sans-serif";
    drawMultilineText(ctx, options.footer, width / 2, panelY + panelHeight - 82, panelWidth - 240, 34, 2);

    ctx.restore();
}

function drawHeaderText(ctx, width, height, options) {
    ctx.save();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = options.textColor;
    ctx.font = "900 44px Arial, Helvetica, sans-serif";
    drawMultilineText(ctx, options.subtitle, width / 2, 210, width - 520, 50, 1);

    ctx.fillStyle = hexToRgba(options.textColor, 0.7);
    ctx.font = "700 26px Arial, Helvetica, sans-serif";
    drawMultilineText(ctx, `${options.projectName} · ${options.teamName}`, width / 2, 262, width - 620, 32, 1);

    ctx.restore();
}

function drawFoilDetails(ctx, width, height, options) {
    if (!options.showFoilDetails) return;

    ctx.save();

    ctx.strokeStyle = hexToRgba(options.accentColor, 0.72);
    ctx.lineWidth = 7;

    roundedRectPath(ctx, 90, 155, width - 180, height - 235, 58);
    ctx.stroke();

    ctx.strokeStyle = hexToRgba(options.accentColor, 0.38);
    ctx.lineWidth = 3;

    roundedRectPath(ctx, 132, 197, width - 264, height - 319, 44);
    ctx.stroke();

    const cornerSize = 130;
    const corners = [
        [135, 200, 1, 1],
        [width - 135, 200, -1, 1],
        [135, height - 125, 1, -1],
        [width - 135, height - 125, -1, -1],
    ];

    ctx.fillStyle = options.accentColor;

    corners.forEach(([x, y, sx, sy]) => {
        ctx.fillRect(x, y, cornerSize * sx, 12 * sy);
        ctx.fillRect(x, y, 12 * sx, cornerSize * sy);
    });

    ctx.restore();
}

function drawPaperNoise(ctx, width, height) {
    ctx.save();

    for (let index = 0; index < 900; index += 1) {
        const alpha = Math.random() * 0.026;
        ctx.fillStyle = `rgba(255,247,232,${alpha})`;
        ctx.fillRect(
            Math.random() * width,
            Math.random() * height,
            Math.random() * 2 + 0.4,
            Math.random() * 2 + 0.4,
        );
    }

    ctx.restore();
}

function createLidCanvasTexture(options) {
    const canvas = document.createElement("canvas");
    canvas.width = options.canvasWidth;
    canvas.height = options.canvasHeight;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    drawBackground(ctx, width, height, options);
    drawBoliviaRibbon(ctx, width, options);
    drawTechPattern(ctx, width, height, options);
    drawWorldCupMarks(ctx, width, height, options);
    drawFoilDetails(ctx, width, height, options);
    drawHeaderText(ctx, width, height, options);
    drawMessagePanel(ctx, width, height, options);
    drawPaperNoise(ctx, width, height);

    const texture = new THREE.CanvasTexture(canvas);
    setTextureQuality(texture);

    texture.userData = {
        generatedBy: "LidInteriorDesign",
        version: LID_INTERIOR_DESIGN_VERSION,
        options,
        createdAt: new Date().toISOString(),
    };

    return {
        canvas,
        texture,
    };
}

function createBacking(options) {
    const backing = createRoundedMesh({
        name: "LidInteriorBacking",
        width: options.width,
        height: options.depth,
        depth: options.height,
        radius: options.cornerRadius,
        segments: options.cornerSegments,
        material: createPhysicalMaterial(
            "LidInteriorBackingMaterial",
            options.backgroundColor,
            options,
        ),
        rotation: [Math.PI / 2, 0, 0],
        position: [0, -0.018, 0],
        userData: {
            part: "backing",
        },
    });

    backing.visible = Boolean(options.showBacking);
    return backing;
}

function createPrintedSurface(options, textureSet = {}) {
    const texture =
        textureSet.lidInterior?.texture ??
        createLidCanvasTexture(options).texture;

    const material = new THREE.MeshBasicMaterial({
        name: "LidInteriorPrintedSurfaceMaterial",
        map: texture,
        transparent: true,
        opacity: options.opacity,
        side: THREE.DoubleSide,
    });

    material.userData = {
        generatedBy: "LidInteriorDesign",
        texture,
        options,
    };

    const surface = new THREE.Mesh(
        new THREE.PlaneGeometry(options.width * 0.965, options.height * 0.94, 8, 5),
        material,
    );

    surface.name = "LidInteriorPrintedSurface";
    surface.rotation.x = -Math.PI / 2;
    surface.position.y = options.depth / 2 + 0.004;
    surface.renderOrder = options.renderOrder;
    surface.visible = Boolean(options.showPrintedSurface);
    surface.userData = {
        generatedBy: "LidInteriorDesign",
        part: "printed-surface",
        editable: true,
    };

    setMeshShadow(surface, false, true);

    return surface;
}

function createLogoPlane(options) {
    const texture = loadLogoTexture(options);

    const material = new THREE.MeshBasicMaterial({
        name: "LidInteriorLogoMaterial",
        map: texture,
        transparent: true,
        opacity: 0.96,
        side: THREE.DoubleSide,
        depthWrite: false,
    });

    material.userData = {
        generatedBy: "LidInteriorDesign",
        texture,
        variant: options.logoVariant,
    };

    const logoSize = options.layout === LID_INTERIOR_LAYOUTS.LOGO_TOP ? 0.36 : 0.28;

    const logo = new THREE.Mesh(
        new THREE.PlaneGeometry(logoSize, logoSize),
        material,
    );

    logo.name = "LidInteriorLogo";
    logo.rotation.x = -Math.PI / 2;
    logo.position.set(
        0,
        options.depth / 2 + 0.018,
        options.layout === LID_INTERIOR_LAYOUTS.LOGO_TOP ? -options.height * 0.31 : -options.height * 0.36,
    );
    logo.scale.setScalar(options.logoScale);
    logo.renderOrder = options.renderOrder + 2;
    logo.visible = Boolean(options.showLogo);
    logo.userData = {
        part: "logo",
        editable: true,
        preserveAspect: true,
    };

    return logo;
}

function createGoldFrame(options) {
    const group = new THREE.Group();
    group.name = "LidInteriorGoldFrame";
    group.visible = Boolean(options.showGoldFrame);

    const material = createGoldMaterial(options);
    const y = options.depth / 2 + 0.024;
    const t = 0.018;
    const w = options.width * 0.99;
    const h = options.height * 0.975;

    const pieces = [
        {
            name: "LidInteriorFrameTop",
            size: [w, t, t],
            position: [0, y, -h / 2],
        },
        {
            name: "LidInteriorFrameBottom",
            size: [w, t, t],
            position: [0, y, h / 2],
        },
        {
            name: "LidInteriorFrameLeft",
            size: [t, t, h],
            position: [-w / 2, y, 0],
        },
        {
            name: "LidInteriorFrameRight",
            size: [t, t, h],
            position: [w / 2, y, 0],
        },
    ];

    pieces.forEach((piece) => {
        const mesh = createRoundedMesh({
            name: piece.name,
            width: piece.size[0],
            height: piece.size[1],
            depth: piece.size[2],
            radius: 0.006,
            segments: 2,
            material: material.clone(),
            position: piece.position,
            userData: {
                part: "gold-frame",
            },
        });

        group.add(mesh);
    });

    return group;
}

function createCornerProtectors(options) {
    const group = new THREE.Group();
    group.name = "LidInteriorCornerProtectors";
    group.visible = Boolean(options.showCornerProtectors);

    const material = createGoldMaterial(options);
    const y = options.depth / 2 + 0.034;
    const x = options.width * 0.43;
    const z = options.height * 0.39;

    const positions = [
        [-x, y, -z],
        [x, y, -z],
        [-x, y, z],
        [x, y, z],
    ];

    positions.forEach((position, index) => {
        const protector = createRoundedMesh({
            name: `LidInteriorCornerProtector_${index + 1}`,
            width: 0.16,
            height: 0.016,
            depth: 0.16,
            radius: 0.028,
            segments: 4,
            material: material.clone(),
            position,
            userData: {
                part: "corner-protector",
            },
        });

        group.add(protector);
    });

    return group;
}

function createMountStrips(options) {
    const group = new THREE.Group();
    group.name = "LidInteriorMountStrips";
    group.visible = Boolean(options.showMountStrips);

    const material = new THREE.MeshBasicMaterial({
        name: "LidInteriorMountStripMaterial",
        color: "#000000",
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide,
        depthWrite: false,
    });

    const y = -options.depth / 2 - 0.006;
    const z = options.height * 0.36;

    [-z, z].forEach((currentZ, index) => {
        const strip = createRoundedMesh({
            name: `LidInteriorMountStrip_${index + 1}`,
            width: options.width * 0.72,
            height: 0.006,
            depth: 0.035,
            radius: 0.012,
            segments: 2,
            material: material.clone(),
            position: [0, y, currentZ],
            userData: {
                part: "mount-strip",
            },
        });

        group.add(strip);
    });

    return group;
}

function createGlossOverlay(options) {
    const group = new THREE.Group();
    group.name = "LidInteriorGlossOverlay";
    group.visible = Boolean(options.showGlossOverlay);

    const material = createGlossMaterial(options);

    const main = new THREE.Mesh(
        new THREE.PlaneGeometry(options.width * 0.22, options.height * 0.78),
        material,
    );

    main.name = "LidInteriorMainGloss";
    main.rotation.x = -Math.PI / 2;
    main.rotation.z = -0.22;
    main.position.set(-options.width * 0.29, options.depth / 2 + 0.042, -options.height * 0.02);
    main.renderOrder = options.renderOrder + 4;

    const side = new THREE.Mesh(
        new THREE.PlaneGeometry(options.width * 0.11, options.height * 0.42),
        material.clone(),
    );

    side.name = "LidInteriorSideGloss";
    side.material.opacity *= 0.55;
    side.rotation.x = -Math.PI / 2;
    side.rotation.z = 0.22;
    side.position.set(options.width * 0.32, options.depth / 2 + 0.043, options.height * 0.08);
    side.renderOrder = options.renderOrder + 4;

    group.add(main, side);

    return group;
}

function createContactShadow(options) {
    const group = new THREE.Group();
    group.name = "LidInteriorShadow";
    group.visible = Boolean(options.showShadow);

    const material = new THREE.MeshBasicMaterial({
        name: "LidInteriorShadowMaterial",
        color: "#000000",
        transparent: true,
        opacity: 0.16,
        side: THREE.DoubleSide,
        depthWrite: false,
    });

    const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(options.width * 0.96, options.height * 0.92),
        material,
    );

    shadow.name = "LidInteriorContactShadow";
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -options.depth / 2 - 0.02;
    shadow.renderOrder = -1;

    group.add(shadow);

    return group;
}

function applyConfigTransform(group, config = {}, options = {}) {
    const layout =
        config.layout ??
        config.transform ??
        config.contentLayout?.lidInteriorDesign ??
        config.contentLayout?.lidInterior ??
        {};

    applyTransform(group, {
        position: layout.position ?? options.position ?? [0, 0.96, -0.72],
        rotation: layout.rotation ?? options.rotation ?? [-Math.PI / 2.9, 0, 0],
        scale: layout.scale ?? options.scale ?? [1, 1, 1],
    });
}

function createMetadata(options) {
    return {
        objectType: "LidInteriorDesign",
        version: LID_INTERIOR_DESIGN_VERSION,
        style: options.style,
        finish: options.finish,
        layout: options.layout,
        dimensions: {
            width: options.width,
            height: options.height,
            depth: options.depth,
        },
        editable: true,
        exportable: true,
        text: {
            title: options.title,
            subtitle: options.subtitle,
            message: options.message,
            footer: options.footer,
            recipient: options.recipient,
        },
        purpose: "premium-inside-lid-branding-and-message-panel",
        createdAt: new Date().toISOString(),
    };
}

export function createLidInteriorDesign(config = {}, materials = {}, textureSet = {}, extraOptions = {}) {
    const options = normalizeOptions(config, extraOptions);

    const group = new THREE.Group();
    group.name = "KickOffBoxLidInteriorDesign";
    group.userData = createMetadata(options);

    const shadow = createContactShadow(options);
    const backing = createBacking(options);
    const surface = createPrintedSurface(options, textureSet);
    const logo = createLogoPlane(options);
    const frame = createGoldFrame(options);
    const corners = createCornerProtectors(options);
    const mountStrips = createMountStrips(options);
    const gloss = createGlossOverlay(options);

    group.add(
        shadow,
        mountStrips,
        backing,
        surface,
        logo,
        frame,
        corners,
        gloss,
    );

    group.userData.parts = {
        shadow: shadow.name,
        mountStrips: mountStrips.name,
        backing: backing.name,
        surface: surface.name,
        logo: logo.name,
        frame: frame.name,
        corners: corners.name,
        gloss: gloss.name,
    };

    applyConfigTransform(group, config, options);
    setGroupShadow(group, true, true);

    return group;
}

export function createLidDesign(config = {}, materials = {}, textureSet = {}, extraOptions = {}) {
    return createLidInteriorDesign(config, materials, textureSet, extraOptions);
}

export function updateLidInteriorDesign(lidGroup, nextOptions = {}, textureSet = {}) {
    if (!lidGroup) return null;

    const currentOptions = {
        ...DEFAULT_OPTIONS,
        ...(lidGroup.userData ?? {}),
        ...(lidGroup.userData?.options ?? {}),
        ...nextOptions,
    };

    const options = normalizeOptions(currentOptions, nextOptions);
    const surface = lidGroup.getObjectByName("LidInteriorPrintedSurface");

    if (surface?.material) {
        disposeMaterial(surface.material);

        const texture =
            textureSet.lidInterior?.texture ??
            createLidCanvasTexture(options).texture;

        const material = new THREE.MeshBasicMaterial({
            name: "LidInteriorPrintedSurfaceMaterial",
            map: texture,
            transparent: true,
            opacity: options.opacity,
            side: THREE.DoubleSide,
        });

        material.userData = {
            generatedBy: "LidInteriorDesign",
            texture,
            options,
        };

        surface.material = material;
        surface.material.needsUpdate = true;
    }

    if (nextOptions.logoVariant) {
        updateLidInteriorLogoVariant(lidGroup, nextOptions.logoVariant);
    }

    lidGroup.userData = {
        ...lidGroup.userData,
        ...createMetadata(options),
        options,
        updatedAt: new Date().toISOString(),
    };

    return lidGroup;
}

export function updateLidInteriorLogoVariant(lidGroup, logoVariant = "claro") {
    const logo = lidGroup?.getObjectByName("LidInteriorLogo");

    if (!logo?.material) return;

    disposeTexture(logo.material.map);

    const texture = loadLogoTexture({
        ...(lidGroup.userData?.options ?? {}),
        logoVariant,
    });

    logo.material.map = texture;
    logo.material.userData.texture = texture;
    logo.material.userData.variant = logoVariant;
    logo.material.needsUpdate = true;

    lidGroup.userData.logoVariant = logoVariant;
    lidGroup.userData.updatedAt = new Date().toISOString();
}

export function setLidInteriorVisibility(lidGroup, visible = true) {
    if (!lidGroup) return;

    lidGroup.visible = Boolean(visible);
    lidGroup.userData.visible = Boolean(visible);
    lidGroup.userData.updatedAt = new Date().toISOString();
}

export function setLidInteriorLogoVisibility(lidGroup, visible = true) {
    const logo = lidGroup?.getObjectByName("LidInteriorLogo");

    if (!logo) return;

    logo.visible = Boolean(visible);
}

export function setLidInteriorFrameVisibility(lidGroup, visible = true) {
    const frame = lidGroup?.getObjectByName("LidInteriorGoldFrame");

    if (!frame) return;

    frame.visible = Boolean(visible);
}

export function setLidInteriorGlossVisibility(lidGroup, visible = true) {
    const gloss = lidGroup?.getObjectByName("LidInteriorGlossOverlay");

    if (!gloss) return;

    gloss.visible = Boolean(visible);
}

export function setLidInteriorTransform(lidGroup, { position, rotation, scale } = {}) {
    if (!lidGroup) return;

    if (position) lidGroup.position.set(position[0], position[1], position[2]);
    if (rotation) lidGroup.rotation.set(rotation[0], rotation[1], rotation[2]);
    if (scale) lidGroup.scale.set(scale[0], scale[1], scale[2]);

    lidGroup.userData.updatedAt = new Date().toISOString();
}

export function updateLidInteriorAnimation(lidGroup, elapsedTime = 0) {
    if (!lidGroup) return;

    const gloss = lidGroup.getObjectByName("LidInteriorGlossOverlay");
    const logo = lidGroup.getObjectByName("LidInteriorLogo");

    if (gloss) {
        gloss.children.forEach((child, index) => {
            if (child.material) {
                child.material.opacity = 0.11 + Math.sin(elapsedTime * 1.15 + index) * 0.022;
            }
        });
    }

    if (logo) {
        logo.position.y += Math.sin(elapsedTime * 0.85) * 0.0002;
    }
}

export function getLidInteriorParts(lidGroup) {
    if (!lidGroup) return {};

    return {
        shadow: lidGroup.getObjectByName("LidInteriorShadow"),
        mountStrips: lidGroup.getObjectByName("LidInteriorMountStrips"),
        backing: lidGroup.getObjectByName("LidInteriorBacking"),
        surface: lidGroup.getObjectByName("LidInteriorPrintedSurface"),
        logo: lidGroup.getObjectByName("LidInteriorLogo"),
        frame: lidGroup.getObjectByName("LidInteriorGoldFrame"),
        corners: lidGroup.getObjectByName("LidInteriorCornerProtectors"),
        gloss: lidGroup.getObjectByName("LidInteriorGlossOverlay"),
    };
}

function disposeTexture(texture) {
    if (texture?.dispose) {
        texture.dispose();
    }

    if (texture?.userData?.fallback) {
        disposeTexture(texture.userData.fallback);
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

export function disposeLidInteriorDesign(lidGroup) {
    if (!lidGroup) return;

    const disposedGeometries = new Set();
    const disposedMaterials = new Set();

    lidGroup.traverse((object) => {
        if (object.geometry && !disposedGeometries.has(object.geometry)) {
            object.geometry.dispose();
            disposedGeometries.add(object.geometry);
        }

        if (object.material && !disposedMaterials.has(object.material)) {
            disposeMaterial(object.material);
            disposedMaterials.add(object.material);
        }
    });

    lidGroup.removeFromParent();
}

export function disposeLidDesign(lidGroup) {
    disposeLidInteriorDesign(lidGroup);
}

export function disposeLidInteriorTextureCache() {
    textureCache.forEach((texture) => {
        disposeTexture(texture);
    });

    textureCache.clear();
}

export const LidInteriorDesign = Object.freeze({
    version: LID_INTERIOR_DESIGN_VERSION,
    styles: LID_INTERIOR_STYLES,
    finishes: LID_INTERIOR_FINISHES,
    layouts: LID_INTERIOR_LAYOUTS,

    createLidInteriorDesign,
    createLidDesign,

    updateLidInteriorDesign,
    updateLidInteriorLogoVariant,
    updateLidInteriorAnimation,

    setLidInteriorVisibility,
    setLidInteriorLogoVisibility,
    setLidInteriorFrameVisibility,
    setLidInteriorGlossVisibility,
    setLidInteriorTransform,

    getLidInteriorParts,
    disposeLidInteriorDesign,
    disposeLidDesign,
    disposeLidInteriorTextureCache,
});
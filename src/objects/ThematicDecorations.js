import * as THREE from "three";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import {
    applyTransform,
    getBoxDimensions,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

export const THEMATIC_DECORATIONS_VERSION = "2.0.0";

export const THEMATIC_DECORATION_THEMES = Object.freeze({
    KICKOFF_2026: "kickoff-2026",
    BOLIVIA_WORLD_CUP: "bolivia-world-cup",
    ACADEMIC_TECH: "academic-tech",
    PREMIUM_JURY: "premium-jury",
    DEFENSE_SHOWCASE: "defense-showcase",
    MINIMAL_ELEGANT: "minimal-elegant",
});

export const THEMATIC_DECORATION_DENSITY = Object.freeze({
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
    SHOWCASE: "showcase",
});

export const THEMATIC_DECORATION_PLACEMENT = Object.freeze({
    INSIDE_BOX: "inside-box",
    OUTSIDE_BOX: "outside-box",
    FULL_SCENE: "full-scene",
    PRESENTATION: "presentation",
});

const DEFAULT_DECORATION_OPTIONS = Object.freeze({
    theme: THEMATIC_DECORATION_THEMES.KICKOFF_2026,
    density: THEMATIC_DECORATION_DENSITY.HIGH,
    placement: THEMATIC_DECORATION_PLACEMENT.FULL_SCENE,

    showFrontPlate: true,
    showLidPlate: true,
    showSideBadges: true,
    showTechLines: true,
    showPixelArc: true,
    showFieldLines: true,
    showTricolorRibbon: true,
    showWorldCupBadge: true,
    showFloatingNodes: true,
    showConfetti: true,
    showStars: true,
    showCornerAccents: true,
    showAcademicSeal: true,
    showGoldenThreads: true,
    showSubtleFloorPattern: true,

    frontText: "Presente Académico",
    frontSubtitle: "Defensa · Proyecto · Reconocimiento",
    lidText: "KickOff Box",
    lidSubtitle: "Mundial 2026 · Tecnología · Identidad académica",
    badgeText: "2026",
    academicText: "Ingeniería de Sistemas",
    universityText: "UNIFRANZ",
    footerText: "Fútbol · Tecnología · Identidad Bolivia",

    accentColor: "#c59a4a",
    darkColor: "#2b2118",
    lightColor: "#fff7e8",
    red: "#b92d2d",
    yellow: "#f0c84b",
    green: "#2f7d55",
    blue: "#2f86c7",

    canvasWidth: 1800,
    canvasHeight: 1000,

    frontPlateWidth: 2.58,
    frontPlateHeight: 0.84,
    lidPlateWidth: 2.56,
    lidPlateHeight: 1.28,

    opacity: 1,
    renderOrder: 12,

    confettiCount: 86,
    starCount: 42,
    pixelCount: 68,
    floatingNodeCount: 9,

    minScale: 0.35,
    maxScale: 1.7,
});

const THEME_PRESETS = Object.freeze({
    [THEMATIC_DECORATION_THEMES.KICKOFF_2026]: Object.freeze({
        accentColor: "#c59a4a",
        darkColor: "#2b2118",
        lightColor: "#fff7e8",
        red: "#b92d2d",
        yellow: "#f0c84b",
        green: "#2f7d55",
        blue: "#2f86c7",
        showTricolorRibbon: true,
        showFieldLines: true,
        showTechLines: true,
        showWorldCupBadge: true,
    }),

    [THEMATIC_DECORATION_THEMES.BOLIVIA_WORLD_CUP]: Object.freeze({
        accentColor: "#f0c84b",
        darkColor: "#2b2118",
        lightColor: "#fff7e8",
        red: "#b92d2d",
        yellow: "#f0c84b",
        green: "#2f7d55",
        blue: "#2f86c7",
        showTricolorRibbon: true,
        showFieldLines: true,
        showTechLines: true,
        showWorldCupBadge: true,
    }),

    [THEMATIC_DECORATION_THEMES.ACADEMIC_TECH]: Object.freeze({
        accentColor: "#2f86c7",
        darkColor: "#111827",
        lightColor: "#f8fbff",
        red: "#b92d2d",
        yellow: "#c59a4a",
        green: "#2f7d55",
        blue: "#2f86c7",
        showTricolorRibbon: false,
        showFieldLines: false,
        showTechLines: true,
        showWorldCupBadge: false,
    }),

    [THEMATIC_DECORATION_THEMES.PREMIUM_JURY]: Object.freeze({
        accentColor: "#c59a4a",
        darkColor: "#17110c",
        lightColor: "#fff7e8",
        red: "#7a1e1e",
        yellow: "#e9c678",
        green: "#2f7d55",
        blue: "#2f86c7",
        showTricolorRibbon: false,
        showFieldLines: false,
        showTechLines: true,
        showWorldCupBadge: true,
    }),

    [THEMATIC_DECORATION_THEMES.DEFENSE_SHOWCASE]: Object.freeze({
        accentColor: "#c59a4a",
        darkColor: "#111111",
        lightColor: "#fff7e8",
        red: "#b92d2d",
        yellow: "#f0c84b",
        green: "#2f7d55",
        blue: "#2f86c7",
        showTricolorRibbon: true,
        showFieldLines: true,
        showTechLines: true,
        showWorldCupBadge: true,
    }),

    [THEMATIC_DECORATION_THEMES.MINIMAL_ELEGANT]: Object.freeze({
        accentColor: "#c59a4a",
        darkColor: "#2b2118",
        lightColor: "#fffaf0",
        red: "#7a1e1e",
        yellow: "#c59a4a",
        green: "#2f7d55",
        blue: "#2f86c7",
        showTricolorRibbon: false,
        showFieldLines: false,
        showTechLines: false,
        showWorldCupBadge: false,
        showConfetti: false,
        showStars: false,
    }),
});

const DENSITY_PRESETS = Object.freeze({
    [THEMATIC_DECORATION_DENSITY.LOW]: Object.freeze({
        confettiCount: 28,
        starCount: 12,
        pixelCount: 28,
        floatingNodeCount: 5,
    }),

    [THEMATIC_DECORATION_DENSITY.MEDIUM]: Object.freeze({
        confettiCount: 56,
        starCount: 24,
        pixelCount: 44,
        floatingNodeCount: 7,
    }),

    [THEMATIC_DECORATION_DENSITY.HIGH]: Object.freeze({
        confettiCount: 86,
        starCount: 42,
        pixelCount: 68,
        floatingNodeCount: 9,
    }),

    [THEMATIC_DECORATION_DENSITY.SHOWCASE]: Object.freeze({
        confettiCount: 128,
        starCount: 64,
        pixelCount: 96,
        floatingNodeCount: 12,
    }),
});

function normalizeOptions(config = {}, extraOptions = {}) {
    const source =
        config.thematicDecorations ??
        config.decorations ??
        config.themeConfig ??
        config;

    const visual = config.visual ?? config.sceneConfig?.visual ?? {};
    const project = config.project ?? config.content?.project ?? {};
    const text = config.text ?? config.content?.text ?? {};

    const theme =
        source.theme ??
        visual.theme ??
        DEFAULT_DECORATION_OPTIONS.theme;

    const density =
        source.density ??
        visual.decorationDensity ??
        DEFAULT_DECORATION_OPTIONS.density;

    const themePreset =
        THEME_PRESETS[theme] ??
        THEME_PRESETS[THEMATIC_DECORATION_THEMES.KICKOFF_2026];

    const densityPreset =
        DENSITY_PRESETS[density] ??
        DENSITY_PRESETS[THEMATIC_DECORATION_DENSITY.HIGH];

    return {
        ...DEFAULT_DECORATION_OPTIONS,
        ...themePreset,
        ...densityPreset,
        ...source,
        ...extraOptions,

        theme,
        density,

        frontText:
            text.frontText ??
            source.frontText ??
            DEFAULT_DECORATION_OPTIONS.frontText,

        lidText:
            text.lidText ??
            source.lidText ??
            DEFAULT_DECORATION_OPTIONS.lidText,

        lidSubtitle:
            text.lidSubtitle ??
            source.lidSubtitle ??
            project.projectName ??
            DEFAULT_DECORATION_OPTIONS.lidSubtitle,

        academicText:
            source.academicText ??
            project.career ??
            DEFAULT_DECORATION_OPTIONS.academicText,

        universityText:
            source.universityText ??
            project.university ??
            DEFAULT_DECORATION_OPTIONS.universityText,

        accentColor:
            visual.accentColor ??
            source.accentColor ??
            themePreset.accentColor,
    };
}

function createSeededRandom(seed = 2026) {
    let value = Number(seed) || 2026;

    return function random() {
        value = (value * 1664525 + 1013904223) % 4294967296;
        return value / 4294967296;
    };
}

function randomRange(random, min, max) {
    return min + random() * (max - min);
}

function pickRandom(random, values) {
    return values[Math.floor(random() * values.length) % values.length];
}

function createBasicMaterial({
    name,
    color,
    transparent = false,
    opacity = 1,
    side = THREE.DoubleSide,
    blending = THREE.NormalBlending,
    depthWrite = true,
}) {
    const material = new THREE.MeshBasicMaterial({
        name,
        color,
        transparent,
        opacity,
        side,
        blending,
        depthWrite,
    });

    material.needsUpdate = true;
    return material;
}

function createStandardMaterial({
    name,
    color,
    roughness = 0.58,
    metalness = 0.04,
    transparent = false,
    opacity = 1,
    side = THREE.FrontSide,
}) {
    const material = new THREE.MeshStandardMaterial({
        name,
        color,
        roughness,
        metalness,
        transparent,
        opacity,
        side,
    });

    material.needsUpdate = true;
    return material;
}

function getMaterial(materials, key, fallbackFactory) {
    if (materials?.[key]) return materials[key];
    return fallbackFactory();
}

function createMaterialSet(materials = {}, options = {}) {
    return {
        gold: getMaterial(materials, "gold", () => createStandardMaterial({
            name: "ThematicGoldMaterial",
            color: options.accentColor,
            roughness: 0.32,
            metalness: 0.36,
        })),

        dark: getMaterial(materials, "darkCardboard", () => createStandardMaterial({
            name: "ThematicDarkMaterial",
            color: options.darkColor,
            roughness: 0.74,
            metalness: 0.04,
        })),

        light: getMaterial(materials, "boxInterior", () => createStandardMaterial({
            name: "ThematicLightMaterial",
            color: options.lightColor,
            roughness: 0.78,
            metalness: 0.02,
        })),

        boliviaRed: getMaterial(materials, "boliviaRed", () => createStandardMaterial({
            name: "BoliviaRedMaterial",
            color: options.red,
            roughness: 0.52,
            metalness: 0.05,
        })),

        boliviaYellow: getMaterial(materials, "boliviaYellow", () => createStandardMaterial({
            name: "BoliviaYellowMaterial",
            color: options.yellow,
            roughness: 0.48,
            metalness: 0.08,
        })),

        boliviaGreen: getMaterial(materials, "boliviaGreen", () => createStandardMaterial({
            name: "BoliviaGreenMaterial",
            color: options.green,
            roughness: 0.54,
            metalness: 0.04,
        })),

        transparentGold: createBasicMaterial({
            name: "ThematicTransparentGoldMaterial",
            color: options.accentColor,
            transparent: true,
            opacity: 0.72,
            depthWrite: false,
        }),

        transparentWhite: createBasicMaterial({
            name: "ThematicTransparentWhiteMaterial",
            color: "#ffffff",
            transparent: true,
            opacity: 0.32,
            depthWrite: false,
        }),
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
        generatedBy: "ThematicDecorations",
        version: THEMATIC_DECORATIONS_VERSION,
        ...userData,
    };

    setMeshShadow(mesh, true, true);

    return mesh;
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

function drawRoundedRect(ctx, x, y, width, height, radius) {
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
        const next = line ? `${line} ${word}` : word;

        if (ctx.measureText(next).width > maxWidth && line) {
            lines.push(line);
            line = word;
        } else {
            line = next;
        }
    });

    if (line) lines.push(line);

    const visibleLines = lines.slice(0, maxLines);
    const startY = y - ((visibleLines.length - 1) * lineHeight) / 2;

    visibleLines.forEach((currentLine, index) => {
        const finalText =
            index === maxLines - 1 && lines.length > maxLines
                ? `${currentLine.replace(/\.*$/, "")}...`
                : currentLine;

        ctx.fillText(finalText, x, startY + index * lineHeight);
    });
}

function drawFootballField(ctx, width, height, options) {
    ctx.save();

    ctx.strokeStyle = hexToRgba(options.darkColor, 0.14);
    ctx.lineWidth = 8;

    ctx.strokeRect(90, 120, width - 180, height - 240);

    ctx.beginPath();
    ctx.moveTo(width / 2, 120);
    ctx.lineTo(width / 2, height - 120);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 120, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeRect(90, height / 2 - 145, 190, 290);
    ctx.strokeRect(width - 280, height / 2 - 145, 190, 290);

    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 14, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(options.accentColor, 0.44);
    ctx.fill();

    ctx.restore();
}

function drawCircuitLines(ctx, width, height, options, opacity = 0.22) {
    ctx.save();

    ctx.strokeStyle = hexToRgba(options.darkColor, opacity);
    ctx.fillStyle = hexToRgba(options.accentColor, 0.76);
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const paths = [
        [[140, 230], [260, 230], [315, 285], [410, 285]],
        [[width - 140, 230], [width - 270, 230], [width - 330, 295], [width - 430, 295]],
        [[160, height - 230], [280, height - 230], [335, height - 295], [430, height - 295]],
        [[width - 160, height - 230], [width - 280, height - 230], [width - 345, height - 305], [width - 450, height - 305]],
        [[width / 2 - 300, 190], [width / 2 - 170, 190], [width / 2 - 115, 245]],
        [[width / 2 + 300, 190], [width / 2 + 170, 190], [width / 2 + 115, 245]],
        [[width / 2 - 290, height - 150], [width / 2 - 170, height - 150], [width / 2 - 120, height - 210]],
        [[width / 2 + 290, height - 150], [width / 2 + 170, height - 150], [width / 2 + 120, height - 210]],
    ];

    paths.forEach((path) => {
        ctx.beginPath();
        ctx.moveTo(path[0][0], path[0][1]);

        for (let index = 1; index < path.length; index += 1) {
            ctx.lineTo(path[index][0], path[index][1]);
        }

        ctx.stroke();

        const last = path[path.length - 1];
        ctx.beginPath();
        ctx.arc(last[0], last[1], 15, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.restore();
}

function drawTricolorHeader(ctx, width, options) {
    const height = 46;

    ctx.fillStyle = options.red;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = options.yellow;
    ctx.fillRect(0, height, width, height);

    ctx.fillStyle = options.green;
    ctx.fillRect(0, height * 2, width, height);
}

function drawPremiumFrame(ctx, width, height, options) {
    ctx.save();

    ctx.strokeStyle = hexToRgba(options.darkColor, 0.34);
    ctx.lineWidth = 18;
    drawRoundedRect(ctx, 80, 178, width - 160, height - 250, 52);
    ctx.stroke();

    ctx.strokeStyle = options.accentColor;
    ctx.lineWidth = 8;
    drawRoundedRect(ctx, 120, 218, width - 240, height - 330, 38);
    ctx.stroke();

    ctx.strokeStyle = hexToRgba("#ffffff", 0.48);
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, 148, 246, width - 296, height - 386, 28);
    ctx.stroke();

    ctx.restore();
}

function drawPaperNoise(ctx, width, height, dark = false) {
    ctx.save();

    for (let index = 0; index < 750; index += 1) {
        const alpha = Math.random() * 0.026;
        ctx.fillStyle = dark
            ? `rgba(255,247,232,${alpha})`
            : `rgba(80,55,30,${alpha})`;

        ctx.fillRect(
            Math.random() * width,
            Math.random() * height,
            Math.random() * 2 + 0.3,
            Math.random() * 2 + 0.3,
        );
    }

    ctx.restore();
}

function createPlateTexture({
    title,
    subtitle,
    footer,
    width = 1600,
    height = 900,
    options,
}) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, width, height);

    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "#fffaf2");
    bg.addColorStop(0.55, options.lightColor);
    bg.addColorStop(1, "#e7c18d");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const identity = ctx.createLinearGradient(0, 0, width, 0);
    identity.addColorStop(0, hexToRgba(options.red, 0.15));
    identity.addColorStop(0.5, hexToRgba(options.yellow, 0.22));
    identity.addColorStop(1, hexToRgba(options.green, 0.15));

    ctx.fillStyle = identity;
    ctx.fillRect(0, 0, width, height);

    if (options.showFieldLines) {
        drawFootballField(ctx, width, height, options);
    }

    if (options.showTechLines) {
        drawCircuitLines(ctx, width, height, options, 0.18);
    }

    if (options.showTricolorRibbon) {
        drawTricolorHeader(ctx, width, options);
    }

    drawPremiumFrame(ctx, width, height, options);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = options.red;
    ctx.font = "900 108px Arial, Helvetica, sans-serif";
    drawMultilineText(ctx, title, width / 2, height / 2 - 44, width - 360, 112, 2);

    ctx.fillStyle = options.darkColor;
    ctx.font = "800 44px Arial, Helvetica, sans-serif";
    drawMultilineText(ctx, subtitle, width / 2, height / 2 + 86, width - 420, 54, 2);

    ctx.fillStyle = hexToRgba(options.darkColor, 0.66);
    ctx.font = "700 30px Arial, Helvetica, sans-serif";
    drawMultilineText(ctx, footer, width / 2, height - 88, width - 520, 36, 1);

    drawPaperNoise(ctx, width, height, false);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    texture.userData = {
        generatedBy: "ThematicDecorations",
        textureType: "plate",
        title,
        subtitle,
        createdAt: new Date().toISOString(),
    };

    return texture;
}

function createWorldCupBadgeTexture(options) {
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 900;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bg = ctx.createRadialGradient(450, 450, 80, 450, 450, 430);
    bg.addColorStop(0, "#fff8e8");
    bg.addColorStop(0.45, options.yellow);
    bg.addColorStop(1, "#b96f20");

    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(450, 450, 410, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = hexToRgba(options.darkColor, 0.42);
    ctx.lineWidth = 22;
    ctx.beginPath();
    ctx.arc(450, 450, 390, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,255,255,0.78)";
    ctx.lineWidth = 18;

    for (let index = 0; index < 7; index += 1) {
        const angle = (index / 7) * Math.PI * 2;

        ctx.beginPath();
        ctx.moveTo(450, 450);
        ctx.lineTo(450 + Math.cos(angle) * 360, 450 + Math.sin(angle) * 360);
        ctx.stroke();
    }

    ctx.strokeStyle = hexToRgba(options.darkColor, 0.22);
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(450, 450, 210, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = options.red;
    ctx.font = "900 180px Arial, Helvetica, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(options.badgeText, 450, 400);

    ctx.fillStyle = options.darkColor;
    ctx.font = "900 56px Arial, Helvetica, sans-serif";
    ctx.fillText("KICKOFF BOX", 450, 565);

    ctx.fillStyle = hexToRgba(options.darkColor, 0.72);
    ctx.font = "800 34px Arial, Helvetica, sans-serif";
    ctx.fillText("BOLIVIA · SISTEMAS", 450, 640);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    texture.userData = {
        generatedBy: "ThematicDecorations",
        textureType: "world-cup-badge",
    };

    return texture;
}

function createAcademicSealTexture(options) {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 1000;

    const ctx = canvas.getContext("2d");

    const gradient = ctx.createRadialGradient(500, 420, 90, 500, 500, 460);
    gradient.addColorStop(0, options.lightColor);
    gradient.addColorStop(0.5, "#fffdf7");
    gradient.addColorStop(1, "#d9b87b");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(500, 500, 420, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = options.accentColor;
    ctx.lineWidth = 28;
    ctx.stroke();

    ctx.strokeStyle = hexToRgba(options.darkColor, 0.45);
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(500, 500, 330, 0, Math.PI * 2);
    ctx.stroke();

    drawCircuitLines(ctx, 1000, 1000, options, 0.14);

    ctx.fillStyle = options.darkColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "900 76px Arial, Helvetica, sans-serif";
    drawMultilineText(ctx, options.academicText, 500, 420, 620, 82, 2);

    ctx.fillStyle = options.accentColor;
    ctx.font = "900 54px Arial, Helvetica, sans-serif";
    ctx.fillText(options.universityText, 500, 575);

    ctx.fillStyle = options.red;
    ctx.font = "900 48px Arial, Helvetica, sans-serif";
    ctx.fillText("2026", 500, 660);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    return texture;
}

function createFrontPlate(config, materials, options) {
    const box = getBoxDimensions(config);
    const texture = createPlateTexture({
        title: options.frontText,
        subtitle: options.frontSubtitle,
        footer: options.footerText,
        width: 1700,
        height: 720,
        options,
    });

    const material = new THREE.MeshBasicMaterial({
        name: "FrontThematicPlateMaterial",
        map: texture,
        transparent: true,
        opacity: options.opacity,
        side: THREE.DoubleSide,
    });

    const plate = new THREE.Mesh(
        new THREE.PlaneGeometry(options.frontPlateWidth, options.frontPlateHeight, 4, 2),
        material,
    );

    plate.name = "FrontThematicPlate";
    plate.position.set(0, box.floorHeight + box.height * 0.52, box.depth / 2 + 0.085);
    plate.renderOrder = options.renderOrder;
    plate.userData = {
        type: "front-plate",
        editable: true,
        generatedBy: "ThematicDecorations",
    };

    return plate;
}

function createLidPlate(config, materials, options) {
    const box = getBoxDimensions(config);
    const texture = createPlateTexture({
        title: options.lidText,
        subtitle: options.lidSubtitle,
        footer: `${options.academicText} · ${options.universityText}`,
        width: 1700,
        height: 940,
        options,
    });

    const material = new THREE.MeshBasicMaterial({
        name: "LidThematicPlateMaterial",
        map: texture,
        transparent: true,
        opacity: options.opacity,
        side: THREE.DoubleSide,
    });

    const plate = new THREE.Mesh(
        new THREE.PlaneGeometry(options.lidPlateWidth, options.lidPlateHeight, 4, 2),
        material,
    );

    plate.name = "LidThematicPlate";
    plate.rotation.x = -Math.PI / 2;
    plate.position.set(0, box.floorHeight + box.height + 0.36, -0.02);
    plate.renderOrder = options.renderOrder + 1;
    plate.userData = {
        type: "lid-plate",
        editable: true,
        generatedBy: "ThematicDecorations",
    };

    return plate;
}

function createWorldCupBadge(config, materials, options) {
    const localMaterials = createMaterialSet(materials, options);

    const badgeMaterial = new THREE.MeshBasicMaterial({
        name: "WorldCupBadgeMaterial",
        map: createWorldCupBadgeTexture(options),
        transparent: true,
        side: THREE.DoubleSide,
    });

    const badge = new THREE.Mesh(
        new THREE.CircleGeometry(0.42, 72),
        badgeMaterial,
    );

    badge.name = "WorldCup2026Badge";
    badge.rotation.x = -Math.PI / 2;
    badge.position.set(-1.36, 1.02, -0.78);
    badge.renderOrder = options.renderOrder + 1;

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.43, 0.018, 12, 72),
        localMaterials.gold,
    );

    ring.name = "WorldCupBadgeRing";
    ring.rotation.x = Math.PI / 2;
    ring.position.copy(badge.position);
    ring.position.y += 0.006;

    const base = createRoundedMesh({
        name: "WorldCupBadgeBase",
        width: 0.96,
        height: 0.032,
        depth: 0.96,
        radius: 0.08,
        segments: 4,
        material: localMaterials.dark,
        position: [badge.position.x, badge.position.y - 0.014, badge.position.z],
        rotation: [0, 0, 0],
    });

    const group = new THREE.Group();
    group.name = "WorldCupBadgeGroup";
    group.add(base, badge, ring);

    setGroupShadow(group, true, true);

    return group;
}

function createAcademicSeal(config, materials, options) {
    const localMaterials = createMaterialSet(materials, options);

    const sealMaterial = new THREE.MeshBasicMaterial({
        name: "AcademicSealTextureMaterial",
        map: createAcademicSealTexture(options),
        transparent: true,
        side: THREE.DoubleSide,
    });

    const seal = new THREE.Mesh(
        new THREE.CircleGeometry(0.35, 72),
        sealMaterial,
    );

    seal.name = "AcademicSealFace";
    seal.rotation.x = -Math.PI / 2;
    seal.position.set(1.32, 1.02, -0.78);
    seal.renderOrder = options.renderOrder + 1;

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.36, 0.016, 12, 72),
        localMaterials.gold,
    );

    ring.name = "AcademicSealRing";
    ring.rotation.x = Math.PI / 2;
    ring.position.copy(seal.position);
    ring.position.y += 0.006;

    const group = new THREE.Group();
    group.name = "AcademicSealGroup";
    group.add(seal, ring);

    setGroupShadow(group, true, true);

    return group;
}

function createTricolorRibbon(config, materials, options) {
    const box = getBoxDimensions(config);
    const localMaterials = createMaterialSet(materials, options);
    const group = new THREE.Group();
    group.name = "ThematicTricolorRibbon";

    const ribbonMaterials = [
        localMaterials.boliviaRed,
        localMaterials.boliviaYellow,
        localMaterials.boliviaGreen,
    ];

    const baseY = box.floorHeight + box.height + 0.11;
    const z = box.depth / 2 + 0.122;

    ribbonMaterials.forEach((material, index) => {
        const strip = createRoundedMesh({
            name: `TricolorRibbonStrip_${index + 1}`,
            width: box.width * 0.78,
            height: 0.035,
            depth: 0.055,
            radius: 0.012,
            segments: 3,
            material,
            position: [0, baseY + index * 0.055, z],
            userData: {
                type: "tricolor-ribbon",
                order: index,
            },
        });

        group.add(strip);
    });

    return group;
}

function createTechLines(config, materials, options) {
    const localMaterials = createMaterialSet(materials, options);
    const group = new THREE.Group();
    group.name = "ThematicTechLines";

    const lineMaterial = createBasicMaterial({
        name: "TechCircuitTubeMaterial",
        color: options.accentColor,
        transparent: true,
        opacity: 0.72,
        side: THREE.DoubleSide,
    });

    const secondaryMaterial = createBasicMaterial({
        name: "TechCircuitSecondaryTubeMaterial",
        color: options.blue,
        transparent: true,
        opacity: 0.46,
        side: THREE.DoubleSide,
    });

    const curves = [
        [[-1.34, 0.74, -0.93], [-0.98, 0.91, -0.78], [-0.52, 0.78, -0.56], [-0.16, 0.92, -0.37]],
        [[1.34, 0.74, -0.93], [0.98, 0.91, -0.78], [0.52, 0.78, -0.56], [0.16, 0.92, -0.37]],
        [[-1.28, 0.72, 0.82], [-0.92, 0.88, 0.62], [-0.46, 0.78, 0.42], [-0.12, 0.95, 0.26]],
        [[1.28, 0.72, 0.82], [0.92, 0.88, 0.62], [0.46, 0.78, 0.42], [0.12, 0.95, 0.26]],
        [[-0.92, 1.02, -0.98], [-0.42, 1.22, -1.12], [0.0, 1.12, -1.0], [0.42, 1.22, -1.12], [0.92, 1.02, -0.98]],
    ];

    curves.forEach((points, index) => {
        const curve = new THREE.CatmullRomCurve3(
            points.map((point) => new THREE.Vector3(point[0], point[1], point[2])),
            false,
            "centripetal",
            0.45,
        );

        const line = new THREE.Mesh(
            new THREE.TubeGeometry(curve, 32, index === 4 ? 0.008 : 0.01, 8, false),
            index === 4 ? secondaryMaterial : lineMaterial,
        );

        line.name = `TechCircuitLine_${index + 1}`;
        line.userData.type = "tech-circuit-line";
        setMeshShadow(line, false, false);
        group.add(line);

        const end = points[points.length - 1];

        const node = new THREE.Mesh(
            new THREE.SphereGeometry(0.045, 16, 8),
            localMaterials.gold,
        );

        node.name = `TechCircuitNode_${index + 1}`;
        node.position.set(end[0], end[1], end[2]);
        node.userData.type = "tech-circuit-node";
        setMeshShadow(node, true, true);
        group.add(node);
    });

    return group;
}

function createPixelArc(options) {
    const group = new THREE.Group();
    group.name = "ThematicPixelArc";

    const count = Math.max(0, Number(options.pixelCount) || 0);
    const geometry = new THREE.BoxGeometry(0.054, 0.014, 0.054);
    const material = createStandardMaterial({
        name: "PixelArcMaterial",
        color: options.accentColor,
        roughness: 0.42,
        metalness: 0.12,
        transparent: true,
        opacity: 0.9,
    });

    const instanced = new THREE.InstancedMesh(geometry, material, count);
    instanced.name = "PixelArcInstances";

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    const palette = [options.red, options.yellow, options.green, options.accentColor, options.blue];

    for (let index = 0; index < count; index += 1) {
        const t = index / Math.max(count - 1, 1);
        const angle = Math.PI * (0.08 + t * 0.84);
        const radius = 1.38 + Math.sin(t * Math.PI) * 0.28;

        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius - 0.84;
        const y = 1.18 + Math.sin(t * Math.PI) * 0.28;

        dummy.position.set(x, y, z);
        dummy.rotation.set(
            Math.sin(index * 0.6) * 0.45,
            angle,
            Math.cos(index * 0.3) * 0.45,
        );
        dummy.scale.setScalar(0.72 + Math.sin(index * 1.7) * 0.22);
        dummy.updateMatrix();

        instanced.setMatrixAt(index, dummy.matrix);
        color.set(pickRandom(createSeededRandom(index + 7), palette));
        instanced.setColorAt(index, color);
    }

    instanced.instanceMatrix.needsUpdate = true;

    if (instanced.instanceColor) {
        instanced.instanceColor.needsUpdate = true;
    }

    instanced.userData = {
        type: "pixel-arc",
        count,
    };

    group.add(instanced);

    return group;
}

function createFieldLineOverlay(config, options) {
    const box = getBoxDimensions(config);
    const group = new THREE.Group();
    group.name = "FootballFieldLineOverlay";

    const material = createBasicMaterial({
        name: "FieldLineMaterial",
        color: "#ffffff",
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
    });

    const centerLine = new THREE.Mesh(
        new THREE.BoxGeometry(0.032, 0.01, box.depth * 0.72),
        material,
    );

    centerLine.name = "FieldCenterLine";
    centerLine.position.set(0, box.floorHeight + 0.035, 0);

    const centerCircle = new THREE.Mesh(
        new THREE.TorusGeometry(0.52, 0.011, 8, 72),
        material,
    );

    centerCircle.name = "FieldCenterCircle";
    centerCircle.rotation.x = Math.PI / 2;
    centerCircle.position.set(0, box.floorHeight + 0.04, 0);

    const leftArea = new THREE.Mesh(
        new THREE.BoxGeometry(0.72, 0.01, 0.032),
        material,
    );

    leftArea.name = "FieldLeftMark";
    leftArea.position.set(-box.width * 0.31, box.floorHeight + 0.038, 0);

    const rightArea = leftArea.clone();
    rightArea.name = "FieldRightMark";
    rightArea.position.x = box.width * 0.31;

    group.add(centerLine, centerCircle, leftArea, rightArea);

    return group;
}

function createFloatingNodes(materials, options) {
    const group = new THREE.Group();
    group.name = "ThematicFloatingNodes";

    const count = Math.max(3, Number(options.floatingNodeCount) || 7);

    const nodeMaterial = createBasicMaterial({
        name: "FloatingNodeMaterial",
        color: options.accentColor,
        transparent: true,
        opacity: 0.82,
        depthWrite: false,
    });

    const lineMaterial = createBasicMaterial({
        name: "FloatingNodeLineMaterial",
        color: "#ffffff",
        transparent: true,
        opacity: 0.32,
        depthWrite: false,
    });

    const nodes = [];
    const startX = -1.32;
    const endX = 1.32;

    for (let index = 0; index < count; index += 1) {
        const t = index / Math.max(count - 1, 1);
        const x = startX + (endX - startX) * t;
        const y = 1.62 + Math.sin(t * Math.PI * 2) * 0.16;
        const z = -0.72 - Math.sin(t * Math.PI) * 0.24;

        nodes.push([x, y, z]);
    }

    nodes.forEach((position, index) => {
        const node = new THREE.Mesh(
            new THREE.SphereGeometry(0.038, 16, 8),
            nodeMaterial,
        );

        node.name = `FloatingNode_${index + 1}`;
        node.position.set(position[0], position[1], position[2]);
        group.add(node);
    });

    for (let index = 0; index < nodes.length - 1; index += 1) {
        const start = new THREE.Vector3(...nodes[index]);
        const end = new THREE.Vector3(...nodes[index + 1]);
        const curve = new THREE.CatmullRomCurve3([start, end]);

        const line = new THREE.Mesh(
            new THREE.TubeGeometry(curve, 2, 0.005, 6, false),
            lineMaterial,
        );

        line.name = `FloatingNodeLine_${index + 1}`;
        group.add(line);
    }

    return group;
}

function createConfetti(options) {
    const group = new THREE.Group();
    group.name = "ThematicConfetti";

    const count = Math.max(0, Number(options.confettiCount) || 0);
    const geometry = new THREE.PlaneGeometry(0.05, 0.018);
    const material = new THREE.MeshBasicMaterial({
        name: "ThematicConfettiMaterial",
        color: "#ffffff",
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
        depthWrite: false,
    });

    const instanced = new THREE.InstancedMesh(geometry, material, count);
    instanced.name = "ThematicConfettiInstances";

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    const random = createSeededRandom(202605);
    const palette = [options.red, options.yellow, options.green, options.accentColor, options.lightColor];

    for (let index = 0; index < count; index += 1) {
        const side = index % 2 === 0 ? -1 : 1;
        const x = randomRange(random, -1.36, 1.36);
        const y = randomRange(random, 0.74, 1.46);
        const z = side * randomRange(random, 0.48, 0.92);

        dummy.position.set(x, y, z);
        dummy.rotation.set(
            randomRange(random, -Math.PI, Math.PI),
            randomRange(random, -Math.PI, Math.PI),
            randomRange(random, -Math.PI, Math.PI),
        );
        dummy.scale.set(
            randomRange(random, 0.62, 1.35),
            randomRange(random, 0.62, 1.18),
            1,
        );
        dummy.updateMatrix();

        instanced.setMatrixAt(index, dummy.matrix);
        color.set(pickRandom(random, palette));
        instanced.setColorAt(index, color);
    }

    instanced.instanceMatrix.needsUpdate = true;

    if (instanced.instanceColor) {
        instanced.instanceColor.needsUpdate = true;
    }

    group.add(instanced);

    return group;
}

function createStars(options) {
    const group = new THREE.Group();
    group.name = "ThematicStars";

    const count = Math.max(0, Number(options.starCount) || 0);
    const geometry = new THREE.OctahedronGeometry(0.035, 0);
    const material = createStandardMaterial({
        name: "ThematicStarMaterial",
        color: options.accentColor,
        roughness: 0.36,
        metalness: 0.32,
        transparent: true,
        opacity: 0.9,
    });

    const instanced = new THREE.InstancedMesh(geometry, material, count);
    instanced.name = "ThematicStarInstances";

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    const random = createSeededRandom(2031);
    const palette = [options.accentColor, options.yellow, "#ffffff"];

    for (let index = 0; index < count; index += 1) {
        const angle = randomRange(random, 0, Math.PI * 2);
        const radius = randomRange(random, 1.15, 1.85);

        dummy.position.set(
            Math.cos(angle) * radius,
            randomRange(random, 1.05, 1.78),
            Math.sin(angle) * radius * 0.72,
        );

        dummy.rotation.set(
            randomRange(random, -Math.PI, Math.PI),
            randomRange(random, -Math.PI, Math.PI),
            randomRange(random, -Math.PI, Math.PI),
        );

        dummy.scale.setScalar(randomRange(random, 0.55, 1.2));
        dummy.updateMatrix();

        instanced.setMatrixAt(index, dummy.matrix);
        color.set(pickRandom(random, palette));
        instanced.setColorAt(index, color);
    }

    instanced.instanceMatrix.needsUpdate = true;

    if (instanced.instanceColor) {
        instanced.instanceColor.needsUpdate = true;
    }

    group.add(instanced);

    return group;
}

function createGoldenThreads(options) {
    const group = new THREE.Group();
    group.name = "ThematicGoldenThreads";

    const material = createBasicMaterial({
        name: "GoldenThreadMaterial",
        color: options.accentColor,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
    });

    const curves = [
        [[-1.34, 0.62, -0.64], [-0.72, 0.72, -0.24], [0, 0.67, 0], [0.72, 0.72, -0.24], [1.34, 0.62, -0.64]],
        [[-1.28, 0.6, 0.62], [-0.68, 0.75, 0.28], [0, 0.7, 0.12], [0.68, 0.75, 0.28], [1.28, 0.6, 0.62]],
    ];

    curves.forEach((points, index) => {
        const curve = new THREE.CatmullRomCurve3(
            points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
            false,
            "centripetal",
            0.5,
        );

        const thread = new THREE.Mesh(
            new THREE.TubeGeometry(curve, 42, 0.0045, 6, false),
            material,
        );

        thread.name = `GoldenThread_${index + 1}`;
        group.add(thread);
    });

    return group;
}

function createCornerAccents(config, materials, options) {
    const box = getBoxDimensions(config);
    const localMaterials = createMaterialSet(materials, options);
    const group = new THREE.Group();
    group.name = "ThematicCornerAccents";

    const y = box.floorHeight + 0.08;
    const positions = [
        [-box.width * 0.42, y, -box.depth * 0.42],
        [box.width * 0.42, y, -box.depth * 0.42],
        [-box.width * 0.42, y, box.depth * 0.42],
        [box.width * 0.42, y, box.depth * 0.42],
    ];

    positions.forEach((position, index) => {
        const accent = createRoundedMesh({
            name: `ThematicCornerAccent_${index + 1}`,
            width: 0.16,
            height: 0.018,
            depth: 0.16,
            radius: 0.026,
            segments: 4,
            material: localMaterials.gold,
            position,
            userData: {
                type: "corner-accent",
            },
        });

        group.add(accent);
    });

    return group;
}

function createSideBadges(config, materials, options) {
    const box = getBoxDimensions(config);
    const localMaterials = createMaterialSet(materials, options);
    const group = new THREE.Group();
    group.name = "ThematicSideBadges";

    const badgeMaterial = createBasicMaterial({
        name: "SideBadgeTextMaterial",
        color: options.lightColor,
        transparent: true,
        opacity: 0.92,
    });

    const positions = [
        [-box.width / 2 - 0.035, box.floorHeight + box.height * 0.5, 0],
        [box.width / 2 + 0.035, box.floorHeight + box.height * 0.5, 0],
    ];

    positions.forEach((position, index) => {
        const base = createRoundedMesh({
            name: `ThematicSideBadgeBase_${index + 1}`,
            width: 0.03,
            height: 0.42,
            depth: 0.72,
            radius: 0.03,
            segments: 4,
            material: localMaterials.dark,
            position,
            userData: {
                type: "side-badge",
            },
        });

        base.rotation.z = Math.PI / 2;
        group.add(base);

        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.18, 0.012, 12, 48),
            localMaterials.gold,
        );

        ring.name = `ThematicSideBadgeRing_${index + 1}`;
        ring.rotation.y = Math.PI / 2;
        ring.position.set(position[0], position[1] + 0.01, position[2]);
        group.add(ring);
    });

    return group;
}

function createSubtleFloorPattern(config, options) {
    const box = getBoxDimensions(config);
    const group = new THREE.Group();
    group.name = "ThematicSubtleFloorPattern";

    const material = createBasicMaterial({
        name: "SubtleFloorPatternMaterial",
        color: "#ffffff",
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
    });

    const gridCount = 7;

    for (let index = 0; index < gridCount; index += 1) {
        const x = -box.width * 0.38 + (box.width * 0.76) * (index / (gridCount - 1));

        const line = new THREE.Mesh(
            new THREE.BoxGeometry(0.008, 0.004, box.depth * 0.72),
            material,
        );

        line.name = `FloorPatternVertical_${index + 1}`;
        line.position.set(x, box.floorHeight + 0.018, 0);
        group.add(line);
    }

    for (let index = 0; index < 5; index += 1) {
        const z = -box.depth * 0.36 + (box.depth * 0.72) * (index / 4);

        const line = new THREE.Mesh(
            new THREE.BoxGeometry(box.width * 0.76, 0.004, 0.008),
            material,
        );

        line.name = `FloorPatternHorizontal_${index + 1}`;
        line.position.set(0, box.floorHeight + 0.019, z);
        group.add(line);
    }

    return group;
}

function createDecorationDecal({
    targetMesh,
    texture,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    size = [1, 1, 1],
    name = "ThematicDecal",
}) {
    if (!targetMesh || !texture) return null;

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        side: THREE.DoubleSide,
    });

    const decal = new THREE.Mesh(
        new DecalGeometry(
            targetMesh,
            new THREE.Vector3(position[0], position[1], position[2]),
            new THREE.Euler(rotation[0], rotation[1], rotation[2]),
            new THREE.Vector3(size[0], size[1], size[2]),
        ),
        material,
    );

    decal.name = name;
    decal.renderOrder = 10;

    return decal;
}

function createMetadata(options) {
    return {
        objectType: "ThematicDecorations",
        version: THEMATIC_DECORATIONS_VERSION,
        theme: options.theme,
        density: options.density,
        placement: options.placement,
        editable: true,
        exportable: true,
        visibleInPresets: ["basica", "estandar", "premium", "showcase"],
        description: "Decoración temática KickOff Box: Mundial 2026, Bolivia, tecnología e identidad académica.",
        text: {
            frontText: options.frontText,
            lidText: options.lidText,
            lidSubtitle: options.lidSubtitle,
            academicText: options.academicText,
            universityText: options.universityText,
        },
        createdAt: new Date().toISOString(),
    };
}

export function createThematicDecorations(config = {}, materials = {}, options = {}) {
    const mergedOptions = normalizeOptions(config, options);
    const localMaterials = createMaterialSet(materials, mergedOptions);

    const group = new THREE.Group();
    group.name = "KickOffBoxThematicDecorations";
    group.userData = createMetadata(mergedOptions);
    group.userData.options = mergedOptions;

    if (mergedOptions.showSubtleFloorPattern) {
        group.add(createSubtleFloorPattern(config, mergedOptions));
    }

    if (mergedOptions.showFrontPlate) {
        group.add(createFrontPlate(config, localMaterials, mergedOptions));
    }

    if (mergedOptions.showLidPlate) {
        group.add(createLidPlate(config, localMaterials, mergedOptions));
    }

    if (mergedOptions.showWorldCupBadge) {
        group.add(createWorldCupBadge(config, localMaterials, mergedOptions));
    }

    if (mergedOptions.showAcademicSeal) {
        group.add(createAcademicSeal(config, localMaterials, mergedOptions));
    }

    if (mergedOptions.showSideBadges) {
        group.add(createSideBadges(config, localMaterials, mergedOptions));
    }

    if (mergedOptions.showTricolorRibbon) {
        group.add(createTricolorRibbon(config, localMaterials, mergedOptions));
    }

    if (mergedOptions.showTechLines) {
        group.add(createTechLines(config, localMaterials, mergedOptions));
    }

    if (mergedOptions.showPixelArc) {
        group.add(createPixelArc(mergedOptions));
    }

    if (mergedOptions.showFieldLines) {
        group.add(createFieldLineOverlay(config, mergedOptions));
    }

    if (mergedOptions.showFloatingNodes) {
        group.add(createFloatingNodes(localMaterials, mergedOptions));
    }

    if (mergedOptions.showConfetti) {
        group.add(createConfetti(mergedOptions));
    }

    if (mergedOptions.showStars) {
        group.add(createStars(mergedOptions));
    }

    if (mergedOptions.showGoldenThreads) {
        group.add(createGoldenThreads(mergedOptions));
    }

    if (mergedOptions.showCornerAccents) {
        group.add(createCornerAccents(config, localMaterials, mergedOptions));
    }

    group.userData.parts = {
        frontPlate: "FrontThematicPlate",
        lidPlate: "LidThematicPlate",
        worldCupBadge: "WorldCupBadgeGroup",
        academicSeal: "AcademicSealGroup",
        sideBadges: "ThematicSideBadges",
        tricolorRibbon: "ThematicTricolorRibbon",
        techLines: "ThematicTechLines",
        pixelArc: "ThematicPixelArc",
        fieldOverlay: "FootballFieldLineOverlay",
        floatingNodes: "ThematicFloatingNodes",
        confetti: "ThematicConfetti",
        stars: "ThematicStars",
        goldenThreads: "ThematicGoldenThreads",
        cornerAccents: "ThematicCornerAccents",
        floorPattern: "ThematicSubtleFloorPattern",
    };

    setGroupShadow(group, true, true);

    return group;
}

export function updateThematicDecorationText(decorationsGroup, nextOptions = {}) {
    if (!decorationsGroup) return null;

    const previousOptions = decorationsGroup.userData?.options ?? DEFAULT_DECORATION_OPTIONS;
    const options = normalizeOptions({
        ...previousOptions,
        ...nextOptions,
    });

    decorationsGroup.userData.options = options;
    decorationsGroup.userData.text = {
        frontText: options.frontText,
        lidText: options.lidText,
        lidSubtitle: options.lidSubtitle,
        academicText: options.academicText,
        universityText: options.universityText,
    };
    decorationsGroup.userData.updatedAt = new Date().toISOString();

    return decorationsGroup;
}

export function setThematicDecorationVisibility(decorationsGroup, visible = true) {
    if (!decorationsGroup) return;

    decorationsGroup.visible = Boolean(visible);
    decorationsGroup.userData.visible = Boolean(visible);
    decorationsGroup.userData.updatedAt = new Date().toISOString();
}

export function setThematicDecorationPartVisibility(
    decorationsGroup,
    partName,
    visible = true,
) {
    if (!decorationsGroup || !partName) return;

    const part = decorationsGroup.getObjectByName(partName);

    if (!part) return;

    part.visible = Boolean(visible);
    decorationsGroup.userData.updatedAt = new Date().toISOString();
}

export function setThematicDecorationTransform(
    decorationsGroup,
    {
        position,
        rotation,
        scale,
    } = {},
) {
    if (!decorationsGroup) return;

    const minScale = decorationsGroup.userData?.options?.minScale ?? 0.35;
    const maxScale = decorationsGroup.userData?.options?.maxScale ?? 1.7;

    const nextScale = scale
        ? [
            THREE.MathUtils.clamp(scale[0], minScale, maxScale),
            THREE.MathUtils.clamp(scale[1], minScale, maxScale),
            THREE.MathUtils.clamp(scale[2], minScale, maxScale),
        ]
        : decorationsGroup.scale.toArray();

    applyTransform(decorationsGroup, {
        position: position ?? decorationsGroup.position.toArray(),
        rotation: rotation ?? [
            decorationsGroup.rotation.x,
            decorationsGroup.rotation.y,
            decorationsGroup.rotation.z,
        ],
        scale: nextScale,
    });

    decorationsGroup.userData.updatedAt = new Date().toISOString();
}

export function animateThematicDecorations(decorationsGroup, elapsedTime = 0) {
    if (!decorationsGroup) return;

    const pixelArc = decorationsGroup.getObjectByName("ThematicPixelArc");
    const floatingNodes = decorationsGroup.getObjectByName("ThematicFloatingNodes");
    const badge = decorationsGroup.getObjectByName("WorldCupBadgeGroup");
    const seal = decorationsGroup.getObjectByName("AcademicSealGroup");
    const stars = decorationsGroup.getObjectByName("ThematicStarInstances");
    const confetti = decorationsGroup.getObjectByName("ThematicConfettiInstances");
    const threads = decorationsGroup.getObjectByName("ThematicGoldenThreads");

    if (pixelArc) {
        pixelArc.rotation.y = Math.sin(elapsedTime * 0.25) * 0.025;
    }

    if (floatingNodes) {
        floatingNodes.children.forEach((child, index) => {
            if (child.name.startsWith("FloatingNode_")) {
                child.position.y += Math.sin(elapsedTime * 1.1 + index) * 0.00075;
            }
        });
    }

    if (badge) {
        badge.rotation.y = Math.sin(elapsedTime * 0.42) * 0.035;
    }

    if (seal) {
        seal.rotation.y = Math.cos(elapsedTime * 0.36) * 0.026;
    }

    if (stars) {
        stars.rotation.y = Math.sin(elapsedTime * 0.18) * 0.018;
        stars.rotation.z = Math.cos(elapsedTime * 0.15) * 0.012;
    }

    if (confetti) {
        confetti.rotation.y = Math.sin(elapsedTime * 0.22) * 0.018;
    }

    if (threads) {
        threads.children.forEach((thread, index) => {
            if (thread.material) {
                thread.material.opacity = 0.32 + Math.sin(elapsedTime * 0.8 + index) * 0.055;
            }
        });
    }
}

export function getThematicDecorationParts(decorationsGroup) {
    if (!decorationsGroup) return {};

    return {
        frontPlate: decorationsGroup.getObjectByName("FrontThematicPlate"),
        lidPlate: decorationsGroup.getObjectByName("LidThematicPlate"),
        worldCupBadge: decorationsGroup.getObjectByName("WorldCupBadgeGroup"),
        academicSeal: decorationsGroup.getObjectByName("AcademicSealGroup"),
        sideBadges: decorationsGroup.getObjectByName("ThematicSideBadges"),
        tricolorRibbon: decorationsGroup.getObjectByName("ThematicTricolorRibbon"),
        techLines: decorationsGroup.getObjectByName("ThematicTechLines"),
        pixelArc: decorationsGroup.getObjectByName("ThematicPixelArc"),
        fieldOverlay: decorationsGroup.getObjectByName("FootballFieldLineOverlay"),
        floatingNodes: decorationsGroup.getObjectByName("ThematicFloatingNodes"),
        confetti: decorationsGroup.getObjectByName("ThematicConfetti"),
        stars: decorationsGroup.getObjectByName("ThematicStars"),
        goldenThreads: decorationsGroup.getObjectByName("ThematicGoldenThreads"),
        cornerAccents: decorationsGroup.getObjectByName("ThematicCornerAccents"),
        floorPattern: decorationsGroup.getObjectByName("ThematicSubtleFloorPattern"),
    };
}

export function createThematicDecalOnMesh({
    targetMesh,
    texture,
    position,
    rotation,
    size,
    name,
}) {
    return createDecorationDecal({
        targetMesh,
        texture,
        position,
        rotation,
        size,
        name,
    });
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

export function disposeThematicDecorations(decorationsGroup) {
    if (!decorationsGroup) return;

    const disposedGeometries = new Set();
    const disposedMaterials = new Set();

    decorationsGroup.traverse((object) => {
        if (object.geometry && !disposedGeometries.has(object.geometry)) {
            object.geometry.dispose();
            disposedGeometries.add(object.geometry);
        }

        if (object.material && !disposedMaterials.has(object.material)) {
            disposeMaterial(object.material);
            disposedMaterials.add(object.material);
        }
    });

    decorationsGroup.removeFromParent();
}

export const ThematicDecorations = Object.freeze({
    version: THEMATIC_DECORATIONS_VERSION,
    themes: THEMATIC_DECORATION_THEMES,
    density: THEMATIC_DECORATION_DENSITY,
    placement: THEMATIC_DECORATION_PLACEMENT,

    createThematicDecorations,
    updateThematicDecorationText,
    setThematicDecorationVisibility,
    setThematicDecorationPartVisibility,
    setThematicDecorationTransform,
    animateThematicDecorations,
    getThematicDecorationParts,
    createThematicDecalOnMesh,
    disposeThematicDecorations,
});
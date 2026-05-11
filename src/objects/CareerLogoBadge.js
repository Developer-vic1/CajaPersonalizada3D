import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import {
    applyTransform,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

export const CAREER_LOGO_BADGE_VERSION = "2.0.0";

export const LOGO_BADGE_VARIANTS = Object.freeze({
    LIGHT: "claro",
    DARK: "oscuro",
});

export const LOGO_BADGE_STYLES = Object.freeze({
    STICKER: "sticker",
    CIRCULAR: "circular",
    PLAQUE: "plaque",
    FRONT_LABEL: "front-label",
    WATERMARK: "watermark",
    MINIMAL: "minimal",
});

export const LOGO_BADGE_TARGETS = Object.freeze({
    LID: "lid",
    FRONT: "front",
    CARD: "card",
    KEYCHAIN: "keychain",
    INTERIOR: "interior",
    FREE: "free",
});

export const LOGO_BADGE_FINISHES = Object.freeze({
    MATTE: "matte",
    SATIN: "satin",
    GLOSSY: "glossy",
    FOIL: "foil",
});

const LOGO_PATHS = Object.freeze({
    [LOGO_BADGE_VARIANTS.LIGHT]: "/image/Logo-Claro.png",
    [LOGO_BADGE_VARIANTS.DARK]: "/image/Logo-Oscuro.png",
});

const DEFAULT_OPTIONS = Object.freeze({
    variant: LOGO_BADGE_VARIANTS.LIGHT,
    style: LOGO_BADGE_STYLES.STICKER,
    target: LOGO_BADGE_TARGETS.INTERIOR,
    finish: LOGO_BADGE_FINISHES.SATIN,

    title: "Ingeniería de Sistemas",
    subtitle: "KickOff Box",
    footer: "UNIFRANZ · 2026",

    width: 1.36,
    height: 0.82,
    depth: 0.04,

    logoWidth: 0.46,
    logoHeight: 0.46,
    logoScale: [1, 1, 1],
    badgeScale: [1, 1, 1],

    cornerRadius: 0.055,
    cornerSegments: 6,

    showBacking: true,
    showSurface: true,
    showLogo: true,
    showFrame: true,
    showTitle: true,
    showSubtitle: true,
    showFooter: true,
    showShadow: true,
    showTechMarks: true,
    showBoliviaRibbon: true,
    showGloss: true,
    showMountPads: true,

    backgroundColor: "#fff7e8",
    surfaceColor: "#fffdf8",
    frameColor: "#c59a4a",
    darkColor: "#2b2118",
    accentColor: "#c59a4a",
    secondaryAccent: "#b92d2d",
    greenAccent: "#2f7d55",

    opacity: 1,
    renderOrder: 10,

    minScale: 0.18,
    maxScale: 1.8,
});

const STYLE_PRESETS = Object.freeze({
    [LOGO_BADGE_STYLES.STICKER]: Object.freeze({
        width: 1.36,
        height: 0.82,
        depth: 0.032,
        cornerRadius: 0.055,
        showBacking: true,
        showFrame: true,
        showTitle: true,
        showSubtitle: true,
        showFooter: true,
        showGloss: true,
        logoWidth: 0.42,
        logoHeight: 0.42,
    }),

    [LOGO_BADGE_STYLES.CIRCULAR]: Object.freeze({
        width: 0.88,
        height: 0.88,
        depth: 0.05,
        cornerRadius: 0.44,
        showBacking: true,
        showFrame: true,
        showTitle: false,
        showSubtitle: false,
        showFooter: false,
        showGloss: true,
        logoWidth: 0.58,
        logoHeight: 0.58,
    }),

    [LOGO_BADGE_STYLES.PLAQUE]: Object.freeze({
        width: 1.46,
        height: 0.72,
        depth: 0.07,
        cornerRadius: 0.06,
        showBacking: true,
        showFrame: true,
        showTitle: true,
        showSubtitle: true,
        showFooter: false,
        showGloss: true,
        logoWidth: 0.34,
        logoHeight: 0.34,
    }),

    [LOGO_BADGE_STYLES.FRONT_LABEL]: Object.freeze({
        width: 1.72,
        height: 0.54,
        depth: 0.028,
        cornerRadius: 0.04,
        showBacking: true,
        showFrame: true,
        showTitle: true,
        showSubtitle: false,
        showFooter: true,
        showGloss: true,
        logoWidth: 0.28,
        logoHeight: 0.28,
    }),

    [LOGO_BADGE_STYLES.WATERMARK]: Object.freeze({
        width: 0.92,
        height: 0.92,
        depth: 0.012,
        cornerRadius: 0.46,
        showBacking: false,
        showFrame: false,
        showTitle: false,
        showSubtitle: false,
        showFooter: false,
        showGloss: false,
        opacity: 0.34,
        logoWidth: 0.76,
        logoHeight: 0.76,
    }),

    [LOGO_BADGE_STYLES.MINIMAL]: Object.freeze({
        width: 0.78,
        height: 0.78,
        depth: 0.012,
        cornerRadius: 0.04,
        showBacking: false,
        showFrame: false,
        showTitle: false,
        showSubtitle: false,
        showFooter: false,
        showGloss: false,
        logoWidth: 0.72,
        logoHeight: 0.72,
    }),
});

const TARGET_TRANSFORMS = Object.freeze({
    [LOGO_BADGE_TARGETS.LID]: Object.freeze({
        position: [0, 1.13, -0.58],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [0.88, 0.88, 0.88],
    }),

    [LOGO_BADGE_TARGETS.FRONT]: Object.freeze({
        position: [0, 0.58, 0.96],
        rotation: [0, 0, 0],
        scale: [0.78, 0.78, 0.78],
    }),

    [LOGO_BADGE_TARGETS.CARD]: Object.freeze({
        position: [-0.72, 0.38, -0.38],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [0.38, 0.38, 0.38],
    }),

    [LOGO_BADGE_TARGETS.KEYCHAIN]: Object.freeze({
        position: [0.78, 0.37, 0.33],
        rotation: [-Math.PI / 2, 0, -0.12],
        scale: [0.32, 0.32, 0.32],
    }),

    [LOGO_BADGE_TARGETS.INTERIOR]: Object.freeze({
        position: [0.24, 0.42, -0.54],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [0.72, 0.72, 0.72],
    }),

    [LOGO_BADGE_TARGETS.FREE]: Object.freeze({
        position: [0, 0.48, 0],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [0.72, 0.72, 0.72],
    }),
});

const textureLoader = new THREE.TextureLoader();
const textureCache = new Map();

function normalizeOptions(config = {}, extraOptions = {}) {
    const source = config.logoBadge ?? config.careerLogoBadge ?? config.logo ?? config;
    const visual = config.visual ?? config.sceneConfig?.visual ?? {};
    const project = config.project ?? config.content?.project ?? {};
    const product = config.product ?? config.sceneConfig?.product ?? {};

    const style =
        source.style ??
        visual.logoBadgeStyle ??
        LOGO_BADGE_STYLES.STICKER;

    const preset =
        STYLE_PRESETS[style] ??
        STYLE_PRESETS[LOGO_BADGE_STYLES.STICKER];

    const variant =
        source.variant ??
        product.logoVariant ??
        DEFAULT_OPTIONS.variant;

    return {
        ...DEFAULT_OPTIONS,
        ...preset,
        ...source,
        ...extraOptions,

        style,
        variant: variant === LOGO_BADGE_VARIANTS.DARK
            ? LOGO_BADGE_VARIANTS.DARK
            : LOGO_BADGE_VARIANTS.LIGHT,

        title:
            source.title ??
            project.career ??
            DEFAULT_OPTIONS.title,

        subtitle:
            source.subtitle ??
            project.projectName ??
            DEFAULT_OPTIONS.subtitle,

        footer:
            source.footer ??
            project.university ??
            DEFAULT_OPTIONS.footer,

        accentColor:
            visual.accentColor ??
            source.accentColor ??
            DEFAULT_OPTIONS.accentColor,

        frameColor:
            source.frameColor ??
            visual.frameColor ??
            visual.accentColor ??
            DEFAULT_OPTIONS.frameColor,

        backgroundColor:
            source.backgroundColor ??
            visual.logoBadgeBackground ??
            DEFAULT_OPTIONS.backgroundColor,
    };
}

function getLogoPath(variant = LOGO_BADGE_VARIANTS.LIGHT) {
    return LOGO_PATHS[variant] ?? LOGO_PATHS[LOGO_BADGE_VARIANTS.LIGHT];
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

function createFallbackLogoTexture(options = {}) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;

    const ctx = canvas.getContext("2d");
    const isDark = options.variant === LOGO_BADGE_VARIANTS.DARK;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createRadialGradient(512, 420, 80, 512, 512, 430);
    gradient.addColorStop(0, isDark ? "#2b2118" : "#fffdf8");
    gradient.addColorStop(1, isDark ? "#111111" : "#fff7e8");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(512, 512, 395, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = options.accentColor ?? "#c59a4a";
    ctx.lineWidth = 28;
    ctx.stroke();

    drawTechNodes(ctx, 1024, 1024, {
        ...options,
        opacity: 0.18,
    });

    ctx.fillStyle = isDark ? "#fff7e8" : "#2b2118";
    ctx.font = "900 178px Arial, Helvetica, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SIS", 512, 440);

    ctx.fillStyle = options.accentColor ?? "#c59a4a";
    ctx.font = "900 58px Arial, Helvetica, sans-serif";
    ctx.fillText("UNIFRANZ", 512, 570);

    ctx.fillStyle = isDark ? "#fff7e8" : "#2b2118";
    ctx.font = "800 42px Arial, Helvetica, sans-serif";
    ctx.fillText("2026", 512, 645);

    const texture = new THREE.CanvasTexture(canvas);
    setTextureQuality(texture);

    texture.userData = {
        generatedBy: "CareerLogoBadgeFallbackLogo",
        variant: options.variant,
        createdAt: new Date().toISOString(),
    };

    return texture;
}

function loadLogoTexture(options = {}) {
    const variant = options.variant === LOGO_BADGE_VARIANTS.DARK
        ? LOGO_BADGE_VARIANTS.DARK
        : LOGO_BADGE_VARIANTS.LIGHT;

    const path = getLogoPath(variant);
    const cacheKey = `${path}:${variant}:${options.accentColor}`;

    if (textureCache.has(cacheKey)) {
        return textureCache.get(cacheKey).clone();
    }

    const fallback = createFallbackLogoTexture({
        ...options,
        variant,
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
        generatedBy: "CareerLogoBadgeLogo",
        path,
        variant,
        fallback,
        fallbackUsed: false,
    };

    textureCache.set(cacheKey, texture);

    return texture.clone();
}

function createFinishSettings(finish) {
    if (finish === LOGO_BADGE_FINISHES.MATTE) {
        return {
            roughness: 0.9,
            metalness: 0,
            clearcoat: 0,
            clearcoatRoughness: 0.72,
        };
    }

    if (finish === LOGO_BADGE_FINISHES.GLOSSY) {
        return {
            roughness: 0.24,
            metalness: 0.02,
            clearcoat: 0.56,
            clearcoatRoughness: 0.1,
        };
    }

    if (finish === LOGO_BADGE_FINISHES.FOIL) {
        return {
            roughness: 0.28,
            metalness: 0.18,
            clearcoat: 0.42,
            clearcoatRoughness: 0.12,
        };
    }

    return {
        roughness: 0.55,
        metalness: 0.01,
        clearcoat: 0.22,
        clearcoatRoughness: 0.28,
    };
}

function createPhysicalMaterial(name, color, options = {}) {
    const finish = createFinishSettings(options.finish);

    const material = new THREE.MeshPhysicalMaterial({
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

    material.userData = {
        generatedBy: "CareerLogoBadge",
        version: CAREER_LOGO_BADGE_VERSION,
        finish: options.finish,
    };

    return material;
}

function createGoldMaterial(options = {}) {
    return new THREE.MeshStandardMaterial({
        name: "CareerLogoBadgeGoldMaterial",
        color: options.frameColor,
        roughness: options.finish === LOGO_BADGE_FINISHES.FOIL ? 0.22 : 0.34,
        metalness: options.finish === LOGO_BADGE_FINISHES.FOIL ? 0.42 : 0.26,
    });
}

function createTransparentGlossMaterial(options = {}) {
    return new THREE.MeshBasicMaterial({
        name: "CareerLogoBadgeGlossMaterial",
        color: "#ffffff",
        transparent: true,
        opacity: options.finish === LOGO_BADGE_FINISHES.MATTE ? 0.06 : 0.18,
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
        generatedBy: "CareerLogoBadge",
        version: CAREER_LOGO_BADGE_VERSION,
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

function drawTechNodes(ctx, width, height, options = {}) {
    ctx.save();

    const opacity = options.opacity ?? 0.16;

    ctx.strokeStyle = hexToRgba(options.darkColor ?? "#2b2118", opacity);
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const marks = [
        [[90, 95], [180, 95], [230, 145]],
        [[width - 90, 95], [width - 180, 95], [width - 230, 145]],
        [[90, height - 95], [180, height - 95], [230, height - 145]],
        [[width - 90, height - 95], [width - 180, height - 95], [width - 230, height - 145]],
        [[width * 0.22, height * 0.5], [width * 0.31, height * 0.5], [width * 0.36, height * 0.57]],
        [[width * 0.78, height * 0.5], [width * 0.69, height * 0.5], [width * 0.64, height * 0.57]],
    ];

    marks.forEach((points) => {
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);

        for (let index = 1; index < points.length; index += 1) {
            ctx.lineTo(points[index][0], points[index][1]);
        }

        ctx.stroke();
    });

    ctx.fillStyle = hexToRgba(options.accentColor ?? "#c59a4a", 0.82);

    [
        [230, 145],
        [width - 230, 145],
        [230, height - 145],
        [width - 230, height - 145],
        [width * 0.36, height * 0.57],
        [width * 0.64, height * 0.57],
    ].forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 13, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.restore();
}

function drawBoliviaRibbon(ctx, width, options = {}) {
    if (!options.showBoliviaRibbon) return;

    ctx.save();

    ctx.fillStyle = options.secondaryAccent;
    ctx.fillRect(0, 0, width, 42);

    ctx.fillStyle = "#f0c84b";
    ctx.fillRect(0, 42, width, 42);

    ctx.fillStyle = options.greenAccent;
    ctx.fillRect(0, 84, width, 42);

    ctx.restore();
}

function drawBadgeCanvas(options) {
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 1000;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const backgroundGradient = ctx.createLinearGradient(0, 0, width, height);
    backgroundGradient.addColorStop(0, "#fffdf8");
    backgroundGradient.addColorStop(0.55, options.backgroundColor);
    backgroundGradient.addColorStop(1, "#ecd2a8");

    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, width, height);

    const identityGradient = ctx.createLinearGradient(0, 0, width, 0);
    identityGradient.addColorStop(0, hexToRgba(options.secondaryAccent, 0.13));
    identityGradient.addColorStop(0.52, "rgba(240, 200, 75, 0.20)");
    identityGradient.addColorStop(1, hexToRgba(options.greenAccent, 0.13));

    ctx.fillStyle = identityGradient;
    ctx.fillRect(0, 0, width, height);

    drawBoliviaRibbon(ctx, width, options);

    if (options.showTechMarks) {
        drawTechNodes(ctx, width, height, options);
    }

    if (options.showFrame) {
        ctx.strokeStyle = hexToRgba(options.darkColor, 0.22);
        ctx.lineWidth = 20;
        roundedRectPath(ctx, 76, 160, width - 152, height - 235, 52);
        ctx.stroke();

        ctx.strokeStyle = options.frameColor;
        ctx.lineWidth = 9;
        roundedRectPath(ctx, 116, 200, width - 232, height - 315, 38);
        ctx.stroke();

        ctx.strokeStyle = "rgba(255,255,255,0.65)";
        ctx.lineWidth = 4;
        roundedRectPath(ctx, 140, 224, width - 280, height - 365, 30);
        ctx.stroke();
    }

    if (options.showTitle) {
        ctx.fillStyle = options.darkColor;
        ctx.font = "900 62px Arial, Helvetica, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        drawMultilineText(ctx, options.title, width / 2, height - 205, width - 360, 68, 2);
    }

    if (options.showSubtitle) {
        ctx.fillStyle = hexToRgba(options.darkColor, 0.72);
        ctx.font = "800 36px Arial, Helvetica, sans-serif";
        drawMultilineText(ctx, options.subtitle, width / 2, height - 122, width - 420, 42, 1);
    }

    if (options.showFooter) {
        ctx.fillStyle = options.frameColor;
        ctx.font = "800 25px Arial, Helvetica, sans-serif";
        drawMultilineText(ctx, options.footer, width / 2, height - 66, width - 520, 30, 1);
    }

    drawPaperNoise(ctx, width, height);

    const texture = new THREE.CanvasTexture(canvas);
    setTextureQuality(texture);

    texture.userData = {
        generatedBy: "CareerLogoBadgeCanvas",
        options,
        createdAt: new Date().toISOString(),
    };

    return {
        canvas,
        texture,
    };
}

function drawPaperNoise(ctx, width, height) {
    ctx.save();

    for (let index = 0; index < 650; index += 1) {
        const alpha = Math.random() * 0.024;
        ctx.fillStyle = `rgba(80,55,30,${alpha})`;
        ctx.fillRect(
            Math.random() * width,
            Math.random() * height,
            Math.random() * 2 + 0.4,
            Math.random() * 2 + 0.4,
        );
    }

    ctx.restore();
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

function createSurfaceMaterial(options) {
    const { texture } = drawBadgeCanvas(options);

    const material = new THREE.MeshBasicMaterial({
        name: "CareerLogoBadgeSurfaceMaterial",
        map: texture,
        transparent: true,
        opacity: options.opacity,
        side: THREE.DoubleSide,
    });

    material.userData = {
        generatedBy: "CareerLogoBadge",
        texture,
        options,
    };

    return material;
}

function createLogoMaterial(options) {
    const texture = loadLogoTexture(options);

    const material = new THREE.MeshBasicMaterial({
        name: "CareerLogoBadgeLogoMaterial",
        map: texture,
        transparent: true,
        opacity: options.opacity,
        side: THREE.DoubleSide,
    });

    material.userData = {
        generatedBy: "CareerLogoBadge",
        texture,
        variant: options.variant,
    };

    return material;
}

function createBacking(options) {
    const backing = createRoundedMesh({
        name: "CareerLogoBadgeBacking",
        width: options.width,
        height: options.depth,
        depth: options.height,
        radius: options.cornerRadius,
        segments: options.cornerSegments,
        material: createPhysicalMaterial(
            "CareerLogoBadgeBackingMaterial",
            options.backgroundColor,
            options,
        ),
        rotation: [Math.PI / 2, 0, 0],
        position: [0, -0.012, 0],
        userData: {
            part: "backing",
        },
    });

    backing.visible = Boolean(options.showBacking);

    return backing;
}

function createStickerSurface(options) {
    const surface = new THREE.Mesh(
        new THREE.PlaneGeometry(options.width * 0.96, options.height * 0.94, 4, 4),
        createSurfaceMaterial(options),
    );

    surface.name = "CareerLogoBadgeSurface";
    surface.position.y = options.depth / 2 + 0.004;
    surface.rotation.x = -Math.PI / 2;
    surface.renderOrder = options.renderOrder;
    surface.visible = Boolean(options.showSurface);
    surface.userData = {
        generatedBy: "CareerLogoBadge",
        part: "surface",
        editable: true,
    };

    setMeshShadow(surface, false, true);

    return surface;
}

function createLogoPlane(options) {
    const logo = new THREE.Mesh(
        new THREE.PlaneGeometry(options.logoWidth, options.logoHeight),
        createLogoMaterial(options),
    );

    logo.name = "CareerLogoPlane";
    logo.position.set(0, options.depth / 2 + 0.016, options.showTitle ? -options.height * 0.08 : 0);
    logo.rotation.x = -Math.PI / 2;
    logo.renderOrder = options.renderOrder + 1;
    logo.visible = Boolean(options.showLogo);

    const scale = Array.isArray(options.logoScale)
        ? options.logoScale
        : [options.logoScale, options.logoScale, options.logoScale];

    logo.scale.set(scale[0], scale[1], scale[2] ?? 1);

    logo.userData = {
        generatedBy: "CareerLogoBadge",
        part: "logo",
        variant: options.variant,
        editable: true,
        preserveAspect: true,
    };

    return logo;
}

function createRectFrame(options) {
    const group = new THREE.Group();
    group.name = "CareerLogoBadgeFrame3D";
    group.visible = Boolean(options.showFrame);

    const material = createGoldMaterial(options);
    const y = options.depth / 2 + 0.023;
    const t = 0.018;
    const w = options.width * 1.01;
    const h = options.height * 1.01;

    const pieces = [
        {
            name: "LogoBadgeFrameTop",
            size: [w, t, t],
            position: [0, y, -h / 2],
        },
        {
            name: "LogoBadgeFrameBottom",
            size: [w, t, t],
            position: [0, y, h / 2],
        },
        {
            name: "LogoBadgeFrameLeft",
            size: [t, t, h],
            position: [-w / 2, y, 0],
        },
        {
            name: "LogoBadgeFrameRight",
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
                part: "frame",
            },
        });

        group.add(mesh);
    });

    return group;
}

function createCircularFrame(options) {
    const group = new THREE.Group();
    group.name = "CareerLogoCircularFrame";
    group.visible = Boolean(options.showFrame);

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(Math.min(options.width, options.height) * 0.49, 0.018, 14, 96),
        createGoldMaterial(options),
    );

    ring.name = "CareerLogoCircularGoldRing";
    ring.rotation.x = Math.PI / 2;
    ring.position.y = options.depth / 2 + 0.021;

    group.add(ring);

    return group;
}

function createCircularBacking(options) {
    const radius = Math.min(options.width, options.height) * 0.47;

    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, options.depth, 96),
        createPhysicalMaterial(
            "CareerLogoCircularBackingMaterial",
            options.backgroundColor,
            options,
        ),
    );

    base.name = "CareerLogoBadgeBacking";
    base.rotation.x = Math.PI / 2;
    base.visible = Boolean(options.showBacking);

    setMeshShadow(base, true, true);

    return base;
}

function createMinimalSurface(options) {
    const logo = createLogoPlane({
        ...options,
        logoWidth: options.width,
        logoHeight: options.height,
    });

    logo.position.set(0, 0.006, 0);
    logo.material.opacity = options.opacity;
    logo.renderOrder = options.renderOrder + 2;

    return logo;
}

function createGlossOverlay(options) {
    const group = new THREE.Group();
    group.name = "CareerLogoBadgeGloss";
    group.visible = Boolean(options.showGloss);

    const material = createTransparentGlossMaterial(options);

    const main = new THREE.Mesh(
        new THREE.PlaneGeometry(options.width * 0.23, options.height * 0.72),
        material,
    );

    main.name = "CareerLogoBadgeMainGloss";
    main.rotation.x = -Math.PI / 2;
    main.rotation.z = -0.28;
    main.position.set(-options.width * 0.26, options.depth / 2 + 0.034, -options.height * 0.02);
    main.renderOrder = options.renderOrder + 3;

    const soft = new THREE.Mesh(
        new THREE.PlaneGeometry(options.width * 0.12, options.height * 0.42),
        material.clone(),
    );

    soft.name = "CareerLogoBadgeSoftGloss";
    soft.material.opacity *= 0.62;
    soft.rotation.x = -Math.PI / 2;
    soft.rotation.z = 0.23;
    soft.position.set(options.width * 0.28, options.depth / 2 + 0.035, options.height * 0.1);
    soft.renderOrder = options.renderOrder + 3;

    group.add(main, soft);

    return group;
}

function createMountPads(options) {
    const group = new THREE.Group();
    group.name = "CareerLogoBadgeMountPads";
    group.visible = Boolean(options.showMountPads && options.showBacking);

    const material = new THREE.MeshBasicMaterial({
        name: "CareerLogoBadgeMountPadMaterial",
        color: "#000000",
        transparent: true,
        opacity: 0.1,
        depthWrite: false,
        side: THREE.DoubleSide,
    });

    const padPositions = [
        [-options.width * 0.32, -options.height * 0.3],
        [options.width * 0.32, -options.height * 0.3],
    ];

    padPositions.forEach(([x, z], index) => {
        const pad = new THREE.Mesh(
            new THREE.CircleGeometry(0.055, 32),
            material.clone(),
        );

        pad.name = `CareerLogoMountPad_${index + 1}`;
        pad.rotation.x = -Math.PI / 2;
        pad.position.set(x, -options.depth / 2 - 0.004, z);

        group.add(pad);
    });

    return group;
}

function createBadgeContactShadow(options) {
    const group = new THREE.Group();
    group.name = "CareerLogoBadgeContactShadow";
    group.visible = Boolean(options.showShadow);

    const material = new THREE.MeshBasicMaterial({
        name: "CareerLogoBadgeShadowMaterial",
        color: "#000000",
        transparent: true,
        opacity: 0.14,
        side: THREE.DoubleSide,
        depthWrite: false,
    });

    const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(Math.max(options.width, options.height) * 0.5, 64),
        material,
    );

    shadow.name = "CareerLogoBadgeSoftShadow";
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -options.depth / 2 - 0.016;
    shadow.scale.set(1.16, 0.72, 1);
    shadow.renderOrder = -1;

    group.add(shadow);

    return group;
}

function createStickerBadge(options) {
    const group = new THREE.Group();
    group.name = "CareerLogoStickerBadge";

    group.add(
        createBacking(options),
        createStickerSurface(options),
        createLogoPlane(options),
        createRectFrame(options),
        createGlossOverlay(options),
        createMountPads(options),
    );

    return group;
}

function createPlaqueBadge(options) {
    const group = new THREE.Group();
    group.name = "CareerLogoPlaqueBadge";

    group.add(
        createBacking({
            ...options,
            depth: Math.max(options.depth, 0.065),
        }),
        createStickerSurface(options),
        createLogoPlane({
            ...options,
            logoWidth: options.logoWidth,
            logoHeight: options.logoHeight,
        }),
        createRectFrame(options),
        createGlossOverlay(options),
        createMountPads(options),
    );

    return group;
}

function createCircularBadge(options) {
    const group = new THREE.Group();
    group.name = "CareerLogoCircularBadge";

    const surface = new THREE.Mesh(
        new THREE.CircleGeometry(Math.min(options.width, options.height) * 0.44, 96),
        createSurfaceMaterial({
            ...options,
            showTitle: false,
            showSubtitle: false,
            showFooter: false,
        }),
    );

    surface.name = "CareerLogoBadgeSurface";
    surface.rotation.x = -Math.PI / 2;
    surface.position.y = options.depth / 2 + 0.005;
    surface.renderOrder = options.renderOrder;

    const logo = createLogoPlane({
        ...options,
        logoWidth: options.logoWidth,
        logoHeight: options.logoHeight,
    });

    logo.position.set(0, options.depth / 2 + 0.018, 0);

    group.add(
        createCircularBacking(options),
        surface,
        logo,
        createCircularFrame(options),
        createGlossOverlay({
            ...options,
            width: Math.min(options.width, options.height),
            height: Math.min(options.width, options.height),
        }),
    );

    return group;
}

function createMinimalBadge(options) {
    const group = new THREE.Group();
    group.name = "CareerLogoMinimalBadge";

    group.add(createMinimalSurface(options));

    return group;
}

function createWatermarkBadge(options) {
    const group = new THREE.Group();
    group.name = "CareerLogoWatermarkBadge";

    const logo = createMinimalSurface({
        ...options,
        opacity: options.opacity,
    });

    logo.material.depthWrite = false;
    logo.material.blending = THREE.NormalBlending;

    group.add(logo);

    return group;
}

function createBadgeByStyle(options) {
    if (options.style === LOGO_BADGE_STYLES.CIRCULAR) {
        return createCircularBadge(options);
    }

    if (options.style === LOGO_BADGE_STYLES.PLAQUE || options.style === LOGO_BADGE_STYLES.FRONT_LABEL) {
        return createPlaqueBadge(options);
    }

    if (options.style === LOGO_BADGE_STYLES.MINIMAL) {
        return createMinimalBadge(options);
    }

    if (options.style === LOGO_BADGE_STYLES.WATERMARK) {
        return createWatermarkBadge(options);
    }

    return createStickerBadge(options);
}

function applyTargetTransform(group, config = {}, options = {}) {
    const transform =
        config.layout ??
        config.transform ??
        config.contentLayout?.logoBadge ??
        config.contentLayout?.careerLogoBadge ??
        {};

    const targetTransform =
        TARGET_TRANSFORMS[options.target] ??
        TARGET_TRANSFORMS[LOGO_BADGE_TARGETS.INTERIOR];

    applyTransform(group, {
        position: transform.position ?? options.position ?? targetTransform.position,
        rotation: transform.rotation ?? options.rotation ?? targetTransform.rotation,
        scale: transform.scale ?? options.scale ?? targetTransform.scale,
    });

    const badgeScale = Array.isArray(options.badgeScale)
        ? options.badgeScale
        : [options.badgeScale, options.badgeScale, options.badgeScale];

    group.scale.multiply(new THREE.Vector3(
        badgeScale[0] ?? 1,
        badgeScale[1] ?? 1,
        badgeScale[2] ?? 1,
    ));
}

function createMetadata(options) {
    return {
        objectType: "CareerLogoBadge",
        version: CAREER_LOGO_BADGE_VERSION,
        variant: options.variant,
        style: options.style,
        target: options.target,
        finish: options.finish,
        title: options.title,
        subtitle: options.subtitle,
        footer: options.footer,
        dimensions: {
            width: options.width,
            height: options.height,
            depth: options.depth,
        },
        editable: true,
        draggable: true,
        rotatable: true,
        scalable: true,
        exportable: true,
        minScale: options.minScale,
        maxScale: options.maxScale,
        purpose: "reusable-career-logo-branding-badge",
        createdAt: new Date().toISOString(),
    };
}

export function createCareerLogoBadge(config = {}, materials = {}, textureSet = {}, extraOptions = {}) {
    const options = normalizeOptions(config, extraOptions);

    const group = new THREE.Group();
    group.name = "KickOffBoxCareerLogoBadge";
    group.userData = createMetadata(options);

    const shadow = createBadgeContactShadow(options);
    const badge = createBadgeByStyle(options);

    if (options.showShadow) group.add(shadow);

    group.add(badge);

    group.userData.parts = {
        shadow: shadow.name,
        badge: badge.name,
    };

    applyTargetTransform(group, config, options);
    setGroupShadow(group, true, true);

    return group;
}

export function createLogoBadge(config = {}, materials = {}, textureSet = {}, extraOptions = {}) {
    return createCareerLogoBadge(config, materials, textureSet, extraOptions);
}

export function updateCareerLogoVariant(badgeGroup, variant = LOGO_BADGE_VARIANTS.LIGHT) {
    if (!badgeGroup) return;

    const logo = badgeGroup.getObjectByName("CareerLogoPlane");

    if (!logo?.material) return;

    disposeTexture(logo.material.map);

    const options = {
        ...(badgeGroup.userData ?? {}),
        ...(badgeGroup.userData?.options ?? {}),
        variant,
    };

    const texture = loadLogoTexture(options);

    logo.material.map = texture;
    logo.material.userData.texture = texture;
    logo.material.userData.variant = variant;
    logo.material.needsUpdate = true;

    badgeGroup.userData.variant = variant;
    badgeGroup.userData.updatedAt = new Date().toISOString();
}

export function updateCareerLogoBadgeDesign(badgeGroup, nextOptions = {}) {
    if (!badgeGroup) return;

    const currentOptions = {
        ...DEFAULT_OPTIONS,
        ...(badgeGroup.userData ?? {}),
        ...(badgeGroup.userData?.options ?? {}),
    };

    const updatedOptions = normalizeOptions({
        ...currentOptions,
        ...nextOptions,
    });

    const surface = badgeGroup.getObjectByName("CareerLogoBadgeSurface");

    if (surface?.material) {
        disposeTexture(surface.material.map);

        const nextMaterial = createSurfaceMaterial(updatedOptions);
        disposeMaterial(surface.material);

        surface.material = nextMaterial;
        surface.material.needsUpdate = true;
    }

    const logo = badgeGroup.getObjectByName("CareerLogoPlane");

    if (logo?.material && nextOptions.variant) {
        updateCareerLogoVariant(badgeGroup, nextOptions.variant);
    }

    badgeGroup.userData = {
        ...badgeGroup.userData,
        ...createMetadata(updatedOptions),
        options: updatedOptions,
        updatedAt: new Date().toISOString(),
    };
}

export function setCareerLogoBadgeTransform(badgeGroup, { position, rotation, scale } = {}) {
    if (!badgeGroup) return;

    if (position) {
        badgeGroup.position.set(position[0], position[1], position[2]);
    }

    if (rotation) {
        badgeGroup.rotation.set(rotation[0], rotation[1], rotation[2]);
    }

    if (scale) {
        const values = Array.isArray(scale) ? scale : [scale, scale, scale];
        const minScale = badgeGroup.userData?.minScale ?? DEFAULT_OPTIONS.minScale;
        const maxScale = badgeGroup.userData?.maxScale ?? DEFAULT_OPTIONS.maxScale;

        badgeGroup.scale.set(
            THREE.MathUtils.clamp(values[0], minScale, maxScale),
            THREE.MathUtils.clamp(values[1], minScale, maxScale),
            THREE.MathUtils.clamp(values[2], minScale, maxScale),
        );
    }

    badgeGroup.userData.updatedAt = new Date().toISOString();
}

export function setCareerLogoBadgeVisibility(badgeGroup, visible = true) {
    if (!badgeGroup) return;

    badgeGroup.visible = Boolean(visible);
    badgeGroup.userData.visible = Boolean(visible);
    badgeGroup.userData.updatedAt = new Date().toISOString();
}

export function setCareerLogoFrameVisibility(badgeGroup, visible = true) {
    const frames = [
        badgeGroup?.getObjectByName("CareerLogoBadgeFrame3D"),
        badgeGroup?.getObjectByName("CareerLogoCircularFrame"),
    ].filter(Boolean);

    frames.forEach((frame) => {
        frame.visible = Boolean(visible);
    });
}

export function setCareerLogoShadowVisibility(badgeGroup, visible = true) {
    const shadow = badgeGroup?.getObjectByName("CareerLogoBadgeContactShadow");

    if (!shadow) return;

    shadow.visible = Boolean(visible);
}

export function setCareerLogoTextVisibility(badgeGroup, visible = true) {
    const surface = badgeGroup?.getObjectByName("CareerLogoBadgeSurface");

    if (!surface) return;

    surface.visible = Boolean(visible);
}

export function animateCareerLogoBadge(badgeGroup, elapsedTime = 0) {
    if (!badgeGroup) return;

    const logo = badgeGroup.getObjectByName("CareerLogoPlane");
    const gloss = badgeGroup.getObjectByName("CareerLogoBadgeGloss");

    if (logo) {
        logo.position.y += Math.sin(elapsedTime * 1.15) * 0.00035;
    }

    if (gloss) {
        gloss.children.forEach((child, index) => {
            if (child.material) {
                child.material.opacity = 0.12 + Math.sin(elapsedTime * 1.3 + index) * 0.025;
            }
        });
    }
}

export function updateCareerLogoBadgeAnimation(badgeGroup, elapsedTime = 0) {
    animateCareerLogoBadge(badgeGroup, elapsedTime);
}

export function getCareerLogoBadgeParts(badgeGroup) {
    if (!badgeGroup) return {};

    return {
        stickerBadge: badgeGroup.getObjectByName("CareerLogoStickerBadge"),
        circularBadge: badgeGroup.getObjectByName("CareerLogoCircularBadge"),
        plaqueBadge: badgeGroup.getObjectByName("CareerLogoPlaqueBadge"),
        minimalBadge: badgeGroup.getObjectByName("CareerLogoMinimalBadge"),
        watermarkBadge: badgeGroup.getObjectByName("CareerLogoWatermarkBadge"),
        surface: badgeGroup.getObjectByName("CareerLogoBadgeSurface"),
        logo: badgeGroup.getObjectByName("CareerLogoPlane"),
        backing: badgeGroup.getObjectByName("CareerLogoBadgeBacking"),
        frame:
            badgeGroup.getObjectByName("CareerLogoBadgeFrame3D") ||
            badgeGroup.getObjectByName("CareerLogoCircularFrame"),
        gloss: badgeGroup.getObjectByName("CareerLogoBadgeGloss"),
        mountPads: badgeGroup.getObjectByName("CareerLogoBadgeMountPads"),
        shadow: badgeGroup.getObjectByName("CareerLogoBadgeContactShadow"),
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

export function disposeCareerLogoBadge(badgeGroup) {
    if (!badgeGroup) return;

    const disposedGeometries = new Set();
    const disposedMaterials = new Set();

    badgeGroup.traverse((object) => {
        if (object.geometry && !disposedGeometries.has(object.geometry)) {
            object.geometry.dispose();
            disposedGeometries.add(object.geometry);
        }

        if (object.material && !disposedMaterials.has(object.material)) {
            disposeMaterial(object.material);
            disposedMaterials.add(object.material);
        }
    });

    badgeGroup.removeFromParent();
}

export function disposeCareerLogoTextureCache() {
    textureCache.forEach((texture) => {
        disposeTexture(texture);
    });

    textureCache.clear();
}

export const CareerLogoBadge = Object.freeze({
    version: CAREER_LOGO_BADGE_VERSION,
    variants: LOGO_BADGE_VARIANTS,
    styles: LOGO_BADGE_STYLES,
    targets: LOGO_BADGE_TARGETS,
    finishes: LOGO_BADGE_FINISHES,

    createCareerLogoBadge,
    createLogoBadge,

    updateCareerLogoVariant,
    updateCareerLogoBadgeDesign,
    updateCareerLogoBadgeAnimation,
    animateCareerLogoBadge,

    setCareerLogoBadgeTransform,
    setCareerLogoBadgeVisibility,
    setCareerLogoFrameVisibility,
    setCareerLogoShadowVisibility,
    setCareerLogoTextVisibility,

    getCareerLogoBadgeParts,
    disposeCareerLogoBadge,
    disposeCareerLogoTextureCache,
});
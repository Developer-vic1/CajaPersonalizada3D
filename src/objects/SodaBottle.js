import * as THREE from "three";

import {
    BEVERAGE_TYPES,
    getBeverage,
} from "../config/beverageCatalog.js";

import {
    applyTransform,
    getBoxDimensions,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

import {
    createBeverageLabelTexture,
} from "../utils/textureFactory.js";

export const SODA_BOTTLE_VERSION = "3.0.0";

export const BOTTLE_ORIENTATION = Object.freeze({
    VERTICAL: "vertical",
    HORIZONTAL: "horizontal",
    DIAGONAL: "diagonal",
});

export const BOTTLE_RENDER_MODE = Object.freeze({
    PLASTIC: "plastic",
    CLEAR_WATER: "clear-water",
    DARK_COLA: "dark-cola",
    JUICE: "juice",
    SPORT: "sport",
    METALLIC_CAN: "metallic-can",
});

export const BOTTLE_SHAPES = Object.freeze({
    CLASSIC: "classic",
    WATER: "water",
    SPORT: "sport",
    SLIM: "slim",
    CAN: "can",
});

export const BOTTLE_LABEL_STYLE = Object.freeze({
    PREMIUM: "premium",
    COLA: "cola",
    CITRUS: "citrus",
    WATER: "water",
    SPORT: "sport",
    JUICE: "juice",
    MINIMAL: "minimal",
});

const FALLBACK_BEVERAGE_TYPES = Object.freeze({
    CUSTOM: "custom",
    COLA: "cola",
    ORANGE: "orange",
    LEMON: "lemon",
    WATER: "water",
    MINERAL: "mineral",
    SPORT: "sport",
    JUICE: "juice",
    ENERGY: "energy",
});

const TYPES = {
    ...FALLBACK_BEVERAGE_TYPES,
    ...(BEVERAGE_TYPES ?? {}),
};

const DEFAULT_BOTTLE_OPTIONS = Object.freeze({
    beverageType: TYPES.CUSTOM,
    type: TYPES.CUSTOM,

    labelText: "KICKOFF DRINK",
    subLabel: "Custom 2026",
    footerText: "Detalle académico",
    shortLabel: "KICK",

    bottleShape: null,
    renderMode: null,
    orientation: BOTTLE_ORIENTATION.HORIZONTAL,
    labelStyle: BOTTLE_LABEL_STYLE.PREMIUM,

    liquidColor: "#2f86c7",
    liquidOpacity: 0.66,
    bottleTint: "#eef7ff",
    bottleOpacity: 0.42,
    capColor: "#f4f1e8",

    labelBackground: "#111111",
    labelTextColor: "#fff7e8",
    labelAccent: "#c59a4a",
    secondaryAccent: "#b92d2d",
    greenAccent: "#2f7d55",
    pattern: "premium",

    bubbles: true,
    bubbleCount: 34,
    condensation: true,
    dropletCount: 44,
    carbonationSpeed: 0.55,

    showBottle: true,
    showLiquid: true,
    showLabel: true,
    showBackLabel: true,
    showBubbles: true,
    showCondensation: true,
    showHighlights: true,
    showBaseRing: true,
    showShadow: true,
    showCapRidges: true,
    showGripGrooves: true,
    showLiquidLine: true,
    showPackingPad: true,
    showSlotGuide: true,

    highlightIntensity: 0.32,
    labelTexture: null,
    customLabelImage: null,

    scale: [0.58, 0.58, 0.58],
    position: null,
    rotation: null,

    renderOrder: 8,
});

const BEVERAGE_PRESETS = Object.freeze({
    [TYPES.COLA]: Object.freeze({
        labelText: "COLA 2026",
        subLabel: "Refresco clásico",
        footerText: "KickOff Box",
        shortLabel: "COLA",
        liquidColor: "#1d1009",
        liquidOpacity: 0.78,
        bottleTint: "#f3efe6",
        bottleOpacity: 0.38,
        capColor: "#b92d2d",
        labelBackground: "#15100d",
        labelTextColor: "#fff7e8",
        labelAccent: "#c59a4a",
        secondaryAccent: "#b92d2d",
        renderMode: BOTTLE_RENDER_MODE.DARK_COLA,
        bottleShape: BOTTLE_SHAPES.CLASSIC,
        labelStyle: BOTTLE_LABEL_STYLE.COLA,
    }),

    [TYPES.ORANGE]: Object.freeze({
        labelText: "NARANJA",
        subLabel: "Refresco cítrico",
        footerText: "Sabor celebración",
        shortLabel: "CITRUS",
        liquidColor: "#f28c28",
        liquidOpacity: 0.72,
        bottleTint: "#fff2df",
        bottleOpacity: 0.4,
        capColor: "#ff7a1a",
        labelBackground: "#ff7a1a",
        labelTextColor: "#fff7e8",
        labelAccent: "#f0c84b",
        secondaryAccent: "#b92d2d",
        renderMode: BOTTLE_RENDER_MODE.PLASTIC,
        bottleShape: BOTTLE_SHAPES.CLASSIC,
        labelStyle: BOTTLE_LABEL_STYLE.CITRUS,
    }),

    [TYPES.LEMON]: Object.freeze({
        labelText: "LIMA LIMÓN",
        subLabel: "Refresco claro",
        footerText: "KickOff Box",
        shortLabel: "LIMA",
        liquidColor: "#dff6b4",
        liquidOpacity: 0.52,
        bottleTint: "#f0fff0",
        bottleOpacity: 0.36,
        capColor: "#2f7d55",
        labelBackground: "#2f7d55",
        labelTextColor: "#fff7e8",
        labelAccent: "#f0c84b",
        secondaryAccent: "#2f7d55",
        renderMode: BOTTLE_RENDER_MODE.PLASTIC,
        bottleShape: BOTTLE_SHAPES.SLIM,
        labelStyle: BOTTLE_LABEL_STYLE.CITRUS,
    }),

    [TYPES.WATER]: Object.freeze({
        labelText: "AGUA",
        subLabel: "Botella personal",
        footerText: "Hidratación",
        shortLabel: "H2O",
        liquidColor: "#bdeaff",
        liquidOpacity: 0.42,
        bottleTint: "#eaf8ff",
        bottleOpacity: 0.32,
        capColor: "#2f86c7",
        labelBackground: "#f8fbff",
        labelTextColor: "#111827",
        labelAccent: "#2f86c7",
        secondaryAccent: "#c59a4a",
        renderMode: BOTTLE_RENDER_MODE.CLEAR_WATER,
        bottleShape: BOTTLE_SHAPES.WATER,
        labelStyle: BOTTLE_LABEL_STYLE.WATER,
        bubbles: false,
        bubbleCount: 8,
    }),

    [TYPES.MINERAL]: Object.freeze({
        labelText: "MINERAL",
        subLabel: "Agua con gas",
        footerText: "Presentación premium",
        shortLabel: "GAS",
        liquidColor: "#c6f2ff",
        liquidOpacity: 0.45,
        bottleTint: "#eaf8ff",
        bottleOpacity: 0.34,
        capColor: "#c59a4a",
        labelBackground: "#f8fbff",
        labelTextColor: "#111827",
        labelAccent: "#c59a4a",
        secondaryAccent: "#2f86c7",
        renderMode: BOTTLE_RENDER_MODE.CLEAR_WATER,
        bottleShape: BOTTLE_SHAPES.WATER,
        labelStyle: BOTTLE_LABEL_STYLE.WATER,
        bubbles: true,
        bubbleCount: 48,
    }),

    [TYPES.SPORT]: Object.freeze({
        labelText: "SPORT",
        subLabel: "Bebida deportiva",
        footerText: "Energía académica",
        shortLabel: "SPORT",
        liquidColor: "#41a9ff",
        liquidOpacity: 0.68,
        bottleTint: "#ecf8ff",
        bottleOpacity: 0.42,
        capColor: "#f7f7f7",
        labelBackground: "#111827",
        labelTextColor: "#f8fbff",
        labelAccent: "#2f86c7",
        secondaryAccent: "#f0c84b",
        renderMode: BOTTLE_RENDER_MODE.SPORT,
        bottleShape: BOTTLE_SHAPES.SPORT,
        labelStyle: BOTTLE_LABEL_STYLE.SPORT,
    }),

    [TYPES.JUICE]: Object.freeze({
        labelText: "JUGO",
        subLabel: "Fruta natural",
        footerText: "Detalle saludable",
        shortLabel: "JUGO",
        liquidColor: "#e7892e",
        liquidOpacity: 0.76,
        bottleTint: "#fff5e7",
        bottleOpacity: 0.38,
        capColor: "#f0c84b",
        labelBackground: "#fff7e8",
        labelTextColor: "#2b2118",
        labelAccent: "#e7892e",
        secondaryAccent: "#2f7d55",
        renderMode: BOTTLE_RENDER_MODE.JUICE,
        bottleShape: BOTTLE_SHAPES.SLIM,
        labelStyle: BOTTLE_LABEL_STYLE.JUICE,
        bubbles: false,
    }),

    [TYPES.ENERGY]: Object.freeze({
        labelText: "ENERGY",
        subLabel: "Bebida energética",
        footerText: "Edición 2026",
        shortLabel: "NRG",
        liquidColor: "#d6d6d6",
        liquidOpacity: 0.95,
        bottleTint: "#d9d3c4",
        bottleOpacity: 1,
        capColor: "#c9c9c9",
        labelBackground: "#111111",
        labelTextColor: "#fff7e8",
        labelAccent: "#f0c84b",
        secondaryAccent: "#b92d2d",
        renderMode: BOTTLE_RENDER_MODE.METALLIC_CAN,
        bottleShape: BOTTLE_SHAPES.CAN,
        labelStyle: BOTTLE_LABEL_STYLE.PREMIUM,
        bubbles: false,
        condensation: false,
    }),
});

const SHAPE_PRESETS = Object.freeze({
    [BOTTLE_SHAPES.CLASSIC]: Object.freeze({
        totalHeight: 1.92,
        body: {
            radiusTop: 0.205,
            radiusMid: 0.285,
            radiusBottom: 0.275,
            height: 1.28,
        },
        neck: {
            radiusTop: 0.122,
            radiusBottom: 0.172,
            height: 0.34,
        },
        cap: {
            radius: 0.15,
            height: 0.14,
        },
        label: {
            width: 0.7,
            height: 0.38,
            y: -0.03,
            z: 0.291,
        },
        bottom: {
            radius: 0.232,
            height: 0.052,
        },
    }),

    [BOTTLE_SHAPES.WATER]: Object.freeze({
        totalHeight: 1.98,
        body: {
            radiusTop: 0.192,
            radiusMid: 0.255,
            radiusBottom: 0.248,
            height: 1.38,
        },
        neck: {
            radiusTop: 0.118,
            radiusBottom: 0.158,
            height: 0.36,
        },
        cap: {
            radius: 0.142,
            height: 0.13,
        },
        label: {
            width: 0.66,
            height: 0.32,
            y: -0.03,
            z: 0.263,
        },
        bottom: {
            radius: 0.212,
            height: 0.048,
        },
    }),

    [BOTTLE_SHAPES.SPORT]: Object.freeze({
        totalHeight: 2.02,
        body: {
            radiusTop: 0.21,
            radiusMid: 0.275,
            radiusBottom: 0.264,
            height: 1.36,
        },
        neck: {
            radiusTop: 0.128,
            radiusBottom: 0.176,
            height: 0.38,
        },
        cap: {
            radius: 0.162,
            height: 0.17,
        },
        label: {
            width: 0.72,
            height: 0.36,
            y: -0.04,
            z: 0.282,
        },
        bottom: {
            radius: 0.22,
            height: 0.05,
        },
    }),

    [BOTTLE_SHAPES.SLIM]: Object.freeze({
        totalHeight: 1.86,
        body: {
            radiusTop: 0.18,
            radiusMid: 0.218,
            radiusBottom: 0.212,
            height: 1.35,
        },
        neck: {
            radiusTop: 0.108,
            radiusBottom: 0.138,
            height: 0.26,
        },
        cap: {
            radius: 0.132,
            height: 0.12,
        },
        label: {
            width: 0.62,
            height: 0.46,
            y: -0.02,
            z: 0.225,
        },
        bottom: {
            radius: 0.188,
            height: 0.044,
        },
    }),

    [BOTTLE_SHAPES.CAN]: Object.freeze({
        totalHeight: 1.18,
        body: {
            radiusTop: 0.245,
            radiusMid: 0.255,
            radiusBottom: 0.245,
            height: 1.12,
        },
        neck: {
            radiusTop: 0.001,
            radiusBottom: 0.001,
            height: 0.001,
        },
        cap: {
            radius: 0.246,
            height: 0.038,
        },
        label: {
            width: 0.74,
            height: 0.66,
            y: 0.0,
            z: 0.262,
        },
        bottom: {
            radius: 0.246,
            height: 0.038,
        },
    }),
});

function safeGetBeverage(type) {
    try {
        return getBeverage(type);
    } catch {
        try {
            return getBeverage(TYPES.CUSTOM);
        } catch {
            return {};
        }
    }
}

function normalizeBottleOptions(config = {}) {
    const source = config.beverage ?? config.bottleOptions ?? config.sodaBottle ?? config;
    const requestedType = source.beverageType ?? source.type ?? DEFAULT_BOTTLE_OPTIONS.beverageType;
    const catalogConfig = safeGetBeverage(requestedType);
    const presetConfig = BEVERAGE_PRESETS[requestedType] ?? BEVERAGE_PRESETS[catalogConfig?.id] ?? {};
    const beverageType = catalogConfig?.id ?? requestedType ?? TYPES.CUSTOM;

    const merged = {
        ...DEFAULT_BOTTLE_OPTIONS,
        ...presetConfig,
        ...catalogConfig,
        ...source,
        beverageType,
        type: beverageType,
    };

    return {
        ...merged,
        bottleShape: merged.bottleShape ?? inferBottleShape(beverageType),
        renderMode: merged.renderMode ?? inferRenderMode(beverageType),
        showBubbles: merged.showBubbles !== false && Boolean(merged.bubbles),
        showCondensation: merged.showCondensation !== false && Boolean(merged.condensation),
    };
}

function inferBottleShape(beverageType) {
    if (beverageType === TYPES.WATER) return BOTTLE_SHAPES.WATER;
    if (beverageType === TYPES.MINERAL) return BOTTLE_SHAPES.WATER;
    if (beverageType === TYPES.SPORT) return BOTTLE_SHAPES.SPORT;
    if (beverageType === TYPES.ENERGY) return BOTTLE_SHAPES.CAN;
    if (beverageType === TYPES.JUICE) return BOTTLE_SHAPES.SLIM;

    return BOTTLE_SHAPES.CLASSIC;
}

function inferRenderMode(beverageType) {
    if (beverageType === TYPES.COLA) return BOTTLE_RENDER_MODE.DARK_COLA;
    if (beverageType === TYPES.WATER) return BOTTLE_RENDER_MODE.CLEAR_WATER;
    if (beverageType === TYPES.MINERAL) return BOTTLE_RENDER_MODE.CLEAR_WATER;
    if (beverageType === TYPES.SPORT) return BOTTLE_RENDER_MODE.SPORT;
    if (beverageType === TYPES.JUICE) return BOTTLE_RENDER_MODE.JUICE;
    if (beverageType === TYPES.ENERGY) return BOTTLE_RENDER_MODE.METALLIC_CAN;

    return BOTTLE_RENDER_MODE.PLASTIC;
}

function getShapePreset(options) {
    return SHAPE_PRESETS[options.bottleShape] ?? SHAPE_PRESETS[BOTTLE_SHAPES.CLASSIC];
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

function createPhysicalMaterial({
    name,
    color,
    roughness = 0.18,
    metalness = 0.02,
    transparent = true,
    opacity = 0.58,
    transmission = 0.35,
    thickness = 0.35,
    ior = 1.46,
    clearcoat = 0.45,
    clearcoatRoughness = 0.12,
    envMapIntensity = 1.2,
    side = THREE.FrontSide,
}) {
    const material = new THREE.MeshPhysicalMaterial({
        name,
        color,
        roughness,
        metalness,
        transparent,
        opacity,
        transmission,
        thickness,
        ior,
        clearcoat,
        clearcoatRoughness,
        envMapIntensity,
        side,
    });

    material.needsUpdate = true;
    return material;
}

function createStandardMaterial({
    name,
    color,
    roughness = 0.55,
    metalness = 0.02,
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

function createBottlePlasticMaterial(materials, options) {
    if (options.renderMode === BOTTLE_RENDER_MODE.METALLIC_CAN) {
        return createStandardMaterial({
            name: "CanMetalBodyMaterial",
            color: options.bottleTint,
            roughness: 0.28,
            metalness: 0.58,
        });
    }

    const base = materials?.sodaBottle?.clone?.();

    const material = base ?? createPhysicalMaterial({
        name: "BottlePlasticMaterial",
        color: options.bottleTint,
    });

    material.name = "BottlePlasticMaterial";
    material.color?.set(options.bottleTint);
    material.transparent = true;
    material.opacity = options.bottleOpacity;

    if ("roughness" in material) material.roughness = 0.08;
    if ("metalness" in material) material.metalness = 0.02;
    if ("transmission" in material) material.transmission = options.renderMode === BOTTLE_RENDER_MODE.CLEAR_WATER ? 0.56 : 0.38;
    if ("thickness" in material) material.thickness = 0.42;
    if ("ior" in material) material.ior = 1.46;
    if ("clearcoat" in material) material.clearcoat = 0.6;
    if ("clearcoatRoughness" in material) material.clearcoatRoughness = 0.07;
    if ("envMapIntensity" in material) material.envMapIntensity = 1.35;

    material.needsUpdate = true;
    return material;
}

function createLiquidMaterial(materials, options) {
    const material = createPhysicalMaterial({
        name: "BottleLiquidMaterial",
        color: options.liquidColor,
        opacity: options.liquidOpacity,
        transmission: options.renderMode === BOTTLE_RENDER_MODE.CLEAR_WATER ? 0.32 : 0.08,
        thickness: 0.24,
        roughness: options.renderMode === BOTTLE_RENDER_MODE.DARK_COLA ? 0.18 : 0.1,
        clearcoat: 0.22,
        clearcoatRoughness: 0.12,
    });

    return material;
}

function createCapMaterial(materials, options) {
    const base = materials?.sodaCap?.clone?.();

    const material = base ?? createStandardMaterial({
        name: "BottleCapMaterial",
        color: options.capColor,
        roughness: 0.42,
        metalness: 0.08,
    });

    material.name = "BottleCapMaterial";
    material.color?.set(options.capColor);

    if ("roughness" in material) {
        material.roughness = options.renderMode === BOTTLE_RENDER_MODE.METALLIC_CAN ? 0.24 : 0.42;
    }

    if ("metalness" in material) {
        material.metalness = options.renderMode === BOTTLE_RENDER_MODE.METALLIC_CAN ? 0.46 : 0.08;
    }

    material.needsUpdate = true;
    return material;
}

function createLabelFallbackTexture(options) {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 620;

    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, options.labelBackground);
    gradient.addColorStop(0.56, "#1d1814");
    gradient.addColorStop(1, options.secondaryAccent);

    if (options.labelStyle === BOTTLE_LABEL_STYLE.WATER) {
        gradient.addColorStop(0, "#f8fbff");
        gradient.addColorStop(1, "#dff3ff");
    }

    if (options.labelStyle === BOTTLE_LABEL_STYLE.JUICE) {
        gradient.addColorStop(0, "#fff7e8");
        gradient.addColorStop(1, "#ffcc87");
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = options.secondaryAccent;
    ctx.fillRect(0, 0, canvas.width, 52);

    ctx.fillStyle = "#f0c84b";
    ctx.fillRect(0, 52, canvas.width, 52);

    ctx.fillStyle = options.greenAccent;
    ctx.fillRect(0, 104, canvas.width, 52);

    ctx.strokeStyle = options.labelAccent;
    ctx.lineWidth = 18;
    roundedRectPath(ctx, 66, 186, canvas.width - 132, canvas.height - 260, 48);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,255,255,0.48)";
    ctx.lineWidth = 5;
    roundedRectPath(ctx, 102, 222, canvas.width - 204, canvas.height - 332, 34);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = options.labelTextColor;
    ctx.font = "900 104px Arial, Helvetica, sans-serif";
    drawMultilineText(ctx, options.labelText, canvas.width / 2, 312, canvas.width - 250, 108, 1);

    ctx.fillStyle = options.labelAccent;
    ctx.font = "900 44px Arial, Helvetica, sans-serif";
    drawMultilineText(ctx, options.subLabel, canvas.width / 2, 410, canvas.width - 320, 48, 1);

    ctx.fillStyle = hexToRgba(options.labelTextColor, 0.76);
    ctx.font = "700 32px Arial, Helvetica, sans-serif";
    drawMultilineText(ctx, options.footerText, canvas.width / 2, 504, canvas.width - 360, 38, 1);

    drawMiniFootballMark(ctx, canvas.width - 150, canvas.height - 130, 58, options);
    drawPaperNoise(ctx, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    return texture;
}

function createLabelMaterial(options, textureSet) {
    const externalTexture =
        options.labelTexture ??
        textureSet?.beverageLabel?.texture ??
        null;

    let texture = externalTexture;

    if (!texture) {
        try {
            texture = createBeverageLabelTexture({
                labelText: options.labelText,
                subLabel: options.subLabel,
                footerText: options.footerText,
                labelBackground: options.labelBackground,
                labelTextColor: options.labelTextColor,
                labelAccent: options.labelAccent,
                secondaryAccent: options.secondaryAccent,
                pattern: options.pattern,
            }).texture;
        } catch {
            texture = createLabelFallbackTexture(options);
        }
    }

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    const material = new THREE.MeshBasicMaterial({
        name: "BottleLabelMaterial",
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
    });

    material.userData = {
        texture,
        generatedBy: "SodaBottle",
        labelText: options.labelText,
        beverageType: options.beverageType,
    };

    return material;
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

function drawMiniFootballMark(ctx, x, y, radius, options) {
    ctx.save();

    ctx.strokeStyle = hexToRgba(options.labelAccent, 0.72);
    ctx.lineWidth = 8;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();

    for (let index = 0; index < 5; index += 1) {
        const angle = (index / 5) * Math.PI * 2;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
        ctx.stroke();
    }

    ctx.restore();
}

function drawPaperNoise(ctx, width, height) {
    ctx.save();

    for (let index = 0; index < 350; index += 1) {
        const alpha = Math.random() * 0.025;
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

function createLatheMesh({ name, points, segments = 96, material }) {
    const geometry = new THREE.LatheGeometry(points, segments);
    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;

    setMeshShadow(mesh, true, true);
    return mesh;
}

function createCylinderMesh({
    name,
    radiusTop,
    radiusBottom,
    height,
    radialSegments = 64,
    material,
    openEnded = false,
}) {
    const geometry = new THREE.CylinderGeometry(
        radiusTop,
        radiusBottom,
        height,
        radialSegments,
        1,
        openEnded,
    );

    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;

    setMeshShadow(mesh, true, true);
    return mesh;
}

function createBottleProfile(shape, options) {
    const body = shape.body;
    const halfHeight = body.height / 2;

    if (options.bottleShape === BOTTLE_SHAPES.CAN) {
        return [
            new THREE.Vector2(body.radiusBottom * 0.95, -halfHeight),
            new THREE.Vector2(body.radiusBottom, -halfHeight + 0.035),
            new THREE.Vector2(body.radiusMid, -halfHeight + 0.12),
            new THREE.Vector2(body.radiusMid, halfHeight - 0.12),
            new THREE.Vector2(body.radiusTop, halfHeight - 0.035),
            new THREE.Vector2(body.radiusTop * 0.95, halfHeight),
        ];
    }

    if (options.bottleShape === BOTTLE_SHAPES.WATER) {
        return [
            new THREE.Vector2(body.radiusBottom * 0.7, -halfHeight),
            new THREE.Vector2(body.radiusBottom * 0.96, -halfHeight + 0.08),
            new THREE.Vector2(body.radiusBottom, -halfHeight + 0.2),
            new THREE.Vector2(body.radiusMid * 0.98, -halfHeight + body.height * 0.5),
            new THREE.Vector2(body.radiusTop * 1.05, halfHeight - 0.25),
            new THREE.Vector2(body.radiusTop * 0.92, halfHeight),
        ];
    }

    if (options.bottleShape === BOTTLE_SHAPES.SPORT) {
        return [
            new THREE.Vector2(body.radiusBottom * 0.72, -halfHeight),
            new THREE.Vector2(body.radiusBottom, -halfHeight + 0.075),
            new THREE.Vector2(body.radiusMid * 0.9, -halfHeight + 0.3),
            new THREE.Vector2(body.radiusMid * 1.04, -halfHeight + body.height * 0.56),
            new THREE.Vector2(body.radiusTop * 1.02, halfHeight - 0.25),
            new THREE.Vector2(body.radiusTop * 0.9, halfHeight),
        ];
    }

    if (options.bottleShape === BOTTLE_SHAPES.SLIM) {
        return [
            new THREE.Vector2(body.radiusBottom * 0.82, -halfHeight),
            new THREE.Vector2(body.radiusBottom, -halfHeight + 0.065),
            new THREE.Vector2(body.radiusMid, -halfHeight + 0.25),
            new THREE.Vector2(body.radiusTop * 1.03, halfHeight - 0.15),
            new THREE.Vector2(body.radiusTop * 0.92, halfHeight),
        ];
    }

    return [
        new THREE.Vector2(body.radiusBottom * 0.78, -halfHeight),
        new THREE.Vector2(body.radiusBottom, -halfHeight + 0.075),
        new THREE.Vector2(body.radiusMid * 1.02, -halfHeight + 0.22),
        new THREE.Vector2(body.radiusMid, -halfHeight + body.height * 0.58),
        new THREE.Vector2(body.radiusTop * 1.08, halfHeight - 0.2),
        new THREE.Vector2(body.radiusTop * 0.94, halfHeight),
    ];
}

function createBottleBody(shape, materials, options) {
    const points = createBottleProfile(shape, options);

    const body = createLatheMesh({
        name: "SodaBottleBody",
        points,
        segments: 128,
        material: createBottlePlasticMaterial(materials, options),
    });

    body.visible = Boolean(options.showBottle);
    return body;
}

function createBottleBottom(shape, materials, options) {
    const bottom = shape.bottom;

    const mesh = createCylinderMesh({
        name: "SodaBottleBottomRing",
        radiusTop: bottom.radius * 0.94,
        radiusBottom: bottom.radius,
        height: bottom.height,
        radialSegments: 96,
        material: createBottlePlasticMaterial(materials, {
            ...options,
            bottleOpacity: Math.min(options.bottleOpacity + 0.08, 0.76),
        }),
    });

    mesh.position.y = -shape.body.height / 2 - bottom.height * 0.14;
    mesh.visible = Boolean(options.showBaseRing);

    return mesh;
}

function createBottleNeck(shape, materials, options) {
    if (options.bottleShape === BOTTLE_SHAPES.CAN) {
        return new THREE.Group();
    }

    const neck = shape.neck;

    const mesh = createCylinderMesh({
        name: "SodaBottleNeck",
        radiusTop: neck.radiusTop,
        radiusBottom: neck.radiusBottom,
        height: neck.height,
        radialSegments: 96,
        material: createBottlePlasticMaterial(materials, options),
    });

    mesh.position.y = shape.body.height / 2 + neck.height / 2 - 0.015;

    return mesh;
}

function createBottleCap(shape, materials, options) {
    const cap = shape.cap;

    const mesh = createCylinderMesh({
        name: "SodaBottleCap",
        radiusTop: cap.radius,
        radiusBottom: cap.radius,
        height: cap.height,
        radialSegments: 96,
        material: createCapMaterial(materials, options),
    });

    if (options.bottleShape === BOTTLE_SHAPES.CAN) {
        mesh.position.y = shape.body.height / 2 + cap.height / 2 - 0.01;
        return mesh;
    }

    mesh.position.y = shape.body.height / 2 + shape.neck.height + cap.height * 0.32;

    return mesh;
}

function createCanTopDetail(shape, materials, options) {
    const group = new THREE.Group();
    group.name = "CanTopDetail";

    if (options.bottleShape !== BOTTLE_SHAPES.CAN) {
        return group;
    }

    const topY = shape.body.height / 2 + 0.034;

    const material = createStandardMaterial({
        name: "CanPullTabMaterial",
        color: "#d9d3c4",
        roughness: 0.26,
        metalness: 0.55,
    });

    const groove = new THREE.Mesh(
        new THREE.TorusGeometry(shape.cap.radius * 0.72, 0.006, 8, 80),
        material,
    );

    groove.name = "CanTopGroove";
    groove.position.y = topY - 0.004;
    groove.rotation.x = Math.PI / 2;

    const tab = new THREE.Mesh(
        new THREE.TorusGeometry(0.07, 0.012, 10, 36),
        material.clone(),
    );

    tab.name = "CanPullTab";
    tab.position.set(0.04, topY + 0.004, 0.02);
    tab.rotation.x = Math.PI / 2;
    tab.scale.set(1.35, 0.72, 1);

    group.add(groove, tab);
    return group;
}

function createCapRidges(shape, materials, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleCapRidges";
    group.visible = Boolean(options.showCapRidges);

    if (options.bottleShape === BOTTLE_SHAPES.CAN) {
        return group;
    }

    const cap = shape.cap;
    const y = shape.body.height / 2 + shape.neck.height + cap.height * 0.32;
    const ridgeCount = options.bottleShape === BOTTLE_SHAPES.SPORT ? 28 : 22;
    const material = createCapMaterial(materials, options);

    for (let index = 0; index < ridgeCount; index += 1) {
        const angle = (index / ridgeCount) * Math.PI * 2;

        const ridge = createCylinderMesh({
            name: `CapRidge_${index + 1}`,
            radiusTop: 0.006,
            radiusBottom: 0.007,
            height: cap.height * 0.88,
            radialSegments: 8,
            material,
        });

        ridge.position.set(
            Math.cos(angle) * (cap.radius + 0.008),
            y,
            Math.sin(angle) * (cap.radius + 0.008),
        );

        ridge.rotation.z = Math.PI / 2;
        ridge.rotation.y = -angle;

        group.add(ridge);
    }

    return group;
}

function createSportNozzle(shape, materials, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleSportNozzle";

    if (options.bottleShape !== BOTTLE_SHAPES.SPORT) {
        return group;
    }

    const material = createCapMaterial(materials, {
        ...options,
        capColor: "#f7f7f7",
    });

    const baseY = shape.body.height / 2 + shape.neck.height + shape.cap.height + 0.026;

    const nozzle = createCylinderMesh({
        name: "SportNozzleBody",
        radiusTop: 0.082,
        radiusBottom: 0.112,
        height: 0.105,
        radialSegments: 56,
        material,
    });
    nozzle.position.y = baseY;

    const top = createCylinderMesh({
        name: "SportNozzleTop",
        radiusTop: 0.048,
        radiusBottom: 0.068,
        height: 0.072,
        radialSegments: 56,
        material: material.clone(),
    });
    top.position.y = baseY + 0.082;

    group.add(nozzle, top);
    return group;
}

function createGripGrooves(shape, materials, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleGripGrooves";
    group.visible = Boolean(options.showGripGrooves);

    if (![BOTTLE_SHAPES.WATER, BOTTLE_SHAPES.SPORT].includes(options.bottleShape)) {
        return group;
    }

    const material = createBottlePlasticMaterial(materials, {
        ...options,
        bottleOpacity: Math.max(options.bottleOpacity - 0.12, 0.2),
    });

    const grooveCount = options.bottleShape === BOTTLE_SHAPES.SPORT ? 5 : 4;

    for (let index = 0; index < grooveCount; index += 1) {
        const groove = new THREE.Mesh(
            new THREE.TorusGeometry(shape.body.radiusMid * 0.98, 0.008, 8, 96),
            material,
        );

        groove.name = `BottleGripGroove_${index + 1}`;
        groove.rotation.x = Math.PI / 2;
        groove.position.y = -shape.body.height * 0.24 + index * 0.15;

        setMeshShadow(groove, true, true);
        group.add(groove);
    }

    return group;
}

function createBottleLiquid(shape, materials, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleLiquidGroup";
    group.visible = Boolean(options.showLiquid && options.bottleShape !== BOTTLE_SHAPES.CAN);

    if (!group.visible) return group;

    const liquidHeight =
        options.renderMode === BOTTLE_RENDER_MODE.CLEAR_WATER
            ? shape.body.height * 0.72
            : shape.body.height * 0.68;

    const liquid = createCylinderMesh({
        name: "SodaBottleLiquid",
        radiusTop: shape.body.radiusTop * 0.86,
        radiusBottom: shape.body.radiusBottom * 0.86,
        height: liquidHeight,
        radialSegments: 96,
        material: createLiquidMaterial(materials, options),
    });

    liquid.position.y = -shape.body.height * 0.08;
    liquid.renderOrder = 1;

    const topSurface = new THREE.Mesh(
        new THREE.CircleGeometry(shape.body.radiusTop * 0.86, 96),
        liquid.material.clone(),
    );

    topSurface.name = "SodaLiquidTopSurface";
    topSurface.rotation.x = -Math.PI / 2;
    topSurface.position.y = liquid.position.y + liquidHeight / 2;
    topSurface.renderOrder = 2;
    topSurface.visible = Boolean(options.showLiquidLine);

    group.add(liquid, topSurface);
    return group;
}

function createBottleLabel(shape, options, textureSet) {
    const labelData = shape.label;
    const material = createLabelMaterial(options, textureSet);

    const label = new THREE.Mesh(
        new THREE.PlaneGeometry(labelData.width, labelData.height, 8, 1),
        material,
    );

    label.name = "SodaBottleLabel";
    label.position.set(0, labelData.y, labelData.z);
    label.renderOrder = options.renderOrder;
    label.visible = Boolean(options.showLabel);

    return label;
}

function createBottleBackLabel(shape, options, textureSet) {
    const labelData = shape.label;

    const material = createLabelMaterial(
        {
            ...options,
            labelText: options.shortLabel?.toUpperCase?.() ?? "KICK",
            subLabel: "KickOff Box",
            footerText: "Personalizado",
        },
        textureSet,
    );

    material.opacity = 0.82;
    material.transparent = true;

    const label = new THREE.Mesh(
        new THREE.PlaneGeometry(labelData.width * 0.82, labelData.height * 0.72, 8, 1),
        material,
    );

    label.name = "SodaBottleBackLabel";
    label.position.set(0, labelData.y - 0.012, -labelData.z);
    label.rotation.y = Math.PI;
    label.renderOrder = options.renderOrder;
    label.visible = Boolean(options.showBackLabel);

    return label;
}

function createBottleHighlights(shape, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleHighlights";
    group.visible = Boolean(options.showHighlights);

    const material = createBasicMaterial({
        name: "BottleHighlightMaterial",
        color: "#ffffff",
        transparent: true,
        opacity: options.highlightIntensity,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    const height = options.bottleShape === BOTTLE_SHAPES.CAN
        ? shape.body.height * 0.72
        : shape.body.height * 0.86;

    const main = new THREE.Mesh(
        new THREE.PlaneGeometry(0.052, height),
        material,
    );

    main.name = "BottleMainHighlight";
    main.position.set(-shape.body.radiusMid * 0.58, 0.03, shape.body.radiusMid + 0.012);
    main.rotation.z = -0.05;
    main.renderOrder = options.renderOrder + 1;

    const side = new THREE.Mesh(
        new THREE.PlaneGeometry(0.032, height * 0.42),
        material.clone(),
    );

    side.name = "BottleSideHighlight";
    side.material.opacity = options.highlightIntensity * 0.58;
    side.position.set(shape.body.radiusMid * 0.52, shape.body.height * 0.14, shape.body.radiusMid + 0.014);
    side.rotation.z = 0.08;
    side.renderOrder = options.renderOrder + 1;

    group.add(main, side);
    return group;
}

function createBubbles(shape, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleBubbles";
    group.visible = Boolean(options.showBubbles && options.bubbles && options.bottleShape !== BOTTLE_SHAPES.CAN);

    if (!group.visible) return group;

    const count = Math.max(0, Number(options.bubbleCount) || 0);
    const geometry = new THREE.SphereGeometry(0.018, 12, 8);
    const material = createBasicMaterial({
        name: "BottleBubbleMaterial",
        color: "#ffffff",
        transparent: true,
        opacity: 0.44,
        depthWrite: false,
    });

    const bubbles = new THREE.InstancedMesh(geometry, material, count);
    bubbles.name = "BottleBubbleInstances";

    const dummy = new THREE.Object3D();
    const random = createSeededRandom(2026);

    for (let index = 0; index < count; index += 1) {
        const angle = randomRange(random, 0, Math.PI * 2);
        const radius = randomRange(random, 0.04, shape.body.radiusMid * 0.72);
        const y = randomRange(random, -shape.body.height * 0.42, shape.body.height * 0.42);

        dummy.position.set(
            Math.cos(angle) * radius,
            y,
            Math.sin(angle) * radius,
        );

        const scale = randomRange(random, 0.45, 1.15);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();

        bubbles.setMatrixAt(index, dummy.matrix);
    }

    bubbles.instanceMatrix.needsUpdate = true;
    group.add(bubbles);

    return group;
}

function createCondensation(shape, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleCondensation";
    group.visible = Boolean(options.showCondensation && options.condensation && options.bottleShape !== BOTTLE_SHAPES.CAN);

    if (!group.visible) return group;

    const count = Math.max(0, Number(options.dropletCount) || 0);
    const geometry = new THREE.SphereGeometry(0.012, 10, 6);
    const material = createPhysicalMaterial({
        name: "BottleCondensationMaterial",
        color: "#ffffff",
        transparent: true,
        opacity: 0.42,
        transmission: 0.3,
        roughness: 0.05,
        clearcoat: 0.6,
        clearcoatRoughness: 0.04,
    });

    const droplets = new THREE.InstancedMesh(geometry, material, count);
    droplets.name = "BottleCondensationInstances";

    const dummy = new THREE.Object3D();
    const random = createSeededRandom(2027);

    for (let index = 0; index < count; index += 1) {
        const angle = randomRange(random, -Math.PI * 0.72, Math.PI * 0.72);
        const radius = shape.body.radiusMid + 0.016;
        const y = randomRange(random, -shape.body.height * 0.42, shape.body.height * 0.34);

        dummy.position.set(
            Math.sin(angle) * radius,
            y,
            Math.cos(angle) * radius,
        );

        const scale = randomRange(random, 0.5, 1.25);
        dummy.scale.set(scale * 0.72, scale, scale * 0.72);
        dummy.updateMatrix();

        droplets.setMatrixAt(index, dummy.matrix);
    }

    droplets.instanceMatrix.needsUpdate = true;
    group.add(droplets);

    return group;
}

function createPackingPad(shape, options) {
    const group = new THREE.Group();
    group.name = "SodaBottlePackingPad";
    group.visible = Boolean(options.showPackingPad);

    const material = createBasicMaterial({
        name: "BottlePackingPadMaterial",
        color: "#000000",
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
        depthWrite: false,
    });

    const pad = new THREE.Mesh(
        new THREE.PlaneGeometry(shape.totalHeight * 1.08, shape.body.radiusMid * 1.62),
        material,
    );

    pad.name = "BottleSoftContactPad";
    pad.rotation.x = -Math.PI / 2;
    pad.position.set(0, -shape.body.radiusMid - 0.018, 0);
    pad.renderOrder = -1;

    group.add(pad);
    return group;
}

function createSlotGuide(shape, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleSlotGuide";
    group.visible = Boolean(options.showSlotGuide);

    const material = createBasicMaterial({
        name: "BottleSlotGuideMaterial",
        color: options.labelAccent,
        transparent: true,
        opacity: 0.13,
        side: THREE.DoubleSide,
        depthWrite: false,
    });

    const guide = new THREE.Mesh(
        new THREE.PlaneGeometry(shape.totalHeight * 1.1, shape.body.radiusMid * 1.85),
        material,
    );

    guide.name = "BottleCompartmentGuide";
    guide.rotation.x = -Math.PI / 2;
    guide.position.set(0, -shape.body.radiusMid - 0.022, 0);
    guide.renderOrder = -2;

    group.add(guide);
    return group;
}

function applyBottleOrientation(group, options) {
    if (options.orientation === BOTTLE_ORIENTATION.HORIZONTAL) {
        group.rotation.z += Math.PI / 2;
        group.rotation.y += -0.05;
    }

    if (options.orientation === BOTTLE_ORIENTATION.DIAGONAL) {
        group.rotation.z += Math.PI / 2;
        group.rotation.y += -0.25;
        group.rotation.x += 0.04;
    }
}

function applyDefaultPlacement(group, config, options, shape) {
    const box = getBoxDimensions(config ?? {});
    const layout =
        config?.layout ??
        config?.transform ??
        config?.contentLayout?.sodaBottle ??
        config?.contentLayout?.beverage ??
        {};

    const defaultPosition = options.bottleShape === BOTTLE_SHAPES.CAN
        ? [0.62, box.floorHeight + 0.34, 0.38]
        : [0.58, box.floorHeight + 0.34, 0.34];

    const defaultRotation = [0, 0, 0];

    applyTransform(group, {
        position: layout.position ?? options.position ?? defaultPosition,
        rotation: layout.rotation ?? options.rotation ?? defaultRotation,
        scale: layout.scale ?? options.scale ?? DEFAULT_BOTTLE_OPTIONS.scale,
    });

    applyBottleOrientation(group, options);
}

function createMetadata(options, shape) {
    return {
        objectType: "SodaBottle",
        version: SODA_BOTTLE_VERSION,
        beverageType: options.beverageType,
        bottleShape: options.bottleShape,
        renderMode: options.renderMode,
        orientation: options.orientation,
        labelStyle: options.labelStyle,
        dimensions: {
            totalHeight: shape.totalHeight,
            bodyHeight: shape.body.height,
            bodyRadius: shape.body.radiusMid,
        },
        editable: true,
        draggable: true,
        rotatable: true,
        scalable: true,
        exportable: true,
        purpose: "realistic-horizontal-beverage-inside-gift-box",
        createdAt: new Date().toISOString(),
    };
}

export function createSodaBottle(config = {}, materials = {}, textureSet = {}, extraOptions = {}) {
    const options = normalizeBottleOptions({
        ...config,
        beverage: {
            ...(config?.beverage ?? {}),
            ...extraOptions,
        },
    });

    const shape = getShapePreset(options);

    const group = new THREE.Group();
    group.name = "KickOffBoxSodaBottle";
    group.userData = createMetadata(options, shape);
    group.userData.options = options;

    const packingPad = createPackingPad(shape, options);
    const slotGuide = createSlotGuide(shape, options);
    const body = createBottleBody(shape, materials, options);
    const liquid = createBottleLiquid(shape, materials, options);
    const bottom = createBottleBottom(shape, materials, options);
    const neck = createBottleNeck(shape, materials, options);
    const cap = createBottleCap(shape, materials, options);
    const capRidges = createCapRidges(shape, materials, options);
    const sportNozzle = createSportNozzle(shape, materials, options);
    const canTop = createCanTopDetail(shape, materials, options);
    const grooves = createGripGrooves(shape, materials, options);
    const label = createBottleLabel(shape, options, textureSet);
    const backLabel = createBottleBackLabel(shape, options, textureSet);
    const highlights = createBottleHighlights(shape, options);
    const bubbles = createBubbles(shape, options);
    const condensation = createCondensation(shape, options);

    group.add(
        slotGuide,
        packingPad,
        liquid,
        body,
        bottom,
        neck,
        cap,
        capRidges,
        sportNozzle,
        canTop,
        grooves,
        label,
        backLabel,
        highlights,
        bubbles,
        condensation,
    );

    group.userData.parts = {
        slotGuide: slotGuide.name,
        packingPad: packingPad.name,
        liquid: liquid.name,
        body: body.name,
        bottom: bottom.name,
        neck: neck.name,
        cap: cap.name,
        capRidges: capRidges.name,
        sportNozzle: sportNozzle.name,
        canTop: canTop.name,
        grooves: grooves.name,
        label: label.name,
        backLabel: backLabel.name,
        highlights: highlights.name,
        bubbles: bubbles.name,
        condensation: condensation.name,
    };

    applyDefaultPlacement(group, config, options, shape);
    setGroupShadow(group, true, true);

    return group;
}

export function createBeverageBottle(config = {}, materials = {}, textureSet = {}, extraOptions = {}) {
    return createSodaBottle(config, materials, textureSet, extraOptions);
}

export function updateSodaBottleAnimation(bottleGroup, elapsedTime = 0) {
    if (!bottleGroup) return;

    const bubbles = bottleGroup.getObjectByName("BottleBubbleInstances");
    const droplets = bottleGroup.getObjectByName("BottleCondensationInstances");
    const highlights = bottleGroup.getObjectByName("SodaBottleHighlights");
    const label = bottleGroup.getObjectByName("SodaBottleLabel");

    const options = bottleGroup.userData?.options ?? DEFAULT_BOTTLE_OPTIONS;

    if (bubbles) {
        bubbles.position.y = Math.sin(elapsedTime * options.carbonationSpeed) * 0.012;
        bubbles.rotation.y = Math.sin(elapsedTime * 0.35) * 0.018;
    }

    if (droplets) {
        droplets.rotation.y = Math.sin(elapsedTime * 0.18) * 0.012;
    }

    if (highlights) {
        highlights.children.forEach((child, index) => {
            if (child.material) {
                child.material.opacity = options.highlightIntensity * (0.72 + Math.sin(elapsedTime * 1.1 + index) * 0.12);
            }
        });
    }

    if (label) {
        label.position.z += Math.sin(elapsedTime * 0.5) * 0.00012;
    }
}

export function updateBottleLabel(bottleGroup, nextOptions = {}, textureSet = {}) {
    if (!bottleGroup) return null;

    const currentOptions = bottleGroup.userData?.options ?? DEFAULT_BOTTLE_OPTIONS;
    const options = normalizeBottleOptions({
        ...currentOptions,
        ...nextOptions,
    });

    const label = bottleGroup.getObjectByName("SodaBottleLabel");
    const backLabel = bottleGroup.getObjectByName("SodaBottleBackLabel");

    if (label?.material) {
        disposeMaterial(label.material);
        label.material = createLabelMaterial(options, textureSet);
    }

    if (backLabel?.material) {
        disposeMaterial(backLabel.material);
        backLabel.material = createLabelMaterial(
            {
                ...options,
                labelText: options.shortLabel?.toUpperCase?.() ?? "KICK",
                subLabel: "KickOff Box",
                footerText: "Personalizado",
            },
            textureSet,
        );
        backLabel.material.opacity = 0.82;
        backLabel.material.transparent = true;
    }

    bottleGroup.userData.options = options;
    bottleGroup.userData.updatedAt = new Date().toISOString();

    return bottleGroup;
}

export function setSodaBottleVisibility(bottleGroup, visible = true) {
    if (!bottleGroup) return;

    bottleGroup.visible = Boolean(visible);
    bottleGroup.userData.visible = Boolean(visible);
    bottleGroup.userData.updatedAt = new Date().toISOString();
}

export function setSodaBottlePartVisibility(bottleGroup, partName, visible = true) {
    if (!bottleGroup || !partName) return;

    const part = bottleGroup.getObjectByName(partName);
    if (!part) return;

    part.visible = Boolean(visible);
    bottleGroup.userData.updatedAt = new Date().toISOString();
}

export function setSodaBottleTransform(bottleGroup, { position, rotation, scale } = {}) {
    if (!bottleGroup) return;

    if (position) bottleGroup.position.set(position[0], position[1], position[2]);
    if (rotation) bottleGroup.rotation.set(rotation[0], rotation[1], rotation[2]);

    if (scale) {
        const values = Array.isArray(scale) ? scale : [scale, scale, scale];

        bottleGroup.scale.set(
            THREE.MathUtils.clamp(values[0], 0.28, 1.25),
            THREE.MathUtils.clamp(values[1], 0.28, 1.25),
            THREE.MathUtils.clamp(values[2], 0.28, 1.25),
        );
    }

    bottleGroup.userData.updatedAt = new Date().toISOString();
}

export function getSodaBottleParts(bottleGroup) {
    if (!bottleGroup) return {};

    return {
        slotGuide: bottleGroup.getObjectByName("SodaBottleSlotGuide"),
        packingPad: bottleGroup.getObjectByName("SodaBottlePackingPad"),
        liquid: bottleGroup.getObjectByName("SodaBottleLiquidGroup"),
        body: bottleGroup.getObjectByName("SodaBottleBody"),
        bottom: bottleGroup.getObjectByName("SodaBottleBottomRing"),
        neck: bottleGroup.getObjectByName("SodaBottleNeck"),
        cap: bottleGroup.getObjectByName("SodaBottleCap"),
        capRidges: bottleGroup.getObjectByName("SodaBottleCapRidges"),
        sportNozzle: bottleGroup.getObjectByName("SodaBottleSportNozzle"),
        canTop: bottleGroup.getObjectByName("CanTopDetail"),
        grooves: bottleGroup.getObjectByName("SodaBottleGripGrooves"),
        label: bottleGroup.getObjectByName("SodaBottleLabel"),
        backLabel: bottleGroup.getObjectByName("SodaBottleBackLabel"),
        highlights: bottleGroup.getObjectByName("SodaBottleHighlights"),
        bubbles: bottleGroup.getObjectByName("SodaBottleBubbles"),
        condensation: bottleGroup.getObjectByName("SodaBottleCondensation"),
    };
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

export function disposeSodaBottle(bottleGroup) {
    if (!bottleGroup) return;

    const disposedGeometries = new Set();
    const disposedMaterials = new Set();

    bottleGroup.traverse((object) => {
        if (object.geometry && !disposedGeometries.has(object.geometry)) {
            object.geometry.dispose();
            disposedGeometries.add(object.geometry);
        }

        if (object.material && !disposedMaterials.has(object.material)) {
            disposeMaterial(object.material);
            disposedMaterials.add(object.material);
        }
    });

    bottleGroup.removeFromParent();
}

export const SodaBottle = Object.freeze({
    version: SODA_BOTTLE_VERSION,
    orientation: BOTTLE_ORIENTATION,
    renderMode: BOTTLE_RENDER_MODE,
    shapes: BOTTLE_SHAPES,
    labelStyle: BOTTLE_LABEL_STYLE,

    createSodaBottle,
    createBeverageBottle,

    updateSodaBottleAnimation,
    updateBottleLabel,

    setSodaBottleVisibility,
    setSodaBottlePartVisibility,
    setSodaBottleTransform,

    getSodaBottleParts,
    disposeSodaBottle,
});
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import {
    applyTransform,
    getBoxDimensions,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

export const INTERNAL_DIVIDERS_VERSION = "3.0.0";

export const DIVIDER_LAYOUTS = Object.freeze({
    STANDARD: "standard",
    PREMIUM: "premium",
    DEFENSE: "defense",
    JURY: "jury",
    MINIMAL: "minimal",
    SHOWCASE: "showcase",
    HORIZONTAL_BEVERAGE: "horizontal-beverage",
});

export const DIVIDER_SLOT_KEYS = Object.freeze({
    BOTTLE: "bottle",
    CUPCAKE: "cupcake",
    CARD: "card",
    QR: "qr",
    KEYCHAIN: "keychain",
    ROSE: "rose",
    LOGO: "logo",
    GENERAL: "general",
});

export const DIVIDER_VISUAL_STYLES = Object.freeze({
    DARK_PREMIUM: "dark-premium",
    KRAFT: "kraft",
    CREAM_GOLD: "cream-gold",
    TRICOLOR: "tricolor",
    ACADEMIC_BLUE: "academic-blue",
    MINIMAL_BLACK: "minimal-black",
});

export const DIVIDER_SLOT_MODES = Object.freeze({
    OPEN: "open",
    PADDED: "padded",
    RAISED: "raised",
    CHANNEL: "channel",
    FLAT: "flat",
});

const DEFAULT_OPTIONS = Object.freeze({
    layout: DIVIDER_LAYOUTS.HORIZONTAL_BEVERAGE,
    visualStyle: DIVIDER_VISUAL_STYLES.DARK_PREMIUM,

    boxWidth: 2.75,
    boxDepth: 1.82,
    floorY: 0.18,

    wallHeight: 0.24,
    wallThickness: 0.045,
    dividerRadius: 0.018,
    dividerSegments: 4,

    slotBaseHeight: 0.018,
    slotGuideOpacity: 0.16,
    edgeOpacity: 0.56,

    showDividers: true,
    showEdges: true,
    showCaps: true,
    showSlotGuides: true,
    showSlotLabels: true,
    showCornerPadding: true,
    showProductPads: true,
    showBottleChannel: true,
    showBottleEndStops: true,
    showBottleSideFoam: true,
    showCardSleeve: true,
    showQrPocket: true,
    showKeychainPad: true,
    showCupcakeCup: true,
    showAssemblyMarks: true,
    showTricolorMicroRibbon: true,
    showMeasurementGuides: false,

    bottleChannelWidth: 1.3,
    bottleChannelDepth: 0.52,
    bottlePadHeight: 0.038,
    bottleSupportRadius: 0.075,

    labelLanguage: "es",
    labelScale: 1,

    opacity: 1,
    renderOrder: 6,
});

const STYLE_PALETTES = Object.freeze({
    [DIVIDER_VISUAL_STYLES.DARK_PREMIUM]: Object.freeze({
        divider: "#17110c",
        dividerSide: "#2b2118",
        interior: "#24190f",
        cap: "#c59a4a",
        edge: "#e9c678",
        guide: "#c59a4a",
        labelBg: "#fff7e8",
        labelText: "#2b2118",
        pad: "#3a2a18",
        foam: "#fff7e8",
        mark: "#e9c678",
        red: "#b92d2d",
        yellow: "#f0c84b",
        green: "#2f7d55",
        roughness: 0.78,
        metalness: 0.03,
    }),

    [DIVIDER_VISUAL_STYLES.KRAFT]: Object.freeze({
        divider: "#b9824f",
        dividerSide: "#8b5f35",
        interior: "#d8b37c",
        cap: "#8b5f35",
        edge: "#f0d8a8",
        guide: "#8b5f35",
        labelBg: "#fff7e8",
        labelText: "#3a2a18",
        pad: "#d8b37c",
        foam: "#f5e1bd",
        mark: "#8b5f35",
        red: "#b92d2d",
        yellow: "#f0c84b",
        green: "#2f7d55",
        roughness: 0.92,
        metalness: 0.01,
    }),

    [DIVIDER_VISUAL_STYLES.CREAM_GOLD]: Object.freeze({
        divider: "#fff7e8",
        dividerSide: "#e7dcc9",
        interior: "#f4efe5",
        cap: "#c59a4a",
        edge: "#8a682f",
        guide: "#c59a4a",
        labelBg: "#111111",
        labelText: "#fff7e8",
        pad: "#f3e0c5",
        foam: "#fffdf8",
        mark: "#c59a4a",
        red: "#b92d2d",
        yellow: "#f0c84b",
        green: "#2f7d55",
        roughness: 0.86,
        metalness: 0.02,
    }),

    [DIVIDER_VISUAL_STYLES.TRICOLOR]: Object.freeze({
        divider: "#14100b",
        dividerSide: "#2b2118",
        interior: "#21170f",
        cap: "#f0c84b",
        edge: "#fff7e8",
        guide: "#f0c84b",
        labelBg: "#fff7e8",
        labelText: "#2b2118",
        pad: "#2f7d55",
        foam: "#fff7e8",
        mark: "#b92d2d",
        red: "#b92d2d",
        yellow: "#f0c84b",
        green: "#2f7d55",
        roughness: 0.8,
        metalness: 0.03,
    }),

    [DIVIDER_VISUAL_STYLES.ACADEMIC_BLUE]: Object.freeze({
        divider: "#111827",
        dividerSide: "#1f2937",
        interior: "#172033",
        cap: "#2f86c7",
        edge: "#c59a4a",
        guide: "#2f86c7",
        labelBg: "#fff7e8",
        labelText: "#111827",
        pad: "#1f2937",
        foam: "#f8fbff",
        mark: "#c59a4a",
        red: "#b92d2d",
        yellow: "#c59a4a",
        green: "#2f7d55",
        roughness: 0.78,
        metalness: 0.04,
    }),

    [DIVIDER_VISUAL_STYLES.MINIMAL_BLACK]: Object.freeze({
        divider: "#111111",
        dividerSide: "#1a1a1a",
        interior: "#202020",
        cap: "#c59a4a",
        edge: "#c59a4a",
        guide: "#c59a4a",
        labelBg: "#fff7e8",
        labelText: "#111111",
        pad: "#262626",
        foam: "#f7f0e4",
        mark: "#c59a4a",
        red: "#7a1e1e",
        yellow: "#c59a4a",
        green: "#2f7d55",
        roughness: 0.82,
        metalness: 0.04,
    }),
});

const SLOT_LABELS_ES = Object.freeze({
    [DIVIDER_SLOT_KEYS.BOTTLE]: "Bebida",
    [DIVIDER_SLOT_KEYS.CUPCAKE]: "Dulce",
    [DIVIDER_SLOT_KEYS.CARD]: "Mensaje",
    [DIVIDER_SLOT_KEYS.QR]: "QR",
    [DIVIDER_SLOT_KEYS.KEYCHAIN]: "Souvenir",
    [DIVIDER_SLOT_KEYS.ROSE]: "Rosa",
    [DIVIDER_SLOT_KEYS.LOGO]: "Logo",
    [DIVIDER_SLOT_KEYS.GENERAL]: "Detalle",
});

function clamp(value, min, max) {
    return Math.min(Math.max(Number(value) || 0, min), max);
}

function cloneMaterial(material, fallback) {
    if (material?.clone) return material.clone();
    return fallback;
}

function getPalette(style) {
    return STYLE_PALETTES[style] ?? STYLE_PALETTES[DIVIDER_VISUAL_STYLES.DARK_PREMIUM];
}

function resolveDimensions(config = {}) {
    const source = config.sceneConfig ?? config;
    const fromUtility = getBoxDimensions?.(source) ?? {};

    const width =
        source.dimensions?.width ??
        source.dimensions?.boxWidth ??
        source.boxWidth ??
        fromUtility.width ??
        DEFAULT_OPTIONS.boxWidth;

    const depth =
        source.dimensions?.depth ??
        source.dimensions?.boxDepth ??
        source.boxDepth ??
        fromUtility.depth ??
        DEFAULT_OPTIONS.boxDepth;

    const floorY =
        source.dimensions?.floorHeight ??
        source.dimensions?.floorY ??
        source.floorY ??
        fromUtility.floorHeight ??
        DEFAULT_OPTIONS.floorY;

    return {
        width: Number(width) || DEFAULT_OPTIONS.boxWidth,
        depth: Number(depth) || DEFAULT_OPTIONS.boxDepth,
        floorY: Number(floorY) || DEFAULT_OPTIONS.floorY,
    };
}

function normalizeOptions(config = {}) {
    const source = config.internalDividers ?? config.dividersConfig ?? config;
    const sceneConfig = config.sceneConfig ?? {};
    const visual = config.visual ?? sceneConfig.visual ?? {};
    const product = config.product ?? sceneConfig.product ?? {};
    const dimensions = resolveDimensions(config);

    const visualStyle =
        source.visualStyle ??
        visual.dividerStyle ??
        product.dividerStyle ??
        DEFAULT_OPTIONS.visualStyle;

    return {
        ...DEFAULT_OPTIONS,
        ...source,
        boxWidth: dimensions.width,
        boxDepth: dimensions.depth,
        floorY: dimensions.floorY,
        visualStyle,
        layout:
            source.layout ??
            sceneConfig.templateId ??
            product.templateId ??
            DEFAULT_OPTIONS.layout,
    };
}

function createMaterialSet(configMaterials = {}, options = {}) {
    const palette = getPalette(options.visualStyle);

    const dividerFallback = new THREE.MeshStandardMaterial({
        name: "InternalDividerMaterial",
        color: palette.divider,
        roughness: palette.roughness,
        metalness: palette.metalness,
        transparent: options.opacity < 1,
        opacity: options.opacity,
    });

    const dividerSideFallback = new THREE.MeshStandardMaterial({
        name: "InternalDividerSideMaterial",
        color: palette.dividerSide,
        roughness: palette.roughness,
        metalness: palette.metalness,
        transparent: options.opacity < 1,
        opacity: options.opacity,
    });

    const capFallback = new THREE.MeshStandardMaterial({
        name: "InternalDividerCapMaterial",
        color: palette.cap,
        roughness: 0.54,
        metalness: 0.16,
    });

    const padFallback = new THREE.MeshStandardMaterial({
        name: "InternalDividerPadMaterial",
        color: palette.pad,
        roughness: 0.84,
        metalness: 0.02,
    });

    const foamFallback = new THREE.MeshStandardMaterial({
        name: "InternalDividerFoamMaterial",
        color: palette.foam,
        roughness: 0.92,
        metalness: 0,
        transparent: true,
        opacity: 0.86,
    });

    const guideFallback = new THREE.MeshBasicMaterial({
        name: "InternalDividerGuideMaterial",
        color: palette.guide,
        transparent: true,
        opacity: options.slotGuideOpacity,
        depthWrite: false,
        side: THREE.DoubleSide,
    });

    const markFallback = new THREE.MeshBasicMaterial({
        name: "InternalDividerAssemblyMarkMaterial",
        color: palette.mark,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        side: THREE.DoubleSide,
    });

    const ribbonMaterials = {
        red: new THREE.MeshStandardMaterial({
            name: "DividerRibbonRedMaterial",
            color: palette.red,
            roughness: 0.5,
            metalness: 0.04,
        }),
        yellow: new THREE.MeshStandardMaterial({
            name: "DividerRibbonYellowMaterial",
            color: palette.yellow,
            roughness: 0.42,
            metalness: 0.08,
        }),
        green: new THREE.MeshStandardMaterial({
            name: "DividerRibbonGreenMaterial",
            color: palette.green,
            roughness: 0.52,
            metalness: 0.04,
        }),
    };

    return {
        divider: cloneMaterial(configMaterials.darkCardboard, dividerFallback),
        dividerSide: cloneMaterial(configMaterials.boxInterior, dividerSideFallback),
        cap: cloneMaterial(configMaterials.gold, capFallback),
        pad: cloneMaterial(configMaterials.boxInterior, padFallback),
        foam: foamFallback,
        guide: cloneMaterial(configMaterials.transparentHelper, guideFallback),
        mark: markFallback,
        ribbon: ribbonMaterials,
        edge: new THREE.LineBasicMaterial({
            name: "InternalDividerEdgeMaterial",
            color: palette.edge,
            transparent: true,
            opacity: options.edgeOpacity,
        }),
        label: {
            background: palette.labelBg,
            text: palette.labelText,
            accent: palette.cap,
            ribbon: {
                red: palette.red,
                yellow: palette.yellow,
                green: palette.green,
            },
        },
        local: [
            dividerFallback,
            dividerSideFallback,
            capFallback,
            padFallback,
            foamFallback,
            guideFallback,
            markFallback,
            ribbonMaterials.red,
            ribbonMaterials.yellow,
            ribbonMaterials.green,
        ],
    };
}

function createRoundedMesh({
    name,
    size,
    position,
    rotation = [0, 0, 0],
    material,
    radius = 0.018,
    segments = 4,
    userData = {},
}) {
    const [width, height, depth] = size;
    const safeRadius = Math.min(
        radius,
        Math.abs(width) / 2,
        Math.abs(height) / 2,
        Math.abs(depth) / 2,
    );

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
        generatedBy: "InternalDividers",
        version: INTERNAL_DIVIDERS_VERSION,
        ...userData,
    };

    setMeshShadow(mesh, true, true);

    return mesh;
}

function createDividerEdge(mesh, material, options = {}) {
    const edgesGeometry = new THREE.EdgesGeometry(mesh.geometry, 25);
    const edges = new THREE.LineSegments(edgesGeometry, material);

    edges.name = `${mesh.name}_Edges`;
    edges.position.copy(mesh.position);
    edges.rotation.copy(mesh.rotation);
    edges.scale.copy(mesh.scale);
    edges.visible = options.showEdges !== false;
    edges.renderOrder = options.renderOrder + 1;

    edges.userData = {
        generatedBy: "InternalDividers",
        parentMesh: mesh.name,
        type: "divider-edge",
    };

    return edges;
}

function roundRect(ctx, x, y, width, height, radius) {
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

function createCanvasLabelTexture(text, materials, options = {}) {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 220;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, materials.label.background);
    gradient.addColorStop(1, "#ffffff");

    ctx.fillStyle = gradient;
    roundRect(ctx, 16, 16, canvas.width - 32, canvas.height - 32, 34);
    ctx.fill();

    ctx.strokeStyle = materials.label.accent;
    ctx.lineWidth = 10;
    roundRect(ctx, 16, 16, canvas.width - 32, canvas.height - 32, 34);
    ctx.stroke();

    const bandY = 22;
    const bandH = 12;

    ctx.fillStyle = materials.label.ribbon.red;
    ctx.fillRect(60, bandY, canvas.width - 120, bandH);

    ctx.fillStyle = materials.label.ribbon.yellow;
    ctx.fillRect(60, bandY + bandH, canvas.width - 120, bandH);

    ctx.fillStyle = materials.label.ribbon.green;
    ctx.fillRect(60, bandY + bandH * 2, canvas.width - 120, bandH);

    ctx.fillStyle = materials.label.text;
    ctx.font = "900 54px Arial, Helvetica, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 12);

    ctx.fillStyle = materials.label.accent;
    ctx.font = "800 22px Arial, Helvetica, sans-serif";
    ctx.fillText("KICKOFF BOX", canvas.width / 2, canvas.height - 38);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    texture.userData = {
        generatedBy: "InternalDividers",
        label: text,
        createdAt: new Date().toISOString(),
    };

    return texture;
}

function createSlotLabel({
    slotKey,
    text,
    position,
    rotation = [-Math.PI / 2, 0, 0],
    width = 0.42,
    height = 0.12,
}, materials, options) {
    const texture = createCanvasLabelTexture(text, materials, options);

    const material = new THREE.MeshBasicMaterial({
        name: `${slotKey}_SlotLabelMaterial`,
        map: texture,
        transparent: true,
        opacity: 0.94,
        side: THREE.DoubleSide,
        depthWrite: false,
    });

    const label = new THREE.Mesh(
        new THREE.PlaneGeometry(width * options.labelScale, height * options.labelScale),
        material,
    );

    label.name = `SlotLabel_${slotKey}`;
    label.position.set(position[0], position[1], position[2]);
    label.rotation.set(rotation[0], rotation[1], rotation[2]);
    label.renderOrder = options.renderOrder + 6;
    label.userData = {
        slotKey,
        type: "slot-label",
        generatedBy: "InternalDividers",
    };

    return label;
}

function getDefaultSlotLayout(options) {
    const halfW = options.boxWidth / 2;
    const halfD = options.boxDepth / 2;
    const margin = 0.15;
    const wall = options.wallThickness;

    const usableW = options.boxWidth - margin * 2;
    const usableD = options.boxDepth - margin * 2;

    const leftW = usableW * 0.31;
    const rightW = usableW * 0.29;
    const middleW = usableW - leftW - rightW - wall * 2;

    const leftX = -halfW + margin + leftW / 2;
    const middleX = -halfW + margin + leftW + wall + middleW / 2;
    const rightX = halfW - margin - rightW / 2;

    const backZ = -halfD + margin;
    const frontZ = halfD - margin;

    const bottleDepth = clamp(options.bottleChannelDepth, 0.42, usableD * 0.44);
    const bottleWidth = clamp(options.bottleChannelWidth, 0.94, usableW * 0.62);

    const bottleX = middleX + middleW * 0.12;
    const bottleZ = frontZ - bottleDepth / 2;

    const cardDepth = usableD * 0.44;
    const cupcakeDepth = usableD * 0.34;
    const qrDepth = usableD * 0.3;
    const accessoryDepth = usableD * 0.24;
    const roseDepth = usableD * 0.26;

    return {
        bounds: {
            halfW,
            halfD,
            margin,
            wall,
            usableW,
            usableD,
            leftW,
            middleW,
            rightW,
            leftX,
            middleX,
            rightX,
            backZ,
            frontZ,
            bottleX,
            bottleZ,
            bottleWidth,
            bottleDepth,
        },

        slots: [
            {
                key: DIVIDER_SLOT_KEYS.CARD,
                label: SLOT_LABELS_ES[DIVIDER_SLOT_KEYS.CARD],
                x: leftX,
                z: backZ + cardDepth / 2,
                width: leftW,
                depth: cardDepth,
                mode: DIVIDER_SLOT_MODES.FLAT,
                role: "flat-card-message",
            },
            {
                key: DIVIDER_SLOT_KEYS.CUPCAKE,
                label: SLOT_LABELS_ES[DIVIDER_SLOT_KEYS.CUPCAKE],
                x: leftX,
                z: frontZ - cupcakeDepth / 2,
                width: leftW,
                depth: cupcakeDepth,
                mode: DIVIDER_SLOT_MODES.RAISED,
                role: "sweet-detail",
            },
            {
                key: DIVIDER_SLOT_KEYS.BOTTLE,
                label: SLOT_LABELS_ES[DIVIDER_SLOT_KEYS.BOTTLE],
                x: bottleX,
                z: bottleZ,
                width: bottleWidth,
                depth: bottleDepth,
                mode: DIVIDER_SLOT_MODES.CHANNEL,
                role: "horizontal-bottle-channel",
            },
            {
                key: DIVIDER_SLOT_KEYS.QR,
                label: SLOT_LABELS_ES[DIVIDER_SLOT_KEYS.QR],
                x: rightX,
                z: backZ + qrDepth / 2,
                width: rightW,
                depth: qrDepth,
                mode: DIVIDER_SLOT_MODES.FLAT,
                role: "qr-card",
            },
            {
                key: DIVIDER_SLOT_KEYS.KEYCHAIN,
                label: SLOT_LABELS_ES[DIVIDER_SLOT_KEYS.KEYCHAIN],
                x: rightX,
                z: backZ + qrDepth + accessoryDepth / 2 + wall,
                width: rightW,
                depth: accessoryDepth,
                mode: DIVIDER_SLOT_MODES.PADDED,
                role: "resin-keychain",
            },
            {
                key: DIVIDER_SLOT_KEYS.ROSE,
                label: SLOT_LABELS_ES[DIVIDER_SLOT_KEYS.ROSE],
                x: rightX,
                z: frontZ - roseDepth / 2,
                width: rightW,
                depth: roseDepth,
                mode: DIVIDER_SLOT_MODES.PADDED,
                role: "decorative-rose",
            },
        ],
    };
}

function createDividerBlueprints(options) {
    const layout = getDefaultSlotLayout(options);
    const b = layout.bounds;
    const y = options.floorY + options.wallHeight / 2 + 0.018;

    const leftSeparatorX = b.leftX + b.leftW / 2 + options.wallThickness / 2;
    const rightSeparatorX = b.rightX - b.rightW / 2 - options.wallThickness / 2;

    const bottleBackZ = b.bottleZ - b.bottleDepth / 2 - options.wallThickness / 2;
    const bottleFrontZ = b.bottleZ + b.bottleDepth / 2 + options.wallThickness / 2;

    const dividers = [
        {
            name: "Divider_LeftColumn",
            size: [options.wallThickness, options.wallHeight, options.boxDepth - b.margin * 2],
            position: [leftSeparatorX, y, 0],
            axis: "z",
            role: "left-column-separator",
        },
        {
            name: "Divider_RightColumn",
            size: [options.wallThickness, options.wallHeight, options.boxDepth - b.margin * 2],
            position: [rightSeparatorX, y, 0],
            axis: "z",
            role: "right-column-separator",
        },
        {
            name: "Divider_LeftHorizontal",
            size: [b.leftW, options.wallHeight * 0.92, options.wallThickness],
            position: [b.leftX, y, -0.05],
            axis: "x",
            role: "card-cupcake-separator",
        },
        {
            name: "Divider_RightTop",
            size: [b.rightW, options.wallHeight * 0.88, options.wallThickness],
            position: [b.rightX, y, -0.24],
            axis: "x",
            role: "qr-accessory-separator",
        },
        {
            name: "Divider_RightBottom",
            size: [b.rightW, options.wallHeight * 0.88, options.wallThickness],
            position: [b.rightX, y, 0.18],
            axis: "x",
            role: "keychain-rose-separator",
        },
    ];

    if ([
        DIVIDER_LAYOUTS.SHOWCASE,
        DIVIDER_LAYOUTS.PREMIUM,
        DIVIDER_LAYOUTS.DEFENSE,
        DIVIDER_LAYOUTS.HORIZONTAL_BEVERAGE,
    ].includes(options.layout)) {
        dividers.push(
            {
                name: "Divider_BottleBackRail",
                size: [b.bottleWidth, options.wallHeight * 0.58, options.wallThickness],
                position: [b.bottleX, y - options.wallHeight * 0.12, bottleBackZ],
                axis: "x",
                role: "bottle-back-rail",
            },
            {
                name: "Divider_BottleFrontRail",
                size: [b.bottleWidth, options.wallHeight * 0.58, options.wallThickness],
                position: [b.bottleX, y - options.wallHeight * 0.12, bottleFrontZ],
                axis: "x",
                role: "bottle-front-rail",
            },
            {
                name: "Divider_BottleLeftStop",
                size: [options.wallThickness, options.wallHeight * 0.5, b.bottleDepth],
                position: [b.bottleX - b.bottleWidth / 2, y - options.wallHeight * 0.15, b.bottleZ],
                axis: "z",
                role: "bottle-left-stop",
            },
            {
                name: "Divider_BottleRightStop",
                size: [options.wallThickness, options.wallHeight * 0.5, b.bottleDepth],
                position: [b.bottleX + b.bottleWidth / 2, y - options.wallHeight * 0.15, b.bottleZ],
                axis: "z",
                role: "bottle-right-stop",
            },
        );
    }

    if (options.layout === DIVIDER_LAYOUTS.MINIMAL) {
        return dividers.slice(0, 2);
    }

    return dividers;
}

function createDividerGroup(options, materials) {
    const group = new THREE.Group();
    group.name = "DividerMeshes";
    group.visible = Boolean(options.showDividers);

    const edgeGroup = new THREE.Group();
    edgeGroup.name = "DividerEdges";
    edgeGroup.visible = Boolean(options.showEdges);

    const capGroup = new THREE.Group();
    capGroup.name = "DividerCaps";
    capGroup.visible = Boolean(options.showCaps);

    const dividers = options.customDividers ?? createDividerBlueprints(options);

    dividers.forEach((divider, index) => {
        const dividerMaterial =
            divider.role?.includes("bottle")
                ? materials.dividerSide.clone()
                : materials.divider.clone();

        const mesh = createRoundedMesh({
            name: divider.name ?? `InternalDivider_${index + 1}`,
            size: divider.size,
            position: divider.position,
            material: dividerMaterial,
            radius: options.dividerRadius,
            segments: options.dividerSegments,
            userData: {
                type: "physical-divider",
                role: divider.role,
                axis: divider.axis,
            },
        });

        group.add(mesh);
        edgeGroup.add(createDividerEdge(mesh, materials.edge, options));

        const [width, height, depth] = divider.size;
        const [x, y, z] = divider.position;

        const cap = createRoundedMesh({
            name: `${mesh.name}_TopCap`,
            size: [
                width + 0.018,
                Math.min(0.028, options.wallHeight * 0.16),
                depth + 0.018,
            ],
            position: [x, y + height / 2 + 0.018, z],
            material: materials.cap.clone(),
            radius: Math.min(options.dividerRadius, 0.016),
            segments: 3,
            userData: {
                type: "divider-cap",
                parent: mesh.name,
            },
        });

        capGroup.add(cap);
    });

    return {
        dividers: group,
        edges: edgeGroup,
        caps: capGroup,
    };
}

function createSlotGuide(slot, options, materials) {
    const guide = createRoundedMesh({
        name: `SlotGuide_${slot.key}`,
        size: [
            Math.max(slot.width - 0.035, 0.08),
            options.slotBaseHeight,
            Math.max(slot.depth - 0.035, 0.08),
        ],
        position: [
            slot.x,
            options.floorY + options.slotBaseHeight / 2 + 0.012,
            slot.z,
        ],
        material: materials.guide.clone(),
        radius: 0.035,
        segments: 4,
        userData: {
            type: "slot-guide",
            slotKey: slot.key,
            role: slot.role,
            mode: slot.mode,
        },
    });

    guide.visible = Boolean(options.showSlotGuides);
    return guide;
}

function createSlotGuides(options, materials) {
    const group = new THREE.Group();
    group.name = "InteriorSlotGuides";
    group.visible = Boolean(options.showSlotGuides);

    const { slots } = getDefaultSlotLayout(options);

    slots.forEach((slot) => {
        group.add(createSlotGuide(slot, options, materials));
    });

    return group;
}

function createSlotLabels(options, materials) {
    const group = new THREE.Group();
    group.name = "InteriorSlotLabels";
    group.visible = Boolean(options.showSlotLabels);

    const { slots } = getDefaultSlotLayout(options);
    const labelY = options.floorY + options.slotBaseHeight + 0.038;

    slots.forEach((slot) => {
        const labelWidth = clamp(slot.width * 0.48, 0.26, 0.56);
        const labelHeight = 0.105;

        const label = createSlotLabel(
            {
                slotKey: slot.key,
                text: slot.label,
                position: [
                    slot.x,
                    labelY,
                    slot.z + slot.depth * 0.27,
                ],
                width: labelWidth,
                height: labelHeight,
            },
            materials,
            options,
        );

        group.add(label);
    });

    return group;
}

function createCornerPadding(options, materials) {
    const group = new THREE.Group();
    group.name = "InteriorCornerPadding";
    group.visible = Boolean(options.showCornerPadding);

    const halfW = options.boxWidth / 2;
    const halfD = options.boxDepth / 2;
    const y = options.floorY + 0.045;

    const positions = [
        [-halfW + 0.18, y, -halfD + 0.18],
        [halfW - 0.18, y, -halfD + 0.18],
        [-halfW + 0.18, y, halfD - 0.18],
        [halfW - 0.18, y, halfD - 0.18],
    ];

    positions.forEach((position, index) => {
        const pad = createRoundedMesh({
            name: `CornerPadding_${index + 1}`,
            size: [0.18, 0.075, 0.18],
            position,
            material: materials.foam.clone(),
            radius: 0.035,
            segments: 4,
            userData: {
                type: "corner-padding",
                role: "shock-absorber",
            },
        });

        group.add(pad);
    });

    return group;
}

function createProductPads(options, materials) {
    const group = new THREE.Group();
    group.name = "InteriorProductPads";
    group.visible = Boolean(options.showProductPads);

    const { slots } = getDefaultSlotLayout(options);

    slots.forEach((slot) => {
        if (slot.key === DIVIDER_SLOT_KEYS.BOTTLE) return;

        const isFlat =
            slot.key === DIVIDER_SLOT_KEYS.CARD ||
            slot.key === DIVIDER_SLOT_KEYS.QR;

        const pad = createRoundedMesh({
            name: `ProductPad_${slot.key}`,
            size: [
                clamp(slot.width * (isFlat ? 0.72 : 0.58), 0.22, 0.52),
                isFlat ? 0.018 : 0.035,
                clamp(slot.depth * (isFlat ? 0.62 : 0.46), 0.16, 0.38),
            ],
            position: [
                slot.x,
                options.floorY + (isFlat ? 0.026 : 0.045),
                slot.z,
            ],
            material: isFlat ? materials.guide.clone() : materials.pad.clone(),
            radius: 0.025,
            segments: 4,
            userData: {
                type: "product-pad",
                slotKey: slot.key,
                role: "visual-product-support",
            },
        });

        group.add(pad);
    });

    return group;
}

function createBottleChannel(options, materials) {
    const group = new THREE.Group();
    group.name = "BottleHorizontalChannel";
    group.visible = Boolean(options.showBottleChannel);

    const { slots } = getDefaultSlotLayout(options);
    const bottleSlot = slots.find((slot) => slot.key === DIVIDER_SLOT_KEYS.BOTTLE);

    if (!bottleSlot) return group;

    const y = options.floorY + options.bottlePadHeight / 2 + 0.034;

    const softBed = createRoundedMesh({
        name: "BottleChannel_SoftBed",
        size: [
            bottleSlot.width * 0.9,
            0.016,
            bottleSlot.depth * 0.86,
        ],
        position: [
            bottleSlot.x,
            options.floorY + 0.024,
            bottleSlot.z,
        ],
        material: materials.guide.clone(),
        radius: 0.04,
        segments: 4,
        userData: {
            type: "bottle-channel-bed",
            role: "soft-guide",
            slotKey: DIVIDER_SLOT_KEYS.BOTTLE,
        },
    });

    softBed.material.opacity = Math.min(options.slotGuideOpacity + 0.08, 0.32);

    const topFoam = createRoundedMesh({
        name: "BottleChannel_BackFoam",
        size: [
            bottleSlot.width * 0.92,
            options.bottlePadHeight,
            0.065,
        ],
        position: [
            bottleSlot.x,
            y,
            bottleSlot.z - bottleSlot.depth * 0.38,
        ],
        material: materials.foam.clone(),
        radius: 0.025,
        segments: 4,
        userData: {
            type: "bottle-support-foam",
            side: "back",
            slotKey: DIVIDER_SLOT_KEYS.BOTTLE,
        },
    });

    const bottomFoam = createRoundedMesh({
        name: "BottleChannel_FrontFoam",
        size: [
            bottleSlot.width * 0.92,
            options.bottlePadHeight,
            0.065,
        ],
        position: [
            bottleSlot.x,
            y,
            bottleSlot.z + bottleSlot.depth * 0.38,
        ],
        material: materials.foam.clone(),
        radius: 0.025,
        segments: 4,
        userData: {
            type: "bottle-support-foam",
            side: "front",
            slotKey: DIVIDER_SLOT_KEYS.BOTTLE,
        },
    });

    group.add(softBed, topFoam, bottomFoam);

    if (options.showBottleSideFoam) {
        const leftFoam = createRoundedMesh({
            name: "BottleChannel_LeftFoamStop",
            size: [
                0.07,
                options.bottlePadHeight * 1.2,
                bottleSlot.depth * 0.72,
            ],
            position: [
                bottleSlot.x - bottleSlot.width * 0.45,
                y + 0.004,
                bottleSlot.z,
            ],
            material: materials.foam.clone(),
            radius: 0.025,
            segments: 4,
            userData: {
                type: "bottle-side-foam",
                side: "left",
                slotKey: DIVIDER_SLOT_KEYS.BOTTLE,
            },
        });

        const rightFoam = createRoundedMesh({
            name: "BottleChannel_RightFoamStop",
            size: [
                0.07,
                options.bottlePadHeight * 1.2,
                bottleSlot.depth * 0.72,
            ],
            position: [
                bottleSlot.x + bottleSlot.width * 0.45,
                y + 0.004,
                bottleSlot.z,
            ],
            material: materials.foam.clone(),
            radius: 0.025,
            segments: 4,
            userData: {
                type: "bottle-side-foam",
                side: "right",
                slotKey: DIVIDER_SLOT_KEYS.BOTTLE,
            },
        });

        group.add(leftFoam, rightFoam);
    }

    if (options.showBottleEndStops) {
        const stopperMaterial = materials.cap.clone();

        const leftStop = createRoundedMesh({
            name: "BottleChannel_LeftEndStop",
            size: [
                0.06,
                0.09,
                bottleSlot.depth * 0.42,
            ],
            position: [
                bottleSlot.x - bottleSlot.width * 0.5 + 0.035,
                options.floorY + 0.072,
                bottleSlot.z,
            ],
            material: stopperMaterial,
            radius: 0.018,
            segments: 4,
            userData: {
                type: "bottle-end-stop",
                side: "left",
            },
        });

        const rightStop = createRoundedMesh({
            name: "BottleChannel_RightEndStop",
            size: [
                0.06,
                0.09,
                bottleSlot.depth * 0.42,
            ],
            position: [
                bottleSlot.x + bottleSlot.width * 0.5 - 0.035,
                options.floorY + 0.072,
                bottleSlot.z,
            ],
            material: stopperMaterial.clone(),
            radius: 0.018,
            segments: 4,
            userData: {
                type: "bottle-end-stop",
                side: "right",
            },
        });

        group.add(leftStop, rightStop);
    }

    return group;
}

function createCardSleeve(options, materials) {
    const group = new THREE.Group();
    group.name = "CardFlatSleeve";
    group.visible = Boolean(options.showCardSleeve);

    const { slots } = getDefaultSlotLayout(options);
    const cardSlot = slots.find((slot) => slot.key === DIVIDER_SLOT_KEYS.CARD);

    if (!cardSlot) return group;

    const y = options.floorY + 0.052;

    const sleeveBase = createRoundedMesh({
        name: "CardSleeveBase",
        size: [cardSlot.width * 0.78, 0.018, cardSlot.depth * 0.62],
        position: [cardSlot.x, options.floorY + 0.026, cardSlot.z],
        material: materials.guide.clone(),
        radius: 0.028,
        segments: 4,
        userData: {
            type: "card-sleeve-base",
            slotKey: DIVIDER_SLOT_KEYS.CARD,
        },
    });

    const bottomLip = createRoundedMesh({
        name: "CardSleeveBottomLip",
        size: [cardSlot.width * 0.72, 0.038, 0.035],
        position: [cardSlot.x, y, cardSlot.z + cardSlot.depth * 0.29],
        material: materials.foam.clone(),
        radius: 0.014,
        segments: 3,
        userData: {
            type: "card-sleeve-lip",
            slotKey: DIVIDER_SLOT_KEYS.CARD,
        },
    });

    group.add(sleeveBase, bottomLip);

    return group;
}

function createQrPocket(options, materials) {
    const group = new THREE.Group();
    group.name = "QrCardPocket";
    group.visible = Boolean(options.showQrPocket);

    const { slots } = getDefaultSlotLayout(options);
    const qrSlot = slots.find((slot) => slot.key === DIVIDER_SLOT_KEYS.QR);

    if (!qrSlot) return group;

    const y = options.floorY + 0.052;

    const base = createRoundedMesh({
        name: "QrPocketBase",
        size: [qrSlot.width * 0.68, 0.018, qrSlot.depth * 0.62],
        position: [qrSlot.x, options.floorY + 0.026, qrSlot.z],
        material: materials.guide.clone(),
        radius: 0.026,
        segments: 4,
        userData: {
            type: "qr-pocket-base",
            slotKey: DIVIDER_SLOT_KEYS.QR,
        },
    });

    const pocketLip = createRoundedMesh({
        name: "QrPocketLip",
        size: [qrSlot.width * 0.62, 0.036, 0.034],
        position: [qrSlot.x, y, qrSlot.z + qrSlot.depth * 0.27],
        material: materials.foam.clone(),
        radius: 0.014,
        segments: 3,
        userData: {
            type: "qr-pocket-lip",
            slotKey: DIVIDER_SLOT_KEYS.QR,
        },
    });

    group.add(base, pocketLip);

    return group;
}

function createKeychainPad(options, materials) {
    const group = new THREE.Group();
    group.name = "KeychainResinPad";
    group.visible = Boolean(options.showKeychainPad);

    const { slots } = getDefaultSlotLayout(options);
    const slot = slots.find((item) => item.key === DIVIDER_SLOT_KEYS.KEYCHAIN);

    if (!slot) return group;

    const pad = createRoundedMesh({
        name: "KeychainSoftOvalPad",
        size: [slot.width * 0.58, 0.034, slot.depth * 0.54],
        position: [slot.x, options.floorY + 0.047, slot.z],
        material: materials.foam.clone(),
        radius: 0.045,
        segments: 6,
        userData: {
            type: "keychain-soft-pad",
            slotKey: DIVIDER_SLOT_KEYS.KEYCHAIN,
        },
    });

    const ringGuide = new THREE.Mesh(
        new THREE.TorusGeometry(0.095, 0.008, 8, 48),
        materials.cap.clone(),
    );

    ringGuide.name = "KeychainRingGuide";
    ringGuide.rotation.x = Math.PI / 2;
    ringGuide.position.set(slot.x + slot.width * 0.14, options.floorY + 0.074, slot.z - slot.depth * 0.08);
    ringGuide.userData = {
        type: "keychain-ring-guide",
        slotKey: DIVIDER_SLOT_KEYS.KEYCHAIN,
    };

    group.add(pad, ringGuide);

    return group;
}

function createCupcakeCup(options, materials) {
    const group = new THREE.Group();
    group.name = "CupcakeProtectiveCup";
    group.visible = Boolean(options.showCupcakeCup);

    const { slots } = getDefaultSlotLayout(options);
    const slot = slots.find((item) => item.key === DIVIDER_SLOT_KEYS.CUPCAKE);

    if (!slot) return group;

    const cupMaterial = materials.foam.clone();
    cupMaterial.opacity = 0.72;
    cupMaterial.transparent = true;

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.18, 0.018, 12, 64),
        cupMaterial,
    );

    ring.name = "CupcakeCupRing";
    ring.rotation.x = Math.PI / 2;
    ring.position.set(slot.x, options.floorY + 0.065, slot.z);

    const base = createRoundedMesh({
        name: "CupcakeCupBase",
        size: [0.34, 0.024, 0.34],
        position: [slot.x, options.floorY + 0.034, slot.z],
        material: materials.guide.clone(),
        radius: 0.055,
        segments: 5,
        userData: {
            type: "cupcake-cup-base",
            slotKey: DIVIDER_SLOT_KEYS.CUPCAKE,
        },
    });

    group.add(base, ring);

    return group;
}

function createTricolorMicroRibbon(options, materials) {
    const group = new THREE.Group();
    group.name = "DividerTricolorMicroRibbon";
    group.visible = Boolean(options.showTricolorMicroRibbon);

    const y = options.floorY + options.wallHeight + 0.066;
    const z = -options.boxDepth / 2 + 0.11;
    const width = options.boxWidth * 0.72;
    const bandHeight = 0.012;

    const bands = [
        ["Red", materials.ribbon.red],
        ["Yellow", materials.ribbon.yellow],
        ["Green", materials.ribbon.green],
    ];

    bands.forEach(([name, material], index) => {
        const band = createRoundedMesh({
            name: `DividerMicroRibbon_${name}`,
            size: [width, bandHeight, 0.018],
            position: [0, y + index * bandHeight * 1.35, z],
            material,
            radius: 0.004,
            segments: 2,
            userData: {
                type: "divider-micro-ribbon",
                color: name.toLowerCase(),
            },
        });

        group.add(band);
    });

    return group;
}

function createAssemblyMarks(options, materials) {
    const group = new THREE.Group();
    group.name = "InteriorAssemblyMarks";
    group.visible = Boolean(options.showAssemblyMarks);

    const { slots } = getDefaultSlotLayout(options);
    const markY = options.floorY + 0.028;

    slots.forEach((slot) => {
        const mark = new THREE.Mesh(
            new THREE.RingGeometry(0.025, 0.034, 24),
            materials.mark.clone(),
        );

        mark.name = `AssemblyMark_${slot.key}`;
        mark.rotation.x = -Math.PI / 2;
        mark.position.set(
            slot.x - slot.width * 0.34,
            markY,
            slot.z - slot.depth * 0.34,
        );
        mark.renderOrder = options.renderOrder + 5;
        mark.userData = {
            type: "assembly-mark",
            slotKey: slot.key,
        };

        group.add(mark);
    });

    return group;
}

function createMeasurementGuides(options, materials) {
    const group = new THREE.Group();
    group.name = "InteriorMeasurementGuides";
    group.visible = Boolean(options.showMeasurementGuides);

    const material = materials.mark.clone();
    material.opacity = 0.28;

    const xLine = new THREE.Mesh(
        new THREE.PlaneGeometry(options.boxWidth * 0.82, 0.008),
        material,
    );

    xLine.name = "MeasurementGuideWidth";
    xLine.rotation.x = -Math.PI / 2;
    xLine.position.set(0, options.floorY + 0.031, 0);

    const zLine = new THREE.Mesh(
        new THREE.PlaneGeometry(0.008, options.boxDepth * 0.82),
        material.clone(),
    );

    zLine.name = "MeasurementGuideDepth";
    zLine.rotation.x = -Math.PI / 2;
    zLine.position.set(0, options.floorY + 0.032, 0);

    group.add(xLine, zLine);

    return group;
}

function applyConfigTransform(group, config = {}) {
    const transform =
        config.transform ??
        config.layoutTransform ??
        config.contentLayout?.internalDividers ??
        {};

    applyTransform(group, {
        position: transform.position ?? [0, 0, 0],
        rotation: transform.rotation ?? [0, 0, 0],
        scale: transform.scale ?? [1, 1, 1],
    });
}

function createMetadata(options) {
    const layout = getDefaultSlotLayout(options);

    return {
        objectType: "InternalDividers",
        version: INTERNAL_DIVIDERS_VERSION,
        layout: options.layout,
        visualStyle: options.visualStyle,
        dimensions: {
            boxWidth: options.boxWidth,
            boxDepth: options.boxDepth,
            floorY: options.floorY,
            wallHeight: options.wallHeight,
            wallThickness: options.wallThickness,
        },
        slots: layout.slots.map((slot) => ({
            key: slot.key,
            label: slot.label,
            role: slot.role,
            mode: slot.mode,
            x: slot.x,
            z: slot.z,
            width: slot.width,
            depth: slot.depth,
        })),
        editable: true,
        exportable: true,
        purpose: "realistic-internal-compartment-system-for-academic-gift-box",
        createdAt: new Date().toISOString(),
    };
}

export function createInternalDividers(config = {}, materials = {}, extraOptions = {}) {
    const options = normalizeOptions({
        ...config,
        internalDividers: {
            ...(config.internalDividers ?? {}),
            ...extraOptions,
        },
    });

    const materialSet = createMaterialSet(materials, options);

    const group = new THREE.Group();
    group.name = "KickOffBoxInternalDividers";
    group.userData = createMetadata(options);
    group.userData.options = options;

    const dividerGroups = createDividerGroup(options, materialSet);
    const slotGuides = createSlotGuides(options, materialSet);
    const slotLabels = createSlotLabels(options, materialSet);
    const cornerPadding = createCornerPadding(options, materialSet);
    const productPads = createProductPads(options, materialSet);
    const bottleChannel = createBottleChannel(options, materialSet);
    const cardSleeve = createCardSleeve(options, materialSet);
    const qrPocket = createQrPocket(options, materialSet);
    const keychainPad = createKeychainPad(options, materialSet);
    const cupcakeCup = createCupcakeCup(options, materialSet);
    const microRibbon = createTricolorMicroRibbon(options, materialSet);
    const assemblyMarks = createAssemblyMarks(options, materialSet);
    const measurementGuides = createMeasurementGuides(options, materialSet);

    group.add(
        slotGuides,
        cornerPadding,
        productPads,
        bottleChannel,
        cardSleeve,
        qrPocket,
        keychainPad,
        cupcakeCup,
        dividerGroups.dividers,
        dividerGroups.edges,
        dividerGroups.caps,
        microRibbon,
        slotLabels,
        assemblyMarks,
        measurementGuides,
    );

    group.userData.parts = {
        dividers: dividerGroups.dividers.name,
        edges: dividerGroups.edges.name,
        caps: dividerGroups.caps.name,
        slotGuides: slotGuides.name,
        slotLabels: slotLabels.name,
        cornerPadding: cornerPadding.name,
        productPads: productPads.name,
        bottleChannel: bottleChannel.name,
        cardSleeve: cardSleeve.name,
        qrPocket: qrPocket.name,
        keychainPad: keychainPad.name,
        cupcakeCup: cupcakeCup.name,
        microRibbon: microRibbon.name,
        assemblyMarks: assemblyMarks.name,
        measurementGuides: measurementGuides.name,
    };

    applyConfigTransform(group, config);
    setGroupShadow(group, true, true);

    return group;
}

export function createDividers(config = {}, materials = {}, extraOptions = {}) {
    return createInternalDividers(config, materials, extraOptions);
}

export function getInternalDividerSlots(configOrGroup = {}) {
    if (configOrGroup?.isObject3D) {
        return configOrGroup.userData?.slots ?? [];
    }

    const options = normalizeOptions(configOrGroup);
    return getDefaultSlotLayout(options).slots;
}

export function getInternalDividerSlot(configOrGroup = {}, slotKey = DIVIDER_SLOT_KEYS.GENERAL) {
    const slots = getInternalDividerSlots(configOrGroup);
    return slots.find((slot) => slot.key === slotKey) ?? null;
}

export function setInternalDividersVisibility(dividersGroup, visible = true) {
    if (!dividersGroup) return;

    dividersGroup.visible = Boolean(visible);
    dividersGroup.userData.visible = Boolean(visible);
    dividersGroup.userData.updatedAt = new Date().toISOString();
}

export function setInternalDividerPartVisibility(dividersGroup, partName, visible = true) {
    if (!dividersGroup || !partName) return;

    const part = dividersGroup.getObjectByName(partName);

    if (!part) return;

    part.visible = Boolean(visible);
    dividersGroup.userData.updatedAt = new Date().toISOString();
}

export function setSlotLabelVisibility(dividersGroup, visible = true) {
    const labels = dividersGroup?.getObjectByName("InteriorSlotLabels");

    if (!labels) return;

    labels.visible = Boolean(visible);
    dividersGroup.userData.updatedAt = new Date().toISOString();
}

export function setSlotGuidesVisibility(dividersGroup, visible = true) {
    const guides = dividersGroup?.getObjectByName("InteriorSlotGuides");

    if (!guides) return;

    guides.visible = Boolean(visible);
    dividersGroup.userData.updatedAt = new Date().toISOString();
}

export function setBottleChannelVisibility(dividersGroup, visible = true) {
    const channel = dividersGroup?.getObjectByName("BottleHorizontalChannel");

    if (!channel) return;

    channel.visible = Boolean(visible);
    dividersGroup.userData.updatedAt = new Date().toISOString();
}

export function setInternalDividersTransform(dividersGroup, { position, rotation, scale } = {}) {
    if (!dividersGroup) return;

    if (position) dividersGroup.position.set(position[0], position[1], position[2]);
    if (rotation) dividersGroup.rotation.set(rotation[0], rotation[1], rotation[2]);
    if (scale) dividersGroup.scale.set(scale[0], scale[1], scale[2]);

    dividersGroup.userData.updatedAt = new Date().toISOString();
}

export function updateInternalDividersAnimation(dividersGroup, elapsedTime = 0) {
    if (!dividersGroup) return;

    const microRibbon = dividersGroup.getObjectByName("DividerTricolorMicroRibbon");
    const labels = dividersGroup.getObjectByName("InteriorSlotLabels");

    if (microRibbon) {
        microRibbon.children.forEach((child, index) => {
            if (child.material) {
                child.material.roughness = 0.48 + Math.sin(elapsedTime * 0.45 + index) * 0.04;
                child.material.needsUpdate = true;
            }
        });
    }

    if (labels) {
        labels.children.forEach((label, index) => {
            label.position.y += Math.sin(elapsedTime * 0.5 + index) * 0.00008;
        });
    }
}

export function getInternalDividerParts(dividersGroup) {
    if (!dividersGroup) return {};

    return {
        dividers: dividersGroup.getObjectByName("DividerMeshes"),
        edges: dividersGroup.getObjectByName("DividerEdges"),
        caps: dividersGroup.getObjectByName("DividerCaps"),
        slotGuides: dividersGroup.getObjectByName("InteriorSlotGuides"),
        slotLabels: dividersGroup.getObjectByName("InteriorSlotLabels"),
        cornerPadding: dividersGroup.getObjectByName("InteriorCornerPadding"),
        productPads: dividersGroup.getObjectByName("InteriorProductPads"),
        bottleChannel: dividersGroup.getObjectByName("BottleHorizontalChannel"),
        cardSleeve: dividersGroup.getObjectByName("CardFlatSleeve"),
        qrPocket: dividersGroup.getObjectByName("QrCardPocket"),
        keychainPad: dividersGroup.getObjectByName("KeychainResinPad"),
        cupcakeCup: dividersGroup.getObjectByName("CupcakeProtectiveCup"),
        microRibbon: dividersGroup.getObjectByName("DividerTricolorMicroRibbon"),
        assemblyMarks: dividersGroup.getObjectByName("InteriorAssemblyMarks"),
        measurementGuides: dividersGroup.getObjectByName("InteriorMeasurementGuides"),
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

export function disposeInternalDividers(dividersGroup) {
    if (!dividersGroup) return;

    const disposedGeometries = new Set();
    const disposedMaterials = new Set();

    dividersGroup.traverse((object) => {
        if (object.geometry && !disposedGeometries.has(object.geometry)) {
            object.geometry.dispose();
            disposedGeometries.add(object.geometry);
        }

        if (object.material && !disposedMaterials.has(object.material)) {
            disposeMaterial(object.material);
            disposedMaterials.add(object.material);
        }
    });

    dividersGroup.removeFromParent();
}

export const InternalDividers = Object.freeze({
    version: INTERNAL_DIVIDERS_VERSION,
    layouts: DIVIDER_LAYOUTS,
    slotKeys: DIVIDER_SLOT_KEYS,
    visualStyles: DIVIDER_VISUAL_STYLES,
    slotModes: DIVIDER_SLOT_MODES,

    createInternalDividers,
    createDividers,

    getInternalDividerSlots,
    getInternalDividerSlot,
    getInternalDividerParts,

    setInternalDividersVisibility,
    setInternalDividerPartVisibility,
    setSlotLabelVisibility,
    setSlotGuidesVisibility,
    setBottleChannelVisibility,
    setInternalDividersTransform,

    updateInternalDividersAnimation,
    disposeInternalDividers,
});
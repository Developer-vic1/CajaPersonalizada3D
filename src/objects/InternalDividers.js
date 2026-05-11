import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import {
    getBoxDimensions,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

export const INTERNAL_DIVIDERS_VERSION = "2.0.0";

export const DIVIDER_LAYOUTS = Object.freeze({
    STANDARD: "standard",
    PREMIUM: "premium",
    DEFENSE: "defense",
    JURY: "jury",
    MINIMAL: "minimal",
    SHOWCASE: "showcase",
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
});

const DEFAULT_OPTIONS = Object.freeze({
    layout: DIVIDER_LAYOUTS.PREMIUM,
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
    showAssemblyMarks: true,

    bottleChannelWidth: 0.56,
    bottleChannelLength: 1.48,
    bottlePadHeight: 0.038,

    labelLanguage: "es",
    labelScale: 1,
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
        mark: "#e9c678",
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
        mark: "#8b5f35",
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
        mark: "#c59a4a",
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
        mark: "#b92d2d",
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
        mark: "#c59a4a",
        roughness: 0.78,
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
        fromUtility.width ??
        DEFAULT_OPTIONS.boxWidth;

    const depth =
        source.dimensions?.depth ??
        source.dimensions?.boxDepth ??
        fromUtility.depth ??
        DEFAULT_OPTIONS.boxDepth;

    const floorY =
        source.dimensions?.floorHeight ??
        source.dimensions?.floorY ??
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
    });

    const dividerSideFallback = new THREE.MeshStandardMaterial({
        name: "InternalDividerSideMaterial",
        color: palette.dividerSide,
        roughness: palette.roughness,
        metalness: palette.metalness,
    });

    const capFallback = new THREE.MeshStandardMaterial({
        name: "InternalDividerCapMaterial",
        color: palette.cap,
        roughness: 0.54,
        metalness: 0.12,
    });

    const padFallback = new THREE.MeshStandardMaterial({
        name: "InternalDividerPadMaterial",
        color: palette.pad,
        roughness: 0.84,
        metalness: 0.02,
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

    return {
        divider: cloneMaterial(configMaterials.darkCardboard, dividerFallback),
        dividerSide: cloneMaterial(configMaterials.boxInterior, dividerSideFallback),
        cap: cloneMaterial(configMaterials.gold, capFallback),
        pad: cloneMaterial(configMaterials.boxInterior, padFallback),
        guide: cloneMaterial(configMaterials.transparentHelper, guideFallback),
        mark: markFallback,
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
        },
        local: [
            dividerFallback,
            dividerSideFallback,
            capFallback,
            padFallback,
            guideFallback,
            markFallback,
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
    edges.renderOrder = 6;

    edges.userData = {
        generatedBy: "InternalDividers",
        parentMesh: mesh.name,
        type: "divider-edge",
    };

    return edges;
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

    ctx.fillStyle = materials.label.text;
    ctx.font = "900 54px Arial, Helvetica, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 4);

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
    label.renderOrder = 12;
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
    const margin = 0.16;
    const gap = options.wallThickness;

    const leftWidth = options.boxWidth * 0.38;
    const rightWidth = options.boxWidth * 0.38;
    const centerWidth = options.boxWidth - leftWidth - rightWidth - gap * 2 - margin * 2;

    const leftX = -halfW + margin + leftWidth / 2;
    const centerX = -halfW + margin + leftWidth + gap + centerWidth / 2;
    const rightX = halfW - margin - rightWidth / 2;

    const backZ = -halfD + margin;
    const frontZ = halfD - margin;
    const midZ = 0;

    return {
        bounds: {
            halfW,
            halfD,
            margin,
            leftWidth,
            centerWidth,
            rightWidth,
            leftX,
            centerX,
            rightX,
            backZ,
            frontZ,
            midZ,
        },

        slots: [
            {
                key: DIVIDER_SLOT_KEYS.CARD,
                label: SLOT_LABELS_ES[DIVIDER_SLOT_KEYS.CARD],
                x: leftX,
                z: backZ + options.boxDepth * 0.25,
                width: leftWidth,
                depth: options.boxDepth * 0.42,
                role: "flat-card-message",
            },
            {
                key: DIVIDER_SLOT_KEYS.CUPCAKE,
                label: SLOT_LABELS_ES[DIVIDER_SLOT_KEYS.CUPCAKE],
                x: leftX,
                z: frontZ - options.boxDepth * 0.22,
                width: leftWidth,
                depth: options.boxDepth * 0.34,
                role: "sweet-detail",
            },
            {
                key: DIVIDER_SLOT_KEYS.BOTTLE,
                label: SLOT_LABELS_ES[DIVIDER_SLOT_KEYS.BOTTLE],
                x: centerX,
                z: midZ + 0.06,
                width: Math.max(centerWidth, options.bottleChannelWidth),
                depth: options.bottleChannelLength,
                role: "horizontal-bottle-channel",
            },
            {
                key: DIVIDER_SLOT_KEYS.QR,
                label: SLOT_LABELS_ES[DIVIDER_SLOT_KEYS.QR],
                x: rightX,
                z: backZ + options.boxDepth * 0.22,
                width: rightWidth,
                depth: options.boxDepth * 0.32,
                role: "qr-card",
            },
            {
                key: DIVIDER_SLOT_KEYS.KEYCHAIN,
                label: SLOT_LABELS_ES[DIVIDER_SLOT_KEYS.KEYCHAIN],
                x: rightX,
                z: midZ + options.boxDepth * 0.08,
                width: rightWidth,
                depth: options.boxDepth * 0.26,
                role: "resin-keychain",
            },
            {
                key: DIVIDER_SLOT_KEYS.ROSE,
                label: SLOT_LABELS_ES[DIVIDER_SLOT_KEYS.ROSE],
                x: rightX,
                z: frontZ - options.boxDepth * 0.18,
                width: rightWidth,
                depth: options.boxDepth * 0.28,
                role: "decorative-rose",
            },
        ],
    };
}

function createDividerBlueprints(options) {
    const layout = getDefaultSlotLayout(options);
    const b = layout.bounds;
    const y = options.floorY + options.wallHeight / 2 + 0.018;

    const verticalLeftX = b.leftX + b.leftWidth / 2 + options.wallThickness / 2;
    const verticalRightX = b.rightX - b.rightWidth / 2 - options.wallThickness / 2;

    const dividers = [
        {
            name: "Divider_LeftColumn",
            size: [options.wallThickness, options.wallHeight, options.boxDepth - b.margin * 2],
            position: [verticalLeftX, y, 0],
            axis: "z",
            role: "left-column-separator",
        },
        {
            name: "Divider_RightColumn",
            size: [options.wallThickness, options.wallHeight, options.boxDepth - b.margin * 2],
            position: [verticalRightX, y, 0],
            axis: "z",
            role: "right-column-separator",
        },
        {
            name: "Divider_LeftHorizontal",
            size: [b.leftWidth, options.wallHeight * 0.92, options.wallThickness],
            position: [b.leftX, y, b.midZ + options.boxDepth * 0.08],
            axis: "x",
            role: "card-cupcake-separator",
        },
        {
            name: "Divider_RightTop",
            size: [b.rightWidth, options.wallHeight * 0.88, options.wallThickness],
            position: [b.rightX, y, b.midZ - options.boxDepth * 0.18],
            axis: "x",
            role: "qr-accessory-separator",
        },
        {
            name: "Divider_RightBottom",
            size: [b.rightWidth, options.wallHeight * 0.88, options.wallThickness],
            position: [b.rightX, y, b.midZ + options.boxDepth * 0.2],
            axis: "x",
            role: "keychain-rose-separator",
        },
    ];

    if ([DIVIDER_LAYOUTS.SHOWCASE, DIVIDER_LAYOUTS.PREMIUM, DIVIDER_LAYOUTS.DEFENSE].includes(options.layout)) {
        dividers.push(
            {
                name: "Divider_BottleBackRail",
                size: [b.centerWidth * 0.88, options.wallHeight * 0.58, options.wallThickness],
                position: [b.centerX, y - options.wallHeight * 0.12, -options.bottleChannelLength / 2],
                axis: "x",
                role: "bottle-back-rail",
            },
            {
                name: "Divider_BottleFrontRail",
                size: [b.centerWidth * 0.88, options.wallHeight * 0.58, options.wallThickness],
                position: [b.centerX, y - options.wallHeight * 0.12, options.bottleChannelLength / 2],
                axis: "x",
                role: "bottle-front-rail",
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

    const edgeGroup = new THREE.Group();
    edgeGroup.name = "DividerEdges";
    edgeGroup.visible = Boolean(options.showEdges);

    const capGroup = new THREE.Group();
    capGroup.name = "DividerCaps";
    capGroup.visible = Boolean(options.showCaps);

    const dividers = options.customDividers ?? createDividerBlueprints(options);

    dividers.forEach((divider, index) => {
        const mesh = createRoundedMesh({
            name: divider.name ?? `InternalDivider_${index + 1}`,
            size: divider.size,
            position: divider.position,
            material: materials.divider,
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
            material: materials.cap,
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
        material: materials.guide,
        radius: 0.035,
        segments: 4,
        userData: {
            type: "slot-guide",
            slotKey: slot.key,
            role: slot.role,
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
    const labelY = options.floorY + options.slotBaseHeight + 0.035;

    slots.forEach((slot) => {
        const labelWidth = clamp(slot.width * 0.55, 0.28, 0.56);
        const labelHeight = 0.105;

        const label = createSlotLabel(
            {
                slotKey: slot.key,
                text: slot.label,
                position: [
                    slot.x,
                    labelY,
                    slot.z + slot.depth * 0.26,
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
            material: materials.pad,
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
        if (![DIVIDER_SLOT_KEYS.CUPCAKE, DIVIDER_SLOT_KEYS.KEYCHAIN, DIVIDER_SLOT_KEYS.ROSE, DIVIDER_SLOT_KEYS.QR].includes(slot.key)) {
            return;
        }

        const pad = createRoundedMesh({
            name: `ProductPad_${slot.key}`,
            size: [
                clamp(slot.width * 0.58, 0.22, 0.44),
                0.035,
                clamp(slot.depth * 0.46, 0.18, 0.36),
            ],
            position: [
                slot.x,
                options.floorY + 0.045,
                slot.z,
            ],
            material: materials.pad,
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

    const railMaterial = materials.pad;
    const y = options.floorY + options.bottlePadHeight / 2 + 0.034;

    const leftRail = createRoundedMesh({
        name: "BottleChannel_LeftSupport",
        size: [
            options.bottleChannelWidth * 0.18,
            options.bottlePadHeight,
            options.bottleChannelLength,
        ],
        position: [
            bottleSlot.x - options.bottleChannelWidth * 0.34,
            y,
            bottleSlot.z,
        ],
        material: railMaterial,
        radius: 0.024,
        segments: 4,
        userData: {
            type: "bottle-support-rail",
            side: "left",
            slotKey: DIVIDER_SLOT_KEYS.BOTTLE,
        },
    });

    const rightRail = createRoundedMesh({
        name: "BottleChannel_RightSupport",
        size: [
            options.bottleChannelWidth * 0.18,
            options.bottlePadHeight,
            options.bottleChannelLength,
        ],
        position: [
            bottleSlot.x + options.bottleChannelWidth * 0.34,
            y,
            bottleSlot.z,
        ],
        material: railMaterial.clone(),
        radius: 0.024,
        segments: 4,
        userData: {
            type: "bottle-support-rail",
            side: "right",
            slotKey: DIVIDER_SLOT_KEYS.BOTTLE,
        },
    });

    const channelShadow = createRoundedMesh({
        name: "BottleChannel_SoftBed",
        size: [
            options.bottleChannelWidth * 0.78,
            0.012,
            options.bottleChannelLength * 0.92,
        ],
        position: [
            bottleSlot.x,
            options.floorY + 0.023,
            bottleSlot.z,
        ],
        material: materials.guide.clone(),
        radius: 0.038,
        segments: 4,
        userData: {
            type: "bottle-channel-bed",
            role: "soft-guide",
            slotKey: DIVIDER_SLOT_KEYS.BOTTLE,
        },
    });

    channelShadow.material.opacity = Math.min(options.slotGuideOpacity + 0.08, 0.32);

    group.add(channelShadow, leftRail, rightRail);

    return group;
}

function createAssemblyMarks(options, materials) {
    const group = new THREE.Group();
    group.name = "DividerAssemblyMarks";
    group.visible = Boolean(options.showAssemblyMarks);

    const { slots } = getDefaultSlotLayout(options);
    const markGeometry = new THREE.RingGeometry(0.035, 0.047, 32);

    slots.forEach((slot) => {
        const mark = new THREE.Mesh(markGeometry.clone(), materials.mark.clone());
        mark.name = `AssemblyMark_${slot.key}`;
        mark.rotation.x = -Math.PI / 2;
        mark.position.set(
            slot.x - slot.width * 0.34,
            options.floorY + 0.045,
            slot.z - slot.depth * 0.34,
        );
        mark.renderOrder = 10;
        mark.userData = {
            type: "assembly-mark",
            slotKey: slot.key,
            generatedBy: "InternalDividers",
        };

        group.add(mark);
    });

    return group;
}

function createOuterLip(options, materials) {
    const group = new THREE.Group();
    group.name = "InteriorProtectiveLip";

    const halfW = options.boxWidth / 2;
    const halfD = options.boxDepth / 2;
    const y = options.floorY + options.wallHeight * 0.32;

    const lipHeight = options.wallHeight * 0.18;
    const lipThickness = 0.032;

    const lips = [
        {
            name: "ProtectiveLip_Back",
            size: [options.boxWidth - 0.18, lipHeight, lipThickness],
            position: [0, y, -halfD + 0.09],
        },
        {
            name: "ProtectiveLip_Front",
            size: [options.boxWidth - 0.18, lipHeight, lipThickness],
            position: [0, y, halfD - 0.09],
        },
        {
            name: "ProtectiveLip_Left",
            size: [lipThickness, lipHeight, options.boxDepth - 0.18],
            position: [-halfW + 0.09, y, 0],
        },
        {
            name: "ProtectiveLip_Right",
            size: [lipThickness, lipHeight, options.boxDepth - 0.18],
            position: [halfW - 0.09, y, 0],
        },
    ];

    lips.forEach((lip) => {
        group.add(createRoundedMesh({
            name: lip.name,
            size: lip.size,
            position: lip.position,
            material: materials.dividerSide,
            radius: 0.014,
            segments: 3,
            userData: {
                type: "protective-lip",
                role: "inner-box-border",
            },
        }));
    });

    return group;
}

function applyOverallTransform(group, config = {}) {
    const transform = config.transform ?? config.layout ?? {};

    if (Array.isArray(transform.position)) {
        group.position.set(
            Number(transform.position[0]) || 0,
            Number(transform.position[1]) || 0,
            Number(transform.position[2]) || 0,
        );
    }

    if (Array.isArray(transform.rotation)) {
        group.rotation.set(
            Number(transform.rotation[0]) || 0,
            Number(transform.rotation[1]) || 0,
            Number(transform.rotation[2]) || 0,
        );
    }

    if (Array.isArray(transform.scale)) {
        group.scale.set(
            Number(transform.scale[0]) || 1,
            Number(transform.scale[1]) || 1,
            Number(transform.scale[2]) || 1,
        );
    }

    return group;
}

function createMetadata(options) {
    const { slots } = getDefaultSlotLayout(options);

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
        slots: slots.map((slot) => ({
            key: slot.key,
            label: slot.label,
            role: slot.role,
            x: slot.x,
            z: slot.z,
            width: slot.width,
            depth: slot.depth,
        })),
        purpose: "organize-and-protect-products-inside-custom-gift-box",
        editable: true,
        createdAt: new Date().toISOString(),
    };
}

export function createInternalDividers(config = {}, materials = {}) {
    const options = normalizeOptions(config);
    const localMaterials = createMaterialSet(materials, options);

    const group = new THREE.Group();
    group.name = "KickOffBoxInternalDividers";
    group.visible = Boolean(options.showDividers);
    group.userData = createMetadata(options);

    const dividerParts = createDividerGroup(options, localMaterials);
    const outerLip = createOuterLip(options, localMaterials);
    const cornerPadding = createCornerPadding(options, localMaterials);
    const productPads = createProductPads(options, localMaterials);
    const bottleChannel = createBottleChannel(options, localMaterials);
    const slotGuides = createSlotGuides(options, localMaterials);
    const slotLabels = createSlotLabels(options, localMaterials);
    const assemblyMarks = createAssemblyMarks(options, localMaterials);

    group.add(
        outerLip,
        dividerParts.dividers,
        dividerParts.edges,
        dividerParts.caps,
        cornerPadding,
        productPads,
        bottleChannel,
        slotGuides,
        slotLabels,
        assemblyMarks,
    );

    group.userData.parts = {
        outerLip: outerLip.name,
        dividers: dividerParts.dividers.name,
        edges: dividerParts.edges.name,
        caps: dividerParts.caps.name,
        cornerPadding: cornerPadding.name,
        productPads: productPads.name,
        bottleChannel: bottleChannel.name,
        slotGuides: slotGuides.name,
        slotLabels: slotLabels.name,
        assemblyMarks: assemblyMarks.name,
    };

    group.userData.localMaterials = localMaterials.local;

    applyOverallTransform(group, config);
    setGroupShadow(group, true, true);

    return group;
}

export function setInternalDividersVisibility(dividersGroup, visible = true) {
    if (!dividersGroup) return;

    dividersGroup.visible = Boolean(visible);
    dividersGroup.userData.visible = Boolean(visible);
    dividersGroup.userData.updatedAt = new Date().toISOString();
}

export function setSlotLabelsVisibility(dividersGroup, visible = true) {
    const labels = dividersGroup?.getObjectByName("InteriorSlotLabels");

    if (!labels) return;

    labels.visible = Boolean(visible);
}

export function setSlotGuidesVisibility(dividersGroup, visible = true) {
    const guides = dividersGroup?.getObjectByName("InteriorSlotGuides");

    if (!guides) return;

    guides.visible = Boolean(visible);
}

export function setDividerEdgesVisibility(dividersGroup, visible = true) {
    const edges = dividersGroup?.getObjectByName("DividerEdges");

    if (!edges) return;

    edges.visible = Boolean(visible);
}

export function setDividerCapsVisibility(dividersGroup, visible = true) {
    const caps = dividersGroup?.getObjectByName("DividerCaps");

    if (!caps) return;

    caps.visible = Boolean(visible);
}

export function setBottleChannelVisibility(dividersGroup, visible = true) {
    const channel = dividersGroup?.getObjectByName("BottleHorizontalChannel");

    if (!channel) return;

    channel.visible = Boolean(visible);
}

export function setProductPadsVisibility(dividersGroup, visible = true) {
    const pads = dividersGroup?.getObjectByName("InteriorProductPads");

    if (!pads) return;

    pads.visible = Boolean(visible);
}

export function getInternalDividerParts(dividersGroup) {
    if (!dividersGroup) return {};

    return {
        outerLip: dividersGroup.getObjectByName("InteriorProtectiveLip"),
        meshes: dividersGroup.getObjectByName("DividerMeshes"),
        edges: dividersGroup.getObjectByName("DividerEdges"),
        caps: dividersGroup.getObjectByName("DividerCaps"),
        cornerPadding: dividersGroup.getObjectByName("InteriorCornerPadding"),
        productPads: dividersGroup.getObjectByName("InteriorProductPads"),
        bottleChannel: dividersGroup.getObjectByName("BottleHorizontalChannel"),
        slotGuides: dividersGroup.getObjectByName("InteriorSlotGuides"),
        slotLabels: dividersGroup.getObjectByName("InteriorSlotLabels"),
        assemblyMarks: dividersGroup.getObjectByName("DividerAssemblyMarks"),
    };
}

export function getDividerSlotData(dividersGroup) {
    return dividersGroup?.userData?.slots ?? [];
}

export function highlightDividerSlot(dividersGroup, slotKey, active = true) {
    if (!dividersGroup) return;

    dividersGroup.traverse((object) => {
        if (object.userData?.slotKey !== slotKey) return;

        if (object.material?.emissive) {
            object.material.emissive.set(active ? "#c59a4a" : "#000000");
            object.material.emissiveIntensity = active ? 0.18 : 0;
            object.material.needsUpdate = true;
        }

        if (object.material?.opacity != null && object.userData?.type === "slot-guide") {
            object.material.opacity = active ? 0.34 : DEFAULT_OPTIONS.slotGuideOpacity;
        }
    });
}

export function updateInternalDividersAnimation(dividersGroup, elapsedTime = 0) {
    if (!dividersGroup) return;

    const labels = dividersGroup.getObjectByName("InteriorSlotLabels");
    const marks = dividersGroup.getObjectByName("DividerAssemblyMarks");

    if (labels) {
        labels.children.forEach((label, index) => {
            label.position.y += Math.sin(elapsedTime * 0.7 + index * 0.4) * 0.00025;
        });
    }

    if (marks) {
        marks.rotation.y = Math.sin(elapsedTime * 0.2) * 0.005;
    }
}

function disposeTexture(texture) {
    if (texture?.dispose) texture.dispose();
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

        if (item.dispose) item.dispose();
    });
}

export function disposeInternalDividers(dividersGroup) {
    if (!dividersGroup) return;

    dividersGroup.traverse((object) => {
        if (object.geometry?.dispose) {
            object.geometry.dispose();
        }

        if (object.material) {
            disposeMaterial(object.material);
        }
    });

    const localMaterials = dividersGroup.userData?.localMaterials ?? [];

    localMaterials.forEach((material) => {
        disposeMaterial(material);
    });

    dividersGroup.removeFromParent();
}

export const InternalDividers = Object.freeze({
    version: INTERNAL_DIVIDERS_VERSION,
    layouts: DIVIDER_LAYOUTS,
    slotKeys: DIVIDER_SLOT_KEYS,
    visualStyles: DIVIDER_VISUAL_STYLES,

    createInternalDividers,
    setInternalDividersVisibility,
    setSlotLabelsVisibility,
    setSlotGuidesVisibility,
    setDividerEdgesVisibility,
    setDividerCapsVisibility,
    setBottleChannelVisibility,
    setProductPadsVisibility,

    getInternalDividerParts,
    getDividerSlotData,
    highlightDividerSlot,
    updateInternalDividersAnimation,
    disposeInternalDividers,
});
import * as THREE from "three";

import {
    BEVERAGE_TYPES,
    getBeverage,
} from "../config/beverageCatalog.js";

import {
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

import {
    createBeverageLabelTexture,
    createMaterialFromTexture,
} from "../utils/textureFactory.js";

export const SODA_BOTTLE_VERSION = "2.0.0";

export const BOTTLE_ORIENTATION = Object.freeze({
    VERTICAL: "vertical",
    HORIZONTAL: "horizontal",
});

export const BOTTLE_RENDER_MODE = Object.freeze({
    PLASTIC: "plastic",
    CLEAR_WATER: "clear-water",
    DARK_COLA: "dark-cola",
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

const DEFAULT_BOTTLE_OPTIONS = Object.freeze({
    beverageType: BEVERAGE_TYPES.CUSTOM,
    type: BEVERAGE_TYPES.CUSTOM,

    labelText: "KICKOFF DRINK",
    subLabel: "Custom 2026",
    footerText: "Detalle académico",

    bottleShape: BOTTLE_SHAPES.CLASSIC,
    renderMode: BOTTLE_RENDER_MODE.PLASTIC,
    orientation: BOTTLE_ORIENTATION.VERTICAL,

    liquidColor: "#2f86c7",
    liquidOpacity: 0.66,
    bottleTint: "#eef7ff",
    bottleOpacity: 0.48,
    capColor: "#f4f1e8",

    labelBackground: "#111111",
    labelTextColor: "#fff7e8",
    labelAccent: "#c59a4a",
    secondaryAccent: "#b92d2d",
    pattern: "premium",

    bubbles: true,
    bubbleCount: 28,
    condensation: true,
    dropletCount: 38,
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

    highlightIntensity: 0.34,
    labelTexture: null,
    customLabelImage: null,
});

const SHAPE_PRESETS = Object.freeze({
    [BOTTLE_SHAPES.CLASSIC]: Object.freeze({
        totalHeight: 2.05,
        body: {
            radiusTop: 0.235,
            radiusMid: 0.315,
            radiusBottom: 0.305,
            height: 1.42,
        },
        neck: {
            radiusTop: 0.145,
            radiusBottom: 0.19,
            height: 0.38,
        },
        cap: {
            radius: 0.172,
            height: 0.16,
        },
        label: {
            width: 0.78,
            height: 0.43,
            y: 0.02,
            z: 0.318,
        },
        bottom: {
            radius: 0.25,
            height: 0.055,
        },
    }),

    [BOTTLE_SHAPES.WATER]: Object.freeze({
        totalHeight: 2.1,
        body: {
            radiusTop: 0.215,
            radiusMid: 0.285,
            radiusBottom: 0.275,
            height: 1.5,
        },
        neck: {
            radiusTop: 0.135,
            radiusBottom: 0.175,
            height: 0.42,
        },
        cap: {
            radius: 0.158,
            height: 0.15,
        },
        label: {
            width: 0.72,
            height: 0.36,
            y: -0.02,
            z: 0.292,
        },
        bottom: {
            radius: 0.235,
            height: 0.052,
        },
    }),

    [BOTTLE_SHAPES.SPORT]: Object.freeze({
        totalHeight: 2.18,
        body: {
            radiusTop: 0.235,
            radiusMid: 0.305,
            radiusBottom: 0.29,
            height: 1.52,
        },
        neck: {
            radiusTop: 0.145,
            radiusBottom: 0.19,
            height: 0.45,
        },
        cap: {
            radius: 0.18,
            height: 0.2,
        },
        label: {
            width: 0.82,
            height: 0.42,
            y: -0.02,
            z: 0.312,
        },
        bottom: {
            radius: 0.245,
            height: 0.055,
        },
    }),

    [BOTTLE_SHAPES.SLIM]: Object.freeze({
        totalHeight: 2.0,
        body: {
            radiusTop: 0.21,
            radiusMid: 0.238,
            radiusBottom: 0.232,
            height: 1.55,
        },
        neck: {
            radiusTop: 0.13,
            radiusBottom: 0.152,
            height: 0.29,
        },
        cap: {
            radius: 0.148,
            height: 0.13,
        },
        label: {
            width: 0.68,
            height: 0.58,
            y: 0.0,
            z: 0.244,
        },
        bottom: {
            radius: 0.205,
            height: 0.045,
        },
    }),

    [BOTTLE_SHAPES.CAN]: Object.freeze({
        totalHeight: 1.28,
        body: {
            radiusTop: 0.255,
            radiusMid: 0.265,
            radiusBottom: 0.255,
            height: 1.18,
        },
        neck: {
            radiusTop: 0.001,
            radiusBottom: 0.001,
            height: 0.001,
        },
        cap: {
            radius: 0.255,
            height: 0.04,
        },
        label: {
            width: 0.78,
            height: 0.74,
            y: 0.02,
            z: 0.272,
        },
        bottom: {
            radius: 0.255,
            height: 0.04,
        },
    }),
});

function safeGetBeverage(type) {
    try {
        return getBeverage(type);
    } catch {
        return getBeverage(BEVERAGE_TYPES.CUSTOM);
    }
}

function inferBottleShape(beverageType, options = {}) {
    if (options.bottleShape) return options.bottleShape;

    if (beverageType === BEVERAGE_TYPES.WATER) return BOTTLE_SHAPES.WATER;
    if (beverageType === BEVERAGE_TYPES.MINERAL) return BOTTLE_SHAPES.WATER;
    if (beverageType === BEVERAGE_TYPES.SPORT) return BOTTLE_SHAPES.SPORT;
    if (beverageType === BEVERAGE_TYPES.ENERGY) return BOTTLE_SHAPES.CAN;

    return BOTTLE_SHAPES.CLASSIC;
}

function inferRenderMode(beverageType, options = {}) {
    if (options.renderMode) return options.renderMode;

    if (beverageType === BEVERAGE_TYPES.COLA) return BOTTLE_RENDER_MODE.DARK_COLA;
    if (beverageType === BEVERAGE_TYPES.WATER) return BOTTLE_RENDER_MODE.CLEAR_WATER;
    if (beverageType === BEVERAGE_TYPES.MINERAL) return BOTTLE_RENDER_MODE.CLEAR_WATER;
    if (beverageType === BEVERAGE_TYPES.SPORT) return BOTTLE_RENDER_MODE.SPORT;
    if (beverageType === BEVERAGE_TYPES.ENERGY) return BOTTLE_RENDER_MODE.METALLIC_CAN;

    return BOTTLE_RENDER_MODE.PLASTIC;
}

function normalizeBottleOptions(config = {}) {
    const source = config.beverage ?? config.bottleOptions ?? config;
    const requestedType = source.beverageType ?? source.type ?? DEFAULT_BOTTLE_OPTIONS.beverageType;
    const catalogConfig = safeGetBeverage(requestedType);
    const beverageType = catalogConfig.id ?? requestedType ?? BEVERAGE_TYPES.CUSTOM;

    const merged = {
        ...DEFAULT_BOTTLE_OPTIONS,
        ...catalogConfig,
        ...source,
        beverageType,
        type: beverageType,
    };

    return {
        ...merged,
        bottleShape: inferBottleShape(beverageType, merged),
        renderMode: inferRenderMode(beverageType, merged),
        showBubbles: merged.showBubbles !== false && Boolean(merged.bubbles),
        showCondensation: merged.showCondensation !== false && Boolean(merged.condensation),
    };
}

function getShapePreset(options) {
    return SHAPE_PRESETS[options.bottleShape] ?? SHAPE_PRESETS[BOTTLE_SHAPES.CLASSIC];
}

function setDisposableName(resource, name) {
    if (resource) resource.name = name;
    return resource;
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

function createBottlePlasticMaterial(materials, options) {
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
    if ("metalness" in material) material.metalness = options.renderMode === BOTTLE_RENDER_MODE.METALLIC_CAN ? 0.42 : 0.02;
    if ("transmission" in material) material.transmission = options.renderMode === BOTTLE_RENDER_MODE.METALLIC_CAN ? 0.02 : 0.44;
    if ("thickness" in material) material.thickness = 0.42;
    if ("ior" in material) material.ior = 1.46;
    if ("clearcoat" in material) material.clearcoat = 0.55;
    if ("clearcoatRoughness" in material) material.clearcoatRoughness = 0.08;
    if ("envMapIntensity" in material) material.envMapIntensity = 1.35;

    material.needsUpdate = true;
    return material;
}

function createLiquidMaterial(materials, options) {
    const base = materials?.sodaBottle?.clone?.();

    const material = base ?? createPhysicalMaterial({
        name: "BottleLiquidMaterial",
        color: options.liquidColor,
        opacity: options.liquidOpacity,
        transmission: 0.12,
    });

    material.name = "BottleLiquidMaterial";
    material.color?.set(options.liquidColor);
    material.transparent = true;
    material.opacity = options.liquidOpacity;

    if ("roughness" in material) material.roughness = 0.14;
    if ("metalness" in material) material.metalness = 0;
    if ("transmission" in material) material.transmission = options.renderMode === BOTTLE_RENDER_MODE.CLEAR_WATER ? 0.25 : 0.1;
    if ("thickness" in material) material.thickness = 0.24;
    if ("clearcoat" in material) material.clearcoat = 0.2;
    if ("clearcoatRoughness" in material) material.clearcoatRoughness = 0.15;

    material.needsUpdate = true;
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

    if ("roughness" in material) material.roughness = options.renderMode === BOTTLE_RENDER_MODE.METALLIC_CAN ? 0.24 : 0.42;
    if ("metalness" in material) material.metalness = options.renderMode === BOTTLE_RENDER_MODE.METALLIC_CAN ? 0.46 : 0.08;

    material.needsUpdate = true;
    return material;
}

function createLabelMaterial(options, textureSet) {
    const externalTexture =
        options.labelTexture ??
        textureSet?.beverageLabel?.texture ??
        null;

    const texture = externalTexture ?? createBeverageLabelTexture({
        labelText: options.labelText,
        subLabel: options.subLabel,
        footerText: options.footerText,
        labelBackground: options.labelBackground,
        labelTextColor: options.labelTextColor,
        labelAccent: options.labelAccent,
        secondaryAccent: options.secondaryAccent,
        pattern: options.pattern,
    }).texture;

    texture.colorSpace = THREE.SRGBColorSpace;
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
            new THREE.Vector2(body.radiusBottom * 0.96, -halfHeight),
            new THREE.Vector2(body.radiusBottom, -halfHeight + 0.04),
            new THREE.Vector2(body.radiusMid, -halfHeight + 0.12),
            new THREE.Vector2(body.radiusMid, halfHeight - 0.12),
            new THREE.Vector2(body.radiusTop, halfHeight - 0.04),
            new THREE.Vector2(body.radiusTop * 0.96, halfHeight),
        ];
    }

    if (options.bottleShape === BOTTLE_SHAPES.WATER) {
        return [
            new THREE.Vector2(body.radiusBottom * 0.72, -halfHeight),
            new THREE.Vector2(body.radiusBottom * 0.96, -halfHeight + 0.08),
            new THREE.Vector2(body.radiusBottom, -halfHeight + 0.22),
            new THREE.Vector2(body.radiusMid * 0.98, -halfHeight + body.height * 0.5),
            new THREE.Vector2(body.radiusTop * 1.05, halfHeight - 0.28),
            new THREE.Vector2(body.radiusTop * 0.92, halfHeight),
        ];
    }

    if (options.bottleShape === BOTTLE_SHAPES.SPORT) {
        return [
            new THREE.Vector2(body.radiusBottom * 0.74, -halfHeight),
            new THREE.Vector2(body.radiusBottom, -halfHeight + 0.08),
            new THREE.Vector2(body.radiusMid * 0.92, -halfHeight + 0.32),
            new THREE.Vector2(body.radiusMid * 1.04, -halfHeight + body.height * 0.56),
            new THREE.Vector2(body.radiusTop * 1.02, halfHeight - 0.28),
            new THREE.Vector2(body.radiusTop * 0.9, halfHeight),
        ];
    }

    if (options.bottleShape === BOTTLE_SHAPES.SLIM) {
        return [
            new THREE.Vector2(body.radiusBottom * 0.84, -halfHeight),
            new THREE.Vector2(body.radiusBottom, -halfHeight + 0.07),
            new THREE.Vector2(body.radiusMid, -halfHeight + 0.28),
            new THREE.Vector2(body.radiusTop * 1.03, halfHeight - 0.16),
            new THREE.Vector2(body.radiusTop * 0.92, halfHeight),
        ];
    }

    return [
        new THREE.Vector2(body.radiusBottom * 0.78, -halfHeight),
        new THREE.Vector2(body.radiusBottom, -halfHeight + 0.08),
        new THREE.Vector2(body.radiusMid * 1.02, -halfHeight + 0.24),
        new THREE.Vector2(body.radiusMid, -halfHeight + body.height * 0.58),
        new THREE.Vector2(body.radiusTop * 1.08, halfHeight - 0.22),
        new THREE.Vector2(body.radiusTop * 0.94, halfHeight),
    ];
}

function createBottleBody(shape, materials, options) {
    const points = createBottleProfile(shape, options);

    return createLatheMesh({
        name: "SodaBottleBody",
        points,
        segments: 128,
        material: createBottlePlasticMaterial(materials, options),
    });
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

    mesh.position.y = -shape.body.height / 2 - bottom.height * 0.15;
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

    const topY = shape.body.height / 2 + 0.035;
    const material = createStandardMaterial({
        name: "CanPullTabMaterial",
        color: "#d9d3c4",
        roughness: 0.26,
        metalness: 0.55,
    });

    const tab = new THREE.Mesh(
        new THREE.TorusGeometry(0.07, 0.012, 10, 36),
        material,
    );
    tab.name = "CanPullTab";
    tab.position.set(0.04, topY, 0.02);
    tab.rotation.x = Math.PI / 2;
    tab.scale.set(1.35, 0.72, 1);

    const groove = new THREE.Mesh(
        new THREE.TorusGeometry(shape.cap.radius * 0.72, 0.006, 8, 80),
        material.clone(),
    );
    groove.name = "CanTopGroove";
    groove.position.y = topY - 0.004;
    groove.rotation.x = Math.PI / 2;

    group.add(groove, tab);
    return group;
}

function createCapRidges(shape, materials, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleCapRidges";

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

    const baseY = shape.body.height / 2 + shape.neck.height + shape.cap.height + 0.03;

    const nozzle = createCylinderMesh({
        name: "SportNozzleBody",
        radiusTop: 0.088,
        radiusBottom: 0.118,
        height: 0.12,
        radialSegments: 56,
        material,
    });
    nozzle.position.y = baseY;

    const top = createCylinderMesh({
        name: "SportNozzleTop",
        radiusTop: 0.052,
        radiusBottom: 0.074,
        height: 0.08,
        radialSegments: 56,
        material: material.clone(),
    });
    top.position.y = baseY + 0.09;

    group.add(nozzle, top);
    return group;
}

function createGripGrooves(shape, materials, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleGripGrooves";

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
        groove.position.y = -shape.body.height * 0.24 + index * 0.16;

        setMeshShadow(groove, true, true);
        group.add(groove);
    }

    return group;
}

function createBottleLiquid(shape, materials, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleLiquidGroup";
    group.visible = Boolean(options.showLiquid && options.bottleShape !== BOTTLE_SHAPES.CAN);

    if (!group.visible) {
        return group;
    }

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
    label.renderOrder = 8;
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

    material.opacity = 0.85;
    material.transparent = true;

    const label = new THREE.Mesh(
        new THREE.PlaneGeometry(labelData.width * 0.82, labelData.height * 0.72, 8, 1),
        material,
    );

    label.name = "SodaBottleBackLabel";
    label.position.set(0, labelData.y - 0.012, -labelData.z);
    label.rotation.y = Math.PI;
    label.renderOrder = 8;
    label.visible = Boolean(options.showBackLabel);

    return label;
}

function createBottleHighlights(shape, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleHighlights";
    group.visible = Boolean(options.showHighlights);

    const material = new THREE.MeshBasicMaterial({
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
    main.renderOrder = 9;

    const side = new THREE.Mesh(
        new THREE.PlaneGeometry(0.032, height * 0.42),
        material.clone(),
    );

    side.name = "BottleSideHighlight";
    side.material.opacity = options.highlightIntensity * 0.58;
    side.position.set(shape.body.radiusMid * 0.52, shape.body.height * 0.14, shape.body.radiusMid + 0.014);
    side.rotation.z = 0.08;
    side.renderOrder = 9;

    group.add(main, side);
    return group;
}

function createBubbles(shape, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleBubbles";
    group.visible = Boolean(options.showBubbles && options.bubbles && options.bottleShape !== BOTTLE_SHAPES.CAN);

    if (!group.visible) {
        return group;
    }

    const count = Math.max(0, Number(options.bubbleCount) || 0);

    if (!count) return group;

    const geometry = new THREE.SphereGeometry(0.026, 10, 6);
    const material = new THREE.MeshBasicMaterial({
        name: "BottleBubbleMaterial",
        color: "#ffffff",
        transparent: true,
        opacity: options.beverageType === BEVERAGE_TYPES.COLA ? 0.28 : 0.44,
        depthWrite: false,
    });

    const instanced = new THREE.InstancedMesh(geometry, material, count);
    instanced.name = "SodaBubbleInstances";

    const dummy = new THREE.Object3D();
    const data = [];

    for (let index = 0; index < count; index += 1) {
        const angle = index * 2.399963;
        const radius = 0.035 + (index % 6) * 0.024;
        const y = -shape.body.height * 0.38 + (index / count) * shape.body.height * 0.76;

        const position = new THREE.Vector3(
            Math.cos(angle) * radius,
            y,
            Math.sin(angle) * radius,
        );

        const scale = 0.42 + (index % 4) * 0.15;

        dummy.position.copy(position);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();

        instanced.setMatrixAt(index, dummy.matrix);
        data.push({
            base: position,
            scale,
            phase: index * 0.61,
        });
    }

    instanced.instanceMatrix.needsUpdate = true;
    instanced.userData.bubbles = data;
    instanced.userData.speed = options.carbonationSpeed;

    group.add(instanced);
    return group;
}

function createCondensation(shape, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleCondensation";
    group.visible = Boolean(options.showCondensation && options.condensation);

    if (!group.visible) return group;

    const count = Math.max(0, Number(options.dropletCount) || 0);
    if (!count) return group;

    const geometry = new THREE.SphereGeometry(0.015, 8, 6);
    const material = new THREE.MeshBasicMaterial({
        name: "BottleCondensationMaterial",
        color: "#ffffff",
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
    });

    const instanced = new THREE.InstancedMesh(geometry, material, count);
    instanced.name = "BottleCondensationInstances";

    const dummy = new THREE.Object3D();
    const data = [];

    for (let index = 0; index < count; index += 1) {
        const angle = index * 2.131;
        const y = -shape.body.height * 0.42 + ((index * 37) % count) / count * shape.body.height * 0.84;
        const radius = shape.body.radiusMid + 0.018;
        const scale = 0.45 + (index % 5) * 0.12;

        const position = new THREE.Vector3(
            Math.cos(angle) * radius,
            y,
            Math.sin(angle) * radius,
        );

        dummy.position.copy(position);
        dummy.scale.set(0.85 * scale, 1.25 * scale, 0.85 * scale);
        dummy.updateMatrix();

        instanced.setMatrixAt(index, dummy.matrix);
        data.push({
            base: position,
            scale,
            phase: index * 0.37,
        });
    }

    instanced.instanceMatrix.needsUpdate = true;
    instanced.userData.droplets = data;

    group.add(instanced);
    return group;
}

function createBaseRing(shape, materials, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleBaseRing";
    group.visible = Boolean(options.showBaseRing);

    if (!group.visible || options.bottleShape === BOTTLE_SHAPES.CAN) {
        return group;
    }

    const material = createBottlePlasticMaterial(materials, {
        ...options,
        bottleOpacity: Math.min(options.bottleOpacity + 0.14, 0.82),
    });

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(shape.body.radiusBottom * 0.82, 0.014, 10, 96),
        material,
    );

    ring.name = "BottleBottomSupportRing";
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -shape.body.height / 2 + 0.015;

    group.add(ring);
    return group;
}

function createBottleShadow(shape, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleSoftShadow";
    group.visible = Boolean(options.showShadow);

    const geometry = new THREE.CircleGeometry(0.72, 64);
    const material = new THREE.MeshBasicMaterial({
        name: "BottleSoftShadowMaterial",
        color: "#000000",
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        side: THREE.DoubleSide,
    });

    const shadow = new THREE.Mesh(geometry, material);
    shadow.name = "BottleContactShadow";
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -shape.body.height / 2 - 0.04;
    shadow.scale.set(0.75, 1.85, 1);

    group.add(shadow);
    return group;
}

function createAxisMarker(shape) {
    const group = new THREE.Group();
    group.name = "SodaBottleInternalAxis";
    group.visible = false;

    const axis = new THREE.Mesh(
        new THREE.CylinderGeometry(0.006, 0.006, shape.totalHeight, 8),
        new THREE.MeshBasicMaterial({
            color: "#ff00ff",
            transparent: true,
            opacity: 0.35,
        }),
    );

    group.add(axis);
    return group;
}

function applyDefaultSceneScale(group, options) {
    const scale = options.sceneScale ?? 1;

    group.scale.multiplyScalar(scale);

    if (options.orientation === BOTTLE_ORIENTATION.HORIZONTAL) {
        group.rotation.z = Math.PI / 2;
    }

    return group;
}

function createBottleMetadata(options, shape) {
    return {
        objectType: "SodaBottle",
        version: SODA_BOTTLE_VERSION,
        beverageType: options.beverageType,
        bottleShape: options.bottleShape,
        renderMode: options.renderMode,
        orientation: options.orientation,
        dimensions: {
            totalHeight: shape.totalHeight,
            maxRadius: shape.body.radiusMid,
            approximateLength: shape.totalHeight,
            approximateDiameter: shape.body.radiusMid * 2,
        },
        editable: true,
        createdAt: new Date().toISOString(),
    };
}

export function createSodaBottle(config = {}, materials = {}, textureSet = {}) {
    const options = normalizeBottleOptions(config);
    const shape = getShapePreset(options);

    const group = new THREE.Group();
    group.name = "SodaBottle";
    group.visible = options.showBottle !== false;
    group.userData = createBottleMetadata(options, shape);

    const body = createBottleBody(shape, materials, options);
    const bottom = createBottleBottom(shape, materials, options);
    const neck = createBottleNeck(shape, materials, options);
    const cap = createBottleCap(shape, materials, options);
    const capRidges = createCapRidges(shape, materials, options);
    const sportNozzle = createSportNozzle(shape, materials, options);
    const canTop = createCanTopDetail(shape, materials, options);
    const gripGrooves = createGripGrooves(shape, materials, options);
    const liquid = createBottleLiquid(shape, materials, options);
    const label = createBottleLabel(shape, options, textureSet);
    const backLabel = createBottleBackLabel(shape, options, textureSet);
    const highlights = createBottleHighlights(shape, options);
    const bubbles = createBubbles(shape, options);
    const condensation = createCondensation(shape, options);
    const baseRing = createBaseRing(shape, materials, options);
    const shadow = createBottleShadow(shape, options);
    const axis = createAxisMarker(shape);

    group.add(
        shadow,
        body,
        bottom,
        liquid,
        neck,
        cap,
        capRidges,
        sportNozzle,
        canTop,
        gripGrooves,
        label,
        backLabel,
        highlights,
        bubbles,
        condensation,
        baseRing,
        axis,
    );

    applyDefaultSceneScale(group, options);
    setGroupShadow(group, true, true);

    group.userData.parts = {
        body: body.name,
        bottom: bottom.name,
        liquid: liquid.name,
        neck: neck.name,
        cap: cap.name,
        label: label.name,
        backLabel: backLabel.name,
        bubbles: bubbles.name,
        condensation: condensation.name,
    };

    return group;
}

export function updateSodaBottleAnimation(sodaBottle, elapsedTime = 0) {
    if (!sodaBottle) return;

    const bubbles = sodaBottle.getObjectByName("SodaBubbleInstances");
    const droplets = sodaBottle.getObjectByName("BottleCondensationInstances");
    const highlight = sodaBottle.getObjectByName("BottleMainHighlight");

    if (bubbles?.isInstancedMesh && Array.isArray(bubbles.userData.bubbles)) {
        const dummy = new THREE.Object3D();
        const speed = bubbles.userData.speed ?? 0.55;

        bubbles.userData.bubbles.forEach((item, index) => {
            const yOffset = Math.sin(elapsedTime * speed + item.phase) * 0.018;
            const xOffset = Math.cos(elapsedTime * speed * 0.72 + item.phase) * 0.006;

            dummy.position.set(
                item.base.x + xOffset,
                item.base.y + yOffset,
                item.base.z,
            );
            dummy.scale.setScalar(item.scale);
            dummy.updateMatrix();

            bubbles.setMatrixAt(index, dummy.matrix);
        });

        bubbles.instanceMatrix.needsUpdate = true;
    }

    if (droplets?.isInstancedMesh && Array.isArray(droplets.userData.droplets)) {
        const dummy = new THREE.Object3D();

        droplets.userData.droplets.forEach((item, index) => {
            const slide = Math.sin(elapsedTime * 0.22 + item.phase) * 0.004;

            dummy.position.set(
                item.base.x,
                item.base.y - Math.abs(slide),
                item.base.z,
            );
            dummy.scale.set(0.85 * item.scale, 1.25 * item.scale, 0.85 * item.scale);
            dummy.updateMatrix();

            droplets.setMatrixAt(index, dummy.matrix);
        });

        droplets.instanceMatrix.needsUpdate = true;
    }

    if (highlight?.material) {
        highlight.material.opacity =
            0.22 + Math.sin(elapsedTime * 1.2) * 0.035;
    }
}

export function updateSodaBottleLabel(sodaBottle, options = {}, textureSet = {}) {
    if (!sodaBottle) return null;

    const normalized = normalizeBottleOptions({
        beverage: {
            ...sodaBottle.userData,
            ...options,
        },
    });

    const labelMaterial = createLabelMaterial(normalized, textureSet);
    const label = sodaBottle.getObjectByName("SodaBottleLabel");
    const backLabel = sodaBottle.getObjectByName("SodaBottleBackLabel");

    if (label?.material) {
        disposeMaterial(label.material);
        label.material = labelMaterial;
    }

    if (backLabel?.material) {
        disposeMaterial(backLabel.material);
        backLabel.material = labelMaterial.clone();
        backLabel.material.opacity = 0.85;
    }

    sodaBottle.userData = {
        ...sodaBottle.userData,
        labelText: normalized.labelText,
        subLabel: normalized.subLabel,
        footerText: normalized.footerText,
        beverageType: normalized.beverageType,
        updatedAt: new Date().toISOString(),
    };

    return sodaBottle;
}

export function setSodaBottleVisibility(sodaBottle, visible = true) {
    if (!sodaBottle) return;

    sodaBottle.visible = Boolean(visible);
    sodaBottle.userData.visible = Boolean(visible);
}

export function setSodaBottleLiquidVisibility(sodaBottle, visible = true) {
    const liquid = sodaBottle?.getObjectByName("SodaBottleLiquidGroup");

    if (!liquid) return;

    liquid.visible = Boolean(visible);
}

export function setSodaBottleCondensationVisibility(sodaBottle, visible = true) {
    const condensation = sodaBottle?.getObjectByName("SodaBottleCondensation");

    if (!condensation) return;

    condensation.visible = Boolean(visible);
}

export function setSodaBottleBubblesVisibility(sodaBottle, visible = true) {
    const bubbles = sodaBottle?.getObjectByName("SodaBottleBubbles");

    if (!bubbles) return;

    bubbles.visible = Boolean(visible);
}

export function getSodaBottleParts(sodaBottle) {
    if (!sodaBottle) return {};

    return {
        body: sodaBottle.getObjectByName("SodaBottleBody"),
        bottom: sodaBottle.getObjectByName("SodaBottleBottomRing"),
        neck: sodaBottle.getObjectByName("SodaBottleNeck"),
        cap: sodaBottle.getObjectByName("SodaBottleCap"),
        capRidges: sodaBottle.getObjectByName("SodaBottleCapRidges"),
        sportNozzle: sodaBottle.getObjectByName("SodaBottleSportNozzle"),
        canTop: sodaBottle.getObjectByName("CanTopDetail"),
        gripGrooves: sodaBottle.getObjectByName("SodaBottleGripGrooves"),
        liquid: sodaBottle.getObjectByName("SodaBottleLiquidGroup"),
        label: sodaBottle.getObjectByName("SodaBottleLabel"),
        backLabel: sodaBottle.getObjectByName("SodaBottleBackLabel"),
        highlights: sodaBottle.getObjectByName("SodaBottleHighlights"),
        bubbles: sodaBottle.getObjectByName("SodaBottleBubbles"),
        condensation: sodaBottle.getObjectByName("SodaBottleCondensation"),
        baseRing: sodaBottle.getObjectByName("SodaBottleBaseRing"),
        shadow: sodaBottle.getObjectByName("SodaBottleSoftShadow"),
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

export function disposeSodaBottle(sodaBottle) {
    if (!sodaBottle) return;

    sodaBottle.traverse((object) => {
        if (object.geometry?.dispose) {
            object.geometry.dispose();
        }

        if (object.material) {
            disposeMaterial(object.material);
        }
    });

    sodaBottle.removeFromParent();
}

export const SodaBottle = Object.freeze({
    version: SODA_BOTTLE_VERSION,
    orientation: BOTTLE_ORIENTATION,
    renderMode: BOTTLE_RENDER_MODE,
    shapes: BOTTLE_SHAPES,

    createSodaBottle,
    updateSodaBottleAnimation,
    updateSodaBottleLabel,
    setSodaBottleVisibility,
    setSodaBottleLiquidVisibility,
    setSodaBottleCondensationVisibility,
    setSodaBottleBubblesVisibility,
    getSodaBottleParts,
    disposeSodaBottle,
});
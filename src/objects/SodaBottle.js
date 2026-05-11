import * as THREE from "three";

import {
    BEVERAGE_TYPES,
    getBeverage,
} from "../config/beverageCatalog.js";

import {
    applyTransform,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

const DEFAULT_BOTTLE_OPTIONS = {
    beverageType: BEVERAGE_TYPES.CUSTOM,
    labelText: "KICKOFF DRINK",
    subLabel: "Custom 2026",
    footerText: "Detalle académico",
    liquidColor: "#2f86c7",
    liquidOpacity: 0.68,
    bottleTint: "#f2eee7",
    bottleOpacity: 0.52,
    capColor: "#f4f1e8",
    labelBackground: "#fff7e8",
    labelTextColor: "#2b2118",
    labelAccent: "#c59a4a",
    secondaryAccent: "#b92d2d",
    pattern: "custom",
    bottleShape: "classic",
    materialMode: "plastic-clear",
    bubbles: true,
    bubbleCount: 20,
    condensation: false,
    dropletCount: 0,
    carbonationSpeed: 1,
    highlightIntensity: 0.36,
    showLiquid: true,
    showBubbles: true,
    showCondensation: true,
    showLabel: true,
    showBackLabel: true,
    showHighlights: true,
    showBaseRing: true,
    showShadow: true,
};

const SHAPE_PRESETS = {
    classic: {
        body: {
            radiusTop: 0.25,
            radiusBottom: 0.31,
            height: 1.45,
        },
        neck: {
            radiusTop: 0.16,
            radiusBottom: 0.2,
            height: 0.38,
        },
        cap: {
            radius: 0.18,
            height: 0.16,
        },
        label: {
            width: 0.82,
            height: 0.45,
            y: 0.05,
            z: 0.314,
        },
    },

    water: {
        body: {
            radiusTop: 0.22,
            radiusBottom: 0.28,
            height: 1.58,
        },
        neck: {
            radiusTop: 0.145,
            radiusBottom: 0.18,
            height: 0.42,
        },
        cap: {
            radius: 0.165,
            height: 0.15,
        },
        label: {
            width: 0.74,
            height: 0.38,
            y: 0.02,
            z: 0.286,
        },
    },

    sport: {
        body: {
            radiusTop: 0.24,
            radiusBottom: 0.3,
            height: 1.55,
        },
        neck: {
            radiusTop: 0.15,
            radiusBottom: 0.2,
            height: 0.46,
        },
        cap: {
            radius: 0.18,
            height: 0.19,
        },
        label: {
            width: 0.84,
            height: 0.42,
            y: 0.02,
            z: 0.307,
        },
    },

    slim: {
        body: {
            radiusTop: 0.22,
            radiusBottom: 0.235,
            height: 1.62,
        },
        neck: {
            radiusTop: 0.14,
            radiusBottom: 0.16,
            height: 0.28,
        },
        cap: {
            radius: 0.15,
            height: 0.13,
        },
        label: {
            width: 0.7,
            height: 0.62,
            y: 0.02,
            z: 0.238,
        },
    },
};

function normalizeOptions(options = {}) {
    const catalogConfig = getBeverage(options.beverageType ?? options.type);

    return {
        ...DEFAULT_BOTTLE_OPTIONS,
        ...catalogConfig,
        ...options,
        beverageType: catalogConfig.id,
    };
}

function getShapePreset(options) {
    return SHAPE_PRESETS[options.bottleShape] ?? SHAPE_PRESETS.classic;
}

function createFallbackMaterial({
    color = "#ffffff",
    roughness = 0.5,
    metalness = 0,
    transparent = false,
    opacity = 1,
} = {}) {
    return new THREE.MeshStandardMaterial({
        color,
        roughness,
        metalness,
        transparent,
        opacity,
    });
}

function cloneMaterial(source, fallbackOptions = {}) {
    if (source?.clone) return source.clone();

    return createFallbackMaterial(fallbackOptions);
}

function createLatheMesh({
    name,
    points,
    segments = 96,
    material,
}) {
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
}) {
    const geometry = new THREE.CylinderGeometry(
        radiusTop,
        radiusBottom,
        height,
        radialSegments,
    );

    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;

    setMeshShadow(mesh, true, true);

    return mesh;
}

function createSphereMesh({
    name,
    radius,
    widthSegments = 24,
    heightSegments = 12,
    material,
}) {
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;

    setMeshShadow(mesh, true, true);

    return mesh;
}

function createBottleMaterial(materials, options) {
    const material = cloneMaterial(materials?.sodaBottle, {
        color: options.bottleTint,
        roughness: 0.08,
        metalness: 0.02,
        transparent: true,
        opacity: options.bottleOpacity,
    });

    material.name = "BeverageBottlePlasticMaterial";
    material.color.set(options.bottleTint);
    material.transparent = true;
    material.opacity = options.bottleOpacity;

    if ("roughness" in material) material.roughness = 0.08;
    if ("metalness" in material) material.metalness = options.materialMode === "metallic" ? 0.42 : 0.02;

    if ("transmission" in material) material.transmission = options.materialMode === "metallic" ? 0.04 : 0.42;
    if ("thickness" in material) material.thickness = 0.45;
    if ("ior" in material) material.ior = 1.46;
    if ("clearcoat" in material) material.clearcoat = 0.55;
    if ("clearcoatRoughness" in material) material.clearcoatRoughness = 0.08;
    if ("envMapIntensity" in material) material.envMapIntensity = 1.35;

    material.needsUpdate = true;

    return material;
}

function createLiquidMaterial(materials, options) {
    const material = cloneMaterial(materials?.sodaBottle, {
        color: options.liquidColor,
        roughness: 0.16,
        metalness: 0,
        transparent: true,
        opacity: options.liquidOpacity,
    });

    material.name = "BeverageLiquidMaterial";
    material.color.set(options.liquidColor);
    material.transparent = true;
    material.opacity = options.liquidOpacity;

    if ("roughness" in material) material.roughness = 0.16;
    if ("metalness" in material) material.metalness = 0;
    if ("transmission" in material) material.transmission = 0.12;
    if ("thickness" in material) material.thickness = 0.24;
    if ("clearcoat" in material) material.clearcoat = 0.18;
    if ("clearcoatRoughness" in material) material.clearcoatRoughness = 0.14;

    material.needsUpdate = true;

    return material;
}

function createCapMaterial(materials, options) {
    const material = cloneMaterial(materials?.sodaCap, {
        color: options.capColor,
        roughness: 0.42,
        metalness: 0.08,
    });

    material.name = "BeverageCapMaterial";
    material.color.set(options.capColor);

    if ("roughness" in material) material.roughness = options.materialMode === "metallic" ? 0.24 : 0.42;
    if ("metalness" in material) material.metalness = options.materialMode === "metallic" ? 0.46 : 0.08;

    material.needsUpdate = true;

    return material;
}

function createBottleBody(config, materials, options) {
    const shape = getShapePreset(options);
    const body = config?.contentLayout?.soda?.body ?? shape.body;
    const halfHeight = body.height / 2;

    const pointsByShape = {
        classic: [
            new THREE.Vector2(body.radiusBottom * 0.78, -halfHeight),
            new THREE.Vector2(body.radiusBottom, -halfHeight + 0.08),
            new THREE.Vector2(body.radiusBottom * 1.04, -halfHeight + 0.25),
            new THREE.Vector2(body.radiusBottom * 1.02, -halfHeight + body.height * 0.62),
            new THREE.Vector2(body.radiusTop * 1.06, halfHeight - 0.22),
            new THREE.Vector2(body.radiusTop * 0.94, halfHeight),
        ],

        water: [
            new THREE.Vector2(body.radiusBottom * 0.72, -halfHeight),
            new THREE.Vector2(body.radiusBottom, -halfHeight + 0.1),
            new THREE.Vector2(body.radiusBottom * 1.02, -halfHeight + 0.36),
            new THREE.Vector2(body.radiusBottom * 0.94, -halfHeight + body.height * 0.66),
            new THREE.Vector2(body.radiusTop * 1.02, halfHeight - 0.24),
            new THREE.Vector2(body.radiusTop * 0.9, halfHeight),
        ],

        sport: [
            new THREE.Vector2(body.radiusBottom * 0.75, -halfHeight),
            new THREE.Vector2(body.radiusBottom * 1.02, -halfHeight + 0.1),
            new THREE.Vector2(body.radiusBottom * 0.94, -halfHeight + 0.42),
            new THREE.Vector2(body.radiusBottom * 1.06, -halfHeight + body.height * 0.58),
            new THREE.Vector2(body.radiusTop * 1.03, halfHeight - 0.25),
            new THREE.Vector2(body.radiusTop * 0.88, halfHeight),
        ],

        slim: [
            new THREE.Vector2(body.radiusBottom * 0.86, -halfHeight),
            new THREE.Vector2(body.radiusBottom, -halfHeight + 0.08),
            new THREE.Vector2(body.radiusBottom * 1.02, -halfHeight + 0.38),
            new THREE.Vector2(body.radiusTop * 1.02, halfHeight - 0.16),
            new THREE.Vector2(body.radiusTop * 0.94, halfHeight),
        ],
    };

    const points = pointsByShape[options.bottleShape] ?? pointsByShape.classic;

    return createLatheMesh({
        name: "SodaBottleBody",
        points,
        segments: 112,
        material: createBottleMaterial(materials, options),
    });
}

function createBottleShoulder(config, materials, options) {
    const shape = getShapePreset(options);
    const body = config?.contentLayout?.soda?.body ?? shape.body;

    const shoulder = createSphereMesh({
        name: "SodaBottleShoulder",
        radius: body.radiusBottom,
        widthSegments: 56,
        heightSegments: 18,
        material: createBottleMaterial(materials, options),
    });

    shoulder.position.y = body.height / 2 - 0.02;
    shoulder.scale.set(1, options.bottleShape === "slim" ? 0.22 : 0.34, 1);

    return shoulder;
}

function createBottleGripGrooves(config, materials, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleGripGrooves";

    if (!["water", "sport"].includes(options.bottleShape)) {
        return group;
    }

    const shape = getShapePreset(options);
    const body = config?.contentLayout?.soda?.body ?? shape.body;

    const material = createBottleMaterial(materials, {
        ...options,
        bottleOpacity: Math.max(options.bottleOpacity - 0.12, 0.2),
    });

    const grooveCount = options.bottleShape === "sport" ? 5 : 4;

    for (let index = 0; index < grooveCount; index += 1) {
        const groove = new THREE.Mesh(
            new THREE.TorusGeometry(body.radiusBottom * 0.98, 0.008, 8, 72),
            material,
        );

        groove.name = `BottleGripGroove_${index + 1}`;
        groove.rotation.x = Math.PI / 2;
        groove.position.y = -body.height * 0.24 + index * 0.16;

        setMeshShadow(groove, true, true);
        group.add(groove);
    }

    return group;
}

function createBottleNeck(config, materials, options) {
    const shape = getShapePreset(options);
    const body = config?.contentLayout?.soda?.body ?? shape.body;
    const neck = config?.contentLayout?.soda?.neck ?? shape.neck;

    const neckMesh = createCylinderMesh({
        name: "SodaBottleNeck",
        radiusTop: neck.radiusTop,
        radiusBottom: neck.radiusBottom,
        height: neck.height,
        radialSegments: 72,
        material: createBottleMaterial(materials, options),
    });

    neckMesh.position.y = body.height / 2 + neck.height / 2 - 0.02;

    return neckMesh;
}

function createBottleCap(config, materials, options) {
    const shape = getShapePreset(options);
    const body = config?.contentLayout?.soda?.body ?? shape.body;
    const neck = config?.contentLayout?.soda?.neck ?? shape.neck;
    const capData = shape.cap;

    const cap = createCylinderMesh({
        name: "SodaBottleCap",
        radiusTop: capData.radius,
        radiusBottom: capData.radius,
        height: capData.height,
        radialSegments: 72,
        material: createCapMaterial(materials, options),
    });

    cap.position.y = body.height / 2 + neck.height + capData.height * 0.32;

    return cap;
}

function createCapRidges(config, materials, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleCapRidges";

    const shape = getShapePreset(options);
    const body = config?.contentLayout?.soda?.body ?? shape.body;
    const neck = config?.contentLayout?.soda?.neck ?? shape.neck;
    const capData = shape.cap;

    const ridgeCount = options.bottleShape === "sport" ? 24 : 18;
    const material = createCapMaterial(materials, options);
    const y = body.height / 2 + neck.height + capData.height * 0.32;

    for (let index = 0; index < ridgeCount; index += 1) {
        const angle = (index / ridgeCount) * Math.PI * 2;

        const ridge = createCylinderMesh({
            name: `CapRidge_${index + 1}`,
            radiusTop: 0.008,
            radiusBottom: 0.009,
            height: capData.height * 0.9,
            radialSegments: 8,
            material,
        });

        ridge.position.set(
            Math.cos(angle) * (capData.radius + 0.006),
            y,
            Math.sin(angle) * (capData.radius + 0.006),
        );

        ridge.rotation.z = Math.PI / 2;
        ridge.rotation.y = -angle;

        group.add(ridge);
    }

    return group;
}

function createSportNozzle(config, materials, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleSportNozzle";

    if (options.bottleShape !== "sport") {
        return group;
    }

    const shape = getShapePreset(options);
    const body = config?.contentLayout?.soda?.body ?? shape.body;
    const neck = config?.contentLayout?.soda?.neck ?? shape.neck;
    const capData = shape.cap;

    const material = createCapMaterial(materials, {
        ...options,
        capColor: "#f7f7f7",
    });

    const y = body.height / 2 + neck.height + capData.height + 0.03;

    const nozzle = createCylinderMesh({
        name: "SportNozzleBody",
        radiusTop: 0.09,
        radiusBottom: 0.12,
        height: 0.12,
        radialSegments: 48,
        material,
    });

    nozzle.position.y = y;

    const top = createCylinderMesh({
        name: "SportNozzleTop",
        radiusTop: 0.055,
        radiusBottom: 0.075,
        height: 0.08,
        radialSegments: 48,
        material,
    });

    top.position.y = y + 0.09;

    group.add(nozzle, top);

    return group;
}

function createBottleLiquid(config, materials, options) {
    const shape = getShapePreset(options);
    const body = config?.contentLayout?.soda?.body ?? shape.body;

    const liquidHeight =
        options.materialMode === "metallic"
            ? body.height * 0.76
            : body.height * 0.68;

    const liquid = createCylinderMesh({
        name: "SodaBottleLiquid",
        radiusTop: body.radiusTop * 0.88,
        radiusBottom: body.radiusBottom * 0.86,
        height: liquidHeight,
        radialSegments: 72,
        material: createLiquidMaterial(materials, options),
    });

    liquid.position.y = -body.height * 0.08;
    liquid.renderOrder = 1;

    const topSurface = new THREE.Mesh(
        new THREE.CircleGeometry(body.radiusTop * 0.88, 72),
        liquid.material,
    );

    topSurface.name = "SodaLiquidTopSurface";
    topSurface.rotation.x = -Math.PI / 2;
    topSurface.position.y = liquid.position.y + liquidHeight / 2;
    topSurface.renderOrder = 2;

    setMeshShadow(topSurface, false, false);

    const group = new THREE.Group();
    group.name = "SodaLiquidGroup";
    group.visible = options.showLiquid;

    group.add(liquid, topSurface);

    return group;
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

function drawLabelPattern(ctx, canvas, options) {
    const width = canvas.width;
    const height = canvas.height;

    if (options.pattern === "premium") {
        ctx.strokeStyle = "rgba(214, 180, 92, 0.32)";
        ctx.lineWidth = 6;

        for (let index = -8; index < 18; index += 1) {
            ctx.beginPath();
            ctx.moveTo(index * 90, height);
            ctx.lineTo(index * 90 + 320, 0);
            ctx.stroke();
        }

        return;
    }

    if (options.pattern === "citrus") {
        ctx.fillStyle = "rgba(244, 123, 32, 0.16)";

        for (let index = 0; index < 12; index += 1) {
            const x = 80 + index * 90;
            const y = 90 + Math.sin(index) * 40;

            ctx.beginPath();
            ctx.arc(x, y, 38, 0, Math.PI * 2);
            ctx.fill();
        }

        return;
    }

    if (options.pattern === "fresh") {
        ctx.strokeStyle = "rgba(47, 125, 85, 0.24)";
        ctx.lineWidth = 8;

        for (let index = 0; index < 9; index += 1) {
            ctx.beginPath();
            ctx.arc(120 + index * 120, height / 2, 70, 0, Math.PI);
            ctx.stroke();
        }

        return;
    }

    if (options.pattern === "water" || options.pattern === "mineral") {
        ctx.strokeStyle = "rgba(47, 134, 199, 0.22)";
        ctx.lineWidth = 6;

        for (let index = 0; index < 7; index += 1) {
            ctx.beginPath();
            ctx.moveTo(0, 120 + index * 45);
            ctx.bezierCurveTo(
                width * 0.25,
                80 + index * 55,
                width * 0.75,
                160 + index * 35,
                width,
                110 + index * 45,
            );
            ctx.stroke();
        }

        return;
    }

    if (options.pattern === "sport") {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
        ctx.lineWidth = 7;

        for (let index = -2; index < 10; index += 1) {
            ctx.beginPath();
            ctx.moveTo(index * 150, height);
            ctx.lineTo(index * 150 + 260, 0);
            ctx.stroke();
        }

        return;
    }

    if (options.pattern === "energy") {
        ctx.strokeStyle = "rgba(226, 255, 63, 0.34)";
        ctx.lineWidth = 8;

        for (let index = 0; index < 7; index += 1) {
            const startX = 80 + index * 130;

            ctx.beginPath();
            ctx.moveTo(startX, 80);
            ctx.lineTo(startX + 50, 210);
            ctx.lineTo(startX + 10, 210);
            ctx.lineTo(startX + 80, 410);
            ctx.stroke();
        }
    }
}

function createLabelTexture(options) {
    const canvas = document.createElement("canvas");
    canvas.width = 1400;
    canvas.height = 620;

    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, options.labelBackground);
    gradient.addColorStop(0.58, options.labelBackground);
    gradient.addColorStop(1, options.labelAccent);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawLabelPattern(ctx, canvas, options);

    ctx.fillStyle = options.secondaryAccent;
    ctx.fillRect(0, 0, canvas.width, 54);

    ctx.fillStyle = options.labelAccent;
    ctx.fillRect(0, 54, canvas.width, 54);

    ctx.strokeStyle = options.labelAccent;
    ctx.lineWidth = 14;
    drawRoundedRect(ctx, 54, 150, canvas.width - 108, 330, 42);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.38)";
    ctx.lineWidth = 6;
    drawRoundedRect(ctx, 82, 178, canvas.width - 164, 274, 30);
    ctx.stroke();

    ctx.fillStyle = options.labelTextColor;
    ctx.font = "bold 112px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(options.labelText, canvas.width / 2, 285);

    ctx.font = "bold 48px Arial";
    ctx.fillText(options.subLabel, canvas.width / 2, 382);

    ctx.fillStyle = options.labelAccent;
    ctx.font = "bold 32px Arial";
    ctx.fillText(options.footerText, canvas.width / 2, 540);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    return texture;
}

function createBottleLabel(config, options) {
    const shape = getShapePreset(options);
    const labelData = shape.label;

    const texture = createLabelTexture(options);

    const material = new THREE.MeshBasicMaterial({
        name: "SodaBottleLabelMaterial",
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
    });

    material.userData = {
        texture,
        labelText: options.labelText,
        subLabel: options.subLabel,
        beverageType: options.beverageType,
    };

    const label = new THREE.Mesh(
        new THREE.PlaneGeometry(labelData.width, labelData.height),
        material,
    );

    label.name = "SodaBottleLabel";
    label.position.set(0, labelData.y, labelData.z);
    label.renderOrder = 8;

    return label;
}

function createBottleBackLabel(config, options) {
    const shape = getShapePreset(options);
    const labelData = shape.label;

    const texture = createLabelTexture({
        ...options,
        labelText: options.shortLabel?.toUpperCase?.() ?? "KICK",
        subLabel: "KickOff Box",
        footerText: "Personalizado",
    });

    const material = new THREE.MeshBasicMaterial({
        name: "SodaBottleBackLabelMaterial",
        map: texture,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
    });

    const label = new THREE.Mesh(
        new THREE.PlaneGeometry(labelData.width * 0.86, labelData.height * 0.78),
        material,
    );

    label.name = "SodaBottleBackLabel";
    label.position.set(0, labelData.y - 0.01, -labelData.z);
    label.rotation.y = Math.PI;
    label.renderOrder = 8;

    return label;
}

function createBottleHighlights(options) {
    const group = new THREE.Group();
    group.name = "SodaBottleHighlights";

    const highlightMaterial = new THREE.MeshBasicMaterial({
        name: "BottleHighlightMaterial",
        color: "#ffffff",
        transparent: true,
        opacity: options.highlightIntensity,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    const mainHighlight = new THREE.Mesh(
        new THREE.PlaneGeometry(0.055, 1.22),
        highlightMaterial,
    );

    mainHighlight.name = "BottleMainHighlight";
    mainHighlight.position.set(-0.18, 0.04, 0.318);
    mainHighlight.rotation.z = -0.05;
    mainHighlight.renderOrder = 9;

    const sideHighlight = new THREE.Mesh(
        new THREE.PlaneGeometry(0.034, 0.52),
        highlightMaterial.clone(),
    );

    sideHighlight.name = "BottleSideHighlight";
    sideHighlight.material.opacity = options.highlightIntensity * 0.62;
    sideHighlight.position.set(0.16, 0.38, 0.32);
    sideHighlight.rotation.z = 0.08;
    sideHighlight.renderOrder = 9;

    group.add(mainHighlight, sideHighlight);

    return group;
}

function createBottleBubbles(config, materials, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleBubbles";
    group.visible = Boolean(options.bubbles && options.showBubbles);

    const count = options.bubbleCount ?? 0;

    if (!count) return group;

    const geometry = new THREE.SphereGeometry(0.035, 12, 8);
    const material = new THREE.MeshBasicMaterial({
        name: "BottleBubbleMaterial",
        color: "#ffffff",
        transparent: true,
        opacity: options.beverageType === BEVERAGE_TYPES.COLA ? 0.28 : 0.42,
        depthWrite: false,
    });

    const instanced = new THREE.InstancedMesh(geometry, material, count);
    instanced.name = "SodaBubbleInstances";

    const dummy = new THREE.Object3D();
    const data = [];

    for (let index = 0; index < count; index += 1) {
        const angle = index * 2.399963;
        const radius = 0.04 + (index % 5) * 0.025;
        const y = -0.55 + (index / count) * 1.04;

        const position = new THREE.Vector3(
            Math.cos(angle) * radius,
            y,
            Math.sin(angle) * radius,
        );

        const scale = 0.45 + (index % 4) * 0.16;

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

function createCondensationDrops(config, materials, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleCondensation";
    group.visible = Boolean(options.condensation && options.showCondensation);

    const count = options.dropletCount ?? 0;

    if (!count) return group;

    const geometry = new THREE.SphereGeometry(0.018, 10, 6);
    const material = new THREE.MeshBasicMaterial({
        name: "BottleCondensationMaterial",
        color: "#ffffff",
        transparent: true,
        opacity: 0.34,
        depthWrite: false,
    });

    const drops = new THREE.InstancedMesh(geometry, material, count);
    drops.name = "CondensationDropInstances";

    const dummy = new THREE.Object3D();

    for (let index = 0; index < count; index += 1) {
        const angle = index * 2.17;
        const y = -0.5 + ((index * 37) % 100) / 100;
        const radius = 0.275 + Math.sin(index) * 0.018;

        dummy.position.set(
            Math.cos(angle) * radius,
            y,
            Math.sin(angle) * radius,
        );

        const scale = 0.45 + ((index * 13) % 6) * 0.08;
        dummy.scale.set(scale * 0.72, scale, scale * 0.72);

        dummy.updateMatrix();
        drops.setMatrixAt(index, dummy.matrix);
    }

    drops.instanceMatrix.needsUpdate = true;

    group.add(drops);

    return group;
}

function createBottleBaseRing(materials, options) {
    const shape = getShapePreset(options);
    const body = shape.body;

    const ringMaterial =
        materials?.gold ??
        createFallbackMaterial({
            color: options.labelAccent,
            roughness: 0.32,
            metalness: 0.35,
        });

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(body.radiusBottom * 0.94, 0.022, 12, 72),
        ringMaterial,
    );

    ring.name = "SodaBottleBaseRing";
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -body.height / 2 - 0.004;
    ring.visible = options.showBaseRing;

    setMeshShadow(ring, true, true);

    return ring;
}

function createBottleContactShadow(materials, options) {
    const shape = getShapePreset(options);

    const shadowMaterial =
        materials?.shadowSoft ??
        new THREE.MeshBasicMaterial({
            color: "#000000",
            transparent: true,
            opacity: 0.24,
            side: THREE.DoubleSide,
        });

    const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(shape.body.radiusBottom * 1.55, 56),
        shadowMaterial,
    );

    shadow.name = "SodaBottleContactShadow";
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -shape.body.height / 2 - 0.03;
    shadow.scale.set(1.2, 0.72, 1);
    shadow.visible = options.showShadow;

    return shadow;
}

function createBottleAssembly(config, materials, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleAssembly";

    const contactShadow = createBottleContactShadow(materials, options);
    const liquid = createBottleLiquid(config, materials, options);
    const body = createBottleBody(config, materials, options);
    const shoulder = createBottleShoulder(config, materials, options);
    const grooves = createBottleGripGrooves(config, materials, options);
    const neck = createBottleNeck(config, materials, options);
    const cap = createBottleCap(config, materials, options);
    const capRidges = createCapRidges(config, materials, options);
    const sportNozzle = createSportNozzle(config, materials, options);
    const label = createBottleLabel(config, options);
    const backLabel = createBottleBackLabel(config, options);
    const highlights = createBottleHighlights(options);
    const bubbles = createBottleBubbles(config, materials, options);
    const condensation = createCondensationDrops(config, materials, options);
    const baseRing = createBottleBaseRing(materials, options);

    label.visible = options.showLabel;
    backLabel.visible = options.showBackLabel;
    highlights.visible = options.showHighlights;

    group.add(
        contactShadow,
        liquid,
        body,
        shoulder,
        grooves,
        neck,
        cap,
        capRidges,
        sportNozzle,
        label,
        backLabel,
        highlights,
        bubbles,
        condensation,
        baseRing,
    );

    return group;
}

function disposeObjectResources(object) {
    const disposedGeometries = new Set();
    const disposedMaterials = new Set();
    const disposedTextures = new Set();

    object.traverse((child) => {
        if (child.geometry && !disposedGeometries.has(child.geometry)) {
            child.geometry.dispose();
            disposedGeometries.add(child.geometry);
        }

        if (child.material) {
            const materials = Array.isArray(child.material)
                ? child.material
                : [child.material];

            materials.forEach((material) => {
                if (material.map && !disposedTextures.has(material.map)) {
                    material.map.dispose();
                    disposedTextures.add(material.map);
                }

                if (!disposedMaterials.has(material)) {
                    material.dispose();
                    disposedMaterials.add(material);
                }
            });
        }
    });
}

function replaceAssembly(bottleGroup, config, materials, options) {
    const oldAssembly = bottleGroup.getObjectByName("SodaBottleAssembly");

    if (oldAssembly) {
        disposeObjectResources(oldAssembly);
        bottleGroup.remove(oldAssembly);
    }

    const nextAssembly = createBottleAssembly(config, materials, options);
    bottleGroup.add(nextAssembly);

    bottleGroup.userData.options = options;
    bottleGroup.userData.config = config;
    bottleGroup.userData.materials = materials;
}

export function createSodaBottle(config, materials, options = {}) {
    const mergedOptions = normalizeOptions({
        labelText: config?.contentLayout?.soda?.label,
        ...options,
    });

    const group = new THREE.Group();
    group.name = "KickOffBoxSodaBottle";

    const assembly = createBottleAssembly(config, materials, mergedOptions);
    group.add(assembly);

    const layout = config?.contentLayout?.soda ?? {};

    applyTransform(group, {
        position: layout.position ?? [0.82, 0.55, 0.42],
        rotation: layout.rotation ?? [0, 0, Math.PI / 2],
        scale: layout.scale ?? [0.78, 0.78, 0.78],
    });

    group.userData = {
        type: "soda-bottle",
        editable: true,
        draggable: true,
        rotatable: true,
        scalable: true,
        visibleInPresets: ["estandar", "premium"],
        minScale: 0.45,
        maxScale: 1.25,
        description: "Bebida personalizable para acompañar el presente académico.",
        options: mergedOptions,
        config,
        materials,
    };

    setGroupShadow(group, true, true);

    return group;
}

export function setSodaBottleType(bottleGroup, beverageType = BEVERAGE_TYPES.CUSTOM, overrides = {}) {
    if (!bottleGroup) return;

    const currentOptions = bottleGroup.userData?.options ?? DEFAULT_BOTTLE_OPTIONS;
    const config = bottleGroup.userData?.config ?? {};
    const materials = bottleGroup.userData?.materials ?? {};

    const nextOptions = normalizeOptions({
        ...currentOptions,
        beverageType,
        ...overrides,
    });

    replaceAssembly(bottleGroup, config, materials, nextOptions);
}

export function updateSodaBottleLabel(bottleGroup, nextLabel = {}) {
    if (!bottleGroup) return;

    const currentOptions = bottleGroup.userData?.options ?? DEFAULT_BOTTLE_OPTIONS;
    const config = bottleGroup.userData?.config ?? {};
    const materials = bottleGroup.userData?.materials ?? {};

    const nextOptions = normalizeOptions({
        ...currentOptions,
        ...nextLabel,
    });

    replaceAssembly(bottleGroup, config, materials, nextOptions);
}

export function updateSodaBottleColors(bottleGroup, colors = {}) {
    if (!bottleGroup) return;

    const currentOptions = bottleGroup.userData?.options ?? DEFAULT_BOTTLE_OPTIONS;
    const config = bottleGroup.userData?.config ?? {};
    const materials = bottleGroup.userData?.materials ?? {};

    const nextOptions = normalizeOptions({
        ...currentOptions,
        liquidColor: colors.liquid ?? currentOptions.liquidColor,
        capColor: colors.cap ?? currentOptions.capColor,
        bottleTint: colors.bottle ?? currentOptions.bottleTint,
        labelAccent: colors.labelAccent ?? currentOptions.labelAccent,
        labelBackground: colors.labelBackground ?? currentOptions.labelBackground,
    });

    replaceAssembly(bottleGroup, config, materials, nextOptions);
}

export function setSodaBottleVisibility(bottleGroup, visible = true) {
    if (!bottleGroup) return;

    bottleGroup.visible = Boolean(visible);
}

export function setSodaBottleBubblesVisibility(bottleGroup, visible = true) {
    const bubbles = bottleGroup?.getObjectByName("SodaBottleBubbles");

    if (!bubbles) return;

    bubbles.visible = Boolean(visible);
}

export function setSodaBottleLiquidVisibility(bottleGroup, visible = true) {
    const liquid = bottleGroup?.getObjectByName("SodaLiquidGroup");

    if (!liquid) return;

    liquid.visible = Boolean(visible);
}

export function setSodaBottleCondensationVisibility(bottleGroup, visible = true) {
    const condensation = bottleGroup?.getObjectByName("SodaBottleCondensation");

    if (!condensation) return;

    condensation.visible = Boolean(visible);
}

export function setSodaBottleTransform(
    bottleGroup,
    {
        position,
        rotation,
        scale,
    } = {},
) {
    if (!bottleGroup) return;

    if (position) bottleGroup.position.set(position[0], position[1], position[2]);
    if (rotation) bottleGroup.rotation.set(rotation[0], rotation[1], rotation[2]);
    if (scale) bottleGroup.scale.set(scale[0], scale[1], scale[2]);
}

export function animateSodaBottle(bottleGroup, elapsedTime = 0) {
    if (!bottleGroup) return;

    const options = bottleGroup.userData?.options ?? DEFAULT_BOTTLE_OPTIONS;
    const bubbles = bottleGroup.getObjectByName("SodaBubbleInstances");
    const highlights = bottleGroup.getObjectByName("SodaBottleHighlights");
    const condensation = bottleGroup.getObjectByName("CondensationDropInstances");

    if (bubbles?.visible && bubbles.userData?.bubbles) {
        const dummy = new THREE.Object3D();
        const data = bubbles.userData.bubbles;
        const speed = bubbles.userData.speed ?? options.carbonationSpeed ?? 1;

        data.forEach((bubble, index) => {
            const rise = (elapsedTime * 0.13 * speed + index * 0.013) % 1.05;
            const y = -0.55 + rise;
            const wobble = Math.sin(elapsedTime * 1.5 + bubble.phase) * 0.012;

            dummy.position.set(
                bubble.base.x + wobble,
                y,
                bubble.base.z + Math.cos(elapsedTime + bubble.phase) * 0.01,
            );

            const pulse = bubble.scale * (1 + Math.sin(elapsedTime * 2 + bubble.phase) * 0.08);
            dummy.scale.setScalar(pulse);
            dummy.updateMatrix();

            bubbles.setMatrixAt(index, dummy.matrix);
        });

        bubbles.instanceMatrix.needsUpdate = true;
    }

    if (condensation?.visible) {
        condensation.rotation.y = Math.sin(elapsedTime * 0.18) * 0.018;
    }

    if (highlights?.visible) {
        highlights.rotation.y = Math.sin(elapsedTime * 0.45) * 0.035;

        const main = highlights.getObjectByName("BottleMainHighlight");
        const side = highlights.getObjectByName("BottleSideHighlight");

        if (main?.material) {
            main.material.opacity =
                options.highlightIntensity +
                Math.sin(elapsedTime * 1.2) * 0.045;
        }

        if (side?.material) {
            side.material.opacity =
                options.highlightIntensity * 0.58 +
                Math.cos(elapsedTime * 1.05) * 0.026;
        }
    }
}

export function getSodaBottleParts(bottleGroup) {
    if (!bottleGroup) return {};

    return {
        assembly: bottleGroup.getObjectByName("SodaBottleAssembly"),
        body: bottleGroup.getObjectByName("SodaBottleBody"),
        shoulder: bottleGroup.getObjectByName("SodaBottleShoulder"),
        grooves: bottleGroup.getObjectByName("SodaBottleGripGrooves"),
        neck: bottleGroup.getObjectByName("SodaBottleNeck"),
        cap: bottleGroup.getObjectByName("SodaBottleCap"),
        capRidges: bottleGroup.getObjectByName("SodaBottleCapRidges"),
        sportNozzle: bottleGroup.getObjectByName("SodaBottleSportNozzle"),
        liquid: bottleGroup.getObjectByName("SodaLiquidGroup"),
        label: bottleGroup.getObjectByName("SodaBottleLabel"),
        backLabel: bottleGroup.getObjectByName("SodaBottleBackLabel"),
        highlights: bottleGroup.getObjectByName("SodaBottleHighlights"),
        bubbles: bottleGroup.getObjectByName("SodaBottleBubbles"),
        bubbleInstances: bottleGroup.getObjectByName("SodaBubbleInstances"),
        condensation: bottleGroup.getObjectByName("SodaBottleCondensation"),
        condensationInstances: bottleGroup.getObjectByName("CondensationDropInstances"),
        baseRing: bottleGroup.getObjectByName("SodaBottleBaseRing"),
        shadow: bottleGroup.getObjectByName("SodaBottleContactShadow"),
    };
}

export function disposeSodaBottle(bottleGroup) {
    if (!bottleGroup) return;

    disposeObjectResources(bottleGroup);
    bottleGroup.removeFromParent();
}
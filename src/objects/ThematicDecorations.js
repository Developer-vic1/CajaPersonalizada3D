import * as THREE from "three";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import {
    applyTransform,
    getBoxDimensions,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

const DEFAULT_DECORATION_OPTIONS = {
    theme: "kickoff-2026",
    showFrontPlate: true,
    showLidPlate: true,
    showTechLines: true,
    showPixelArc: true,
    showFieldLines: true,
    showTricolorRibbon: true,
    showWorldCupBadge: true,
    showFloatingNodes: true,
    frontText: "Presente Académico",
    lidText: "KickOff Box",
    lidSubtitle: "Mundial 2026 · Proyecto · Defensa",
    badgeText: "2026",
    accentColor: "#c59a4a",
    darkColor: "#2b2118",
    red: "#b92d2d",
    yellow: "#f0c84b",
    green: "#2f7d55",
};

function createBasicMaterial({
    name,
    color,
    transparent = false,
    opacity = 1,
    side = THREE.DoubleSide,
    blending = THREE.NormalBlending,
}) {
    const material = new THREE.MeshBasicMaterial({
        name,
        color,
        transparent,
        opacity,
        side,
        blending,
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

function createRoundedMesh({
    name,
    width,
    height,
    depth,
    radius = 0.035,
    segments = 4,
    material,
}) {
    const safeRadius = Math.min(radius, width / 2, height / 2, depth / 2);

    const geometry = new RoundedBoxGeometry(
        width,
        height,
        depth,
        segments,
        safeRadius,
    );

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;

    setMeshShadow(mesh, true, true);

    return mesh;
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

function drawFootballField(ctx, width, height) {
    ctx.save();

    ctx.strokeStyle = "rgba(43, 33, 24, 0.16)";
    ctx.lineWidth = 8;

    ctx.strokeRect(90, 90, width - 180, height - 180);

    ctx.beginPath();
    ctx.moveTo(width / 2, 90);
    ctx.lineTo(width / 2, height - 90);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 120, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeRect(90, height / 2 - 145, 170, 290);
    ctx.strokeRect(width - 260, height / 2 - 145, 170, 290);

    ctx.restore();
}

function drawCircuitLines(ctx, width, height, color = "rgba(43, 33, 24, 0.2)") {
    ctx.save();

    ctx.strokeStyle = color;
    ctx.fillStyle = "rgba(197, 154, 74, 0.72)";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const paths = [
        [[140, 210], [260, 210], [315, 265], [390, 265]],
        [[width - 140, 210], [width - 270, 210], [width - 330, 275], [width - 410, 275]],
        [[160, height - 210], [280, height - 210], [335, height - 270], [410, height - 270]],
        [[width - 160, height - 210], [width - 280, height - 210], [width - 345, height - 280], [width - 430, height - 280]],
        [[width / 2 - 260, 170], [width / 2 - 150, 170], [width / 2 - 105, 215]],
        [[width / 2 + 260, 170], [width / 2 + 150, 170], [width / 2 + 105, 215]],
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

function createPlateTexture({
    title,
    subtitle,
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
    bg.addColorStop(0.55, "#fff1d7");
    bg.addColorStop(1, "#e7c18d");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const identity = ctx.createLinearGradient(0, 0, width, 0);
    identity.addColorStop(0, "rgba(185, 45, 45, 0.16)");
    identity.addColorStop(0.5, "rgba(240, 200, 75, 0.22)");
    identity.addColorStop(1, "rgba(47, 125, 85, 0.16)");

    ctx.fillStyle = identity;
    ctx.fillRect(0, 0, width, height);

    if (options.showFieldLines) {
        drawFootballField(ctx, width, height);
    }

    if (options.showTechLines) {
        drawCircuitLines(ctx, width, height);
    }

    ctx.fillStyle = options.red;
    ctx.fillRect(0, 0, width, 52);

    ctx.fillStyle = options.yellow;
    ctx.fillRect(0, 52, width, 52);

    ctx.fillStyle = options.green;
    ctx.fillRect(0, 104, width, 52);

    ctx.strokeStyle = "rgba(122, 79, 42, 0.42)";
    ctx.lineWidth = 18;
    drawRoundedRect(ctx, 80, 190, width - 160, height - 260, 48);
    ctx.stroke();

    ctx.strokeStyle = options.accentColor;
    ctx.lineWidth = 8;
    drawRoundedRect(ctx, 120, 230, width - 240, height - 340, 36);
    ctx.stroke();

    ctx.fillStyle = "#7a1e1e";
    ctx.font = "bold 112px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(title, width / 2, height / 2 - 35);

    ctx.fillStyle = options.darkColor;
    ctx.font = "bold 46px Arial";
    ctx.fillText(subtitle, width / 2, height / 2 + 78);

    ctx.fillStyle = "rgba(43, 33, 24, 0.66)";
    ctx.font = "30px Arial";
    ctx.fillText("Fútbol · Tecnología · Identidad académica", width / 2, height - 92);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

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
    bg.addColorStop(0.45, "#f0c84b");
    bg.addColorStop(1, "#b96f20");

    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(450, 450, 410, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(43, 33, 24, 0.42)";
    ctx.lineWidth = 22;
    ctx.beginPath();
    ctx.arc(450, 450, 390, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 18;

    for (let index = 0; index < 7; index += 1) {
        const angle = (index / 7) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(450, 450);
        ctx.lineTo(450 + Math.cos(angle) * 360, 450 + Math.sin(angle) * 360);
        ctx.stroke();
    }

    ctx.fillStyle = "#7a1e1e";
    ctx.font = "bold 190px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(options.badgeText, 450, 410);

    ctx.fillStyle = options.darkColor;
    ctx.font = "bold 58px Arial";
    ctx.fillText("KICKOFF BOX", 450, 580);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    return texture;
}

function createFrontPlate(config, materials, options) {
    const box = getBoxDimensions(config);

    const material = new THREE.MeshBasicMaterial({
        name: "FrontThematicPlateMaterial",
        map: createPlateTexture({
            title: options.frontText,
            subtitle: "Defensa · Proyecto · Reconocimiento",
            width: 1600,
            height: 700,
            options,
        }),
        transparent: true,
        side: THREE.DoubleSide,
    });

    const plate = new THREE.Mesh(
        new THREE.PlaneGeometry(2.75, 1.02),
        material,
    );

    plate.name = "FrontThematicPlate";
    plate.position.set(0, box.floorHeight + box.height * 0.58, box.depth / 2 + 0.082);
    plate.renderOrder = 8;

    return plate;
}

function createLidPlate(config, materials, options) {
    const box = getBoxDimensions(config);

    const material = new THREE.MeshBasicMaterial({
        name: "LidThematicPlateMaterial",
        map: createPlateTexture({
            title: options.lidText,
            subtitle: options.lidSubtitle,
            width: 1600,
            height: 900,
            options,
        }),
        transparent: true,
        side: THREE.DoubleSide,
    });

    const plate = new THREE.Mesh(
        new THREE.PlaneGeometry(3.2, 1.8),
        material,
    );

    plate.name = "LidThematicPlate";
    plate.rotation.x = -Math.PI / 2;
    plate.position.set(0, box.floorHeight + box.height + 0.36, 0);
    plate.renderOrder = 9;

    return plate;
}

function createWorldCupBadge(config, materials, options) {
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
    badge.position.set(-2.85, 1.68, -1.75);
    badge.renderOrder = 9;

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.43, 0.018, 12, 72),
        materials.gold,
    );

    ring.name = "WorldCupBadgeRing";
    ring.rotation.x = Math.PI / 2;
    ring.position.copy(badge.position);
    ring.position.y += 0.006;

    const group = new THREE.Group();
    group.name = "WorldCupBadgeGroup";
    group.add(badge, ring);

    setGroupShadow(group, true, true);

    return group;
}

function createTricolorRibbon(config, materials, options) {
    const box = getBoxDimensions(config);
    const group = new THREE.Group();
    group.name = "ThematicTricolorRibbon";

    const ribbonMaterials = [
        materials.boliviaRed,
        materials.boliviaYellow,
        materials.boliviaGreen,
    ];

    const baseY = box.floorHeight + box.height + 0.13;
    const z = box.depth / 2 + 0.12;

    ribbonMaterials.forEach((material, index) => {
        const strip = createRoundedMesh({
            name: `TricolorRibbonStrip_${index + 1}`,
            width: box.width * 0.78,
            height: 0.035,
            depth: 0.055,
            radius: 0.012,
            segments: 3,
            material,
        });

        strip.position.set(0, baseY + index * 0.055, z);
        group.add(strip);
    });

    return group;
}

function createTechCurveMaterial(options) {
    return createBasicMaterial({
        name: "TechCurveMaterial",
        color: options.accentColor,
        transparent: true,
        opacity: 0.76,
        side: THREE.DoubleSide,
    });
}

function createTechLines(config, materials, options) {
    const group = new THREE.Group();
    group.name = "ThematicTechLines";

    const material = createTechCurveMaterial(options);

    const curves = [
        [
            [-3.2, 0.72, -2.05],
            [-2.5, 0.9, -1.75],
            [-1.65, 0.78, -1.52],
            [-0.9, 0.95, -1.18],
        ],
        [
            [3.1, 0.78, -2.0],
            [2.45, 0.96, -1.62],
            [1.72, 0.82, -1.38],
            [0.88, 1.02, -1.05],
        ],
        [
            [-3.0, 0.75, 2.0],
            [-2.25, 0.92, 1.6],
            [-1.35, 0.82, 1.25],
            [-0.55, 0.98, 0.95],
        ],
        [
            [3.0, 0.75, 2.0],
            [2.25, 0.92, 1.6],
            [1.35, 0.82, 1.25],
            [0.55, 0.98, 0.95],
        ],
    ];

    curves.forEach((points, index) => {
        const curve = new THREE.CatmullRomCurve3(
            points.map((point) => new THREE.Vector3(point[0], point[1], point[2])),
            false,
            "centripetal",
            0.45,
        );

        const line = new THREE.Mesh(
            new THREE.TubeGeometry(curve, 28, 0.011, 8, false),
            material,
        );

        line.name = `TechCircuitLine_${index + 1}`;
        setMeshShadow(line, false, false);
        group.add(line);

        const end = points[points.length - 1];

        const node = new THREE.Mesh(
            new THREE.SphereGeometry(0.055, 16, 8),
            materials.gold,
        );

        node.name = `TechCircuitNode_${index + 1}`;
        node.position.set(end[0], end[1], end[2]);
        setMeshShadow(node, true, true);
        group.add(node);
    });

    return group;
}

function createPixelArc(options) {
    const group = new THREE.Group();
    group.name = "ThematicPixelArc";

    const count = 52;
    const geometry = new THREE.BoxGeometry(0.06, 0.012, 0.06);
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

    for (let index = 0; index < count; index += 1) {
        const t = index / (count - 1);
        const angle = Math.PI * (0.1 + t * 0.86);
        const radius = 2.2 + Math.sin(t * Math.PI) * 0.4;

        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius - 1.3;
        const y = 1.62 + Math.sin(t * Math.PI) * 0.38;

        dummy.position.set(x, y, z);
        dummy.rotation.set(
            Math.sin(index * 0.6) * 0.45,
            angle,
            Math.cos(index * 0.3) * 0.45,
        );
        dummy.scale.setScalar(0.8 + Math.sin(index * 1.7) * 0.25);
        dummy.updateMatrix();

        instanced.setMatrixAt(index, dummy.matrix);
    }

    instanced.instanceMatrix.needsUpdate = true;
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
        opacity: 0.26,
    });

    const centerLine = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, 0.01, box.depth * 0.72),
        material,
    );

    centerLine.name = "FieldCenterLine";
    centerLine.position.set(0, box.floorHeight + 0.03, 0);

    const centerCircle = new THREE.Mesh(
        new THREE.TorusGeometry(0.65, 0.012, 8, 72),
        material,
    );

    centerCircle.name = "FieldCenterCircle";
    centerCircle.rotation.x = Math.PI / 2;
    centerCircle.position.set(0, box.floorHeight + 0.035, 0);

    const leftArea = new THREE.Mesh(
        new THREE.BoxGeometry(0.95, 0.01, 0.035),
        material,
    );

    leftArea.name = "FieldLeftMark";
    leftArea.position.set(-box.width * 0.34, box.floorHeight + 0.032, 0);

    const rightArea = leftArea.clone();
    rightArea.name = "FieldRightMark";
    rightArea.position.x = box.width * 0.34;

    group.add(centerLine, centerCircle, leftArea, rightArea);

    return group;
}

function createFloatingNodes(materials, options) {
    const group = new THREE.Group();
    group.name = "ThematicFloatingNodes";

    const nodeMaterial = createBasicMaterial({
        name: "FloatingNodeMaterial",
        color: options.accentColor,
        transparent: true,
        opacity: 0.82,
    });

    const lineMaterial = createBasicMaterial({
        name: "FloatingNodeLineMaterial",
        color: "#ffffff",
        transparent: true,
        opacity: 0.38,
    });

    const nodes = [
        [-2.8, 1.85, -1.2],
        [-2.05, 2.05, -0.65],
        [-1.15, 1.82, -0.42],
        [1.1, 1.9, -0.5],
        [2.0, 2.08, -0.88],
        [2.82, 1.82, -1.32],
    ];

    nodes.forEach((position, index) => {
        const node = new THREE.Mesh(
            new THREE.SphereGeometry(0.045, 16, 8),
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
            new THREE.TubeGeometry(curve, 2, 0.006, 6, false),
            lineMaterial,
        );

        line.name = `FloatingNodeLine_${index + 1}`;
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

export function createThematicDecorations(config, materials = {}, options = {}) {
    const mergedOptions = {
        ...DEFAULT_DECORATION_OPTIONS,
        ...options,
    };

    const group = new THREE.Group();
    group.name = "KickOffBoxThematicDecorations";

    if (mergedOptions.showFrontPlate) {
        group.add(createFrontPlate(config, materials, mergedOptions));
    }

    if (mergedOptions.showLidPlate) {
        group.add(createLidPlate(config, materials, mergedOptions));
    }

    if (mergedOptions.showWorldCupBadge) {
        group.add(createWorldCupBadge(config, materials, mergedOptions));
    }

    if (mergedOptions.showTricolorRibbon) {
        group.add(createTricolorRibbon(config, materials, mergedOptions));
    }

    if (mergedOptions.showTechLines) {
        group.add(createTechLines(config, materials, mergedOptions));
    }

    if (mergedOptions.showPixelArc) {
        group.add(createPixelArc(mergedOptions));
    }

    if (mergedOptions.showFieldLines) {
        group.add(createFieldLineOverlay(config, mergedOptions));
    }

    if (mergedOptions.showFloatingNodes) {
        group.add(createFloatingNodes(materials, mergedOptions));
    }

    group.userData = {
        type: "thematic-decorations",
        editable: true,
        visibleInPresets: ["basica", "estandar", "premium"],
        options: mergedOptions,
        description:
            "Decoración temática de KickOff Box: fútbol, tecnología, identidad tricolor y elementos académicos.",
    };

    setGroupShadow(group, true, true);

    return group;
}

export function updateThematicDecorationText(decorationsGroup, nextOptions = {}) {
    if (!decorationsGroup) return;

    decorationsGroup.userData.options = {
        ...(decorationsGroup.userData.options ?? DEFAULT_DECORATION_OPTIONS),
        ...nextOptions,
    };
}

export function setThematicDecorationVisibility(decorationsGroup, visible = true) {
    if (!decorationsGroup) return;

    decorationsGroup.visible = Boolean(visible);
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

    applyTransform(decorationsGroup, {
        position: position ?? decorationsGroup.position.toArray(),
        rotation: rotation ?? [
            decorationsGroup.rotation.x,
            decorationsGroup.rotation.y,
            decorationsGroup.rotation.z,
        ],
        scale: scale ?? decorationsGroup.scale.toArray(),
    });
}

export function animateThematicDecorations(decorationsGroup, elapsedTime = 0) {
    if (!decorationsGroup) return;

    const pixelArc = decorationsGroup.getObjectByName("ThematicPixelArc");
    const floatingNodes = decorationsGroup.getObjectByName("ThematicFloatingNodes");
    const badge = decorationsGroup.getObjectByName("WorldCupBadgeGroup");

    if (pixelArc) {
        pixelArc.rotation.y = Math.sin(elapsedTime * 0.25) * 0.025;
    }

    if (floatingNodes) {
        floatingNodes.children.forEach((child, index) => {
            if (child.name.startsWith("FloatingNode_")) {
                child.position.y += Math.sin(elapsedTime * 1.1 + index) * 0.0009;
            }
        });
    }

    if (badge) {
        badge.rotation.y = Math.sin(elapsedTime * 0.42) * 0.035;
    }
}

export function getThematicDecorationParts(decorationsGroup) {
    if (!decorationsGroup) return {};

    return {
        frontPlate: decorationsGroup.getObjectByName("FrontThematicPlate"),
        lidPlate: decorationsGroup.getObjectByName("LidThematicPlate"),
        worldCupBadge: decorationsGroup.getObjectByName("WorldCupBadgeGroup"),
        tricolorRibbon: decorationsGroup.getObjectByName("ThematicTricolorRibbon"),
        techLines: decorationsGroup.getObjectByName("ThematicTechLines"),
        pixelArc: decorationsGroup.getObjectByName("ThematicPixelArc"),
        fieldOverlay: decorationsGroup.getObjectByName("FootballFieldLineOverlay"),
        floatingNodes: decorationsGroup.getObjectByName("ThematicFloatingNodes"),
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

export function disposeThematicDecorations(decorationsGroup) {
    if (!decorationsGroup) return;

    decorationsGroup.traverse((object) => {
        if (object.geometry) {
            object.geometry.dispose();
        }

        if (object.material) {
            const materials = Array.isArray(object.material)
                ? object.material
                : [object.material];

            materials.forEach((material) => {
                if (material.map) material.map.dispose();
                material.dispose();
            });
        }
    });

    decorationsGroup.removeFromParent();
}
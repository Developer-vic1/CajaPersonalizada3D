import * as THREE from "three";

import {
    applyTransform,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

const DEFAULT_BOTTLE_OPTIONS = {
    labelText: "BOL",
    subLabel: "2026",
    liquidColor: "#2f86c7",
    capColor: "#f4f1e8",
    labelBackground: "#fff7e8",
    showLiquid: true,
    showBubbles: true,
    bubbleCount: 16,
};

function createLatheMesh({ name, points, segments = 64, material }) {
    const geometry = new THREE.LatheGeometry(points, segments);
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
    radialSegments = 48,
    material,
}) {
    const geometry = new THREE.CylinderGeometry(
        radiusTop,
        radiusBottom,
        height,
        radialSegments,
    );

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

function createBottleMaterial(materials) {
    const material = materials.sodaBottle.clone();

    material.name = "SodaBottlePlasticMaterial";
    material.transparent = true;
    material.opacity = 0.62;
    material.roughness = 0.08;
    material.metalness = 0.02;
    material.transmission = 0.42;
    material.thickness = 0.42;
    material.ior = 1.46;
    material.clearcoat = 0.45;
    material.clearcoatRoughness = 0.08;
    material.envMapIntensity = 1.25;
    material.needsUpdate = true;

    return material;
}

function createLiquidMaterial(materials, color) {
    const material = materials.sodaBottle.clone();

    material.name = "SodaLiquidMaterial";
    material.color.set(color);
    material.transparent = true;
    material.opacity = 0.82;
    material.roughness = 0.16;
    material.metalness = 0;
    material.transmission = 0.12;
    material.thickness = 0.25;
    material.clearcoat = 0.12;
    material.clearcoatRoughness = 0.16;
    material.needsUpdate = true;

    return material;
}

function createCapMaterial(materials, color) {
    const material = materials.sodaCap.clone();

    material.name = "SodaBottleCapMaterial";
    material.color.set(color);
    material.roughness = 0.42;
    material.metalness = 0.06;
    material.needsUpdate = true;

    return material;
}

function createBottleBody(config, materials) {
    const bottleMaterial = createBottleMaterial(materials);

    const body = config?.contentLayout?.soda?.body ?? {
        radiusTop: 0.25,
        radiusBottom: 0.31,
        height: 1.45,
    };

    const halfHeight = body.height / 2;

    const points = [
        new THREE.Vector2(body.radiusBottom * 0.78, -halfHeight),
        new THREE.Vector2(body.radiusBottom, -halfHeight + 0.08),
        new THREE.Vector2(body.radiusBottom * 1.04, -halfHeight + 0.25),
        new THREE.Vector2(body.radiusBottom * 1.02, -halfHeight + 0.92),
        new THREE.Vector2(body.radiusTop * 1.02, halfHeight - 0.2),
        new THREE.Vector2(body.radiusTop * 0.94, halfHeight),
    ];

    const bottle = createLatheMesh({
        name: "SodaBottleBody",
        points,
        segments: 96,
        material: bottleMaterial,
    });

    return bottle;
}

function createBottleShoulder(config, materials) {
    const bottleMaterial = createBottleMaterial(materials);

    const shoulder = createSphereMesh({
        name: "SodaBottleShoulder",
        radius: 0.31,
        widthSegments: 48,
        heightSegments: 16,
        material: bottleMaterial,
    });

    const body = config?.contentLayout?.soda?.body ?? { height: 1.45 };

    shoulder.position.y = body.height / 2 - 0.02;
    shoulder.scale.set(1, 0.34, 1);

    return shoulder;
}

function createBottleNeck(config, materials) {
    const bottleMaterial = createBottleMaterial(materials);

    const neck = config?.contentLayout?.soda?.neck ?? {
        radiusTop: 0.16,
        radiusBottom: 0.2,
        height: 0.38,
    };

    const neckMesh = createCylinderMesh({
        name: "SodaBottleNeck",
        radiusTop: neck.radiusTop,
        radiusBottom: neck.radiusBottom,
        height: neck.height,
        radialSegments: 64,
        material: bottleMaterial,
    });

    const body = config?.contentLayout?.soda?.body ?? { height: 1.45 };

    neckMesh.position.y = body.height / 2 + neck.height / 2 - 0.02;

    return neckMesh;
}

function createBottleCap(config, materials, options) {
    const capMaterial = createCapMaterial(
        materials,
        options.capColor ?? DEFAULT_BOTTLE_OPTIONS.capColor,
    );

    const cap = createCylinderMesh({
        name: "SodaBottleCap",
        radiusTop: 0.18,
        radiusBottom: 0.18,
        height: 0.16,
        radialSegments: 64,
        material: capMaterial,
    });

    const body = config?.contentLayout?.soda?.body ?? { height: 1.45 };
    const neck = config?.contentLayout?.soda?.neck ?? { height: 0.38 };

    cap.position.y = body.height / 2 + neck.height + 0.055;

    return cap;
}

function createCapRidges(config, materials, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleCapRidges";

    const capMaterial = createCapMaterial(
        materials,
        options.capColor ?? DEFAULT_BOTTLE_OPTIONS.capColor,
    );

    const ridgeCount = 18;
    const body = config?.contentLayout?.soda?.body ?? { height: 1.45 };
    const neck = config?.contentLayout?.soda?.neck ?? { height: 0.38 };
    const y = body.height / 2 + neck.height + 0.055;

    for (let index = 0; index < ridgeCount; index += 1) {
        const angle = (index / ridgeCount) * Math.PI * 2;

        const ridge = createCylinderMesh({
            name: `CapRidge_${index + 1}`,
            radiusTop: 0.009,
            radiusBottom: 0.009,
            height: 0.15,
            radialSegments: 8,
            material: capMaterial,
        });

        ridge.position.set(Math.cos(angle) * 0.185, y, Math.sin(angle) * 0.185);
        ridge.rotation.z = Math.PI / 2;
        ridge.rotation.y = -angle;

        group.add(ridge);
    }

    return group;
}

function createBottleLiquid(config, materials, options) {
    const liquidMaterial = createLiquidMaterial(
        materials,
        options.liquidColor ?? DEFAULT_BOTTLE_OPTIONS.liquidColor,
    );

    const body = config?.contentLayout?.soda?.body ?? {
        radiusTop: 0.25,
        radiusBottom: 0.31,
        height: 1.45,
    };

    const liquid = createCylinderMesh({
        name: "SodaBottleLiquid",
        radiusTop: body.radiusTop * 0.88,
        radiusBottom: body.radiusBottom * 0.86,
        height: body.height * 0.68,
        radialSegments: 64,
        material: liquidMaterial,
    });

    liquid.position.y = -body.height * 0.1;
    liquid.renderOrder = 1;

    const topSurface = new THREE.Mesh(
        new THREE.CircleGeometry(body.radiusTop * 0.88, 64),
        liquidMaterial,
    );

    topSurface.name = "SodaLiquidTopSurface";
    topSurface.rotation.x = -Math.PI / 2;
    topSurface.position.y = body.height * 0.24;
    topSurface.renderOrder = 2;

    setMeshShadow(topSurface, false, false);

    const group = new THREE.Group();
    group.name = "SodaLiquidGroup";
    group.add(liquid, topSurface);

    group.visible = options.showLiquid ?? true;

    return group;
}

function createLabelTexture(options) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;

    const ctx = canvas.getContext("2d");

    const colors = {
        background: options.labelBackground ?? DEFAULT_BOTTLE_OPTIONS.labelBackground,
        red: "#b92d2d",
        yellow: "#f0c84b",
        green: "#2f7d55",
        dark: "#2b2118",
        brown: "#7a4f2a",
        gold: "#c59a4a",
    };

    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "rgba(185, 45, 45, 0.22)");
    gradient.addColorStop(0.5, "rgba(240, 200, 75, 0.24)");
    gradient.addColorStop(1, "rgba(47, 125, 85, 0.22)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = colors.red;
    ctx.fillRect(0, 0, canvas.width, 60);

    ctx.fillStyle = colors.yellow;
    ctx.fillRect(0, 60, canvas.width, 60);

    ctx.fillStyle = colors.green;
    ctx.fillRect(0, 120, canvas.width, 60);

    ctx.strokeStyle = "rgba(122, 79, 42, 0.45)";
    ctx.lineWidth = 12;
    ctx.strokeRect(36, 205, canvas.width - 72, 230);

    ctx.fillStyle = colors.red;
    ctx.font = "bold 140px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(options.labelText ?? DEFAULT_BOTTLE_OPTIONS.labelText, canvas.width / 2, 315);

    ctx.fillStyle = colors.dark;
    ctx.font = "bold 52px Arial";
    ctx.fillText(options.subLabel ?? DEFAULT_BOTTLE_OPTIONS.subLabel, canvas.width / 2, 395);

    ctx.fillStyle = colors.brown;
    ctx.font = "28px Arial";
    ctx.fillText("Detalle académico", canvas.width / 2, 470);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    return texture;
}

function createBottleLabel(config, options) {
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
    };

    const label = new THREE.Mesh(
        new THREE.PlaneGeometry(0.82, 0.45),
        material,
    );

    label.name = "SodaBottleLabel";
    label.position.set(0, 0.05, 0.312);
    label.renderOrder = 5;

    return label;
}

function createBottleBackLabel(config, options) {
    const texture = createLabelTexture({
        ...options,
        labelText: "BOX",
        subLabel: "KICKOFF",
    });

    const material = new THREE.MeshBasicMaterial({
        name: "SodaBottleBackLabelMaterial",
        map: texture,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
    });

    const label = new THREE.Mesh(
        new THREE.PlaneGeometry(0.7, 0.36),
        material,
    );

    label.name = "SodaBottleBackLabel";
    label.position.set(0, 0.03, -0.313);
    label.rotation.y = Math.PI;
    label.renderOrder = 5;

    return label;
}

function createBottleHighlights(materials) {
    const group = new THREE.Group();
    group.name = "SodaBottleHighlights";

    const highlightMaterial = new THREE.MeshBasicMaterial({
        name: "BottleHighlightMaterial",
        color: "#ffffff",
        transparent: true,
        opacity: 0.32,
        side: THREE.DoubleSide,
    });

    const mainHighlight = new THREE.Mesh(
        new THREE.PlaneGeometry(0.055, 1.18),
        highlightMaterial,
    );

    mainHighlight.name = "BottleMainHighlight";
    mainHighlight.position.set(-0.18, 0.04, 0.315);
    mainHighlight.rotation.z = -0.05;
    mainHighlight.renderOrder = 6;

    const smallHighlight = new THREE.Mesh(
        new THREE.PlaneGeometry(0.035, 0.46),
        highlightMaterial.clone(),
    );

    smallHighlight.name = "BottleSmallHighlight";
    smallHighlight.material.opacity = 0.22;
    smallHighlight.position.set(0.16, 0.38, 0.318);
    smallHighlight.rotation.z = 0.08;
    smallHighlight.renderOrder = 6;

    group.add(mainHighlight, smallHighlight);

    return group;
}

function createBottleBubbles(config, materials, options) {
    const group = new THREE.Group();
    group.name = "SodaBottleBubbles";

    const bubbleMaterial = new THREE.MeshBasicMaterial({
        name: "BottleBubbleMaterial",
        color: "#ffffff",
        transparent: true,
        opacity: 0.42,
    });

    const count = options.bubbleCount ?? DEFAULT_BOTTLE_OPTIONS.bubbleCount;

    for (let index = 0; index < count; index += 1) {
        const angle = (index / count) * Math.PI * 2;
        const verticalSeed = Math.sin(index * 3.71);
        const radius = 0.06 + (index % 4) * 0.018;

        const bubble = createSphereMesh({
            name: `SodaBubble_${index + 1}`,
            radius,
            widthSegments: 12,
            heightSegments: 8,
            material: bubbleMaterial,
        });

        bubble.position.set(
            Math.cos(angle) * (0.07 + (index % 3) * 0.045),
            -0.52 + (index / count) * 0.95 + verticalSeed * 0.04,
            Math.sin(angle) * (0.07 + (index % 2) * 0.035),
        );

        bubble.visible = options.showBubbles ?? true;
        group.add(bubble);
    }

    return group;
}

function createBottleBaseRing(materials) {
    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.29, 0.025, 12, 64),
        materials.gold,
    );

    ring.name = "SodaBottleBaseRing";
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.735;

    setMeshShadow(ring, true, true);

    return ring;
}

function createBottleContactShadow(materials) {
    const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(0.46, 48),
        materials.shadowSoft,
    );

    shadow.name = "SodaBottleContactShadow";
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.755;
    shadow.scale.set(1, 0.72, 1);

    return shadow;
}

export function createSodaBottle(config, materials, options = {}) {
    const group = new THREE.Group();
    group.name = "KickOffBoxSodaBottle";

    const mergedOptions = {
        ...DEFAULT_BOTTLE_OPTIONS,
        labelText: config?.contentLayout?.soda?.label ?? DEFAULT_BOTTLE_OPTIONS.labelText,
        ...options,
    };

    const contactShadow = createBottleContactShadow(materials);
    const body = createBottleBody(config, materials);
    const shoulder = createBottleShoulder(config, materials);
    const neck = createBottleNeck(config, materials);
    const cap = createBottleCap(config, materials, mergedOptions);
    const capRidges = createCapRidges(config, materials, mergedOptions);
    const liquid = createBottleLiquid(config, materials, mergedOptions);
    const label = createBottleLabel(config, mergedOptions);
    const backLabel = createBottleBackLabel(config, mergedOptions);
    const highlights = createBottleHighlights(materials);
    const bubbles = createBottleBubbles(config, materials, mergedOptions);
    const baseRing = createBottleBaseRing(materials);

    group.add(
        contactShadow,
        liquid,
        body,
        shoulder,
        neck,
        cap,
        capRidges,
        label,
        backLabel,
        highlights,
        bubbles,
        baseRing,
    );

    const layout = config?.contentLayout?.soda ?? {};

    applyTransform(group, {
        position: layout.position ?? [1.25, 0.98, 0.9],
        rotation: layout.rotation ?? [0, 0, 0],
        scale: layout.scale ?? [1, 1, 1],
    });

    group.userData = {
        type: "soda-bottle",
        editable: true,
        visibleInPresets: ["estandar", "premium"],
        description: "Refresco pequeño como complemento del presente académico.",
        options: mergedOptions,
    };

    setGroupShadow(group, true, true);

    return group;
}

export function updateSodaBottleLabel(bottleGroup, nextLabel = {}) {
    if (!bottleGroup) return;

    const label = bottleGroup.getObjectByName("SodaBottleLabel");

    if (!label?.material) return;

    const oldTexture = label.material.map;
    const currentOptions = bottleGroup.userData?.options ?? DEFAULT_BOTTLE_OPTIONS;

    const updatedOptions = {
        ...currentOptions,
        ...nextLabel,
    };

    const nextTexture = createLabelTexture(updatedOptions);

    label.material.map = nextTexture;
    label.material.userData.texture = nextTexture;
    label.material.userData.labelText = updatedOptions.labelText;
    label.material.userData.subLabel = updatedOptions.subLabel;
    label.material.needsUpdate = true;

    if (oldTexture) {
        oldTexture.dispose();
    }

    bottleGroup.userData.options = updatedOptions;
}

export function updateSodaBottleColors(bottleGroup, colors = {}) {
    if (!bottleGroup) return;

    const liquidGroup = bottleGroup.getObjectByName("SodaLiquidGroup");
    const cap = bottleGroup.getObjectByName("SodaBottleCap");
    const capRidges = bottleGroup.getObjectByName("SodaBottleCapRidges");

    if (colors.liquid && liquidGroup) {
        liquidGroup.traverse((object) => {
            if (object.isMesh && object.material?.color) {
                object.material.color.set(colors.liquid);
                object.material.needsUpdate = true;
            }
        });
    }

    if (colors.cap && cap?.material?.color) {
        cap.material.color.set(colors.cap);
        cap.material.needsUpdate = true;
    }

    if (colors.cap && capRidges) {
        capRidges.traverse((object) => {
            if (object.isMesh && object.material?.color) {
                object.material.color.set(colors.cap);
                object.material.needsUpdate = true;
            }
        });
    }
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

export function animateSodaBottle(bottleGroup, elapsedTime = 0) {
    if (!bottleGroup) return;

    const bubbles = bottleGroup.getObjectByName("SodaBottleBubbles");
    const highlights = bottleGroup.getObjectByName("SodaBottleHighlights");

    if (bubbles?.visible) {
        bubbles.children.forEach((bubble, index) => {
            const baseY = bubble.userData.baseY ?? bubble.position.y;

            if (bubble.userData.baseY === undefined) {
                bubble.userData.baseY = bubble.position.y;
            }

            bubble.position.y =
                baseY + Math.sin(elapsedTime * 1.2 + index * 0.65) * 0.025;
        });
    }

    if (highlights) {
        highlights.rotation.y = Math.sin(elapsedTime * 0.45) * 0.035;
    }
}

export function getSodaBottleParts(bottleGroup) {
    if (!bottleGroup) return {};

    return {
        body: bottleGroup.getObjectByName("SodaBottleBody"),
        shoulder: bottleGroup.getObjectByName("SodaBottleShoulder"),
        neck: bottleGroup.getObjectByName("SodaBottleNeck"),
        cap: bottleGroup.getObjectByName("SodaBottleCap"),
        capRidges: bottleGroup.getObjectByName("SodaBottleCapRidges"),
        liquid: bottleGroup.getObjectByName("SodaLiquidGroup"),
        label: bottleGroup.getObjectByName("SodaBottleLabel"),
        backLabel: bottleGroup.getObjectByName("SodaBottleBackLabel"),
        highlights: bottleGroup.getObjectByName("SodaBottleHighlights"),
        bubbles: bottleGroup.getObjectByName("SodaBottleBubbles"),
        baseRing: bottleGroup.getObjectByName("SodaBottleBaseRing"),
        shadow: bottleGroup.getObjectByName("SodaBottleContactShadow"),
    };
}

export function disposeSodaBottle(bottleGroup) {
    if (!bottleGroup) return;

    bottleGroup.traverse((object) => {
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

    bottleGroup.removeFromParent();
}
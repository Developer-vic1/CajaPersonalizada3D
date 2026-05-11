import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import {
    getBoxDimensions,
    getLidDimensions,
    getLidPivotPosition,
    getLidMeshPosition,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

function createRoundedMesh({
    name,
    width,
    height,
    depth,
    radius = 0.08,
    segments = 5,
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

function createBoxMesh({ name, size, position, material }) {
    const [width, height, depth] = size;

    const geometry = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(geometry, material);

    mesh.name = name;
    mesh.position.set(position[0], position[1], position[2]);

    setMeshShadow(mesh, true, true);

    return mesh;
}

function createCanvasLabel({
    text,
    width = 1024,
    height = 384,
    background = "#fff7e8",
    color = "#7a1e1e",
    subtitle = "",
}) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "rgba(185, 45, 45, 0.14)");
    gradient.addColorStop(0.5, "rgba(240, 200, 75, 0.16)");
    gradient.addColorStop(1, "rgba(47, 125, 85, 0.14)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(122, 79, 42, 0.35)";
    ctx.lineWidth = 12;
    ctx.strokeRect(28, 28, width - 56, height - 56);

    ctx.fillStyle = color;
    ctx.font = "bold 76px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2 - 24);

    if (subtitle) {
        ctx.fillStyle = "#2b2118";
        ctx.font = "bold 34px Arial";
        ctx.fillText(subtitle, width / 2, height / 2 + 60);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;

    return texture;
}

function createLidMainPanel(config, materials) {
    const lid = getLidDimensions(config);

    return createRoundedMesh({
        name: "LidMainPanel",
        width: lid.width,
        height: lid.thickness,
        depth: lid.depth,
        radius: config?.dimensions?.borderRadius ?? 0.2,
        segments: 8,
        material: materials.boxExterior,
    });
}

function createLidInteriorPanel(config, materials) {
    const lid = getLidDimensions(config);

    const mesh = createRoundedMesh({
        name: "LidInteriorPanel",
        width: lid.width - 0.22,
        height: lid.interiorThickness,
        depth: lid.depth - 0.22,
        radius: 0.14,
        segments: 6,
        material: materials.boxInterior,
    });

    mesh.position.y = -lid.thickness / 2 - lid.interiorThickness / 2 - 0.006;

    return mesh;
}

function createLidSideLip(config, materials) {
    const group = new THREE.Group();
    group.name = "LidSideLip";

    const lid = getLidDimensions(config);

    const lipHeight = 0.34;
    const lipThickness = 0.08;
    const lipY = -lid.thickness / 2 - lipHeight / 2;

    const frontLip = createBoxMesh({
        name: "LidFrontLip",
        size: [lid.width, lipHeight, lipThickness],
        position: [0, lipY, lid.depth / 2 - lipThickness / 2],
        material: materials.darkCardboard,
    });

    const leftLip = createBoxMesh({
        name: "LidLeftLip",
        size: [lipThickness, lipHeight, lid.depth],
        position: [-lid.width / 2 + lipThickness / 2, lipY, 0],
        material: materials.darkCardboard,
    });

    const rightLip = createBoxMesh({
        name: "LidRightLip",
        size: [lipThickness, lipHeight, lid.depth],
        position: [lid.width / 2 - lipThickness / 2, lipY, 0],
        material: materials.darkCardboard,
    });

    group.add(frontLip, leftLip, rightLip);

    return group;
}

function createLidTopArtwork(config, materials) {
    const group = new THREE.Group();
    group.name = "LidTopArtwork";

    const lid = getLidDimensions(config);
    const labelConfig = config?.exteriorDecorations?.lidLabel ?? {};

    const texture = createCanvasLabel({
        text: labelConfig.text ?? "MUNDIAL 2026",
        subtitle: "KICKOFF BOX",
        background: "#fff7e8",
        color: "#7a1e1e",
    });

    const artworkMaterial = new THREE.MeshBasicMaterial({
        name: "LidArtworkMaterial",
        map: texture,
        side: THREE.DoubleSide,
    });

    const artwork = new THREE.Mesh(
        new THREE.PlaneGeometry(
            labelConfig.size?.width ?? 3.2,
            labelConfig.size?.height ?? 0.92,
        ),
        artworkMaterial,
    );

    artwork.name = "LidArtwork";
    artwork.rotation.x = -Math.PI / 2;
    artwork.position.set(0, lid.thickness / 2 + 0.012, lid.depth / 2);
    artwork.renderOrder = 5;

    const leftStripe = createBoxMesh({
        name: "LidStripeRed",
        size: [0.14, 0.018, lid.depth * 0.78],
        position: [-lid.width / 2 + 0.6, lid.thickness / 2 + 0.018, lid.depth / 2],
        material: materials.boliviaRed,
    });

    const centerStripe = createBoxMesh({
        name: "LidStripeYellow",
        size: [0.14, 0.018, lid.depth * 0.78],
        position: [-lid.width / 2 + 0.78, lid.thickness / 2 + 0.019, lid.depth / 2],
        material: materials.boliviaYellow,
    });

    const rightStripe = createBoxMesh({
        name: "LidStripeGreen",
        size: [0.14, 0.018, lid.depth * 0.78],
        position: [-lid.width / 2 + 0.96, lid.thickness / 2 + 0.02, lid.depth / 2],
        material: materials.boliviaGreen,
    });

    group.add(artwork, leftStripe, centerStripe, rightStripe);

    return group;
}

function createHingeDetail(config, materials) {
    const group = new THREE.Group();
    group.name = "LidHingeDetail";

    const lid = getLidDimensions(config);

    const hingeBar = createBoxMesh({
        name: "HingeBar",
        size: [lid.width * 0.86, 0.08, 0.08],
        position: [0, -0.05, -0.04],
        material: materials.gold,
    });

    const hingeLeft = createRoundedMesh({
        name: "HingeCapLeft",
        width: 0.22,
        height: 0.14,
        depth: 0.14,
        radius: 0.045,
        segments: 4,
        material: materials.gold,
    });
    hingeLeft.position.set(-lid.width * 0.43, -0.05, -0.04);

    const hingeRight = createRoundedMesh({
        name: "HingeCapRight",
        width: 0.22,
        height: 0.14,
        depth: 0.14,
        radius: 0.045,
        segments: 4,
        material: materials.gold,
    });
    hingeRight.position.set(lid.width * 0.43, -0.05, -0.04);

    group.add(hingeBar, hingeLeft, hingeRight);

    return group;
}

function createLidRibbon(config, materials) {
    const group = new THREE.Group();
    group.name = "LidRibbon";

    const lid = getLidDimensions(config);

    const horizontalRibbon = createBoxMesh({
        name: "HorizontalRibbon",
        size: [lid.width * 0.72, 0.022, 0.16],
        position: [0, lid.thickness / 2 + 0.035, lid.depth / 2],
        material: materials.boliviaRed,
    });

    const verticalRibbon = createBoxMesh({
        name: "VerticalRibbon",
        size: [0.16, 0.024, lid.depth * 0.78],
        position: [lid.width / 2 - 0.82, lid.thickness / 2 + 0.04, lid.depth / 2],
        material: materials.boliviaGreen,
    });

    const ribbonCenter = createRoundedMesh({
        name: "RibbonCenterBadge",
        width: 0.56,
        height: 0.04,
        depth: 0.38,
        radius: 0.04,
        segments: 4,
        material: materials.gold,
    });
    ribbonCenter.position.set(
        lid.width / 2 - 0.82,
        lid.thickness / 2 + 0.07,
        lid.depth / 2,
    );

    group.add(horizontalRibbon, verticalRibbon, ribbonCenter);

    return group;
}

export function createBoxLid(config, materials) {
    const pivot = new THREE.Group();
    pivot.name = "KickOffBoxLidPivot";

    const lid = getLidDimensions(config);
    const box = getBoxDimensions(config);

    const pivotPosition = getLidPivotPosition(config);
    const meshPosition = getLidMeshPosition(config);

    pivot.position.set(pivotPosition[0], pivotPosition[1], pivotPosition[2]);

    const lidGroup = new THREE.Group();
    lidGroup.name = "KickOffBoxLid";

    lidGroup.position.set(meshPosition[0], meshPosition[1], meshPosition[2]);

    const mainPanel = createLidMainPanel(config, materials);
    const interiorPanel = createLidInteriorPanel(config, materials);
    const sideLip = createLidSideLip(config, materials);
    const topArtwork = createLidTopArtwork(config, materials);
    const hingeDetail = createHingeDetail(config, materials);
    const ribbon = createLidRibbon(config, materials);

    lidGroup.add(mainPanel, interiorPanel, sideLip, topArtwork, ribbon);
    pivot.add(lidGroup, hingeDetail);

    const initialOpen = config?.lid?.initialOpen ?? true;
    pivot.rotation.x = initialOpen
        ? config?.lid?.openAngle ?? -Math.PI / 2.6
        : config?.lid?.closedAngle ?? 0;

    pivot.userData = {
        type: "box-lid",
        isOpen: initialOpen,
        openAngle: config?.lid?.openAngle ?? -Math.PI / 2.6,
        closedAngle: config?.lid?.closedAngle ?? 0,
        targetRotation: pivot.rotation.x,
        animationSpeed: config?.lid?.animationSpeed ?? 0.08,
        dimensions: {
            width: lid.width,
            depth: lid.depth,
            thickness: lid.thickness,
            boxHeight: box.height,
        },
    };

    setGroupShadow(pivot, true, true);

    return pivot;
}

export function openLid(lidPivot) {
    if (!lidPivot?.userData) return;

    lidPivot.userData.isOpen = true;
    lidPivot.userData.targetRotation = lidPivot.userData.openAngle;
}

export function closeLid(lidPivot) {
    if (!lidPivot?.userData) return;

    lidPivot.userData.isOpen = false;
    lidPivot.userData.targetRotation = lidPivot.userData.closedAngle;
}

export function toggleLid(lidPivot) {
    if (!lidPivot?.userData) return;

    if (lidPivot.userData.isOpen) {
        closeLid(lidPivot);
    } else {
        openLid(lidPivot);
    }
}

export function updateLidAnimation(lidPivot, speedOverride) {
    if (!lidPivot?.userData) return;

    const speed = speedOverride ?? lidPivot.userData.animationSpeed ?? 0.08;

    lidPivot.rotation.x = THREE.MathUtils.lerp(
        lidPivot.rotation.x,
        lidPivot.userData.targetRotation,
        speed,
    );
}

export function setLidOpenState(lidPivot, isOpen, immediate = false) {
    if (!lidPivot?.userData) return;

    lidPivot.userData.isOpen = Boolean(isOpen);
    lidPivot.userData.targetRotation = isOpen
        ? lidPivot.userData.openAngle
        : lidPivot.userData.closedAngle;

    if (immediate) {
        lidPivot.rotation.x = lidPivot.userData.targetRotation;
    }
}

export function setLidVisibility(lidPivot, visible = true) {
    if (!lidPivot) return;

    lidPivot.visible = Boolean(visible);
}

export function getLidParts(lidPivot) {
    if (!lidPivot) return {};

    return {
        lidGroup: lidPivot.getObjectByName("KickOffBoxLid"),
        mainPanel: lidPivot.getObjectByName("LidMainPanel"),
        interiorPanel: lidPivot.getObjectByName("LidInteriorPanel"),
        sideLip: lidPivot.getObjectByName("LidSideLip"),
        artwork: lidPivot.getObjectByName("LidArtwork"),
        ribbon: lidPivot.getObjectByName("LidRibbon"),
        hinge: lidPivot.getObjectByName("LidHingeDetail"),
    };
}

export function updateLidArtwork(lidPivot, text = "MUNDIAL 2026", subtitle = "KICKOFF BOX") {
    const artwork = lidPivot?.getObjectByName("LidArtwork");

    if (!artwork?.material) return;

    const oldTexture = artwork.material.map;

    artwork.material.map = createCanvasLabel({
        text,
        subtitle,
        background: "#fff7e8",
        color: "#7a1e1e",
    });

    artwork.material.needsUpdate = true;

    if (oldTexture) {
        oldTexture.dispose();
    }
}

export function disposeBoxLid(lidPivot) {
    if (!lidPivot) return;

    lidPivot.traverse((object) => {
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

    lidPivot.removeFromParent();
}
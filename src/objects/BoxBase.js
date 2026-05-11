import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import {
    applyTransform,
    getBoxDimensions,
    getWallPositions,
    getInteriorWallPositions,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

function createRoundedMesh({
    name,
    width,
    height,
    depth,
    radius = 0.08,
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

function createBoxMesh({ name, size, position, material }) {
    const [width, height, depth] = size;

    const geometry = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(geometry, material);

    mesh.name = name;
    mesh.position.set(position[0], position[1], position[2]);

    setMeshShadow(mesh, true, true);

    return mesh;
}

function createTopRim(config, materials) {
    const group = new THREE.Group();
    group.name = "BoxTopRim";

    const box = getBoxDimensions(config);
    const y = box.floorHeight + box.height + 0.045;

    const rimThickness = 0.11;
    const rimHeight = 0.09;

    const frontRim = createRoundedMesh({
        name: "FrontTopRim",
        width: box.width + 0.08,
        height: rimHeight,
        depth: rimThickness,
        radius: 0.045,
        segments: 4,
        material: materials.darkCardboard,
    });
    frontRim.position.set(0, y, box.depth / 2);

    const backRim = createRoundedMesh({
        name: "BackTopRim",
        width: box.width + 0.08,
        height: rimHeight,
        depth: rimThickness,
        radius: 0.045,
        segments: 4,
        material: materials.darkCardboard,
    });
    backRim.position.set(0, y, -box.depth / 2);

    const leftRim = createRoundedMesh({
        name: "LeftTopRim",
        width: rimThickness,
        height: rimHeight,
        depth: box.depth + 0.08,
        radius: 0.045,
        segments: 4,
        material: materials.darkCardboard,
    });
    leftRim.position.set(-box.width / 2, y, 0);

    const rightRim = createRoundedMesh({
        name: "RightTopRim",
        width: rimThickness,
        height: rimHeight,
        depth: box.depth + 0.08,
        radius: 0.045,
        segments: 4,
        material: materials.darkCardboard,
    });
    rightRim.position.set(box.width / 2, y, 0);

    group.add(frontRim, backRim, leftRim, rightRim);

    return group;
}

function createBaseFloor(config, materials) {
    const box = getBoxDimensions(config);

    const baseFloor = createRoundedMesh({
        name: "BoxInteriorFloor",
        width: box.width,
        height: box.floorHeight,
        depth: box.depth,
        radius: box.borderRadius,
        segments: 8,
        material: materials.boxInterior,
    });

    baseFloor.position.y = box.floorHeight / 2;

    return baseFloor;
}

function createExteriorWalls(config, materials) {
    const group = new THREE.Group();
    group.name = "ExteriorWalls";

    const walls = getWallPositions(config);

    Object.entries(walls).forEach(([key, wall]) => {
        const mesh = createBoxMesh({
            name: key,
            size: wall.size,
            position: wall.position,
            material: materials.boxExterior,
        });

        group.add(mesh);
    });

    return group;
}

function createInteriorPanels(config, materials) {
    const group = new THREE.Group();
    group.name = "InteriorPanels";

    const panels = getInteriorWallPositions(config);

    Object.entries(panels).forEach(([key, panel]) => {
        const mesh = createBoxMesh({
            name: key,
            size: panel.size,
            position: panel.position,
            material: materials.boxInterior,
        });

        group.add(mesh);
    });

    return group;
}

function createBottomShadow(config, materials) {
    const box = getBoxDimensions(config);

    const geometry = new THREE.CircleGeometry(Math.max(box.width, box.depth) * 0.48, 64);
    const shadow = new THREE.Mesh(geometry, materials.shadowSoft);

    shadow.name = "SoftContactShadow";
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.012;
    shadow.scale.set(1.15, 0.72, 1);

    return shadow;
}

function createExteriorAccentStripes(config, materials) {
    const group = new THREE.Group();
    group.name = "ExteriorAccentStripes";

    const decorations = config?.exteriorDecorations;
    const stripes = decorations?.boliviaStripes ?? [];

    const materialMap = {
        boliviaRed: materials.boliviaRed,
        boliviaYellow: materials.boliviaYellow,
        boliviaGreen: materials.boliviaGreen,
    };

    stripes.forEach((stripe, index) => {
        const mesh = createBoxMesh({
            name: `BoliviaStripe_${index + 1}`,
            size: stripe.size,
            position: stripe.position,
            material: materialMap[stripe.color] ?? materials.boliviaRed,
        });

        group.add(mesh);
    });

    return group;
}

function createBoxDepthLines(config, materials) {
    const group = new THREE.Group();
    group.name = "BoxDepthLines";

    const box = getBoxDimensions(config);
    const lineMaterial = materials.gold;

    const positions = [
        [-box.width / 2 + 0.28, box.floorHeight + 0.02, -box.depth / 2 + 0.28],
        [box.width / 2 - 0.28, box.floorHeight + 0.02, -box.depth / 2 + 0.28],
        [-box.width / 2 + 0.28, box.floorHeight + 0.02, box.depth / 2 - 0.28],
        [box.width / 2 - 0.28, box.floorHeight + 0.02, box.depth / 2 - 0.28],
    ];

    positions.forEach((position, index) => {
        const cornerMark = createRoundedMesh({
            name: `InteriorCornerMark_${index + 1}`,
            width: 0.28,
            height: 0.025,
            depth: 0.28,
            radius: 0.025,
            segments: 3,
            material: lineMaterial,
        });

        cornerMark.position.set(position[0], position[1], position[2]);
        group.add(cornerMark);
    });

    return group;
}

export function createBoxBase(config, materials) {
    const group = new THREE.Group();
    group.name = "KickOffBoxBase";

    const baseFloor = createBaseFloor(config, materials);
    const exteriorWalls = createExteriorWalls(config, materials);
    const interiorPanels = createInteriorPanels(config, materials);
    const topRim = createTopRim(config, materials);
    const bottomShadow = createBottomShadow(config, materials);
    const accentStripes = createExteriorAccentStripes(config, materials);
    const depthLines = createBoxDepthLines(config, materials);

    group.add(
        bottomShadow,
        baseFloor,
        exteriorWalls,
        interiorPanels,
        topRim,
        accentStripes,
        depthLines,
    );

    setGroupShadow(group, true, true);

    return group;
}

export function updateBoxBaseColors(materials, { exteriorColor, interiorColor } = {}) {
    if (exteriorColor && materials?.boxExterior?.color) {
        materials.boxExterior.color.set(exteriorColor);
        materials.boxExterior.needsUpdate = true;
    }

    if (interiorColor && materials?.boxInterior?.color) {
        materials.boxInterior.color.set(interiorColor);
        materials.boxInterior.needsUpdate = true;
    }
}

export function setBoxBaseVisibility(boxBase, visible = true) {
    if (!boxBase) return;

    boxBase.visible = Boolean(visible);
}

export function getBoxBaseParts(boxBase) {
    if (!boxBase) return {};

    return {
        floor: boxBase.getObjectByName("BoxInteriorFloor"),
        exteriorWalls: boxBase.getObjectByName("ExteriorWalls"),
        interiorPanels: boxBase.getObjectByName("InteriorPanels"),
        topRim: boxBase.getObjectByName("BoxTopRim"),
        accentStripes: boxBase.getObjectByName("ExteriorAccentStripes"),
        depthLines: boxBase.getObjectByName("BoxDepthLines"),
        contactShadow: boxBase.getObjectByName("SoftContactShadow"),
    };
}

export function disposeBoxBase(boxBase) {
    if (!boxBase) return;

    boxBase.traverse((object) => {
        if (object.geometry) {
            object.geometry.dispose();
        }

        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach((material) => material.dispose());
            } else {
                object.material.dispose();
            }
        }
    });

    boxBase.removeFromParent();
}
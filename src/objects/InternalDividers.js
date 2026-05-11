import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import {
    getBoxDimensions,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

function createDividerMesh({
    name,
    size,
    position,
    material,
    radius = 0.025,
    segments = 3,
}) {
    const [width, height, depth] = size;

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
    mesh.position.set(position[0], position[1], position[2]);

    setMeshShadow(mesh, true, true);

    return mesh;
}

function createDividerEdge(mesh, material) {
    const edgesGeometry = new THREE.EdgesGeometry(mesh.geometry, 25);

    const edgeMaterial = new THREE.LineBasicMaterial({
        color: material?.color ?? "#c59a4a",
        transparent: true,
        opacity: 0.55,
    });

    const edges = new THREE.LineSegments(edgesGeometry, edgeMaterial);
    edges.name = `${mesh.name}_Edges`;
    edges.position.copy(mesh.position);
    edges.rotation.copy(mesh.rotation);
    edges.scale.copy(mesh.scale);
    edges.renderOrder = 2;

    return edges;
}

function createSlotLabel({
    name,
    text,
    position,
    rotation = [-Math.PI / 2, 0, 0],
    width = 1.1,
    height = 0.22,
}) {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 192;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255, 247, 232, 0.92)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(122, 79, 42, 0.25)";
    ctx.lineWidth = 8;
    ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

    ctx.fillStyle = "#2b2118";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;

    const material = new THREE.MeshBasicMaterial({
        name: `${name}_LabelMaterial`,
        map: texture,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
    });

    const label = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
    label.name = name;
    label.position.set(position[0], position[1], position[2]);
    label.rotation.set(rotation[0], rotation[1], rotation[2]);
    label.renderOrder = 3;

    return label;
}

function createDividerFromConfig(divider, materials) {
    const mesh = createDividerMesh({
        name: divider.name,
        size: divider.size,
        position: divider.position,
        material: materials.darkCardboard,
    });

    const edge = createDividerEdge(mesh, materials.gold);

    return {
        mesh,
        edge,
    };
}

function createCornerPadding(config, materials) {
    const group = new THREE.Group();
    group.name = "InteriorCornerPadding";

    const box = getBoxDimensions(config);

    const paddingSize = [0.22, 0.08, 0.22];
    const y = config?.dimensions?.floorHeight + 0.07;

    const positions = [
        [-box.width / 2 + 0.32, y, -box.depth / 2 + 0.32],
        [box.width / 2 - 0.32, y, -box.depth / 2 + 0.32],
        [-box.width / 2 + 0.32, y, box.depth / 2 - 0.32],
        [box.width / 2 - 0.32, y, box.depth / 2 - 0.32],
    ];

    positions.forEach((position, index) => {
        const pad = createDividerMesh({
            name: `CornerPadding_${index + 1}`,
            size: paddingSize,
            position,
            material: materials.boxInterior,
            radius: 0.04,
            segments: 4,
        });

        group.add(pad);
    });

    return group;
}

function createSlotGuides(config, materials) {
    const group = new THREE.Group();
    group.name = "InteriorSlotGuides";

    const floorY = (config?.dimensions?.floorHeight ?? 0.22) + 0.012;

    const guides = [
        {
            name: "GuideCardArea",
            size: [2.95, 0.018, 1.58],
            position: [-2.25, floorY, -1.45],
        },
        {
            name: "GuideCupcakeArea",
            size: [1.25, 0.018, 1.2],
            position: [-2.35, floorY, 0.72],
        },
        {
            name: "GuideBottleArea",
            size: [1.4, 0.018, 2.0],
            position: [1.25, floorY, 0.9],
        },
        {
            name: "GuideAccessoryArea",
            size: [1.55, 0.018, 1.25],
            position: [2.12, floorY, 1.58],
        },
    ];

    guides.forEach((guide) => {
        const mesh = createDividerMesh({
            name: guide.name,
            size: guide.size,
            position: guide.position,
            material: materials.transparentHelper,
            radius: 0.05,
            segments: 4,
        });

        group.add(mesh);
    });

    return group;
}

function createSlotLabels(config) {
    const group = new THREE.Group();
    group.name = "InteriorSlotLabels";

    const labelY = (config?.dimensions?.floorHeight ?? 0.22) + 0.04;

    const labels = [
        {
            name: "CardSlotLabel",
            text: "Mensaje",
            position: [-2.25, labelY, -0.58],
            width: 1.05,
        },
        {
            name: "SweetSlotLabel",
            text: "Detalle dulce",
            position: [-2.35, labelY, 1.38],
            width: 1.25,
        },
        {
            name: "BottleSlotLabel",
            text: "Bebida",
            position: [1.25, labelY, 1.98],
            width: 0.88,
        },
        {
            name: "AccessorySlotLabel",
            text: "Souvenir",
            position: [2.12, labelY, 2.22],
            width: 1.0,
        },
    ];

    labels.forEach((label) => {
        group.add(createSlotLabel(label));
    });

    return group;
}

function createDividerCaps(config, materials) {
    const group = new THREE.Group();
    group.name = "DividerCaps";

    const dividers = config?.dividers ?? [];

    dividers.forEach((divider, index) => {
        const [width, height, depth] = divider.size;
        const [x, y, z] = divider.position;

        const cap = createDividerMesh({
            name: `DividerTopCap_${index + 1}`,
            size: [width + 0.04, 0.055, depth + 0.04],
            position: [x, y + height / 2 + 0.038, z],
            material: materials.gold,
            radius: 0.025,
            segments: 3,
        });

        group.add(cap);
    });

    return group;
}

export function createInternalDividers(config, materials) {
    const group = new THREE.Group();
    group.name = "KickOffBoxInternalDividers";

    const dividerMeshes = new THREE.Group();
    const dividerEdges = new THREE.Group();

    dividerMeshes.name = "DividerMeshes";
    dividerEdges.name = "DividerEdges";

    const dividers = config?.dividers ?? [];

    dividers.forEach((divider) => {
        const { mesh, edge } = createDividerFromConfig(divider, materials);

        dividerMeshes.add(mesh);
        dividerEdges.add(edge);
    });

    const caps = createDividerCaps(config, materials);
    const cornerPadding = createCornerPadding(config, materials);
    const slotGuides = createSlotGuides(config, materials);
    const slotLabels = createSlotLabels(config);

    group.add(
        dividerMeshes,
        dividerEdges,
        caps,
        cornerPadding,
        slotGuides,
        slotLabels,
    );

    group.userData = {
        type: "internal-dividers",
        visibleInPresets: ["estandar", "premium"],
        description:
            "Separadores internos para organizar tarjeta, detalle dulce, bebida y souvenir.",
    };

    setGroupShadow(group, true, true);

    return group;
}

export function setInternalDividersVisibility(dividersGroup, visible = true) {
    if (!dividersGroup) return;

    dividersGroup.visible = Boolean(visible);
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

export function getInternalDividerParts(dividersGroup) {
    if (!dividersGroup) return {};

    return {
        meshes: dividersGroup.getObjectByName("DividerMeshes"),
        edges: dividersGroup.getObjectByName("DividerEdges"),
        caps: dividersGroup.getObjectByName("DividerCaps"),
        cornerPadding: dividersGroup.getObjectByName("InteriorCornerPadding"),
        slotGuides: dividersGroup.getObjectByName("InteriorSlotGuides"),
        slotLabels: dividersGroup.getObjectByName("InteriorSlotLabels"),
    };
}

export function disposeInternalDividers(dividersGroup) {
    if (!dividersGroup) return;

    dividersGroup.traverse((object) => {
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

    dividersGroup.removeFromParent();
}
import * as THREE from "three";

import {
    applyTransform,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

const DEFAULT_ROSE_OPTIONS = {
    petalCount: 18,
    outerPetalCount: 12,
    leafCount: 3,
    useTricolorPetals: true,
    stemColor: "#2f7d55",
    centerColor: "#f0c84b",
    ribbonEnabled: true,
};

function createStandardMaterialClone(source, name, color, options = {}) {
    const material = source.clone();

    material.name = name;
    material.color.set(color);
    material.roughness = options.roughness ?? material.roughness ?? 0.58;
    material.metalness = options.metalness ?? material.metalness ?? 0.02;
    material.side = options.side ?? material.side ?? THREE.FrontSide;
    material.transparent = options.transparent ?? material.transparent ?? false;
    material.opacity = options.opacity ?? material.opacity ?? 1;
    material.needsUpdate = true;

    return material;
}

function createStemCurve() {
    return new THREE.CatmullRomCurve3(
        [
            new THREE.Vector3(-0.52, -0.42, 0.1),
            new THREE.Vector3(-0.25, -0.1, 0.02),
            new THREE.Vector3(0.12, 0.18, -0.06),
            new THREE.Vector3(0.38, 0.44, -0.16),
        ],
        false,
        "centripetal",
        0.45,
    );
}

function createTubeFromCurve({
    name,
    curve,
    tubularSegments = 36,
    radius = 0.025,
    radialSegments = 10,
    material,
}) {
    const geometry = new THREE.TubeGeometry(
        curve,
        tubularSegments,
        radius,
        radialSegments,
        false,
    );

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;

    setMeshShadow(mesh, true, true);

    return mesh;
}

function createPetalShape() {
    const shape = new THREE.Shape();

    shape.moveTo(0, -0.34);
    shape.bezierCurveTo(0.22, -0.28, 0.4, -0.08, 0.33, 0.16);
    shape.bezierCurveTo(0.28, 0.36, 0.1, 0.48, 0, 0.56);
    shape.bezierCurveTo(-0.1, 0.48, -0.28, 0.36, -0.33, 0.16);
    shape.bezierCurveTo(-0.4, -0.08, -0.22, -0.28, 0, -0.34);

    return shape;
}

function createLeafShape() {
    const shape = new THREE.Shape();

    shape.moveTo(0, -0.32);
    shape.bezierCurveTo(0.3, -0.2, 0.42, 0.1, 0, 0.38);
    shape.bezierCurveTo(-0.42, 0.1, -0.3, -0.2, 0, -0.32);

    return shape;
}

function createPetalMesh({ name, material, scale = [1, 1, 1] }) {
    const geometry = new THREE.ExtrudeGeometry(createPetalShape(), {
        depth: 0.018,
        bevelEnabled: true,
        bevelThickness: 0.008,
        bevelSize: 0.006,
        bevelSegments: 2,
        curveSegments: 18,
    });

    geometry.center();

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.scale.set(scale[0], scale[1], scale[2]);

    setMeshShadow(mesh, true, true);

    return mesh;
}

function createLeafMesh({ name, material, scale = [1, 1, 1] }) {
    const geometry = new THREE.ExtrudeGeometry(createLeafShape(), {
        depth: 0.018,
        bevelEnabled: true,
        bevelThickness: 0.006,
        bevelSize: 0.005,
        bevelSegments: 2,
        curveSegments: 18,
    });

    geometry.center();

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.scale.set(scale[0], scale[1], scale[2]);

    setMeshShadow(mesh, true, true);

    return mesh;
}

function createRoseMaterials(materials, options) {
    const redPetal = createStandardMaterialClone(
        materials.boliviaRed,
        "RosePetalRedMaterial",
        "#b92d2d",
        { roughness: 0.62, metalness: 0.01, side: THREE.DoubleSide },
    );

    const yellowPetal = createStandardMaterialClone(
        materials.boliviaYellow,
        "RosePetalYellowMaterial",
        "#f0c84b",
        { roughness: 0.58, metalness: 0.01, side: THREE.DoubleSide },
    );

    const greenPetal = createStandardMaterialClone(
        materials.boliviaGreen,
        "RosePetalGreenMaterial",
        "#2f7d55",
        { roughness: 0.64, metalness: 0.01, side: THREE.DoubleSide },
    );

    const darkGreen = createStandardMaterialClone(
        materials.boliviaGreen,
        "RoseStemMaterial",
        options.stemColor ?? "#2f7d55",
        { roughness: 0.72, metalness: 0.02 },
    );

    const leaf = createStandardMaterialClone(
        materials.boliviaGreen,
        "RoseLeafMaterial",
        "#286443",
        { roughness: 0.68, metalness: 0.02, side: THREE.DoubleSide },
    );

    const center = createStandardMaterialClone(
        materials.boliviaYellow,
        "RoseCenterMaterial",
        options.centerColor ?? "#f0c84b",
        { roughness: 0.44, metalness: 0.04 },
    );

    return {
        redPetal,
        yellowPetal,
        greenPetal,
        darkGreen,
        leaf,
        center,
    };
}

function createStem(materialSet) {
    const group = new THREE.Group();
    group.name = "RoseStemGroup";

    const curve = createStemCurve();
    const stem = createTubeFromCurve({
        name: "RoseCurvedStem",
        curve,
        radius: 0.026,
        tubularSegments: 42,
        radialSegments: 10,
        material: materialSet.darkGreen,
    });

    const baseCurve = new THREE.CatmullRomCurve3(
        [
            new THREE.Vector3(-0.62, -0.45, 0.08),
            new THREE.Vector3(-0.76, -0.38, 0.05),
            new THREE.Vector3(-0.84, -0.24, 0.0),
        ],
        false,
        "centripetal",
        0.45,
    );

    const sideStem = createTubeFromCurve({
        name: "RoseSideStem",
        curve: baseCurve,
        radius: 0.015,
        tubularSegments: 24,
        radialSegments: 8,
        material: materialSet.darkGreen,
    });

    group.add(stem, sideStem);

    return group;
}

function createLeaves(materialSet, options) {
    const group = new THREE.Group();
    group.name = "RoseLeaves";

    const leafPositions = [
        {
            position: [-0.34, -0.08, 0.04],
            rotation: [0.72, 0.22, -0.72],
            scale: [0.42, 0.42, 0.42],
        },
        {
            position: [-0.08, 0.08, -0.05],
            rotation: [0.64, -0.2, 0.78],
            scale: [0.36, 0.36, 0.36],
        },
        {
            position: [-0.66, -0.32, 0.02],
            rotation: [0.7, 0.1, -1.15],
            scale: [0.32, 0.32, 0.32],
        },
    ];

    leafPositions.slice(0, options.leafCount ?? 3).forEach((leafData, index) => {
        const leaf = createLeafMesh({
            name: `RoseLeaf_${index + 1}`,
            material: materialSet.leaf,
            scale: leafData.scale,
        });

        leaf.position.set(
            leafData.position[0],
            leafData.position[1],
            leafData.position[2],
        );
        leaf.rotation.set(
            leafData.rotation[0],
            leafData.rotation[1],
            leafData.rotation[2],
        );

        group.add(leaf);

        const veinCurve = new THREE.CatmullRomCurve3(
            [
                new THREE.Vector3(leafData.position[0], leafData.position[1] - 0.09, leafData.position[2] + 0.01),
                new THREE.Vector3(leafData.position[0] + 0.02, leafData.position[1], leafData.position[2] + 0.02),
                new THREE.Vector3(leafData.position[0] + 0.04, leafData.position[1] + 0.13, leafData.position[2] + 0.025),
            ],
            false,
            "centripetal",
            0.35,
        );

        const vein = createTubeFromCurve({
            name: `RoseLeafVein_${index + 1}`,
            curve: veinCurve,
            radius: 0.006,
            tubularSegments: 12,
            radialSegments: 6,
            material: materialSet.darkGreen,
        });

        group.add(vein);
    });

    return group;
}

function getPetalMaterial(materialSet, index, useTricolor) {
    if (!useTricolor) return materialSet.redPetal;

    const palette = [
        materialSet.redPetal,
        materialSet.yellowPetal,
        materialSet.greenPetal,
    ];

    return palette[index % palette.length];
}

function createInnerPetals(materialSet, options) {
    const group = new THREE.Group();
    group.name = "RoseInnerPetals";

    const petalCount = options.petalCount ?? DEFAULT_ROSE_OPTIONS.petalCount;
    const useTricolor = options.useTricolorPetals ?? true;

    for (let index = 0; index < petalCount; index += 1) {
        const layer = Math.floor(index / 6);
        const angle = (index / 6) * Math.PI * 2 + layer * 0.36;
        const radius = 0.1 + layer * 0.055;
        const height = 0.62 + layer * 0.016;

        const petal = createPetalMesh({
            name: `RoseInnerPetal_${index + 1}`,
            material: getPetalMaterial(materialSet, index, useTricolor),
            scale: [
                0.36 + layer * 0.08,
                0.42 + layer * 0.08,
                0.36 + layer * 0.08,
            ],
        });

        petal.position.set(
            0.38 + Math.cos(angle) * radius,
            height,
            -0.16 + Math.sin(angle) * radius,
        );

        petal.rotation.set(
            0.92 + layer * 0.12,
            -angle,
            Math.sin(index * 0.7) * 0.22,
        );

        group.add(petal);
    }

    return group;
}

function createOuterPetals(materialSet, options) {
    const group = new THREE.Group();
    group.name = "RoseOuterPetals";

    const count = options.outerPetalCount ?? DEFAULT_ROSE_OPTIONS.outerPetalCount;
    const useTricolor = options.useTricolorPetals ?? true;

    for (let index = 0; index < count; index += 1) {
        const angle = (index / count) * Math.PI * 2;
        const radius = 0.28;

        const petal = createPetalMesh({
            name: `RoseOuterPetal_${index + 1}`,
            material: getPetalMaterial(materialSet, index + 1, useTricolor),
            scale: [0.56, 0.62, 0.56],
        });

        petal.position.set(
            0.38 + Math.cos(angle) * radius,
            0.58 + Math.sin(index * 0.55) * 0.025,
            -0.16 + Math.sin(angle) * radius,
        );

        petal.rotation.set(
            1.18,
            -angle,
            Math.sin(angle) * 0.35,
        );

        group.add(petal);
    }

    return group;
}

function createRoseCenter(materialSet) {
    const group = new THREE.Group();
    group.name = "RoseCenter";

    const center = new THREE.Mesh(
        new THREE.SphereGeometry(0.105, 32, 16),
        materialSet.center,
    );

    center.name = "RoseCenterCore";
    center.position.set(0.38, 0.66, -0.16);
    center.scale.set(1, 0.78, 1);

    setMeshShadow(center, true, true);

    const dotMaterial = materialSet.center.clone();
    dotMaterial.name = "RoseCenterDotMaterial";
    dotMaterial.color.offsetHSL(0, 0, -0.08);

    for (let index = 0; index < 10; index += 1) {
        const angle = (index / 10) * Math.PI * 2;
        const dot = new THREE.Mesh(
            new THREE.SphereGeometry(0.025, 12, 8),
            dotMaterial,
        );

        dot.name = `RoseCenterDot_${index + 1}`;
        dot.position.set(
            0.38 + Math.cos(angle) * 0.07,
            0.715,
            -0.16 + Math.sin(angle) * 0.07,
        );

        setMeshShadow(dot, true, true);
        group.add(dot);
    }

    group.add(center);

    return group;
}

function createRibbon(materials) {
    const group = new THREE.Group();
    group.name = "RoseTricolorRibbon";

    const ribbonMaterials = [
        materials.boliviaRed,
        materials.boliviaYellow,
        materials.boliviaGreen,
    ];

    const ribbonData = [
        {
            name: "RibbonRed",
            position: [-0.5, -0.2, 0.03],
            rotation: [0.3, 0.1, -0.48],
        },
        {
            name: "RibbonYellow",
            position: [-0.47, -0.23, 0.065],
            rotation: [0.3, 0.08, -0.42],
        },
        {
            name: "RibbonGreen",
            position: [-0.44, -0.26, 0.1],
            rotation: [0.3, 0.06, -0.36],
        },
    ];

    ribbonData.forEach((data, index) => {
        const geometry = new THREE.PlaneGeometry(0.52, 0.06, 8, 1);
        const ribbon = new THREE.Mesh(geometry, ribbonMaterials[index]);

        ribbon.name = data.name;
        ribbon.position.set(data.position[0], data.position[1], data.position[2]);
        ribbon.rotation.set(data.rotation[0], data.rotation[1], data.rotation[2]);
        ribbon.material.side = THREE.DoubleSide;

        setMeshShadow(ribbon, true, true);
        group.add(ribbon);
    });

    return group;
}

function createRoseContactShadow(materials) {
    const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(0.86, 48),
        materials.shadowSoft,
    );

    shadow.name = "RoseContactShadow";
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(-0.08, -0.48, 0.02);
    shadow.scale.set(1.28, 0.46, 1);

    return shadow;
}

export function createDecorativeRose(config, materials, options = {}) {
    const group = new THREE.Group();
    group.name = "KickOffBoxDecorativeRose";

    const mergedOptions = {
        ...DEFAULT_ROSE_OPTIONS,
        petalCount:
            config?.contentLayout?.rose?.petalCount ??
            DEFAULT_ROSE_OPTIONS.petalCount,
        ...options,
    };

    const roseMaterials = createRoseMaterials(materials, mergedOptions);

    const contactShadow = createRoseContactShadow(materials);
    const stem = createStem(roseMaterials);
    const leaves = createLeaves(roseMaterials, mergedOptions);
    const innerPetals = createInnerPetals(roseMaterials, mergedOptions);
    const outerPetals = createOuterPetals(roseMaterials, mergedOptions);
    const center = createRoseCenter(roseMaterials);
    const ribbon = createRibbon(materials);

    group.add(
        contactShadow,
        stem,
        leaves,
        outerPetals,
        innerPetals,
        center,
    );

    if (mergedOptions.ribbonEnabled) {
        group.add(ribbon);
    }

    const layout = config?.contentLayout?.rose ?? {};

    applyTransform(group, {
        position: layout.position ?? [2.25, 0.75, -1.45],
        rotation: layout.rotation ?? [0, 0, Math.PI / 2.8],
        scale: layout.scale ?? [1, 1, 1],
    });

    group.userData = {
        type: "decorative-rose",
        editable: true,
        visibleInPresets: ["basica", "estandar", "premium"],
        description:
            "Rosa decorativa tricolor vinculada a la identidad visual de KickOff Box.",
        options: mergedOptions,
    };

    setGroupShadow(group, true, true);

    return group;
}

export function animateDecorativeRose(roseGroup, elapsedTime = 0) {
    if (!roseGroup) return;

    const petals = roseGroup.getObjectByName("RoseOuterPetals");
    const innerPetals = roseGroup.getObjectByName("RoseInnerPetals");
    const ribbon = roseGroup.getObjectByName("RoseTricolorRibbon");

    if (petals) {
        petals.rotation.y = Math.sin(elapsedTime * 0.55) * 0.035;
    }

    if (innerPetals) {
        innerPetals.rotation.y = Math.sin(elapsedTime * 0.45 + 0.8) * 0.025;
    }

    if (ribbon) {
        ribbon.rotation.z = Math.sin(elapsedTime * 0.7) * 0.035;
    }
}

export function updateRoseColors(roseGroup, colors = {}) {
    if (!roseGroup) return;

    const materialUpdates = {
        red: colors.red,
        yellow: colors.yellow,
        green: colors.green,
        stem: colors.stem,
        center: colors.center,
    };

    roseGroup.traverse((object) => {
        if (!object.isMesh || !object.material?.color) return;

        if (materialUpdates.red && object.material.name.includes("Red")) {
            object.material.color.set(materialUpdates.red);
        }

        if (materialUpdates.yellow && object.material.name.includes("Yellow")) {
            object.material.color.set(materialUpdates.yellow);
        }

        if (materialUpdates.green && object.material.name.includes("Green")) {
            object.material.color.set(materialUpdates.green);
        }

        if (materialUpdates.stem && object.material.name.includes("Stem")) {
            object.material.color.set(materialUpdates.stem);
        }

        if (materialUpdates.center && object.material.name.includes("Center")) {
            object.material.color.set(materialUpdates.center);
        }

        object.material.needsUpdate = true;
    });
}

export function setDecorativeRoseVisibility(roseGroup, visible = true) {
    if (!roseGroup) return;

    roseGroup.visible = Boolean(visible);
}

export function setRoseRibbonVisibility(roseGroup, visible = true) {
    const ribbon = roseGroup?.getObjectByName("RoseTricolorRibbon");

    if (!ribbon) return;

    ribbon.visible = Boolean(visible);
}

export function setRoseLeavesVisibility(roseGroup, visible = true) {
    const leaves = roseGroup?.getObjectByName("RoseLeaves");

    if (!leaves) return;

    leaves.visible = Boolean(visible);
}

export function getDecorativeRoseParts(roseGroup) {
    if (!roseGroup) return {};

    return {
        stem: roseGroup.getObjectByName("RoseStemGroup"),
        leaves: roseGroup.getObjectByName("RoseLeaves"),
        innerPetals: roseGroup.getObjectByName("RoseInnerPetals"),
        outerPetals: roseGroup.getObjectByName("RoseOuterPetals"),
        center: roseGroup.getObjectByName("RoseCenter"),
        ribbon: roseGroup.getObjectByName("RoseTricolorRibbon"),
        shadow: roseGroup.getObjectByName("RoseContactShadow"),
    };
}

export function disposeDecorativeRose(roseGroup) {
    if (!roseGroup) return;

    roseGroup.traverse((object) => {
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

    roseGroup.removeFromParent();
}
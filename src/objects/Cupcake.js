import * as THREE from "three";

import {
    applyTransform,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

const DEFAULT_CUPCAKE_OPTIONS = {
    wrapperColor: "#6d3b22",
    creamColor: "#f5d9a7",
    cherryColor: "#b92d2d",
    sprinkleCount: 18,
    wrapperPleats: 18,
};

function createLatheMesh({ name, points, segments = 48, material }) {
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
    widthSegments = 32,
    heightSegments = 16,
    material,
}) {
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const mesh = new THREE.Mesh(geometry, material);

    mesh.name = name;
    setMeshShadow(mesh, true, true);

    return mesh;
}

function createWrapperMaterial(materials, color) {
    const material = materials.chocolate.clone();
    material.name = "CupcakeWrapperMaterial";
    material.color.set(color);
    material.roughness = 0.82;
    material.metalness = 0.01;
    material.needsUpdate = true;

    return material;
}

function createCreamMaterial(materials, color) {
    const material = materials.cream.clone();
    material.name = "CupcakeCreamMaterial";
    material.color.set(color);
    material.roughness = 0.68;
    material.metalness = 0;
    material.needsUpdate = true;

    return material;
}

function createWrapper(config, materials, options) {
    const layout = config?.contentLayout?.cupcake ?? {};
    const wrapper = layout.wrapper ?? {
        radiusTop: 0.46,
        radiusBottom: 0.36,
        height: 0.48,
    };

    const material = createWrapperMaterial(
        materials,
        options.wrapperColor ?? DEFAULT_CUPCAKE_OPTIONS.wrapperColor,
    );

    const halfHeight = wrapper.height / 2;

    const points = [
        new THREE.Vector2(wrapper.radiusBottom * 0.92, -halfHeight),
        new THREE.Vector2(wrapper.radiusBottom, -halfHeight * 0.78),
        new THREE.Vector2(wrapper.radiusBottom * 1.04, -halfHeight * 0.25),
        new THREE.Vector2(wrapper.radiusTop * 0.98, halfHeight * 0.5),
        new THREE.Vector2(wrapper.radiusTop, halfHeight),
    ];

    const mesh = createLatheMesh({
        name: "CupcakeWrapper",
        points,
        segments: 64,
        material,
    });

    mesh.userData = {
        role: "wrapper",
        materialKey: "wrapper",
    };

    return mesh;
}

function createWrapperPleats(config, materials, options) {
    const group = new THREE.Group();
    group.name = "CupcakeWrapperPleats";

    const layout = config?.contentLayout?.cupcake ?? {};
    const wrapper = layout.wrapper ?? {
        radiusTop: 0.46,
        radiusBottom: 0.36,
        height: 0.48,
    };

    const pleatCount = options.wrapperPleats ?? DEFAULT_CUPCAKE_OPTIONS.wrapperPleats;
    const pleatMaterial = materials.darkCardboard.clone();
    pleatMaterial.name = "CupcakePleatMaterial";
    pleatMaterial.color.set("#4a2818");
    pleatMaterial.roughness = 0.86;

    for (let index = 0; index < pleatCount; index += 1) {
        const angle = (index / pleatCount) * Math.PI * 2;

        const pleat = createCylinderMesh({
            name: `CupcakePleat_${index + 1}`,
            radiusTop: 0.012,
            radiusBottom: 0.014,
            height: wrapper.height * 0.9,
            radialSegments: 8,
            material: pleatMaterial,
        });

        const radius = wrapper.radiusTop * 0.98;
        pleat.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        pleat.rotation.z = Math.PI / 2;
        pleat.rotation.y = -angle;

        group.add(pleat);
    }

    return group;
}

function createCakeBody(config, materials) {
    const layout = config?.contentLayout?.cupcake ?? {};
    const wrapper = layout.wrapper ?? {
        radiusTop: 0.46,
        radiusBottom: 0.36,
        height: 0.48,
    };

    const bodyMaterial = materials.cream.clone();
    bodyMaterial.name = "CupcakeCakeBodyMaterial";
    bodyMaterial.color.set("#d5965b");
    bodyMaterial.roughness = 0.78;

    const body = createCylinderMesh({
        name: "CupcakeCakeBody",
        radiusTop: wrapper.radiusTop * 0.96,
        radiusBottom: wrapper.radiusBottom * 0.92,
        height: wrapper.height * 0.42,
        radialSegments: 48,
        material: bodyMaterial,
    });

    body.position.y = wrapper.height * 0.18;

    return body;
}

function createCreamSwirl(config, materials, options) {
    const group = new THREE.Group();
    group.name = "CupcakeCreamSwirl";

    const layout = config?.contentLayout?.cupcake ?? {};
    const wrapper = layout.wrapper ?? {
        radiusTop: 0.46,
        radiusBottom: 0.36,
        height: 0.48,
    };

    const topping = layout.topping ?? {
        radiusTop: 0.5,
        radiusBottom: 0.42,
        height: 0.24,
    };

    const creamMaterial = createCreamMaterial(
        materials,
        options.creamColor ?? DEFAULT_CUPCAKE_OPTIONS.creamColor,
    );

    const layers = [
        {
            name: "CreamLayerBase",
            radius: topping.radiusTop,
            height: topping.height * 0.44,
            y: wrapper.height * 0.5 + topping.height * 0.05,
            scale: [1, 0.58, 1],
        },
        {
            name: "CreamLayerMiddle",
            radius: topping.radiusTop * 0.72,
            height: topping.height * 0.38,
            y: wrapper.height * 0.5 + topping.height * 0.26,
            scale: [1, 0.62, 1],
        },
        {
            name: "CreamLayerTop",
            radius: topping.radiusTop * 0.45,
            height: topping.height * 0.34,
            y: wrapper.height * 0.5 + topping.height * 0.44,
            scale: [1, 0.7, 1],
        },
    ];

    layers.forEach((layer) => {
        const cream = createSphereMesh({
            name: layer.name,
            radius: layer.radius,
            widthSegments: 48,
            heightSegments: 20,
            material: creamMaterial,
        });

        cream.position.y = layer.y;
        cream.scale.set(layer.scale[0], layer.scale[1], layer.scale[2]);

        group.add(cream);
    });

    const spiralMaterial = creamMaterial.clone();
    spiralMaterial.name = "CupcakeCreamSpiralMaterial";
    spiralMaterial.color.offsetHSL(0, 0, -0.04);

    const spiralCount = 12;
    for (let index = 0; index < spiralCount; index += 1) {
        const angle = (index / spiralCount) * Math.PI * 2;
        const radius = topping.radiusTop * 0.48;
        const y = wrapper.height * 0.5 + topping.height * 0.28 + index * 0.006;

        const bead = createSphereMesh({
            name: `CreamSpiralBead_${index + 1}`,
            radius: 0.075,
            widthSegments: 16,
            heightSegments: 10,
            material: spiralMaterial,
        });

        bead.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
        bead.scale.set(1.25, 0.62, 0.82);

        group.add(bead);
    }

    return group;
}

function createCherry(config, materials, options) {
    const cherryMaterial = materials.boliviaRed.clone();
    cherryMaterial.name = "CupcakeCherryMaterial";
    cherryMaterial.color.set(options.cherryColor ?? DEFAULT_CUPCAKE_OPTIONS.cherryColor);
    cherryMaterial.roughness = 0.36;
    cherryMaterial.metalness = 0.02;

    const cherry = createSphereMesh({
        name: "CupcakeCherry",
        radius: 0.095,
        widthSegments: 32,
        heightSegments: 16,
        material: cherryMaterial,
    });

    const topping = config?.contentLayout?.cupcake?.topping ?? {
        height: 0.24,
    };

    const wrapper = config?.contentLayout?.cupcake?.wrapper ?? {
        height: 0.48,
    };

    cherry.position.y = wrapper.height * 0.5 + topping.height * 0.75;
    cherry.scale.set(1, 0.9, 1);

    const stemMaterial = materials.boliviaGreen.clone();
    stemMaterial.name = "CupcakeCherryStemMaterial";
    stemMaterial.color.set("#2e5f36");

    const stem = createCylinderMesh({
        name: "CupcakeCherryStem",
        radiusTop: 0.012,
        radiusBottom: 0.016,
        height: 0.18,
        radialSegments: 10,
        material: stemMaterial,
    });

    stem.position.set(0.035, cherry.position.y + 0.105, -0.025);
    stem.rotation.z = -0.45;

    const group = new THREE.Group();
    group.name = "CupcakeCherryDetail";
    group.add(cherry, stem);

    return group;
}

function createSprinkleMaterial(materials, index) {
    const palette = [
        materials.boliviaRed,
        materials.boliviaYellow,
        materials.boliviaGreen,
        materials.gold,
    ];

    const source = palette[index % palette.length];
    const material = source.clone();
    material.name = `CupcakeSprinkleMaterial_${index + 1}`;
    material.roughness = 0.42;
    material.metalness = 0.04;

    return material;
}

function createSprinkles(config, materials, options) {
    const group = new THREE.Group();
    group.name = "CupcakeSprinkles";

    const sprinkleCount = options.sprinkleCount ?? DEFAULT_CUPCAKE_OPTIONS.sprinkleCount;

    const wrapper = config?.contentLayout?.cupcake?.wrapper ?? {
        height: 0.48,
    };

    const topping = config?.contentLayout?.cupcake?.topping ?? {
        radiusTop: 0.5,
        height: 0.24,
    };

    for (let index = 0; index < sprinkleCount; index += 1) {
        const angle = (index / sprinkleCount) * Math.PI * 2;
        const randomOffset = Math.sin(index * 7.17) * 0.075;
        const radius = topping.radiusTop * (0.32 + (index % 4) * 0.08) + randomOffset;
        const y = wrapper.height * 0.5 + topping.height * (0.25 + (index % 5) * 0.055);

        const geometry = new THREE.BoxGeometry(0.13, 0.026, 0.035);
        const material = createSprinkleMaterial(materials, index);
        const sprinkle = new THREE.Mesh(geometry, material);

        sprinkle.name = `CupcakeSprinkle_${index + 1}`;
        sprinkle.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
        sprinkle.rotation.set(
            Math.sin(index * 1.7) * 0.4,
            angle,
            Math.cos(index * 1.3) * 0.3,
        );

        setMeshShadow(sprinkle, true, true);

        group.add(sprinkle);
    }

    return group;
}

function createCupcakeBaseShadow(materials) {
    const geometry = new THREE.CircleGeometry(0.68, 48);
    const shadow = new THREE.Mesh(geometry, materials.shadowSoft);

    shadow.name = "CupcakeContactShadow";
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.015;
    shadow.scale.set(1.05, 0.75, 1);

    return shadow;
}

function createCupcakePlate(materials) {
    const group = new THREE.Group();
    group.name = "CupcakeMiniPlate";

    const plateMaterial = materials.paper.clone();
    plateMaterial.name = "CupcakePlateMaterial";
    plateMaterial.color.set("#fff2da");
    plateMaterial.roughness = 0.62;

    const plate = createCylinderMesh({
        name: "CupcakePlateBody",
        radiusTop: 0.62,
        radiusBottom: 0.6,
        height: 0.045,
        radialSegments: 64,
        material: plateMaterial,
    });

    plate.position.y = 0.005;

    const rim = new THREE.Mesh(
        new THREE.TorusGeometry(0.62, 0.025, 10, 64),
        materials.gold,
    );

    rim.name = "CupcakePlateRim";
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.035;

    setMeshShadow(rim, true, true);

    group.add(plate, rim);

    return group;
}

export function createCupcake(config, materials, options = {}) {
    const group = new THREE.Group();
    group.name = "KickOffBoxCupcake";

    const mergedOptions = {
        ...DEFAULT_CUPCAKE_OPTIONS,
        ...options,
    };

    const plate = createCupcakePlate(materials);
    const shadow = createCupcakeBaseShadow(materials);
    const wrapper = createWrapper(config, materials, mergedOptions);
    const pleats = createWrapperPleats(config, materials, mergedOptions);
    const cakeBody = createCakeBody(config, materials);
    const creamSwirl = createCreamSwirl(config, materials, mergedOptions);
    const sprinkles = createSprinkles(config, materials, mergedOptions);
    const cherry = createCherry(config, materials, mergedOptions);

    group.add(
        shadow,
        plate,
        wrapper,
        pleats,
        cakeBody,
        creamSwirl,
        sprinkles,
        cherry,
    );

    const layout = config?.contentLayout?.cupcake ?? {};
    applyTransform(group, {
        position: layout.position ?? [-2.35, 0.68, 0.72],
        rotation: layout.rotation ?? [0, 0, 0],
        scale: layout.scale ?? [1, 1, 1],
    });

    group.userData = {
        type: "cupcake",
        editable: true,
        visibleInPresets: ["basica", "estandar", "premium"],
        description: "Detalle dulce para acompañar el presente académico.",
        options: mergedOptions,
    };

    setGroupShadow(group, true, true);

    return group;
}

export function updateCupcakeColors(cupcakeGroup, colors = {}) {
    if (!cupcakeGroup) return;

    const wrapper = cupcakeGroup.getObjectByName("CupcakeWrapper");
    const creamParts = cupcakeGroup.getObjectByName("CupcakeCreamSwirl");
    const cherry = cupcakeGroup.getObjectByName("CupcakeCherry");

    if (colors.wrapper && wrapper?.material?.color) {
        wrapper.material.color.set(colors.wrapper);
        wrapper.material.needsUpdate = true;
    }

    if (colors.cream && creamParts) {
        creamParts.traverse((object) => {
            if (object.isMesh && object.material?.color) {
                object.material.color.set(colors.cream);
                object.material.needsUpdate = true;
            }
        });
    }

    if (colors.cherry && cherry?.material?.color) {
        cherry.material.color.set(colors.cherry);
        cherry.material.needsUpdate = true;
    }
}

export function setCupcakeVisibility(cupcakeGroup, visible = true) {
    if (!cupcakeGroup) return;

    cupcakeGroup.visible = Boolean(visible);
}

export function setCupcakeSprinklesVisibility(cupcakeGroup, visible = true) {
    const sprinkles = cupcakeGroup?.getObjectByName("CupcakeSprinkles");

    if (!sprinkles) return;

    sprinkles.visible = Boolean(visible);
}

export function getCupcakeParts(cupcakeGroup) {
    if (!cupcakeGroup) return {};

    return {
        plate: cupcakeGroup.getObjectByName("CupcakeMiniPlate"),
        wrapper: cupcakeGroup.getObjectByName("CupcakeWrapper"),
        pleats: cupcakeGroup.getObjectByName("CupcakeWrapperPleats"),
        cakeBody: cupcakeGroup.getObjectByName("CupcakeCakeBody"),
        creamSwirl: cupcakeGroup.getObjectByName("CupcakeCreamSwirl"),
        sprinkles: cupcakeGroup.getObjectByName("CupcakeSprinkles"),
        cherry: cupcakeGroup.getObjectByName("CupcakeCherryDetail"),
        shadow: cupcakeGroup.getObjectByName("CupcakeContactShadow"),
    };
}

export function disposeCupcake(cupcakeGroup) {
    if (!cupcakeGroup) return;

    cupcakeGroup.traverse((object) => {
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

    cupcakeGroup.removeFromParent();
}
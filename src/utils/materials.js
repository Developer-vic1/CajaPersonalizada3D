import * as THREE from "three";

const DEFAULT_COLOR = "#ffffff";

function getColor(config, key, fallback = DEFAULT_COLOR) {
    return config?.colors?.[key] ?? fallback;
}

function getMaterialSettings(config, key) {
    return config?.materialSettings?.[key] ?? {};
}

function createStandardMaterial({
    name,
    color,
    roughness = 0.7,
    metalness = 0,
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

function createPhysicalMaterial({
    name,
    color,
    roughness = 0.35,
    metalness = 0,
    transmission = 0,
    opacity = 1,
    thickness = 0,
    transparent = false,
    side = THREE.FrontSide,
    clearcoat = 0,
    clearcoatRoughness = 0.2,
    envMapIntensity = 1,
}) {
    const material = new THREE.MeshPhysicalMaterial({
        name,
        color,
        roughness,
        metalness,
        transmission,
        opacity,
        thickness,
        transparent,
        side,
        clearcoat,
        clearcoatRoughness,
        envMapIntensity,
    });

    material.needsUpdate = true;
    return material;
}

function createBasicMaterial({
    name,
    color,
    transparent = false,
    opacity = 1,
    side = THREE.FrontSide,
}) {
    const material = new THREE.MeshBasicMaterial({
        name,
        color,
        transparent,
        opacity,
        side,
    });

    material.needsUpdate = true;
    return material;
}

export function createMaterials(config) {
    const cardboard = getMaterialSettings(config, "cardboard");
    const interior = getMaterialSettings(config, "interior");
    const paper = getMaterialSettings(config, "paper");
    const decorative = getMaterialSettings(config, "decorative");
    const resin = getMaterialSettings(config, "resin");
    const bottle = getMaterialSettings(config, "bottle");

    return {
        boxExterior: createStandardMaterial({
            name: "boxExterior",
            color: getColor(config, "exterior", "#c89f72"),
            roughness: cardboard.roughness ?? 0.78,
            metalness: cardboard.metalness ?? 0.03,
        }),

        boxInterior: createStandardMaterial({
            name: "boxInterior",
            color: getColor(config, "interior", "#f3e0c5"),
            roughness: interior.roughness ?? 0.82,
            metalness: interior.metalness ?? 0.02,
        }),

        darkCardboard: createStandardMaterial({
            name: "darkCardboard",
            color: getColor(config, "darkCardboard", "#7a4f2a"),
            roughness: cardboard.roughness ?? 0.86,
            metalness: cardboard.metalness ?? 0.02,
        }),

        paper: createStandardMaterial({
            name: "paper",
            color: getColor(config, "paper", "#fff7e8"),
            roughness: paper.roughness ?? 0.7,
            metalness: paper.metalness ?? 0,
        }),

        paperBack: createStandardMaterial({
            name: "paperBack",
            color: "#ead6b8",
            roughness: paper.roughness ?? 0.74,
            metalness: paper.metalness ?? 0,
        }),

        boliviaRed: createStandardMaterial({
            name: "boliviaRed",
            color: getColor(config, "boliviaRed", "#b92d2d"),
            roughness: decorative.roughness ?? 0.55,
            metalness: decorative.metalness ?? 0.03,
        }),

        boliviaYellow: createStandardMaterial({
            name: "boliviaYellow",
            color: getColor(config, "boliviaYellow", "#f0c84b"),
            roughness: decorative.roughness ?? 0.5,
            metalness: decorative.metalness ?? 0.03,
        }),

        boliviaGreen: createStandardMaterial({
            name: "boliviaGreen",
            color: getColor(config, "boliviaGreen", "#2f7d55"),
            roughness: decorative.roughness ?? 0.56,
            metalness: decorative.metalness ?? 0.03,
        }),

        chocolate: createStandardMaterial({
            name: "chocolate",
            color: getColor(config, "chocolate", "#6d3b22"),
            roughness: 0.75,
            metalness: 0,
        }),

        cream: createStandardMaterial({
            name: "cream",
            color: getColor(config, "cream", "#f5d9a7"),
            roughness: 0.7,
            metalness: 0,
        }),

        sodaBottle: createPhysicalMaterial({
            name: "sodaBottle",
            color: getColor(config, "sodaBlue", "#2f86c7"),
            roughness: bottle.roughness ?? 0.18,
            metalness: bottle.metalness ?? 0.02,
            transmission: bottle.transmission ?? 0.25,
            opacity: bottle.opacity ?? 0.72,
            thickness: bottle.thickness ?? 0.8,
            transparent: true,
            clearcoat: 0.22,
            clearcoatRoughness: 0.12,
            envMapIntensity: 1.2,
        }),

        sodaCap: createStandardMaterial({
            name: "sodaCap",
            color: "#f4f1e8",
            roughness: 0.5,
            metalness: 0.05,
        }),

        resin: createPhysicalMaterial({
            name: "resin",
            color: "#d7efff",
            roughness: resin.roughness ?? 0.16,
            metalness: resin.metalness ?? 0.03,
            transmission: resin.transmission ?? 0.25,
            opacity: resin.opacity ?? 0.78,
            thickness: resin.thickness ?? 0.7,
            transparent: true,
            clearcoat: 0.35,
            clearcoatRoughness: 0.08,
            envMapIntensity: 1.25,
        }),

        gold: createStandardMaterial({
            name: "gold",
            color: getColor(config, "gold", "#c59a4a"),
            roughness: 0.32,
            metalness: 0.28,
        }),

        textDark: createStandardMaterial({
            name: "textDark",
            color: getColor(config, "textDark", "#2b2118"),
            roughness: 0.5,
            metalness: 0,
        }),

        blackText: createStandardMaterial({
            name: "blackText",
            color: getColor(config, "textDark", "#2b2118"),
            roughness: 0.5,
            metalness: 0,
        }),

        floor: createStandardMaterial({
            name: "floor",
            color: config?.environment?.floor?.color ?? "#2c1c12",
            roughness: 0.92,
            metalness: 0.02,
        }),

        ring: createBasicMaterial({
            name: "environmentRing",
            color: config?.environment?.ring?.color ?? "#c89f72",
            transparent: true,
            opacity: config?.environment?.ring?.opacity ?? 0.22,
            side: THREE.DoubleSide,
        }),

        gridLine: createBasicMaterial({
            name: "gridLine",
            color: "#7a4f2a",
            transparent: true,
            opacity: 0.18,
        }),

        shadowSoft: createBasicMaterial({
            name: "shadowSoft",
            color: "#000000",
            transparent: true,
            opacity: 0.18,
            side: THREE.DoubleSide,
        }),

        transparentHelper: createBasicMaterial({
            name: "transparentHelper",
            color: "#ffffff",
            transparent: true,
            opacity: 0.08,
            side: THREE.DoubleSide,
        }),
    };
}

export function updateMaterialColor(material, color) {
    if (!material || !material.color) return;

    material.color.set(color);
    material.needsUpdate = true;
}

export function updateMaterialOpacity(material, opacity) {
    if (!material) return;

    material.opacity = opacity;
    material.transparent = opacity < 1;
    material.needsUpdate = true;
}

export function disposeMaterials(materials) {
    Object.values(materials).forEach((material) => {
        if (material?.dispose) {
            material.dispose();
        }
    });
}
import * as THREE from "three";

import {
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

import {
    createPaperFillerTexture,
} from "../utils/textureFactory.js";

export const PAPER_FILLER_VERSION = "2.0.0";

export const PAPER_FILLER_STYLES_3D = Object.freeze({
    BLACK_GOLD: "black-gold",
    KRAFT: "kraft",
    WHITE: "white",
    GOLD: "gold",
    TRICOLOR: "tricolor",
    PREMIUM: "premium",
    ACADEMIC: "academic",
});

export const PAPER_FILLER_DENSITY = Object.freeze({
    LIGHT: "light",
    MEDIUM: "medium",
    HIGH: "high",
    SHOWCASE: "showcase",
});

export const PAPER_STRIP_SHAPES = Object.freeze({
    CURL: "curl",
    WAVE: "wave",
    RIBBON: "ribbon",
    CONFETTI: "confetti",
    SUPPORT_NEST: "support-nest",
});

const DEFAULT_PAPER_FILLER_OPTIONS = Object.freeze({
    style: PAPER_FILLER_STYLES_3D.BLACK_GOLD,
    density: PAPER_FILLER_DENSITY.HIGH,

    width: 2.45,
    depth: 1.58,
    height: 0.18,
    baseY: 0.08,

    stripCount: 72,
    curlCount: 34,
    confettiCount: 110,
    supportCount: 28,

    stripRadius: 0.006,
    stripWidth: 0.035,
    stripLengthMin: 0.28,
    stripLengthMax: 0.72,

    randomness: 0.72,
    curlIntensity: 0.55,
    verticalVariation: 0.105,

    showBaseVolume: true,
    showCurledStrips: true,
    showRibbonStrips: true,
    showConfetti: true,
    showSupportNest: true,
    showTexturePlane: true,

    avoidCenterForBottle: true,
    bottleSupportChannel: true,
    bottleChannelWidth: 0.46,
    bottleChannelDepth: 1.22,

    seed: 2026,
    opacity: 1,
    roughness: 0.86,
    metalness: 0.02,
});

const STYLE_PALETTES = Object.freeze({
    [PAPER_FILLER_STYLES_3D.BLACK_GOLD]: Object.freeze({
        base: "#14100b",
        colors: Object.freeze(["#111111", "#2b2118", "#c59a4a", "#e9c678"]),
        accent: "#c59a4a",
        metallic: 0.08,
        roughness: 0.72,
    }),

    [PAPER_FILLER_STYLES_3D.KRAFT]: Object.freeze({
        base: "#b9824f",
        colors: Object.freeze(["#8b5f35", "#b9824f", "#d8b37c", "#f0d8a8"]),
        accent: "#8b5f35",
        metallic: 0.01,
        roughness: 0.92,
    }),

    [PAPER_FILLER_STYLES_3D.WHITE]: Object.freeze({
        base: "#f7f2e8",
        colors: Object.freeze(["#ffffff", "#f4efe5", "#e7dcc9", "#d8cdbb"]),
        accent: "#d8cdbb",
        metallic: 0.0,
        roughness: 0.94,
    }),

    [PAPER_FILLER_STYLES_3D.GOLD]: Object.freeze({
        base: "#c59a4a",
        colors: Object.freeze(["#8a682f", "#c59a4a", "#e9c678", "#fff0b8"]),
        accent: "#e9c678",
        metallic: 0.18,
        roughness: 0.46,
    }),

    [PAPER_FILLER_STYLES_3D.TRICOLOR]: Object.freeze({
        base: "#111111",
        colors: Object.freeze(["#b92d2d", "#f0c84b", "#2f7d55", "#fff7e8"]),
        accent: "#f0c84b",
        metallic: 0.04,
        roughness: 0.82,
    }),

    [PAPER_FILLER_STYLES_3D.PREMIUM]: Object.freeze({
        base: "#0f0c09",
        colors: Object.freeze(["#0f0c09", "#24180f", "#c59a4a", "#fff0b8", "#b92d2d"]),
        accent: "#e9c678",
        metallic: 0.12,
        roughness: 0.62,
    }),

    [PAPER_FILLER_STYLES_3D.ACADEMIC]: Object.freeze({
        base: "#111827",
        colors: Object.freeze(["#111827", "#1f2937", "#2f86c7", "#c59a4a", "#fff7e8"]),
        accent: "#2f86c7",
        metallic: 0.06,
        roughness: 0.74,
    }),
});

const DENSITY_PRESETS = Object.freeze({
    [PAPER_FILLER_DENSITY.LIGHT]: Object.freeze({
        stripCount: 34,
        curlCount: 12,
        confettiCount: 38,
        supportCount: 10,
    }),

    [PAPER_FILLER_DENSITY.MEDIUM]: Object.freeze({
        stripCount: 52,
        curlCount: 22,
        confettiCount: 72,
        supportCount: 18,
    }),

    [PAPER_FILLER_DENSITY.HIGH]: Object.freeze({
        stripCount: 72,
        curlCount: 34,
        confettiCount: 110,
        supportCount: 28,
    }),

    [PAPER_FILLER_DENSITY.SHOWCASE]: Object.freeze({
        stripCount: 96,
        curlCount: 46,
        confettiCount: 150,
        supportCount: 38,
    }),
});

function createSeededRandom(seed = 2026) {
    let value = Number(seed) || 2026;

    return function random() {
        value = (value * 1664525 + 1013904223) % 4294967296;
        return value / 4294967296;
    };
}

function randomRange(random, min, max) {
    return min + random() * (max - min);
}

function pickRandom(random, values) {
    return values[Math.floor(random() * values.length) % values.length];
}

function normalizeOptions(config = {}) {
    const source = config.paperFiller ?? config.visual ?? config;
    const densityPreset = DENSITY_PRESETS[source.density ?? DEFAULT_PAPER_FILLER_OPTIONS.density];

    return {
        ...DEFAULT_PAPER_FILLER_OPTIONS,
        ...densityPreset,
        ...source,
    };
}

function getPalette(style) {
    return STYLE_PALETTES[style] ?? STYLE_PALETTES[PAPER_FILLER_STYLES_3D.BLACK_GOLD];
}

function createPaperMaterial(color, options, palette) {
    const material = new THREE.MeshStandardMaterial({
        name: `PaperFillerMaterial_${color}`,
        color,
        roughness: options.roughness ?? palette.roughness,
        metalness: palette.metallic,
        transparent: options.opacity < 1,
        opacity: options.opacity,
        side: THREE.DoubleSide,
    });

    material.userData = {
        generatedBy: "PaperFiller",
        style: options.style,
        version: PAPER_FILLER_VERSION,
    };

    return material;
}

function createMaterialSet(options) {
    const palette = getPalette(options.style);

    return palette.colors.map((color) => createPaperMaterial(color, options, palette));
}

function createBaseVolumeMaterial(options) {
    const palette = getPalette(options.style);

    return new THREE.MeshStandardMaterial({
        name: "PaperFillerBaseVolumeMaterial",
        color: palette.base,
        roughness: Math.min((options.roughness ?? palette.roughness) + 0.08, 1),
        metalness: palette.metallic * 0.35,
        transparent: true,
        opacity: 0.42,
    });
}

function createRibbonGeometry(width = 0.035, length = 0.45) {
    const geometry = new THREE.PlaneGeometry(length, width, 8, 1);
    const position = geometry.attributes.position;

    for (let index = 0; index < position.count; index += 1) {
        const x = position.getX(index);
        const wave = Math.sin((x / length + 0.5) * Math.PI * 2) * width * 0.22;
        position.setZ(index, wave);
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();

    return geometry;
}

function createCurledStripGeometry(options, random) {
    const length = randomRange(random, options.stripLengthMin, options.stripLengthMax);
    const points = [];
    const segments = 18;

    const amplitude = randomRange(random, 0.025, 0.07) * options.curlIntensity;
    const twist = randomRange(random, 1.2, 2.8);
    const rise = randomRange(random, -0.015, 0.035);

    for (let index = 0; index <= segments; index += 1) {
        const t = index / segments;
        const x = (t - 0.5) * length;
        const y = Math.sin(t * Math.PI * twist) * amplitude + rise * t;
        const z = Math.cos(t * Math.PI * twist) * amplitude * 0.62;

        points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    curve.curveType = "catmullrom";
    curve.tension = 0.48;

    const geometry = new THREE.TubeGeometry(
        curve,
        24,
        options.stripRadius,
        6,
        false,
    );

    geometry.computeVertexNormals();

    return geometry;
}

function createSupportNestGeometry(options, random) {
    const length = randomRange(random, 0.42, 0.82);
    const points = [];
    const segments = 22;

    for (let index = 0; index <= segments; index += 1) {
        const t = index / segments;
        const angle = t * Math.PI * 2.4;
        const radius = randomRange(random, 0.045, 0.095) * (1 - t * 0.18);
        const x = (t - 0.5) * length;
        const y = Math.sin(angle) * radius * 0.42;
        const z = Math.cos(angle) * radius;

        points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    curve.curveType = "catmullrom";
    curve.tension = 0.5;

    const geometry = new THREE.TubeGeometry(
        curve,
        28,
        options.stripRadius * 1.15,
        7,
        false,
    );

    geometry.computeVertexNormals();

    return geometry;
}

function createBaseVolume(options) {
    const group = new THREE.Group();
    group.name = "PaperFillerBaseVolume";
    group.visible = Boolean(options.showBaseVolume);

    if (!group.visible) return group;

    const geometry = new THREE.BoxGeometry(
        options.width,
        options.height * 0.42,
        options.depth,
        18,
        2,
        12,
    );

    const position = geometry.attributes.position;

    for (let index = 0; index < position.count; index += 1) {
        const x = position.getX(index);
        const z = position.getZ(index);
        const distanceFromCenter = Math.sqrt(
            (x / options.width) ** 2 +
            (z / options.depth) ** 2,
        );

        const lift = Math.max(0, 1 - distanceFromCenter * 1.8) * options.height * 0.18;
        const ripple = Math.sin(x * 9.5 + z * 5.5) * options.height * 0.025;

        position.setY(index, position.getY(index) + lift + ripple);
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, createBaseVolumeMaterial(options));
    mesh.name = "PaperFillerSoftVolume";
    mesh.position.y = options.baseY;
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    group.add(mesh);

    return group;
}

function createTexturePlane(options) {
    const group = new THREE.Group();
    group.name = "PaperFillerTexturePlane";
    group.visible = Boolean(options.showTexturePlane);

    if (!group.visible) return group;

    const resource = createPaperFillerTexture({
        style: options.style,
        repeatX: 2.8,
        repeatY: 2.4,
    });

    const material = new THREE.MeshStandardMaterial({
        name: "PaperFillerTexturePlaneMaterial",
        map: resource.texture,
        roughness: 0.88,
        metalness: 0.01,
        transparent: true,
        opacity: 0.78,
        side: THREE.DoubleSide,
    });

    material.userData.textureResource = resource;

    const geometry = new THREE.PlaneGeometry(options.width * 0.98, options.depth * 0.96, 18, 12);
    const position = geometry.attributes.position;

    for (let index = 0; index < position.count; index += 1) {
        const x = position.getX(index);
        const y = position.getY(index);
        const lift = Math.sin(x * 7.1 + y * 4.3) * 0.012;
        position.setZ(index, lift);
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();

    const plane = new THREE.Mesh(geometry, material);
    plane.name = "PaperFillerPrintedSurface";
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = options.baseY + options.height * 0.16;
    plane.receiveShadow = true;

    group.add(plane);
    return group;
}

function isInsideBottleChannel(x, z, options) {
    if (!options.avoidCenterForBottle) return false;

    const inX = Math.abs(x) < options.bottleChannelWidth / 2;
    const inZ = Math.abs(z) < options.bottleChannelDepth / 2;

    return inX && inZ;
}

function projectAwayFromBottleChannel(position, options) {
    if (!isInsideBottleChannel(position.x, position.z, options)) {
        return position;
    }

    const side = position.x >= 0 ? 1 : -1;

    position.x = side * randomSafeOffset(Math.abs(position.x), options.bottleChannelWidth * 0.62);
    position.z += position.z >= 0 ? 0.16 : -0.16;

    return position;
}

function randomSafeOffset(value, minAbs) {
    return Math.max(value, minAbs);
}

function createCurledStrips(options, random, materials) {
    const group = new THREE.Group();
    group.name = "PaperFillerCurledStrips";
    group.visible = Boolean(options.showCurledStrips);

    if (!group.visible) return group;

    for (let index = 0; index < options.curlCount; index += 1) {
        const material = materials[index % materials.length];
        const geometry = createCurledStripGeometry(options, random);

        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = `PaperCurl_${index + 1}`;

        const position = new THREE.Vector3(
            randomRange(random, -options.width * 0.46, options.width * 0.46),
            options.baseY + randomRange(random, 0.03, options.height + options.verticalVariation),
            randomRange(random, -options.depth * 0.45, options.depth * 0.45),
        );

        projectAwayFromBottleChannel(position, options);

        mesh.position.copy(position);
        mesh.rotation.set(
            randomRange(random, -0.18, 0.28),
            randomRange(random, 0, Math.PI * 2),
            randomRange(random, -0.32, 0.32),
        );

        mesh.scale.setScalar(randomRange(random, 0.78, 1.22));
        setMeshShadow(mesh, true, true);

        mesh.userData = {
            type: PAPER_STRIP_SHAPES.CURL,
            index,
            style: options.style,
        };

        group.add(mesh);
    }

    return group;
}

function createRibbonStrips(options, random, materials) {
    const group = new THREE.Group();
    group.name = "PaperFillerRibbonStrips";
    group.visible = Boolean(options.showRibbonStrips);

    if (!group.visible) return group;

    for (let index = 0; index < options.stripCount; index += 1) {
        const length = randomRange(random, options.stripLengthMin, options.stripLengthMax);
        const width = randomRange(random, options.stripWidth * 0.72, options.stripWidth * 1.24);
        const geometry = createRibbonGeometry(width, length);
        const material = materials[(index + 2) % materials.length];

        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = `PaperRibbon_${index + 1}`;

        const position = new THREE.Vector3(
            randomRange(random, -options.width * 0.47, options.width * 0.47),
            options.baseY + randomRange(random, 0.045, options.height + options.verticalVariation),
            randomRange(random, -options.depth * 0.46, options.depth * 0.46),
        );

        projectAwayFromBottleChannel(position, options);

        mesh.position.copy(position);
        mesh.rotation.set(
            randomRange(random, -0.9, 0.9),
            randomRange(random, 0, Math.PI * 2),
            randomRange(random, -0.8, 0.8),
        );

        mesh.scale.set(
            randomRange(random, 0.82, 1.16),
            randomRange(random, 0.88, 1.2),
            1,
        );

        setMeshShadow(mesh, true, true);

        mesh.userData = {
            type: PAPER_STRIP_SHAPES.RIBBON,
            index,
            style: options.style,
        };

        group.add(mesh);
    }

    return group;
}

function createSupportNest(options, random, materials) {
    const group = new THREE.Group();
    group.name = "PaperFillerSupportNest";
    group.visible = Boolean(options.showSupportNest);

    if (!group.visible) return group;

    for (let index = 0; index < options.supportCount; index += 1) {
        const geometry = createSupportNestGeometry(options, random);
        const material = materials[(index + 1) % materials.length];

        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = `PaperSupportNest_${index + 1}`;

        const laneSide = index % 2 === 0 ? -1 : 1;
        const position = new THREE.Vector3(
            laneSide * randomRange(random, options.bottleChannelWidth * 0.38, options.width * 0.42),
            options.baseY + randomRange(random, 0.075, options.height + 0.08),
            randomRange(random, -options.depth * 0.35, options.depth * 0.35),
        );

        mesh.position.copy(position);
        mesh.rotation.set(
            randomRange(random, -0.18, 0.28),
            randomRange(random, 0, Math.PI * 2),
            randomRange(random, -0.18, 0.18),
        );

        mesh.scale.setScalar(randomRange(random, 0.92, 1.28));
        setMeshShadow(mesh, true, true);

        mesh.userData = {
            type: PAPER_STRIP_SHAPES.SUPPORT_NEST,
            index,
            role: "bottle-support",
            style: options.style,
        };

        group.add(mesh);
    }

    return group;
}

function createConfetti(options, random, materials) {
    const group = new THREE.Group();
    group.name = "PaperFillerConfetti";
    group.visible = Boolean(options.showConfetti);

    if (!group.visible) return group;

    const geometry = new THREE.PlaneGeometry(0.05, 0.018);
    const material = materials[0];

    const instanced = new THREE.InstancedMesh(geometry, material, options.confettiCount);
    instanced.name = "PaperConfettiInstances";

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    const palette = getPalette(options.style);

    for (let index = 0; index < options.confettiCount; index += 1) {
        const position = new THREE.Vector3(
            randomRange(random, -options.width * 0.48, options.width * 0.48),
            options.baseY + randomRange(random, 0.06, options.height + options.verticalVariation * 1.2),
            randomRange(random, -options.depth * 0.48, options.depth * 0.48),
        );

        projectAwayFromBottleChannel(position, options);

        dummy.position.copy(position);
        dummy.rotation.set(
            randomRange(random, -Math.PI, Math.PI),
            randomRange(random, -Math.PI, Math.PI),
            randomRange(random, -Math.PI, Math.PI),
        );
        dummy.scale.set(
            randomRange(random, 0.55, 1.35),
            randomRange(random, 0.55, 1.2),
            1,
        );
        dummy.updateMatrix();

        instanced.setMatrixAt(index, dummy.matrix);
        color.set(pickRandom(random, palette.colors));
        instanced.setColorAt(index, color);
    }

    instanced.instanceMatrix.needsUpdate = true;

    if (instanced.instanceColor) {
        instanced.instanceColor.needsUpdate = true;
    }

    instanced.userData = {
        type: PAPER_STRIP_SHAPES.CONFETTI,
        count: options.confettiCount,
        style: options.style,
    };

    setMeshShadow(instanced, true, true);
    group.add(instanced);

    return group;
}

function createBottleSupportChannel(options) {
    const group = new THREE.Group();
    group.name = "PaperFillerBottleSupportChannel";
    group.visible = Boolean(options.bottleSupportChannel);

    if (!group.visible) return group;

    const material = new THREE.MeshBasicMaterial({
        name: "BottleSupportChannelGuideMaterial",
        color: "#000000",
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
        side: THREE.DoubleSide,
    });

    const geometry = new THREE.PlaneGeometry(
        options.bottleChannelWidth,
        options.bottleChannelDepth,
        8,
        16,
    );

    const guide = new THREE.Mesh(geometry, material);
    guide.name = "BottleSupportChannelSoftShadow";
    guide.rotation.x = -Math.PI / 2;
    guide.position.y = options.baseY + 0.025;

    group.add(guide);

    return group;
}

function applyOverallTransform(group, config = {}) {
    const transform = config.transform ?? config.layout ?? {};

    if (Array.isArray(transform.position)) {
        group.position.set(
            Number(transform.position[0]) || 0,
            Number(transform.position[1]) || 0,
            Number(transform.position[2]) || 0,
        );
    }

    if (Array.isArray(transform.rotation)) {
        group.rotation.set(
            Number(transform.rotation[0]) || 0,
            Number(transform.rotation[1]) || 0,
            Number(transform.rotation[2]) || 0,
        );
    }

    if (Array.isArray(transform.scale)) {
        group.scale.set(
            Number(transform.scale[0]) || 1,
            Number(transform.scale[1]) || 1,
            Number(transform.scale[2]) || 1,
        );
    }

    return group;
}

function createMetadata(options) {
    return {
        objectType: "PaperFiller",
        version: PAPER_FILLER_VERSION,
        style: options.style,
        density: options.density,
        dimensions: {
            width: options.width,
            depth: options.depth,
            height: options.height,
            baseY: options.baseY,
        },
        counts: {
            strips: options.stripCount,
            curls: options.curlCount,
            confetti: options.confettiCount,
            supports: options.supportCount,
        },
        role: "decorative-support-volume",
        supportsBottle: Boolean(options.bottleSupportChannel),
        editable: true,
        createdAt: new Date().toISOString(),
    };
}

export function createPaperFiller(config = {}, materials = {}, textureSet = {}) {
    const options = normalizeOptions(config);
    const random = createSeededRandom(options.seed);
    const localMaterials = createMaterialSet(options);

    const group = new THREE.Group();
    group.name = "PaperFiller";
    group.userData = createMetadata(options);

    const baseVolume = createBaseVolume(options);
    const texturePlane = createTexturePlane(options);
    const supportChannel = createBottleSupportChannel(options);
    const supportNest = createSupportNest(options, random, localMaterials);
    const curledStrips = createCurledStrips(options, random, localMaterials);
    const ribbonStrips = createRibbonStrips(options, random, localMaterials);
    const confetti = createConfetti(options, random, localMaterials);

    group.add(
        baseVolume,
        texturePlane,
        supportChannel,
        supportNest,
        curledStrips,
        ribbonStrips,
        confetti,
    );

    group.userData.localMaterials = localMaterials;
    group.userData.parts = {
        baseVolume: baseVolume.name,
        texturePlane: texturePlane.name,
        supportChannel: supportChannel.name,
        supportNest: supportNest.name,
        curledStrips: curledStrips.name,
        ribbonStrips: ribbonStrips.name,
        confetti: confetti.name,
    };

    applyOverallTransform(group, config);
    setGroupShadow(group, true, true);

    return group;
}

export function updatePaperFillerAnimation(paperFiller, elapsedTime = 0) {
    if (!paperFiller) return;

    const curls = paperFiller.getObjectByName("PaperFillerCurledStrips");
    const ribbons = paperFiller.getObjectByName("PaperFillerRibbonStrips");
    const confetti = paperFiller.getObjectByName("PaperConfettiInstances");

    if (curls) {
        curls.children.forEach((strip, index) => {
            strip.rotation.z += Math.sin(elapsedTime * 0.35 + index) * 0.0007;
            strip.position.y += Math.sin(elapsedTime * 0.6 + index * 0.41) * 0.00035;
        });
    }

    if (ribbons) {
        ribbons.children.forEach((strip, index) => {
            strip.rotation.x += Math.sin(elapsedTime * 0.28 + index * 0.37) * 0.00055;
        });
    }

    if (confetti?.isInstancedMesh) {
        confetti.rotation.y = Math.sin(elapsedTime * 0.12) * 0.006;
    }
}

export function setPaperFillerStyle(paperFiller, style = PAPER_FILLER_STYLES_3D.BLACK_GOLD) {
    if (!paperFiller) return;

    const palette = getPalette(style);
    const color = new THREE.Color();

    paperFiller.traverse((object) => {
        if (!object.material) return;

        const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

        materials.forEach((material, index) => {
            if (!material.color) return;

            color.set(palette.colors[index % palette.colors.length]);
            material.color.copy(color);

            if ("roughness" in material) material.roughness = palette.roughness;
            if ("metalness" in material) material.metalness = palette.metallic;

            material.needsUpdate = true;
        });
    });

    paperFiller.userData.style = style;
    paperFiller.userData.updatedAt = new Date().toISOString();
}

export function setPaperFillerDensityVisibility(paperFiller, density = PAPER_FILLER_DENSITY.HIGH) {
    if (!paperFiller) return;

    const visibility = {
        [PAPER_FILLER_DENSITY.LIGHT]: {
            curls: true,
            ribbons: true,
            confetti: false,
            support: false,
        },
        [PAPER_FILLER_DENSITY.MEDIUM]: {
            curls: true,
            ribbons: true,
            confetti: true,
            support: false,
        },
        [PAPER_FILLER_DENSITY.HIGH]: {
            curls: true,
            ribbons: true,
            confetti: true,
            support: true,
        },
        [PAPER_FILLER_DENSITY.SHOWCASE]: {
            curls: true,
            ribbons: true,
            confetti: true,
            support: true,
        },
    }[density] ?? {
        curls: true,
        ribbons: true,
        confetti: true,
        support: true,
    };

    const curls = paperFiller.getObjectByName("PaperFillerCurledStrips");
    const ribbons = paperFiller.getObjectByName("PaperFillerRibbonStrips");
    const confetti = paperFiller.getObjectByName("PaperFillerConfetti");
    const support = paperFiller.getObjectByName("PaperFillerSupportNest");

    if (curls) curls.visible = visibility.curls;
    if (ribbons) ribbons.visible = visibility.ribbons;
    if (confetti) confetti.visible = visibility.confetti;
    if (support) support.visible = visibility.support;

    paperFiller.userData.density = density;
    paperFiller.userData.updatedAt = new Date().toISOString();
}

export function getPaperFillerParts(paperFiller) {
    if (!paperFiller) return {};

    return {
        baseVolume: paperFiller.getObjectByName("PaperFillerBaseVolume"),
        texturePlane: paperFiller.getObjectByName("PaperFillerTexturePlane"),
        supportChannel: paperFiller.getObjectByName("PaperFillerBottleSupportChannel"),
        supportNest: paperFiller.getObjectByName("PaperFillerSupportNest"),
        curledStrips: paperFiller.getObjectByName("PaperFillerCurledStrips"),
        ribbonStrips: paperFiller.getObjectByName("PaperFillerRibbonStrips"),
        confetti: paperFiller.getObjectByName("PaperFillerConfetti"),
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

        if (item.userData?.textureResource?.texture) {
            disposeTexture(item.userData.textureResource.texture);
        }

        if (item.dispose) {
            item.dispose();
        }
    });
}

export function disposePaperFiller(paperFiller) {
    if (!paperFiller) return;

    paperFiller.traverse((object) => {
        if (object.geometry?.dispose) {
            object.geometry.dispose();
        }

        if (object.material) {
            disposeMaterial(object.material);
        }
    });

    const localMaterials = paperFiller.userData?.localMaterials ?? [];

    localMaterials.forEach((material) => {
        disposeMaterial(material);
    });

    paperFiller.removeFromParent();
}

export const PaperFiller = Object.freeze({
    version: PAPER_FILLER_VERSION,
    styles: PAPER_FILLER_STYLES_3D,
    density: PAPER_FILLER_DENSITY,
    stripShapes: PAPER_STRIP_SHAPES,

    createPaperFiller,
    updatePaperFillerAnimation,
    setPaperFillerStyle,
    setPaperFillerDensityVisibility,
    getPaperFillerParts,
    disposePaperFiller,
});
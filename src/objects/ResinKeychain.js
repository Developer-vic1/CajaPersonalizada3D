import * as THREE from "three";

import {
    applyTransform,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

export const RESIN_KEYCHAIN_VERSION = "2.0.0";

export const RESIN_KEYCHAIN_SHAPES = Object.freeze({
    CIRCLE: "circle",
    ROUNDED_RECT: "rounded-rect",
    SHIELD: "shield",
    TAG: "tag",
    DROP: "drop",
});

export const RESIN_KEYCHAIN_STYLES = Object.freeze({
    PREMIUM_GOLD: "premium-gold",
    ACADEMIC: "academic",
    BOLIVIA_2026: "bolivia-2026",
    DARK_ELEGANT: "dark-elegant",
    CLEAR_MINIMAL: "clear-minimal",
});

export const RESIN_KEYCHAIN_ORIENTATION = Object.freeze({
    FLAT: "flat",
    LEANING: "leaning",
    HANGING: "hanging",
});

const LOGO_PATHS = Object.freeze({
    claro: "/image/Logo-Claro.png",
    oscuro: "/image/Logo-Oscuro.png",
});

const DEFAULT_OPTIONS = Object.freeze({
    shape: RESIN_KEYCHAIN_SHAPES.ROUNDED_RECT,
    style: RESIN_KEYCHAIN_STYLES.PREMIUM_GOLD,
    orientation: RESIN_KEYCHAIN_ORIENTATION.FLAT,

    width: 0.72,
    height: 0.92,
    depth: 0.115,

    bodyColor: "#fff7e8",
    innerGlowColor: "#fff8df",
    accentColor: "#c59a4a",
    secondaryAccent: "#b92d2d",
    greenAccent: "#2f7d55",

    opacity: 0.72,
    transmission: 0.38,
    roughness: 0.08,
    thickness: 0.42,
    metalness: 0.02,
    ior: 1.46,
    clearcoat: 1,
    clearcoatRoughness: 0.045,

    borderColor: "#c59a4a",
    ringColor: "#d6d6d6",
    chainColor: "#c9c9c9",
    glitterColor: "#fff3b6",
    engravingColor: "#7a4f2a",

    logoVariant: "claro",
    logoScale: 0.56,

    labelText: "SIS",
    labelSubtitle: "KickOff 2026",
    labelFooter: "UNIFRANZ",

    showBody: true,
    showInnerGlow: true,
    showBorder: true,
    showLogo: true,
    showRing: true,
    showChain: true,
    showEngraving: true,
    showGlitter: true,
    showHighlights: true,
    showShadow: true,
    showConnectorHole: true,
    showColorInclusion: true,

    glitterCount: 46,
    renderOrder: 8,
});

const STYLE_PRESETS = Object.freeze({
    [RESIN_KEYCHAIN_STYLES.PREMIUM_GOLD]: Object.freeze({
        bodyColor: "#fff7e8",
        innerGlowColor: "#fff8df",
        accentColor: "#c59a4a",
        secondaryAccent: "#b92d2d",
        greenAccent: "#2f7d55",
        borderColor: "#c59a4a",
        engravingColor: "#7a4f2a",
        logoVariant: "claro",
    }),

    [RESIN_KEYCHAIN_STYLES.ACADEMIC]: Object.freeze({
        bodyColor: "#eef6ff",
        innerGlowColor: "#dff0ff",
        accentColor: "#2f86c7",
        secondaryAccent: "#c59a4a",
        greenAccent: "#2f7d55",
        borderColor: "#2f86c7",
        engravingColor: "#111827",
        logoVariant: "claro",
    }),

    [RESIN_KEYCHAIN_STYLES.BOLIVIA_2026]: Object.freeze({
        bodyColor: "#fff7e8",
        innerGlowColor: "#fff3c4",
        accentColor: "#f0c84b",
        secondaryAccent: "#b92d2d",
        greenAccent: "#2f7d55",
        borderColor: "#f0c84b",
        engravingColor: "#2b2118",
        logoVariant: "claro",
    }),

    [RESIN_KEYCHAIN_STYLES.DARK_ELEGANT]: Object.freeze({
        bodyColor: "#221811",
        innerGlowColor: "#49331d",
        accentColor: "#c59a4a",
        secondaryAccent: "#8b1f1f",
        greenAccent: "#2f7d55",
        borderColor: "#e9c678",
        engravingColor: "#fff7e8",
        logoVariant: "oscuro",
        opacity: 0.78,
        transmission: 0.18,
    }),

    [RESIN_KEYCHAIN_STYLES.CLEAR_MINIMAL]: Object.freeze({
        bodyColor: "#f8fbff",
        innerGlowColor: "#ffffff",
        accentColor: "#c59a4a",
        secondaryAccent: "#374151",
        greenAccent: "#2f7d55",
        borderColor: "#d6d6d6",
        engravingColor: "#111827",
        logoVariant: "claro",
        opacity: 0.62,
        transmission: 0.52,
    }),
});

const textureLoader = new THREE.TextureLoader();
const logoTextureCache = new Map();

function normalizeOptions(config = {}, extraOptions = {}) {
    const source = config.keychain ?? config.resinKeychain ?? config;
    const visual = config.visual ?? config.sceneConfig?.visual ?? {};
    const project = config.project ?? config.content?.project ?? {};
    const product = config.product ?? config.sceneConfig?.product ?? {};

    const style =
        source.style ??
        visual.keychainStyle ??
        RESIN_KEYCHAIN_STYLES.PREMIUM_GOLD;

    const preset =
        STYLE_PRESETS[style] ??
        STYLE_PRESETS[RESIN_KEYCHAIN_STYLES.PREMIUM_GOLD];

    return {
        ...DEFAULT_OPTIONS,
        ...preset,
        ...source,
        ...extraOptions,
        style,

        accentColor:
            visual.accentColor ??
            source.accentColor ??
            preset.accentColor,

        logoVariant:
            source.logoVariant ??
            product.logoVariant ??
            preset.logoVariant ??
            DEFAULT_OPTIONS.logoVariant,

        labelText:
            source.labelText ??
            project.careerShort ??
            DEFAULT_OPTIONS.labelText,

        labelSubtitle:
            source.labelSubtitle ??
            project.teamName ??
            DEFAULT_OPTIONS.labelSubtitle,

        labelFooter:
            source.labelFooter ??
            project.university ??
            DEFAULT_OPTIONS.labelFooter,
    };
}

function getLogoPath(variant = "claro") {
    return LOGO_PATHS[variant] ?? LOGO_PATHS.claro;
}

function createFallbackLogoTexture(options = {}) {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 768;

    const ctx = canvas.getContext("2d");
    const isDark = options.logoVariant === "oscuro";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createRadialGradient(384, 320, 80, 384, 384, 360);
    gradient.addColorStop(0, isDark ? "#2b2118" : "#fffdf8");
    gradient.addColorStop(1, isDark ? "#111111" : "#fff7e8");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(384, 384, 305, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = options.accentColor ?? "#c59a4a";
    ctx.lineWidth = 22;
    ctx.stroke();

    ctx.fillStyle = isDark ? "#fff7e8" : "#2b2118";
    ctx.font = "900 150px Arial, Helvetica, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SIS", 384, 340);

    ctx.fillStyle = options.accentColor ?? "#c59a4a";
    ctx.font = "800 46px Arial, Helvetica, sans-serif";
    ctx.fillText("UNIFRANZ", 384, 475);

    ctx.fillStyle = isDark ? "#fff7e8" : "#2b2118";
    ctx.font = "800 34px Arial, Helvetica, sans-serif";
    ctx.fillText("2026", 384, 545);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    texture.userData = {
        generatedBy: "ResinKeychainFallbackLogo",
        variant: options.logoVariant,
    };

    return texture;
}

function loadLogoTexture(options = {}) {
    const variant = options.logoVariant === "oscuro" ? "oscuro" : "claro";
    const path = getLogoPath(variant);
    const cacheKey = `${path}:${options.accentColor}`;

    if (logoTextureCache.has(cacheKey)) {
        return logoTextureCache.get(cacheKey).clone();
    }

    const fallback = createFallbackLogoTexture({
        ...options,
        logoVariant: variant,
    });

    const texture = textureLoader.load(
        path,
        (loadedTexture) => {
            loadedTexture.colorSpace = THREE.SRGBColorSpace;
            loadedTexture.anisotropy = 8;
            loadedTexture.needsUpdate = true;
        },
        undefined,
        () => {
            texture.image = fallback.image;
            texture.needsUpdate = true;
        },
    );

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    texture.userData = {
        generatedBy: "ResinKeychainLogo",
        path,
        variant,
        fallback,
    };

    logoTextureCache.set(cacheKey, texture);

    return texture.clone();
}

function createRoundedRectShape(width, height, radius) {
    const x = -width / 2;
    const y = -height / 2;
    const shape = new THREE.Shape();

    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    return shape;
}

function createCircleShape(radius) {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, radius, 0, Math.PI * 2, false);
    return shape;
}

function createShieldShape(width, height) {
    const shape = new THREE.Shape();

    shape.moveTo(0, height / 2);
    shape.bezierCurveTo(width * 0.34, height * 0.45, width * 0.43, height * 0.2, width * 0.38, -height * 0.08);
    shape.bezierCurveTo(width * 0.34, -height * 0.36, width * 0.16, -height * 0.48, 0, -height * 0.55);
    shape.bezierCurveTo(-width * 0.16, -height * 0.48, -width * 0.34, -height * 0.36, -width * 0.38, -height * 0.08);
    shape.bezierCurveTo(-width * 0.43, height * 0.2, -width * 0.34, height * 0.45, 0, height / 2);

    return shape;
}

function createTagShape(width, height) {
    const shape = new THREE.Shape();

    shape.moveTo(-width / 2, -height / 2 + 0.12);
    shape.lineTo(-width / 2, height / 2 - 0.1);
    shape.quadraticCurveTo(-width / 2, height / 2, -width / 2 + 0.1, height / 2);
    shape.lineTo(width / 2 - 0.18, height / 2);
    shape.lineTo(width / 2, height / 2 - 0.18);
    shape.lineTo(width / 2, -height / 2 + 0.1);
    shape.quadraticCurveTo(width / 2, -height / 2, width / 2 - 0.1, -height / 2);
    shape.lineTo(-width / 2 + 0.1, -height / 2);
    shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2, -height / 2 + 0.12);

    return shape;
}

function createDropShape(width, height) {
    const shape = new THREE.Shape();

    shape.moveTo(0, height / 2);
    shape.bezierCurveTo(width * 0.42, height * 0.18, width * 0.36, -height * 0.3, 0, -height * 0.5);
    shape.bezierCurveTo(-width * 0.36, -height * 0.3, -width * 0.42, height * 0.18, 0, height / 2);

    return shape;
}

function createMainShape(options) {
    if (options.shape === RESIN_KEYCHAIN_SHAPES.CIRCLE) {
        return createCircleShape(Math.min(options.width, options.height) * 0.43);
    }

    if (options.shape === RESIN_KEYCHAIN_SHAPES.SHIELD) {
        return createShieldShape(options.width, options.height);
    }

    if (options.shape === RESIN_KEYCHAIN_SHAPES.TAG) {
        return createTagShape(options.width, options.height);
    }

    if (options.shape === RESIN_KEYCHAIN_SHAPES.DROP) {
        return createDropShape(options.width, options.height);
    }

    return createRoundedRectShape(options.width, options.height, 0.13);
}

function createConnectorHoleShape(options) {
    const hole = new THREE.Path();
    const y = options.height * 0.38;
    hole.absarc(0, y, 0.07, 0, Math.PI * 2, true);
    return hole;
}

function createResinMaterial(options) {
    return new THREE.MeshPhysicalMaterial({
        name: "ResinKeychainBodyMaterial",
        color: options.bodyColor,
        transparent: true,
        opacity: options.opacity,
        roughness: options.roughness,
        metalness: options.metalness,
        transmission: options.transmission,
        thickness: options.thickness,
        ior: options.ior,
        clearcoat: options.clearcoat,
        clearcoatRoughness: options.clearcoatRoughness,
        reflectivity: 0.75,
        attenuationColor: new THREE.Color(options.bodyColor),
        attenuationDistance: 1.6,
        side: THREE.DoubleSide,
    });
}

function createGoldMaterial(options) {
    return new THREE.MeshStandardMaterial({
        name: "ResinKeychainGoldMaterial",
        color: options.borderColor,
        roughness: 0.3,
        metalness: 0.42,
    });
}

function createMetalMaterial(name, color, metalness = 0.82, roughness = 0.22) {
    return new THREE.MeshStandardMaterial({
        name,
        color,
        metalness,
        roughness,
    });
}

function createGlassOverlayMaterial(options) {
    return new THREE.MeshPhysicalMaterial({
        name: "ResinKeychainGlassOverlayMaterial",
        color: "#ffffff",
        transparent: true,
        opacity: 0.16,
        roughness: 0.03,
        metalness: 0,
        transmission: 0.56,
        thickness: 0.12,
        ior: 1.46,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        side: THREE.DoubleSide,
    });
}

function createResinBody(options) {
    const shape = createMainShape(options);

    if (options.showConnectorHole) {
        shape.holes.push(createConnectorHoleShape(options));
    }

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: options.depth,
        steps: 1,
        bevelEnabled: true,
        bevelThickness: 0.026,
        bevelSize: 0.026,
        bevelSegments: 8,
        curveSegments: 48,
    });

    geometry.center();
    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, createResinMaterial(options));
    mesh.name = "ResinKeychainBody";
    mesh.visible = Boolean(options.showBody);

    setMeshShadow(mesh, true, true);

    return mesh;
}

function createInnerGlow(options) {
    const shape = createMainShape({
        ...options,
        width: options.width * 0.84,
        height: options.height * 0.84,
    });

    const geometry = new THREE.ShapeGeometry(shape, 48);

    const material = new THREE.MeshBasicMaterial({
        name: "ResinKeychainInnerGlowMaterial",
        color: options.innerGlowColor,
        transparent: true,
        opacity: 0.24,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = "ResinKeychainInnerGlow";
    mesh.position.z = options.depth / 2 + 0.006;
    mesh.visible = Boolean(options.showInnerGlow);
    mesh.renderOrder = options.renderOrder;

    return mesh;
}

function createColorInclusion(options) {
    const group = new THREE.Group();
    group.name = "ResinKeychainColorInclusion";
    group.visible = Boolean(options.showColorInclusion);

    const materialRed = new THREE.MeshBasicMaterial({
        name: "ResinInclusionRedMaterial",
        color: options.secondaryAccent,
        transparent: true,
        opacity: 0.28,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    const materialGreen = new THREE.MeshBasicMaterial({
        name: "ResinInclusionGreenMaterial",
        color: options.greenAccent,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    const red = new THREE.Mesh(
        new THREE.CircleGeometry(0.17, 48),
        materialRed,
    );
    red.name = "ResinRedInclusion";
    red.position.set(-options.width * 0.19, -options.height * 0.12, options.depth / 2 + 0.011);
    red.scale.set(1, 0.62, 1);
    red.rotation.z = -0.35;

    const green = new THREE.Mesh(
        new THREE.CircleGeometry(0.13, 48),
        materialGreen,
    );
    green.name = "ResinGreenInclusion";
    green.position.set(options.width * 0.18, -options.height * 0.22, options.depth / 2 + 0.012);
    green.scale.set(1.25, 0.55, 1);
    green.rotation.z = 0.38;

    group.add(red, green);

    return group;
}

function createBorder(options) {
    const group = new THREE.Group();
    group.name = "ResinKeychainBorder";
    group.visible = Boolean(options.showBorder);

    const material = createGoldMaterial(options);
    const shape = createMainShape({
        ...options,
        width: options.width * 1.015,
        height: options.height * 1.015,
    });

    if (options.showConnectorHole) {
        shape.holes.push(createConnectorHoleShape(options));
    }

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 0.018,
        steps: 1,
        bevelEnabled: true,
        bevelThickness: 0.006,
        bevelSize: 0.006,
        bevelSegments: 3,
        curveSegments: 48,
    });

    geometry.center();
    geometry.computeVertexNormals();

    const border = new THREE.Mesh(geometry, material);
    border.name = "ResinGoldOuterRim";
    border.position.z = -options.depth / 2 - 0.01;
    border.scale.set(1.018, 1.018, 1);

    const frontLine = new THREE.Mesh(
        new THREE.RingGeometry(0.058, 0.073, 48),
        material.clone(),
    );
    frontLine.name = "ResinConnectorHoleGoldRim";
    frontLine.position.set(0, options.height * 0.38, options.depth / 2 + 0.023);

    group.add(border, frontLine);
    setGroupShadow(group, true, true);

    return group;
}

function createLogoBadge(options) {
    const group = new THREE.Group();
    group.name = "ResinKeychainLogoBadge";
    group.visible = Boolean(options.showLogo);

    const base = new THREE.Mesh(
        new THREE.CircleGeometry(0.215, 72),
        new THREE.MeshPhysicalMaterial({
            name: "ResinLogoBadgeBaseMaterial",
            color: "#fffdf8",
            transparent: true,
            opacity: 0.94,
            roughness: 0.08,
            metalness: 0.02,
            transmission: 0.18,
            thickness: 0.08,
            clearcoat: 1,
            clearcoatRoughness: 0.03,
            side: THREE.DoubleSide,
        }),
    );
    base.name = "ResinLogoBadgeBase";
    base.position.z = options.depth / 2 + 0.026;

    const logoTexture = loadLogoTexture(options);

    const logo = new THREE.Mesh(
        new THREE.PlaneGeometry(0.32, 0.32),
        new THREE.MeshBasicMaterial({
            name: "ResinLogoBadgeTextureMaterial",
            map: logoTexture,
            transparent: true,
            opacity: 0.98,
            side: THREE.DoubleSide,
        }),
    );
    logo.name = "ResinLogoBadgeTexture";
    logo.position.z = options.depth / 2 + 0.034;
    logo.scale.setScalar(options.logoScale);

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.218, 0.009, 12, 72),
        createGoldMaterial(options),
    );
    ring.name = "ResinLogoBadgeGoldRing";
    ring.rotation.x = Math.PI / 2;
    ring.position.z = options.depth / 2 + 0.03;

    group.add(base, logo, ring);
    group.position.set(0, 0.06, 0);
    group.userData = {
        editable: true,
        role: "logo-badge",
        logoVariant: options.logoVariant,
        minScale: 0.35,
        maxScale: 1.25,
    };

    return group;
}

function createEngravingTexture(options) {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 460;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(197,154,74,0.38)";
    ctx.lineWidth = 10;
    roundedRectPath(ctx, 40, 40, canvas.width - 80, canvas.height - 80, 42);
    ctx.stroke();

    ctx.fillStyle = options.engravingColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "900 118px Arial, Helvetica, sans-serif";
    ctx.fillText(String(options.labelText).slice(0, 12), canvas.width / 2, 155);

    ctx.font = "800 48px Arial, Helvetica, sans-serif";
    ctx.fillText(String(options.labelSubtitle).slice(0, 24), canvas.width / 2, 270);

    ctx.font = "700 36px Arial, Helvetica, sans-serif";
    ctx.fillText(String(options.labelFooter).slice(0, 24), canvas.width / 2, 355);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    texture.userData = {
        generatedBy: "ResinKeychainEngraving",
        labelText: options.labelText,
        labelSubtitle: options.labelSubtitle,
        labelFooter: options.labelFooter,
    };

    return texture;
}

function roundedRectPath(ctx, x, y, width, height, radius) {
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

function createEngraving(options) {
    const material = new THREE.MeshBasicMaterial({
        name: "ResinKeychainEngravingMaterial",
        map: createEngravingTexture(options),
        transparent: true,
        opacity: 0.62,
        side: THREE.DoubleSide,
        depthWrite: false,
    });

    const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(options.width * 0.68, options.height * 0.25),
        material,
    );

    mesh.name = "ResinKeychainEngraving";
    mesh.position.set(0, -options.height * 0.29, options.depth / 2 + 0.036);
    mesh.renderOrder = options.renderOrder + 1;
    mesh.visible = Boolean(options.showEngraving);

    return mesh;
}

function createGlitter(options) {
    const group = new THREE.Group();
    group.name = "ResinKeychainGlitter";
    group.visible = Boolean(options.showGlitter);

    const count = Math.max(0, Number(options.glitterCount) || 0);
    const geometry = new THREE.BoxGeometry(0.018, 0.018, 0.004);
    const material = new THREE.MeshStandardMaterial({
        name: "ResinKeychainGlitterMaterial",
        color: options.glitterColor,
        emissive: "#fff3b6",
        emissiveIntensity: 0.14,
        roughness: 0.24,
        metalness: 0.22,
    });

    const glitter = new THREE.InstancedMesh(geometry, material, count);
    glitter.name = "ResinKeychainGlitterInstances";

    const dummy = new THREE.Object3D();

    for (let index = 0; index < count; index += 1) {
        const t = index / Math.max(count - 1, 1);
        const angle = index * 2.399963;
        const radiusX = options.width * (0.08 + (index % 7) * 0.035);
        const radiusY = options.height * (0.08 + (index % 5) * 0.028);

        dummy.position.set(
            Math.cos(angle) * radiusX,
            options.height * 0.28 - t * options.height * 0.58 + Math.sin(index * 1.72) * 0.025,
            options.depth / 2 + 0.019 + Math.sin(index * 0.9) * 0.006,
        );

        dummy.rotation.set(
            Math.sin(index * 0.51) * 0.8,
            Math.cos(index * 0.37) * 0.8,
            angle,
        );

        dummy.scale.setScalar(0.62 + Math.sin(index * 1.21) * 0.22);
        dummy.updateMatrix();

        glitter.setMatrixAt(index, dummy.matrix);
    }

    glitter.instanceMatrix.needsUpdate = true;
    setMeshShadow(glitter, true, true);

    group.add(glitter);

    return group;
}

function createRing(options) {
    const group = new THREE.Group();
    group.name = "ResinKeychainRing";
    group.visible = Boolean(options.showRing);

    const material = createMetalMaterial(
        "ResinKeychainRingMaterial",
        options.ringColor,
        0.88,
        0.19,
    );

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.115, 0.014, 18, 64),
        material,
    );
    ring.name = "ResinMainRing";
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, options.height * 0.55, 0.012);

    const connector = new THREE.Mesh(
        new THREE.TorusGeometry(0.058, 0.01, 14, 48),
        material.clone(),
    );
    connector.name = "ResinSmallConnectorRing";
    connector.rotation.x = Math.PI / 2;
    connector.position.set(0, options.height * 0.42, 0.012);

    group.add(ring, connector);
    setGroupShadow(group, true, true);

    return group;
}

function createChain(options) {
    const group = new THREE.Group();
    group.name = "ResinKeychainChain";
    group.visible = Boolean(options.showChain);

    const material = createMetalMaterial(
        "ResinKeychainChainMaterial",
        options.chainColor,
        0.84,
        0.24,
    );

    for (let index = 0; index < 3; index += 1) {
        const link = new THREE.Mesh(
            new THREE.TorusGeometry(0.065, 0.009, 12, 42),
            material,
        );

        link.name = `ResinChainLink_${index + 1}`;
        link.position.set(
            0,
            options.height * 0.67 + index * 0.078,
            0.012,
        );
        link.rotation.set(Math.PI / 2, 0, index % 2 === 0 ? 0 : Math.PI / 2);

        group.add(link);
    }

    setGroupShadow(group, true, true);

    return group;
}

function createHighlights(options) {
    const group = new THREE.Group();
    group.name = "ResinKeychainHighlights";
    group.visible = Boolean(options.showHighlights);

    const material = new THREE.MeshBasicMaterial({
        name: "ResinKeychainHighlightMaterial",
        color: "#ffffff",
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    const main = new THREE.Mesh(
        new THREE.PlaneGeometry(options.width * 0.16, options.height * 0.7),
        material,
    );
    main.name = "ResinMainHighlight";
    main.position.set(-options.width * 0.24, options.height * 0.02, options.depth / 2 + 0.045);
    main.rotation.z = -0.22;
    main.renderOrder = options.renderOrder + 2;

    const small = new THREE.Mesh(
        new THREE.PlaneGeometry(options.width * 0.08, options.height * 0.32),
        material.clone(),
    );
    small.name = "ResinSmallHighlight";
    small.material.opacity = 0.11;
    small.position.set(options.width * 0.22, options.height * 0.15, options.depth / 2 + 0.046);
    small.rotation.z = 0.18;
    small.renderOrder = options.renderOrder + 2;

    group.add(main, small);

    return group;
}

function createGlassOverlay(options) {
    const shape = createMainShape({
        ...options,
        width: options.width * 0.96,
        height: options.height * 0.96,
    });

    const geometry = new THREE.ShapeGeometry(shape, 48);
    const mesh = new THREE.Mesh(geometry, createGlassOverlayMaterial(options));

    mesh.name = "ResinKeychainGlassOverlay";
    mesh.position.z = options.depth / 2 + 0.041;
    mesh.renderOrder = options.renderOrder + 1;

    return mesh;
}

function createContactShadow(options) {
    const material = new THREE.MeshBasicMaterial({
        name: "ResinKeychainContactShadowMaterial",
        color: "#000000",
        transparent: true,
        opacity: 0.17,
        depthWrite: false,
        side: THREE.DoubleSide,
    });

    const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(0.48, 64),
        material,
    );

    shadow.name = "ResinKeychainContactShadow";
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -options.height * 0.47;
    shadow.position.z = -0.025;
    shadow.scale.set(1.08, 0.48, 1);

    return shadow;
}

function applyOrientation(group, options) {
    if (options.orientation === RESIN_KEYCHAIN_ORIENTATION.LEANING) {
        group.rotation.x += -0.16;
        group.position.y += 0.05;
    }

    if (options.orientation === RESIN_KEYCHAIN_ORIENTATION.HANGING) {
        group.rotation.x += -0.38;
        group.position.y += 0.18;
        group.position.z -= 0.08;
    }
}

function applyConfigTransform(group, config = {}) {
    const layout =
        config.layout ??
        config.transform ??
        config.contentLayout?.keychain ??
        {};

    applyTransform(group, {
        position: layout.position ?? [0.78, 0.34, 0.33],
        rotation: layout.rotation ?? [-Math.PI / 2, 0, -0.12],
        scale: layout.scale ?? [0.58, 0.58, 0.58],
    });
}

function createMetadata(options) {
    return {
        objectType: "ResinKeychain",
        version: RESIN_KEYCHAIN_VERSION,
        shape: options.shape,
        style: options.style,
        orientation: options.orientation,
        dimensions: {
            width: options.width,
            height: options.height,
            depth: options.depth,
        },
        editable: true,
        draggable: true,
        rotatable: true,
        scalable: true,
        minScale: 0.35,
        maxScale: 1.4,
        labelText: options.labelText,
        labelSubtitle: options.labelSubtitle,
        labelFooter: options.labelFooter,
        logoVariant: options.logoVariant,
        purpose: "physical-resin-acrylic-souvenir-keychain",
        createdAt: new Date().toISOString(),
    };
}

export function createResinKeychain(config = {}, materials = {}, textureSet = {}, extraOptions = {}) {
    const options = normalizeOptions(config, extraOptions);

    const group = new THREE.Group();
    group.name = "KickOffBoxResinKeychain";
    group.userData = createMetadata(options);

    const shadow = createContactShadow(options);
    const body = createResinBody(options);
    const innerGlow = createInnerGlow(options);
    const colorInclusion = createColorInclusion(options);
    const border = createBorder(options);
    const logoBadge = createLogoBadge(options);
    const engraving = createEngraving(options);
    const glitter = createGlitter(options);
    const ring = createRing(options);
    const chain = createChain(options);
    const highlights = createHighlights(options);
    const glassOverlay = createGlassOverlay(options);

    if (options.showShadow) group.add(shadow);

    group.add(
        body,
        innerGlow,
        colorInclusion,
        glitter,
        border,
        logoBadge,
        engraving,
        glassOverlay,
        ring,
        chain,
        highlights,
    );

    group.userData.parts = {
        shadow: shadow.name,
        body: body.name,
        innerGlow: innerGlow.name,
        colorInclusion: colorInclusion.name,
        glitter: glitter.name,
        border: border.name,
        logoBadge: logoBadge.name,
        engraving: engraving.name,
        glassOverlay: glassOverlay.name,
        ring: ring.name,
        chain: chain.name,
        highlights: highlights.name,
    };

    applyConfigTransform(group, config);
    applyOrientation(group, options);
    setGroupShadow(group, true, true);

    return group;
}

export function createKeychain(config = {}, materials = {}, textureSet = {}, extraOptions = {}) {
    return createResinKeychain(config, materials, textureSet, extraOptions);
}

export function setResinKeychainTransform(keychain, { position, rotation, scale } = {}) {
    if (!keychain) return;

    if (position) keychain.position.set(position[0], position[1], position[2]);
    if (rotation) keychain.rotation.set(rotation[0], rotation[1], rotation[2]);

    if (scale) {
        const minScale = keychain.userData?.minScale ?? 0.35;
        const maxScale = keychain.userData?.maxScale ?? 1.4;
        const values = Array.isArray(scale) ? scale : [scale, scale, scale];

        keychain.scale.set(
            THREE.MathUtils.clamp(values[0], minScale, maxScale),
            THREE.MathUtils.clamp(values[1], minScale, maxScale),
            THREE.MathUtils.clamp(values[2], minScale, maxScale),
        );
    }

    keychain.userData.updatedAt = new Date().toISOString();
}

export function setResinBadgePosition(keychain, { position, rotation, scale } = {}) {
    const badge = keychain?.getObjectByName("ResinKeychainLogoBadge");
    if (!badge) return;

    if (position) badge.position.set(position[0], position[1], position[2]);
    if (rotation) badge.rotation.set(rotation[0], rotation[1], rotation[2]);

    if (scale) {
        const safeScale = Array.isArray(scale) ? scale : [scale, scale, scale];
        badge.scale.set(
            THREE.MathUtils.clamp(safeScale[0], 0.35, 1.25),
            THREE.MathUtils.clamp(safeScale[1], 0.35, 1.25),
            THREE.MathUtils.clamp(safeScale[2], 0.35, 1.25),
        );
    }
}

export function setResinLogoVariant(keychain, variant = "claro") {
    const logo = keychain?.getObjectByName("ResinLogoBadgeTexture");
    if (!logo?.material) return;

    disposeTexture(logo.material.map);

    const options = {
        ...(keychain.userData ?? {}),
        logoVariant: variant,
    };

    const texture = loadLogoTexture(options);

    logo.material.map = texture;
    logo.material.userData.texture = texture;
    logo.material.needsUpdate = true;

    keychain.userData.logoVariant = variant;
    keychain.userData.updatedAt = new Date().toISOString();
}

export function updateResinBodyColor(keychain, color = "#fff7e8") {
    if (!keychain) return;

    const body = keychain.getObjectByName("ResinKeychainBody");
    const glow = keychain.getObjectByName("ResinKeychainInnerGlow");

    if (body?.material?.color) {
        body.material.color.set(color);
        body.material.attenuationColor = new THREE.Color(color);
        body.material.needsUpdate = true;
    }

    if (glow?.material?.color) {
        glow.material.color.set(new THREE.Color(color).offsetHSL(0, 0, 0.08));
        glow.material.needsUpdate = true;
    }

    keychain.userData.bodyColor = color;
    keychain.userData.updatedAt = new Date().toISOString();
}

export function updateResinEngraving(keychain, nextOptions = {}) {
    const engraving = keychain?.getObjectByName("ResinKeychainEngraving");
    if (!engraving?.material) return;

    const options = normalizeOptions({
        ...keychain.userData,
        ...nextOptions,
    });

    disposeTexture(engraving.material.map);

    engraving.material.map = createEngravingTexture(options);
    engraving.material.needsUpdate = true;

    keychain.userData.labelText = options.labelText;
    keychain.userData.labelSubtitle = options.labelSubtitle;
    keychain.userData.labelFooter = options.labelFooter;
    keychain.userData.updatedAt = new Date().toISOString();
}

export function setResinBadgeVisibility(keychain, visible = true) {
    const badge = keychain?.getObjectByName("ResinKeychainLogoBadge");
    if (badge) badge.visible = Boolean(visible);
}

export function setResinRingVisibility(keychain, visible = true) {
    const ring = keychain?.getObjectByName("ResinKeychainRing");
    if (ring) ring.visible = Boolean(visible);
}

export function setResinChainVisibility(keychain, visible = true) {
    const chain = keychain?.getObjectByName("ResinKeychainChain");
    if (chain) chain.visible = Boolean(visible);
}

export function setResinGlitterVisibility(keychain, visible = true) {
    const glitter = keychain?.getObjectByName("ResinKeychainGlitter");
    if (glitter) glitter.visible = Boolean(visible);
}

export function setResinEngravingVisibility(keychain, visible = true) {
    const engraving = keychain?.getObjectByName("ResinKeychainEngraving");
    if (engraving) engraving.visible = Boolean(visible);
}

export function animateResinKeychain(keychain, elapsedTime = 0) {
    if (!keychain) return;

    const highlights = keychain.getObjectByName("ResinKeychainHighlights");
    const glitter = keychain.getObjectByName("ResinKeychainGlitterInstances");
    const badge = keychain.getObjectByName("ResinKeychainLogoBadge");
    const ring = keychain.getObjectByName("ResinKeychainRing");

    if (highlights) {
        const main = highlights.getObjectByName("ResinMainHighlight");
        const small = highlights.getObjectByName("ResinSmallHighlight");

        if (main?.material) {
            main.material.opacity = 0.15 + Math.sin(elapsedTime * 1.35) * 0.035;
        }

        if (small?.material) {
            small.material.opacity = 0.09 + Math.cos(elapsedTime * 1.1) * 0.024;
        }
    }

    if (glitter) {
        glitter.rotation.z = Math.sin(elapsedTime * 0.32) * 0.025;
        glitter.rotation.y = Math.cos(elapsedTime * 0.28) * 0.012;
    }

    if (badge) {
        badge.position.z = Math.sin(elapsedTime * 0.8) * 0.002;
    }

    if (ring) {
        ring.rotation.z = Math.sin(elapsedTime * 0.35) * 0.01;
    }
}

export function updateResinKeychainAnimation(keychain, elapsedTime = 0) {
    animateResinKeychain(keychain, elapsedTime);
}

export function getResinKeychainParts(keychain) {
    if (!keychain) return {};

    return {
        body: keychain.getObjectByName("ResinKeychainBody"),
        innerGlow: keychain.getObjectByName("ResinKeychainInnerGlow"),
        colorInclusion: keychain.getObjectByName("ResinKeychainColorInclusion"),
        border: keychain.getObjectByName("ResinKeychainBorder"),
        logoBadge: keychain.getObjectByName("ResinKeychainLogoBadge"),
        logo: keychain.getObjectByName("ResinLogoBadgeTexture"),
        engraving: keychain.getObjectByName("ResinKeychainEngraving"),
        glitter: keychain.getObjectByName("ResinKeychainGlitter"),
        glitterInstances: keychain.getObjectByName("ResinKeychainGlitterInstances"),
        ring: keychain.getObjectByName("ResinKeychainRing"),
        chain: keychain.getObjectByName("ResinKeychainChain"),
        highlights: keychain.getObjectByName("ResinKeychainHighlights"),
        glassOverlay: keychain.getObjectByName("ResinKeychainGlassOverlay"),
        shadow: keychain.getObjectByName("ResinKeychainContactShadow"),
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

        if (item.userData?.texture) {
            disposeTexture(item.userData.texture);
        }

        if (item.dispose) {
            item.dispose();
        }
    });
}

export function disposeResinKeychain(keychain) {
    if (!keychain) return;

    const disposedGeometries = new Set();
    const disposedMaterials = new Set();

    keychain.traverse((object) => {
        if (object.geometry && !disposedGeometries.has(object.geometry)) {
            object.geometry.dispose();
            disposedGeometries.add(object.geometry);
        }

        if (object.material && !disposedMaterials.has(object.material)) {
            disposeMaterial(object.material);
            disposedMaterials.add(object.material);
        }
    });

    keychain.removeFromParent();
}

export function disposeResinLogoCache() {
    logoTextureCache.forEach((texture) => {
        disposeTexture(texture);
        disposeTexture(texture.userData?.fallback);
    });

    logoTextureCache.clear();
}

export const ResinKeychain = Object.freeze({
    version: RESIN_KEYCHAIN_VERSION,
    shapes: RESIN_KEYCHAIN_SHAPES,
    styles: RESIN_KEYCHAIN_STYLES,
    orientation: RESIN_KEYCHAIN_ORIENTATION,

    createResinKeychain,
    createKeychain,

    setResinKeychainTransform,
    setResinBadgePosition,
    setResinLogoVariant,

    updateResinBodyColor,
    updateResinEngraving,
    animateResinKeychain,
    updateResinKeychainAnimation,

    setResinBadgeVisibility,
    setResinRingVisibility,
    setResinChainVisibility,
    setResinGlitterVisibility,
    setResinEngravingVisibility,

    getResinKeychainParts,
    disposeResinKeychain,
    disposeResinLogoCache,
});
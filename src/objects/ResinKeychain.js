import * as THREE from "three";

import {
    applyTransform,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

const LOGO_PATHS = {
    claro: "/image/Logo-Claro.png",
    oscuro: "/image/Logo-Oscuro.png",
};

const DEFAULT_RESIN_OPTIONS = {
    bodyColor: "#f2eee7",
    innerGlowColor: "#fff8df",
    glitterColor: "#fff7d1",
    accentColor: "#ff9b22",
    engravingColor: "#7a4f2a",
    opacity: 0.9,
    transmission: 0.34,
    roughness: 0.14,
    thickness: 0.48,
    metalness: 0.02,
    ior: 1.45,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    logoVariant: "claro",
    logoScale: [0.54, 0.54, 0.54],
    badgeScale: [0.64, 0.64, 0.64],
    ringColor: "#d6d6d6",
    ringMetalness: 0.86,
    ringRoughness: 0.2,
    chainColor: "#c9c9c9",
    labelText: "2026",
    labelSubtitle: "KickOff",
    showBadge: true,
    showGlitter: true,
    showRing: true,
    showChain: true,
    showEngraving: true,
    showHighlight: true,
    showShadow: true,
    glitterCount: 34,
};

const textureLoader = new THREE.TextureLoader();
const logoTextureCache = new Map();

function getLogoPath(variant = "claro") {
    return LOGO_PATHS[variant] ?? LOGO_PATHS.claro;
}

function createFallbackLogoTexture(variant = "claro") {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;

    const ctx = canvas.getContext("2d");
    const isDark = variant === "oscuro";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = isDark ? "#1f1b18" : "#fff7e8";
    ctx.beginPath();
    ctx.arc(256, 256, 218, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#ff9b22";
    ctx.lineWidth = 18;
    ctx.stroke();

    ctx.fillStyle = isDark ? "#fff7e8" : "#2b2118";
    ctx.font = "bold 132px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SIS", 256, 238);

    ctx.font = "bold 42px Arial";
    ctx.fillText("LOGO", 256, 340);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    return texture;
}

function loadLogoTexture(variant = "claro") {
    const normalizedVariant = variant === "oscuro" ? "oscuro" : "claro";
    const path = getLogoPath(normalizedVariant);

    if (logoTextureCache.has(path)) {
        return logoTextureCache.get(path).clone();
    }

    const fallback = createFallbackLogoTexture(normalizedVariant);
    const texture = textureLoader.load(
        path,
        (loadedTexture) => {
            loadedTexture.colorSpace = THREE.SRGBColorSpace;
            loadedTexture.anisotropy = 8;
            loadedTexture.needsUpdate = true;
        },
        undefined,
        () => {
            console.warn(`No se pudo cargar el logo: ${path}. Se usará textura fallback.`);
        },
    );

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    texture.userData.fallback = fallback;

    logoTextureCache.set(path, texture);

    return texture.clone();
}

function createResinShape() {
    const shape = new THREE.Shape();

    shape.moveTo(-0.2, 0.74);
    shape.bezierCurveTo(0.08, 0.83, 0.3, 0.64, 0.27, 0.38);
    shape.bezierCurveTo(0.24, 0.08, 0.05, -0.2, -0.08, -0.48);
    shape.bezierCurveTo(-0.18, -0.7, -0.08, -0.9, 0.08, -1.08);
    shape.bezierCurveTo(0.24, -1.25, 0.2, -1.4, 0.03, -1.43);
    shape.bezierCurveTo(-0.18, -1.42, -0.38, -1.25, -0.52, -1.0);
    shape.bezierCurveTo(-0.68, -0.7, -0.72, -0.38, -0.63, -0.02);
    shape.bezierCurveTo(-0.58, 0.18, -0.54, 0.38, -0.52, 0.54);
    shape.bezierCurveTo(-0.49, 0.7, -0.37, 0.8, -0.2, 0.74);

    return shape;
}

function createAccentDropShape() {
    const shape = new THREE.Shape();

    shape.moveTo(0, 0.36);
    shape.bezierCurveTo(0.22, 0.2, 0.28, -0.04, 0.14, -0.26);
    shape.bezierCurveTo(0.04, -0.42, -0.1, -0.45, -0.2, -0.32);
    shape.bezierCurveTo(-0.34, -0.14, -0.28, 0.16, 0, 0.36);

    return shape;
}

function createPhysicalMaterial(options) {
    return new THREE.MeshPhysicalMaterial({
        name: "ResinBodyMaterial",
        color: options.bodyColor,
        transparent: true,
        opacity: options.opacity,
        roughness: options.roughness,
        metalness: options.metalness,
        transmission: options.transmission,
        thickness: options.thickness,
        ior: options.ior,
        reflectivity: 0.65,
        clearcoat: options.clearcoat,
        clearcoatRoughness: options.clearcoatRoughness,
        attenuationColor: new THREE.Color(options.bodyColor),
        attenuationDistance: 1.8,
        side: THREE.DoubleSide,
    });
}

function createMetalMaterial(options) {
    return new THREE.MeshStandardMaterial({
        name: "ResinMetalMaterial",
        color: options.ringColor,
        metalness: options.ringMetalness,
        roughness: options.ringRoughness,
    });
}

function createBadgeMaterial(texture, opacity = 1) {
    return new THREE.MeshBasicMaterial({
        name: "ResinBadgeLogoMaterial",
        map: texture,
        transparent: true,
        opacity,
        side: THREE.DoubleSide,
    });
}

function createResinBody(options) {
    const geometry = new THREE.ExtrudeGeometry(createResinShape(), {
        depth: 0.2,
        bevelEnabled: true,
        bevelThickness: 0.038,
        bevelSize: 0.045,
        bevelSegments: 6,
        curveSegments: 34,
    });

    geometry.center();
    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, createPhysicalMaterial(options));
    mesh.name = "ResinBody";
    mesh.rotation.set(0, 0.06, 0);

    setMeshShadow(mesh, true, true);

    return mesh;
}

function createInnerGlow(options) {
    const geometry = new THREE.ExtrudeGeometry(createResinShape(), {
        depth: 0.055,
        bevelEnabled: false,
        curveSegments: 28,
    });

    geometry.center();

    const material = new THREE.MeshBasicMaterial({
        name: "ResinInnerGlowMaterial",
        color: options.innerGlowColor,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = "ResinInnerGlow";
    mesh.scale.set(0.88, 0.88, 0.88);
    mesh.position.z = 0.018;

    return mesh;
}

function createAccentInclusion(options) {
    const geometry = new THREE.ExtrudeGeometry(createAccentDropShape(), {
        depth: 0.018,
        bevelEnabled: true,
        bevelThickness: 0.006,
        bevelSize: 0.006,
        bevelSegments: 2,
        curveSegments: 22,
    });

    geometry.center();

    const material = new THREE.MeshBasicMaterial({
        name: "ResinAccentInclusionMaterial",
        color: options.accentColor,
        transparent: true,
        opacity: 0.32,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = "ResinAccentInclusion";
    mesh.position.set(-0.19, -0.35, 0.07);
    mesh.rotation.set(0.08, -0.16, -0.34);
    mesh.scale.set(0.86, 0.86, 0.86);

    return mesh;
}

function createTopCap(options) {
    const material = new THREE.MeshPhysicalMaterial({
        name: "ResinCapMaterial",
        color: "#efe6d9",
        transparent: true,
        opacity: 0.92,
        roughness: 0.14,
        metalness: 0.02,
        transmission: 0.24,
        thickness: 0.18,
        ior: 1.45,
        clearcoat: 1,
        clearcoatRoughness: 0.07,
    });

    const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.115, 0.15, 0.12, 36),
        material,
    );

    mesh.name = "ResinCap";
    mesh.position.set(-0.06, 0.69, 0.006);
    mesh.scale.set(1, 0.7, 0.88);
    mesh.rotation.z = -0.12;

    setMeshShadow(mesh, true, true);

    return mesh;
}

function createRing(options) {
    const group = new THREE.Group();
    group.name = "ResinRingGroup";

    const material = createMetalMaterial(options);

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.12, 0.018, 18, 54),
        material,
    );
    ring.name = "ResinRing";
    ring.rotation.x = Math.PI / 2;
    ring.position.set(-0.025, 0.885, 0.002);

    const connector = new THREE.Mesh(
        new THREE.CylinderGeometry(0.019, 0.019, 0.1, 18),
        material,
    );
    connector.name = "ResinRingConnector";
    connector.position.set(-0.035, 0.79, 0.002);
    connector.rotation.z = 0.08;

    setMeshShadow(ring, true, true);
    setMeshShadow(connector, true, true);

    group.add(ring, connector);

    return group;
}

function createChain(options) {
    const group = new THREE.Group();
    group.name = "ResinMiniChain";

    const material = new THREE.MeshStandardMaterial({
        name: "ResinChainMaterial",
        color: options.chainColor,
        metalness: 0.82,
        roughness: 0.24,
    });

    for (let index = 0; index < 3; index += 1) {
        const link = new THREE.Mesh(
            new THREE.TorusGeometry(0.075, 0.011, 12, 34),
            material,
        );

        link.name = `ResinChainLink_${index + 1}`;
        link.position.set(-0.02, 1.01 + index * 0.095, 0.002);
        link.rotation.set(Math.PI / 2, 0, index % 2 === 0 ? 0 : Math.PI / 2);

        setMeshShadow(link, true, true);
        group.add(link);
    }

    return group;
}

function createLogoBadge(options) {
    const badgeGroup = new THREE.Group();
    badgeGroup.name = "ResinBadgeGroup";

    const baseMaterial = new THREE.MeshPhysicalMaterial({
        name: "ResinBadgeBaseMaterial",
        color: "#fff9ef",
        transparent: true,
        opacity: 0.96,
        roughness: 0.1,
        metalness: 0.03,
        transmission: 0.14,
        thickness: 0.08,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
    });

    const base = new THREE.Mesh(new THREE.CircleGeometry(0.24, 64), baseMaterial);
    base.name = "ResinBadgeBase";
    base.position.z = 0.012;

    const logo = new THREE.Mesh(
        new THREE.PlaneGeometry(0.36, 0.36),
        createBadgeMaterial(loadLogoTexture(options.logoVariant), options.opacity),
    );
    logo.name = "ResinBadgeLogo";
    logo.position.z = 0.03;
    logo.scale.set(options.logoScale[0], options.logoScale[1], options.logoScale[2]);

    const outline = new THREE.Mesh(
        new THREE.TorusGeometry(0.246, 0.012, 14, 56),
        new THREE.MeshStandardMaterial({
            name: "ResinBadgeOutlineMaterial",
            color: options.accentColor,
            metalness: 0.18,
            roughness: 0.34,
        }),
    );
    outline.name = "ResinBadgeOutline";
    outline.position.z = 0.022;
    outline.rotation.x = Math.PI / 2;

    setMeshShadow(base, true, true);
    setMeshShadow(logo, false, true);
    setMeshShadow(outline, true, true);

    badgeGroup.add(base, logo, outline);
    badgeGroup.position.set(-0.11, 0.16, 0.04);
    badgeGroup.rotation.set(0.02, -0.22, -0.08);
    badgeGroup.scale.set(options.badgeScale[0], options.badgeScale[1], options.badgeScale[2]);

    badgeGroup.userData = {
        editable: true,
        role: "badge",
        minScale: 0.25,
        maxScale: 1.4,
        logoVariant: options.logoVariant,
    };

    return badgeGroup;
}

function createEngravingTexture(options) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 384;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255, 247, 232, 0.0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(122, 79, 42, 0.42)";
    ctx.lineWidth = 10;
    ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

    ctx.fillStyle = options.engravingColor;
    ctx.font = "bold 104px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(options.labelText, canvas.width / 2, 158);

    ctx.font = "bold 46px Arial";
    ctx.fillText(options.labelSubtitle, canvas.width / 2, 260);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    return texture;
}

function createEngraving(options) {
    const material = new THREE.MeshBasicMaterial({
        name: "ResinEngravingMaterial",
        map: createEngravingTexture(options),
        transparent: true,
        opacity: 0.52,
        side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.18), material);
    mesh.name = "ResinEngraving";
    mesh.position.set(-0.2, -0.55, 0.11);
    mesh.rotation.set(0.03, -0.12, -0.15);
    mesh.renderOrder = 6;

    return mesh;
}

function createGlitter(options) {
    const group = new THREE.Group();
    group.name = "ResinGlitterGroup";

    const count = options.glitterCount;
    const geometry = new THREE.BoxGeometry(0.024, 0.024, 0.004);
    const material = new THREE.MeshStandardMaterial({
        name: "ResinGlitterMaterial",
        color: options.glitterColor,
        emissive: "#fff3b6",
        emissiveIntensity: 0.14,
        roughness: 0.24,
        metalness: 0.18,
    });

    const glitter = new THREE.InstancedMesh(geometry, material, count);
    glitter.name = "ResinGlitterInstances";

    const dummy = new THREE.Object3D();

    for (let index = 0; index < count; index += 1) {
        const t = index / Math.max(count - 1, 1);
        const angle = index * 2.399963;
        const radial = 0.05 + (index % 7) * 0.032;
        const x = -0.18 + Math.cos(angle) * radial * (0.7 + t * 0.4);
        const y = 0.58 - t * 1.18 + Math.sin(index * 1.73) * 0.055;
        const z = 0.04 + Math.sin(index * 0.9) * 0.018;

        dummy.position.set(x, y, z);
        dummy.rotation.set(
            Math.sin(index * 0.51) * 0.8,
            Math.cos(index * 0.37) * 0.8,
            angle,
        );
        dummy.scale.setScalar(0.65 + Math.sin(index * 1.21) * 0.22);
        dummy.updateMatrix();

        glitter.setMatrixAt(index, dummy.matrix);
    }

    glitter.instanceMatrix.needsUpdate = true;
    setMeshShadow(glitter, true, true);

    group.add(glitter);

    return group;
}

function createSpecularHighlights() {
    const group = new THREE.Group();
    group.name = "ResinHighlights";

    const material = new THREE.MeshBasicMaterial({
        name: "ResinHighlightMaterial",
        color: "#ffffff",
        transparent: true,
        opacity: 0.16,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    const large = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.92), material);
    large.name = "ResinHighlightMain";
    large.position.set(0.03, 0.06, 0.115);
    large.rotation.set(0.08, -0.18, -0.24);
    large.renderOrder = 7;

    const small = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.36), material.clone());
    small.name = "ResinHighlightSmall";
    small.material.opacity = 0.11;
    small.position.set(-0.3, 0.24, 0.118);
    small.rotation.set(0.08, -0.14, -0.3);
    small.renderOrder = 7;

    group.add(large, small);

    return group;
}

function createContactShadow(materials) {
    const shadowMaterial =
        materials?.shadowSoft ||
        new THREE.MeshBasicMaterial({
            color: "#000000",
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide,
        });

    const mesh = new THREE.Mesh(new THREE.CircleGeometry(0.56, 48), shadowMaterial);
    mesh.name = "ResinContactShadow";
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(-0.08, -0.82, 0);
    mesh.scale.set(1.08, 0.46, 1);

    return mesh;
}

function getSafeScale(scale, minScale, maxScale) {
    const nextScale = Array.isArray(scale) ? scale : [scale, scale, scale];

    return nextScale.map((value) => THREE.MathUtils.clamp(value, minScale, maxScale));
}

export function createResinKeychain(config, materials = {}, options = {}) {
    const mergedOptions = {
        ...DEFAULT_RESIN_OPTIONS,
        ...options,
    };

    const group = new THREE.Group();
    group.name = "KickOffBoxResinKeychain";

    if (mergedOptions.showShadow) group.add(createContactShadow(materials));

    group.add(
        createResinBody(mergedOptions),
        createInnerGlow(mergedOptions),
        createAccentInclusion(mergedOptions),
        createTopCap(mergedOptions),
    );

    if (mergedOptions.showHighlight) group.add(createSpecularHighlights());
    if (mergedOptions.showGlitter) group.add(createGlitter(mergedOptions));
    if (mergedOptions.showBadge) group.add(createLogoBadge(mergedOptions));
    if (mergedOptions.showRing) group.add(createRing(mergedOptions));
    if (mergedOptions.showChain) group.add(createChain(mergedOptions));
    if (mergedOptions.showEngraving) group.add(createEngraving(mergedOptions));

    const layout = config?.contentLayout?.keychain ?? {};

    applyTransform(group, {
        position: layout.position ?? [2.15, 0.65, 1.58],
        rotation: layout.rotation ?? [Math.PI / 2, 0, 0],
        scale: layout.scale ?? [0.72, 0.72, 0.72],
    });

    group.userData = {
        type: "resin-keychain",
        editable: true,
        draggable: true,
        rotatable: true,
        scalable: true,
        visibleInPresets: ["estandar", "premium"],
        minScale: 0.35,
        maxScale: 1.8,
        options: mergedOptions,
        description:
            "Souvenir de resina editable con logo integrado, brillo interno, aro metálico y acabado translúcido.",
    };

    setGroupShadow(group, true, true);

    return group;
}

export function setResinKeychainTransform(keychain, { position, rotation, scale } = {}) {
    if (!keychain) return;

    if (position) keychain.position.set(position[0], position[1], position[2]);
    if (rotation) keychain.rotation.set(rotation[0], rotation[1], rotation[2]);

    if (scale) {
        const minScale = keychain.userData?.minScale ?? 0.35;
        const maxScale = keychain.userData?.maxScale ?? 1.8;
        const safeScale = getSafeScale(scale, minScale, maxScale);
        keychain.scale.set(safeScale[0], safeScale[1], safeScale[2]);
    }
}

export function setResinBadgePosition(keychain, { position, rotation, scale } = {}) {
    const badge = keychain?.getObjectByName("ResinBadgeGroup");
    if (!badge) return;

    if (position) badge.position.set(position[0], position[1], position[2]);
    if (rotation) badge.rotation.set(rotation[0], rotation[1], rotation[2]);

    if (scale) {
        const minScale = badge.userData?.minScale ?? 0.25;
        const maxScale = badge.userData?.maxScale ?? 1.4;
        const safeScale = getSafeScale(scale, minScale, maxScale);
        badge.scale.set(safeScale[0], safeScale[1], safeScale[2]);
    }
}

export function setResinLogoVariant(keychain, variant = "claro") {
    const logo = keychain?.getObjectByName("ResinBadgeLogo");
    if (!logo?.material) return;

    if (logo.material.map) logo.material.map.dispose();

    const texture = loadLogoTexture(variant);

    logo.material.map = texture;
    logo.material.userData.texture = texture;
    logo.material.userData.variant = variant;
    logo.material.needsUpdate = true;

    const badge = keychain.getObjectByName("ResinBadgeGroup");
    if (badge?.userData) badge.userData.logoVariant = variant;

    keychain.userData.options = {
        ...keychain.userData.options,
        logoVariant: variant,
    };
}

export function setResinBadgeVisibility(keychain, visible = true) {
    const badge = keychain?.getObjectByName("ResinBadgeGroup");
    if (badge) badge.visible = Boolean(visible);
}

export function setResinRingVisibility(keychain, visible = true) {
    const ring = keychain?.getObjectByName("ResinRingGroup");
    if (ring) ring.visible = Boolean(visible);
}

export function setResinChainVisibility(keychain, visible = true) {
    const chain = keychain?.getObjectByName("ResinMiniChain");
    if (chain) chain.visible = Boolean(visible);
}

export function setResinGlitterVisibility(keychain, visible = true) {
    const glitter = keychain?.getObjectByName("ResinGlitterGroup");
    if (glitter) glitter.visible = Boolean(visible);
}

export function setResinEngravingVisibility(keychain, visible = true) {
    const engraving = keychain?.getObjectByName("ResinEngraving");
    if (engraving) engraving.visible = Boolean(visible);
}

export function updateResinBodyColor(keychain, color = "#f2eee7") {
    if (!keychain) return;

    const body = keychain.getObjectByName("ResinBody");
    const glow = keychain.getObjectByName("ResinInnerGlow");
    const accent = keychain.getObjectByName("ResinAccentInclusion");

    if (body?.material?.color) {
        body.material.color.set(color);
        body.material.attenuationColor = new THREE.Color(color);
        body.material.needsUpdate = true;
    }

    if (glow?.material?.color) {
        glow.material.color.set(new THREE.Color(color).offsetHSL(0, 0, 0.1));
        glow.material.needsUpdate = true;
    }

    if (accent?.material?.color) {
        accent.material.color.set(new THREE.Color(color).offsetHSL(0.03, 0.12, 0.06));
        accent.material.needsUpdate = true;
    }

    keychain.userData.options = {
        ...keychain.userData.options,
        bodyColor: color,
    };
}

export function updateResinEngraving(keychain, nextOptions = {}) {
    const engraving = keychain?.getObjectByName("ResinEngraving");
    if (!engraving?.material) return;

    const updatedOptions = {
        ...(keychain.userData?.options ?? DEFAULT_RESIN_OPTIONS),
        ...nextOptions,
    };

    if (engraving.material.map) engraving.material.map.dispose();

    engraving.material.map = createEngravingTexture(updatedOptions);
    engraving.material.needsUpdate = true;

    keychain.userData.options = updatedOptions;
}

export function animateResinKeychain(keychain, elapsedTime = 0) {
    if (!keychain) return;

    const highlights = keychain.getObjectByName("ResinHighlights");
    const glitter = keychain.getObjectByName("ResinGlitterInstances");
    const badge = keychain.getObjectByName("ResinBadgeGroup");

    if (highlights) {
        const main = highlights.getObjectByName("ResinHighlightMain");
        const small = highlights.getObjectByName("ResinHighlightSmall");

        if (main?.material) main.material.opacity = 0.13 + Math.sin(elapsedTime * 1.4) * 0.035;
        if (small?.material) small.material.opacity = 0.09 + Math.cos(elapsedTime * 1.1) * 0.025;
    }

    if (glitter) {
        glitter.rotation.z = Math.sin(elapsedTime * 0.35) * 0.035;
        glitter.rotation.y = Math.cos(elapsedTime * 0.28) * 0.018;
    }

    if (badge) {
        badge.position.z = 0.04 + Math.sin(elapsedTime * 0.8) * 0.002;
    }
}

export function getResinKeychainParts(keychain) {
    if (!keychain) return {};

    return {
        body: keychain.getObjectByName("ResinBody"),
        glow: keychain.getObjectByName("ResinInnerGlow"),
        accent: keychain.getObjectByName("ResinAccentInclusion"),
        cap: keychain.getObjectByName("ResinCap"),
        badge: keychain.getObjectByName("ResinBadgeGroup"),
        logo: keychain.getObjectByName("ResinBadgeLogo"),
        ring: keychain.getObjectByName("ResinRingGroup"),
        chain: keychain.getObjectByName("ResinMiniChain"),
        glitter: keychain.getObjectByName("ResinGlitterGroup"),
        glitterInstances: keychain.getObjectByName("ResinGlitterInstances"),
        engraving: keychain.getObjectByName("ResinEngraving"),
        highlights: keychain.getObjectByName("ResinHighlights"),
        shadow: keychain.getObjectByName("ResinContactShadow"),
    };
}

export function disposeResinKeychain(keychain) {
    if (!keychain) return;

    const disposedGeometries = new Set();
    const disposedMaterials = new Set();
    const disposedTextures = new Set();

    keychain.traverse((object) => {
        if (object.geometry && !disposedGeometries.has(object.geometry)) {
            object.geometry.dispose();
            disposedGeometries.add(object.geometry);
        }

        if (object.material) {
            const materials = Array.isArray(object.material) ? object.material : [object.material];

            materials.forEach((material) => {
                if (material.map && !disposedTextures.has(material.map)) {
                    material.map.dispose();
                    disposedTextures.add(material.map);
                }

                if (!disposedMaterials.has(material)) {
                    material.dispose();
                    disposedMaterials.add(material);
                }
            });
        }
    });

    keychain.removeFromParent();
}

export function disposeResinLogoCache() {
    logoTextureCache.forEach((texture) => texture.dispose());
    logoTextureCache.clear();
}

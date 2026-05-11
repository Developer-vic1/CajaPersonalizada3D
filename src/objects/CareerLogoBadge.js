import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import {
    applyTransform,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

const DEFAULT_LOGO_BADGE_OPTIONS = {
    variant: "claro",
    style: "sticker",
    title: "Ingeniería de Sistemas",
    subtitle: "KickOff Box",
    logoScale: [1, 1, 1],
    badgeScale: [1, 1, 1],
    showFrame: true,
    showTitle: true,
    showSubtitle: true,
    showShadow: true,
    showTechMarks: true,
    backgroundColor: "#fff7e8",
    frameColor: "#c59a4a",
    darkColor: "#2b2118",
    accentColor: "#ff8a00",
    opacity: 1,
};

const LOGO_PATHS = {
    claro: "/image/Logo-Claro.png",
    oscuro: "/image/Logo-Oscuro.png",
};

const textureLoader = new THREE.TextureLoader();
const textureCache = new Map();

function getLogoPath(variant = "claro") {
    return LOGO_PATHS[variant] ?? LOGO_PATHS.claro;
}

function loadLogoTexture(variant = "claro") {
    const path = getLogoPath(variant);

    if (textureCache.has(path)) {
        return textureCache.get(path).clone();
    }

    const texture = textureLoader.load(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    textureCache.set(path, texture);

    return texture.clone();
}

function createRoundedMesh({
    name,
    width,
    height,
    depth,
    radius = 0.04,
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

function drawRoundedRect(ctx, x, y, width, height, radius) {
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

function drawTechMarks(ctx, width, height, options) {
    ctx.save();

    ctx.strokeStyle = "rgba(43, 33, 24, 0.18)";
    ctx.lineWidth = 5;

    const marks = [
        [[90, 95], [180, 95], [230, 145]],
        [[width - 90, 95], [width - 180, 95], [width - 230, 145]],
        [[90, height - 95], [180, height - 95], [230, height - 145]],
        [[width - 90, height - 95], [width - 180, height - 95], [width - 230, height - 145]],
    ];

    marks.forEach((points) => {
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);

        for (let index = 1; index < points.length; index += 1) {
            ctx.lineTo(points[index][0], points[index][1]);
        }

        ctx.stroke();
    });

    ctx.fillStyle = options.accentColor;

    [
        [230, 145],
        [width - 230, 145],
        [230, height - 145],
        [width - 230, height - 145],
    ].forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 13, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.restore();
}

function createBadgeCanvas(options) {
    const canvas = document.createElement("canvas");
    canvas.width = 1400;
    canvas.height = 900;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const backgroundGradient = ctx.createLinearGradient(0, 0, width, height);
    backgroundGradient.addColorStop(0, "#fffaf2");
    backgroundGradient.addColorStop(0.55, options.backgroundColor);
    backgroundGradient.addColorStop(1, "#f0d2a5");

    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, width, height);

    const identityGradient = ctx.createLinearGradient(0, 0, width, 0);
    identityGradient.addColorStop(0, "rgba(185, 45, 45, 0.14)");
    identityGradient.addColorStop(0.52, "rgba(240, 200, 75, 0.2)");
    identityGradient.addColorStop(1, "rgba(47, 125, 85, 0.14)");

    ctx.fillStyle = identityGradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#b92d2d";
    ctx.fillRect(0, 0, width, 44);

    ctx.fillStyle = "#f0c84b";
    ctx.fillRect(0, 44, width, 44);

    ctx.fillStyle = "#2f7d55";
    ctx.fillRect(0, 88, width, 44);

    if (options.showTechMarks) {
        drawTechMarks(ctx, width, height, options);
    }

    if (options.showFrame) {
        ctx.strokeStyle = "rgba(122, 79, 42, 0.36)";
        ctx.lineWidth = 18;
        drawRoundedRect(ctx, 70, 165, width - 140, height - 240, 46);
        ctx.stroke();

        ctx.strokeStyle = options.frameColor;
        ctx.lineWidth = 8;
        drawRoundedRect(ctx, 108, 203, width - 216, height - 316, 34);
        ctx.stroke();
    }

    if (options.showTitle) {
        ctx.fillStyle = options.darkColor;
        ctx.font = "bold 64px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(options.title, width / 2, height - 170);
    }

    if (options.showSubtitle) {
        ctx.fillStyle = "rgba(43, 33, 24, 0.72)";
        ctx.font = "bold 36px Arial";
        ctx.fillText(options.subtitle, width / 2, height - 105);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    return {
        canvas,
        texture,
    };
}

function createBadgeBaseMaterial(options) {
    const { texture } = createBadgeCanvas(options);

    const material = new THREE.MeshBasicMaterial({
        name: "CareerLogoBadgeBaseMaterial",
        map: texture,
        transparent: true,
        opacity: options.opacity,
        side: THREE.DoubleSide,
    });

    material.userData = {
        texture,
        options,
    };

    return material;
}

function createLogoMaterial(options) {
    const logoTexture = loadLogoTexture(options.variant);

    const material = new THREE.MeshBasicMaterial({
        name: "CareerLogoMaterial",
        map: logoTexture,
        transparent: true,
        opacity: options.opacity,
        side: THREE.DoubleSide,
    });

    material.userData = {
        texture: logoTexture,
        variant: options.variant,
    };

    return material;
}

function createBadgeBase(options) {
    const baseMaterial = createBadgeBaseMaterial(options);

    const base = new THREE.Mesh(
        new THREE.PlaneGeometry(1.55, 1.0),
        baseMaterial,
    );

    base.name = "CareerLogoBadgeSurface";
    base.renderOrder = 5;

    return base;
}

function createLogoPlane(options) {
    const logo = new THREE.Mesh(
        new THREE.PlaneGeometry(0.72, 0.72),
        createLogoMaterial(options),
    );

    logo.name = "CareerLogoPlane";
    logo.position.set(0, 0.08, 0.012);
    logo.scale.set(
        options.logoScale[0],
        options.logoScale[1],
        options.logoScale[2],
    );
    logo.renderOrder = 6;

    return logo;
}

function createPhysicalBacking(options, materials) {
    const material =
        materials?.paperBack ||
        new THREE.MeshStandardMaterial({
            color: "#ead6b8",
            roughness: 0.74,
            metalness: 0,
        });

    const backing = createRoundedMesh({
        name: "CareerLogoBadgeBacking",
        width: 1.6,
        height: 0.045,
        depth: 1.05,
        radius: 0.06,
        segments: 5,
        material,
    });

    backing.rotation.x = Math.PI / 2;
    backing.position.z = -0.018;

    return backing;
}

function createFrame3D(options, materials) {
    const group = new THREE.Group();
    group.name = "CareerLogoBadgeFrame3D";

    const frameMaterial =
        materials?.gold ||
        new THREE.MeshStandardMaterial({
            color: options.frameColor,
            roughness: 0.32,
            metalness: 0.28,
        });

    const pieces = [
        {
            name: "LogoBadgeFrameTop",
            size: [1.62, 0.026, 0.035],
            position: [0, 0.515, 0.018],
        },
        {
            name: "LogoBadgeFrameBottom",
            size: [1.62, 0.026, 0.035],
            position: [0, -0.515, 0.018],
        },
        {
            name: "LogoBadgeFrameLeft",
            size: [0.035, 0.026, 1.06],
            position: [-0.81, 0, 0.018],
            rotation: [0, 0, Math.PI / 2],
        },
        {
            name: "LogoBadgeFrameRight",
            size: [0.035, 0.026, 1.06],
            position: [0.81, 0, 0.018],
            rotation: [0, 0, Math.PI / 2],
        },
    ];

    pieces.forEach((piece) => {
        const geometry = new THREE.BoxGeometry(piece.size[0], piece.size[1], piece.size[2]);
        const mesh = new THREE.Mesh(geometry, frameMaterial);

        mesh.name = piece.name;
        mesh.position.set(piece.position[0], piece.position[1], piece.position[2]);

        if (piece.rotation) {
            mesh.rotation.set(piece.rotation[0], piece.rotation[1], piece.rotation[2]);
        }

        setMeshShadow(mesh, true, true);
        group.add(mesh);
    });

    return group;
}

function createCircularBadge(options, materials) {
    const group = new THREE.Group();
    group.name = "CareerLogoCircularBadge";

    const baseMaterial =
        materials?.paper ||
        new THREE.MeshStandardMaterial({
            color: options.backgroundColor,
            roughness: 0.7,
            metalness: 0,
        });

    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.52, 0.52, 0.055, 72),
        baseMaterial,
    );

    base.name = "CareerLogoCircularBase";
    base.rotation.x = Math.PI / 2;
    base.position.z = -0.025;

    const logo = new THREE.Mesh(
        new THREE.PlaneGeometry(0.72, 0.72),
        createLogoMaterial(options),
    );

    logo.name = "CareerLogoPlane";
    logo.position.z = 0.014;
    logo.scale.set(
        options.logoScale[0],
        options.logoScale[1],
        options.logoScale[2],
    );

    const ringMaterial =
        materials?.gold ||
        new THREE.MeshStandardMaterial({
            color: options.frameColor,
            roughness: 0.32,
            metalness: 0.28,
        });

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.525, 0.022, 12, 72),
        ringMaterial,
    );

    ring.name = "CareerLogoCircularFrame";
    ring.rotation.x = Math.PI / 2;
    ring.position.z = 0.017;

    setMeshShadow(base, true, true);
    setMeshShadow(logo, false, true);
    setMeshShadow(ring, true, true);

    group.add(base, logo, ring);

    return group;
}

function createStickerBadge(options, materials) {
    const group = new THREE.Group();
    group.name = "CareerLogoStickerBadge";

    const backing = createPhysicalBacking(options, materials);
    const surface = createBadgeBase(options);
    const logo = createLogoPlane(options);
    const frame = createFrame3D(options, materials);

    group.add(backing, surface, logo, frame);

    return group;
}

function createMinimalLogoBadge(options) {
    const group = new THREE.Group();
    group.name = "CareerLogoMinimalBadge";

    const logo = new THREE.Mesh(
        new THREE.PlaneGeometry(0.82, 0.82),
        createLogoMaterial(options),
    );

    logo.name = "CareerLogoPlane";
    logo.renderOrder = 7;
    logo.scale.set(
        options.logoScale[0],
        options.logoScale[1],
        options.logoScale[2],
    );

    group.add(logo);

    return group;
}

function createBadgeContactShadow(materials) {
    const shadowMaterial =
        materials?.shadowSoft ||
        new THREE.MeshBasicMaterial({
            color: "#000000",
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide,
        });

    const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(0.72, 48),
        shadowMaterial,
    );

    shadow.name = "CareerLogoBadgeContactShadow";
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.03;
    shadow.scale.set(1.22, 0.78, 1);

    return shadow;
}

function createBadgeByStyle(options, materials) {
    if (options.style === "circular") {
        return createCircularBadge(options, materials);
    }

    if (options.style === "minimal") {
        return createMinimalLogoBadge(options);
    }

    return createStickerBadge(options, materials);
}

export function createCareerLogoBadge(config, materials = {}, options = {}) {
    const mergedOptions = {
        ...DEFAULT_LOGO_BADGE_OPTIONS,
        ...options,
    };

    const group = new THREE.Group();
    group.name = "KickOffBoxCareerLogoBadge";

    const shadow = createBadgeContactShadow(materials);
    const badge = createBadgeByStyle(mergedOptions, materials);

    if (mergedOptions.showShadow) {
        group.add(shadow);
    }

    group.add(badge);

    const defaultTransform = {
        position: [0.25, 0.66, -0.55],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [0.78, 0.78, 0.78],
    };

    applyTransform(group, {
        position: options.position ?? defaultTransform.position,
        rotation: options.rotation ?? defaultTransform.rotation,
        scale: options.scale ?? defaultTransform.scale,
    });

    group.userData = {
        type: "career-logo-badge",
        editable: true,
        draggable: true,
        rotatable: true,
        scalable: true,
        visibleInPresets: ["estandar", "premium"],
        minScale: 0.25,
        maxScale: 1.8,
        options: mergedOptions,
        description:
            "Logo de carrera reutilizable para ubicarlo como sticker, placa o marca visual dentro de KickOff Box.",
    };

    setGroupShadow(group, true, true);

    return group;
}

export function updateCareerLogoVariant(badgeGroup, variant = "claro") {
    if (!badgeGroup) return;

    const logo = badgeGroup.getObjectByName("CareerLogoPlane");

    if (!logo?.material) return;

    if (logo.material.map) {
        logo.material.map.dispose();
    }

    const texture = loadLogoTexture(variant);

    logo.material.map = texture;
    logo.material.userData.texture = texture;
    logo.material.userData.variant = variant;
    logo.material.needsUpdate = true;

    badgeGroup.userData.options = {
        ...badgeGroup.userData.options,
        variant,
    };
}

export function updateCareerLogoBadgeDesign(badgeGroup, nextOptions = {}) {
    if (!badgeGroup) return;

    const surface = badgeGroup.getObjectByName("CareerLogoBadgeSurface");

    if (!surface?.material) {
        badgeGroup.userData.options = {
            ...badgeGroup.userData.options,
            ...nextOptions,
        };
        return;
    }

    const currentOptions = badgeGroup.userData?.options ?? DEFAULT_LOGO_BADGE_OPTIONS;
    const updatedOptions = {
        ...currentOptions,
        ...nextOptions,
    };

    const oldTexture = surface.material.map;
    const { texture } = createBadgeCanvas(updatedOptions);

    surface.material.map = texture;
    surface.material.userData.texture = texture;
    surface.material.userData.options = updatedOptions;
    surface.material.needsUpdate = true;

    if (oldTexture) {
        oldTexture.dispose();
    }

    badgeGroup.userData.options = updatedOptions;
}

export function setCareerLogoBadgeTransform(
    badgeGroup,
    {
        position,
        rotation,
        scale,
    } = {},
) {
    if (!badgeGroup) return;

    if (position) {
        badgeGroup.position.set(position[0], position[1], position[2]);
    }

    if (rotation) {
        badgeGroup.rotation.set(rotation[0], rotation[1], rotation[2]);
    }

    if (scale) {
        badgeGroup.scale.set(scale[0], scale[1], scale[2]);
    }
}

export function setCareerLogoBadgeVisibility(badgeGroup, visible = true) {
    if (!badgeGroup) return;

    badgeGroup.visible = Boolean(visible);
}

export function setCareerLogoFrameVisibility(badgeGroup, visible = true) {
    const frame =
        badgeGroup?.getObjectByName("CareerLogoBadgeFrame3D") ||
        badgeGroup?.getObjectByName("CareerLogoCircularFrame");

    if (!frame) return;

    frame.visible = Boolean(visible);
}

export function setCareerLogoShadowVisibility(badgeGroup, visible = true) {
    const shadow = badgeGroup?.getObjectByName("CareerLogoBadgeContactShadow");

    if (!shadow) return;

    shadow.visible = Boolean(visible);
}

export function animateCareerLogoBadge(badgeGroup, elapsedTime = 0) {
    if (!badgeGroup) return;

    const logo = badgeGroup.getObjectByName("CareerLogoPlane");

    if (logo) {
        logo.position.z = 0.014 + Math.sin(elapsedTime * 1.15) * 0.002;
    }
}

export function getCareerLogoBadgeParts(badgeGroup) {
    if (!badgeGroup) return {};

    return {
        stickerBadge: badgeGroup.getObjectByName("CareerLogoStickerBadge"),
        circularBadge: badgeGroup.getObjectByName("CareerLogoCircularBadge"),
        minimalBadge: badgeGroup.getObjectByName("CareerLogoMinimalBadge"),
        surface: badgeGroup.getObjectByName("CareerLogoBadgeSurface"),
        logo: badgeGroup.getObjectByName("CareerLogoPlane"),
        backing: badgeGroup.getObjectByName("CareerLogoBadgeBacking"),
        frame:
            badgeGroup.getObjectByName("CareerLogoBadgeFrame3D") ||
            badgeGroup.getObjectByName("CareerLogoCircularFrame"),
        shadow: badgeGroup.getObjectByName("CareerLogoBadgeContactShadow"),
    };
}

export function disposeCareerLogoBadge(badgeGroup) {
    if (!badgeGroup) return;

    badgeGroup.traverse((object) => {
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

    badgeGroup.removeFromParent();
}

export function disposeCareerLogoTextureCache() {
    textureCache.forEach((texture) => {
        texture.dispose();
    });

    textureCache.clear();
}
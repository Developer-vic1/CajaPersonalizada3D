import * as THREE from "three";

import {
    applyTransform,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

const DEFAULT_RESIIN_OPTIONS = {
    bodyColor: "#f2eee7",
    glitterColor: "#fff7d1",
    opacity: 0.92,
    transmission: 0.26,
    roughness: 0.18,
    thickness: 0.42,
    metalness: 0.03,
    logoVariant: "claro",
    logoScale: [0.5, 0.5, 0.5],
    badgeScale: [0.62, 0.62, 0.62],
    ringColor: "#d6d6d6",
    ringMetalness: 0.85,
    ringRoughness: 0.22,
    showBadge: true,
    showGlitter: true,
    showRing: true,
};

const textureLoader = new THREE.TextureLoader();

function createResinShape() {
    const shape = new THREE.Shape();

    shape.moveTo(-0.18, 0.7);
    shape.bezierCurveTo(0.08, 0.78, 0.24, 0.62, 0.22, 0.42);
    shape.bezierCurveTo(0.18, 0.1, 0.02, -0.22, -0.12, -0.52);
    shape.bezierCurveTo(-0.2, -0.7, -0.1, -0.92, 0.06, -1.08);
    shape.bezierCurveTo(0.2, -1.22, 0.18, -1.34, 0.04, -1.38);
    shape.bezierCurveTo(-0.12, -1.36, -0.3, -1.22, -0.42, -1.02);
    shape.bezierCurveTo(-0.58, -0.74, -0.62, -0.42, -0.56, -0.08);
    shape.bezierCurveTo(-0.52, 0.16, -0.48, 0.36, -0.46, 0.52);
    shape.bezierCurveTo(-0.44, 0.66, -0.34, 0.76, -0.18, 0.7);

    return shape;
}

function createResinBodyMaterial(options) {
    return new THREE.MeshPhysicalMaterial({
        color: options.bodyColor,
        transparent: true,
        opacity: options.opacity,
        roughness: options.roughness,
        metalness: options.metalness,
        transmission: options.transmission,
        thickness: options.thickness,
        ior: 1.45,
        reflectivity: 0.65,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        side: THREE.DoubleSide,
    });
}

function createRingMaterial(options) {
    return new THREE.MeshStandardMaterial({
        color: options.ringColor,
        metalness: options.ringMetalness,
        roughness: options.ringRoughness,
    });
}

function createBadgeMaterial(texture) {
    return new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
    });
}

function loadLogoTexture(variant = "claro") {
    const texturePath =
        variant === "oscuro" ? "/image/Logo-Oscuro.png" : "/image/Logo-Claro.png";

    const texture = textureLoader.load(texturePath);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    return texture;
}

function createResinBody(options) {
    const geometry = new THREE.ExtrudeGeometry(createResinShape(), {
        depth: 0.18,
        bevelEnabled: true,
        bevelThickness: 0.035,
        bevelSize: 0.04,
        bevelSegments: 4,
        curveSegments: 28,
    });

    geometry.center();

    const mesh = new THREE.Mesh(geometry, createResinBodyMaterial(options));
    mesh.name = "ResinBody";
    mesh.rotation.set(0, 0.06, 0);

    setMeshShadow(mesh, true, true);

    return mesh;
}

function createResinInnerGlow(options) {
    const geometry = new THREE.ExtrudeGeometry(createResinShape(), {
        depth: 0.06,
        bevelEnabled: false,
        curveSegments: 22,
    });

    geometry.center();

    const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(options.bodyColor).offsetHSL(0, 0, 0.08),
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = "ResinInnerGlow";
    mesh.scale.set(0.88, 0.88, 0.88);
    mesh.position.z = 0.016;

    return mesh;
}

function createTopCap(options) {
    const geometry = new THREE.CylinderGeometry(0.12, 0.15, 0.12, 24);
    const material = new THREE.MeshPhysicalMaterial({
        color: "#efe6d9",
        transparent: true,
        opacity: 0.9,
        roughness: 0.16,
        metalness: 0.02,
        transmission: 0.22,
        thickness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = "ResinCap";
    mesh.position.set(-0.06, 0.68, 0);
    mesh.scale.set(1, 0.75, 0.85);
    mesh.rotation.z = -0.12;

    setMeshShadow(mesh, true, true);

    return mesh;
}

function createRing(options) {
    const group = new THREE.Group();
    group.name = "ResinRingGroup";

    const torus = new THREE.Mesh(
        new THREE.TorusGeometry(0.11, 0.018, 18, 42),
        createRingMaterial(options),
    );
    torus.name = "ResinRing";
    torus.rotation.x = Math.PI / 2;
    torus.position.set(-0.02, 0.86, 0);

    const connector = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.09, 18),
        createRingMaterial(options),
    );
    connector.name = "ResinRingConnector";
    connector.position.set(-0.03, 0.77, 0);
    connector.rotation.z = 0.08;

    setMeshShadow(torus, true, true);
    setMeshShadow(connector, true, true);

    group.add(torus, connector);

    return group;
}

function createLogoBadge(options) {
    const texture = loadLogoTexture(options.logoVariant);

    const badgeGroup = new THREE.Group();
    badgeGroup.name = "ResinBadgeGroup";

    const base = new THREE.Mesh(
        new THREE.CircleGeometry(0.22, 48),
        new THREE.MeshPhysicalMaterial({
            color: "#fff9ef",
            transparent: true,
            opacity: 0.95,
            roughness: 0.12,
            metalness: 0.03,
            transmission: 0.12,
            thickness: 0.08,
            clearcoat: 1,
            clearcoatRoughness: 0.04,
        }),
    );
    base.name = "ResinBadgeBase";
    base.position.z = 0.01;

    const logo = new THREE.Mesh(
        new THREE.PlaneGeometry(0.34, 0.34),
        createBadgeMaterial(texture),
    );
    logo.name = "ResinBadgeLogo";
    logo.position.z = 0.024;
    logo.scale.set(
        options.logoScale[0],
        options.logoScale[1],
        options.logoScale[2],
    );

    const outline = new THREE.Mesh(
        new THREE.TorusGeometry(0.225, 0.012, 12, 42),
        new THREE.MeshStandardMaterial({
            color: "#ff9b22",
            metalness: 0.14,
            roughness: 0.38,
        }),
    );
    outline.name = "ResinBadgeOutline";
    outline.position.z = 0.018;
    outline.rotation.x = Math.PI / 2;

    setMeshShadow(base, true, true);
    setMeshShadow(logo, false, true);
    setMeshShadow(outline, true, true);

    badgeGroup.add(base, logo, outline);

    badgeGroup.position.set(-0.11, 0.16, 0.035);
    badgeGroup.rotation.set(0.02, -0.22, -0.08);
    badgeGroup.scale.set(
        options.badgeScale[0],
        options.badgeScale[1],
        options.badgeScale[2],
    );

    badgeGroup.userData = {
        editable: true,
        role: "badge",
        minScale: 0.25,
        maxScale: 1.4,
    };

    return badgeGroup;
}

function createGlitterParticle(material, position, rotation, scale) {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.025, 0.025, 0.004),
        material,
    );

    mesh.position.set(position[0], position[1], position[2]);
    mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
    mesh.scale.set(scale[0], scale[1], scale[2]);

    return mesh;
}

function createGlitter(options) {
    const group = new THREE.Group();
    group.name = "ResinGlitterGroup";

    const material = new THREE.MeshStandardMaterial({
        color: options.glitterColor,
        emissive: "#fff3b6",
        emissiveIntensity: 0.12,
        roughness: 0.28,
        metalness: 0.16,
    });

    const particles = [
        [[-0.12, 0.48, 0.02], [0.3, 0.1, 0.2], [1.1, 0.8, 1]],
        [[-0.02, 0.22, 0.03], [0.2, 0.5, 0.8], [0.8, 1, 1]],
        [[-0.18, -0.06, 0.025], [0.9, 0.4, 0.2], [1.2, 0.8, 1]],
        [[-0.05, -0.22, 0.02], [0.3, 1.1, 0.2], [0.9, 0.9, 1]],
        [[-0.13, -0.42, 0.03], [0.6, 0.3, 1.2], [1.3, 0.7, 1]],
        [[-0.26, 0.08, 0.01], [0.5, 0.8, 0.3], [0.7, 1.1, 1]],
        [[-0.28, 0.42, 0.02], [0.8, 0.3, 0.9], [1, 0.9, 1]],
        [[0.02, -0.56, 0.02], [0.2, 0.9, 0.4], [0.8, 0.8, 1]],
        [[-0.08, 0.62, 0.02], [0.1, 0.2, 0.7], [1, 1.2, 1]],
    ];

    particles.forEach((particle, index) => {
        const mesh = createGlitterParticle(
            material,
            particle[0],
            particle[1],
            particle[2],
        );

        mesh.name = `ResinGlitter_${index + 1}`;
        group.add(mesh);
    });

    return group;
}

function createSpecularHighlight() {
    const geometry = new THREE.PlaneGeometry(0.3, 0.9);
    const material = new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.17,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = "ResinHighlight";
    mesh.position.set(0.02, 0.02, 0.11);
    mesh.rotation.set(0.08, -0.18, -0.24);

    return mesh;
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

    const mesh = new THREE.Mesh(
        new THREE.CircleGeometry(0.5, 42),
        shadowMaterial,
    );

    mesh.name = "ResinContactShadow";
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(0, -0.8, 0);
    mesh.scale.set(0.95, 0.45, 1);

    return mesh;
}

export function createResinKeychain(config, materials = {}, options = {}) {
    const mergedOptions = {
        ...DEFAULT_RESIIN_OPTIONS,
        ...options,
    };

    const group = new THREE.Group();
    group.name = "KickOffBoxResinKeychain";

    const shadow = createContactShadow(materials);
    const body = createResinBody(mergedOptions);
    const glow = createResinInnerGlow(mergedOptions);
    const cap = createTopCap(mergedOptions);
    const highlight = createSpecularHighlight();

    group.add(shadow, body, glow, cap, highlight);

    if (mergedOptions.showGlitter) {
        group.add(createGlitter(mergedOptions));
    }

    if (mergedOptions.showBadge) {
        group.add(createLogoBadge(mergedOptions));
    }

    if (mergedOptions.showRing) {
        group.add(createRing(mergedOptions));
    }

    const layout = config?.contentLayout?.keychain ?? {};

    applyTransform(group, {
        position: layout.position ?? [0.35, 0.62, -0.2],
        rotation: layout.rotation ?? [0.18, -0.45, 0.15],
        scale: layout.scale ?? [0.72, 0.72, 0.72],
    });

    group.userData = {
        type: "resin-keychain",
        editable: true,
        draggable: true,
        rotatable: true,
        scalable: true,
        visibleInPresets: ["estandar", "completa"],
        minScale: 0.35,
        maxScale: 1.8,
        description:
            "Adorno de resina editable con logo integrado, brillo interno y aro metálico.",
    };

    setGroupShadow(group, true, true);

    return group;
}

export function setResinKeychainTransform(
    keychain,
    {
        position,
        rotation,
        scale,
    } = {},
) {
    if (!keychain) return;

    if (position) {
        keychain.position.set(position[0], position[1], position[2]);
    }

    if (rotation) {
        keychain.rotation.set(rotation[0], rotation[1], rotation[2]);
    }

    if (scale) {
        keychain.scale.set(scale[0], scale[1], scale[2]);
    }
}

export function setResinBadgePosition(
    keychain,
    {
        position,
        rotation,
        scale,
    } = {},
) {
    if (!keychain) return;

    const badge = keychain.getObjectByName("ResinBadgeGroup");
    if (!badge) return;

    if (position) {
        badge.position.set(position[0], position[1], position[2]);
    }

    if (rotation) {
        badge.rotation.set(rotation[0], rotation[1], rotation[2]);
    }

    if (scale) {
        badge.scale.set(scale[0], scale[1], scale[2]);
    }
}

export function setResinLogoVariant(keychain, variant = "claro") {
    if (!keychain) return;

    const logo = keychain.getObjectByName("ResinBadgeLogo");
    if (!logo || !logo.material) return;

    const texture = loadLogoTexture(variant);

    if (logo.material.map) {
        logo.material.map.dispose();
    }

    logo.material.map = texture;
    logo.material.needsUpdate = true;
}

export function setResinBadgeVisibility(keychain, visible = true) {
    const badge = keychain?.getObjectByName("ResinBadgeGroup");
    if (!badge) return;

    badge.visible = Boolean(visible);
}

export function setResinRingVisibility(keychain, visible = true) {
    const ring = keychain?.getObjectByName("ResinRingGroup");
    if (!ring) return;

    ring.visible = Boolean(visible);
}

export function setResinGlitterVisibility(keychain, visible = true) {
    const glitter = keychain?.getObjectByName("ResinGlitterGroup");
    if (!glitter) return;

    glitter.visible = Boolean(visible);
}

export function updateResinBodyColor(keychain, color = "#f2eee7") {
    if (!keychain) return;

    const body = keychain.getObjectByName("ResinBody");
    const glow = keychain.getObjectByName("ResinInnerGlow");

    if (body?.material?.color) {
        body.material.color.set(color);
        body.material.needsUpdate = true;
    }

    if (glow?.material?.color) {
        glow.material.color.set(new THREE.Color(color).offsetHSL(0, 0, 0.08));
        glow.material.needsUpdate = true;
    }
}

export function animateResinKeychain(keychain, elapsedTime = 0) {
    if (!keychain) return;

    const highlight = keychain.getObjectByName("ResinHighlight");
    const glitter = keychain.getObjectByName("ResinGlitterGroup");

    if (highlight) {
        highlight.material.opacity = 0.12 + Math.sin(elapsedTime * 1.4) * 0.04;
    }

    if (glitter) {
        glitter.children.forEach((particle, index) => {
            particle.rotation.z += 0.002 + index * 0.00004;
        });
    }
}

export function getResinKeychainParts(keychain) {
    if (!keychain) return {};

    return {
        body: keychain.getObjectByName("ResinBody"),
        glow: keychain.getObjectByName("ResinInnerGlow"),
        cap: keychain.getObjectByName("ResinCap"),
        badge: keychain.getObjectByName("ResinBadgeGroup"),
        logo: keychain.getObjectByName("ResinBadgeLogo"),
        ring: keychain.getObjectByName("ResinRingGroup"),
        glitter: keychain.getObjectByName("ResinGlitterGroup"),
        highlight: keychain.getObjectByName("ResinHighlight"),
        shadow: keychain.getObjectByName("ResinContactShadow"),
    };
}

export function disposeResinKeychain(keychain) {
    if (!keychain) return;

    keychain.traverse((object) => {
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

    keychain.removeFromParent();
}
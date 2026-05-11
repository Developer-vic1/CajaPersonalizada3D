import * as THREE from "three";
import QRCode from "qrcode";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import {
    applyTransform,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

const DEFAULT_QR_OPTIONS = {
    title: "Contenido digital",
    subtitle: "Escanea para ver el proyecto",
    footer: "KickOff Box 2026",
    qrValue: "https://example.com/kickoff-box",
    qrSize: 520,
    canvasWidth: 1400,
    canvasHeight: 1000,
    errorCorrectionLevel: "H",
    darkColor: "#2b2118",
    lightColor: "#fff7e8",
    cardColor: "#fff7e8",
    accentColor: "#c59a4a",
    showCornerMarks: true,
    showMiniLogoPlaceholder: true,
};

function createRoundedMesh({
    name,
    width,
    height,
    depth,
    radius = 0.035,
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

function drawCornerMarks(ctx, canvasWidth, canvasHeight, color) {
    const margin = 70;
    const length = 95;
    const thickness = 14;

    ctx.fillStyle = color;

    const corners = [
        [margin, margin, 1, 1],
        [canvasWidth - margin, margin, -1, 1],
        [margin, canvasHeight - margin, 1, -1],
        [canvasWidth - margin, canvasHeight - margin, -1, -1],
    ];

    corners.forEach(([x, y, dirX, dirY]) => {
        ctx.fillRect(x, y, length * dirX, thickness * dirY);
        ctx.fillRect(x, y, thickness * dirX, length * dirY);
    });
}

function drawTechLines(ctx, canvasWidth, canvasHeight) {
    ctx.save();

    ctx.strokeStyle = "rgba(43, 33, 24, 0.16)";
    ctx.lineWidth = 5;

    const lines = [
        [[120, 210], [220, 210], [260, 250]],
        [[canvasWidth - 120, 210], [canvasWidth - 235, 210], [canvasWidth - 285, 260]],
        [[160, canvasHeight - 170], [260, canvasHeight - 170], [305, canvasHeight - 220]],
        [[canvasWidth - 150, canvasHeight - 170], [canvasWidth - 250, canvasHeight - 170], [canvasWidth - 300, canvasHeight - 215]],
    ];

    lines.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line[0][0], line[0][1]);

        for (let i = 1; i < line.length; i += 1) {
            ctx.lineTo(line[i][0], line[i][1]);
        }

        ctx.stroke();
    });

    ctx.fillStyle = "rgba(197, 154, 74, 0.75)";

    [
        [260, 250],
        [canvasWidth - 285, 260],
        [305, canvasHeight - 220],
        [canvasWidth - 300, canvasHeight - 215],
    ].forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 13, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.restore();
}

function drawMiniLogoPlaceholder(ctx, x, y, radius) {
    ctx.save();

    ctx.fillStyle = "#fff7e8";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#ff8a00";
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.fillStyle = "#2b2118";
    ctx.font = "bold 54px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("K", x, y + 4);

    ctx.restore();
}

function drawBaseCard(canvas, options, qrCanvas = null) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const backgroundGradient = ctx.createLinearGradient(0, 0, width, height);
    backgroundGradient.addColorStop(0, "#fff9ef");
    backgroundGradient.addColorStop(0.52, options.cardColor);
    backgroundGradient.addColorStop(1, "#f1d5aa");

    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, width, height);

    const accentGradient = ctx.createLinearGradient(0, 0, width, 0);
    accentGradient.addColorStop(0, "rgba(185, 45, 45, 0.16)");
    accentGradient.addColorStop(0.5, "rgba(240, 200, 75, 0.2)");
    accentGradient.addColorStop(1, "rgba(47, 125, 85, 0.16)");

    ctx.fillStyle = accentGradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#b92d2d";
    ctx.fillRect(0, 0, width, 46);

    ctx.fillStyle = "#f0c84b";
    ctx.fillRect(0, 46, width, 46);

    ctx.fillStyle = "#2f7d55";
    ctx.fillRect(0, 92, width, 46);

    if (options.showCornerMarks) {
        drawCornerMarks(ctx, width, height, options.accentColor);
    }

    drawTechLines(ctx, width, height);

    ctx.strokeStyle = "rgba(122, 79, 42, 0.38)";
    ctx.lineWidth = 16;
    drawRoundedRect(ctx, 64, 170, width - 128, height - 240, 42);
    ctx.stroke();

    ctx.strokeStyle = "rgba(197, 154, 74, 0.62)";
    ctx.lineWidth = 8;
    drawRoundedRect(ctx, 96, 202, width - 192, height - 304, 32);
    ctx.stroke();

    ctx.fillStyle = "#7a1e1e";
    ctx.font = "bold 74px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(options.title, width / 2, 260);

    ctx.fillStyle = "#2b2118";
    ctx.font = "40px Arial";
    ctx.fillText(options.subtitle, width / 2, 330);

    const qrBoxSize = 560;
    const qrBoxX = width / 2 - qrBoxSize / 2;
    const qrBoxY = 385;

    ctx.fillStyle = "#fffdf8";
    drawRoundedRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 34);
    ctx.fill();

    ctx.strokeStyle = "rgba(43, 33, 24, 0.24)";
    ctx.lineWidth = 10;
    drawRoundedRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 34);
    ctx.stroke();

    if (qrCanvas) {
        const qrDrawSize = 472;
        const qrDrawX = width / 2 - qrDrawSize / 2;
        const qrDrawY = qrBoxY + 44;

        ctx.drawImage(qrCanvas, qrDrawX, qrDrawY, qrDrawSize, qrDrawSize);
    } else {
        ctx.fillStyle = "rgba(43, 33, 24, 0.12)";
        ctx.font = "bold 42px Arial";
        ctx.fillText("Generando QR...", width / 2, qrBoxY + qrBoxSize / 2);
    }

    if (options.showMiniLogoPlaceholder) {
        drawMiniLogoPlaceholder(ctx, width / 2, qrBoxY + qrBoxSize / 2, 62);
    }

    ctx.fillStyle = "#2b2118";
    ctx.font = "bold 36px Arial";
    ctx.fillText(options.footer, width / 2, height - 94);

    ctx.fillStyle = "rgba(43, 33, 24, 0.64)";
    ctx.font = "28px Arial";
    ctx.fillText("Mensaje · Proyecto · Galería · Certificado digital", width / 2, height - 48);
}

function createQRCanvasTexture(options) {
    const canvas = document.createElement("canvas");
    canvas.width = options.canvasWidth;
    canvas.height = options.canvasHeight;

    drawBaseCard(canvas, options);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    const qrCanvas = document.createElement("canvas");

    QRCode.toCanvas(
        qrCanvas,
        options.qrValue,
        {
            width: options.qrSize,
            margin: 2,
            errorCorrectionLevel: options.errorCorrectionLevel,
            color: {
                dark: options.darkColor,
                light: options.lightColor,
            },
        },
        (error) => {
            if (error) {
                console.error("No se pudo generar el QR:", error);
                return;
            }

            drawBaseCard(canvas, options, qrCanvas);
            texture.needsUpdate = true;
        },
    );

    return {
        canvas,
        texture,
    };
}

function createQRSurfaceMaterial(options) {
    const { texture } = createQRCanvasTexture(options);

    const material = new THREE.MeshBasicMaterial({
        name: "QRCardSurfaceMaterial",
        map: texture,
        side: THREE.DoubleSide,
    });

    material.userData = {
        texture,
        options,
    };

    return material;
}

function createQRCardBody(config, materials) {
    const layout = config?.contentLayout?.qrCard ?? {};
    const size = layout.size ?? {
        width: 0.95,
        height: 0.05,
        depth: 0.95,
    };

    const body = createRoundedMesh({
        name: "QRCardBody",
        width: size.width,
        height: size.height,
        depth: size.depth,
        radius: 0.035,
        segments: 5,
        material: materials.paper,
    });

    return body;
}

function createQRCardSurface(config, options) {
    const layout = config?.contentLayout?.qrCard ?? {};
    const size = layout.size ?? {
        width: 0.95,
        height: 0.05,
        depth: 0.95,
    };

    const surface = new THREE.Mesh(
        new THREE.PlaneGeometry(size.width * 0.9, size.depth * 0.9),
        createQRSurfaceMaterial(options),
    );

    surface.name = "QRCardSurface";
    surface.rotation.x = -Math.PI / 2;
    surface.position.y = size.height / 2 + 0.006;
    surface.renderOrder = 6;

    return surface;
}

function createQRCardBack(config, materials) {
    const layout = config?.contentLayout?.qrCard ?? {};
    const size = layout.size ?? {
        width: 0.95,
        height: 0.05,
        depth: 0.95,
    };

    const backMaterial = materials.paperBack ?? materials.paper;

    const back = createRoundedMesh({
        name: "QRCardBack",
        width: size.width * 0.92,
        height: 0.022,
        depth: size.depth * 0.92,
        radius: 0.03,
        segments: 4,
        material: backMaterial,
    });

    back.position.y = -size.height / 2 - 0.012;

    return back;
}

function createQRCardBorder(config, materials) {
    const group = new THREE.Group();
    group.name = "QRCardBorder";

    const layout = config?.contentLayout?.qrCard ?? {};
    const size = layout.size ?? {
        width: 0.95,
        height: 0.05,
        depth: 0.95,
    };

    const y = size.height / 2 + 0.018;
    const borderThickness = 0.025;

    const top = createRoundedMesh({
        name: "QRBorderTop",
        width: size.width,
        height: 0.014,
        depth: borderThickness,
        radius: 0.008,
        segments: 3,
        material: materials.gold,
    });
    top.position.set(0, y, -size.depth / 2);

    const bottom = createRoundedMesh({
        name: "QRBorderBottom",
        width: size.width,
        height: 0.014,
        depth: borderThickness,
        radius: 0.008,
        segments: 3,
        material: materials.gold,
    });
    bottom.position.set(0, y, size.depth / 2);

    const left = createRoundedMesh({
        name: "QRBorderLeft",
        width: borderThickness,
        height: 0.014,
        depth: size.depth,
        radius: 0.008,
        segments: 3,
        material: materials.gold,
    });
    left.position.set(-size.width / 2, y, 0);

    const right = createRoundedMesh({
        name: "QRBorderRight",
        width: borderThickness,
        height: 0.014,
        depth: size.depth,
        radius: 0.008,
        segments: 3,
        material: materials.gold,
    });
    right.position.set(size.width / 2, y, 0);

    group.add(top, bottom, left, right);

    return group;
}

function createQRCardStand(config, materials) {
    const group = new THREE.Group();
    group.name = "QRCardStand";

    const standMaterial = materials.darkCardboard;

    const backSupport = createRoundedMesh({
        name: "QRBackSupport",
        width: 0.08,
        height: 0.34,
        depth: 0.04,
        radius: 0.012,
        segments: 3,
        material: standMaterial,
    });

    backSupport.position.set(0, -0.04, -0.42);
    backSupport.rotation.x = -0.28;

    const foot = createRoundedMesh({
        name: "QRStandFoot",
        width: 0.66,
        height: 0.035,
        depth: 0.16,
        radius: 0.018,
        segments: 3,
        material: standMaterial,
    });

    foot.position.set(0, -0.07, 0.34);

    group.add(backSupport, foot);

    group.visible = false;

    return group;
}

function createQRCardContactShadow(materials) {
    const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(0.68, 48),
        materials.shadowSoft,
    );

    shadow.name = "QRCardContactShadow";
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.04;
    shadow.scale.set(1.1, 0.78, 1);

    return shadow;
}

export function createQRCard(config, materials, options = {}) {
    const mergedOptions = {
        ...DEFAULT_QR_OPTIONS,
        ...options,
    };

    const group = new THREE.Group();
    group.name = "KickOffBoxQRCard";

    const shadow = createQRCardContactShadow(materials);
    const body = createQRCardBody(config, materials);
    const back = createQRCardBack(config, materials);
    const surface = createQRCardSurface(config, mergedOptions);
    const border = createQRCardBorder(config, materials);
    const stand = createQRCardStand(config, materials);

    group.add(shadow, body, back, surface, border, stand);

    const layout = config?.contentLayout?.qrCard ?? {};

    applyTransform(group, {
        position: layout.position ?? [0.25, 0.62, -1.55],
        rotation: layout.rotation ?? [0, 0, 0],
        scale: layout.scale ?? [1, 1, 1],
    });

    group.userData = {
        type: "qr-card",
        editable: true,
        visibleInPresets: ["premium"],
        description:
            "Tarjeta QR funcional para enlazar contenido digital del presente académico.",
        options: mergedOptions,
    };

    setGroupShadow(group, true, true);

    return group;
}

export function updateQRCard(qrCardGroup, nextOptions = {}) {
    if (!qrCardGroup) return;

    const surface = qrCardGroup.getObjectByName("QRCardSurface");

    if (!surface?.material) return;

    const currentOptions = qrCardGroup.userData?.options ?? DEFAULT_QR_OPTIONS;
    const updatedOptions = {
        ...currentOptions,
        ...nextOptions,
    };

    const oldTexture = surface.material.map;
    const { texture } = createQRCanvasTexture(updatedOptions);

    surface.material.map = texture;
    surface.material.userData.texture = texture;
    surface.material.userData.options = updatedOptions;
    surface.material.needsUpdate = true;

    if (oldTexture) {
        oldTexture.dispose();
    }

    qrCardGroup.userData.options = updatedOptions;
}

export function setQRCardVisibility(qrCardGroup, visible = true) {
    if (!qrCardGroup) return;

    qrCardGroup.visible = Boolean(visible);
}

export function setQRCardStandVisibility(qrCardGroup, visible = true) {
    const stand = qrCardGroup?.getObjectByName("QRCardStand");

    if (!stand) return;

    stand.visible = Boolean(visible);
}

export function setQRCardTransform(
    qrCardGroup,
    {
        position,
        rotation,
        scale,
    } = {},
) {
    if (!qrCardGroup) return;

    if (position) {
        qrCardGroup.position.set(position[0], position[1], position[2]);
    }

    if (rotation) {
        qrCardGroup.rotation.set(rotation[0], rotation[1], rotation[2]);
    }

    if (scale) {
        qrCardGroup.scale.set(scale[0], scale[1], scale[2]);
    }
}

export function getQRCardParts(qrCardGroup) {
    if (!qrCardGroup) return {};

    return {
        body: qrCardGroup.getObjectByName("QRCardBody"),
        back: qrCardGroup.getObjectByName("QRCardBack"),
        surface: qrCardGroup.getObjectByName("QRCardSurface"),
        border: qrCardGroup.getObjectByName("QRCardBorder"),
        stand: qrCardGroup.getObjectByName("QRCardStand"),
        shadow: qrCardGroup.getObjectByName("QRCardContactShadow"),
    };
}

export function disposeQRCard(qrCardGroup) {
    if (!qrCardGroup) return;

    qrCardGroup.traverse((object) => {
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

    qrCardGroup.removeFromParent();
}
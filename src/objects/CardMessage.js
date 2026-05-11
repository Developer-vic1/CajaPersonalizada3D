import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import {
    applyTransform,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

const DEFAULT_CARD_DATA = {
    title: "Gracias por ser parte",
    recipient: "Jurado Académico",
    message: "Tu evaluación impulsa nuestro proyecto.",
    footer: "KickOff Box 2026",
};

function createRoundedMesh({
    name,
    width,
    height,
    depth,
    radius = 0.04,
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

function wrapText(ctx, text, maxWidth) {
    const words = String(text).split(" ");
    const lines = [];
    let line = "";

    words.forEach((word) => {
        const testLine = line ? `${line} ${word}` : word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && line) {
            lines.push(line);
            line = word;
        } else {
            line = testLine;
        }
    });

    if (line) lines.push(line);

    return lines;
}

function drawMiniFootball(ctx, x, y, radius) {
    ctx.save();

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#2b2118";
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#2b2118";

    ctx.beginPath();
    ctx.moveTo(x, y - radius * 0.36);
    ctx.lineTo(x + radius * 0.34, y - radius * 0.11);
    ctx.lineTo(x + radius * 0.21, y + radius * 0.3);
    ctx.lineTo(x - radius * 0.21, y + radius * 0.3);
    ctx.lineTo(x - radius * 0.34, y - radius * 0.11);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

function createCardTexture(cardData = DEFAULT_CARD_DATA, options = {}) {
    const canvas = document.createElement("canvas");
    canvas.width = options.width ?? 2048;
    canvas.height = options.height ?? 1024;

    const ctx = canvas.getContext("2d");

    const colors = {
        paper: "#fff7e8",
        paperSoft: "#f5dfbf",
        red: "#b92d2d",
        yellow: "#f0c84b",
        green: "#2f7d55",
        brown: "#7a4f2a",
        dark: "#2b2118",
        gold: "#c59a4a",
    };

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const backgroundGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    backgroundGradient.addColorStop(0, colors.paper);
    backgroundGradient.addColorStop(0.55, "#fff2da");
    backgroundGradient.addColorStop(1, colors.paperSoft);

    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const accentGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    accentGradient.addColorStop(0, "rgba(185, 45, 45, 0.18)");
    accentGradient.addColorStop(0.5, "rgba(240, 200, 75, 0.22)");
    accentGradient.addColorStop(1, "rgba(47, 125, 85, 0.18)");

    ctx.fillStyle = accentGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = colors.red;
    ctx.fillRect(0, 0, canvas.width, 54);

    ctx.fillStyle = colors.yellow;
    ctx.fillRect(0, 54, canvas.width, 54);

    ctx.fillStyle = colors.green;
    ctx.fillRect(0, 108, canvas.width, 54);

    ctx.strokeStyle = "rgba(122, 79, 42, 0.38)";
    ctx.lineWidth = 20;
    drawRoundedRect(ctx, 70, 210, canvas.width - 140, canvas.height - 300, 42);
    ctx.stroke();

    ctx.strokeStyle = "rgba(197, 154, 74, 0.58)";
    ctx.lineWidth = 9;
    drawRoundedRect(ctx, 100, 240, canvas.width - 200, canvas.height - 360, 34);
    ctx.stroke();

    drawMiniFootball(ctx, canvas.width - 180, 250, 70);

    ctx.fillStyle = colors.red;
    ctx.font = "bold 92px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(cardData.title ?? DEFAULT_CARD_DATA.title, canvas.width / 2, 330);

    ctx.fillStyle = colors.dark;
    ctx.font = "bold 68px Arial";
    ctx.fillText(cardData.recipient ?? DEFAULT_CARD_DATA.recipient, canvas.width / 2, 445);

    ctx.fillStyle = colors.brown;
    ctx.font = "48px Arial";

    const message = cardData.message ?? DEFAULT_CARD_DATA.message;
    const messageLines = wrapText(ctx, message, canvas.width - 420);
    const startY = 555;

    messageLines.slice(0, 3).forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, startY + index * 66);
    });

    ctx.fillStyle = "rgba(197, 154, 74, 0.95)";
    ctx.fillRect(canvas.width / 2 - 330, 775, 660, 8);

    ctx.fillStyle = colors.dark;
    ctx.font = "bold 42px Arial";
    ctx.fillText(cardData.footer ?? DEFAULT_CARD_DATA.footer, canvas.width / 2, 860);

    ctx.fillStyle = "rgba(43, 33, 24, 0.72)";
    ctx.font = "30px Arial";
    ctx.fillText("Presente académico personalizado", canvas.width / 2, 925);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    return texture;
}

function createCardSurfaceMaterial(cardData, options = {}) {
    const texture = createCardTexture(cardData, options);

    const material = new THREE.MeshBasicMaterial({
        name: "CardMessageSurfaceMaterial",
        map: texture,
        side: THREE.DoubleSide,
    });

    material.userData = {
        texture,
        cardData,
    };

    return material;
}

function createCardBody(config, materials) {
    const layout = config?.contentLayout?.card ?? {};
    const size = layout.size ?? {
        width: 2.7,
        height: 0.06,
        depth: 1.35,
    };

    return createRoundedMesh({
        name: "CardBody",
        width: size.width,
        height: size.height,
        depth: size.depth,
        radius: 0.045,
        segments: 5,
        material: materials.paper,
    });
}

function createCardSurface(config, cardData) {
    const layout = config?.contentLayout?.card ?? {};
    const size = layout.size ?? {
        width: 2.7,
        height: 0.06,
        depth: 1.35,
    };

    const material = createCardSurfaceMaterial(cardData);

    const surface = new THREE.Mesh(
        new THREE.PlaneGeometry(size.width * 0.92, size.depth * 0.84),
        material,
    );

    surface.name = "CardMessageSurface";
    surface.rotation.x = -Math.PI / 2;
    surface.position.y = size.height / 2 + 0.006;
    surface.renderOrder = 5;

    return surface;
}

function createCardBack(config, materials) {
    const layout = config?.contentLayout?.card ?? {};
    const size = layout.size ?? {
        width: 2.7,
        height: 0.06,
        depth: 1.35,
    };

    const back = createRoundedMesh({
        name: "CardBackReinforcement",
        width: size.width * 0.94,
        height: 0.025,
        depth: size.depth * 0.88,
        radius: 0.035,
        segments: 4,
        material: materials.paperBack ?? materials.paper,
    });

    back.position.y = -size.height / 2 - 0.012;

    return back;
}

function createCardRibbon(config, materials) {
    const layout = config?.contentLayout?.card ?? {};
    const size = layout.size ?? {
        width: 2.7,
        height: 0.06,
        depth: 1.35,
    };

    const group = new THREE.Group();
    group.name = "CardRibbon";

    const horizontal = createRoundedMesh({
        name: "CardRibbonHorizontal",
        width: size.width * 0.82,
        height: 0.018,
        depth: 0.08,
        radius: 0.012,
        segments: 3,
        material: materials.boliviaRed,
    });
    horizontal.position.y = size.height / 2 + 0.022;
    horizontal.position.z = -size.depth * 0.32;

    const vertical = createRoundedMesh({
        name: "CardRibbonVertical",
        width: 0.08,
        height: 0.02,
        depth: size.depth * 0.74,
        radius: 0.012,
        segments: 3,
        material: materials.boliviaGreen,
    });
    vertical.position.x = -size.width * 0.34;
    vertical.position.y = size.height / 2 + 0.026;

    const badge = createRoundedMesh({
        name: "CardRibbonBadge",
        width: 0.34,
        height: 0.025,
        depth: 0.2,
        radius: 0.025,
        segments: 4,
        material: materials.gold,
    });
    badge.position.x = -size.width * 0.34;
    badge.position.y = size.height / 2 + 0.05;
    badge.position.z = -size.depth * 0.32;

    group.add(horizontal, vertical, badge);

    return group;
}

function createCardEdgeLines(config, materials) {
    const group = new THREE.Group();
    group.name = "CardEdgeLines";

    const layout = config?.contentLayout?.card ?? {};
    const size = layout.size ?? {
        width: 2.7,
        height: 0.06,
        depth: 1.35,
    };

    const edgeMaterial = new THREE.LineBasicMaterial({
        color: materials.gold?.color ?? "#c59a4a",
        transparent: true,
        opacity: 0.72,
    });

    const edgeGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-size.width / 2, size.height / 2 + 0.011, -size.depth / 2),
        new THREE.Vector3(size.width / 2, size.height / 2 + 0.011, -size.depth / 2),
        new THREE.Vector3(size.width / 2, size.height / 2 + 0.011, size.depth / 2),
        new THREE.Vector3(-size.width / 2, size.height / 2 + 0.011, size.depth / 2),
        new THREE.Vector3(-size.width / 2, size.height / 2 + 0.011, -size.depth / 2),
    ]);

    const line = new THREE.Line(edgeGeometry, edgeMaterial);
    line.name = "CardGoldBorder";

    group.add(line);

    return group;
}

export function createCardMessage(config, materials, cardData = DEFAULT_CARD_DATA) {
    const group = new THREE.Group();
    group.name = "KickOffBoxCardMessage";

    const body = createCardBody(config, materials);
    const back = createCardBack(config, materials);
    const surface = createCardSurface(config, cardData);
    const ribbon = createCardRibbon(config, materials);
    const edgeLines = createCardEdgeLines(config, materials);

    group.add(body, back, surface, ribbon, edgeLines);

    const layout = config?.contentLayout?.card ?? {};
    applyTransform(group, {
        position: layout.position ?? [-2.25, 0.62, -1.45],
        rotation: layout.rotation ?? [0, 0, 0],
        scale: layout.scale ?? [1, 1, 1],
    });

    group.userData = {
        type: "card-message",
        editable: true,
        cardData: {
            ...DEFAULT_CARD_DATA,
            ...cardData,
        },
        visibleInPresets: ["basica", "estandar", "premium"],
    };

    setGroupShadow(group, true, true);

    return group;
}

export function updateCardMessage(cardGroup, nextData = {}) {
    if (!cardGroup) return;

    const surface = cardGroup.getObjectByName("CardMessageSurface");

    if (!surface?.material) return;

    const previousTexture = surface.material.map;
    const currentData = cardGroup.userData?.cardData ?? DEFAULT_CARD_DATA;
    const updatedData = {
        ...currentData,
        ...nextData,
    };

    const nextTexture = createCardTexture(updatedData);

    surface.material.map = nextTexture;
    surface.material.userData.texture = nextTexture;
    surface.material.userData.cardData = updatedData;
    surface.material.needsUpdate = true;

    if (previousTexture) {
        previousTexture.dispose();
    }

    cardGroup.userData.cardData = updatedData;
}

export function setCardMessageVisibility(cardGroup, visible = true) {
    if (!cardGroup) return;

    cardGroup.visible = Boolean(visible);
}

export function getCardMessageData(cardGroup) {
    return cardGroup?.userData?.cardData ?? null;
}

export function getCardMessageParts(cardGroup) {
    if (!cardGroup) return {};

    return {
        body: cardGroup.getObjectByName("CardBody"),
        back: cardGroup.getObjectByName("CardBackReinforcement"),
        surface: cardGroup.getObjectByName("CardMessageSurface"),
        ribbon: cardGroup.getObjectByName("CardRibbon"),
        edgeLines: cardGroup.getObjectByName("CardEdgeLines"),
    };
}

export function disposeCardMessage(cardGroup) {
    if (!cardGroup) return;

    cardGroup.traverse((object) => {
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

    cardGroup.removeFromParent();
}
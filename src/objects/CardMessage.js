import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import {
    applyTransform,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

import {
    createCardMessageTexture,
    createMaterialFromTexture,
} from "../utils/textureFactory.js";

export const CARD_MESSAGE_VERSION = "2.0.0";

export const CARD_MESSAGE_STYLES = Object.freeze({
    PREMIUM: "premium",
    DEFENSE: "defense",
    JURY: "jury",
    INSTITUTIONAL: "institutional",
    BOLIVIA_WORLD_CUP: "bolivia-world-cup",
    ACADEMIC_MINIMAL: "academic-minimal",
});

export const CARD_MESSAGE_FINISHES = Object.freeze({
    MATTE: "matte",
    SATIN: "satin",
    GLOSSY: "glossy",
    LAMINATED: "laminated",
});

export const CARD_MESSAGE_ORIENTATION = Object.freeze({
    FLAT: "flat",
    LEANING: "leaning",
    STANDING: "standing",
});

const DEFAULT_CARD_DATA = Object.freeze({
    title: "Gracias por ser parte",
    recipient: "Jurado Académico",
    message: "Tu evaluación impulsa nuestro proyecto y acompaña la presentación final de nuestro equipo.",
    footer: "KickOff Box 2026",
    career: "Ingeniería de Sistemas",
    university: "UNIFRANZ",
    teamName: "Equipo académico",
    projectName: "Proyecto final",
});

const DEFAULT_CARD_OPTIONS = Object.freeze({
    style: CARD_MESSAGE_STYLES.PREMIUM,
    finish: CARD_MESSAGE_FINISHES.SATIN,
    orientation: CARD_MESSAGE_ORIENTATION.FLAT,

    width: 1.28,
    height: 0.055,
    depth: 0.78,

    cornerRadius: 0.045,
    cornerSegments: 5,

    surfaceInset: 0.055,
    surfaceLift: 0.007,

    curveAmount: 0.018,
    curveSegments: 18,

    showBody: true,
    showSurface: true,
    showBack: true,
    showGoldBorder: true,
    showRibbon: true,
    showSeal: true,
    showShadow: true,
    showPaperLayers: true,
    showSmallClip: true,

    paperColor: "#fff7e8",
    paperBackColor: "#e8d7bd",
    textColor: "#2b2118",
    accentColor: "#c59a4a",
    secondaryAccent: "#b92d2d",
    greenAccent: "#2f7d55",

    opacity: 1,
    renderOrder: 8,
});

const STYLE_PRESETS = Object.freeze({
    [CARD_MESSAGE_STYLES.PREMIUM]: Object.freeze({
        paperColor: "#fff7e8",
        paperBackColor: "#e8d7bd",
        textColor: "#2b2118",
        accentColor: "#c59a4a",
        secondaryAccent: "#b92d2d",
        greenAccent: "#2f7d55",
        showRibbon: true,
        showSeal: true,
    }),

    [CARD_MESSAGE_STYLES.DEFENSE]: Object.freeze({
        paperColor: "#fffaf0",
        paperBackColor: "#ead9bf",
        textColor: "#24180f",
        accentColor: "#c59a4a",
        secondaryAccent: "#8b1f1f",
        greenAccent: "#2f7d55",
        showRibbon: true,
        showSeal: true,
    }),

    [CARD_MESSAGE_STYLES.JURY]: Object.freeze({
        paperColor: "#fff7e8",
        paperBackColor: "#dcc7a7",
        textColor: "#2b2118",
        accentColor: "#c59a4a",
        secondaryAccent: "#7a4f2a",
        greenAccent: "#2f7d55",
        showRibbon: false,
        showSeal: true,
    }),

    [CARD_MESSAGE_STYLES.INSTITUTIONAL]: Object.freeze({
        paperColor: "#f8f3ea",
        paperBackColor: "#dfd1bd",
        textColor: "#111827",
        accentColor: "#2f86c7",
        secondaryAccent: "#c59a4a",
        greenAccent: "#2f7d55",
        showRibbon: false,
        showSeal: true,
    }),

    [CARD_MESSAGE_STYLES.BOLIVIA_WORLD_CUP]: Object.freeze({
        paperColor: "#fff7e8",
        paperBackColor: "#e5cda9",
        textColor: "#2b2118",
        accentColor: "#f0c84b",
        secondaryAccent: "#b92d2d",
        greenAccent: "#2f7d55",
        showRibbon: true,
        showSeal: true,
    }),

    [CARD_MESSAGE_STYLES.ACADEMIC_MINIMAL]: Object.freeze({
        paperColor: "#ffffff",
        paperBackColor: "#e8e2d7",
        textColor: "#1f2937",
        accentColor: "#c59a4a",
        secondaryAccent: "#374151",
        greenAccent: "#2f7d55",
        showRibbon: false,
        showSeal: false,
    }),
});

function normalizeOptions(config = {}) {
    const source = config.cardMessage ?? config.card ?? config;
    const visual = config.visual ?? config.sceneConfig?.visual ?? {};
    const text = config.text ?? config.content?.text ?? {};
    const project = config.project ?? config.content?.project ?? {};

    const style =
        source.style ??
        visual.cardStyle ??
        CARD_MESSAGE_STYLES.PREMIUM;

    const preset = STYLE_PRESETS[style] ?? STYLE_PRESETS[CARD_MESSAGE_STYLES.PREMIUM];

    const cardData = {
        ...DEFAULT_CARD_DATA,
        title: text.cardTitle ?? source.title ?? DEFAULT_CARD_DATA.title,
        recipient:
            text.cardRecipient ??
            project.recipientName ??
            source.recipient ??
            DEFAULT_CARD_DATA.recipient,
        message:
            text.cardMessage ??
            project.message ??
            source.message ??
            DEFAULT_CARD_DATA.message,
        footer:
            text.cardFooter ??
            source.footer ??
            DEFAULT_CARD_DATA.footer,
        career:
            project.career ??
            source.career ??
            DEFAULT_CARD_DATA.career,
        university:
            project.university ??
            source.university ??
            DEFAULT_CARD_DATA.university,
        teamName:
            project.teamName ??
            source.teamName ??
            DEFAULT_CARD_DATA.teamName,
        projectName:
            project.projectName ??
            source.projectName ??
            DEFAULT_CARD_DATA.projectName,
    };

    return {
        ...DEFAULT_CARD_OPTIONS,
        ...preset,
        ...source,
        style,
        cardData,
        showRibbon: source.showRibbon ?? preset.showRibbon ?? DEFAULT_CARD_OPTIONS.showRibbon,
        showSeal: source.showSeal ?? preset.showSeal ?? DEFAULT_CARD_OPTIONS.showSeal,
        accentColor: visual.accentColor ?? source.accentColor ?? preset.accentColor,
        textColor: visual.cardTextColor ?? source.textColor ?? preset.textColor,
        paperColor: visual.cardPaperColor ?? source.paperColor ?? preset.paperColor,
        paperBackColor: source.paperBackColor ?? preset.paperBackColor,
    };
}

function createPaperMaterial(name, color, options = {}) {
    const finishSettings = {
        [CARD_MESSAGE_FINISHES.MATTE]: {
            roughness: 0.92,
            metalness: 0.0,
            clearcoat: 0,
            clearcoatRoughness: 0.7,
        },
        [CARD_MESSAGE_FINISHES.SATIN]: {
            roughness: 0.62,
            metalness: 0.01,
            clearcoat: 0.18,
            clearcoatRoughness: 0.32,
        },
        [CARD_MESSAGE_FINISHES.GLOSSY]: {
            roughness: 0.28,
            metalness: 0.02,
            clearcoat: 0.45,
            clearcoatRoughness: 0.12,
        },
        [CARD_MESSAGE_FINISHES.LAMINATED]: {
            roughness: 0.18,
            metalness: 0.015,
            clearcoat: 0.68,
            clearcoatRoughness: 0.08,
        },
    }[options.finish] ?? {};

    const material = new THREE.MeshPhysicalMaterial({
        name,
        color,
        roughness: finishSettings.roughness ?? 0.62,
        metalness: finishSettings.metalness ?? 0.01,
        clearcoat: finishSettings.clearcoat ?? 0.18,
        clearcoatRoughness: finishSettings.clearcoatRoughness ?? 0.32,
        transparent: options.opacity < 1,
        opacity: options.opacity,
        side: THREE.DoubleSide,
    });

    material.userData = {
        generatedBy: "CardMessage",
        version: CARD_MESSAGE_VERSION,
        finish: options.finish,
    };

    return material;
}

function createGoldMaterial(options = {}) {
    return new THREE.MeshStandardMaterial({
        name: "CardGoldDetailMaterial",
        color: options.accentColor,
        roughness: 0.34,
        metalness: 0.28,
        transparent: false,
    });
}

function createRibbonMaterial(color, name) {
    return new THREE.MeshStandardMaterial({
        name,
        color,
        roughness: 0.52,
        metalness: 0.04,
        side: THREE.DoubleSide,
    });
}

function createRoundedMesh({
    name,
    width,
    height,
    depth,
    radius = 0.035,
    segments = 4,
    material,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    userData = {},
}) {
    const safeRadius = Math.min(radius, width / 2, height / 2, depth / 2);

    const geometry = new RoundedBoxGeometry(
        width,
        height,
        depth,
        segments,
        safeRadius,
    );

    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(position[0], position[1], position[2]);
    mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
    mesh.userData = {
        generatedBy: "CardMessage",
        version: CARD_MESSAGE_VERSION,
        ...userData,
    };

    setMeshShadow(mesh, true, true);

    return mesh;
}

function createCurvedPlaneGeometry(width, depth, curveAmount = 0.018, segments = 18) {
    const geometry = new THREE.PlaneGeometry(width, depth, segments, 4);
    const position = geometry.attributes.position;

    for (let index = 0; index < position.count; index += 1) {
        const x = position.getX(index);
        const normalizedX = x / (width / 2);
        const lift = (1 - normalizedX * normalizedX) * curveAmount;

        position.setZ(index, lift);
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();

    return geometry;
}

function createFallbackCardTexture(options) {
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 1000;

    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, options.paperColor);
    gradient.addColorStop(0.58, "#fffdf7");
    gradient.addColorStop(1, options.paperBackColor);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawBoliviaRibbon(ctx, canvas.width, 95, options);
    drawCardBorder(ctx, canvas.width, canvas.height, options);
    drawCardSeal(ctx, canvas.width - 180, 230, 74, options);
    drawCardText(ctx, canvas.width, canvas.height, options);
    drawPaperNoise(ctx, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    texture.userData = {
        generatedBy: "CardMessageFallbackTexture",
        version: CARD_MESSAGE_VERSION,
        cardData: options.cardData,
    };

    return texture;
}

function drawBoliviaRibbon(ctx, width, height, options) {
    if (!options.showRibbon) return;

    ctx.fillStyle = options.secondaryAccent;
    ctx.fillRect(0, 0, width, height / 3);

    ctx.fillStyle = "#f0c84b";
    ctx.fillRect(0, height / 3, width, height / 3);

    ctx.fillStyle = options.greenAccent;
    ctx.fillRect(0, (height / 3) * 2, width, height / 3);
}

function drawCardBorder(ctx, width, height, options) {
    ctx.save();

    ctx.strokeStyle = "rgba(43, 33, 24, 0.22)";
    ctx.lineWidth = 22;
    roundedRectPath(ctx, 70, 140, width - 140, height - 210, 54);
    ctx.stroke();

    ctx.strokeStyle = options.accentColor;
    ctx.lineWidth = 9;
    roundedRectPath(ctx, 105, 175, width - 210, height - 280, 42);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 4;
    roundedRectPath(ctx, 130, 200, width - 260, height - 330, 34);
    ctx.stroke();

    ctx.restore();
}

function drawCardSeal(ctx, x, y, radius, options) {
    if (!options.showSeal) return;

    ctx.save();

    ctx.fillStyle = options.accentColor;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#2b2118";
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.76, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = options.accentColor;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.56, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = options.accentColor;
    ctx.font = "900 46px Arial, Helvetica, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("2026", x, y - 5);

    ctx.font = "800 16px Arial, Helvetica, sans-serif";
    ctx.fillText("KICKOFF", x, y + 38);

    ctx.restore();
}

function drawCardText(ctx, width, height, options) {
    const data = options.cardData;

    ctx.save();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = options.secondaryAccent;
    ctx.font = "900 72px Arial, Helvetica, sans-serif";
    drawMultilineText(ctx, data.title, width / 2, 275, width - 360, 78, 2);

    ctx.fillStyle = options.textColor;
    ctx.font = "900 56px Arial, Helvetica, sans-serif";
    drawMultilineText(ctx, data.recipient, width / 2, 395, width - 390, 62, 2);

    ctx.fillStyle = "rgba(43, 33, 24, 0.78)";
    ctx.font = "600 39px Arial, Helvetica, sans-serif";
    drawMultilineText(ctx, data.message, width / 2, 545, width - 420, 52, 4);

    ctx.fillStyle = options.accentColor;
    ctx.fillRect(width / 2 - 260, 745, 520, 7);

    ctx.fillStyle = options.textColor;
    ctx.font = "900 35px Arial, Helvetica, sans-serif";
    drawMultilineText(ctx, data.footer, width / 2, 820, width - 460, 44, 2);

    ctx.fillStyle = "rgba(43, 33, 24, 0.62)";
    ctx.font = "700 24px Arial, Helvetica, sans-serif";
    ctx.fillText(`${data.career} · ${data.university}`, width / 2, 900);

    ctx.restore();
}

function drawPaperNoise(ctx, width, height) {
    ctx.save();

    for (let index = 0; index < 900; index += 1) {
        const alpha = Math.random() * 0.035;
        ctx.fillStyle = `rgba(80, 55, 30, ${alpha})`;
        ctx.fillRect(
            Math.random() * width,
            Math.random() * height,
            Math.random() * 2 + 0.4,
            Math.random() * 2 + 0.4,
        );
    }

    ctx.restore();
}

function drawMultilineText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
    const words = String(text ?? "").split(/\s+/);
    const lines = [];
    let line = "";

    words.forEach((word) => {
        const test = line ? `${line} ${word}` : word;

        if (ctx.measureText(test).width > maxWidth && line) {
            lines.push(line);
            line = word;
        } else {
            line = test;
        }
    });

    if (line) lines.push(line);

    const visibleLines = lines.slice(0, maxLines);
    const startY = y - ((visibleLines.length - 1) * lineHeight) / 2;

    visibleLines.forEach((currentLine, index) => {
        const finalLine =
            index === maxLines - 1 && lines.length > maxLines
                ? `${currentLine.replace(/\.*$/, "")}...`
                : currentLine;

        ctx.fillText(finalLine, x, startY + index * lineHeight);
    });
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

function createSurfaceTexture(options, textureSet = {}) {
    if (textureSet.cardMessage?.texture) {
        return textureSet.cardMessage.texture;
    }

    try {
        return createCardMessageTexture({
            title: options.cardData.title,
            recipient: options.cardData.recipient,
            message: options.cardData.message,
            footer: options.cardData.footer,
            background: options.paperColor,
            textColor: options.textColor,
            accentColor: options.accentColor,
            secondaryColor: options.secondaryAccent,
        }).texture;
    } catch {
        return createFallbackCardTexture(options);
    }
}

function createSurfaceMaterial(options, textureSet = {}) {
    const texture = createSurfaceTexture(options, textureSet);

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    const material = createMaterialFromTexture
        ? createMaterialFromTexture(texture, {
            materialType: options.finish === CARD_MESSAGE_FINISHES.MATTE ? "standard" : "physical",
            transparent: true,
            opacity: options.opacity,
            roughness: options.finish === CARD_MESSAGE_FINISHES.GLOSSY ? 0.22 : 0.48,
            metalness: 0.01,
            clearcoat: options.finish === CARD_MESSAGE_FINISHES.LAMINATED ? 0.62 : 0.28,
            clearcoatRoughness: 0.14,
        })
        : new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: options.opacity,
            side: THREE.DoubleSide,
        });

    material.name = "CardMessageSurfaceMaterial";
    material.userData = {
        ...(material.userData ?? {}),
        generatedBy: "CardMessage",
        texture,
        cardData: options.cardData,
    };

    return material;
}

function createCardBody(options) {
    const material = createPaperMaterial(
        "CardMessageBodyMaterial",
        options.paperColor,
        options,
    );

    const body = createRoundedMesh({
        name: "CardBody",
        width: options.width,
        height: options.height,
        depth: options.depth,
        radius: options.cornerRadius,
        segments: options.cornerSegments,
        material,
        userData: {
            part: "body",
        },
    });

    body.visible = Boolean(options.showBody);

    return body;
}

function createCardBack(options) {
    const material = createPaperMaterial(
        "CardMessageBackMaterial",
        options.paperBackColor,
        {
            ...options,
            finish: CARD_MESSAGE_FINISHES.MATTE,
        },
    );

    const back = createRoundedMesh({
        name: "CardBackReinforcement",
        width: options.width * 0.96,
        height: options.height * 0.38,
        depth: options.depth * 0.94,
        radius: options.cornerRadius * 0.82,
        segments: options.cornerSegments,
        material,
        position: [0, -options.height * 0.58, 0],
        userData: {
            part: "back",
        },
    });

    back.visible = Boolean(options.showBack);

    return back;
}

function createCardSurface(options, textureSet = {}) {
    const surfaceWidth = options.width - options.surfaceInset * 2;
    const surfaceDepth = options.depth - options.surfaceInset * 2;

    const geometry = createCurvedPlaneGeometry(
        surfaceWidth,
        surfaceDepth,
        options.curveAmount,
        options.curveSegments,
    );

    const material = createSurfaceMaterial(options, textureSet);

    const surface = new THREE.Mesh(geometry, material);
    surface.name = "CardMessageSurface";
    surface.rotation.x = -Math.PI / 2;
    surface.position.y = options.height / 2 + options.surfaceLift;
    surface.renderOrder = options.renderOrder;
    surface.visible = Boolean(options.showSurface);
    surface.userData = {
        generatedBy: "CardMessage",
        part: "surface",
        editable: true,
        cardData: options.cardData,
    };

    setMeshShadow(surface, false, true);

    return surface;
}

function createGoldBorder(options) {
    const group = new THREE.Group();
    group.name = "CardGoldBorder";
    group.visible = Boolean(options.showGoldBorder);

    const material = createGoldMaterial(options);

    const borderThickness = 0.012;
    const y = options.height / 2 + options.surfaceLift + 0.008;
    const w = options.width - options.surfaceInset * 1.35;
    const d = options.depth - options.surfaceInset * 1.35;

    const top = createRoundedMesh({
        name: "CardGoldBorderTop",
        width: w,
        height: borderThickness,
        depth: borderThickness,
        radius: 0.006,
        segments: 2,
        material,
        position: [0, y, -d / 2],
        userData: { part: "gold-border" },
    });

    const bottom = createRoundedMesh({
        name: "CardGoldBorderBottom",
        width: w,
        height: borderThickness,
        depth: borderThickness,
        radius: 0.006,
        segments: 2,
        material: material.clone(),
        position: [0, y, d / 2],
        userData: { part: "gold-border" },
    });

    const left = createRoundedMesh({
        name: "CardGoldBorderLeft",
        width: borderThickness,
        height: borderThickness,
        depth: d,
        radius: 0.006,
        segments: 2,
        material: material.clone(),
        position: [-w / 2, y, 0],
        userData: { part: "gold-border" },
    });

    const right = createRoundedMesh({
        name: "CardGoldBorderRight",
        width: borderThickness,
        height: borderThickness,
        depth: d,
        radius: 0.006,
        segments: 2,
        material: material.clone(),
        position: [w / 2, y, 0],
        userData: { part: "gold-border" },
    });

    group.add(top, bottom, left, right);

    return group;
}

function createRibbon(options) {
    const group = new THREE.Group();
    group.name = "CardRibbon";
    group.visible = Boolean(options.showRibbon);

    const horizontalMaterial = createRibbonMaterial(
        options.secondaryAccent,
        "CardRibbonRedMaterial",
    );

    const verticalMaterial = createRibbonMaterial(
        options.greenAccent,
        "CardRibbonGreenMaterial",
    );

    const badgeMaterial = createGoldMaterial(options);

    const y = options.height / 2 + options.surfaceLift + 0.022;

    const horizontal = createRoundedMesh({
        name: "CardRibbonHorizontal",
        width: options.width * 0.72,
        height: 0.018,
        depth: 0.052,
        radius: 0.01,
        segments: 3,
        material: horizontalMaterial,
        position: [0, y, -options.depth * 0.31],
        userData: {
            part: "ribbon",
        },
    });

    const vertical = createRoundedMesh({
        name: "CardRibbonVertical",
        width: 0.052,
        height: 0.019,
        depth: options.depth * 0.68,
        radius: 0.01,
        segments: 3,
        material: verticalMaterial,
        position: [-options.width * 0.32, y + 0.004, 0],
        userData: {
            part: "ribbon",
        },
    });

    const badge = createRoundedMesh({
        name: "CardRibbonBadge",
        width: 0.18,
        height: 0.026,
        depth: 0.12,
        radius: 0.022,
        segments: 4,
        material: badgeMaterial,
        position: [-options.width * 0.32, y + 0.021, -options.depth * 0.31],
        userData: {
            part: "ribbon-badge",
        },
    });

    group.add(horizontal, vertical, badge);

    return group;
}

function createSeal(options) {
    const group = new THREE.Group();
    group.name = "CardPhysicalSeal";
    group.visible = Boolean(options.showSeal);

    const y = options.height / 2 + options.surfaceLift + 0.032;

    const sealMaterial = createGoldMaterial(options);
    const innerMaterial = new THREE.MeshStandardMaterial({
        name: "CardSealInnerMaterial",
        color: "#2b2118",
        roughness: 0.42,
        metalness: 0.18,
    });

    const seal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.068, 0.068, 0.018, 48),
        sealMaterial,
    );
    seal.name = "CardGoldSeal";
    seal.rotation.x = Math.PI / 2;
    seal.position.set(options.width * 0.36, y, -options.depth * 0.28);

    const inner = new THREE.Mesh(
        new THREE.CylinderGeometry(0.046, 0.046, 0.02, 48),
        innerMaterial,
    );
    inner.name = "CardGoldSealInner";
    inner.rotation.x = Math.PI / 2;
    inner.position.copy(seal.position);
    inner.position.y += 0.002;

    group.add(seal, inner);
    setGroupShadow(group, true, true);

    return group;
}

function createPaperLayers(options) {
    const group = new THREE.Group();
    group.name = "CardPaperLayers";
    group.visible = Boolean(options.showPaperLayers);

    const layerColors = [
        options.paperBackColor,
        "#f5e5ca",
        options.paperColor,
    ];

    layerColors.forEach((color, index) => {
        const material = createPaperMaterial(
            `CardPaperLayerMaterial_${index + 1}`,
            color,
            {
                ...options,
                finish: CARD_MESSAGE_FINISHES.MATTE,
            },
        );

        const layer = createRoundedMesh({
            name: `CardPaperLayer_${index + 1}`,
            width: options.width * (0.985 - index * 0.01),
            height: 0.006,
            depth: options.depth * (0.985 - index * 0.01),
            radius: options.cornerRadius * 0.86,
            segments: 3,
            material,
            position: [0, -options.height * 0.5 - index * 0.009, 0],
            userData: {
                part: "paper-layer",
                layerIndex: index,
            },
        });

        group.add(layer);
    });

    return group;
}

function createSmallClip(options) {
    const group = new THREE.Group();
    group.name = "CardSmallClip";
    group.visible = Boolean(options.showSmallClip);

    const material = createGoldMaterial(options);

    const clip = createRoundedMesh({
        name: "CardCornerClip",
        width: 0.19,
        height: 0.022,
        depth: 0.055,
        radius: 0.013,
        segments: 3,
        material,
        position: [-options.width * 0.37, options.height / 2 + 0.045, -options.depth * 0.38],
        rotation: [0, 0.24, 0],
        userData: {
            part: "small-clip",
        },
    });

    group.add(clip);

    return group;
}

function createSoftShadow(options) {
    const group = new THREE.Group();
    group.name = "CardSoftShadow";
    group.visible = Boolean(options.showShadow);

    const geometry = new THREE.PlaneGeometry(options.width * 0.94, options.depth * 0.88, 1, 1);
    const material = new THREE.MeshBasicMaterial({
        name: "CardSoftShadowMaterial",
        color: "#000000",
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
        side: THREE.DoubleSide,
    });

    const shadow = new THREE.Mesh(geometry, material);
    shadow.name = "CardContactShadow";
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -options.height * 0.72;
    shadow.renderOrder = -1;

    group.add(shadow);

    return group;
}

function applyCardOrientation(group, options) {
    if (options.orientation === CARD_MESSAGE_ORIENTATION.LEANING) {
        group.rotation.x += -0.16;
        group.position.y += 0.07;
    }

    if (options.orientation === CARD_MESSAGE_ORIENTATION.STANDING) {
        group.rotation.x += -Math.PI / 2.85;
        group.position.y += 0.34;
        group.position.z -= 0.12;
    }
}

function applyConfigTransform(group, config = {}) {
    const layout =
        config.layout ??
        config.transform ??
        config.contentLayout?.card ??
        {};

    applyTransform(group, {
        position: layout.position ?? [-0.72, 0.33, -0.38],
        rotation: layout.rotation ?? [0, 0, 0],
        scale: layout.scale ?? [1, 1, 1],
    });
}

function createMetadata(options) {
    return {
        objectType: "CardMessage",
        version: CARD_MESSAGE_VERSION,
        style: options.style,
        finish: options.finish,
        orientation: options.orientation,
        dimensions: {
            width: options.width,
            height: options.height,
            depth: options.depth,
        },
        editable: true,
        exportable: true,
        cardData: options.cardData,
        purpose: "physical-personalized-thank-you-card",
        createdAt: new Date().toISOString(),
    };
}

export function createCardMessage(config = {}, materials = {}, textureSet = {}) {
    const options = normalizeOptions(config);

    const group = new THREE.Group();
    group.name = "KickOffBoxCardMessage";
    group.userData = createMetadata(options);

    const body = createCardBody(options);
    const back = createCardBack(options);
    const paperLayers = createPaperLayers(options);
    const surface = createCardSurface(options, textureSet);
    const goldBorder = createGoldBorder(options);
    const ribbon = createRibbon(options);
    const seal = createSeal(options);
    const clip = createSmallClip(options);
    const shadow = createSoftShadow(options);

    group.add(
        shadow,
        paperLayers,
        back,
        body,
        surface,
        goldBorder,
        ribbon,
        seal,
        clip,
    );

    group.userData.parts = {
        body: body.name,
        back: back.name,
        paperLayers: paperLayers.name,
        surface: surface.name,
        goldBorder: goldBorder.name,
        ribbon: ribbon.name,
        seal: seal.name,
        clip: clip.name,
        shadow: shadow.name,
    };

    applyConfigTransform(group, config);
    applyCardOrientation(group, options);

    setGroupShadow(group, true, true);

    return group;
}

export function createMessageCard(config = {}, materials = {}, textureSet = {}) {
    return createCardMessage(config, materials, textureSet);
}

export function updateCardMessage(cardGroup, nextData = {}, textureSet = {}) {
    if (!cardGroup) return null;

    const surface = cardGroup.getObjectByName("CardMessageSurface");

    if (!surface?.material) return null;

    const previousData = cardGroup.userData?.cardData ?? DEFAULT_CARD_DATA;
    const updatedData = {
        ...previousData,
        ...nextData,
    };

    const options = normalizeOptions({
        ...cardGroup.userData,
        cardData: updatedData,
        title: updatedData.title,
        recipient: updatedData.recipient,
        message: updatedData.message,
        footer: updatedData.footer,
    });

    const previousMaterial = surface.material;
    const nextMaterial = createSurfaceMaterial(options, textureSet);

    surface.material = nextMaterial;
    surface.userData.cardData = updatedData;

    disposeMaterial(previousMaterial);

    cardGroup.userData = {
        ...cardGroup.userData,
        cardData: updatedData,
        updatedAt: new Date().toISOString(),
    };

    return cardGroup;
}

export function setCardMessageVisibility(cardGroup, visible = true) {
    if (!cardGroup) return;

    cardGroup.visible = Boolean(visible);
    cardGroup.userData.visible = Boolean(visible);
    cardGroup.userData.updatedAt = new Date().toISOString();
}

export function setCardRibbonVisibility(cardGroup, visible = true) {
    const ribbon = cardGroup?.getObjectByName("CardRibbon");

    if (!ribbon) return;

    ribbon.visible = Boolean(visible);
}

export function setCardSealVisibility(cardGroup, visible = true) {
    const seal = cardGroup?.getObjectByName("CardPhysicalSeal");

    if (!seal) return;

    seal.visible = Boolean(visible);
}

export function setCardFinish(cardGroup, finish = CARD_MESSAGE_FINISHES.SATIN) {
    if (!cardGroup) return;

    cardGroup.userData.finish = finish;
    cardGroup.userData.updatedAt = new Date().toISOString();

    cardGroup.traverse((object) => {
        if (!object.material) return;

        const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

        materials.forEach((material) => {
            if ("roughness" in material) {
                material.roughness =
                    finish === CARD_MESSAGE_FINISHES.GLOSSY
                        ? 0.24
                        : finish === CARD_MESSAGE_FINISHES.MATTE
                            ? 0.9
                            : 0.54;
            }

            if ("clearcoat" in material) {
                material.clearcoat =
                    finish === CARD_MESSAGE_FINISHES.LAMINATED
                        ? 0.64
                        : finish === CARD_MESSAGE_FINISHES.GLOSSY
                            ? 0.42
                            : 0.18;
            }

            material.needsUpdate = true;
        });
    });
}

export function getCardMessageData(cardGroup) {
    return cardGroup?.userData?.cardData ?? null;
}

export function getCardMessageParts(cardGroup) {
    if (!cardGroup) return {};

    return {
        body: cardGroup.getObjectByName("CardBody"),
        back: cardGroup.getObjectByName("CardBackReinforcement"),
        paperLayers: cardGroup.getObjectByName("CardPaperLayers"),
        surface: cardGroup.getObjectByName("CardMessageSurface"),
        goldBorder: cardGroup.getObjectByName("CardGoldBorder"),
        ribbon: cardGroup.getObjectByName("CardRibbon"),
        seal: cardGroup.getObjectByName("CardPhysicalSeal"),
        clip: cardGroup.getObjectByName("CardSmallClip"),
        shadow: cardGroup.getObjectByName("CardSoftShadow"),
    };
}

export function updateCardMessageAnimation(cardGroup, elapsedTime = 0) {
    if (!cardGroup) return;

    const surface = cardGroup.getObjectByName("CardMessageSurface");
    const seal = cardGroup.getObjectByName("CardPhysicalSeal");
    const clip = cardGroup.getObjectByName("CardSmallClip");

    if (surface) {
        surface.position.y += Math.sin(elapsedTime * 0.55) * 0.00018;
    }

    if (seal) {
        seal.rotation.y = Math.sin(elapsedTime * 0.22) * 0.015;
    }

    if (clip) {
        clip.rotation.z = Math.sin(elapsedTime * 0.35) * 0.006;
    }
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

export function disposeCardMessage(cardGroup) {
    if (!cardGroup) return;

    cardGroup.traverse((object) => {
        if (object.geometry?.dispose) {
            object.geometry.dispose();
        }

        if (object.material) {
            disposeMaterial(object.material);
        }
    });

    cardGroup.removeFromParent();
}

export const CardMessage = Object.freeze({
    version: CARD_MESSAGE_VERSION,
    styles: CARD_MESSAGE_STYLES,
    finishes: CARD_MESSAGE_FINISHES,
    orientation: CARD_MESSAGE_ORIENTATION,

    createCardMessage,
    createMessageCard,
    updateCardMessage,
    updateCardMessageAnimation,

    setCardMessageVisibility,
    setCardRibbonVisibility,
    setCardSealVisibility,
    setCardFinish,

    getCardMessageData,
    getCardMessageParts,
    disposeCardMessage,
});
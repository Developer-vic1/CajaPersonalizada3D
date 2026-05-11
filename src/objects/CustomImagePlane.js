import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import {
    applyTransform,
    setGroupShadow,
    setMeshShadow,
} from "../utils/dimensions.js";

export const CUSTOM_IMAGE_PLANE_VERSION = "2.0.0";

export const CUSTOM_IMAGE_TARGETS = Object.freeze({
    LID: "lid",
    FRONT: "front",
    CARD: "card",
    INTERIOR: "interior",
    PHOTO_SLOT: "photo-slot",
    FREE: "free",
});

export const CUSTOM_IMAGE_FIT = Object.freeze({
    COVER: "cover",
    CONTAIN: "contain",
    STRETCH: "stretch",
    TILE: "tile",
});

export const CUSTOM_IMAGE_STYLES = Object.freeze({
    PHOTO: "photo",
    STICKER: "sticker",
    POSTER: "poster",
    POLAROID: "polaroid",
    LABEL: "label",
    WATERMARK: "watermark",
    PREMIUM_FRAME: "premium-frame",
});

export const CUSTOM_IMAGE_FINISHES = Object.freeze({
    MATTE: "matte",
    SATIN: "satin",
    GLOSSY: "glossy",
    LAMINATED: "laminated",
});

const DEFAULT_IMAGE_OPTIONS = Object.freeze({
    target: CUSTOM_IMAGE_TARGETS.LID,
    style: CUSTOM_IMAGE_STYLES.PREMIUM_FRAME,
    fit: CUSTOM_IMAGE_FIT.COVER,
    finish: CUSTOM_IMAGE_FINISHES.SATIN,

    imageUrl: null,
    imageFile: null,
    imageBitmap: null,
    imageElement: null,

    title: "Imagen personalizada",
    subtitle: "Diseño editable",
    footer: "KickOff Box 2026",

    width: 1.38,
    height: 0.86,
    depth: 0.038,

    canvasWidth: 1600,
    canvasHeight: 1000,

    cornerRadius: 0.045,
    cornerSegments: 6,

    frameThickness: 0.035,
    borderInset: 0.035,
    surfaceLift: 0.006,

    cropX: 0.5,
    cropY: 0.5,
    zoom: 1,
    rotation2D: 0,

    backgroundColor: "#fff7e8",
    frameColor: "#c59a4a",
    backingColor: "#2b2118",
    textColor: "#2b2118",
    accentColor: "#c59a4a",
    secondaryAccent: "#b92d2d",
    greenAccent: "#2f7d55",

    opacity: 1,

    showBacking: true,
    showSurface: true,
    showFrame: true,
    showInnerBorder: true,
    showCaption: true,
    showGloss: true,
    showShadow: true,
    showMountPads: true,
    showFallbackPattern: true,

    renderOrder: 11,
    minScale: 0.18,
    maxScale: 2.2,
});

const STYLE_PRESETS = Object.freeze({
    [CUSTOM_IMAGE_STYLES.PHOTO]: Object.freeze({
        width: 1.2,
        height: 0.82,
        depth: 0.028,
        frameThickness: 0.022,
        showCaption: false,
        showFrame: true,
        showGloss: true,
        backgroundColor: "#ffffff",
        backingColor: "#f2eadc",
    }),

    [CUSTOM_IMAGE_STYLES.STICKER]: Object.freeze({
        width: 1.0,
        height: 0.72,
        depth: 0.018,
        frameThickness: 0.018,
        showCaption: false,
        showFrame: true,
        showGloss: true,
        backgroundColor: "#fffdf8",
        backingColor: "#ffffff",
    }),

    [CUSTOM_IMAGE_STYLES.POSTER]: Object.freeze({
        width: 1.52,
        height: 0.92,
        depth: 0.03,
        frameThickness: 0.028,
        showCaption: true,
        showFrame: true,
        showGloss: true,
        backgroundColor: "#111111",
        backingColor: "#111111",
        textColor: "#fff7e8",
    }),

    [CUSTOM_IMAGE_STYLES.POLAROID]: Object.freeze({
        width: 1.08,
        height: 1.2,
        depth: 0.032,
        frameThickness: 0.045,
        showCaption: true,
        showFrame: false,
        showGloss: true,
        backgroundColor: "#fffdf8",
        backingColor: "#f1e8d8",
    }),

    [CUSTOM_IMAGE_STYLES.LABEL]: Object.freeze({
        width: 1.52,
        height: 0.58,
        depth: 0.018,
        frameThickness: 0.02,
        showCaption: true,
        showFrame: true,
        showGloss: false,
        backgroundColor: "#fff7e8",
        backingColor: "#f3e0c5",
    }),

    [CUSTOM_IMAGE_STYLES.WATERMARK]: Object.freeze({
        width: 1.0,
        height: 1.0,
        depth: 0.01,
        frameThickness: 0,
        showBacking: false,
        showFrame: false,
        showInnerBorder: false,
        showCaption: false,
        showGloss: false,
        showShadow: false,
        opacity: 0.36,
    }),

    [CUSTOM_IMAGE_STYLES.PREMIUM_FRAME]: Object.freeze({
        width: 1.38,
        height: 0.86,
        depth: 0.038,
        frameThickness: 0.035,
        showCaption: true,
        showFrame: true,
        showGloss: true,
        backgroundColor: "#fff7e8",
        backingColor: "#2b2118",
    }),
});

const TARGET_TRANSFORMS = Object.freeze({
    [CUSTOM_IMAGE_TARGETS.LID]: Object.freeze({
        position: [0, 1.18, -0.68],
        rotation: [-Math.PI / 2.9, 0, 0],
        scale: [1, 1, 1],
    }),

    [CUSTOM_IMAGE_TARGETS.FRONT]: Object.freeze({
        position: [0, 0.48, 0.98],
        rotation: [0, 0, 0],
        scale: [0.85, 0.85, 0.85],
    }),

    [CUSTOM_IMAGE_TARGETS.CARD]: Object.freeze({
        position: [-0.72, 0.38, -0.38],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [0.48, 0.48, 0.48],
    }),

    [CUSTOM_IMAGE_TARGETS.INTERIOR]: Object.freeze({
        position: [0, 0.39, -0.48],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [0.72, 0.72, 0.72],
    }),

    [CUSTOM_IMAGE_TARGETS.PHOTO_SLOT]: Object.freeze({
        position: [-0.72, 0.36, -0.36],
        rotation: [-Math.PI / 2, 0, -0.03],
        scale: [0.62, 0.62, 0.62],
    }),

    [CUSTOM_IMAGE_TARGETS.FREE]: Object.freeze({
        position: [0, 0.5, 0],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [1, 1, 1],
    }),
});

const textureLoader = new THREE.TextureLoader();
const imageTextureCache = new Map();

function normalizeOptions(config = {}, extraOptions = {}) {
    const source =
        config.customImagePlane ??
        config.customImage ??
        config.imagePlane ??
        config;

    const visual = config.visual ?? config.sceneConfig?.visual ?? {};
    const content = config.content ?? {};
    const project = config.project ?? content.project ?? {};

    const style =
        source.style ??
        visual.customImageStyle ??
        DEFAULT_IMAGE_OPTIONS.style;

    const preset =
        STYLE_PRESETS[style] ??
        STYLE_PRESETS[CUSTOM_IMAGE_STYLES.PREMIUM_FRAME];

    return {
        ...DEFAULT_IMAGE_OPTIONS,
        ...preset,
        ...source,
        ...extraOptions,

        style,

        title:
            source.title ??
            content.imageTitle ??
            project.projectName ??
            DEFAULT_IMAGE_OPTIONS.title,

        subtitle:
            source.subtitle ??
            content.imageSubtitle ??
            DEFAULT_IMAGE_OPTIONS.subtitle,

        footer:
            source.footer ??
            content.imageFooter ??
            DEFAULT_IMAGE_OPTIONS.footer,

        accentColor:
            visual.accentColor ??
            source.accentColor ??
            DEFAULT_IMAGE_OPTIONS.accentColor,

        frameColor:
            source.frameColor ??
            visual.frameColor ??
            visual.accentColor ??
            DEFAULT_IMAGE_OPTIONS.frameColor,

        backgroundColor:
            source.backgroundColor ??
            visual.customImageBackground ??
            preset.backgroundColor ??
            DEFAULT_IMAGE_OPTIONS.backgroundColor,
    };
}

function setTextureQuality(texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;

    return texture;
}

function clamp(value, min, max) {
    return Math.min(Math.max(Number(value) || 0, min), max);
}

function safeNumber(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function createFinishSettings(finish) {
    if (finish === CUSTOM_IMAGE_FINISHES.MATTE) {
        return {
            roughness: 0.9,
            metalness: 0.01,
            clearcoat: 0,
            clearcoatRoughness: 0.72,
        };
    }

    if (finish === CUSTOM_IMAGE_FINISHES.GLOSSY) {
        return {
            roughness: 0.22,
            metalness: 0.02,
            clearcoat: 0.56,
            clearcoatRoughness: 0.1,
        };
    }

    if (finish === CUSTOM_IMAGE_FINISHES.LAMINATED) {
        return {
            roughness: 0.18,
            metalness: 0.015,
            clearcoat: 0.72,
            clearcoatRoughness: 0.06,
        };
    }

    return {
        roughness: 0.56,
        metalness: 0.01,
        clearcoat: 0.24,
        clearcoatRoughness: 0.28,
    };
}

function createPhysicalMaterial(name, color, options = {}) {
    const finish = createFinishSettings(options.finish);

    return new THREE.MeshPhysicalMaterial({
        name,
        color,
        roughness: finish.roughness,
        metalness: finish.metalness,
        clearcoat: finish.clearcoat,
        clearcoatRoughness: finish.clearcoatRoughness,
        transparent: options.opacity < 1,
        opacity: options.opacity,
        side: THREE.DoubleSide,
    });
}

function createFrameMaterial(options) {
    return new THREE.MeshStandardMaterial({
        name: "CustomImageFrameMaterial",
        color: options.frameColor,
        roughness: 0.32,
        metalness: options.finish === CUSTOM_IMAGE_FINISHES.GLOSSY ? 0.18 : 0.28,
    });
}

function createGlossMaterial(options) {
    return new THREE.MeshBasicMaterial({
        name: "CustomImageGlossMaterial",
        color: "#ffffff",
        transparent: true,
        opacity: options.finish === CUSTOM_IMAGE_FINISHES.MATTE ? 0.05 : 0.16,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });
}

function createRoundedMesh({
    name,
    width,
    height,
    depth,
    radius = 0.035,
    segments = 5,
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
        generatedBy: "CustomImagePlane",
        version: CUSTOM_IMAGE_PLANE_VERSION,
        ...userData,
    };

    setMeshShadow(mesh, true, true);

    return mesh;
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

function hexToRgba(hex, alpha = 1) {
    const value = String(hex).replace("#", "");
    const normalized = value.length === 3
        ? value.split("").map((char) => char + char).join("")
        : value;

    const numeric = Number.parseInt(normalized, 16);

    if (Number.isNaN(numeric)) {
        return `rgba(197,154,74,${alpha})`;
    }

    const r = (numeric >> 16) & 255;
    const g = (numeric >> 8) & 255;
    const b = numeric & 255;

    return `rgba(${r},${g},${b},${alpha})`;
}

function drawMultilineText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 2) {
    const words = String(text ?? "").split(/\s+/);
    const lines = [];
    let line = "";

    words.forEach((word) => {
        const next = line ? `${line} ${word}` : word;

        if (ctx.measureText(next).width > maxWidth && line) {
            lines.push(line);
            line = word;
        } else {
            line = next;
        }
    });

    if (line) lines.push(line);

    const visibleLines = lines.slice(0, maxLines);
    const startY = y - ((visibleLines.length - 1) * lineHeight) / 2;

    visibleLines.forEach((currentLine, index) => {
        const finalText =
            index === maxLines - 1 && lines.length > maxLines
                ? `${currentLine.replace(/\.*$/, "")}...`
                : currentLine;

        ctx.fillText(finalText, x, startY + index * lineHeight);
    });
}

function drawTechPattern(ctx, width, height, options) {
    ctx.save();

    ctx.strokeStyle = hexToRgba(options.accentColor, 0.18);
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const marks = [
        [[80, 80], [180, 80], [240, 140]],
        [[width - 80, 80], [width - 180, 80], [width - 240, 140]],
        [[80, height - 80], [180, height - 80], [240, height - 140]],
        [[width - 80, height - 80], [width - 180, height - 80], [width - 240, height - 140]],
    ];

    marks.forEach((points) => {
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);

        for (let index = 1; index < points.length; index += 1) {
            ctx.lineTo(points[index][0], points[index][1]);
        }

        ctx.stroke();
    });

    ctx.fillStyle = hexToRgba(options.accentColor, 0.55);

    marks.flat().forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.restore();
}

function drawBoliviaAccent(ctx, width, height, options) {
    const bandHeight = Math.max(18, height * 0.035);

    ctx.save();

    ctx.fillStyle = options.secondaryAccent;
    ctx.fillRect(0, 0, width, bandHeight);

    ctx.fillStyle = "#f0c84b";
    ctx.fillRect(0, bandHeight, width, bandHeight);

    ctx.fillStyle = options.greenAccent;
    ctx.fillRect(0, bandHeight * 2, width, bandHeight);

    ctx.restore();
}

function drawFallbackArtwork(ctx, width, height, options) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, options.backgroundColor);
    gradient.addColorStop(0.45, "#fffdf8");
    gradient.addColorStop(1, "#ecd2a8");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    drawBoliviaAccent(ctx, width, height, options);
    drawTechPattern(ctx, width, height, options);

    const centerX = width / 2;
    const centerY = height / 2 - height * 0.06;
    const radius = Math.min(width, height) * 0.22;

    ctx.fillStyle = hexToRgba(options.frameColor, 0.16);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = options.frameColor;
    ctx.lineWidth = Math.max(8, width * 0.008);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = options.textColor;
    ctx.font = `900 ${Math.floor(height * 0.12)}px Arial, Helvetica, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("IMG", centerX, centerY - height * 0.015);

    ctx.fillStyle = options.frameColor;
    ctx.font = `800 ${Math.floor(height * 0.04)}px Arial, Helvetica, sans-serif`;
    ctx.fillText("PERSONALIZABLE", centerX, centerY + height * 0.09);
}

function drawCaption(ctx, width, height, options) {
    if (!options.showCaption) return;

    const captionHeight = options.style === CUSTOM_IMAGE_STYLES.POLAROID
        ? height * 0.22
        : height * 0.16;

    const captionY = height - captionHeight;

    ctx.save();

    const captionGradient = ctx.createLinearGradient(0, captionY, 0, height);
    captionGradient.addColorStop(0, hexToRgba(options.backgroundColor, 0.88));
    captionGradient.addColorStop(1, hexToRgba("#ffffff", 0.96));

    ctx.fillStyle = captionGradient;
    ctx.fillRect(0, captionY, width, captionHeight);

    ctx.strokeStyle = hexToRgba(options.frameColor, 0.46);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width * 0.12, captionY + 4);
    ctx.lineTo(width * 0.88, captionY + 4);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = options.textColor;
    ctx.font = `900 ${Math.floor(height * 0.045)}px Arial, Helvetica, sans-serif`;
    drawMultilineText(ctx, options.title, width / 2, captionY + captionHeight * 0.38, width * 0.78, height * 0.052, 1);

    ctx.fillStyle = hexToRgba(options.textColor, 0.66);
    ctx.font = `700 ${Math.floor(height * 0.026)}px Arial, Helvetica, sans-serif`;
    drawMultilineText(ctx, options.subtitle, width / 2, captionY + captionHeight * 0.66, width * 0.76, height * 0.032, 1);

    ctx.fillStyle = options.frameColor;
    ctx.font = `800 ${Math.floor(height * 0.022)}px Arial, Helvetica, sans-serif`;
    drawMultilineText(ctx, options.footer, width / 2, captionY + captionHeight * 0.84, width * 0.7, height * 0.028, 1);

    ctx.restore();
}

function drawInnerBorder(ctx, width, height, options) {
    if (!options.showInnerBorder) return;

    const inset = width * 0.035;

    ctx.save();

    ctx.strokeStyle = hexToRgba(options.frameColor, 0.72);
    ctx.lineWidth = Math.max(6, width * 0.006);
    roundedRectPath(ctx, inset, inset, width - inset * 2, height - inset * 2, width * 0.035);
    ctx.stroke();

    ctx.strokeStyle = hexToRgba("#ffffff", 0.42);
    ctx.lineWidth = Math.max(2, width * 0.002);
    roundedRectPath(ctx, inset * 1.7, inset * 1.7, width - inset * 3.4, height - inset * 3.4, width * 0.025);
    ctx.stroke();

    ctx.restore();
}

function drawPaperNoise(ctx, width, height, dark = false) {
    ctx.save();

    for (let index = 0; index < 550; index += 1) {
        const alpha = Math.random() * 0.025;
        ctx.fillStyle = dark
            ? `rgba(255,247,232,${alpha})`
            : `rgba(80,55,30,${alpha})`;

        ctx.fillRect(
            Math.random() * width,
            Math.random() * height,
            Math.random() * 2 + 0.3,
            Math.random() * 2 + 0.3,
        );
    }

    ctx.restore();
}

function getImageSize(image) {
    if (!image) return null;

    const width =
        image.naturalWidth ??
        image.videoWidth ??
        image.width ??
        image.bitmapWidth ??
        0;

    const height =
        image.naturalHeight ??
        image.videoHeight ??
        image.height ??
        image.bitmapHeight ??
        0;

    if (!width || !height) return null;

    return { width, height };
}

function calculateImageDrawRect(image, canvasWidth, canvasHeight, options) {
    const imageSize = getImageSize(image);

    if (!imageSize) {
        return null;
    }

    const imageRatio = imageSize.width / imageSize.height;
    const canvasRatio = canvasWidth / canvasHeight;

    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = imageSize.width;
    let sourceHeight = imageSize.height;

    const zoom = clamp(options.zoom, 0.15, 5);

    if (options.fit === CUSTOM_IMAGE_FIT.COVER) {
        if (imageRatio > canvasRatio) {
            sourceHeight = imageSize.height / zoom;
            sourceWidth = sourceHeight * canvasRatio;
        } else {
            sourceWidth = imageSize.width / zoom;
            sourceHeight = sourceWidth / canvasRatio;
        }

        sourceX = (imageSize.width - sourceWidth) * clamp(options.cropX, 0, 1);
        sourceY = (imageSize.height - sourceHeight) * clamp(options.cropY, 0, 1);

        return {
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            destX: 0,
            destY: 0,
            destWidth: canvasWidth,
            destHeight: canvasHeight,
        };
    }

    if (options.fit === CUSTOM_IMAGE_FIT.CONTAIN) {
        let destWidth = canvasWidth;
        let destHeight = canvasWidth / imageRatio;

        if (destHeight > canvasHeight) {
            destHeight = canvasHeight;
            destWidth = canvasHeight * imageRatio;
        }

        destWidth *= zoom;
        destHeight *= zoom;

        return {
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            destX: (canvasWidth - destWidth) * clamp(options.cropX, 0, 1),
            destY: (canvasHeight - destHeight) * clamp(options.cropY, 0, 1),
            destWidth,
            destHeight,
        };
    }

    if (options.fit === CUSTOM_IMAGE_FIT.TILE) {
        return {
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            destX: 0,
            destY: 0,
            destWidth: canvasWidth / Math.max(zoom, 0.2),
            destHeight: (canvasWidth / Math.max(zoom, 0.2)) / imageRatio,
            tile: true,
        };
    }

    return {
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        destX: 0,
        destY: 0,
        destWidth: canvasWidth,
        destHeight: canvasHeight,
    };
}

function drawImageToCanvas(ctx, image, width, height, options) {
    const rect = calculateImageDrawRect(image, width, height, options);

    if (!rect) {
        drawFallbackArtwork(ctx, width, height, options);
        return false;
    }

    ctx.save();

    if (options.rotation2D) {
        ctx.translate(width / 2, height / 2);
        ctx.rotate(options.rotation2D);
        ctx.translate(-width / 2, -height / 2);
    }

    if (rect.tile) {
        const patternCanvas = document.createElement("canvas");
        patternCanvas.width = Math.max(32, Math.round(rect.destWidth));
        patternCanvas.height = Math.max(32, Math.round(rect.destHeight));

        const patternCtx = patternCanvas.getContext("2d");

        patternCtx.drawImage(
            image,
            rect.sourceX,
            rect.sourceY,
            rect.sourceWidth,
            rect.sourceHeight,
            0,
            0,
            patternCanvas.width,
            patternCanvas.height,
        );

        const pattern = ctx.createPattern(patternCanvas, "repeat");

        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width, height);
    } else {
        ctx.drawImage(
            image,
            rect.sourceX,
            rect.sourceY,
            rect.sourceWidth,
            rect.sourceHeight,
            rect.destX,
            rect.destY,
            rect.destWidth,
            rect.destHeight,
        );
    }

    ctx.restore();

    return true;
}

function createCompositedImageTexture(image, options = {}) {
    const canvas = document.createElement("canvas");
    canvas.width = options.canvasWidth;
    canvas.height = options.canvasHeight;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const hasImage = image && drawImageToCanvas(ctx, image, canvas.width, canvas.height, options);

    if (!hasImage && options.showFallbackPattern) {
        drawFallbackArtwork(ctx, canvas.width, canvas.height, options);
    }

    drawInnerBorder(ctx, canvas.width, canvas.height, options);
    drawCaption(ctx, canvas.width, canvas.height, options);
    drawPaperNoise(
        ctx,
        canvas.width,
        canvas.height,
        options.style === CUSTOM_IMAGE_STYLES.POSTER,
    );

    const texture = new THREE.CanvasTexture(canvas);
    setTextureQuality(texture);

    texture.userData = {
        generatedBy: "CustomImagePlane",
        version: CUSTOM_IMAGE_PLANE_VERSION,
        hasImage: Boolean(hasImage),
        fit: options.fit,
        style: options.style,
        createdAt: new Date().toISOString(),
    };

    return {
        canvas,
        texture,
        hasImage: Boolean(hasImage),
    };
}

function loadImageElement(url) {
    if (!url) return Promise.resolve(null);

    const cacheKey = String(url);

    if (imageTextureCache.has(cacheKey)) {
        return Promise.resolve(imageTextureCache.get(cacheKey));
    }

    return new Promise((resolve) => {
        const image = new Image();

        image.crossOrigin = "anonymous";
        image.decoding = "async";

        image.onload = () => {
            imageTextureCache.set(cacheKey, image);
            resolve(image);
        };

        image.onerror = () => {
            resolve(null);
        };

        image.src = url;
    });
}

function resolveInitialImage(options) {
    if (options.imageBitmap) return options.imageBitmap;
    if (options.imageElement) return options.imageElement;
    if (options.imageFile) return options.imageFile;

    return null;
}

function createSurfaceMaterial(options, textureSet = {}) {
    const directImage = resolveInitialImage(options);
    const texture =
        textureSet.customImage?.texture ??
        createCompositedImageTexture(directImage, options).texture;

    const material = new THREE.MeshBasicMaterial({
        name: "CustomImagePlaneSurfaceMaterial",
        map: texture,
        transparent: true,
        opacity: options.opacity,
        side: THREE.DoubleSide,
    });

    material.userData = {
        generatedBy: "CustomImagePlane",
        texture,
        options,
    };

    return material;
}

function createBacking(options) {
    const backing = createRoundedMesh({
        name: "CustomImageBacking",
        width: options.width,
        height: options.depth,
        depth: options.height,
        radius: options.cornerRadius,
        segments: options.cornerSegments,
        material: createPhysicalMaterial(
            "CustomImageBackingMaterial",
            options.backingColor,
            options,
        ),
        rotation: [Math.PI / 2, 0, 0],
        position: [0, -options.depth * 0.5, 0],
        userData: {
            part: "backing",
        },
    });

    backing.visible = Boolean(options.showBacking);

    return backing;
}

function createSurface(options, textureSet = {}) {
    const surface = new THREE.Mesh(
        new THREE.PlaneGeometry(options.width * 0.94, options.height * 0.91, 8, 5),
        createSurfaceMaterial(options, textureSet),
    );

    surface.name = "CustomImageSurface";
    surface.rotation.x = -Math.PI / 2;
    surface.position.y = options.depth / 2 + options.surfaceLift;
    surface.renderOrder = options.renderOrder;
    surface.visible = Boolean(options.showSurface);
    surface.userData = {
        generatedBy: "CustomImagePlane",
        part: "surface",
        editable: true,
        fit: options.fit,
        style: options.style,
    };

    setMeshShadow(surface, false, true);

    return surface;
}

function createFrame(options) {
    const group = new THREE.Group();
    group.name = "CustomImageFrame";
    group.visible = Boolean(options.showFrame);

    const material = createFrameMaterial(options);
    const y = options.depth / 2 + options.surfaceLift + 0.018;
    const t = Math.max(0.008, options.frameThickness);
    const w = options.width;
    const h = options.height;

    const pieces = [
        {
            name: "CustomImageFrameTop",
            size: [w, t, t],
            position: [0, y, -h / 2],
        },
        {
            name: "CustomImageFrameBottom",
            size: [w, t, t],
            position: [0, y, h / 2],
        },
        {
            name: "CustomImageFrameLeft",
            size: [t, t, h],
            position: [-w / 2, y, 0],
        },
        {
            name: "CustomImageFrameRight",
            size: [t, t, h],
            position: [w / 2, y, 0],
        },
    ];

    pieces.forEach((piece) => {
        group.add(createRoundedMesh({
            name: piece.name,
            width: piece.size[0],
            height: piece.size[1],
            depth: piece.size[2],
            radius: Math.min(0.006, t / 2),
            segments: 2,
            material: material.clone(),
            position: piece.position,
            userData: {
                part: "frame",
            },
        }));
    });

    return group;
}

function createPolaroidFooter(options) {
    const group = new THREE.Group();
    group.name = "CustomImagePolaroidFooter";
    group.visible = options.style === CUSTOM_IMAGE_STYLES.POLAROID;

    const material = createPhysicalMaterial(
        "CustomImagePolaroidFooterMaterial",
        options.backgroundColor,
        {
            ...options,
            finish: CUSTOM_IMAGE_FINISHES.MATTE,
        },
    );

    const footer = createRoundedMesh({
        name: "PolaroidFooterBlock",
        width: options.width * 0.92,
        height: 0.014,
        depth: options.height * 0.2,
        radius: 0.018,
        segments: 3,
        material,
        position: [0, options.depth / 2 + 0.01, options.height * 0.34],
        userData: {
            part: "polaroid-footer",
        },
    });

    group.add(footer);

    return group;
}

function createGlossOverlay(options) {
    const group = new THREE.Group();
    group.name = "CustomImageGlossOverlay";
    group.visible = Boolean(options.showGloss);

    const material = createGlossMaterial(options);

    const main = new THREE.Mesh(
        new THREE.PlaneGeometry(options.width * 0.2, options.height * 0.72),
        material,
    );

    main.name = "CustomImageMainGloss";
    main.rotation.x = -Math.PI / 2;
    main.rotation.z = -0.24;
    main.position.set(-options.width * 0.28, options.depth / 2 + 0.034, -options.height * 0.02);
    main.renderOrder = options.renderOrder + 4;

    const side = new THREE.Mesh(
        new THREE.PlaneGeometry(options.width * 0.1, options.height * 0.38),
        material.clone(),
    );

    side.name = "CustomImageSoftGloss";
    side.material.opacity *= 0.58;
    side.rotation.x = -Math.PI / 2;
    side.rotation.z = 0.2;
    side.position.set(options.width * 0.3, options.depth / 2 + 0.035, options.height * 0.08);
    side.renderOrder = options.renderOrder + 4;

    group.add(main, side);

    return group;
}

function createMountPads(options) {
    const group = new THREE.Group();
    group.name = "CustomImageMountPads";
    group.visible = Boolean(options.showMountPads && options.showBacking);

    const material = new THREE.MeshBasicMaterial({
        name: "CustomImageMountPadMaterial",
        color: "#000000",
        transparent: true,
        opacity: 0.11,
        side: THREE.DoubleSide,
        depthWrite: false,
    });

    const positions = [
        [-options.width * 0.34, -options.height * 0.32],
        [options.width * 0.34, -options.height * 0.32],
        [-options.width * 0.34, options.height * 0.32],
        [options.width * 0.34, options.height * 0.32],
    ];

    positions.forEach(([x, z], index) => {
        const pad = new THREE.Mesh(
            new THREE.CircleGeometry(0.045, 32),
            material.clone(),
        );

        pad.name = `CustomImageMountPad_${index + 1}`;
        pad.rotation.x = -Math.PI / 2;
        pad.position.set(x, -options.depth / 2 - 0.006, z);

        group.add(pad);
    });

    return group;
}

function createContactShadow(options) {
    const group = new THREE.Group();
    group.name = "CustomImageShadow";
    group.visible = Boolean(options.showShadow);

    const material = new THREE.MeshBasicMaterial({
        name: "CustomImageShadowMaterial",
        color: "#000000",
        transparent: true,
        opacity: 0.14,
        side: THREE.DoubleSide,
        depthWrite: false,
    });

    const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(options.width * 1.02, options.height * 0.96),
        material,
    );

    shadow.name = "CustomImageContactShadow";
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -options.depth / 2 - 0.018;
    shadow.renderOrder = -1;

    group.add(shadow);

    return group;
}

function applyTargetTransform(group, config = {}, options = {}) {
    const transform =
        config.layout ??
        config.transform ??
        config.contentLayout?.customImagePlane ??
        config.contentLayout?.customImage ??
        {};

    const targetTransform =
        TARGET_TRANSFORMS[options.target] ??
        TARGET_TRANSFORMS[CUSTOM_IMAGE_TARGETS.FREE];

    applyTransform(group, {
        position: transform.position ?? options.position ?? targetTransform.position,
        rotation: transform.rotation ?? options.rotation ?? targetTransform.rotation,
        scale: transform.scale ?? options.scale ?? targetTransform.scale,
    });
}

function createMetadata(options) {
    return {
        objectType: "CustomImagePlane",
        version: CUSTOM_IMAGE_PLANE_VERSION,
        target: options.target,
        style: options.style,
        fit: options.fit,
        finish: options.finish,
        dimensions: {
            width: options.width,
            height: options.height,
            depth: options.depth,
        },
        image: {
            imageUrl: options.imageUrl,
            hasImageBitmap: Boolean(options.imageBitmap),
            hasImageElement: Boolean(options.imageElement),
            fit: options.fit,
            cropX: options.cropX,
            cropY: options.cropY,
            zoom: options.zoom,
            rotation2D: options.rotation2D,
        },
        editable: true,
        draggable: true,
        rotatable: true,
        scalable: true,
        exportable: true,
        minScale: options.minScale,
        maxScale: options.maxScale,
        purpose: "custom-image-placement-with-preserved-aspect-ratio",
        createdAt: new Date().toISOString(),
    };
}

export function createCustomImagePlane(config = {}, materials = {}, textureSet = {}, extraOptions = {}) {
    const options = normalizeOptions(config, extraOptions);

    const group = new THREE.Group();
    group.name = "KickOffBoxCustomImagePlane";
    group.userData = createMetadata(options);
    group.userData.options = options;

    const shadow = createContactShadow(options);
    const backing = createBacking(options);
    const surface = createSurface(options, textureSet);
    const frame = createFrame(options);
    const polaroidFooter = createPolaroidFooter(options);
    const gloss = createGlossOverlay(options);
    const mountPads = createMountPads(options);

    group.add(
        shadow,
        mountPads,
        backing,
        polaroidFooter,
        surface,
        frame,
        gloss,
    );

    group.userData.parts = {
        shadow: shadow.name,
        mountPads: mountPads.name,
        backing: backing.name,
        polaroidFooter: polaroidFooter.name,
        surface: surface.name,
        frame: frame.name,
        gloss: gloss.name,
    };

    applyTargetTransform(group, config, options);
    setGroupShadow(group, true, true);

    if (options.imageUrl && !options.imageElement && !options.imageBitmap) {
        updateCustomImageSource(group, {
            imageUrl: options.imageUrl,
        });
    }

    return group;
}

export function createImagePlane(config = {}, materials = {}, textureSet = {}, extraOptions = {}) {
    return createCustomImagePlane(config, materials, textureSet, extraOptions);
}

export async function updateCustomImageSource(customImageGroup, {
    imageUrl = null,
    imageElement = null,
    imageBitmap = null,
    imageFile = null,
    fit,
    cropX,
    cropY,
    zoom,
    rotation2D,
} = {}) {
    if (!customImageGroup) return null;

    const surface = customImageGroup.getObjectByName("CustomImageSurface");

    if (!surface?.material) return null;

    const currentOptions = {
        ...DEFAULT_IMAGE_OPTIONS,
        ...(customImageGroup.userData?.options ?? {}),
    };

    const image =
        imageBitmap ??
        imageElement ??
        imageFile ??
        await loadImageElement(imageUrl ?? currentOptions.imageUrl);

    const nextOptions = normalizeOptions({
        ...currentOptions,
        imageUrl: imageUrl ?? currentOptions.imageUrl,
        imageElement: imageElement ?? currentOptions.imageElement,
        imageBitmap: imageBitmap ?? currentOptions.imageBitmap,
        imageFile: imageFile ?? currentOptions.imageFile,
        fit: fit ?? currentOptions.fit,
        cropX: cropX ?? currentOptions.cropX,
        cropY: cropY ?? currentOptions.cropY,
        zoom: zoom ?? currentOptions.zoom,
        rotation2D: rotation2D ?? currentOptions.rotation2D,
    });

    const previousMaterial = surface.material;
    const { texture, hasImage } = createCompositedImageTexture(image, nextOptions);

    const nextMaterial = new THREE.MeshBasicMaterial({
        name: "CustomImagePlaneSurfaceMaterial",
        map: texture,
        transparent: true,
        opacity: nextOptions.opacity,
        side: THREE.DoubleSide,
    });

    nextMaterial.userData = {
        generatedBy: "CustomImagePlane",
        texture,
        options: nextOptions,
        hasImage,
    };

    surface.material = nextMaterial;
    surface.userData.fit = nextOptions.fit;
    surface.userData.hasImage = hasImage;

    disposeMaterial(previousMaterial);

    customImageGroup.userData = {
        ...customImageGroup.userData,
        ...createMetadata(nextOptions),
        options: nextOptions,
        updatedAt: new Date().toISOString(),
    };

    return customImageGroup;
}

export function updateCustomImageCrop(customImageGroup, cropOptions = {}) {
    return updateCustomImageSource(customImageGroup, cropOptions);
}

export function updateCustomImageStyle(customImageGroup, nextOptions = {}) {
    if (!customImageGroup) return null;

    const currentOptions = {
        ...DEFAULT_IMAGE_OPTIONS,
        ...(customImageGroup.userData?.options ?? {}),
    };

    const options = normalizeOptions({
        ...currentOptions,
        ...nextOptions,
    });

    customImageGroup.userData.options = options;
    customImageGroup.userData.updatedAt = new Date().toISOString();

    return updateCustomImageSource(customImageGroup, {
        imageUrl: options.imageUrl,
        imageElement: options.imageElement,
        imageBitmap: options.imageBitmap,
        imageFile: options.imageFile,
        fit: options.fit,
        cropX: options.cropX,
        cropY: options.cropY,
        zoom: options.zoom,
        rotation2D: options.rotation2D,
    });
}

export function setCustomImagePlaneTransform(customImageGroup, { position, rotation, scale } = {}) {
    if (!customImageGroup) return;

    if (position) {
        customImageGroup.position.set(position[0], position[1], position[2]);
    }

    if (rotation) {
        customImageGroup.rotation.set(rotation[0], rotation[1], rotation[2]);
    }

    if (scale) {
        const values = Array.isArray(scale) ? scale : [scale, scale, scale];
        const minScale = customImageGroup.userData?.minScale ?? DEFAULT_IMAGE_OPTIONS.minScale;
        const maxScale = customImageGroup.userData?.maxScale ?? DEFAULT_IMAGE_OPTIONS.maxScale;

        customImageGroup.scale.set(
            THREE.MathUtils.clamp(values[0], minScale, maxScale),
            THREE.MathUtils.clamp(values[1], minScale, maxScale),
            THREE.MathUtils.clamp(values[2], minScale, maxScale),
        );
    }

    customImageGroup.userData.updatedAt = new Date().toISOString();
}

export function setCustomImagePlaneVisibility(customImageGroup, visible = true) {
    if (!customImageGroup) return;

    customImageGroup.visible = Boolean(visible);
    customImageGroup.userData.visible = Boolean(visible);
    customImageGroup.userData.updatedAt = new Date().toISOString();
}

export function setCustomImageFrameVisibility(customImageGroup, visible = true) {
    const frame = customImageGroup?.getObjectByName("CustomImageFrame");

    if (!frame) return;

    frame.visible = Boolean(visible);
}

export function setCustomImageCaptionVisibility(customImageGroup, visible = true) {
    if (!customImageGroup) return;

    const options = {
        ...(customImageGroup.userData?.options ?? {}),
        showCaption: Boolean(visible),
    };

    updateCustomImageStyle(customImageGroup, options);
}

export function setCustomImageGlossVisibility(customImageGroup, visible = true) {
    const gloss = customImageGroup?.getObjectByName("CustomImageGlossOverlay");

    if (!gloss) return;

    gloss.visible = Boolean(visible);
}

export function updateCustomImagePlaneAnimation(customImageGroup, elapsedTime = 0) {
    if (!customImageGroup) return;

    const gloss = customImageGroup.getObjectByName("CustomImageGlossOverlay");

    if (gloss) {
        gloss.children.forEach((child, index) => {
            if (child.material) {
                child.material.opacity = 0.1 + Math.sin(elapsedTime * 1.2 + index) * 0.022;
            }
        });
    }
}

export function getCustomImagePlaneParts(customImageGroup) {
    if (!customImageGroup) return {};

    return {
        shadow: customImageGroup.getObjectByName("CustomImageShadow"),
        mountPads: customImageGroup.getObjectByName("CustomImageMountPads"),
        backing: customImageGroup.getObjectByName("CustomImageBacking"),
        polaroidFooter: customImageGroup.getObjectByName("CustomImagePolaroidFooter"),
        surface: customImageGroup.getObjectByName("CustomImageSurface"),
        frame: customImageGroup.getObjectByName("CustomImageFrame"),
        gloss: customImageGroup.getObjectByName("CustomImageGlossOverlay"),
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

export function disposeCustomImagePlane(customImageGroup) {
    if (!customImageGroup) return;

    const disposedGeometries = new Set();
    const disposedMaterials = new Set();

    customImageGroup.traverse((object) => {
        if (object.geometry && !disposedGeometries.has(object.geometry)) {
            object.geometry.dispose();
            disposedGeometries.add(object.geometry);
        }

        if (object.material && !disposedMaterials.has(object.material)) {
            disposeMaterial(object.material);
            disposedMaterials.add(object.material);
        }
    });

    customImageGroup.removeFromParent();
}

export function disposeCustomImageCache() {
    imageTextureCache.clear();
}

export const CustomImagePlane = Object.freeze({
    version: CUSTOM_IMAGE_PLANE_VERSION,
    targets: CUSTOM_IMAGE_TARGETS,
    fit: CUSTOM_IMAGE_FIT,
    styles: CUSTOM_IMAGE_STYLES,
    finishes: CUSTOM_IMAGE_FINISHES,

    createCustomImagePlane,
    createImagePlane,

    updateCustomImageSource,
    updateCustomImageCrop,
    updateCustomImageStyle,
    updateCustomImagePlaneAnimation,

    setCustomImagePlaneTransform,
    setCustomImagePlaneVisibility,
    setCustomImageFrameVisibility,
    setCustomImageCaptionVisibility,
    setCustomImageGlossVisibility,

    getCustomImagePlaneParts,
    disposeCustomImagePlane,
    disposeCustomImageCache,
});
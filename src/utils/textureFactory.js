import * as THREE from "three";

import {
    APP_INFO,
    BRAND_COLORS,
    LOGO_VARIANTS,
    ASSET_PATHS,
    DEFAULT_TEXT_CONTENT,
    QR_DEFAULTS,
} from "../constants/appConstants.js";

import {
    BOX_ART_STYLES,
    LID_DESIGN_STYLES,
    PAPER_FILLER_STYLES,
} from "../config/designTemplates.js";

export const TEXTURE_FACTORY_VERSION = "1.0.0";

export const TEXTURE_TYPES = Object.freeze({
    BEVERAGE_LABEL: "beverage-label",
    CARD_MESSAGE: "card-message",
    QR_CARD: "qr-card",
    LID_INTERIOR: "lid-interior",
    BOX_PATTERN: "box-pattern",
    PAPER_FILLER: "paper-filler",
    LOGO_BADGE: "logo-badge",
    KEYCHAIN: "keychain",
    CUSTOM_IMAGE: "custom-image",
});

export const TEXTURE_SIZES = Object.freeze({
    LABEL: Object.freeze({ width: 1400, height: 620 }),
    CARD: Object.freeze({ width: 1200, height: 800 }),
    QR_CARD: Object.freeze({ width: 900, height: 900 }),
    LID: Object.freeze({ width: 1800, height: 1100 }),
    BOX_PATTERN: Object.freeze({ width: 1024, height: 1024 }),
    PAPER_FILLER: Object.freeze({ width: 512, height: 512 }),
    LOGO_BADGE: Object.freeze({ width: 900, height: 900 }),
    KEYCHAIN: Object.freeze({ width: 900, height: 900 }),
    CUSTOM_IMAGE: Object.freeze({ width: 1024, height: 1024 }),
});

export const TEXTURE_QUALITY = Object.freeze({
    LOW: Object.freeze({ anisotropy: 2, mipmaps: true }),
    MEDIUM: Object.freeze({ anisotropy: 4, mipmaps: true }),
    HIGH: Object.freeze({ anisotropy: 8, mipmaps: true }),
    ULTRA: Object.freeze({ anisotropy: 12, mipmaps: true }),
});

const DEFAULT_FONT_STACK = "Arial, Helvetica, sans-serif";

const DEFAULT_TEXTURE_OPTIONS = Object.freeze({
    quality: TEXTURE_QUALITY.HIGH,
    colorSpace: THREE.SRGBColorSpace,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter,
    generateMipmaps: true,
    flipY: true,
});

const PREMIUM_COLORS = Object.freeze({
    black: "#0f0c09",
    blackSoft: "#17110c",
    brownDark: "#2b2118",
    gold: "#c59a4a",
    goldLight: "#e9c678",
    cream: "#fff7e8",
    red: "#b92d2d",
    green: "#2f7d55",
    yellow: "#f0c84b",
    blue: "#2f86c7",
});

function createCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("No se pudo crear el contexto 2D del canvas.");
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    return { canvas, ctx };
}

function createTextureFromCanvas(canvas, options = {}) {
    const textureOptions = {
        ...DEFAULT_TEXTURE_OPTIONS,
        ...options,
    };

    const texture = new THREE.CanvasTexture(canvas);

    texture.colorSpace = textureOptions.colorSpace;
    texture.wrapS = textureOptions.wrapS;
    texture.wrapT = textureOptions.wrapT;
    texture.minFilter = textureOptions.minFilter;
    texture.magFilter = textureOptions.magFilter;
    texture.generateMipmaps = textureOptions.generateMipmaps;
    texture.anisotropy = textureOptions.quality?.anisotropy ?? TEXTURE_QUALITY.HIGH.anisotropy;
    texture.flipY = textureOptions.flipY;
    texture.needsUpdate = true;

    texture.userData = {
        type: options.type ?? "canvas-texture",
        createdAt: new Date().toISOString(),
        width: canvas.width,
        height: canvas.height,
        version: TEXTURE_FACTORY_VERSION,
    };

    return texture;
}

function hexToRgba(hex, alpha = 1) {
    const value = String(hex).replace("#", "");
    const bigint = Number.parseInt(value.length === 3
        ? value.split("").map((char) => char + char).join("")
        : value, 16);

    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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

function fillRoundedRect(ctx, x, y, width, height, radius, fillStyle) {
    ctx.save();
    drawRoundedRect(ctx, x, y, width, height, radius);
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.restore();
}

function strokeRoundedRect(ctx, x, y, width, height, radius, strokeStyle, lineWidth = 2) {
    ctx.save();
    drawRoundedRect(ctx, x, y, width, height, radius);
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.restore();
}

function drawText(ctx, text, x, y, options = {}) {
    const {
        fontSize = 48,
        weight = "700",
        color = "#ffffff",
        align = "center",
        baseline = "middle",
        maxWidth,
        fontFamily = DEFAULT_FONT_STACK,
        lineHeight = fontSize * 1.18,
        letterSpacing = 0,
    } = options;

    ctx.save();
    ctx.font = `${weight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;

    const safeText = String(text ?? "");

    if (letterSpacing > 0 && !maxWidth) {
        drawLetterSpacedText(ctx, safeText, x, y, letterSpacing);
    } else if (maxWidth) {
        wrapText(ctx, safeText, x, y, maxWidth, lineHeight, {
            align,
            baseline,
        });
    } else {
        ctx.fillText(safeText, x, y);
    }

    ctx.restore();
}

function drawLetterSpacedText(ctx, text, x, y, spacing) {
    const chars = [...String(text)];
    const totalWidth = chars.reduce((sum, char) => sum + ctx.measureText(char).width + spacing, -spacing);
    let currentX = x - totalWidth / 2;

    chars.forEach((char) => {
        ctx.fillText(char, currentX, y);
        currentX += ctx.measureText(char).width + spacing;
    });
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, options = {}) {
    const words = String(text ?? "").split(/\s+/);
    const lines = [];
    let line = "";

    words.forEach((word) => {
        const testLine = line ? `${line} ${word}` : word;

        if (ctx.measureText(testLine).width > maxWidth && line) {
            lines.push(line);
            line = word;
        } else {
            line = testLine;
        }
    });

    if (line) lines.push(line);

    const totalHeight = (lines.length - 1) * lineHeight;
    const startY = options.baseline === "middle" ? y - totalHeight / 2 : y;

    lines.forEach((item, index) => {
        ctx.fillText(item, x, startY + index * lineHeight);
    });
}

function drawLinearBackground(ctx, width, height, colors = []) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    const safeColors = colors.length ? colors : ["#111111", "#2b2118"];

    safeColors.forEach((color, index) => {
        gradient.addColorStop(index / Math.max(safeColors.length - 1, 1), color);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}

function drawRadialLight(ctx, width, height, color = "#ffffff", alpha = 0.16) {
    const gradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35,
        10,
        width * 0.5,
        height * 0.35,
        Math.max(width, height) * 0.72,
    );

    gradient.addColorStop(0, hexToRgba(color, alpha));
    gradient.addColorStop(0.45, hexToRgba(color, alpha * 0.25));
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}

function drawPremiumDiagonalLines(ctx, width, height, options = {}) {
    const {
        color = PREMIUM_COLORS.gold,
        alpha = 0.18,
        spacing = 110,
        lineWidth = 6,
        direction = 1,
    } = options;

    ctx.save();
    ctx.strokeStyle = hexToRgba(color, alpha);
    ctx.lineWidth = lineWidth;

    for (let i = -height; i < width + height; i += spacing) {
        ctx.beginPath();

        if (direction === 1) {
            ctx.moveTo(i, height);
            ctx.lineTo(i + height, 0);
        } else {
            ctx.moveTo(i, 0);
            ctx.lineTo(i + height, height);
        }

        ctx.stroke();
    }

    ctx.restore();
}

function drawStadiumLines(ctx, width, height, options = {}) {
    const {
        color = PREMIUM_COLORS.gold,
        alpha = 0.2,
        lineWidth = 5,
    } = options;

    ctx.save();
    ctx.strokeStyle = hexToRgba(color, alpha);
    ctx.lineWidth = lineWidth;

    for (let i = 0; i < 9; i += 1) {
        const y = height * (0.18 + i * 0.08);
        ctx.beginPath();
        ctx.moveTo(width * 0.08, y);
        ctx.bezierCurveTo(width * 0.32, y - 85, width * 0.68, y + 85, width * 0.92, y);
        ctx.stroke();
    }

    ctx.restore();
}

function drawTechLines(ctx, width, height, options = {}) {
    const {
        color = BRAND_COLORS.TECH_BLUE,
        alpha = 0.28,
        nodeColor = PREMIUM_COLORS.gold,
    } = options;

    ctx.save();
    ctx.strokeStyle = hexToRgba(color, alpha);
    ctx.fillStyle = hexToRgba(nodeColor, 0.55);
    ctx.lineWidth = 4;

    const nodes = [
        [0.12, 0.22], [0.26, 0.22], [0.26, 0.36],
        [0.48, 0.36], [0.48, 0.58], [0.68, 0.58],
        [0.68, 0.42], [0.86, 0.42],
    ];

    ctx.beginPath();
    nodes.forEach(([nx, ny], index) => {
        const x = nx * width;
        const y = ny * height;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    nodes.forEach(([nx, ny]) => {
        ctx.beginPath();
        ctx.arc(nx * width, ny * height, 9, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.restore();
}

function drawBoliviaRibbon(ctx, width, height, options = {}) {
    const { x = 0, y = 0, ribbonHeight = 90, alpha = 1 } = options;
    const segmentHeight = ribbonHeight / 3;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = BRAND_COLORS.BOLIVIA_RED;
    ctx.fillRect(x, y, width, segmentHeight);
    ctx.fillStyle = BRAND_COLORS.BOLIVIA_YELLOW;
    ctx.fillRect(x, y + segmentHeight, width, segmentHeight);
    ctx.fillStyle = BRAND_COLORS.BOLIVIA_GREEN;
    ctx.fillRect(x, y + segmentHeight * 2, width, segmentHeight);
    ctx.restore();
}

function drawFootballFieldMark(ctx, width, height, options = {}) {
    const {
        color = "#ffffff",
        alpha = 0.12,
    } = options;

    ctx.save();
    ctx.strokeStyle = hexToRgba(color, alpha);
    ctx.lineWidth = 5;

    ctx.strokeRect(width * 0.08, height * 0.14, width * 0.84, height * 0.72);

    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.14);
    ctx.lineTo(width * 0.5, height * 0.86);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.5, height * 0.13, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
}

function drawNoise(ctx, width, height, options = {}) {
    const {
        alpha = 0.04,
        density = 0.08,
        color = "#ffffff",
    } = options;

    ctx.save();
    ctx.fillStyle = hexToRgba(color, alpha);

    const count = Math.floor(width * height * density * 0.01);

    for (let i = 0; i < count; i += 1) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 2 + 0.5;
        ctx.fillRect(x, y, size, size);
    }

    ctx.restore();
}

function drawDecorativeSeal(ctx, x, y, radius, options = {}) {
    const {
        primary = PREMIUM_COLORS.gold,
        secondary = PREMIUM_COLORS.black,
        text = "2026",
        subtext = "KICKOFF",
    } = options;

    ctx.save();

    ctx.fillStyle = primary;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = secondary;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.78, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = primary;
    ctx.lineWidth = radius * 0.055;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.62, 0, Math.PI * 2);
    ctx.stroke();

    drawText(ctx, text, x, y - radius * 0.05, {
        fontSize: radius * 0.42,
        color: primary,
        weight: "900",
    });

    drawText(ctx, subtext, x, y + radius * 0.33, {
        fontSize: radius * 0.13,
        color: primary,
        weight: "800",
        letterSpacing: 1.6,
    });

    ctx.restore();
}

function drawFakeQR(ctx, x, y, size, options = {}) {
    const {
        foreground = "#111111",
        background = "#ffffff",
        seed = "kickoff-box-2026",
        modules = 29,
        quietZone = 4,
    } = options;

    ctx.save();

    fillRoundedRect(ctx, x, y, size, size, size * 0.035, background);

    const innerX = x + size * 0.08;
    const innerY = y + size * 0.08;
    const innerSize = size * 0.84;
    const cell = innerSize / modules;

    function hashAt(index) {
        let hash = 0;
        const text = `${seed}:${index}`;

        for (let i = 0; i < text.length; i += 1) {
            hash = (hash << 5) - hash + text.charCodeAt(i);
            hash |= 0;
        }

        return Math.abs(hash);
    }

    function drawFinder(col, row) {
        const fx = innerX + col * cell;
        const fy = innerY + row * cell;

        ctx.fillStyle = foreground;
        ctx.fillRect(fx, fy, cell * 7, cell * 7);

        ctx.fillStyle = background;
        ctx.fillRect(fx + cell, fy + cell, cell * 5, cell * 5);

        ctx.fillStyle = foreground;
        ctx.fillRect(fx + cell * 2, fy + cell * 2, cell * 3, cell * 3);
    }

    for (let row = 0; row < modules; row += 1) {
        for (let col = 0; col < modules; col += 1) {
            const inFinder =
                (col < 8 && row < 8) ||
                (col > modules - 9 && row < 8) ||
                (col < 8 && row > modules - 9);

            if (inFinder) continue;
            if (row < quietZone || col < quietZone || row >= modules - quietZone || col >= modules - quietZone) continue;

            const hash = hashAt(row * modules + col);
            const shouldFill = hash % 5 === 0 || hash % 7 === 0 || hash % 11 === 0;

            if (shouldFill) {
                ctx.fillStyle = foreground;
                ctx.fillRect(
                    Math.round(innerX + col * cell),
                    Math.round(innerY + row * cell),
                    Math.ceil(cell * 0.92),
                    Math.ceil(cell * 0.92),
                );
            }
        }
    }

    drawFinder(0, 0);
    drawFinder(modules - 7, 0);
    drawFinder(0, modules - 7);

    ctx.restore();
}

function drawLogoPlaceholder(ctx, x, y, width, height, options = {}) {
    const {
        variant = LOGO_VARIANTS.LIGHT,
        title = APP_INFO.CAREER,
        subtitle = APP_INFO.UNIVERSITY,
        accent = PREMIUM_COLORS.gold,
    } = options;

    const bg = variant === LOGO_VARIANTS.DARK ? "#111111" : "#ffffff";
    const text = variant === LOGO_VARIANTS.DARK ? "#ffffff" : "#111111";

    fillRoundedRect(ctx, x, y, width, height, Math.min(width, height) * 0.16, bg);
    strokeRoundedRect(ctx, x, y, width, height, Math.min(width, height) * 0.16, accent, 8);

    const iconX = x + width * 0.18;
    const iconY = y + height * 0.5;
    const iconR = height * 0.22;

    ctx.save();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(iconX, iconY, iconR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(iconX - iconR * 0.55, iconY);
    ctx.lineTo(iconX, iconY - iconR * 0.55);
    ctx.lineTo(iconX + iconR * 0.55, iconY);
    ctx.lineTo(iconX, iconY + iconR * 0.55);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    drawText(ctx, title, x + width * 0.58, y + height * 0.42, {
        fontSize: Math.min(width, height) * 0.11,
        color: text,
        weight: "900",
        maxWidth: width * 0.58,
    });

    drawText(ctx, subtitle, x + width * 0.58, y + height * 0.63, {
        fontSize: Math.min(width, height) * 0.07,
        color: accent,
        weight: "800",
        maxWidth: width * 0.58,
    });
}

function createTextureResponse(texture, canvas, meta = {}) {
    return {
        texture,
        canvas,
        width: canvas.width,
        height: canvas.height,
        meta: {
            ...meta,
            createdAt: new Date().toISOString(),
            factoryVersion: TEXTURE_FACTORY_VERSION,
        },
    };
}

export function createPremiumPatternTexture(options = {}) {
    const size = options.size ?? TEXTURE_SIZES.BOX_PATTERN;
    const { canvas, ctx } = createCanvas(size.width, size.height);

    const style = options.style ?? BOX_ART_STYLES.BLACK_GOLD_STADIUM;
    const primary = options.primaryColor ?? PREMIUM_COLORS.black;
    const secondary = options.secondaryColor ?? PREMIUM_COLORS.brownDark;
    const accent = options.accentColor ?? PREMIUM_COLORS.gold;

    drawLinearBackground(ctx, size.width, size.height, [primary, secondary, primary]);

    if (style === BOX_ART_STYLES.BLACK_GOLD_STADIUM) {
        drawPremiumDiagonalLines(ctx, size.width, size.height, {
            color: accent,
            alpha: 0.22,
            spacing: 130,
            lineWidth: 7,
        });
        drawStadiumLines(ctx, size.width, size.height, {
            color: accent,
            alpha: 0.16,
        });
        drawFootballFieldMark(ctx, size.width, size.height, {
            color: PREMIUM_COLORS.cream,
            alpha: 0.08,
        });
    }

    if (style === BOX_ART_STYLES.TECH_SYSTEMS) {
        drawTechLines(ctx, size.width, size.height, {
            color: BRAND_COLORS.TECH_BLUE,
            alpha: 0.34,
            nodeColor: accent,
        });
        drawPremiumDiagonalLines(ctx, size.width, size.height, {
            color: BRAND_COLORS.TECH_BLUE,
            alpha: 0.12,
            spacing: 90,
            lineWidth: 4,
        });
    }

    if (style === BOX_ART_STYLES.BOLIVIA_WORLD_CUP) {
        drawBoliviaRibbon(ctx, size.width, size.height, {
            y: size.height * 0.08,
            ribbonHeight: size.height * 0.16,
            alpha: 0.82,
        });
        drawFootballFieldMark(ctx, size.width, size.height, {
            color: "#ffffff",
            alpha: 0.12,
        });
        drawPremiumDiagonalLines(ctx, size.width, size.height, {
            color: BRAND_COLORS.BOLIVIA_YELLOW,
            alpha: 0.18,
            spacing: 115,
            lineWidth: 5,
        });
    }

    if (style === BOX_ART_STYLES.ACADEMIC_MINIMAL || style === BOX_ART_STYLES.CLEAN_KRAFT) {
        drawPremiumDiagonalLines(ctx, size.width, size.height, {
            color: accent,
            alpha: 0.12,
            spacing: 150,
            lineWidth: 4,
        });
    }

    drawRadialLight(ctx, size.width, size.height, accent, 0.12);
    drawNoise(ctx, size.width, size.height, { alpha: 0.035, density: 0.08 });

    const texture = createTextureFromCanvas(canvas, {
        type: TEXTURE_TYPES.BOX_PATTERN,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        quality: options.quality ?? TEXTURE_QUALITY.HIGH,
    });

    texture.repeat.set(options.repeatX ?? 1, options.repeatY ?? 1);

    return createTextureResponse(texture, canvas, {
        type: TEXTURE_TYPES.BOX_PATTERN,
        style,
    });
}

export function createBeverageLabelTexture(options = {}) {
    const size = options.size ?? TEXTURE_SIZES.LABEL;
    const { canvas, ctx } = createCanvas(size.width, size.height);

    const labelText = options.labelText ?? "KICK COLA";
    const subLabel = options.subLabel ?? "Classic 2026";
    const footerText = options.footerText ?? "Edición académica";

    const background = options.labelBackground ?? "#111111";
    const textColor = options.labelTextColor ?? "#fff7e8";
    const accent = options.labelAccent ?? PREMIUM_COLORS.gold;
    const secondary = options.secondaryAccent ?? BRAND_COLORS.BOLIVIA_RED;
    const pattern = options.pattern ?? "premium";

    drawLinearBackground(ctx, size.width, size.height, [
        background,
        options.gradientColor ?? background,
        accent,
    ]);

    if (pattern === "premium") {
        drawPremiumDiagonalLines(ctx, size.width, size.height, {
            color: accent,
            alpha: 0.26,
            spacing: 100,
            lineWidth: 7,
        });
        drawStadiumLines(ctx, size.width, size.height, {
            color: accent,
            alpha: 0.14,
        });
    }

    if (pattern === "citrus") {
        for (let i = 0; i < 12; i += 1) {
            ctx.fillStyle = hexToRgba(accent, 0.16);
            ctx.beginPath();
            ctx.arc(90 + i * 115, 120 + Math.sin(i) * 42, 44, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    if (pattern === "fresh" || pattern === "sport") {
        drawTechLines(ctx, size.width, size.height, {
            color: accent,
            alpha: 0.2,
            nodeColor: secondary,
        });
    }

    if (pattern === "water" || pattern === "mineral") {
        ctx.strokeStyle = hexToRgba(accent, 0.24);
        ctx.lineWidth = 7;

        for (let i = 0; i < 7; i += 1) {
            ctx.beginPath();
            ctx.moveTo(0, 150 + i * 58);
            ctx.bezierCurveTo(
                size.width * 0.25,
                90 + i * 45,
                size.width * 0.72,
                205 + i * 30,
                size.width,
                130 + i * 55,
            );
            ctx.stroke();
        }
    }

    if (pattern === "energy") {
        ctx.strokeStyle = hexToRgba(accent, 0.36);
        ctx.lineWidth = 9;

        for (let i = 0; i < 8; i += 1) {
            const startX = 80 + i * 160;
            ctx.beginPath();
            ctx.moveTo(startX, 70);
            ctx.lineTo(startX + 58, 230);
            ctx.lineTo(startX + 15, 230);
            ctx.lineTo(startX + 92, 500);
            ctx.stroke();
        }
    }

    ctx.fillStyle = secondary;
    ctx.fillRect(0, 0, size.width, 58);

    ctx.fillStyle = accent;
    ctx.fillRect(0, 58, size.width, 48);

    strokeRoundedRect(ctx, 70, 150, size.width - 140, 330, 48, accent, 14);
    strokeRoundedRect(ctx, 98, 178, size.width - 196, 274, 34, hexToRgba("#ffffff", 0.42), 5);

    drawText(ctx, labelText, size.width / 2, 292, {
        fontSize: 112,
        color: textColor,
        weight: "900",
        maxWidth: size.width - 220,
    });

    drawText(ctx, subLabel, size.width / 2, 390, {
        fontSize: 48,
        color: textColor,
        weight: "800",
        maxWidth: size.width - 260,
    });

    drawText(ctx, footerText, size.width / 2, 535, {
        fontSize: 34,
        color: accent,
        weight: "900",
        letterSpacing: 1,
    });

    drawDecorativeSeal(ctx, size.width - 155, size.height - 128, 62, {
        primary: accent,
        secondary: background,
        text: "2026",
        subtext: "BOX",
    });

    const texture = createTextureFromCanvas(canvas, {
        type: TEXTURE_TYPES.BEVERAGE_LABEL,
        quality: options.quality ?? TEXTURE_QUALITY.HIGH,
    });

    return createTextureResponse(texture, canvas, {
        type: TEXTURE_TYPES.BEVERAGE_LABEL,
        labelText,
        pattern,
    });
}

export function createCardMessageTexture(options = {}) {
    const size = options.size ?? TEXTURE_SIZES.CARD;
    const { canvas, ctx } = createCanvas(size.width, size.height);

    const title = options.title ?? DEFAULT_TEXT_CONTENT.CARD_TITLE;
    const recipient = options.recipient ?? DEFAULT_TEXT_CONTENT.RECIPIENT_NAME;
    const message = options.message ?? DEFAULT_TEXT_CONTENT.MESSAGE;
    const footer = options.footer ?? DEFAULT_TEXT_CONTENT.CARD_FOOTER;

    const background = options.background ?? PREMIUM_COLORS.cream;
    const textColor = options.textColor ?? PREMIUM_COLORS.brownDark;
    const accent = options.accentColor ?? PREMIUM_COLORS.gold;
    const secondary = options.secondaryColor ?? BRAND_COLORS.BOLIVIA_RED;

    drawLinearBackground(ctx, size.width, size.height, [
        background,
        "#ffffff",
        background,
    ]);

    drawPremiumDiagonalLines(ctx, size.width, size.height, {
        color: accent,
        alpha: 0.12,
        spacing: 120,
        lineWidth: 5,
    });

    fillRoundedRect(ctx, 70, 70, size.width - 140, size.height - 140, 48, hexToRgba("#ffffff", 0.64));
    strokeRoundedRect(ctx, 70, 70, size.width - 140, size.height - 140, 48, accent, 10);

    drawBoliviaRibbon(ctx, size.width, size.height, {
        y: 0,
        ribbonHeight: 54,
        alpha: 0.95,
    });

    drawText(ctx, title, size.width / 2, 170, {
        fontSize: 68,
        color: textColor,
        weight: "900",
        maxWidth: size.width - 220,
    });

    drawText(ctx, recipient, size.width / 2, 260, {
        fontSize: 52,
        color: secondary,
        weight: "900",
        maxWidth: size.width - 260,
    });

    drawText(ctx, message, size.width / 2, 430, {
        fontSize: 42,
        color: textColor,
        weight: "600",
        maxWidth: size.width - 270,
        lineHeight: 54,
    });

    drawText(ctx, footer, size.width / 2, size.height - 118, {
        fontSize: 34,
        color: accent,
        weight: "900",
        letterSpacing: 1.2,
    });

    drawDecorativeSeal(ctx, 160, size.height - 150, 62, {
        primary: accent,
        secondary: background,
        text: "2026",
        subtext: "KICK",
    });

    const texture = createTextureFromCanvas(canvas, {
        type: TEXTURE_TYPES.CARD_MESSAGE,
        quality: options.quality ?? TEXTURE_QUALITY.HIGH,
    });

    return createTextureResponse(texture, canvas, {
        type: TEXTURE_TYPES.CARD_MESSAGE,
        title,
        recipient,
    });
}

export function createQRCardTexture(options = {}) {
    const size = options.size ?? TEXTURE_SIZES.QR_CARD;
    const { canvas, ctx } = createCanvas(size.width, size.height);

    const title = options.title ?? QR_DEFAULTS.TITLE;
    const subtitle = options.subtitle ?? QR_DEFAULTS.SUBTITLE;
    const footer = options.footer ?? QR_DEFAULTS.FOOTER;
    const value = options.value ?? QR_DEFAULTS.VALUE;

    const background = options.background ?? PREMIUM_COLORS.cream;
    const foreground = options.foreground ?? PREMIUM_COLORS.black;
    const accent = options.accentColor ?? PREMIUM_COLORS.gold;

    drawLinearBackground(ctx, size.width, size.height, [
        background,
        "#ffffff",
        background,
    ]);

    fillRoundedRect(ctx, 55, 55, size.width - 110, size.height - 110, 44, hexToRgba("#ffffff", 0.78));
    strokeRoundedRect(ctx, 55, 55, size.width - 110, size.height - 110, 44, accent, 10);

    drawText(ctx, title, size.width / 2, 120, {
        fontSize: 50,
        color: foreground,
        weight: "900",
        maxWidth: size.width - 170,
    });

    drawText(ctx, subtitle, size.width / 2, 180, {
        fontSize: 27,
        color: hexToRgba(foreground, 0.78),
        weight: "700",
        maxWidth: size.width - 170,
    });

    const qrSize = size.width * 0.58;
    drawFakeQR(ctx, (size.width - qrSize) / 2, 235, qrSize, {
        foreground,
        background: "#ffffff",
        seed: value,
    });

    drawText(ctx, footer, size.width / 2, size.height - 105, {
        fontSize: 32,
        color: accent,
        weight: "900",
        maxWidth: size.width - 160,
    });

    const texture = createTextureFromCanvas(canvas, {
        type: TEXTURE_TYPES.QR_CARD,
        quality: options.quality ?? TEXTURE_QUALITY.HIGH,
    });

    return createTextureResponse(texture, canvas, {
        type: TEXTURE_TYPES.QR_CARD,
        title,
        value,
        visualOnly: true,
    });
}

export function createLidInteriorTexture(options = {}) {
    const size = options.size ?? TEXTURE_SIZES.LID;
    const { canvas, ctx } = createCanvas(size.width, size.height);

    const style = options.style ?? LID_DESIGN_STYLES.PREMIUM_QR_PANEL;
    const title = options.title ?? "Gracias por acompañar nuestra defensa";
    const subtitle = options.subtitle ?? "Este logro también es de ustedes.";
    const message = options.message ?? "Escanea el QR para ver el proyecto, la presentación o el portafolio digital.";
    const qrValue = options.qrValue ?? QR_DEFAULTS.VALUE;

    const primary = options.primaryColor ?? PREMIUM_COLORS.black;
    const secondary = options.secondaryColor ?? PREMIUM_COLORS.brownDark;
    const accent = options.accentColor ?? PREMIUM_COLORS.gold;
    const text = options.textColor ?? PREMIUM_COLORS.cream;

    drawLinearBackground(ctx, size.width, size.height, [primary, secondary, primary]);
    drawPremiumDiagonalLines(ctx, size.width, size.height, {
        color: accent,
        alpha: 0.17,
        spacing: 135,
        lineWidth: 6,
    });

    if (style === LID_DESIGN_STYLES.DEFENSE_MESSAGE || style === LID_DESIGN_STYLES.PREMIUM_QR_PANEL) {
        drawStadiumLines(ctx, size.width, size.height, {
            color: accent,
            alpha: 0.15,
            lineWidth: 6,
        });
        drawFootballFieldMark(ctx, size.width, size.height, {
            color: text,
            alpha: 0.075,
        });
    }

    if (style === LID_DESIGN_STYLES.INSTITUTIONAL_BADGE) {
        drawBoliviaRibbon(ctx, size.width, size.height, {
            y: 0,
            ribbonHeight: 96,
            alpha: 0.9,
        });
    }

    if (style === LID_DESIGN_STYLES.JURY_THANKS) {
        drawTechLines(ctx, size.width, size.height, {
            color: BRAND_COLORS.TECH_BLUE,
            alpha: 0.22,
            nodeColor: accent,
        });
    }

    fillRoundedRect(ctx, 100, 110, size.width - 200, size.height - 220, 62, hexToRgba("#000000", 0.2));
    strokeRoundedRect(ctx, 100, 110, size.width - 200, size.height - 220, 62, accent, 12);

    drawText(ctx, title, size.width * 0.43, 300, {
        fontSize: 82,
        color: text,
        weight: "900",
        maxWidth: size.width * 0.58,
        lineHeight: 92,
    });

    drawText(ctx, subtitle, size.width * 0.43, 455, {
        fontSize: 45,
        color: accent,
        weight: "800",
        maxWidth: size.width * 0.54,
        lineHeight: 55,
    });

    drawText(ctx, message, size.width * 0.43, 610, {
        fontSize: 38,
        color: hexToRgba(text, 0.9),
        weight: "600",
        maxWidth: size.width * 0.56,
        lineHeight: 50,
    });

    const qrPanelSize = 360;
    fillRoundedRect(ctx, size.width - 520, 280, 400, 500, 46, hexToRgba("#ffffff", 0.96));
    strokeRoundedRect(ctx, size.width - 520, 280, 400, 500, 46, accent, 10);

    drawFakeQR(ctx, size.width - 500, 315, qrPanelSize, {
        foreground: PREMIUM_COLORS.black,
        background: "#ffffff",
        seed: qrValue,
    });

    drawText(ctx, "ESCANEA", size.width - 320, 720, {
        fontSize: 36,
        color: PREMIUM_COLORS.black,
        weight: "900",
    });

    drawText(ctx, "KickOff Box 2026", size.width / 2, size.height - 130, {
        fontSize: 36,
        color: accent,
        weight: "900",
        letterSpacing: 1.4,
    });

    drawLogoPlaceholder(ctx, 135, size.height - 250, 430, 120, {
        variant: LOGO_VARIANTS.DARK,
        title: APP_INFO.CAREER,
        subtitle: APP_INFO.UNIVERSITY,
        accent,
    });

    const texture = createTextureFromCanvas(canvas, {
        type: TEXTURE_TYPES.LID_INTERIOR,
        quality: options.quality ?? TEXTURE_QUALITY.ULTRA,
    });

    return createTextureResponse(texture, canvas, {
        type: TEXTURE_TYPES.LID_INTERIOR,
        style,
        title,
    });
}

export function createPaperFillerTexture(options = {}) {
    const size = options.size ?? TEXTURE_SIZES.PAPER_FILLER;
    const { canvas, ctx } = createCanvas(size.width, size.height);

    const style = options.style ?? PAPER_FILLER_STYLES.BLACK_GOLD;

    const paletteByStyle = {
        [PAPER_FILLER_STYLES.KRAFT]: ["#b98a57", "#d8b37c", "#8b5f35"],
        [PAPER_FILLER_STYLES.WHITE]: ["#ffffff", "#f0eadf", "#d9d1c2"],
        [PAPER_FILLER_STYLES.GOLD]: ["#c59a4a", "#e9c678", "#8a682f"],
        [PAPER_FILLER_STYLES.BLACK_GOLD]: ["#14100b", "#c59a4a", "#2b2118"],
        [PAPER_FILLER_STYLES.TRICOLOR]: [
            BRAND_COLORS.BOLIVIA_RED,
            BRAND_COLORS.BOLIVIA_YELLOW,
            BRAND_COLORS.BOLIVIA_GREEN,
        ],
    };

    const palette = paletteByStyle[style] ?? paletteByStyle[PAPER_FILLER_STYLES.BLACK_GOLD];

    drawLinearBackground(ctx, size.width, size.height, [palette[0], palette[2], palette[0]]);

    ctx.save();

    for (let i = 0; i < 90; i += 1) {
        const color = palette[i % palette.length];
        const x = Math.random() * size.width;
        const y = Math.random() * size.height;
        const length = 70 + Math.random() * 150;
        const angle = Math.random() * Math.PI;
        const thickness = 5 + Math.random() * 8;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.strokeStyle = hexToRgba(color, 0.74);
        ctx.lineWidth = thickness;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(-length / 2, 0);
        ctx.bezierCurveTo(-length * 0.18, -18, length * 0.18, 18, length / 2, 0);
        ctx.stroke();

        ctx.restore();
    }

    ctx.restore();

    drawNoise(ctx, size.width, size.height, {
        alpha: 0.08,
        density: 0.16,
        color: "#ffffff",
    });

    const texture = createTextureFromCanvas(canvas, {
        type: TEXTURE_TYPES.PAPER_FILLER,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        quality: options.quality ?? TEXTURE_QUALITY.MEDIUM,
    });

    texture.repeat.set(options.repeatX ?? 3, options.repeatY ?? 3);

    return createTextureResponse(texture, canvas, {
        type: TEXTURE_TYPES.PAPER_FILLER,
        style,
    });
}

export function createLogoBadgeTexture(options = {}) {
    const size = options.size ?? TEXTURE_SIZES.LOGO_BADGE;
    const { canvas, ctx } = createCanvas(size.width, size.height);

    const variant = options.variant ?? LOGO_VARIANTS.LIGHT;
    const accent = options.accentColor ?? PREMIUM_COLORS.gold;
    const background = variant === LOGO_VARIANTS.DARK ? PREMIUM_COLORS.black : "#ffffff";
    const text = variant === LOGO_VARIANTS.DARK ? "#ffffff" : PREMIUM_COLORS.black;

    ctx.clearRect(0, 0, size.width, size.height);

    fillRoundedRect(ctx, 70, 70, size.width - 140, size.height - 140, 90, background);
    strokeRoundedRect(ctx, 70, 70, size.width - 140, size.height - 140, 90, accent, 18);

    drawPremiumDiagonalLines(ctx, size.width, size.height, {
        color: accent,
        alpha: variant === LOGO_VARIANTS.DARK ? 0.22 : 0.12,
        spacing: 120,
        lineWidth: 8,
    });

    drawDecorativeSeal(ctx, size.width / 2, 285, 140, {
        primary: accent,
        secondary: background,
        text: "IS",
        subtext: "SYSTEMS",
    });

    drawText(ctx, APP_INFO.CAREER, size.width / 2, 545, {
        fontSize: 58,
        color: text,
        weight: "900",
        maxWidth: size.width - 190,
        lineHeight: 70,
    });

    drawText(ctx, APP_INFO.UNIVERSITY, size.width / 2, 650, {
        fontSize: 42,
        color: accent,
        weight: "900",
        maxWidth: size.width - 190,
    });

    drawText(ctx, "KickOff Box 2026", size.width / 2, 760, {
        fontSize: 34,
        color: text,
        weight: "800",
        letterSpacing: 1.1,
    });

    const texture = createTextureFromCanvas(canvas, {
        type: TEXTURE_TYPES.LOGO_BADGE,
        quality: options.quality ?? TEXTURE_QUALITY.HIGH,
    });

    return createTextureResponse(texture, canvas, {
        type: TEXTURE_TYPES.LOGO_BADGE,
        variant,
    });
}

export function createKeychainTexture(options = {}) {
    const size = options.size ?? TEXTURE_SIZES.KEYCHAIN;
    const { canvas, ctx } = createCanvas(size.width, size.height);

    const text = options.text ?? "2026";
    const subtitle = options.subtitle ?? "KickOff";
    const background = options.background ?? hexToRgba(PREMIUM_COLORS.gold, 0.22);
    const accent = options.accentColor ?? PREMIUM_COLORS.gold;
    const foreground = options.foreground ?? PREMIUM_COLORS.black;

    ctx.clearRect(0, 0, size.width, size.height);

    const gradient = ctx.createRadialGradient(
        size.width * 0.5,
        size.height * 0.38,
        10,
        size.width * 0.5,
        size.height * 0.5,
        size.width * 0.5,
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.3, background);
    gradient.addColorStop(1, hexToRgba(accent, 0.62));

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(size.width / 2, size.height / 2, size.width * 0.38, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = accent;
    ctx.lineWidth = 18;
    ctx.stroke();

    drawPremiumDiagonalLines(ctx, size.width, size.height, {
        color: "#ffffff",
        alpha: 0.18,
        spacing: 80,
        lineWidth: 5,
    });

    drawText(ctx, text, size.width / 2, size.height * 0.47, {
        fontSize: 130,
        color: foreground,
        weight: "900",
    });

    drawText(ctx, subtitle, size.width / 2, size.height * 0.62, {
        fontSize: 56,
        color: foreground,
        weight: "900",
    });

    drawText(ctx, APP_INFO.CAREER, size.width / 2, size.height * 0.73, {
        fontSize: 31,
        color: foreground,
        weight: "800",
        maxWidth: size.width * 0.62,
    });

    const texture = createTextureFromCanvas(canvas, {
        type: TEXTURE_TYPES.KEYCHAIN,
        quality: options.quality ?? TEXTURE_QUALITY.HIGH,
    });

    return createTextureResponse(texture, canvas, {
        type: TEXTURE_TYPES.KEYCHAIN,
        text,
    });
}

export function createCustomImageTexture(image, options = {}) {
    const size = options.size ?? TEXTURE_SIZES.CUSTOM_IMAGE;
    const { canvas, ctx } = createCanvas(size.width, size.height);

    const background = options.background ?? "#ffffff";

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, size.width, size.height);

    const imageAspect = image.width / image.height;
    const canvasAspect = size.width / size.height;

    let drawWidth = size.width;
    let drawHeight = size.height;
    let drawX = 0;
    let drawY = 0;

    if (options.fit === "contain") {
        if (imageAspect > canvasAspect) {
            drawHeight = size.width / imageAspect;
            drawY = (size.height - drawHeight) / 2;
        } else {
            drawWidth = size.height * imageAspect;
            drawX = (size.width - drawWidth) / 2;
        }
    } else {
        if (imageAspect > canvasAspect) {
            drawWidth = size.height * imageAspect;
            drawX = (size.width - drawWidth) / 2;
        } else {
            drawHeight = size.width / imageAspect;
            drawY = (size.height - drawHeight) / 2;
        }
    }

    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);

    if (options.overlay) {
        ctx.fillStyle = options.overlay;
        ctx.fillRect(0, 0, size.width, size.height);
    }

    const texture = createTextureFromCanvas(canvas, {
        type: TEXTURE_TYPES.CUSTOM_IMAGE,
        quality: options.quality ?? TEXTURE_QUALITY.HIGH,
    });

    return createTextureResponse(texture, canvas, {
        type: TEXTURE_TYPES.CUSTOM_IMAGE,
        fit: options.fit ?? "cover",
    });
}

export function loadImageElement(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("No se pudo cargar la imagen."));
        image.crossOrigin = "anonymous";
        image.src = src;
    });
}

export async function createTextureFromImageSource(src, options = {}) {
    const image = await loadImageElement(src);
    return createCustomImageTexture(image, options);
}

export async function createLogoImageTexture(variant = LOGO_VARIANTS.LIGHT, options = {}) {
    const logoPath = variant === LOGO_VARIANTS.DARK
        ? ASSET_PATHS.LOGO_DARK
        : ASSET_PATHS.LOGO_LIGHT;

    try {
        return await createTextureFromImageSource(logoPath, {
            size: options.size ?? TEXTURE_SIZES.LOGO_BADGE,
            fit: "contain",
            background: options.background ?? "rgba(255,255,255,0)",
            ...options,
        });
    } catch {
        return createLogoBadgeTexture({
            variant,
            ...options,
        });
    }
}

export function createMaterialFromTexture(texture, options = {}) {
    const materialType = options.materialType ?? "basic";

    const common = {
        map: texture,
        transparent: options.transparent ?? true,
        opacity: options.opacity ?? 1,
        side: options.side ?? THREE.DoubleSide,
    };

    if (materialType === "standard") {
        return new THREE.MeshStandardMaterial({
            ...common,
            roughness: options.roughness ?? 0.42,
            metalness: options.metalness ?? 0.02,
        });
    }

    if (materialType === "physical") {
        return new THREE.MeshPhysicalMaterial({
            ...common,
            roughness: options.roughness ?? 0.28,
            metalness: options.metalness ?? 0.04,
            clearcoat: options.clearcoat ?? 0.35,
            clearcoatRoughness: options.clearcoatRoughness ?? 0.12,
        });
    }

    return new THREE.MeshBasicMaterial(common);
}

export function disposeTextureResource(resource) {
    if (!resource) return;

    if (resource.texture?.dispose) {
        resource.texture.dispose();
    }

    if (resource.dispose) {
        resource.dispose();
    }
}

export function createTextureSet(config = {}) {
    const visual = config.visual ?? {};
    const text = config.text ?? {};
    const qr = config.qr ?? {};
    const beverage = config.beverage ?? {};

    return {
        boxPattern: createPremiumPatternTexture({
            style: visual.boxArtStyle,
            primaryColor: visual.primaryColor,
            secondaryColor: visual.secondaryColor,
            accentColor: visual.accentColor,
        }),

        paperFiller: createPaperFillerTexture({
            style: visual.paperFillerStyle,
        }),

        lidInterior: createLidInteriorTexture({
            style: visual.lidDesignStyle,
            title: text.lidTitle,
            subtitle: text.lidSubtitle,
            message: text.lidMessage,
            qrValue: qr.value,
            primaryColor: visual.primaryColor,
            secondaryColor: visual.secondaryColor,
            accentColor: visual.accentColor,
            textColor: visual.textColor,
        }),

        cardMessage: createCardMessageTexture({
            title: text.cardTitle,
            recipient: text.cardRecipient,
            message: text.cardMessage,
            footer: text.cardFooter,
            accentColor: visual.accentColor,
            textColor: visual.textColor === PREMIUM_COLORS.cream
                ? PREMIUM_COLORS.brownDark
                : visual.textColor,
        }),

        qrCard: createQRCardTexture({
            title: qr.title,
            subtitle: qr.subtitle,
            footer: qr.footer,
            value: qr.value,
            accentColor: visual.accentColor,
        }),

        beverageLabel: createBeverageLabelTexture({
            labelText: beverage.labelText,
            subLabel: beverage.subLabel,
            footerText: beverage.footerText,
            labelBackground: beverage.labelBackground,
            labelTextColor: beverage.labelTextColor,
            labelAccent: beverage.labelAccent ?? visual.accentColor,
            secondaryAccent: beverage.secondaryAccent,
            pattern: beverage.pattern,
        }),

        logoBadge: createLogoBadgeTexture({
            variant: config.logoVariant,
            accentColor: visual.accentColor,
        }),

        keychain: createKeychainTexture({
            text: text.keychainText,
            subtitle: text.keychainSubtitle,
            accentColor: visual.accentColor,
        }),
    };
}

export function disposeTextureSet(textureSet = {}) {
    Object.values(textureSet).forEach((resource) => {
        disposeTextureResource(resource);
    });
}

export const textureFactory = Object.freeze({
    version: TEXTURE_FACTORY_VERSION,
    types: TEXTURE_TYPES,
    sizes: TEXTURE_SIZES,
    quality: TEXTURE_QUALITY,

    createPremiumPatternTexture,
    createBeverageLabelTexture,
    createCardMessageTexture,
    createQRCardTexture,
    createLidInteriorTexture,
    createPaperFillerTexture,
    createLogoBadgeTexture,
    createKeychainTexture,
    createCustomImageTexture,
    createTextureFromImageSource,
    createLogoImageTexture,

    createMaterialFromTexture,
    createTextureSet,
    disposeTextureResource,
    disposeTextureSet,
    loadImageElement,
});
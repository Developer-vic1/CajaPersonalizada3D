import {
    APP_INFO,
    PRODUCT_PRESET_IDS,
    DESIGN_TEMPLATE_IDS,
    VISUAL_THEME_IDS,
    LOGO_VARIANTS,
    BUSINESS_DEFAULTS,
} from "../constants/appConstants.js";

import { OBJECT_KEYS } from "../constants/objectKeys.js";

export const PRICING_VERSION = "1.0.0";

export const PRICE_CURRENCY = Object.freeze({
    code: APP_INFO.CURRENCY,
    symbol: APP_INFO.CURRENCY_SYMBOL,
    locale: APP_INFO.DEFAULT_LOCALE,
});

export const PRICE_STRATEGY_IDS = Object.freeze({
    ACCESSIBLE: "accessible",
    BALANCED: "balanced",
    PREMIUM: "premium",
});

export const DEFAULT_PRICE_STRATEGY = PRICE_STRATEGY_IDS.BALANCED;

export const COST_TYPES = Object.freeze({
    FIXED: "fixed",
    VARIABLE: "variable",
    OPTIONAL: "optional",
    SERVICE: "service",
    DIGITAL: "digital",
    PACKAGING: "packaging",
    LABOR: "labor",
});

export const PRICE_ITEM_CATEGORIES = Object.freeze({
    PACKAGING: "packaging",
    FOOD: "food",
    BEVERAGE: "beverage",
    SOUVENIR: "souvenir",
    DECORATION: "decoration",
    DIGITAL: "digital",
    BRANDING: "branding",
    LABOR: "labor",
    DELIVERY: "delivery",
    OVERHEAD: "overhead",
    DISCOUNT: "discount",
});

export const PRICE_ITEM_KEYS = Object.freeze({
    BOX_BASE: "boxBase",
    PRINTED_EXTERIOR: "printedExterior",
    PRINTED_INTERIOR: "printedInterior",
    INTERNAL_DIVIDERS: "internalDividers",
    PAPER_FILLER: "paperFiller",
    PREMIUM_FINISH: "premiumFinish",

    CARD_MESSAGE: "cardMessage",
    QR_CARD: "qrCard",
    LID_INTERIOR_DESIGN: "lidInteriorDesign",
    CUSTOM_IMAGE_PRINT: "customImagePrint",

    CUPCAKE: "cupcake",
    BEVERAGE: "beverage",
    DECORATIVE_ROSE: "decorativeRose",
    RESIN_KEYCHAIN: "resinKeychain",
    ACRYLIC_KEYCHAIN: "acrylicKeychain",
    CAREER_LOGO_BADGE: "careerLogoBadge",
    THEMATIC_DECORATIONS: "thematicDecorations",

    DESIGN_SERVICE_BASIC: "designServiceBasic",
    DESIGN_SERVICE_STANDARD: "designServiceStandard",
    DESIGN_SERVICE_PREMIUM: "designServicePremium",

    ASSEMBLY_BASIC: "assemblyBasic",
    ASSEMBLY_STANDARD: "assemblyStandard",
    ASSEMBLY_PREMIUM: "assemblyPremium",

    URGENT_ORDER: "urgentOrder",
    DELIVERY_LOCAL: "deliveryLocal",
    DELIVERY_EXTENDED: "deliveryExtended",
});

export const BEVERAGE_PRICE_KEYS = Object.freeze({
    COLA: "cola",
    ORANGE: "orange",
    LEMON: "lemon",
    WATER: "water",
    MINERAL: "mineral",
    SPORT: "sport",
    ENERGY: "energy",
    CUSTOM: "custom",
});

export const BASE_UNIT_COSTS_BOB = Object.freeze({
    [PRICE_ITEM_KEYS.BOX_BASE]: Object.freeze({
        label: "Caja base decorativa",
        category: PRICE_ITEM_CATEGORIES.PACKAGING,
        costType: COST_TYPES.PACKAGING,
        min: 8,
        expected: 12,
        max: 18,
        unit: "unidad",
        required: true,
    }),

    [PRICE_ITEM_KEYS.PRINTED_EXTERIOR]: Object.freeze({
        label: "Diseño o impresión exterior",
        category: PRICE_ITEM_CATEGORIES.BRANDING,
        costType: COST_TYPES.VARIABLE,
        min: 5,
        expected: 9,
        max: 15,
        unit: "unidad",
        required: false,
    }),

    [PRICE_ITEM_KEYS.PRINTED_INTERIOR]: Object.freeze({
        label: "Diseño o impresión interior",
        category: PRICE_ITEM_CATEGORIES.BRANDING,
        costType: COST_TYPES.VARIABLE,
        min: 5,
        expected: 10,
        max: 18,
        unit: "unidad",
        required: false,
    }),

    [PRICE_ITEM_KEYS.INTERNAL_DIVIDERS]: Object.freeze({
        label: "Separadores internos",
        category: PRICE_ITEM_CATEGORIES.PACKAGING,
        costType: COST_TYPES.VARIABLE,
        min: 2,
        expected: 4,
        max: 7,
        unit: "set",
        required: false,
    }),

    [PRICE_ITEM_KEYS.PAPER_FILLER]: Object.freeze({
        label: "Papel decorativo / viruta",
        category: PRICE_ITEM_CATEGORIES.PACKAGING,
        costType: COST_TYPES.VARIABLE,
        min: 2,
        expected: 4,
        max: 8,
        unit: "set",
        required: false,
    }),

    [PRICE_ITEM_KEYS.PREMIUM_FINISH]: Object.freeze({
        label: "Acabado premium negro/dorado",
        category: PRICE_ITEM_CATEGORIES.PACKAGING,
        costType: COST_TYPES.OPTIONAL,
        min: 8,
        expected: 15,
        max: 25,
        unit: "unidad",
        required: false,
    }),

    [PRICE_ITEM_KEYS.CARD_MESSAGE]: Object.freeze({
        label: "Tarjeta personalizada",
        category: PRICE_ITEM_CATEGORIES.DIGITAL,
        costType: COST_TYPES.VARIABLE,
        min: 2,
        expected: 4,
        max: 7,
        unit: "unidad",
        required: true,
    }),

    [PRICE_ITEM_KEYS.QR_CARD]: Object.freeze({
        label: "QR personalizado con contenido digital",
        category: PRICE_ITEM_CATEGORIES.DIGITAL,
        costType: COST_TYPES.DIGITAL,
        min: 2,
        expected: 5,
        max: 10,
        unit: "unidad",
        required: false,
    }),

    [PRICE_ITEM_KEYS.LID_INTERIOR_DESIGN]: Object.freeze({
        label: "Diseño interno de tapa",
        category: PRICE_ITEM_CATEGORIES.BRANDING,
        costType: COST_TYPES.DIGITAL,
        min: 5,
        expected: 10,
        max: 18,
        unit: "unidad",
        required: false,
    }),

    [PRICE_ITEM_KEYS.CUSTOM_IMAGE_PRINT]: Object.freeze({
        label: "Imagen personalizada adicional",
        category: PRICE_ITEM_CATEGORIES.BRANDING,
        costType: COST_TYPES.OPTIONAL,
        min: 4,
        expected: 8,
        max: 15,
        unit: "imagen",
        required: false,
    }),

    [PRICE_ITEM_KEYS.CUPCAKE]: Object.freeze({
        label: "Pastelito / detalle dulce",
        category: PRICE_ITEM_CATEGORIES.FOOD,
        costType: COST_TYPES.VARIABLE,
        min: 5,
        expected: 8,
        max: 14,
        unit: "unidad",
        required: false,
    }),

    [PRICE_ITEM_KEYS.BEVERAGE]: Object.freeze({
        label: "Bebida incluida",
        category: PRICE_ITEM_CATEGORIES.BEVERAGE,
        costType: COST_TYPES.VARIABLE,
        min: 4,
        expected: 7,
        max: 12,
        unit: "unidad",
        required: false,
    }),

    [PRICE_ITEM_KEYS.DECORATIVE_ROSE]: Object.freeze({
        label: "Rosa decorativa",
        category: PRICE_ITEM_CATEGORIES.DECORATION,
        costType: COST_TYPES.VARIABLE,
        min: 3,
        expected: 6,
        max: 12,
        unit: "unidad",
        required: false,
    }),

    [PRICE_ITEM_KEYS.RESIN_KEYCHAIN]: Object.freeze({
        label: "Llavero personalizado en resina",
        category: PRICE_ITEM_CATEGORIES.SOUVENIR,
        costType: COST_TYPES.OPTIONAL,
        min: 12,
        expected: 22,
        max: 35,
        unit: "unidad",
        required: false,
    }),

    [PRICE_ITEM_KEYS.ACRYLIC_KEYCHAIN]: Object.freeze({
        label: "Llavero acrílico o impreso",
        category: PRICE_ITEM_CATEGORIES.SOUVENIR,
        costType: COST_TYPES.OPTIONAL,
        min: 8,
        expected: 12,
        max: 20,
        unit: "unidad",
        required: false,
    }),

    [PRICE_ITEM_KEYS.CAREER_LOGO_BADGE]: Object.freeze({
        label: "Logo de carrera / distintivo académico",
        category: PRICE_ITEM_CATEGORIES.BRANDING,
        costType: COST_TYPES.DIGITAL,
        min: 2,
        expected: 5,
        max: 10,
        unit: "unidad",
        required: false,
    }),

    [PRICE_ITEM_KEYS.THEMATIC_DECORATIONS]: Object.freeze({
        label: "Decoración temática Mundial 2026 + Bolivia",
        category: PRICE_ITEM_CATEGORIES.DECORATION,
        costType: COST_TYPES.OPTIONAL,
        min: 4,
        expected: 9,
        max: 18,
        unit: "set",
        required: false,
    }),

    [PRICE_ITEM_KEYS.DESIGN_SERVICE_BASIC]: Object.freeze({
        label: "Servicio de diseño básico",
        category: PRICE_ITEM_CATEGORIES.LABOR,
        costType: COST_TYPES.SERVICE,
        min: 5,
        expected: 8,
        max: 12,
        unit: "pedido",
        required: true,
    }),

    [PRICE_ITEM_KEYS.DESIGN_SERVICE_STANDARD]: Object.freeze({
        label: "Servicio de diseño estándar",
        category: PRICE_ITEM_CATEGORIES.LABOR,
        costType: COST_TYPES.SERVICE,
        min: 8,
        expected: 14,
        max: 22,
        unit: "pedido",
        required: true,
    }),

    [PRICE_ITEM_KEYS.DESIGN_SERVICE_PREMIUM]: Object.freeze({
        label: "Servicio de diseño premium",
        category: PRICE_ITEM_CATEGORIES.LABOR,
        costType: COST_TYPES.SERVICE,
        min: 15,
        expected: 25,
        max: 40,
        unit: "pedido",
        required: true,
    }),

    [PRICE_ITEM_KEYS.ASSEMBLY_BASIC]: Object.freeze({
        label: "Armado básico",
        category: PRICE_ITEM_CATEGORIES.LABOR,
        costType: COST_TYPES.LABOR,
        min: 3,
        expected: 5,
        max: 8,
        unit: "unidad",
        required: true,
    }),

    [PRICE_ITEM_KEYS.ASSEMBLY_STANDARD]: Object.freeze({
        label: "Armado estándar",
        category: PRICE_ITEM_CATEGORIES.LABOR,
        costType: COST_TYPES.LABOR,
        min: 5,
        expected: 8,
        max: 12,
        unit: "unidad",
        required: true,
    }),

    [PRICE_ITEM_KEYS.ASSEMBLY_PREMIUM]: Object.freeze({
        label: "Armado premium",
        category: PRICE_ITEM_CATEGORIES.LABOR,
        costType: COST_TYPES.LABOR,
        min: 8,
        expected: 14,
        max: 22,
        unit: "unidad",
        required: true,
    }),

    [PRICE_ITEM_KEYS.URGENT_ORDER]: Object.freeze({
        label: "Recargo por pedido urgente",
        category: PRICE_ITEM_CATEGORIES.LABOR,
        costType: COST_TYPES.OPTIONAL,
        min: 10,
        expected: 20,
        max: 35,
        unit: "pedido",
        required: false,
    }),

    [PRICE_ITEM_KEYS.DELIVERY_LOCAL]: Object.freeze({
        label: "Entrega local referencial",
        category: PRICE_ITEM_CATEGORIES.DELIVERY,
        costType: COST_TYPES.OPTIONAL,
        min: 0,
        expected: 10,
        max: 20,
        unit: "pedido",
        required: false,
    }),

    [PRICE_ITEM_KEYS.DELIVERY_EXTENDED]: Object.freeze({
        label: "Entrega extendida referencial",
        category: PRICE_ITEM_CATEGORIES.DELIVERY,
        costType: COST_TYPES.OPTIONAL,
        min: 15,
        expected: 25,
        max: 40,
        unit: "pedido",
        required: false,
    }),
});

export const BEVERAGE_COST_MULTIPLIERS = Object.freeze({
    [BEVERAGE_PRICE_KEYS.COLA]: Object.freeze({
        label: "Cola clásica",
        multiplier: 1,
        extra: 0,
    }),

    [BEVERAGE_PRICE_KEYS.ORANGE]: Object.freeze({
        label: "Naranja",
        multiplier: 1,
        extra: 0,
    }),

    [BEVERAGE_PRICE_KEYS.LEMON]: Object.freeze({
        label: "Lima limón",
        multiplier: 1,
        extra: 0,
    }),

    [BEVERAGE_PRICE_KEYS.WATER]: Object.freeze({
        label: "Agua natural",
        multiplier: 0.85,
        extra: 0,
    }),

    [BEVERAGE_PRICE_KEYS.MINERAL]: Object.freeze({
        label: "Agua mineral",
        multiplier: 1.1,
        extra: 1,
    }),

    [BEVERAGE_PRICE_KEYS.SPORT]: Object.freeze({
        label: "Agua deportiva",
        multiplier: 1.25,
        extra: 2,
    }),

    [BEVERAGE_PRICE_KEYS.ENERGY]: Object.freeze({
        label: "Energizante",
        multiplier: 1.45,
        extra: 4,
    }),

    [BEVERAGE_PRICE_KEYS.CUSTOM]: Object.freeze({
        label: "Bebida personalizada",
        multiplier: 1.25,
        extra: 3,
    }),
});

export const PRESET_PRICING_RULES = Object.freeze({
    [PRODUCT_PRESET_IDS.BASIC]: Object.freeze({
        label: "Caja básica",
        suggestedSalePrice: 45,
        minSalePrice: 35,
        maxSalePrice: 55,
        targetMarginRate: 0.28,
        productionDays: 1,
        includedItems: Object.freeze([
            PRICE_ITEM_KEYS.BOX_BASE,
            PRICE_ITEM_KEYS.CARD_MESSAGE,
            PRICE_ITEM_KEYS.CUPCAKE,
            PRICE_ITEM_KEYS.DECORATIVE_ROSE,
            PRICE_ITEM_KEYS.DESIGN_SERVICE_BASIC,
            PRICE_ITEM_KEYS.ASSEMBLY_BASIC,
        ]),
        optionalItems: Object.freeze([
            PRICE_ITEM_KEYS.QR_CARD,
            PRICE_ITEM_KEYS.PRINTED_EXTERIOR,
            PRICE_ITEM_KEYS.CAREER_LOGO_BADGE,
        ]),
    }),

    [PRODUCT_PRESET_IDS.STANDARD]: Object.freeze({
        label: "Caja estándar",
        suggestedSalePrice: 75,
        minSalePrice: 60,
        maxSalePrice: 90,
        targetMarginRate: 0.32,
        productionDays: 2,
        includedItems: Object.freeze([
            PRICE_ITEM_KEYS.BOX_BASE,
            PRICE_ITEM_KEYS.PRINTED_EXTERIOR,
            PRICE_ITEM_KEYS.INTERNAL_DIVIDERS,
            PRICE_ITEM_KEYS.PAPER_FILLER,
            PRICE_ITEM_KEYS.CARD_MESSAGE,
            PRICE_ITEM_KEYS.CUPCAKE,
            PRICE_ITEM_KEYS.BEVERAGE,
            PRICE_ITEM_KEYS.DECORATIVE_ROSE,
            PRICE_ITEM_KEYS.ACRYLIC_KEYCHAIN,
            PRICE_ITEM_KEYS.CAREER_LOGO_BADGE,
            PRICE_ITEM_KEYS.DESIGN_SERVICE_STANDARD,
            PRICE_ITEM_KEYS.ASSEMBLY_STANDARD,
        ]),
        optionalItems: Object.freeze([
            PRICE_ITEM_KEYS.QR_CARD,
            PRICE_ITEM_KEYS.PRINTED_INTERIOR,
            PRICE_ITEM_KEYS.RESIN_KEYCHAIN,
            PRICE_ITEM_KEYS.THEMATIC_DECORATIONS,
        ]),
    }),

    [PRODUCT_PRESET_IDS.PREMIUM]: Object.freeze({
        label: "Caja premium",
        suggestedSalePrice: 115,
        minSalePrice: 90,
        maxSalePrice: 145,
        targetMarginRate: 0.38,
        productionDays: 2,
        includedItems: Object.freeze([
            PRICE_ITEM_KEYS.BOX_BASE,
            PRICE_ITEM_KEYS.PRINTED_EXTERIOR,
            PRICE_ITEM_KEYS.PRINTED_INTERIOR,
            PRICE_ITEM_KEYS.INTERNAL_DIVIDERS,
            PRICE_ITEM_KEYS.PAPER_FILLER,
            PRICE_ITEM_KEYS.PREMIUM_FINISH,
            PRICE_ITEM_KEYS.CARD_MESSAGE,
            PRICE_ITEM_KEYS.QR_CARD,
            PRICE_ITEM_KEYS.LID_INTERIOR_DESIGN,
            PRICE_ITEM_KEYS.CUPCAKE,
            PRICE_ITEM_KEYS.BEVERAGE,
            PRICE_ITEM_KEYS.DECORATIVE_ROSE,
            PRICE_ITEM_KEYS.RESIN_KEYCHAIN,
            PRICE_ITEM_KEYS.CAREER_LOGO_BADGE,
            PRICE_ITEM_KEYS.THEMATIC_DECORATIONS,
            PRICE_ITEM_KEYS.DESIGN_SERVICE_PREMIUM,
            PRICE_ITEM_KEYS.ASSEMBLY_PREMIUM,
        ]),
        optionalItems: Object.freeze([
            PRICE_ITEM_KEYS.CUSTOM_IMAGE_PRINT,
            PRICE_ITEM_KEYS.URGENT_ORDER,
            PRICE_ITEM_KEYS.DELIVERY_LOCAL,
            PRICE_ITEM_KEYS.DELIVERY_EXTENDED,
        ]),
    }),
});

export const TEMPLATE_PRICING_ADJUSTMENTS = Object.freeze({
    [DESIGN_TEMPLATE_IDS.BASIC]: Object.freeze({
        label: "Plantilla básica",
        priceDelta: 0,
        marginDelta: 0,
        productionDaysDelta: 0,
    }),

    [DESIGN_TEMPLATE_IDS.STANDARD]: Object.freeze({
        label: "Plantilla estándar",
        priceDelta: 0,
        marginDelta: 0.01,
        productionDaysDelta: 0,
    }),

    [DESIGN_TEMPLATE_IDS.PREMIUM]: Object.freeze({
        label: "Plantilla premium",
        priceDelta: 10,
        marginDelta: 0.03,
        productionDaysDelta: 0,
    }),

    [DESIGN_TEMPLATE_IDS.DEFENSE]: Object.freeze({
        label: "Defensa de grado",
        priceDelta: 8,
        marginDelta: 0.02,
        productionDaysDelta: 0,
    }),

    [DESIGN_TEMPLATE_IDS.JURY]: Object.freeze({
        label: "Tribunal / jurado",
        priceDelta: 5,
        marginDelta: 0.02,
        productionDaysDelta: 0,
    }),

    [DESIGN_TEMPLATE_IDS.INSTITUTIONAL]: Object.freeze({
        label: "Institucional",
        priceDelta: 12,
        marginDelta: 0.04,
        productionDaysDelta: 1,
    }),
});

export const THEME_PRICING_ADJUSTMENTS = Object.freeze({
    [VISUAL_THEME_IDS.LIGHT_ACADEMIC]: Object.freeze({
        label: "Académico claro",
        priceDelta: 0,
    }),

    [VISUAL_THEME_IDS.WARM_KRAFT]: Object.freeze({
        label: "Kraft cálido",
        priceDelta: 3,
    }),

    [VISUAL_THEME_IDS.PREMIUM_BLACK_GOLD]: Object.freeze({
        label: "Negro/dorado premium",
        priceDelta: 10,
    }),

    [VISUAL_THEME_IDS.BOLIVIA_TRICOLOR]: Object.freeze({
        label: "Bolivia tricolor",
        priceDelta: 6,
    }),

    [VISUAL_THEME_IDS.TECH_SYSTEMS]: Object.freeze({
        label: "Tecnología / Sistemas",
        priceDelta: 8,
    }),

    [VISUAL_THEME_IDS.WORLD_CUP_2026]: Object.freeze({
        label: "Mundial 2026",
        priceDelta: 8,
    }),
});

export const LOGO_VARIANT_PRICE_RULES = Object.freeze({
    [LOGO_VARIANTS.LIGHT]: Object.freeze({
        label: "Logo claro",
        priceDelta: 0,
    }),

    [LOGO_VARIANTS.DARK]: Object.freeze({
        label: "Logo oscuro",
        priceDelta: 0,
    }),
});

export const OBJECT_TO_PRICE_ITEM_MAP = Object.freeze({
    [OBJECT_KEYS.BOX_BASE]: PRICE_ITEM_KEYS.BOX_BASE,
    [OBJECT_KEYS.BOX_LID]: PRICE_ITEM_KEYS.PRINTED_EXTERIOR,
    [OBJECT_KEYS.INTERNAL_DIVIDERS]: PRICE_ITEM_KEYS.INTERNAL_DIVIDERS,
    [OBJECT_KEYS.PAPER_FILLER]: PRICE_ITEM_KEYS.PAPER_FILLER,

    [OBJECT_KEYS.CARD_MESSAGE]: PRICE_ITEM_KEYS.CARD_MESSAGE,
    [OBJECT_KEYS.QR_CARD]: PRICE_ITEM_KEYS.QR_CARD,
    [OBJECT_KEYS.LID_INTERIOR_DESIGN]: PRICE_ITEM_KEYS.LID_INTERIOR_DESIGN,

    [OBJECT_KEYS.CUPCAKE]: PRICE_ITEM_KEYS.CUPCAKE,
    [OBJECT_KEYS.SODA_BOTTLE]: PRICE_ITEM_KEYS.BEVERAGE,
    [OBJECT_KEYS.DECORATIVE_ROSE]: PRICE_ITEM_KEYS.DECORATIVE_ROSE,
    [OBJECT_KEYS.RESIN_KEYCHAIN]: PRICE_ITEM_KEYS.RESIN_KEYCHAIN,

    [OBJECT_KEYS.CAREER_LOGO_BADGE]: PRICE_ITEM_KEYS.CAREER_LOGO_BADGE,
    [OBJECT_KEYS.CUSTOM_IMAGE_PLANE]: PRICE_ITEM_KEYS.CUSTOM_IMAGE_PRINT,
    [OBJECT_KEYS.THEMATIC_DECORATIONS]: PRICE_ITEM_KEYS.THEMATIC_DECORATIONS,
});

export const PERSONALIZATION_PRICE_RULES = Object.freeze({
    recipientName: Object.freeze({
        label: "Nombre del jurado/docente",
        priceDelta: 0,
        included: true,
    }),

    teamName: Object.freeze({
        label: "Nombre del equipo",
        priceDelta: 0,
        included: true,
    }),

    projectName: Object.freeze({
        label: "Nombre del proyecto",
        priceDelta: 0,
        included: true,
    }),

    message: Object.freeze({
        label: "Mensaje personalizado",
        priceDelta: 0,
        included: true,
    }),

    qrUrl: Object.freeze({
        label: "URL personalizada para QR",
        priceDelta: 0,
        included: true,
    }),

    lidImage: Object.freeze({
        label: "Imagen personalizada para tapa",
        priceDelta: 8,
        included: false,
    }),

    bottleLabelImage: Object.freeze({
        label: "Imagen personalizada para etiqueta de bebida",
        priceDelta: 5,
        included: false,
    }),

    frontStickerImage: Object.freeze({
        label: "Sticker frontal personalizado",
        priceDelta: 5,
        included: false,
    }),
});

export const ORDER_QUANTITY_DISCOUNTS = Object.freeze([
    Object.freeze({
        minQuantity: 1,
        maxQuantity: 2,
        discountRate: 0,
        label: "Pedido individual",
    }),

    Object.freeze({
        minQuantity: 3,
        maxQuantity: 5,
        discountRate: 0.05,
        label: "Pedido por grupo pequeño",
    }),

    Object.freeze({
        minQuantity: 6,
        maxQuantity: 10,
        discountRate: 0.08,
        label: "Pedido por curso o equipo ampliado",
    }),

    Object.freeze({
        minQuantity: 11,
        maxQuantity: 50,
        discountRate: 0.12,
        label: "Pedido institucional",
    }),
]);

export const URGENCY_PRICE_RULES = Object.freeze({
    NORMAL: Object.freeze({
        id: "normal",
        label: "Producción normal",
        priceDelta: 0,
        productionDaysDelta: 0,
    }),

    EXPRESS_48H: Object.freeze({
        id: "express-48h",
        label: "Producción express 48 horas",
        priceDelta: 15,
        productionDaysDelta: -1,
    }),

    URGENT_24H: Object.freeze({
        id: "urgent-24h",
        label: "Producción urgente 24 horas",
        priceDelta: 25,
        productionDaysDelta: -1,
    }),
});

export const DELIVERY_PRICE_RULES = Object.freeze({
    PICKUP: Object.freeze({
        id: "pickup",
        label: "Recojo coordinado",
        priceDelta: 0,
        deliveryDays: 0,
    }),

    LOCAL: Object.freeze({
        id: "local",
        label: "Entrega local",
        priceDelta: 10,
        deliveryDays: 1,
    }),

    EXTENDED: Object.freeze({
        id: "extended",
        label: "Entrega extendida",
        priceDelta: 25,
        deliveryDays: 1,
    }),
});

export const PRICE_ACCESSIBILITY_RANGES = Object.freeze({
    STUDENT_ACCESSIBLE: Object.freeze({
        id: "student-accessible",
        label: "Accesible para estudiantes",
        min: 35,
        max: 80,
    }),

    BALANCED: Object.freeze({
        id: "balanced",
        label: "Equilibrado",
        min: 75,
        max: 115,
    }),

    PREMIUM: Object.freeze({
        id: "premium",
        label: "Premium personalizado",
        min: 110,
        max: 160,
    }),

    INSTITUTIONAL: Object.freeze({
        id: "institutional",
        label: "Institucional o pedido especial",
        min: 150,
        max: 350,
    }),
});

export const BREAK_EVEN_DEFAULTS = Object.freeze({
    fixedMonthlyCosts: Object.freeze({
        workspace: 0,
        basicServices: 0,
        toolsMaintenance: 0,
        marketing: 80,
        transportBase: 50,
        contingency: 50,
    }),

    targetMonthlyUnits: 30,
    minimumViableUnits: 10,
});

export const PROFITABILITY_DEFAULTS = Object.freeze({
    minimumMarginRate: 0.2,
    recommendedMarginRate: 0.32,
    premiumMarginRate: 0.38,
    institutionalMarginRate: 0.42,
});

function roundMoney(value) {
    return Math.round((Number(value) || 0) * 100) / 100;
}

function getCostModeValue(costItem, mode = "expected") {
    if (!costItem) return 0;

    if (mode === "min") return costItem.min;
    if (mode === "max") return costItem.max;

    return costItem.expected;
}

function getQuantityDiscount(quantity = 1) {
    return (
        ORDER_QUANTITY_DISCOUNTS.find(
            (rule) => quantity >= rule.minQuantity && quantity <= rule.maxQuantity,
        ) ?? ORDER_QUANTITY_DISCOUNTS[0]
    );
}

function getAccessibilityRange(total = 0) {
    return (
        Object.values(PRICE_ACCESSIBILITY_RANGES).find(
            (range) => total >= range.min && total <= range.max,
        ) ?? PRICE_ACCESSIBILITY_RANGES.INSTITUTIONAL
    );
}

export function getPresetPricingRule(preset = PRODUCT_PRESET_IDS.PREMIUM) {
    return PRESET_PRICING_RULES[preset] ?? PRESET_PRICING_RULES[PRODUCT_PRESET_IDS.PREMIUM];
}

export function getTemplatePricingAdjustment(templateId = DESIGN_TEMPLATE_IDS.PREMIUM) {
    return (
        TEMPLATE_PRICING_ADJUSTMENTS[templateId] ??
        TEMPLATE_PRICING_ADJUSTMENTS[DESIGN_TEMPLATE_IDS.PREMIUM]
    );
}

export function getThemePricingAdjustment(themeId = VISUAL_THEME_IDS.PREMIUM_BLACK_GOLD) {
    return (
        THEME_PRICING_ADJUSTMENTS[themeId] ??
        THEME_PRICING_ADJUSTMENTS[VISUAL_THEME_IDS.PREMIUM_BLACK_GOLD]
    );
}

export function getPriceItem(itemKey) {
    return BASE_UNIT_COSTS_BOB[itemKey] ?? null;
}

export function getBeverageCostRule(type = BEVERAGE_PRICE_KEYS.COLA) {
    return BEVERAGE_COST_MULTIPLIERS[type] ?? BEVERAGE_COST_MULTIPLIERS[BEVERAGE_PRICE_KEYS.CUSTOM];
}

export function getPriceItemsForPreset(preset = PRODUCT_PRESET_IDS.PREMIUM) {
    const presetRule = getPresetPricingRule(preset);

    return presetRule.includedItems.map((itemKey) => ({
        key: itemKey,
        ...BASE_UNIT_COSTS_BOB[itemKey],
    }));
}

export function estimatePresetCost(
    {
        preset = PRODUCT_PRESET_IDS.PREMIUM,
        templateId = DESIGN_TEMPLATE_IDS.PREMIUM,
        themeId = VISUAL_THEME_IDS.PREMIUM_BLACK_GOLD,
        beverageType = BEVERAGE_PRICE_KEYS.COLA,
        quantity = BUSINESS_DEFAULTS.MIN_ORDER_QUANTITY,
        selectedExtras = [],
        uploadedImages = {},
        urgency = URGENCY_PRICE_RULES.NORMAL.id,
        delivery = DELIVERY_PRICE_RULES.PICKUP.id,
        costMode = "expected",
    } = {},
) {
    const presetRule = getPresetPricingRule(preset);
    const templateAdjustment = getTemplatePricingAdjustment(templateId);
    const themeAdjustment = getThemePricingAdjustment(themeId);
    const quantityDiscount = getQuantityDiscount(quantity);

    const includedBreakdown = presetRule.includedItems.map((itemKey) => {
        const item = BASE_UNIT_COSTS_BOB[itemKey];
        const rawValue = getCostModeValue(item, costMode);

        if (itemKey === PRICE_ITEM_KEYS.BEVERAGE) {
            const beverageRule = getBeverageCostRule(beverageType);

            return {
                key: itemKey,
                label: `${item.label} - ${beverageRule.label}`,
                category: item.category,
                amount: roundMoney(rawValue * beverageRule.multiplier + beverageRule.extra),
                included: true,
            };
        }

        return {
            key: itemKey,
            label: item.label,
            category: item.category,
            amount: roundMoney(rawValue),
            included: true,
        };
    });

    const extraBreakdown = selectedExtras
        .filter((itemKey) => BASE_UNIT_COSTS_BOB[itemKey])
        .map((itemKey) => {
            const item = BASE_UNIT_COSTS_BOB[itemKey];

            return {
                key: itemKey,
                label: item.label,
                category: item.category,
                amount: roundMoney(getCostModeValue(item, costMode)),
                included: false,
            };
        });

    const imageExtras = Object.entries(uploadedImages)
        .filter(([, value]) => Boolean(value))
        .map(([imageKey]) => {
            const rule = PERSONALIZATION_PRICE_RULES[imageKey];

            if (!rule || rule.included) return null;

            return {
                key: imageKey,
                label: rule.label,
                category: PRICE_ITEM_CATEGORIES.BRANDING,
                amount: roundMoney(rule.priceDelta),
                included: false,
            };
        })
        .filter(Boolean);

    const urgencyRule =
        Object.values(URGENCY_PRICE_RULES).find((rule) => rule.id === urgency) ??
        URGENCY_PRICE_RULES.NORMAL;

    const deliveryRule =
        Object.values(DELIVERY_PRICE_RULES).find((rule) => rule.id === delivery) ??
        DELIVERY_PRICE_RULES.PICKUP;

    const adjustmentBreakdown = [
        {
            key: `template:${templateId}`,
            label: templateAdjustment.label,
            category: PRICE_ITEM_CATEGORIES.BRANDING,
            amount: roundMoney(templateAdjustment.priceDelta),
            included: false,
        },
        {
            key: `theme:${themeId}`,
            label: themeAdjustment.label,
            category: PRICE_ITEM_CATEGORIES.DECORATION,
            amount: roundMoney(themeAdjustment.priceDelta),
            included: false,
        },
        {
            key: `urgency:${urgencyRule.id}`,
            label: urgencyRule.label,
            category: PRICE_ITEM_CATEGORIES.LABOR,
            amount: roundMoney(urgencyRule.priceDelta),
            included: false,
        },
        {
            key: `delivery:${deliveryRule.id}`,
            label: deliveryRule.label,
            category: PRICE_ITEM_CATEGORIES.DELIVERY,
            amount: roundMoney(deliveryRule.priceDelta),
            included: false,
        },
    ].filter((item) => item.amount > 0);

    const breakdown = [
        ...includedBreakdown,
        ...extraBreakdown,
        ...imageExtras,
        ...adjustmentBreakdown,
    ];

    const unitCost = roundMoney(
        breakdown.reduce((total, item) => total + item.amount, 0),
    );

    const targetMarginRate = Math.max(
        PROFITABILITY_DEFAULTS.minimumMarginRate,
        presetRule.targetMarginRate + templateAdjustment.marginDelta,
    );

    const calculatedSalePrice = roundMoney(unitCost / (1 - targetMarginRate));
    const suggestedSalePrice = Math.max(
        presetRule.minSalePrice,
        Math.min(
            presetRule.maxSalePrice + templateAdjustment.priceDelta + themeAdjustment.priceDelta,
            Math.max(calculatedSalePrice, presetRule.suggestedSalePrice + templateAdjustment.priceDelta),
        ),
    );

    const subtotal = roundMoney(suggestedSalePrice * quantity);
    const discountAmount = roundMoney(subtotal * quantityDiscount.discountRate);
    const total = roundMoney(subtotal - discountAmount);

    const productionDays = Math.max(
        1,
        presetRule.productionDays +
        templateAdjustment.productionDaysDelta +
        urgencyRule.productionDaysDelta,
    );

    const accessibility = getAccessibilityRange(suggestedSalePrice);

    return {
        currency: PRICE_CURRENCY,
        strategy: DEFAULT_PRICE_STRATEGY,

        preset,
        templateId,
        themeId,
        beverageType,
        quantity,

        unitCost,
        targetMarginRate: roundMoney(targetMarginRate),
        calculatedSalePrice,
        suggestedSalePrice: roundMoney(suggestedSalePrice),

        subtotal,
        discountRate: quantityDiscount.discountRate,
        discountAmount,
        total,

        accessibility,
        quantityDiscount,

        productionDays,
        deliveryDays: deliveryRule.deliveryDays,
        estimatedTotalDays: productionDays + deliveryRule.deliveryDays,

        breakdown,
    };
}

export function estimateBreakEven(
    {
        fixedMonthlyCosts = BREAK_EVEN_DEFAULTS.fixedMonthlyCosts,
        averageSalePrice = PRESET_PRICING_RULES[PRODUCT_PRESET_IDS.STANDARD].suggestedSalePrice,
        averageVariableCost = 48,
    } = {},
) {
    const totalFixedCosts = Object.values(fixedMonthlyCosts).reduce(
        (total, value) => total + (Number(value) || 0),
        0,
    );

    const contributionMargin = averageSalePrice - averageVariableCost;

    if (contributionMargin <= 0) {
        return {
            totalFixedCosts: roundMoney(totalFixedCosts),
            contributionMargin: roundMoney(contributionMargin),
            breakEvenUnits: Infinity,
            viable: false,
        };
    }

    return {
        totalFixedCosts: roundMoney(totalFixedCosts),
        contributionMargin: roundMoney(contributionMargin),
        breakEvenUnits: Math.ceil(totalFixedCosts / contributionMargin),
        viable: true,
    };
}

export function formatPrice(amount = 0) {
    return `${PRICE_CURRENCY.symbol} ${roundMoney(amount).toFixed(2)}`;
}

export const PRICING_RULES = Object.freeze({
    version: PRICING_VERSION,
    currency: PRICE_CURRENCY,

    strategies: PRICE_STRATEGY_IDS,
    defaultStrategy: DEFAULT_PRICE_STRATEGY,

    costTypes: COST_TYPES,
    categories: PRICE_ITEM_CATEGORIES,
    itemKeys: PRICE_ITEM_KEYS,
    beverageKeys: BEVERAGE_PRICE_KEYS,

    unitCosts: BASE_UNIT_COSTS_BOB,
    beverageMultipliers: BEVERAGE_COST_MULTIPLIERS,
    presetRules: PRESET_PRICING_RULES,
    templateAdjustments: TEMPLATE_PRICING_ADJUSTMENTS,
    themeAdjustments: THEME_PRICING_ADJUSTMENTS,
    logoVariantRules: LOGO_VARIANT_PRICE_RULES,
    objectToPriceItemMap: OBJECT_TO_PRICE_ITEM_MAP,
    personalizationRules: PERSONALIZATION_PRICE_RULES,
    quantityDiscounts: ORDER_QUANTITY_DISCOUNTS,
    urgencyRules: URGENCY_PRICE_RULES,
    deliveryRules: DELIVERY_PRICE_RULES,
    accessibilityRanges: PRICE_ACCESSIBILITY_RANGES,
    breakEvenDefaults: BREAK_EVEN_DEFAULTS,
    profitabilityDefaults: PROFITABILITY_DEFAULTS,
});
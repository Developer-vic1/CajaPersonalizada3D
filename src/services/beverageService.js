import {
    BEVERAGE_TYPES,
    BEVERAGE_CATALOG,
    getBeverage,
    getBeverageOptions,
} from "../config/beverageCatalog.js";

import {
    DEFAULT_BEVERAGE_TYPE,
    DEFAULT_BEVERAGE_LAYOUT_MODE,
    BEVERAGE_LAYOUT_MODE,
    FORM_FIELD_KEYS,
} from "../constants/appConstants.js";

import {
    BEVERAGE_PRICE_KEYS,
    BEVERAGE_COST_MULTIPLIERS,
    getBeverageCostRule,
    PRICE_ITEM_KEYS,
    BASE_UNIT_COSTS_BOB,
} from "../data/pricingRules.js";

import { OBJECT_KEYS } from "../constants/objectKeys.js";

export const BEVERAGE_SERVICE_VERSION = "1.0.0";

export const BEVERAGE_CATEGORY_IDS = Object.freeze({
    SODA: "soda",
    WATER: "water",
    SPARKLING_WATER: "sparkling-water",
    SPORT: "sport",
    ENERGY: "energy",
    JUICE: "juice",
    CUSTOM: "custom",
});

export const BEVERAGE_REFERENCE_BRANDS = Object.freeze({
    COLA: Object.freeze({
        category: BEVERAGE_CATEGORY_IDS.SODA,
        references: Object.freeze(["Coca-Cola", "Pepsi"]),
        genericName: "Kick Cola",
        note: "Referencia visual hipotética: bebida cola oscura con etiqueta de alto contraste.",
    }),

    ORANGE: Object.freeze({
        category: BEVERAGE_CATEGORY_IDS.SODA,
        references: Object.freeze(["Fanta", "Crush", "Mirinda"]),
        genericName: "Kick Orange",
        note: "Referencia visual hipotética: bebida naranja, juvenil y llamativa.",
    }),

    LEMON: Object.freeze({
        category: BEVERAGE_CATEGORY_IDS.SODA,
        references: Object.freeze(["Sprite", "7UP"]),
        genericName: "Kick Lemon",
        note: "Referencia visual hipotética: lima-limón transparente o verdosa.",
    }),

    WATER: Object.freeze({
        category: BEVERAGE_CATEGORY_IDS.WATER,
        references: Object.freeze(["Vital", "Cielo", "Dasani"]),
        genericName: "Pure Water",
        note: "Referencia visual hipotética: agua natural transparente con etiqueta azul/blanca.",
    }),

    MINERAL: Object.freeze({
        category: BEVERAGE_CATEGORY_IDS.SPARKLING_WATER,
        references: Object.freeze(["Agua mineral", "Soda water", "Sparkling water"]),
        genericName: "Mineral Blue",
        note: "Referencia visual hipotética: agua mineral con burbujas finas.",
    }),

    SPORT: Object.freeze({
        category: BEVERAGE_CATEGORY_IDS.SPORT,
        references: Object.freeze(["Agua sport", "bebida hidratante", "botella deportiva"]),
        genericName: "Sport Aqua",
        note: "Referencia visual hipotética: botella deportiva con tapa sport.",
    }),

    ENERGY: Object.freeze({
        category: BEVERAGE_CATEGORY_IDS.ENERGY,
        references: Object.freeze(["bebida energizante", "lata energética"]),
        genericName: "Energy Byte",
        note: "Referencia visual hipotética: bebida energética con etiqueta negra/neón.",
    }),

    JUICE: Object.freeze({
        category: BEVERAGE_CATEGORY_IDS.JUICE,
        references: Object.freeze(["jugo frutal", "néctar", "bebida saborizada"]),
        genericName: "Fruit Kick",
        note: "Referencia visual hipotética: bebida frutal con colores cálidos.",
    }),
});

export const BEVERAGE_USE_CASES = Object.freeze({
    BASIC_BOX: "basic-box",
    STANDARD_BOX: "standard-box",
    PREMIUM_BOX: "premium-box",
    DEFENSE_BOX: "defense-box",
    JURY_BOX: "jury-box",
    INSTITUTIONAL_BOX: "institutional-box",
});

export const BEVERAGE_RENDER_HINTS = Object.freeze({
    TRANSPARENT_PLASTIC: "transparent-plastic",
    DARK_PLASTIC: "dark-plastic",
    SPORT_BOTTLE: "sport-bottle",
    SLIM_CAN: "slim-can",
    CLEAR_WATER: "clear-water",
    CARBONATED: "carbonated",
});

export const BEVERAGE_ANIMATION_TYPES = Object.freeze({
    NONE: "none",
    SOFT_REFLECTION: "soft-reflection",
    CARBONATION: "carbonation",
    MINERAL_BUBBLES: "mineral-bubbles",
    CONDENSATION: "condensation",
    ENERGY_PULSE: "energy-pulse",
});

export const BEVERAGE_LABEL_PRESETS = Object.freeze({
    [BEVERAGE_TYPES.COLA]: Object.freeze({
        productName: "KICK COLA",
        subLabel: "Classic 2026",
        footerText: "Edición académica",
        styleReference: "cola-premium",
        realWorldReference: BEVERAGE_REFERENCE_BRANDS.COLA,
    }),

    [BEVERAGE_TYPES.ORANGE]: Object.freeze({
        productName: "KICK ORANGE",
        subLabel: "Fresh 2026",
        footerText: "Sabor cítrico",
        styleReference: "orange-soda",
        realWorldReference: BEVERAGE_REFERENCE_BRANDS.ORANGE,
    }),

    [BEVERAGE_TYPES.LEMON]: Object.freeze({
        productName: "KICK LEMON",
        subLabel: "Lime 2026",
        footerText: "Refrescante",
        styleReference: "lime-lemon",
        realWorldReference: BEVERAGE_REFERENCE_BRANDS.LEMON,
    }),

    [BEVERAGE_TYPES.WATER]: Object.freeze({
        productName: "PURE WATER",
        subLabel: "Natural",
        footerText: "Hidratación",
        styleReference: "natural-water",
        realWorldReference: BEVERAGE_REFERENCE_BRANDS.WATER,
    }),

    [BEVERAGE_TYPES.MINERAL]: Object.freeze({
        productName: "MINERAL BLUE",
        subLabel: "Sparkling",
        footerText: "Agua con gas",
        styleReference: "sparkling-water",
        realWorldReference: BEVERAGE_REFERENCE_BRANDS.MINERAL,
    }),

    [BEVERAGE_TYPES.SPORT]: Object.freeze({
        productName: "SPORT AQUA",
        subLabel: "Active 2026",
        footerText: "Mundial Edition",
        styleReference: "sport-water",
        realWorldReference: BEVERAGE_REFERENCE_BRANDS.SPORT,
    }),

    [BEVERAGE_TYPES.ENERGY]: Object.freeze({
        productName: "ENERGY BYTE",
        subLabel: "Tech Boost",
        footerText: "Edición tecnológica",
        styleReference: "energy-tech",
        realWorldReference: BEVERAGE_REFERENCE_BRANDS.ENERGY,
    }),

    [BEVERAGE_TYPES.CUSTOM]: Object.freeze({
        productName: "KICKOFF DRINK",
        subLabel: "Custom",
        footerText: "Tu diseño",
        styleReference: "custom-drink",
        realWorldReference: BEVERAGE_REFERENCE_BRANDS.JUICE,
    }),
});

export const BEVERAGE_PRESENTATION_RULES = Object.freeze({
    [BEVERAGE_TYPES.COLA]: Object.freeze({
        category: BEVERAGE_CATEGORY_IDS.SODA,
        recommendedUseCases: Object.freeze([
            BEVERAGE_USE_CASES.PREMIUM_BOX,
            BEVERAGE_USE_CASES.DEFENSE_BOX,
        ]),
        layoutMode: BEVERAGE_LAYOUT_MODE.HORIZONTAL,
        renderHint: BEVERAGE_RENDER_HINTS.DARK_PLASTIC,
        animationType: BEVERAGE_ANIMATION_TYPES.CARBONATION,
        premiumScore: 92,
        accessibilityScore: 85,
        description:
            "Bebida oscura tipo cola, adecuada para caja premium negra/dorada y estética de defensa.",
    }),

    [BEVERAGE_TYPES.ORANGE]: Object.freeze({
        category: BEVERAGE_CATEGORY_IDS.SODA,
        recommendedUseCases: Object.freeze([
            BEVERAGE_USE_CASES.STANDARD_BOX,
            BEVERAGE_USE_CASES.INSTITUTIONAL_BOX,
        ]),
        layoutMode: BEVERAGE_LAYOUT_MODE.HORIZONTAL,
        renderHint: BEVERAGE_RENDER_HINTS.CARBONATED,
        animationType: BEVERAGE_ANIMATION_TYPES.CARBONATION,
        premiumScore: 74,
        accessibilityScore: 88,
        description:
            "Bebida naranja con presencia visual juvenil, útil para una caja estándar o más llamativa.",
    }),

    [BEVERAGE_TYPES.LEMON]: Object.freeze({
        category: BEVERAGE_CATEGORY_IDS.SODA,
        recommendedUseCases: Object.freeze([
            BEVERAGE_USE_CASES.STANDARD_BOX,
            BEVERAGE_USE_CASES.INSTITUTIONAL_BOX,
        ]),
        layoutMode: BEVERAGE_LAYOUT_MODE.HORIZONTAL,
        renderHint: BEVERAGE_RENDER_HINTS.CARBONATED,
        animationType: BEVERAGE_ANIMATION_TYPES.CARBONATION,
        premiumScore: 76,
        accessibilityScore: 87,
        description:
            "Bebida lima-limón transparente o verdosa, asociada a frescura y estética deportiva.",
    }),

    [BEVERAGE_TYPES.WATER]: Object.freeze({
        category: BEVERAGE_CATEGORY_IDS.WATER,
        recommendedUseCases: Object.freeze([
            BEVERAGE_USE_CASES.BASIC_BOX,
            BEVERAGE_USE_CASES.JURY_BOX,
        ]),
        layoutMode: BEVERAGE_LAYOUT_MODE.HORIZONTAL,
        renderHint: BEVERAGE_RENDER_HINTS.CLEAR_WATER,
        animationType: BEVERAGE_ANIMATION_TYPES.CONDENSATION,
        premiumScore: 70,
        accessibilityScore: 95,
        description:
            "Agua natural, opción limpia, económica y formal para docentes o jurados.",
    }),

    [BEVERAGE_TYPES.MINERAL]: Object.freeze({
        category: BEVERAGE_CATEGORY_IDS.SPARKLING_WATER,
        recommendedUseCases: Object.freeze([
            BEVERAGE_USE_CASES.JURY_BOX,
            BEVERAGE_USE_CASES.PREMIUM_BOX,
        ]),
        layoutMode: BEVERAGE_LAYOUT_MODE.HORIZONTAL,
        renderHint: BEVERAGE_RENDER_HINTS.CLEAR_WATER,
        animationType: BEVERAGE_ANIMATION_TYPES.MINERAL_BUBBLES,
        premiumScore: 84,
        accessibilityScore: 78,
        description:
            "Agua mineral con burbujas finas, más formal y premium que el agua natural.",
    }),

    [BEVERAGE_TYPES.SPORT]: Object.freeze({
        category: BEVERAGE_CATEGORY_IDS.SPORT,
        recommendedUseCases: Object.freeze([
            BEVERAGE_USE_CASES.INSTITUTIONAL_BOX,
            BEVERAGE_USE_CASES.DEFENSE_BOX,
        ]),
        layoutMode: BEVERAGE_LAYOUT_MODE.HORIZONTAL,
        renderHint: BEVERAGE_RENDER_HINTS.SPORT_BOTTLE,
        animationType: BEVERAGE_ANIMATION_TYPES.CONDENSATION,
        premiumScore: 82,
        accessibilityScore: 74,
        description:
            "Agua deportiva conectada con la temática Mundial 2026 y una lectura más dinámica.",
    }),

    [BEVERAGE_TYPES.ENERGY]: Object.freeze({
        category: BEVERAGE_CATEGORY_IDS.ENERGY,
        recommendedUseCases: Object.freeze([
            BEVERAGE_USE_CASES.PREMIUM_BOX,
            BEVERAGE_USE_CASES.DEFENSE_BOX,
        ]),
        layoutMode: BEVERAGE_LAYOUT_MODE.HORIZONTAL,
        renderHint: BEVERAGE_RENDER_HINTS.SLIM_CAN,
        animationType: BEVERAGE_ANIMATION_TYPES.ENERGY_PULSE,
        premiumScore: 86,
        accessibilityScore: 65,
        description:
            "Bebida energética de estilo tecnológico, útil si se quiere reforzar Ingeniería de Sistemas.",
    }),

    [BEVERAGE_TYPES.CUSTOM]: Object.freeze({
        category: BEVERAGE_CATEGORY_IDS.CUSTOM,
        recommendedUseCases: Object.freeze([
            BEVERAGE_USE_CASES.PREMIUM_BOX,
            BEVERAGE_USE_CASES.STANDARD_BOX,
        ]),
        layoutMode: BEVERAGE_LAYOUT_MODE.HORIZONTAL,
        renderHint: BEVERAGE_RENDER_HINTS.TRANSPARENT_PLASTIC,
        animationType: BEVERAGE_ANIMATION_TYPES.SOFT_REFLECTION,
        premiumScore: 80,
        accessibilityScore: 80,
        description:
            "Bebida personalizada para adaptar colores, etiqueta y mensaje al pedido.",
    }),
});

export const BEVERAGE_SCENE_PRESETS = Object.freeze({
    [BEVERAGE_TYPES.COLA]: Object.freeze({
        position: [0.64, 0.55, 0.44],
        rotation: [0, 0, Math.PI / 2],
        scale: [0.78, 0.78, 0.78],
        labelSide: "front-up",
        recommendedCameraNote: "La etiqueta debe quedar visible desde vista producto.",
    }),

    [BEVERAGE_TYPES.ORANGE]: Object.freeze({
        position: [0.62, 0.55, 0.44],
        rotation: [0, 0, Math.PI / 2],
        scale: [0.76, 0.76, 0.76],
        labelSide: "front-up",
        recommendedCameraNote: "Color fuerte, conviene mantenerla en zona central.",
    }),

    [BEVERAGE_TYPES.LEMON]: Object.freeze({
        position: [0.62, 0.55, 0.44],
        rotation: [0, 0, Math.PI / 2],
        scale: [0.76, 0.76, 0.76],
        labelSide: "front-up",
        recommendedCameraNote: "Ideal con iluminación suave para que se vea transparente.",
    }),

    [BEVERAGE_TYPES.WATER]: Object.freeze({
        position: [0.62, 0.55, 0.42],
        rotation: [0, 0, Math.PI / 2],
        scale: [0.74, 0.74, 0.74],
        labelSide: "front-up",
        recommendedCameraNote: "Requiere brillos y gotas sutiles para verse real.",
    }),

    [BEVERAGE_TYPES.MINERAL]: Object.freeze({
        position: [0.62, 0.55, 0.42],
        rotation: [0, 0, Math.PI / 2],
        scale: [0.74, 0.74, 0.74],
        labelSide: "front-up",
        recommendedCameraNote: "Las burbujas pequeñas deben reforzar el efecto mineral.",
    }),

    [BEVERAGE_TYPES.SPORT]: Object.freeze({
        position: [0.58, 0.55, 0.4],
        rotation: [0, 0, Math.PI / 2],
        scale: [0.72, 0.72, 0.72],
        labelSide: "front-up",
        recommendedCameraNote: "La tapa sport debe quedar visible y no tapar el llavero.",
    }),

    [BEVERAGE_TYPES.ENERGY]: Object.freeze({
        position: [0.64, 0.55, 0.44],
        rotation: [0, 0, Math.PI / 2],
        scale: [0.72, 0.72, 0.72],
        labelSide: "front-up",
        recommendedCameraNote: "Funciona mejor con reflejo metálico y acento tecnológico.",
    }),

    [BEVERAGE_TYPES.CUSTOM]: Object.freeze({
        position: [0.64, 0.55, 0.44],
        rotation: [0, 0, Math.PI / 2],
        scale: [0.76, 0.76, 0.76],
        labelSide: "front-up",
        recommendedCameraNote: "Permite ajustar etiqueta y colores personalizados.",
    }),
});

const BEVERAGE_TYPE_ALIASES = Object.freeze({
    cola: BEVERAGE_TYPES.COLA,
    coca: BEVERAGE_TYPES.COLA,
    cocacola: BEVERAGE_TYPES.COLA,
    "coca-cola": BEVERAGE_TYPES.COLA,
    pepsi: BEVERAGE_TYPES.COLA,

    naranja: BEVERAGE_TYPES.ORANGE,
    orange: BEVERAGE_TYPES.ORANGE,
    fanta: BEVERAGE_TYPES.ORANGE,
    crush: BEVERAGE_TYPES.ORANGE,
    mirinda: BEVERAGE_TYPES.ORANGE,

    limon: BEVERAGE_TYPES.LEMON,
    limón: BEVERAGE_TYPES.LEMON,
    lima: BEVERAGE_TYPES.LEMON,
    lemon: BEVERAGE_TYPES.LEMON,
    sprite: BEVERAGE_TYPES.LEMON,
    "7up": BEVERAGE_TYPES.LEMON,
    sevenup: BEVERAGE_TYPES.LEMON,

    agua: BEVERAGE_TYPES.WATER,
    water: BEVERAGE_TYPES.WATER,
    vital: BEVERAGE_TYPES.WATER,
    cielo: BEVERAGE_TYPES.WATER,
    dasani: BEVERAGE_TYPES.WATER,

    mineral: BEVERAGE_TYPES.MINERAL,
    sparkling: BEVERAGE_TYPES.MINERAL,
    "agua mineral": BEVERAGE_TYPES.MINERAL,
    "con gas": BEVERAGE_TYPES.MINERAL,

    sport: BEVERAGE_TYPES.SPORT,
    deportiva: BEVERAGE_TYPES.SPORT,
    "agua sport": BEVERAGE_TYPES.SPORT,
    hidratante: BEVERAGE_TYPES.SPORT,

    energy: BEVERAGE_TYPES.ENERGY,
    energizante: BEVERAGE_TYPES.ENERGY,
    energetica: BEVERAGE_TYPES.ENERGY,
    energética: BEVERAGE_TYPES.ENERGY,

    jugo: BEVERAGE_TYPES.CUSTOM,
    juice: BEVERAGE_TYPES.CUSTOM,
    frutal: BEVERAGE_TYPES.CUSTOM,
    personalizada: BEVERAGE_TYPES.CUSTOM,
    custom: BEVERAGE_TYPES.CUSTOM,
});

function isPlainObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cloneDeep(value) {
    if (typeof structuredClone === "function") {
        try {
            return structuredClone(value);
        } catch {
            return cloneDeepFallback(value);
        }
    }

    return cloneDeepFallback(value);
}

function cloneDeepFallback(value) {
    if (Array.isArray(value)) {
        return value.map((item) => cloneDeepFallback(item));
    }

    if (isPlainObject(value)) {
        return Object.fromEntries(
            Object.entries(value).map(([key, item]) => [key, cloneDeepFallback(item)]),
        );
    }

    return value;
}

function mergeDeep(base, override) {
    if (!isPlainObject(base) || !isPlainObject(override)) {
        return cloneDeep(override ?? base);
    }

    const result = cloneDeep(base);

    Object.entries(override).forEach(([key, value]) => {
        if (isPlainObject(value) && isPlainObject(result[key])) {
            result[key] = mergeDeep(result[key], value);
            return;
        }

        result[key] = cloneDeep(value);
    });

    return result;
}

function normalizeString(value = "") {
    return String(value)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function roundMoney(value) {
    return Math.round((Number(value) || 0) * 100) / 100;
}

function getBaseBeverageCost() {
    return BASE_UNIT_COSTS_BOB[PRICE_ITEM_KEYS.BEVERAGE]?.expected ?? 7;
}

function resolveKnownType(value = DEFAULT_BEVERAGE_TYPE) {
    if (Object.values(BEVERAGE_TYPES).includes(value)) {
        return value;
    }

    const normalized = normalizeString(value);

    return BEVERAGE_TYPE_ALIASES[normalized] ?? DEFAULT_BEVERAGE_TYPE;
}

function getBeverageLabelPreset(type = DEFAULT_BEVERAGE_TYPE) {
    return BEVERAGE_LABEL_PRESETS[resolveKnownType(type)] ?? BEVERAGE_LABEL_PRESETS[BEVERAGE_TYPES.CUSTOM];
}

function getBeveragePresentationRule(type = DEFAULT_BEVERAGE_TYPE) {
    return BEVERAGE_PRESENTATION_RULES[resolveKnownType(type)] ?? BEVERAGE_PRESENTATION_RULES[BEVERAGE_TYPES.CUSTOM];
}

function getBeverageScenePreset(type = DEFAULT_BEVERAGE_TYPE) {
    return BEVERAGE_SCENE_PRESETS[resolveKnownType(type)] ?? BEVERAGE_SCENE_PRESETS[BEVERAGE_TYPES.CUSTOM];
}

export function normalizeBeverageType(value = DEFAULT_BEVERAGE_TYPE) {
    return resolveKnownType(value);
}

export function isValidBeverageType(value) {
    return Object.values(BEVERAGE_TYPES).includes(value);
}

export function getBeverageByType(type = DEFAULT_BEVERAGE_TYPE) {
    const safeType = normalizeBeverageType(type);

    return cloneDeep(getBeverage(safeType));
}

export function getBeverageCatalog() {
    return cloneDeep(BEVERAGE_CATALOG);
}

export function getBeverageOptionsForUI() {
    return getBeverageOptions().map((option) => {
        const type = normalizeBeverageType(option.id);
        const rule = getBeveragePresentationRule(type);
        const labelPreset = getBeverageLabelPreset(type);
        const costRule = getBeverageCostRule(type);

        return {
            id: type,
            label: option.label,
            shortLabel: option.shortLabel,
            description: option.description,
            category: rule.category,
            premiumScore: rule.premiumScore,
            accessibilityScore: rule.accessibilityScore,
            styleReference: labelPreset.styleReference,
            genericName: labelPreset.realWorldReference.genericName,
            referenceBrands: [...labelPreset.realWorldReference.references],
            priceLabel: costRule.label,
        };
    });
}

export function getBeverageOptionsByCategory(category) {
    return getBeverageOptionsForUI().filter((option) => option.category === category);
}

export function getBeverageReferences(type = DEFAULT_BEVERAGE_TYPE) {
    const labelPreset = getBeverageLabelPreset(type);

    return cloneDeep(labelPreset.realWorldReference);
}

export function getBeverageVisualConfig(type = DEFAULT_BEVERAGE_TYPE, overrides = {}) {
    const safeType = normalizeBeverageType(type);
    const beverage = getBeverageByType(safeType);
    const labelPreset = getBeverageLabelPreset(safeType);
    const rule = getBeveragePresentationRule(safeType);
    const scenePreset = getBeverageScenePreset(safeType);

    return mergeDeep(
        {
            ...beverage,
            beverageType: safeType,

            labelText: labelPreset.productName,
            subLabel: labelPreset.subLabel,
            footerText: labelPreset.footerText,

            category: rule.category,
            layoutMode: rule.layoutMode,
            renderHint: rule.renderHint,
            animationType: rule.animationType,
            scenePreset,
            styleReference: labelPreset.styleReference,
            referenceBrands: [...labelPreset.realWorldReference.references],
            referenceNote: labelPreset.realWorldReference.note,
        },
        overrides,
    );
}

export function createBeverageState(type = DEFAULT_BEVERAGE_TYPE, overrides = {}) {
    const safeType = normalizeBeverageType(type);
    const visual = getBeverageVisualConfig(safeType, overrides.visual ?? {});
    const rule = getBeveragePresentationRule(safeType);
    const labelPreset = getBeverageLabelPreset(safeType);

    return mergeDeep(
        {
            type: safeType,
            layoutMode: rule.layoutMode ?? DEFAULT_BEVERAGE_LAYOUT_MODE,
            labelText: labelPreset.productName,
            subLabel: labelPreset.subLabel,
            footerText: labelPreset.footerText,
            customLiquidColor: null,
            customCapColor: null,
            customLabelColor: null,
            customLabelImage: null,
            showBubbles: Boolean(visual.bubbles),
            showCondensation: Boolean(visual.condensation),
            showHighlights: true,
        },
        overrides,
    );
}

export function createBeverageBottleOptions(type = DEFAULT_BEVERAGE_TYPE, state = {}, overrides = {}) {
    const safeType = normalizeBeverageType(type ?? state.type);
    const visual = getBeverageVisualConfig(safeType);

    return mergeDeep(
        visual,
        {
            beverageType: safeType,
            labelText: state.labelText ?? visual.labelText,
            subLabel: state.subLabel ?? visual.subLabel,
            footerText: state.footerText ?? visual.footerText,
            liquidColor: state.customLiquidColor ?? visual.liquidColor,
            capColor: state.customCapColor ?? visual.capColor,
            labelAccent: state.customLabelColor ?? visual.labelAccent,
            showBubbles: state.showBubbles ?? visual.bubbles,
            showCondensation: state.showCondensation ?? visual.condensation,
            showHighlights: state.showHighlights ?? true,
            customLabelImage: state.customLabelImage ?? null,
        },
    );
}

export function createBeverageSceneConfig(type = DEFAULT_BEVERAGE_TYPE, state = {}, overrides = {}) {
    const safeType = normalizeBeverageType(type ?? state.type);
    const scenePreset = getBeverageScenePreset(safeType);
    const visual = getBeverageVisualConfig(safeType);
    const rule = getBeveragePresentationRule(safeType);

    return mergeDeep(
        {
            objectKey: OBJECT_KEYS.SODA_BOTTLE,
            type: safeType,
            visible: true,
            layoutMode: state.layoutMode ?? rule.layoutMode,
            transform: scenePreset,
            animationType: rule.animationType,
            renderHint: rule.renderHint,
            bottleOptions: createBeverageBottleOptions(safeType, state),
            metadata: {
                category: rule.category,
                description: rule.description,
                premiumScore: rule.premiumScore,
                accessibilityScore: rule.accessibilityScore,
                styleReference: visual.styleReference,
                references: visual.referenceBrands,
                generatedAt: new Date().toISOString(),
            },
        },
        overrides,
    );
}

export function getBeveragePricePreview(type = DEFAULT_BEVERAGE_TYPE, options = {}) {
    const safeType = normalizeBeverageType(type);
    const baseCost = options.baseCost ?? getBaseBeverageCost();
    const costRule = getBeverageCostRule(safeType);
    const quantity = Number(options.quantity ?? 1);
    const customLabelExtra = options.customLabelImage ? 5 : 0;
    const customDesignExtra = options.customDesign ? 3 : 0;

    const unitCost = roundMoney(baseCost * costRule.multiplier + costRule.extra + customLabelExtra + customDesignExtra);
    const total = roundMoney(unitCost * quantity);

    return {
        type: safeType,
        label: costRule.label,
        currency: "BOB",
        symbol: "Bs",
        baseCost: roundMoney(baseCost),
        multiplier: costRule.multiplier,
        extra: costRule.extra,
        customLabelExtra,
        customDesignExtra,
        unitCost,
        quantity,
        total,
    };
}

export function recommendBeverage(context = {}) {
    const candidates = Object.values(BEVERAGE_TYPES).map((type) => {
        const rule = getBeveragePresentationRule(type);
        let score = 0;

        if (context.premium) score += rule.premiumScore * 0.45;
        if (context.accessible || context.studentBudget) score += rule.accessibilityScore * 0.45;
        if (context.defense && rule.recommendedUseCases.includes(BEVERAGE_USE_CASES.DEFENSE_BOX)) score += 25;
        if (context.jury && rule.recommendedUseCases.includes(BEVERAGE_USE_CASES.JURY_BOX)) score += 25;
        if (context.institutional && rule.recommendedUseCases.includes(BEVERAGE_USE_CASES.INSTITUTIONAL_BOX)) score += 25;
        if (context.standard && rule.recommendedUseCases.includes(BEVERAGE_USE_CASES.STANDARD_BOX)) score += 20;
        if (context.basic && rule.recommendedUseCases.includes(BEVERAGE_USE_CASES.BASIC_BOX)) score += 20;
        if (context.tech && type === BEVERAGE_TYPES.ENERGY) score += 18;
        if (context.worldCup && [BEVERAGE_TYPES.SPORT, BEVERAGE_TYPES.LEMON, BEVERAGE_TYPES.COLA].includes(type)) score += 12;

        return {
            type,
            score: roundMoney(score),
            rule,
            beverage: getBeverageByType(type),
            pricePreview: getBeveragePricePreview(type),
        };
    });

    candidates.sort((a, b) => b.score - a.score);

    const best = candidates[0] ?? {
        type: DEFAULT_BEVERAGE_TYPE,
        score: 0,
        rule: getBeveragePresentationRule(DEFAULT_BEVERAGE_TYPE),
        beverage: getBeverageByType(DEFAULT_BEVERAGE_TYPE),
        pricePreview: getBeveragePricePreview(DEFAULT_BEVERAGE_TYPE),
    };

    return {
        recommendedType: best.type,
        beverage: best.beverage,
        reason: createRecommendationReason(best.type, context),
        candidates,
    };
}

function createRecommendationReason(type, context = {}) {
    const safeType = normalizeBeverageType(type);
    const rule = getBeveragePresentationRule(safeType);
    const refs = getBeverageReferences(safeType);

    if (context.jury) {
        return `${rule.description} Se recomienda para jurado por su presentación formal. Referencia hipotética: ${refs.references.join(", ")}.`;
    }

    if (context.defense) {
        return `${rule.description} Se recomienda para defensa porque acompaña la estética de empaque académico y presentación final. Referencia hipotética: ${refs.references.join(", ")}.`;
    }

    if (context.institutional) {
        return `${rule.description} Se recomienda para evento institucional por su lectura visual ordenada. Referencia hipotética: ${refs.references.join(", ")}.`;
    }

    if (context.studentBudget) {
        return `${rule.description} Se recomienda considerando accesibilidad de precio. Referencia hipotética: ${refs.references.join(", ")}.`;
    }

    return `${rule.description} Referencia hipotética: ${refs.references.join(", ")}.`;
}

export function updateBeverageState(currentState = {}, patch = {}) {
    const nextType = normalizeBeverageType(patch.type ?? currentState.type ?? DEFAULT_BEVERAGE_TYPE);
    const baseState = createBeverageState(nextType, currentState);

    return mergeDeep(baseState, {
        ...patch,
        type: nextType,
    });
}

export function updateBeverageFromFormField(currentState = {}, fieldKey, value) {
    if (fieldKey === FORM_FIELD_KEYS.BEVERAGE_TYPE) {
        return updateBeverageState(currentState, {
            type: normalizeBeverageType(value),
        });
    }

    if (fieldKey === FORM_FIELD_KEYS.BEVERAGE_LABEL_TEXT) {
        return updateBeverageState(currentState, {
            labelText: value,
        });
    }

    if (fieldKey === FORM_FIELD_KEYS.LABEL_IMAGE) {
        return updateBeverageState(currentState, {
            customLabelImage: value,
        });
    }

    return cloneDeep(currentState);
}

export function validateBeverageState(state = {}) {
    const errors = [];
    const warnings = [];
    const type = normalizeBeverageType(state.type);

    if (!isValidBeverageType(type)) {
        errors.push(`Tipo de bebida no válido: ${state.type}`);
    }

    if (!state.labelText || String(state.labelText).trim().length < 2) {
        warnings.push("La etiqueta de bebida está vacía o es demasiado corta.");
    }

    if (state.customLabelImage && typeof state.customLabelImage !== "string") {
        warnings.push("La imagen personalizada de etiqueta debería estar representada como URL o dataURL.");
    }

    if (state.layoutMode && !Object.values(BEVERAGE_LAYOUT_MODE).includes(state.layoutMode)) {
        warnings.push(`Modo de layout de bebida no reconocido: ${state.layoutMode}`);
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        normalizedType: type,
        checkedAt: new Date().toISOString(),
    };
}

export function createBeverageChangeResult(previousState = {}, nextType = DEFAULT_BEVERAGE_TYPE, overrides = {}) {
    const previousType = normalizeBeverageType(previousState.type ?? DEFAULT_BEVERAGE_TYPE);
    const safeNextType = normalizeBeverageType(nextType);
    const nextState = updateBeverageState(previousState, {
        ...createBeverageState(safeNextType),
        ...overrides,
        type: safeNextType,
    });

    return {
        changed: previousType !== safeNextType,
        previousType,
        nextType: safeNextType,
        previousState: cloneDeep(previousState),
        nextState,
        visualConfig: getBeverageVisualConfig(safeNextType),
        sceneConfig: createBeverageSceneConfig(safeNextType, nextState),
        pricePreview: getBeveragePricePreview(safeNextType, {
            customLabelImage: Boolean(nextState.customLabelImage),
        }),
        validation: validateBeverageState(nextState),
        changedAt: new Date().toISOString(),
    };
}

export function prepareBeverageForSceneComposer(state = {}) {
    const beverageState = updateBeverageState(state);
    const type = normalizeBeverageType(beverageState.type);

    return {
        objectKey: OBJECT_KEYS.SODA_BOTTLE,
        type,
        state: beverageState,
        visualConfig: getBeverageVisualConfig(type),
        bottleOptions: createBeverageBottleOptions(type, beverageState),
        sceneConfig: createBeverageSceneConfig(type, beverageState),
        pricePreview: getBeveragePricePreview(type, {
            customLabelImage: Boolean(beverageState.customLabelImage),
        }),
        validation: validateBeverageState(beverageState),
    };
}

export function getBeverageComparison(leftType, rightType) {
    const left = normalizeBeverageType(leftType);
    const right = normalizeBeverageType(rightType);

    return {
        leftType: left,
        rightType: right,
        changed: left !== right,

        left: {
            beverage: getBeverageByType(left),
            rule: getBeveragePresentationRule(left),
            scenePreset: getBeverageScenePreset(left),
            pricePreview: getBeveragePricePreview(left),
        },

        right: {
            beverage: getBeverageByType(right),
            rule: getBeveragePresentationRule(right),
            scenePreset: getBeverageScenePreset(right),
            pricePreview: getBeveragePricePreview(right),
        },
    };
}

export function getBeverageQualityScore(type = DEFAULT_BEVERAGE_TYPE, context = {}) {
    const safeType = normalizeBeverageType(type);
    const rule = getBeveragePresentationRule(safeType);
    const price = getBeveragePricePreview(safeType);

    let score = rule.premiumScore * 0.45 + rule.accessibilityScore * 0.35;

    if (context.needsCarbonation && rule.animationType === BEVERAGE_ANIMATION_TYPES.CARBONATION) score += 10;
    if (context.needsCondensation && rule.animationType === BEVERAGE_ANIMATION_TYPES.CONDENSATION) score += 10;
    if (context.tech && safeType === BEVERAGE_TYPES.ENERGY) score += 10;
    if (context.worldCup && safeType === BEVERAGE_TYPES.SPORT) score += 10;

    return {
        type: safeType,
        score: Math.min(roundMoney(score), 100),
        level:
            score >= 85
                ? "muy alto"
                : score >= 70
                    ? "alto"
                    : score >= 55
                        ? "medio"
                        : "básico",
        price,
        rule,
        references: getBeverageReferences(safeType),
    };
}

export function getBestBeverageForPremiumBox() {
    return recommendBeverage({
        premium: true,
        defense: true,
        worldCup: true,
    });
}

export function getBestBeverageForJuryBox() {
    return recommendBeverage({
        jury: true,
        premium: true,
    });
}

export function getBestBeverageForStudentBudget() {
    return recommendBeverage({
        studentBudget: true,
        accessible: true,
        basic: true,
    });
}

export function createBeverageSummary(type = DEFAULT_BEVERAGE_TYPE) {
    const safeType = normalizeBeverageType(type);
    const beverage = getBeverageByType(safeType);
    const rule = getBeveragePresentationRule(safeType);
    const references = getBeverageReferences(safeType);
    const price = getBeveragePricePreview(safeType);

    return {
        type: safeType,
        label: beverage.label,
        labelText: getBeverageLabelPreset(safeType).productName,
        category: rule.category,
        description: rule.description,
        genericName: references.genericName,
        hypotheticalReferences: [...references.references],
        referenceNote: references.note,
        renderHint: rule.renderHint,
        animationType: rule.animationType,
        premiumScore: rule.premiumScore,
        accessibilityScore: rule.accessibilityScore,
        unitCost: price.unitCost,
    };
}

export const beverageService = Object.freeze({
    version: BEVERAGE_SERVICE_VERSION,

    categoryIds: BEVERAGE_CATEGORY_IDS,
    referenceBrands: BEVERAGE_REFERENCE_BRANDS,
    useCases: BEVERAGE_USE_CASES,
    renderHints: BEVERAGE_RENDER_HINTS,
    animationTypes: BEVERAGE_ANIMATION_TYPES,

    normalizeBeverageType,
    isValidBeverageType,

    getBeverageByType,
    getBeverageCatalog,
    getBeverageOptionsForUI,
    getBeverageOptionsByCategory,
    getBeverageReferences,
    getBeverageVisualConfig,

    createBeverageState,
    createBeverageBottleOptions,
    createBeverageSceneConfig,
    getBeveragePricePreview,

    recommendBeverage,
    updateBeverageState,
    updateBeverageFromFormField,
    validateBeverageState,
    createBeverageChangeResult,
    prepareBeverageForSceneComposer,

    getBeverageComparison,
    getBeverageQualityScore,
    getBestBeverageForPremiumBox,
    getBestBeverageForJuryBox,
    getBestBeverageForStudentBudget,
    createBeverageSummary,
});
import {
    APP_INFO,
    PRODUCT_PRESET_IDS,
    DESIGN_TEMPLATE_IDS,
    VISUAL_THEME_IDS,
    BUSINESS_DEFAULTS,
} from "../constants/appConstants.js";

import {
    OBJECT_KEYS,
    getObjectCategory,
    getObjectRole,
} from "../constants/objectKeys.js";

import {
    PRICING_VERSION,
    PRICE_CURRENCY,
    PRICE_STRATEGY_IDS,
    DEFAULT_PRICE_STRATEGY,
    PRICE_ITEM_CATEGORIES,
    PRICE_ITEM_KEYS,
    BEVERAGE_PRICE_KEYS,
    BASE_UNIT_COSTS_BOB,
    BEVERAGE_COST_MULTIPLIERS,
    PRESET_PRICING_RULES,
    TEMPLATE_PRICING_ADJUSTMENTS,
    THEME_PRICING_ADJUSTMENTS,
    PERSONALIZATION_PRICE_RULES,
    ORDER_QUANTITY_DISCOUNTS,
    URGENCY_PRICE_RULES,
    DELIVERY_PRICE_RULES,
    PRICE_ACCESSIBILITY_RANGES,
    BREAK_EVEN_DEFAULTS,
    PROFITABILITY_DEFAULTS,
    OBJECT_TO_PRICE_ITEM_MAP,
    estimatePresetCost,
    estimateBreakEven,
    formatPrice,
    getPresetPricingRule,
    getTemplatePricingAdjustment,
    getThemePricingAdjustment,
    getPriceItem,
    getBeverageCostRule,
} from "../data/pricingRules.js";

export const PRICE_ESTIMATOR_VERSION = "1.0.0";

export const ESTIMATE_STATUS = Object.freeze({
    VALID: "valid",
    WARNING: "warning",
    INVALID: "invalid",
});

export const ESTIMATE_MODE = Object.freeze({
    QUICK: "quick",
    DETAILED: "detailed",
    PRESENTATION: "presentation",
    COMMERCIAL: "commercial",
    BREAK_EVEN: "break-even",
});

export const COST_SCENARIO_IDS = Object.freeze({
    MINIMUM: "minimum",
    EXPECTED: "expected",
    MAXIMUM: "maximum",
});

export const PRICE_CONFIDENCE_LEVELS = Object.freeze({
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
});

export const PRICE_RECOMMENDATION_TYPES = Object.freeze({
    KEEP_PRICE: "keep-price",
    RAISE_PRICE: "raise-price",
    LOWER_PRICE: "lower-price",
    REVIEW_COSTS: "review-costs",
    IMPROVE_VALUE: "improve-value",
});

export const VALUE_LEVELS = Object.freeze({
    BASIC: "basic",
    STANDARD: "standard",
    PREMIUM: "premium",
    INSTITUTIONAL: "institutional",
});

export const COMMERCIAL_SCORE_WEIGHTS = Object.freeze({
    margin: 0.32,
    accessibility: 0.24,
    visualValue: 0.22,
    customization: 0.14,
    delivery: 0.08,
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

function roundMoney(value) {
    return Math.round((Number(value) || 0) * 100) / 100;
}

function percent(value) {
    return Math.round((Number(value) || 0) * 10000) / 100;
}

function clamp(value, min, max) {
    return Math.min(Math.max(Number(value) || 0, min), max);
}

function safeArray(value) {
    return Array.isArray(value) ? value : [];
}

function uniqueArray(values = []) {
    return [...new Set(values.filter(Boolean))];
}

function getQuantityDiscount(quantity = 1) {
    return (
        ORDER_QUANTITY_DISCOUNTS.find(
            (rule) => quantity >= rule.minQuantity && quantity <= rule.maxQuantity,
        ) ?? ORDER_QUANTITY_DISCOUNTS[0]
    );
}

function getAccessibilityRange(total = 0) {
    const ranges = Object.values(PRICE_ACCESSIBILITY_RANGES);

    return (
        ranges.find((range) => total >= range.min && total <= range.max) ??
        PRICE_ACCESSIBILITY_RANGES.INSTITUTIONAL
    );
}

function getCostValue(item, scenario = COST_SCENARIO_IDS.EXPECTED) {
    if (!item) return 0;

    if (scenario === COST_SCENARIO_IDS.MINIMUM) return item.min ?? item.expected ?? 0;
    if (scenario === COST_SCENARIO_IDS.MAXIMUM) return item.max ?? item.expected ?? 0;

    return item.expected ?? item.min ?? 0;
}

function resolveUrgencyRule(urgency) {
    return (
        Object.values(URGENCY_PRICE_RULES).find((rule) => rule.id === urgency) ??
        URGENCY_PRICE_RULES.NORMAL
    );
}

function resolveDeliveryRule(delivery) {
    return (
        Object.values(DELIVERY_PRICE_RULES).find((rule) => rule.id === delivery) ??
        DELIVERY_PRICE_RULES.PICKUP
    );
}

function resolvePreset(preset) {
    return Object.values(PRODUCT_PRESET_IDS).includes(preset)
        ? preset
        : PRODUCT_PRESET_IDS.PREMIUM;
}

function resolveTemplateId(templateId) {
    return Object.values(DESIGN_TEMPLATE_IDS).includes(templateId)
        ? templateId
        : DESIGN_TEMPLATE_IDS.PREMIUM;
}

function resolveThemeId(themeId) {
    return Object.values(VISUAL_THEME_IDS).includes(themeId)
        ? themeId
        : VISUAL_THEME_IDS.PREMIUM_BLACK_GOLD;
}

function resolveBeverageType(type) {
    return Object.values(BEVERAGE_PRICE_KEYS).includes(type)
        ? type
        : BEVERAGE_PRICE_KEYS.COLA;
}

function getItemsFromVisibility(visibility = {}) {
    return Object.entries(visibility)
        .filter(([, visible]) => Boolean(visible))
        .map(([objectKey]) => OBJECT_TO_PRICE_ITEM_MAP[objectKey])
        .filter(Boolean);
}

function getImageExtrasFromState(state = {}) {
    const images = state.images ?? {};
    const extras = [];

    if (images.lidImage) extras.push(PRICE_ITEM_KEYS.CUSTOM_IMAGE_PRINT);
    if (images.frontStickerImage) extras.push(PRICE_ITEM_KEYS.CUSTOM_IMAGE_PRINT);
    if (images.bottleLabelImage) extras.push(PRICE_ITEM_KEYS.CUSTOM_IMAGE_PRINT);
    if (images.customLogoImage) extras.push(PRICE_ITEM_KEYS.CUSTOM_IMAGE_PRINT);

    Object.entries(images.uploadedImages ?? {}).forEach(([, value]) => {
        if (value) extras.push(PRICE_ITEM_KEYS.CUSTOM_IMAGE_PRINT);
    });

    return extras;
}

function getPersonalizationExtrasFromState(state = {}) {
    const extras = [];
    const images = state.images ?? {};

    Object.entries(PERSONALIZATION_PRICE_RULES).forEach(([key, rule]) => {
        if (!rule || rule.included) return;

        if (images[key]) {
            extras.push({
                key,
                label: rule.label,
                category: PRICE_ITEM_CATEGORIES.BRANDING,
                amount: roundMoney(rule.priceDelta),
                included: false,
                source: "personalization",
            });
        }
    });

    return extras;
}

function getStateQuantity(state = {}) {
    const quantity = Number(state.customer?.orderQuantity ?? BUSINESS_DEFAULTS.MIN_ORDER_QUANTITY);

    return Math.max(BUSINESS_DEFAULTS.MIN_ORDER_QUANTITY, quantity || 1);
}

function buildCostBreakdownItem(itemKey, options = {}) {
    const item = getPriceItem(itemKey);
    if (!item) return null;

    const scenario = options.scenario ?? COST_SCENARIO_IDS.EXPECTED;
    const baseAmount = getCostValue(item, scenario);

    let amount = baseAmount;
    let label = item.label;

    if (itemKey === PRICE_ITEM_KEYS.BEVERAGE) {
        const beverageRule = getBeverageCostRule(options.beverageType);
        amount = baseAmount * beverageRule.multiplier + beverageRule.extra;
        label = `${item.label} - ${beverageRule.label}`;
    }

    return {
        key: itemKey,
        label,
        category: item.category,
        costType: item.costType,
        amount: roundMoney(amount),
        unit: item.unit,
        required: Boolean(item.required),
        included: options.included ?? true,
        source: options.source ?? "preset",
    };
}

function sumBreakdown(breakdown = []) {
    return roundMoney(
        safeArray(breakdown).reduce((total, item) => total + (Number(item.amount) || 0), 0),
    );
}

function groupBreakdownByCategory(breakdown = []) {
    return safeArray(breakdown).reduce((groups, item) => {
        const category = item.category ?? "uncategorized";

        if (!groups[category]) {
            groups[category] = {
                category,
                total: 0,
                items: [],
            };
        }

        groups[category].items.push(item);
        groups[category].total = roundMoney(groups[category].total + (Number(item.amount) || 0));

        return groups;
    }, {});
}

function calculateMarginMetrics({ salePrice = 0, variableCost = 0, quantity = 1 }) {
    const unitSalePrice = Number(salePrice) || 0;
    const unitVariableCost = Number(variableCost) || 0;
    const safeQuantity = Math.max(1, Number(quantity) || 1);

    const unitContributionMargin = roundMoney(unitSalePrice - unitVariableCost);
    const contributionMarginRatio = unitSalePrice > 0
        ? roundMoney(unitContributionMargin / unitSalePrice)
        : 0;

    const grossProfit = roundMoney(unitContributionMargin * safeQuantity);
    const grossMarginRate = unitSalePrice > 0
        ? roundMoney(unitContributionMargin / unitSalePrice)
        : 0;

    const markupRate = unitVariableCost > 0
        ? roundMoney(unitContributionMargin / unitVariableCost)
        : 0;

    return {
        unitSalePrice: roundMoney(unitSalePrice),
        unitVariableCost: roundMoney(unitVariableCost),
        unitContributionMargin,
        contributionMarginRatio,
        contributionMarginPercent: percent(contributionMarginRatio),
        grossProfit,
        grossMarginRate,
        grossMarginPercent: percent(grossMarginRate),
        markupRate,
        markupPercent: percent(markupRate),
    };
}

function calculateBreakEvenMetrics({
    fixedCosts = BREAK_EVEN_DEFAULTS.fixedMonthlyCosts,
    salePrice = 0,
    variableCost = 0,
    targetUnits = BREAK_EVEN_DEFAULTS.targetMonthlyUnits,
} = {}) {
    const fixedCostTotal = Object.values(fixedCosts ?? {}).reduce(
        (total, value) => total + (Number(value) || 0),
        0,
    );

    const contributionMargin = roundMoney((Number(salePrice) || 0) - (Number(variableCost) || 0));

    if (contributionMargin <= 0) {
        return {
            fixedCostTotal: roundMoney(fixedCostTotal),
            contributionMargin,
            breakEvenUnits: Infinity,
            breakEvenRevenue: Infinity,
            targetUnits,
            targetRevenue: roundMoney((Number(salePrice) || 0) * targetUnits),
            viable: false,
            reason: "El margen de contribución no cubre el costo variable unitario.",
        };
    }

    const breakEvenUnits = Math.ceil(fixedCostTotal / contributionMargin);

    return {
        fixedCostTotal: roundMoney(fixedCostTotal),
        contributionMargin,
        breakEvenUnits,
        breakEvenRevenue: roundMoney(breakEvenUnits * salePrice),
        targetUnits,
        targetRevenue: roundMoney((Number(salePrice) || 0) * targetUnits),
        viable: breakEvenUnits <= targetUnits,
        reason: breakEvenUnits <= targetUnits
            ? "El volumen objetivo cubre el punto de equilibrio."
            : "El volumen objetivo todavía no cubre el punto de equilibrio.",
    };
}

function getCommercialValueLevel(estimate = {}) {
    const price = Number(estimate.suggestedSalePrice ?? estimate.unitSalePrice ?? 0);

    if (price <= 55) return VALUE_LEVELS.BASIC;
    if (price <= 90) return VALUE_LEVELS.STANDARD;
    if (price <= 145) return VALUE_LEVELS.PREMIUM;

    return VALUE_LEVELS.INSTITUTIONAL;
}

function calculateVisualValueScore(state = {}) {
    let score = 0;

    if (state.visibility?.[OBJECT_KEYS.BOX_BASE] !== false) score += 8;
    if (state.visibility?.[OBJECT_KEYS.BOX_LID] !== false) score += 8;
    if (state.visibility?.[OBJECT_KEYS.PAPER_FILLER] !== false) score += 10;
    if (state.visibility?.[OBJECT_KEYS.LID_INTERIOR_DESIGN] !== false) score += 15;
    if (state.visibility?.[OBJECT_KEYS.QR_CARD] !== false) score += 12;
    if (state.visibility?.[OBJECT_KEYS.SODA_BOTTLE] !== false) score += 10;
    if (state.visibility?.[OBJECT_KEYS.RESIN_KEYCHAIN] !== false) score += 12;
    if (state.visibility?.[OBJECT_KEYS.CAREER_LOGO_BADGE] !== false) score += 8;
    if (state.visibility?.[OBJECT_KEYS.THEMATIC_DECORATIONS] !== false) score += 10;
    if (state.product?.themeId === VISUAL_THEME_IDS.PREMIUM_BLACK_GOLD) score += 7;

    return clamp(score, 0, 100);
}

function calculateCustomizationScore(state = {}) {
    let score = 0;

    if (state.project?.recipientName) score += 12;
    if (state.project?.teamName) score += 10;
    if (state.project?.projectName) score += 10;
    if (state.project?.message) score += 14;
    if (state.qr?.enabled && state.qr?.value) score += 16;
    if (state.beverage?.labelText) score += 10;
    if (state.images?.lidImage) score += 10;
    if (state.images?.bottleLabelImage) score += 8;
    if (state.images?.frontStickerImage) score += 6;
    if (state.product?.logoVariant) score += 4;

    return clamp(score, 0, 100);
}

function calculateAccessibilityScore(unitPrice = 0) {
    const price = Number(unitPrice) || 0;

    if (price <= 55) return 100;
    if (price <= 80) return 86;
    if (price <= 115) return 72;
    if (price <= 145) return 58;
    if (price <= 180) return 42;

    return 25;
}

function calculateDeliveryScore(totalDays = 0) {
    const days = Number(totalDays) || 0;

    if (days <= 1) return 100;
    if (days <= 2) return 85;
    if (days <= 3) return 72;
    if (days <= 5) return 55;

    return 35;
}

function calculateCommercialScore({ state, estimate, marginMetrics }) {
    const marginScore = clamp((marginMetrics.grossMarginRate || 0) * 240, 0, 100);
    const accessibilityScore = calculateAccessibilityScore(estimate.suggestedSalePrice);
    const visualValueScore = calculateVisualValueScore(state);
    const customizationScore = calculateCustomizationScore(state);
    const deliveryScore = calculateDeliveryScore(estimate.estimatedTotalDays);

    const total = roundMoney(
        marginScore * COMMERCIAL_SCORE_WEIGHTS.margin +
        accessibilityScore * COMMERCIAL_SCORE_WEIGHTS.accessibility +
        visualValueScore * COMMERCIAL_SCORE_WEIGHTS.visualValue +
        customizationScore * COMMERCIAL_SCORE_WEIGHTS.customization +
        deliveryScore * COMMERCIAL_SCORE_WEIGHTS.delivery,
    );

    return {
        total: clamp(total, 0, 100),
        level:
            total >= 85
                ? "excelente"
                : total >= 72
                    ? "alto"
                    : total >= 58
                        ? "medio"
                        : "riesgoso",
        components: {
            marginScore: roundMoney(marginScore),
            accessibilityScore,
            visualValueScore,
            customizationScore,
            deliveryScore,
        },
        weights: COMMERCIAL_SCORE_WEIGHTS,
    };
}

function createRecommendation({ estimate, marginMetrics, commercialScore, state }) {
    const recommendations = [];

    if (marginMetrics.grossMarginRate < PROFITABILITY_DEFAULTS.minimumMarginRate) {
        recommendations.push({
            type: PRICE_RECOMMENDATION_TYPES.RAISE_PRICE,
            priority: "alta",
            title: "Subir precio o reducir costos",
            detail: "El margen está por debajo del mínimo recomendado para que el producto sea sostenible.",
        });
    }

    if (estimate.suggestedSalePrice > 145 && state.product?.preset !== PRODUCT_PRESET_IDS.PREMIUM) {
        recommendations.push({
            type: PRICE_RECOMMENDATION_TYPES.REVIEW_COSTS,
            priority: "media",
            title: "Revisar costos de versión",
            detail: "El precio se acerca a un rango premium, pero la versión seleccionada no es premium.",
        });
    }

    if (commercialScore.components.accessibilityScore < 55) {
        recommendations.push({
            type: PRICE_RECOMMENDATION_TYPES.IMPROVE_VALUE,
            priority: "media",
            title: "Reforzar valor percibido",
            detail: "El precio puede sentirse alto para estudiantes; conviene resaltar QR, souvenir, acabado y personalización.",
        });
    }

    if (commercialScore.components.visualValueScore >= 75 && marginMetrics.grossMarginRate >= PROFITABILITY_DEFAULTS.recommendedMarginRate) {
        recommendations.push({
            type: PRICE_RECOMMENDATION_TYPES.KEEP_PRICE,
            priority: "normal",
            title: "Precio comercialmente defendible",
            detail: "La combinación visual, personalización y margen permite justificar el precio estimado.",
        });
    }

    if (!recommendations.length) {
        recommendations.push({
            type: PRICE_RECOMMENDATION_TYPES.KEEP_PRICE,
            priority: "normal",
            title: "Precio equilibrado",
            detail: "El precio se mantiene dentro de un rango razonable para una caja personalizada.",
        });
    }

    return recommendations;
}

function normalizeEstimatorInput(input = {}) {
    const state = input.state ?? input;

    return {
        state,
        preset: resolvePreset(input.preset ?? state.product?.preset),
        templateId: resolveTemplateId(input.templateId ?? state.product?.templateId),
        themeId: resolveThemeId(input.themeId ?? state.product?.themeId),
        beverageType: resolveBeverageType(input.beverageType ?? state.beverage?.type),
        quantity: Math.max(1, Number(input.quantity ?? getStateQuantity(state)) || 1),
        urgency: input.urgency ?? state.price?.urgency ?? URGENCY_PRICE_RULES.NORMAL.id,
        delivery: input.delivery ?? state.price?.delivery ?? DELIVERY_PRICE_RULES.PICKUP.id,
        costMode: input.costMode ?? COST_SCENARIO_IDS.EXPECTED,
        selectedExtras: input.selectedExtras,
        uploadedImages: input.uploadedImages,
        fixedMonthlyCosts: input.fixedMonthlyCosts ?? BREAK_EVEN_DEFAULTS.fixedMonthlyCosts,
        targetMonthlyUnits: input.targetMonthlyUnits ?? BREAK_EVEN_DEFAULTS.targetMonthlyUnits,
        strategy: input.strategy ?? DEFAULT_PRICE_STRATEGY,
    };
}

export function createSelectedExtrasFromState(state = {}) {
    return uniqueArray([
        ...getItemsFromVisibility(state.visibility ?? {}),
        ...getImageExtrasFromState(state),
    ]);
}

export function createUploadedImagesFromState(state = {}) {
    return {
        lidImage: state.images?.lidImage ?? null,
        bottleLabelImage: state.images?.bottleLabelImage ?? null,
        frontStickerImage: state.images?.frontStickerImage ?? null,
        customLogoImage: state.images?.customLogoImage ?? null,
        ...(state.images?.uploadedImages ?? {}),
    };
}

export function createDetailedBreakdown(input = {}) {
    const normalized = normalizeEstimatorInput(input);
    const presetRule = getPresetPricingRule(normalized.preset);

    const included = safeArray(presetRule.includedItems)
        .map((itemKey) => buildCostBreakdownItem(itemKey, {
            scenario: normalized.costMode,
            beverageType: normalized.beverageType,
            included: true,
            source: "preset",
        }))
        .filter(Boolean);

    const selectedExtras = normalized.selectedExtras
        ? normalized.selectedExtras
        : createSelectedExtrasFromState(normalized.state);

    const extras = uniqueArray(selectedExtras)
        .filter((itemKey) => !presetRule.includedItems.includes(itemKey))
        .map((itemKey) => buildCostBreakdownItem(itemKey, {
            scenario: normalized.costMode,
            beverageType: normalized.beverageType,
            included: false,
            source: "extra",
        }))
        .filter(Boolean);

    const personalizationExtras = getPersonalizationExtrasFromState(normalized.state);

    const templateAdjustment = getTemplatePricingAdjustment(normalized.templateId);
    const themeAdjustment = getThemePricingAdjustment(normalized.themeId);
    const urgencyRule = resolveUrgencyRule(normalized.urgency);
    const deliveryRule = resolveDeliveryRule(normalized.delivery);

    const adjustments = [
        {
            key: `template:${normalized.templateId}`,
            label: templateAdjustment.label,
            category: PRICE_ITEM_CATEGORIES.BRANDING,
            amount: roundMoney(templateAdjustment.priceDelta),
            included: false,
            source: "template",
        },
        {
            key: `theme:${normalized.themeId}`,
            label: themeAdjustment.label,
            category: PRICE_ITEM_CATEGORIES.DECORATION,
            amount: roundMoney(themeAdjustment.priceDelta),
            included: false,
            source: "theme",
        },
        {
            key: `urgency:${urgencyRule.id}`,
            label: urgencyRule.label,
            category: PRICE_ITEM_CATEGORIES.LABOR,
            amount: roundMoney(urgencyRule.priceDelta),
            included: false,
            source: "urgency",
        },
        {
            key: `delivery:${deliveryRule.id}`,
            label: deliveryRule.label,
            category: PRICE_ITEM_CATEGORIES.DELIVERY,
            amount: roundMoney(deliveryRule.priceDelta),
            included: false,
            source: "delivery",
        },
    ].filter((item) => item.amount > 0);

    const breakdown = [
        ...included,
        ...extras,
        ...personalizationExtras,
        ...adjustments,
    ];

    return {
        included,
        extras,
        personalizationExtras,
        adjustments,
        breakdown,
        grouped: groupBreakdownByCategory(breakdown),
        totals: {
            included: sumBreakdown(included),
            extras: sumBreakdown(extras),
            personalization: sumBreakdown(personalizationExtras),
            adjustments: sumBreakdown(adjustments),
            totalCost: sumBreakdown(breakdown),
        },
    };
}

export function estimateKickOffBoxPrice(input = {}) {
    const normalized = normalizeEstimatorInput(input);

    const selectedExtras = normalized.selectedExtras ??
        createSelectedExtrasFromState(normalized.state);

    const uploadedImages = normalized.uploadedImages ??
        createUploadedImagesFromState(normalized.state);

    const baseEstimate = estimatePresetCost({
        preset: normalized.preset,
        templateId: normalized.templateId,
        themeId: normalized.themeId,
        beverageType: normalized.beverageType,
        quantity: normalized.quantity,
        selectedExtras,
        uploadedImages,
        urgency: normalized.urgency,
        delivery: normalized.delivery,
        costMode: normalized.costMode,
    });

    const detailedBreakdown = createDetailedBreakdown({
        ...normalized,
        selectedExtras,
        uploadedImages,
    });

    const unitCost = detailedBreakdown.totals.totalCost || baseEstimate.unitCost;
    const unitSalePrice = baseEstimate.suggestedSalePrice;
    const quantityDiscount = getQuantityDiscount(normalized.quantity);
    const subtotal = roundMoney(unitSalePrice * normalized.quantity);
    const discountAmount = roundMoney(subtotal * quantityDiscount.discountRate);
    const total = roundMoney(subtotal - discountAmount);

    const marginMetrics = calculateMarginMetrics({
        salePrice: unitSalePrice,
        variableCost: unitCost,
        quantity: normalized.quantity,
    });

    const breakEven = calculateBreakEvenMetrics({
        fixedCosts: normalized.fixedMonthlyCosts,
        salePrice: unitSalePrice,
        variableCost: unitCost,
        targetUnits: normalized.targetMonthlyUnits,
    });

    const commercialScore = calculateCommercialScore({
        state: normalized.state,
        estimate: {
            ...baseEstimate,
            suggestedSalePrice: unitSalePrice,
            estimatedTotalDays: baseEstimate.estimatedTotalDays,
        },
        marginMetrics,
    });

    const recommendations = createRecommendation({
        estimate: {
            ...baseEstimate,
            suggestedSalePrice: unitSalePrice,
        },
        marginMetrics,
        commercialScore,
        state: normalized.state,
    });

    const accessibility = getAccessibilityRange(unitSalePrice);

    const status = marginMetrics.grossMarginRate < PROFITABILITY_DEFAULTS.minimumMarginRate
        ? ESTIMATE_STATUS.WARNING
        : ESTIMATE_STATUS.VALID;

    return {
        status,
        version: PRICE_ESTIMATOR_VERSION,
        pricingVersion: PRICING_VERSION,
        generatedAt: new Date().toISOString(),

        currency: PRICE_CURRENCY,
        strategy: normalized.strategy,
        mode: input.mode ?? ESTIMATE_MODE.DETAILED,

        product: {
            preset: normalized.preset,
            templateId: normalized.templateId,
            themeId: normalized.themeId,
            beverageType: normalized.beverageType,
            quantity: normalized.quantity,
            urgency: normalized.urgency,
            delivery: normalized.delivery,
            valueLevel: getCommercialValueLevel(baseEstimate),
        },

        totals: {
            unitCost: roundMoney(unitCost),
            unitSalePrice: roundMoney(unitSalePrice),
            subtotal,
            discountRate: quantityDiscount.discountRate,
            discountPercent: percent(quantityDiscount.discountRate),
            discountAmount,
            total,
            averageUnitPriceAfterDiscount: roundMoney(total / normalized.quantity),
        },

        margin: marginMetrics,
        breakEven,
        accessibility,
        commercialScore,
        production: {
            productionDays: baseEstimate.productionDays,
            deliveryDays: baseEstimate.deliveryDays,
            estimatedTotalDays: baseEstimate.estimatedTotalDays,
            urgencyRule: resolveUrgencyRule(normalized.urgency),
            deliveryRule: resolveDeliveryRule(normalized.delivery),
        },

        breakdown: detailedBreakdown.breakdown,
        groupedBreakdown: detailedBreakdown.grouped,
        breakdownTotals: detailedBreakdown.totals,
        recommendations,

        rawEstimate: baseEstimate,
    };
}

export function estimateQuickPrice(input = {}) {
    const estimate = estimateKickOffBoxPrice({
        ...input,
        mode: ESTIMATE_MODE.QUICK,
    });

    return {
        status: estimate.status,
        currency: estimate.currency,
        unitSalePrice: estimate.totals.unitSalePrice,
        quantity: estimate.product.quantity,
        subtotal: estimate.totals.subtotal,
        discountAmount: estimate.totals.discountAmount,
        total: estimate.totals.total,
        formattedUnitPrice: formatEstimatorPrice(estimate.totals.unitSalePrice),
        formattedTotal: formatEstimatorPrice(estimate.totals.total),
        accessibility: estimate.accessibility,
        productionDays: estimate.production.productionDays,
        estimatedTotalDays: estimate.production.estimatedTotalDays,
    };
}

export function estimatePresentationPrice(input = {}) {
    const estimate = estimateKickOffBoxPrice({
        ...input,
        mode: ESTIMATE_MODE.PRESENTATION,
    });

    return {
        title: "Estimación comercial KickOff Box",
        subtitle: "Precio referencial para caja personalizada académica",
        currency: estimate.currency,
        product: estimate.product,
        total: estimate.totals.total,
        unitSalePrice: estimate.totals.unitSalePrice,
        unitCost: estimate.totals.unitCost,
        marginPercent: estimate.margin.grossMarginPercent,
        accessibilityLabel: estimate.accessibility.label,
        commercialScore: estimate.commercialScore,
        production: estimate.production,
        topBreakdown: estimate.breakdown
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 8),
        recommendations: estimate.recommendations.slice(0, 3),
        summary: createReadableEstimateSummary(estimate),
    };
}

export function estimateCommercialScenario(input = {}) {
    const expected = estimateKickOffBoxPrice({
        ...input,
        costMode: COST_SCENARIO_IDS.EXPECTED,
        mode: ESTIMATE_MODE.COMMERCIAL,
    });

    const minimum = estimateKickOffBoxPrice({
        ...input,
        costMode: COST_SCENARIO_IDS.MINIMUM,
        mode: ESTIMATE_MODE.COMMERCIAL,
    });

    const maximum = estimateKickOffBoxPrice({
        ...input,
        costMode: COST_SCENARIO_IDS.MAXIMUM,
        mode: ESTIMATE_MODE.COMMERCIAL,
    });

    return {
        expected,
        minimum,
        maximum,
        risk: {
            costRange: roundMoney(maximum.totals.unitCost - minimum.totals.unitCost),
            priceStable: expected.totals.unitSalePrice >= maximum.totals.unitCost,
            marginAtMaxCost: maximum.margin.grossMarginPercent,
            recommendation:
                maximum.margin.grossMarginRate < PROFITABILITY_DEFAULTS.minimumMarginRate
                    ? "El escenario de costo máximo reduce demasiado el margen; conviene subir precio o negociar insumos."
                    : "El precio mantiene margen incluso en escenario de costo máximo.",
        },
    };
}

export function estimateQuantityTable(input = {}, quantities = [1, 2, 3, 5, 10, 15, 25, 50]) {
    return quantities.map((quantity) => {
        const estimate = estimateQuickPrice({
            ...input,
            quantity,
        });

        return {
            quantity,
            unitPrice: estimate.unitSalePrice,
            discountPercent: percent(getQuantityDiscount(quantity).discountRate),
            total: estimate.total,
            averageUnitPrice: roundMoney(estimate.total / quantity),
            productionDays: estimate.productionDays,
            formattedTotal: estimate.formattedTotal,
        };
    });
}

export function estimateBreakEvenFromState(input = {}) {
    const estimate = estimateKickOffBoxPrice({
        ...input,
        mode: ESTIMATE_MODE.BREAK_EVEN,
    });

    const detailed = estimateBreakEven({
        fixedMonthlyCosts: input.fixedMonthlyCosts ?? BREAK_EVEN_DEFAULTS.fixedMonthlyCosts,
        averageSalePrice: estimate.totals.unitSalePrice,
        averageVariableCost: estimate.totals.unitCost,
    });

    return {
        ...detailed,
        estimatorBreakEven: estimate.breakEven,
        unitSalePrice: estimate.totals.unitSalePrice,
        unitCost: estimate.totals.unitCost,
        contributionMargin: estimate.margin.unitContributionMargin,
        contributionMarginPercent: estimate.margin.contributionMarginPercent,
    };
}

export function createPricePanelViewModel(input = {}) {
    const estimate = estimateKickOffBoxPrice(input);

    return {
        status: estimate.status,
        title: "Precio estimado",
        subtitle: `${estimate.product.preset} · ${estimate.accessibility.label}`,
        currencySymbol: estimate.currency.symbol,

        mainPrice: formatEstimatorPrice(estimate.totals.total),
        unitPrice: formatEstimatorPrice(estimate.totals.unitSalePrice),
        unitCost: formatEstimatorPrice(estimate.totals.unitCost),
        quantity: estimate.product.quantity,

        margin: `${estimate.margin.grossMarginPercent}%`,
        discount: `${estimate.totals.discountPercent}%`,
        production: `${estimate.production.estimatedTotalDays} día(s)`,

        score: estimate.commercialScore.total,
        scoreLevel: estimate.commercialScore.level,

        breakdown: estimate.breakdown.map((item) => ({
            label: item.label,
            category: item.category,
            amount: formatEstimatorPrice(item.amount),
            included: item.included,
        })),

        recommendations: estimate.recommendations,
        raw: estimate,
    };
}

export function createReadableEstimateSummary(estimate = {}) {
    const total = estimate.totals?.total ?? 0;
    const unit = estimate.totals?.unitSalePrice ?? 0;
    const quantity = estimate.product?.quantity ?? 1;
    const margin = estimate.margin?.grossMarginPercent ?? 0;
    const accessibility = estimate.accessibility?.label ?? "Sin clasificación";
    const days = estimate.production?.estimatedTotalDays ?? 0;

    return `La caja personalizada tiene un precio estimado de ${formatEstimatorPrice(total)} para ${quantity} unidad(es), con precio unitario de ${formatEstimatorPrice(unit)}, margen aproximado de ${margin}% y clasificación de precio: ${accessibility}. El tiempo estimado de producción y entrega es de ${days} día(s).`;
}

export function createCommercialReport(input = {}) {
    const estimate = estimateKickOffBoxPrice(input);
    const scenario = estimateCommercialScenario(input);
    const quantityTable = estimateQuantityTable(input);
    const breakEven = estimateBreakEvenFromState(input);

    return {
        title: "Reporte comercial del configurador KickOff Box",
        generatedAt: new Date().toISOString(),
        app: {
            name: APP_INFO.SHORT_NAME,
            version: APP_INFO.VERSION,
            currency: APP_INFO.CURRENCY,
        },
        summary: createReadableEstimateSummary(estimate),
        estimate,
        scenario,
        quantityTable,
        breakEven,
        decision: createCommercialDecision(estimate, scenario, breakEven),
    };
}

export function createCommercialDecision(estimate, scenario, breakEven) {
    const warnings = [];
    const strengths = [];

    if (estimate.margin.grossMarginRate >= PROFITABILITY_DEFAULTS.recommendedMarginRate) {
        strengths.push("El margen estimado es saludable para un producto personalizado.");
    } else {
        warnings.push("El margen está por debajo del recomendado; revisar costos o precio.");
    }

    if (estimate.commercialScore.total >= 72) {
        strengths.push("La propuesta tiene buen equilibrio entre precio, valor visual y personalización.");
    } else {
        warnings.push("La propuesta necesita mejorar valor percibido o accesibilidad.");
    }

    if (breakEven.viable || breakEven.estimatorBreakEven?.viable) {
        strengths.push("El punto de equilibrio puede cubrirse con un volumen mensual razonable.");
    } else {
        warnings.push("El punto de equilibrio requiere más unidades de las esperadas.");
    }

    if (!scenario.risk.priceStable) {
        warnings.push("El precio puede ser sensible a incrementos de costos de insumos.");
    }

    return {
        viable: warnings.length <= strengths.length,
        recommendation:
            warnings.length <= strengths.length
                ? "Mantener la estructura de precios y validar con encuesta o preventa."
                : "Ajustar precio, proveedores o composición antes de presentar como versión final.",
        strengths,
        warnings,
    };
}

export function comparePresetPrices(input = {}) {
    return Object.values(PRODUCT_PRESET_IDS).map((preset) => {
        const estimate = estimateQuickPrice({
            ...input,
            preset,
        });

        return {
            preset,
            unitPrice: estimate.unitSalePrice,
            total: estimate.total,
            accessibility: estimate.accessibility.label,
            productionDays: estimate.productionDays,
            formattedUnitPrice: estimate.formattedUnitPrice,
            formattedTotal: estimate.formattedTotal,
        };
    });
}

export function compareTemplatePrices(input = {}) {
    return Object.values(DESIGN_TEMPLATE_IDS).map((templateId) => {
        const estimate = estimateQuickPrice({
            ...input,
            templateId,
        });

        return {
            templateId,
            unitPrice: estimate.unitSalePrice,
            total: estimate.total,
            accessibility: estimate.accessibility.label,
            formattedUnitPrice: estimate.formattedUnitPrice,
            formattedTotal: estimate.formattedTotal,
        };
    });
}

export function compareBeveragePrices(input = {}) {
    return Object.values(BEVERAGE_PRICE_KEYS).map((beverageType) => {
        const estimate = estimateQuickPrice({
            ...input,
            beverageType,
        });

        const beverageRule = getBeverageCostRule(beverageType);

        return {
            beverageType,
            label: beverageRule.label,
            unitPrice: estimate.unitSalePrice,
            total: estimate.total,
            formattedTotal: estimate.formattedTotal,
        };
    });
}

export function formatEstimatorPrice(amount = 0, options = {}) {
    const symbol = options.symbol ?? PRICE_CURRENCY.symbol;
    const decimals = options.decimals ?? 2;

    return `${symbol} ${roundMoney(amount).toFixed(decimals)}`;
}

export function formatEstimateForExport(estimate = {}) {
    return {
        generatedAt: estimate.generatedAt,
        product: estimate.product,
        totals: {
            unitCost: estimate.totals?.unitCost,
            unitSalePrice: estimate.totals?.unitSalePrice,
            subtotal: estimate.totals?.subtotal,
            discountAmount: estimate.totals?.discountAmount,
            total: estimate.totals?.total,
        },
        margin: estimate.margin,
        production: estimate.production,
        accessibility: estimate.accessibility,
        commercialScore: estimate.commercialScore,
        breakdown: estimate.breakdown,
        recommendations: estimate.recommendations,
        summary: createReadableEstimateSummary(estimate),
    };
}

export function createPriceStatePatch(input = {}) {
    const estimate = estimateKickOffBoxPrice(input);

    return {
        currency: estimate.currency.code,
        currencySymbol: estimate.currency.symbol,
        estimatedTotal: estimate.totals.total,
        basePrice: estimate.totals.unitSalePrice,
        extrasTotal: roundMoney(estimate.breakdownTotals.extras + estimate.breakdownTotals.personalization),
        productionDays: estimate.production.productionDays,
        deliveryDays: estimate.production.deliveryDays,
        personalizationLevel: estimate.accessibility.label,
        breakdown: estimate.breakdown,
        quantity: estimate.product.quantity,
        discountRate: estimate.totals.discountRate,
        discountAmount: estimate.totals.discountAmount,
        accessibility: estimate.accessibility,
        commercialScore: estimate.commercialScore,
        margin: estimate.margin,
        breakEven: estimate.breakEven,
        estimate,
    };
}

export function validateEstimateInput(input = {}) {
    const normalized = normalizeEstimatorInput(input);
    const errors = [];
    const warnings = [];

    if (!PRESET_PRICING_RULES[normalized.preset]) {
        errors.push("Preset de precio no reconocido.");
    }

    if (!TEMPLATE_PRICING_ADJUSTMENTS[normalized.templateId]) {
        errors.push("Plantilla de precio no reconocida.");
    }

    if (!THEME_PRICING_ADJUSTMENTS[normalized.themeId]) {
        warnings.push("Tema visual sin ajuste de precio definido.");
    }

    if (!BEVERAGE_COST_MULTIPLIERS[normalized.beverageType]) {
        warnings.push("Tipo de bebida sin regla específica; se usará cola como referencia.");
    }

    if (normalized.quantity < 1) {
        errors.push("La cantidad debe ser mayor o igual a 1.");
    }

    if (!resolveUrgencyRule(normalized.urgency)) {
        warnings.push("Regla de urgencia no reconocida.");
    }

    if (!resolveDeliveryRule(normalized.delivery)) {
        warnings.push("Regla de entrega no reconocida.");
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        normalized,
        checkedAt: new Date().toISOString(),
    };
}

export function getObjectPricingImpact(objectKey, state = {}) {
    const itemKey = OBJECT_TO_PRICE_ITEM_MAP[objectKey];
    const item = itemKey ? getPriceItem(itemKey) : null;

    return {
        objectKey,
        itemKey,
        hasPricingImpact: Boolean(item),
        visible: state.visibility?.[objectKey] !== false,
        role: getObjectRole(objectKey),
        category: getObjectCategory(objectKey),
        priceItem: item,
        expectedCost: item ? item.expected : 0,
        formattedExpectedCost: item ? formatEstimatorPrice(item.expected) : formatEstimatorPrice(0),
    };
}

export function getAllObjectPricingImpacts(state = {}) {
    const objectKeys = Object.values(OBJECT_KEYS);

    return objectKeys.map((objectKey) => getObjectPricingImpact(objectKey, state));
}

export const priceEstimator = Object.freeze({
    version: PRICE_ESTIMATOR_VERSION,
    status: ESTIMATE_STATUS,
    mode: ESTIMATE_MODE,
    scenarioIds: COST_SCENARIO_IDS,
    confidenceLevels: PRICE_CONFIDENCE_LEVELS,
    recommendationTypes: PRICE_RECOMMENDATION_TYPES,
    valueLevels: VALUE_LEVELS,

    createSelectedExtrasFromState,
    createUploadedImagesFromState,
    createDetailedBreakdown,

    estimateKickOffBoxPrice,
    estimateQuickPrice,
    estimatePresentationPrice,
    estimateCommercialScenario,
    estimateQuantityTable,
    estimateBreakEvenFromState,

    createPricePanelViewModel,
    createReadableEstimateSummary,
    createCommercialReport,
    createCommercialDecision,

    comparePresetPrices,
    compareTemplatePrices,
    compareBeveragePrices,

    formatEstimatorPrice,
    formatEstimateForExport,
    createPriceStatePatch,
    validateEstimateInput,

    getObjectPricingImpact,
    getAllObjectPricingImpacts,
});
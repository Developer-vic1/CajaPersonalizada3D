import {
    APP_INFO,
    PRODUCT_PRESET_IDS,
    DEFAULT_PRODUCT_PRESET,
    DESIGN_TEMPLATE_IDS,
    DEFAULT_DESIGN_TEMPLATE,
    VISUAL_THEME_IDS,
    DEFAULT_VISUAL_THEME,
    CAMERA_VIEW_IDS,
    LIGHTING_MODE_IDS,
    RENDER_QUALITY_IDS,
    EDIT_MODE_IDS,
    LOGO_VARIANTS,
    FORM_FIELD_KEYS,
    STORAGE_KEYS,
    APP_EVENTS,
    EXPORT_TYPES,
    DEFAULT_LOGO_VARIANT,
    isValidProductPreset,
    isValidDesignTemplate,
    isValidCameraView,
    isValidLightingMode,
    isValidRenderQuality,
    isValidEditMode,
    isValidLogoVariant,
    clampNumber,
} from "../constants/appConstants.js";

import {
    OBJECT_KEYS,
    GROUP_KEYS,
    DEFAULT_EDITABLE_OBJECTS,
    STRUCTURAL_OBJECTS,
    EXPORTABLE_OBJECTS,
    getObjectRole,
    getObjectCategory,
    isEditableObjectKey,
    isStructuralObjectKey,
    isExportableObjectKey,
    createObjectUserData,
    createRegistryEntry,
} from "../constants/objectKeys.js";

import {
    DEFAULT_DESIGN_STATE,
    FORM_FIELD_TO_STATE_PATH,
    createDefaultDesignState,
    updateDesignStateField,
    getDesignStateField,
    resetRuntimeFlags,
    markDesignStateSaved,
    markDesignStateError,
    createExportableDesignState,
} from "../data/defaultDesignState.js";

import {
    estimatePresetCost,
    getPresetPricingRule,
    getTemplatePricingAdjustment,
    getThemePricingAdjustment,
    PRICE_ITEM_KEYS,
    PERSONALIZATION_PRICE_RULES,
    URGENCY_PRICE_RULES,
    DELIVERY_PRICE_RULES,
} from "../data/pricingRules.js";

import {
    getTemplateById,
    validateTemplate,
    validateAllTemplates,
    applyTemplate,
    createTemplateApplicationResult,
    prepareTemplateForSceneComposer,
    prepareSceneTemplateConfig,
    createTemplatePricingPreview,
    getTemplateCommercialConfig,
    getTemplateSceneSummary,
    getTemplatePanelDefaults,
    resolveTemplateIdForState,
    getRenderableObjectsForTemplate,
    getEditableObjectsForTemplate,
    getExportableObjectsForTemplate,
} from "./templateService.js";

import {
    normalizeBeverageType,
    createBeverageState,
    updateBeverageState,
    updateBeverageFromFormField,
    validateBeverageState,
    createBeverageChangeResult,
    prepareBeverageForSceneComposer,
    getBeveragePricePreview,
    createBeverageSummary,
    recommendBeverage,
} from "./beverageService.js";

export const CONFIGURATOR_SERVICE_VERSION = "1.0.0";

export const CONFIGURATOR_STATUS = Object.freeze({
    DRAFT: "draft",
    READY: "ready",
    DIRTY: "dirty",
    SAVED: "saved",
    ERROR: "error",
    EXPORTING: "exporting",
});

export const CONFIGURATOR_CHANGE_ORIGIN = Object.freeze({
    SYSTEM: "system",
    USER: "user",
    TEMPLATE: "template",
    BEVERAGE: "beverage",
    PRICE: "price",
    SCENE: "scene",
    IMPORT: "import",
    RESET: "reset",
});

export const CONFIGURATOR_ACTION_TYPES = Object.freeze({
    INITIALIZE: "configurator/initialize",
    RESET: "configurator/reset",
    PATCH_STATE: "configurator/patchState",
    UPDATE_FIELD: "configurator/updateField",

    APPLY_TEMPLATE: "configurator/applyTemplate",
    UPDATE_PRESET: "configurator/updatePreset",
    UPDATE_THEME: "configurator/updateTheme",

    UPDATE_BEVERAGE: "configurator/updateBeverage",
    UPDATE_QR: "configurator/updateQR",
    UPDATE_TEXT: "configurator/updateText",
    UPDATE_PROJECT: "configurator/updateProject",
    UPDATE_IMAGE: "configurator/updateImage",
    UPDATE_LOGO: "configurator/updateLogo",

    SELECT_OBJECT: "scene/selectObject",
    CLEAR_SELECTION: "scene/clearSelection",
    SET_OBJECT_VISIBILITY: "scene/setObjectVisibility",
    SET_OBJECT_TRANSFORM: "scene/setObjectTransform",

    UPDATE_CAMERA: "render/updateCamera",
    UPDATE_RENDER: "render/updateRender",
    UPDATE_PRICE: "price/updatePrice",

    SAVE: "storage/save",
    LOAD: "storage/load",
    EXPORT: "export/create",
    ERROR: "system/error",
});

export const CONFIGURATOR_VALIDATION_LEVEL = Object.freeze({
    BASIC: "basic",
    SCENE: "scene",
    COMMERCIAL: "commercial",
    FULL: "full",
});

export const CONFIGURATOR_EXPORT_MODE = Object.freeze({
    DESIGN_ONLY: "design-only",
    COMMERCIAL_SUMMARY: "commercial-summary",
    SCENE_PAYLOAD: "scene-payload",
    FULL: "full",
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

function getValueByPath(target, path, fallback = undefined) {
    if (!path) return fallback;

    const value = path.split(".").reduce((cursor, key) => {
        if (cursor == null) return undefined;
        return cursor[key];
    }, target);

    return value ?? fallback;
}

function setValueByPath(target, path, value) {
    const keys = path.split(".");
    const lastKey = keys.pop();

    let cursor = target;

    keys.forEach((key) => {
        if (!isPlainObject(cursor[key])) {
            cursor[key] = {};
        }

        cursor = cursor[key];
    });

    cursor[lastKey] = value;

    return target;
}

function uniqueArray(values = []) {
    return [...new Set(values.filter(Boolean))];
}

function nowISO() {
    return new Date().toISOString();
}

function normalizeObjectTransform(transform = {}) {
    return {
        position: Array.isArray(transform.position) && transform.position.length === 3
            ? transform.position.map(Number)
            : [0, 0, 0],

        rotation: Array.isArray(transform.rotation) && transform.rotation.length === 3
            ? transform.rotation.map(Number)
            : [0, 0, 0],

        scale: Array.isArray(transform.scale) && transform.scale.length === 3
            ? transform.scale.map(Number)
            : [1, 1, 1],

        slot: transform.slot ?? null,
    };
}

function createRuntimePatch(origin = CONFIGURATOR_CHANGE_ORIGIN.USER, dirty = true) {
    return {
        runtime: {
            hasUnsavedChanges: dirty,
            lastUpdatedAt: nowISO(),
            lastError: null,
        },
        lastAction: {
            origin,
            at: nowISO(),
        },
    };
}

function normalizeConfiguratorOptions(options = {}) {
    return {
        templateId: isValidDesignTemplate(options.templateId)
            ? options.templateId
            : DEFAULT_DESIGN_TEMPLATE,

        preset: isValidProductPreset(options.preset)
            ? options.preset
            : DEFAULT_PRODUCT_PRESET,

        themeId: Object.values(VISUAL_THEME_IDS).includes(options.themeId)
            ? options.themeId
            : DEFAULT_VISUAL_THEME,

        beverageType: normalizeBeverageType(options.beverageType),

        quantity: Number(options.quantity ?? 1),
        urgency: options.urgency ?? URGENCY_PRICE_RULES.NORMAL.id,
        delivery: options.delivery ?? DELIVERY_PRICE_RULES.PICKUP.id,
        costMode: options.costMode ?? "expected",
    };
}

function deriveUploadedImagesForPricing(state = {}) {
    return {
        lidImage: state.images?.lidImage,
        bottleLabelImage: state.images?.bottleLabelImage,
        frontStickerImage: state.images?.frontStickerImage,
        customLogoImage: state.images?.customLogoImage,
        ...(state.images?.uploadedImages ?? {}),
    };
}

function deriveSelectedExtras(state = {}) {
    const extras = [];

    if (state.images?.lidImage) extras.push(PRICE_ITEM_KEYS.CUSTOM_IMAGE_PRINT);
    if (state.images?.frontStickerImage) extras.push(PRICE_ITEM_KEYS.CUSTOM_IMAGE_PRINT);
    if (state.images?.bottleLabelImage) extras.push(PRICE_ITEM_KEYS.CUSTOM_IMAGE_PRINT);

    if (state.product?.includeQR && state.visibility?.[OBJECT_KEYS.QR_CARD] !== false) {
        extras.push(PRICE_ITEM_KEYS.QR_CARD);
    }

    if (state.product?.includeKeychain && state.visibility?.[OBJECT_KEYS.RESIN_KEYCHAIN] !== false) {
        extras.push(PRICE_ITEM_KEYS.RESIN_KEYCHAIN);
    }

    if (state.product?.includeThematicDecorations) {
        extras.push(PRICE_ITEM_KEYS.THEMATIC_DECORATIONS);
    }

    return uniqueArray(extras);
}

function createPriceStateFromEstimate(estimate) {
    return {
        currency: estimate.currency?.code ?? APP_INFO.CURRENCY,
        currencySymbol: estimate.currency?.symbol ?? APP_INFO.CURRENCY_SYMBOL,
        estimatedTotal: estimate.total,
        basePrice: estimate.suggestedSalePrice,
        extrasTotal: Math.max(0, estimate.total - estimate.suggestedSalePrice * estimate.quantity),
        productionDays: estimate.productionDays,
        deliveryDays: estimate.deliveryDays,
        personalizationLevel: estimate.accessibility?.label ?? "Equilibrado",
        breakdown: estimate.breakdown,
        quantity: estimate.quantity,
        discountRate: estimate.discountRate,
        discountAmount: estimate.discountAmount,
        accessibility: estimate.accessibility,
        estimatedTotalDays: estimate.estimatedTotalDays,
    };
}

export function createConfiguratorState(options = {}) {
    const normalized = normalizeConfiguratorOptions(options);

    let state = createDefaultDesignState({
        product: {
            preset: normalized.preset,
            templateId: normalized.templateId,
            themeId: normalized.themeId,
        },
        beverage: createBeverageState(normalized.beverageType),
        customer: {
            orderQuantity: normalized.quantity,
        },
    });

    state = applyTemplate(state, normalized.templateId, {
        product: {
            preset: normalized.preset,
            themeId: normalized.themeId,
        },
        beverage: createBeverageState(normalized.beverageType),
    });

    state = recalculateConfiguratorPrice(state, {
        urgency: normalized.urgency,
        delivery: normalized.delivery,
        costMode: normalized.costMode,
    });

    return resetRuntimeFlags(state);
}

export function initializeConfigurator(options = {}) {
    const state = createConfiguratorState(options);
    const templateId = resolveTemplateIdForState(state);

    return {
        status: CONFIGURATOR_STATUS.READY,
        action: CONFIGURATOR_ACTION_TYPES.INITIALIZE,
        state,
        template: getTemplateById(templateId),
        scenePayload: prepareConfiguratorForScene(state),
        panelDefaults: getConfiguratorPanelDefaults(state),
        pricing: state.price,
        validation: validateConfiguratorState(state),
        events: [APP_EVENTS.APP_READY],
        initializedAt: nowISO(),
    };
}

export function patchConfiguratorState(
    state = DEFAULT_DESIGN_STATE,
    patch = {},
    options = {},
) {
    const origin = options.origin ?? CONFIGURATOR_CHANGE_ORIGIN.USER;
    const dirty = options.dirty ?? true;

    let nextState = mergeDeep(state, patch);
    nextState = mergeDeep(nextState, createRuntimePatch(origin, dirty));

    if (options.recalculatePrice !== false) {
        nextState = recalculateConfiguratorPrice(nextState, options.pricing ?? {});
    }

    return nextState;
}

export function updateConfiguratorField(
    state = DEFAULT_DESIGN_STATE,
    fieldKey,
    value,
    options = {},
) {
    let nextState = updateDesignStateField(state, fieldKey, value);

    if (fieldKey === FORM_FIELD_KEYS.BEVERAGE_TYPE || fieldKey === FORM_FIELD_KEYS.BEVERAGE_LABEL_TEXT || fieldKey === FORM_FIELD_KEYS.LABEL_IMAGE) {
        nextState.beverage = updateBeverageFromFormField(nextState.beverage, fieldKey, value);
    }

    if (fieldKey === FORM_FIELD_KEYS.TEMPLATE_ID) {
        return applyConfiguratorTemplate(nextState, value, options);
    }

    if (fieldKey === FORM_FIELD_KEYS.PRESET) {
        nextState.product = {
            ...nextState.product,
            preset: isValidProductPreset(value) ? value : DEFAULT_PRODUCT_PRESET,
        };
    }

    if (fieldKey === FORM_FIELD_KEYS.LOGO_VARIANT) {
        nextState.product = {
            ...nextState.product,
            logoVariant: isValidLogoVariant(value) ? value : DEFAULT_LOGO_VARIANT,
        };
    }

    nextState = mergeDeep(nextState, createRuntimePatch(CONFIGURATOR_CHANGE_ORIGIN.USER, true));

    return options.recalculatePrice === false
        ? nextState
        : recalculateConfiguratorPrice(nextState, options.pricing ?? {});
}

export function getConfiguratorField(state = DEFAULT_DESIGN_STATE, fieldKey) {
    return getDesignStateField(state, fieldKey);
}

export function updateConfiguratorPath(
    state = DEFAULT_DESIGN_STATE,
    path,
    value,
    options = {},
) {
    const nextState = cloneDeep(state);

    setValueByPath(nextState, path, value);

    return patchConfiguratorState(
        nextState,
        {},
        {
            origin: options.origin ?? CONFIGURATOR_CHANGE_ORIGIN.USER,
            recalculatePrice: options.recalculatePrice,
            pricing: options.pricing,
        },
    );
}

export function getConfiguratorPath(state = DEFAULT_DESIGN_STATE, path, fallback = undefined) {
    return getValueByPath(state, path, fallback);
}

export function applyConfiguratorTemplate(
    state = DEFAULT_DESIGN_STATE,
    templateId = DEFAULT_DESIGN_TEMPLATE,
    options = {},
) {
    const result = createTemplateApplicationResult(
        state,
        templateId,
        options.overrides ?? {},
        {
            mode: options.mode,
        },
    );

    let nextState = result.state;

    if (options.keepCurrentProjectText) {
        nextState.project = cloneDeep(state.project);
        nextState.text = cloneDeep(state.text);
    }

    if (options.keepCurrentBeverage) {
        nextState.beverage = cloneDeep(state.beverage);
    }

    if (options.keepCurrentImages) {
        nextState.images = cloneDeep(state.images);
    }

    nextState = recalculateConfiguratorPrice(nextState, options.pricing ?? {});

    return mergeDeep(nextState, {
        runtime: {
            hasUnsavedChanges: true,
            lastUpdatedAt: nowISO(),
        },
        lastTemplateResult: {
            templateId,
            validation: result.validation,
            changed: result.changed,
            appliedAt: result.appliedAt,
        },
    });
}

export function updateConfiguratorPreset(
    state = DEFAULT_DESIGN_STATE,
    preset = DEFAULT_PRODUCT_PRESET,
    options = {},
) {
    const safePreset = isValidProductPreset(preset) ? preset : DEFAULT_PRODUCT_PRESET;

    return patchConfiguratorState(
        state,
        {
            product: {
                preset: safePreset,
            },
        },
        {
            origin: CONFIGURATOR_CHANGE_ORIGIN.USER,
            recalculatePrice: true,
            pricing: options.pricing,
        },
    );
}

export function updateConfiguratorTheme(
    state = DEFAULT_DESIGN_STATE,
    themeId = DEFAULT_VISUAL_THEME,
    options = {},
) {
    const safeTheme = Object.values(VISUAL_THEME_IDS).includes(themeId)
        ? themeId
        : DEFAULT_VISUAL_THEME;

    return patchConfiguratorState(
        state,
        {
            product: {
                themeId: safeTheme,
                ...(options.colors ?? {}),
            },
        },
        {
            origin: CONFIGURATOR_CHANGE_ORIGIN.USER,
            recalculatePrice: true,
            pricing: options.pricing,
        },
    );
}

export function updateConfiguratorBeverage(
    state = DEFAULT_DESIGN_STATE,
    beverageType,
    overrides = {},
    options = {},
) {
    const result = createBeverageChangeResult(
        state.beverage,
        beverageType,
        overrides,
    );

    let nextState = patchConfiguratorState(
        state,
        {
            beverage: result.nextState,
            layout: {
                ...state.layout,
                [OBJECT_KEYS.SODA_BOTTLE]: {
                    ...(state.layout?.[OBJECT_KEYS.SODA_BOTTLE] ?? {}),
                    ...result.sceneConfig.transform,
                },
            },
        },
        {
            origin: CONFIGURATOR_CHANGE_ORIGIN.BEVERAGE,
            recalculatePrice: true,
            pricing: options.pricing,
        },
    );

    nextState.lastBeverageResult = {
        changed: result.changed,
        previousType: result.previousType,
        nextType: result.nextType,
        validation: result.validation,
        changedAt: result.changedAt,
    };

    return nextState;
}

export function recommendConfiguratorBeverage(state = DEFAULT_DESIGN_STATE, context = {}) {
    const templateId = resolveTemplateIdForState(state);
    const templateSummary = getTemplateSceneSummary(templateId);

    return recommendBeverage({
        premium: state.product?.preset === PRODUCT_PRESET_IDS.PREMIUM,
        defense: templateId === DESIGN_TEMPLATE_IDS.DEFENSE,
        jury: templateId === DESIGN_TEMPLATE_IDS.JURY,
        institutional: templateId === DESIGN_TEMPLATE_IDS.INSTITUTIONAL,
        standard: state.product?.preset === PRODUCT_PRESET_IDS.STANDARD,
        basic: state.product?.preset === PRODUCT_PRESET_IDS.BASIC,
        worldCup: state.product?.themeId === VISUAL_THEME_IDS.WORLD_CUP_2026,
        tech: state.product?.themeId === VISUAL_THEME_IDS.TECH_SYSTEMS,
        hasQR: templateSummary.hasQR,
        ...context,
    });
}

export function updateConfiguratorProject(
    state = DEFAULT_DESIGN_STATE,
    projectPatch = {},
    options = {},
) {
    const nextState = patchConfiguratorState(
        state,
        {
            project: projectPatch,
            text: {
                cardRecipient: projectPatch.recipientName ?? state.text?.cardRecipient,
                cardMessage: projectPatch.message ?? state.text?.cardMessage,
            },
        },
        {
            origin: CONFIGURATOR_CHANGE_ORIGIN.USER,
            recalculatePrice: options.recalculatePrice ?? false,
        },
    );

    return nextState;
}

export function updateConfiguratorText(
    state = DEFAULT_DESIGN_STATE,
    textPatch = {},
    options = {},
) {
    return patchConfiguratorState(
        state,
        {
            text: textPatch,
        },
        {
            origin: CONFIGURATOR_CHANGE_ORIGIN.USER,
            recalculatePrice: options.recalculatePrice ?? false,
        },
    );
}

export function updateConfiguratorQR(
    state = DEFAULT_DESIGN_STATE,
    qrPatch = {},
    options = {},
) {
    return patchConfiguratorState(
        state,
        {
            qr: {
                enabled: qrPatch.enabled ?? state.qr?.enabled ?? true,
                ...qrPatch,
            },
            visibility: {
                [OBJECT_KEYS.QR_CARD]: qrPatch.enabled ?? state.visibility?.[OBJECT_KEYS.QR_CARD] ?? true,
            },
        },
        {
            origin: CONFIGURATOR_CHANGE_ORIGIN.USER,
            recalculatePrice: options.recalculatePrice ?? true,
            pricing: options.pricing,
        },
    );
}

export function updateConfiguratorLogo(
    state = DEFAULT_DESIGN_STATE,
    logoVariant = LOGO_VARIANTS.LIGHT,
    options = {},
) {
    const safeLogoVariant = isValidLogoVariant(logoVariant)
        ? logoVariant
        : DEFAULT_LOGO_VARIANT;

    return patchConfiguratorState(
        state,
        {
            product: {
                logoVariant: safeLogoVariant,
            },
        },
        {
            origin: CONFIGURATOR_CHANGE_ORIGIN.USER,
            recalculatePrice: options.recalculatePrice ?? false,
        },
    );
}

export function updateConfiguratorImage(
    state = DEFAULT_DESIGN_STATE,
    imageKey,
    imageValue,
    options = {},
) {
    const patch = {
        images: {
            [imageKey]: imageValue,
            uploadedImages: {
                ...(state.images?.uploadedImages ?? {}),
                [imageKey]: imageValue,
            },
        },
    };

    if (imageKey === "lidImage") {
        patch.visibility = {
            [OBJECT_KEYS.CUSTOM_IMAGE_PLANE]: Boolean(imageValue),
        };
    }

    if (imageKey === "bottleLabelImage") {
        patch.beverage = {
            customLabelImage: imageValue,
        };
    }

    return patchConfiguratorState(
        state,
        patch,
        {
            origin: CONFIGURATOR_CHANGE_ORIGIN.USER,
            recalculatePrice: options.recalculatePrice ?? true,
            pricing: options.pricing,
        },
    );
}

export function setConfiguratorObjectVisibility(
    state = DEFAULT_DESIGN_STATE,
    objectKey,
    visible = true,
    options = {},
) {
    return patchConfiguratorState(
        state,
        {
            visibility: {
                [objectKey]: Boolean(visible),
            },
        },
        {
            origin: CONFIGURATOR_CHANGE_ORIGIN.SCENE,
            recalculatePrice: options.recalculatePrice ?? true,
            pricing: options.pricing,
        },
    );
}

export function toggleConfiguratorObjectVisibility(
    state = DEFAULT_DESIGN_STATE,
    objectKey,
    options = {},
) {
    const current = state.visibility?.[objectKey] !== false;

    return setConfiguratorObjectVisibility(state, objectKey, !current, options);
}

export function setConfiguratorObjectTransform(
    state = DEFAULT_DESIGN_STATE,
    objectKey,
    transform = {},
    options = {},
) {
    if (isStructuralObjectKey(objectKey) && options.allowStructuralTransform !== true) {
        return patchConfiguratorState(
            state,
            {
                runtime: {
                    lastError: `El objeto estructural "${objectKey}" no puede transformarse desde el editor.`,
                },
            },
            {
                origin: CONFIGURATOR_CHANGE_ORIGIN.SCENE,
                recalculatePrice: false,
            },
        );
    }

    const normalizedTransform = normalizeObjectTransform({
        ...(state.layout?.[objectKey] ?? {}),
        ...transform,
    });

    return patchConfiguratorState(
        state,
        {
            layout: {
                [objectKey]: normalizedTransform,
            },
            editor: {
                transformHistory: [
                    ...(state.editor?.transformHistory ?? []),
                    {
                        objectKey,
                        transform: normalizedTransform,
                        at: nowISO(),
                    },
                ].slice(-30),
            },
        },
        {
            origin: CONFIGURATOR_CHANGE_ORIGIN.SCENE,
            recalculatePrice: false,
        },
    );
}

export function resetConfiguratorObjectTransform(
    state = DEFAULT_DESIGN_STATE,
    objectKey,
    options = {},
) {
    const templateId = resolveTemplateIdForState(state);
    const templatePayload = prepareTemplateForSceneComposer(state);
    const defaultTransform =
        templatePayload.sceneConfig?.layout?.[objectKey] ??
        DEFAULT_DESIGN_STATE.layout?.[objectKey];

    if (!defaultTransform) return cloneDeep(state);

    return setConfiguratorObjectTransform(
        state,
        objectKey,
        defaultTransform,
        {
            ...options,
            allowStructuralTransform: true,
        },
    );
}

export function selectConfiguratorObject(
    state = DEFAULT_DESIGN_STATE,
    objectKey,
    options = {},
) {
    if (objectKey && !isEditableObjectKey(objectKey) && options.allowNonEditable !== true) {
        return patchConfiguratorState(
            state,
            {
                editor: {
                    selectedObjectKey: null,
                    hoveredObjectKey: objectKey,
                },
                runtime: {
                    lastError: `El objeto "${objectKey}" no está marcado como editable.`,
                },
            },
            {
                origin: CONFIGURATOR_CHANGE_ORIGIN.SCENE,
                recalculatePrice: false,
            },
        );
    }

    return patchConfiguratorState(
        state,
        {
            editor: {
                selectedObjectKey: objectKey ?? null,
                hoveredObjectKey: objectKey ?? null,
            },
        },
        {
            origin: CONFIGURATOR_CHANGE_ORIGIN.SCENE,
            recalculatePrice: false,
        },
    );
}

export function clearConfiguratorSelection(state = DEFAULT_DESIGN_STATE) {
    return patchConfiguratorState(
        state,
        {
            editor: {
                selectedObjectKey: null,
                hoveredObjectKey: null,
            },
        },
        {
            origin: CONFIGURATOR_CHANGE_ORIGIN.SCENE,
            recalculatePrice: false,
        },
    );
}

export function updateConfiguratorEditor(
    state = DEFAULT_DESIGN_STATE,
    editorPatch = {},
    options = {},
) {
    const safeMode = editorPatch.mode && isValidEditMode(editorPatch.mode)
        ? editorPatch.mode
        : editorPatch.mode;

    return patchConfiguratorState(
        state,
        {
            editor: {
                ...editorPatch,
                ...(safeMode ? { mode: safeMode } : {}),
            },
        },
        {
            origin: CONFIGURATOR_CHANGE_ORIGIN.SCENE,
            recalculatePrice: options.recalculatePrice ?? false,
        },
    );
}

export function updateConfiguratorCamera(
    state = DEFAULT_DESIGN_STATE,
    cameraPatch = {},
    options = {},
) {
    const nextCamera = {
        ...cameraPatch,
    };

    if (cameraPatch.view) {
        nextCamera.view = isValidCameraView(cameraPatch.view)
            ? cameraPatch.view
            : CAMERA_VIEW_IDS.PRODUCT;
    }

    if (cameraPatch.zoomLevel != null) {
        nextCamera.zoomLevel = clampNumber(cameraPatch.zoomLevel, 0.35, 3);
    }

    return patchConfiguratorState(
        state,
        {
            camera: nextCamera,
        },
        {
            origin: CONFIGURATOR_CHANGE_ORIGIN.SCENE,
            recalculatePrice: options.recalculatePrice ?? false,
        },
    );
}

export function updateConfiguratorRender(
    state = DEFAULT_DESIGN_STATE,
    renderPatch = {},
    options = {},
) {
    const nextRender = {
        ...renderPatch,
    };

    if (renderPatch.lightingMode) {
        nextRender.lightingMode = isValidLightingMode(renderPatch.lightingMode)
            ? renderPatch.lightingMode
            : LIGHTING_MODE_IDS.PREMIUM;
    }

    if (renderPatch.quality) {
        nextRender.quality = isValidRenderQuality(renderPatch.quality)
            ? renderPatch.quality
            : RENDER_QUALITY_IDS.HIGH;
    }

    return patchConfiguratorState(
        state,
        {
            render: nextRender,
        },
        {
            origin: CONFIGURATOR_CHANGE_ORIGIN.SCENE,
            recalculatePrice: options.recalculatePrice ?? false,
        },
    );
}

export function recalculateConfiguratorPrice(state = DEFAULT_DESIGN_STATE, options = {}) {
    const templateId = resolveTemplateIdForState(state);

    const estimate = estimatePresetCost({
        preset: state.product?.preset ?? DEFAULT_PRODUCT_PRESET,
        templateId,
        themeId: state.product?.themeId ?? DEFAULT_VISUAL_THEME,
        beverageType: state.beverage?.type,
        quantity: state.customer?.orderQuantity ?? 1,
        selectedExtras: options.selectedExtras ?? deriveSelectedExtras(state),
        uploadedImages: options.uploadedImages ?? deriveUploadedImagesForPricing(state),
        urgency: options.urgency ?? state.price?.urgency ?? URGENCY_PRICE_RULES.NORMAL.id,
        delivery: options.delivery ?? state.price?.delivery ?? DELIVERY_PRICE_RULES.PICKUP.id,
        costMode: options.costMode ?? "expected",
    });

    return mergeDeep(state, {
        price: {
            ...createPriceStateFromEstimate(estimate),
            estimate,
            urgency: options.urgency ?? state.price?.urgency ?? URGENCY_PRICE_RULES.NORMAL.id,
            delivery: options.delivery ?? state.price?.delivery ?? DELIVERY_PRICE_RULES.PICKUP.id,
        },
        runtime: {
            lastUpdatedAt: nowISO(),
        },
    });
}

export function getConfiguratorCommercialSummary(state = DEFAULT_DESIGN_STATE) {
    const templateId = resolveTemplateIdForState(state);
    const commercial = getTemplateCommercialConfig(templateId);
    const presetRule = getPresetPricingRule(state.product?.preset ?? commercial.pricePreset);
    const templateAdjustment = getTemplatePricingAdjustment(templateId);
    const themeAdjustment = getThemePricingAdjustment(state.product?.themeId ?? DEFAULT_VISUAL_THEME);
    const beverageSummary = createBeverageSummary(state.beverage?.type);

    return {
        app: {
            name: APP_INFO.SHORT_NAME,
            version: APP_INFO.VERSION,
        },
        template: {
            id: templateId,
            title: commercial.title,
            positioning: commercial.positioning,
            suggestedUse: commercial.suggestedUse,
            targetBuyer: commercial.targetBuyer,
            targetRecipient: commercial.targetRecipient,
        },
        product: {
            preset: state.product?.preset,
            themeId: state.product?.themeId,
            logoVariant: state.product?.logoVariant,
            boxColor: state.product?.boxColor,
            interiorColor: state.product?.interiorColor,
            accentColor: state.product?.accentColor,
        },
        project: cloneDeep(state.project ?? {}),
        beverage: beverageSummary,
        qr: cloneDeep(state.qr ?? {}),
        price: cloneDeep(state.price ?? {}),
        pricingRules: {
            presetRule,
            templateAdjustment,
            themeAdjustment,
        },
        generatedAt: nowISO(),
    };
}

export function prepareConfiguratorForScene(
    state = DEFAULT_DESIGN_STATE,
    options = {},
) {
    const templatePayload = prepareTemplateForSceneComposer(state, {
        pricing: options.pricing,
        visibility: options.visibility,
        layout: options.layout,
        visual: options.visual,
    });

    const beveragePayload = prepareBeverageForSceneComposer(state.beverage);

    const sceneConfig = mergeDeep(templatePayload.sceneConfig, {
        content: {
            beverage: beveragePayload.state,
        },
        beverage: beveragePayload,
        objectRegistry: createObjectRegistryPayload(state),
    });

    return {
        status: CONFIGURATOR_STATUS.READY,
        templateId: templatePayload.templateId,
        template: templatePayload.template,
        sceneConfig,
        renderableObjects: templatePayload.renderableObjects,
        editableObjects: templatePayload.editableObjects,
        exportableObjects: templatePayload.exportableObjects,
        beverage: beveragePayload,
        pricingPreview: templatePayload.pricingPreview,
        validation: validateConfiguratorState(state),
        preparedAt: nowISO(),
    };
}

export function createObjectRegistryPayload(state = DEFAULT_DESIGN_STATE) {
    const allKeys = uniqueArray([
        ...Object.keys(state.visibility ?? {}),
        ...Object.keys(state.layout ?? {}),
        ...EXPORTABLE_OBJECTS,
    ]);

    return Object.fromEntries(
        allKeys.map((objectKey) => {
            const visible = state.visibility?.[objectKey] !== false;
            const transform = state.layout?.[objectKey] ?? null;

            return [
                objectKey,
                {
                    key: objectKey,
                    visible,
                    transform: transform ? normalizeObjectTransform(transform) : null,
                    role: getObjectRole(objectKey),
                    category: getObjectCategory(objectKey),
                    editable: isEditableObjectKey(objectKey),
                    structural: isStructuralObjectKey(objectKey),
                    exportable: isExportableObjectKey(objectKey),
                    userData: createObjectUserData(objectKey, {
                        visible,
                        transform,
                    }),
                },
            ];
        }),
    );
}

export function getConfiguratorPanelDefaults(state = DEFAULT_DESIGN_STATE) {
    const templateId = resolveTemplateIdForState(state);
    const templateDefaults = getTemplatePanelDefaults(templateId);

    return {
        ...templateDefaults,

        preset: state.product?.preset,
        templateId,
        themeId: state.product?.themeId,

        boxColor: state.product?.boxColor,
        interiorColor: state.product?.interiorColor,
        accentColor: state.product?.accentColor,
        logoVariant: state.product?.logoVariant,

        recipientName: state.project?.recipientName,
        teamName: state.project?.teamName,
        projectName: state.project?.projectName,
        message: state.project?.message,

        qrEnabled: Boolean(state.qr?.enabled),
        qrValue: state.qr?.value,
        qrContentType: state.qr?.contentType,

        beverageType: state.beverage?.type,
        beverageLabelText: state.beverage?.labelText,

        cameraView: state.camera?.view,
        lightingMode: state.render?.lightingMode,
        renderQuality: state.render?.quality,

        selectedObjectKey: state.editor?.selectedObjectKey,
        price: state.price,
    };
}

export function validateConfiguratorState(
    state = DEFAULT_DESIGN_STATE,
    level = CONFIGURATOR_VALIDATION_LEVEL.FULL,
) {
    const errors = [];
    const warnings = [];

    const templateId = resolveTemplateIdForState(state);
    const templateValidation = validateTemplate(templateId);
    const beverageValidation = validateBeverageState(state.beverage);

    if (!templateValidation.valid) {
        errors.push(...templateValidation.errors);
    }

    warnings.push(...templateValidation.warnings);

    if (!beverageValidation.valid) {
        errors.push(...beverageValidation.errors);
    }

    warnings.push(...beverageValidation.warnings);

    if (!isValidProductPreset(state.product?.preset)) {
        errors.push("El preset del producto no es válido.");
    }

    if (!isValidDesignTemplate(templateId)) {
        errors.push("La plantilla seleccionada no es válida.");
    }

    if (!Object.values(VISUAL_THEME_IDS).includes(state.product?.themeId)) {
        warnings.push("El tema visual no pertenece a los temas definidos.");
    }

    if (state.product?.includeBeverage && state.visibility?.[OBJECT_KEYS.SODA_BOTTLE] === false) {
        warnings.push("El producto incluye bebida, pero la botella está oculta.");
    }

    if (state.qr?.enabled && state.visibility?.[OBJECT_KEYS.QR_CARD] === false) {
        warnings.push("El QR está habilitado, pero la tarjeta QR está oculta.");
    }

    if (state.editor?.selectedObjectKey && !isEditableObjectKey(state.editor.selectedObjectKey)) {
        warnings.push("El objeto seleccionado no está marcado como editable.");
    }

    if (level === CONFIGURATOR_VALIDATION_LEVEL.SCENE || level === CONFIGURATOR_VALIDATION_LEVEL.FULL) {
        Object.entries(state.layout ?? {}).forEach(([objectKey, transform]) => {
            const normalized = normalizeObjectTransform(transform);

            if (normalized.scale.some((value) => value <= 0)) {
                errors.push(`El objeto "${objectKey}" tiene escala inválida.`);
            }
        });
    }

    if (level === CONFIGURATOR_VALIDATION_LEVEL.COMMERCIAL || level === CONFIGURATOR_VALIDATION_LEVEL.FULL) {
        if ((state.price?.estimatedTotal ?? 0) <= 0) {
            warnings.push("El precio estimado todavía no fue calculado.");
        }

        if ((state.customer?.orderQuantity ?? 1) < 1) {
            errors.push("La cantidad del pedido debe ser al menos 1.");
        }
    }

    return {
        valid: errors.length === 0,
        level,
        templateId,
        errors,
        warnings,
        templateValidation,
        beverageValidation,
        checkedAt: nowISO(),
    };
}

export function createConfiguratorSnapshot(
    state = DEFAULT_DESIGN_STATE,
    options = {},
) {
    const exportableState = createExportableDesignState(state);
    const commercialSummary = getConfiguratorCommercialSummary(state);

    const payload = {
        type: "kickoff-box-configurator-snapshot",
        version: CONFIGURATOR_SERVICE_VERSION,
        appVersion: APP_INFO.VERSION,
        mode: options.mode ?? CONFIGURATOR_EXPORT_MODE.FULL,
        state: exportableState,
        commercialSummary,
        scenePayload: options.includeScenePayload === false
            ? null
            : prepareConfiguratorForScene(state),
        createdAt: nowISO(),
    };

    if (options.mode === CONFIGURATOR_EXPORT_MODE.DESIGN_ONLY) {
        return {
            ...payload,
            commercialSummary: null,
            scenePayload: null,
        };
    }

    if (options.mode === CONFIGURATOR_EXPORT_MODE.COMMERCIAL_SUMMARY) {
        return {
            ...payload,
            state: null,
            scenePayload: null,
        };
    }

    if (options.mode === CONFIGURATOR_EXPORT_MODE.SCENE_PAYLOAD) {
        return {
            ...payload,
            commercialSummary: null,
        };
    }

    return payload;
}

export function restoreConfiguratorSnapshot(snapshot = {}) {
    if (!snapshot || snapshot.type !== "kickoff-box-configurator-snapshot") {
        return markDesignStateError(
            createDefaultDesignState(),
            new Error("El archivo no corresponde a una configuración válida de KickOff Box."),
        );
    }

    const restored = mergeDeep(createDefaultDesignState(), snapshot.state ?? {});

    return patchConfiguratorState(
        restored,
        {
            runtime: {
                isReady: true,
                isLoading: false,
                hasUnsavedChanges: true,
                lastError: null,
                lastUpdatedAt: nowISO(),
            },
        },
        {
            origin: CONFIGURATOR_CHANGE_ORIGIN.IMPORT,
            recalculatePrice: true,
        },
    );
}

export function serializeConfiguratorState(state = DEFAULT_DESIGN_STATE, options = {}) {
    return JSON.stringify(
        createConfiguratorSnapshot(state, options),
        null,
        options.pretty === false ? 0 : 2,
    );
}

export function parseConfiguratorState(serialized = "") {
    try {
        const snapshot = JSON.parse(serialized);
        return {
            ok: true,
            state: restoreConfiguratorSnapshot(snapshot),
            snapshot,
            error: null,
        };
    } catch (error) {
        return {
            ok: false,
            state: null,
            snapshot: null,
            error: error.message,
        };
    }
}

export function saveConfiguratorToStorage(
    state = DEFAULT_DESIGN_STATE,
    storage = globalThis.localStorage,
    key = STORAGE_KEYS.DESIGN_STATE,
) {
    if (!storage) {
        return {
            ok: false,
            state,
            error: "localStorage no está disponible.",
        };
    }

    try {
        storage.setItem(key, serializeConfiguratorState(state));
        return {
            ok: true,
            state: markDesignStateSaved(state),
            key,
            savedAt: nowISO(),
        };
    } catch (error) {
        return {
            ok: false,
            state: markDesignStateError(state, error),
            error: error.message,
        };
    }
}

export function loadConfiguratorFromStorage(
    storage = globalThis.localStorage,
    key = STORAGE_KEYS.DESIGN_STATE,
) {
    if (!storage) {
        return {
            ok: false,
            state: createDefaultDesignState(),
            error: "localStorage no está disponible.",
        };
    }

    const serialized = storage.getItem(key);

    if (!serialized) {
        return {
            ok: false,
            state: createDefaultDesignState(),
            error: "No existe configuración guardada.",
        };
    }

    return parseConfiguratorState(serialized);
}

export function clearConfiguratorStorage(
    storage = globalThis.localStorage,
    key = STORAGE_KEYS.DESIGN_STATE,
) {
    if (!storage) {
        return {
            ok: false,
            error: "localStorage no está disponible.",
        };
    }

    storage.removeItem(key);

    return {
        ok: true,
        key,
        clearedAt: nowISO(),
    };
}

export function resetConfigurator(options = {}) {
    const state = createConfiguratorState(options);

    return patchConfiguratorState(
        state,
        {
            runtime: {
                isReady: true,
                isLoading: false,
                hasUnsavedChanges: true,
                lastError: null,
            },
            editor: {
                selectedObjectKey: null,
                hoveredObjectKey: null,
                transformHistory: [],
            },
        },
        {
            origin: CONFIGURATOR_CHANGE_ORIGIN.RESET,
            recalculatePrice: true,
        },
    );
}

export function createConfiguratorActionResult(
    actionType,
    previousState,
    nextState,
    meta = {},
) {
    return {
        actionType,
        changed: previousState !== nextState,
        previousState,
        nextState,
        scenePayload: meta.includeScenePayload === false
            ? null
            : prepareConfiguratorForScene(nextState),
        panelDefaults: getConfiguratorPanelDefaults(nextState),
        pricing: nextState.price,
        validation: validateConfiguratorState(nextState),
        meta: {
            at: nowISO(),
            ...meta,
        },
    };
}

export function dispatchConfiguratorAction(
    state = DEFAULT_DESIGN_STATE,
    action = {},
) {
    const previousState = state;
    let nextState = state;

    switch (action.type) {
        case CONFIGURATOR_ACTION_TYPES.RESET:
            nextState = resetConfigurator(action.payload ?? {});
            break;

        case CONFIGURATOR_ACTION_TYPES.PATCH_STATE:
            nextState = patchConfiguratorState(
                state,
                action.payload ?? {},
                action.options ?? {},
            );
            break;

        case CONFIGURATOR_ACTION_TYPES.UPDATE_FIELD:
            nextState = updateConfiguratorField(
                state,
                action.fieldKey,
                action.value,
                action.options ?? {},
            );
            break;

        case CONFIGURATOR_ACTION_TYPES.APPLY_TEMPLATE:
            nextState = applyConfiguratorTemplate(
                state,
                action.templateId,
                action.options ?? {},
            );
            break;

        case CONFIGURATOR_ACTION_TYPES.UPDATE_PRESET:
            nextState = updateConfiguratorPreset(
                state,
                action.preset,
                action.options ?? {},
            );
            break;

        case CONFIGURATOR_ACTION_TYPES.UPDATE_THEME:
            nextState = updateConfiguratorTheme(
                state,
                action.themeId,
                action.options ?? {},
            );
            break;

        case CONFIGURATOR_ACTION_TYPES.UPDATE_BEVERAGE:
            nextState = updateConfiguratorBeverage(
                state,
                action.beverageType,
                action.overrides ?? {},
                action.options ?? {},
            );
            break;

        case CONFIGURATOR_ACTION_TYPES.UPDATE_QR:
            nextState = updateConfiguratorQR(
                state,
                action.qr ?? {},
                action.options ?? {},
            );
            break;

        case CONFIGURATOR_ACTION_TYPES.UPDATE_TEXT:
            nextState = updateConfiguratorText(
                state,
                action.text ?? {},
                action.options ?? {},
            );
            break;

        case CONFIGURATOR_ACTION_TYPES.UPDATE_PROJECT:
            nextState = updateConfiguratorProject(
                state,
                action.project ?? {},
                action.options ?? {},
            );
            break;

        case CONFIGURATOR_ACTION_TYPES.UPDATE_IMAGE:
            nextState = updateConfiguratorImage(
                state,
                action.imageKey,
                action.imageValue,
                action.options ?? {},
            );
            break;

        case CONFIGURATOR_ACTION_TYPES.UPDATE_LOGO:
            nextState = updateConfiguratorLogo(
                state,
                action.logoVariant,
                action.options ?? {},
            );
            break;

        case CONFIGURATOR_ACTION_TYPES.SELECT_OBJECT:
            nextState = selectConfiguratorObject(
                state,
                action.objectKey,
                action.options ?? {},
            );
            break;

        case CONFIGURATOR_ACTION_TYPES.CLEAR_SELECTION:
            nextState = clearConfiguratorSelection(state);
            break;

        case CONFIGURATOR_ACTION_TYPES.SET_OBJECT_VISIBILITY:
            nextState = setConfiguratorObjectVisibility(
                state,
                action.objectKey,
                action.visible,
                action.options ?? {},
            );
            break;

        case CONFIGURATOR_ACTION_TYPES.SET_OBJECT_TRANSFORM:
            nextState = setConfiguratorObjectTransform(
                state,
                action.objectKey,
                action.transform ?? {},
                action.options ?? {},
            );
            break;

        case CONFIGURATOR_ACTION_TYPES.UPDATE_CAMERA:
            nextState = updateConfiguratorCamera(
                state,
                action.camera ?? {},
                action.options ?? {},
            );
            break;

        case CONFIGURATOR_ACTION_TYPES.UPDATE_RENDER:
            nextState = updateConfiguratorRender(
                state,
                action.render ?? {},
                action.options ?? {},
            );
            break;

        case CONFIGURATOR_ACTION_TYPES.UPDATE_PRICE:
            nextState = recalculateConfiguratorPrice(
                state,
                action.options ?? {},
            );
            break;

        case CONFIGURATOR_ACTION_TYPES.ERROR:
            nextState = markDesignStateError(
                state,
                action.error ?? new Error("Error desconocido del configurador."),
            );
            break;

        default:
            nextState = state;
            break;
    }

    return createConfiguratorActionResult(
        action.type ?? "unknown",
        previousState,
        nextState,
        action.meta ?? {},
    );
}

export function createConfiguratorController(initialState = createConfiguratorState()) {
    let currentState = cloneDeep(initialState);
    const listeners = new Set();

    function notify(actionType, previousState, nextState, meta = {}) {
        const event = createConfiguratorActionResult(
            actionType,
            previousState,
            nextState,
            meta,
        );

        listeners.forEach((listener) => {
            listener(event);
        });

        return event;
    }

    return {
        getState() {
            return cloneDeep(currentState);
        },

        setState(nextState, meta = {}) {
            const previousState = currentState;
            currentState = cloneDeep(nextState);

            return notify(
                meta.actionType ?? CONFIGURATOR_ACTION_TYPES.PATCH_STATE,
                previousState,
                currentState,
                meta,
            );
        },

        dispatch(action) {
            const previousState = currentState;
            const result = dispatchConfiguratorAction(currentState, action);

            currentState = result.nextState;

            notify(
                action.type ?? "unknown",
                previousState,
                currentState,
                action.meta ?? {},
            );

            return result;
        },

        subscribe(listener) {
            listeners.add(listener);

            return () => listeners.delete(listener);
        },

        reset(options = {}) {
            return this.dispatch({
                type: CONFIGURATOR_ACTION_TYPES.RESET,
                payload: options,
            });
        },

        applyTemplate(templateId, options = {}) {
            return this.dispatch({
                type: CONFIGURATOR_ACTION_TYPES.APPLY_TEMPLATE,
                templateId,
                options,
            });
        },

        updateField(fieldKey, value, options = {}) {
            return this.dispatch({
                type: CONFIGURATOR_ACTION_TYPES.UPDATE_FIELD,
                fieldKey,
                value,
                options,
            });
        },

        updateBeverage(beverageType, overrides = {}, options = {}) {
            return this.dispatch({
                type: CONFIGURATOR_ACTION_TYPES.UPDATE_BEVERAGE,
                beverageType,
                overrides,
                options,
            });
        },

        selectObject(objectKey, options = {}) {
            return this.dispatch({
                type: CONFIGURATOR_ACTION_TYPES.SELECT_OBJECT,
                objectKey,
                options,
            });
        },

        exportSnapshot(options = {}) {
            return createConfiguratorSnapshot(currentState, options);
        },
    };
}

export function createConfiguratorDiagnostics(state = DEFAULT_DESIGN_STATE) {
    const templateId = resolveTemplateIdForState(state);
    const allTemplatesValidation = validateAllTemplates();
    const validation = validateConfiguratorState(state);
    const scene = prepareConfiguratorForScene(state);
    const commercialSummary = getConfiguratorCommercialSummary(state);

    return {
        ok: validation.valid && allTemplatesValidation.valid,
        serviceVersion: CONFIGURATOR_SERVICE_VERSION,
        templateId,
        stateVersion: state.metadata?.schemaVersion,
        validation,
        allTemplatesValidation,
        sceneSummary: getTemplateSceneSummary(templateId),
        renderableObjectCount: scene.renderableObjects.length,
        editableObjectCount: scene.editableObjects.length,
        exportableObjectCount: scene.exportableObjects.length,
        commercialSummary,
        checkedAt: nowISO(),
    };
}

export const configuratorService = Object.freeze({
    version: CONFIGURATOR_SERVICE_VERSION,
    status: CONFIGURATOR_STATUS,
    actionTypes: CONFIGURATOR_ACTION_TYPES,
    changeOrigin: CONFIGURATOR_CHANGE_ORIGIN,
    validationLevel: CONFIGURATOR_VALIDATION_LEVEL,
    exportMode: CONFIGURATOR_EXPORT_MODE,

    createConfiguratorState,
    initializeConfigurator,

    patchConfiguratorState,
    updateConfiguratorField,
    getConfiguratorField,
    updateConfiguratorPath,
    getConfiguratorPath,

    applyConfiguratorTemplate,
    updateConfiguratorPreset,
    updateConfiguratorTheme,
    updateConfiguratorBeverage,
    recommendConfiguratorBeverage,

    updateConfiguratorProject,
    updateConfiguratorText,
    updateConfiguratorQR,
    updateConfiguratorLogo,
    updateConfiguratorImage,

    setConfiguratorObjectVisibility,
    toggleConfiguratorObjectVisibility,
    setConfiguratorObjectTransform,
    resetConfiguratorObjectTransform,
    selectConfiguratorObject,
    clearConfiguratorSelection,

    updateConfiguratorEditor,
    updateConfiguratorCamera,
    updateConfiguratorRender,

    recalculateConfiguratorPrice,
    getConfiguratorCommercialSummary,
    prepareConfiguratorForScene,
    createObjectRegistryPayload,
    getConfiguratorPanelDefaults,
    validateConfiguratorState,

    createConfiguratorSnapshot,
    restoreConfiguratorSnapshot,
    serializeConfiguratorState,
    parseConfiguratorState,
    saveConfiguratorToStorage,
    loadConfiguratorFromStorage,
    clearConfiguratorStorage,

    resetConfigurator,
    createConfiguratorActionResult,
    dispatchConfiguratorAction,
    createConfiguratorController,
    createConfiguratorDiagnostics,
});
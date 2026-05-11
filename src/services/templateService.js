import {
    DESIGN_TEMPLATES,
    DEFAULT_TEMPLATE_ID,
    TEMPLATE_DISPLAY_ORDER,
    TEMPLATE_GROUPS,
    TEMPLATE_COMPLEXITY,
    TEMPLATE_PERSONALIZATION_LEVEL,
    TEMPLATE_LAYOUT_STYLE,
    TEMPLATE_RENDER_STYLE,
    getDesignTemplate,
    getDesignTemplateState,
    getDesignTemplateOptions,
    getTemplatesByPreset,
    getTemplatesByGroup,
    getRecommendedTemplateId,
    getTemplateObjectVisibility,
    getTemplateObjectLayout,
    getTemplatePriceItems,
    getTemplateVisualConfig,
    isValidDesignTemplateId,
} from "../config/designTemplates.js";

import {
    createDefaultDesignState,
    createDesignStateFromTemplate,
} from "../data/defaultDesignState.js";

import {
    estimatePresetCost,
    getPresetPricingRule,
    getTemplatePricingAdjustment,
    getThemePricingAdjustment,
} from "../data/pricingRules.js";

import {
    PRODUCT_PRESET_IDS,
    DESIGN_TEMPLATE_IDS,
    DESIGN_TEMPLATE_LABELS,
    VISUAL_THEME_IDS,
    CAMERA_VIEW_IDS,
    LIGHTING_MODE_IDS,
    RENDER_QUALITY_IDS,
    DEFAULT_DESIGN_TEMPLATE,
    DEFAULT_PRODUCT_PRESET,
    DEFAULT_VISUAL_THEME,
    DEFAULT_CAMERA_VIEW,
    DEFAULT_LIGHTING_MODE,
    DEFAULT_RENDER_QUALITY,
} from "../constants/appConstants.js";

import {
    OBJECT_KEYS,
    OBJECT_ROLES,
    OBJECT_CATEGORIES,
    getObjectRole,
    getObjectCategory,
    isEditableObjectKey,
    isExportableObjectKey,
} from "../constants/objectKeys.js";

export const TEMPLATE_SERVICE_VERSION = "1.0.0";

export const TEMPLATE_SERVICE_STATUS = Object.freeze({
    READY: "ready",
    FALLBACK: "fallback",
    INVALID: "invalid",
});

export const TEMPLATE_APPLICATION_MODE = Object.freeze({
    REPLACE: "replace",
    MERGE: "merge",
    PREVIEW: "preview",
});

export const TEMPLATE_SCENE_TARGETS = Object.freeze({
    FULL_SCENE: "full-scene",
    PRODUCT_ONLY: "product-only",
    VISUAL_ONLY: "visual-only",
    PRICING_ONLY: "pricing-only",
});

const REQUIRED_TEMPLATE_SECTIONS = Object.freeze([
    "id",
    "label",
    "group",
    "complexity",
    "personalizationLevel",
    "layoutStyle",
    "renderStyle",
    "preset",
    "themeId",
    "commercial",
    "visual",
    "state",
]);

const REQUIRED_STATE_SECTIONS = Object.freeze([
    "product",
    "project",
    "text",
    "qr",
    "beverage",
    "visibility",
    "layout",
    "camera",
    "render",
]);

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

function getNestedValue(target, path, fallback = undefined) {
    if (!path) return fallback;

    const value = path.split(".").reduce((cursor, key) => {
        if (cursor == null) return undefined;
        return cursor[key];
    }, target);

    return value ?? fallback;
}

function normalizeTemplateId(templateId = DEFAULT_TEMPLATE_ID) {
    return isValidDesignTemplateId(templateId)
        ? templateId
        : DEFAULT_TEMPLATE_ID;
}

function normalizePresetId(preset = DEFAULT_PRODUCT_PRESET) {
    return Object.values(PRODUCT_PRESET_IDS).includes(preset)
        ? preset
        : DEFAULT_PRODUCT_PRESET;
}

function normalizeThemeId(themeId = DEFAULT_VISUAL_THEME) {
    return Object.values(VISUAL_THEME_IDS).includes(themeId)
        ? themeId
        : DEFAULT_VISUAL_THEME;
}

function normalizeCameraView(view = DEFAULT_CAMERA_VIEW) {
    return Object.values(CAMERA_VIEW_IDS).includes(view)
        ? view
        : DEFAULT_CAMERA_VIEW;
}

function normalizeLightingMode(mode = DEFAULT_LIGHTING_MODE) {
    return Object.values(LIGHTING_MODE_IDS).includes(mode)
        ? mode
        : DEFAULT_LIGHTING_MODE;
}

function normalizeRenderQuality(quality = DEFAULT_RENDER_QUALITY) {
    return Object.values(RENDER_QUALITY_IDS).includes(quality)
        ? quality
        : DEFAULT_RENDER_QUALITY;
}

function createValidationResult(valid, errors = [], warnings = []) {
    return {
        valid,
        errors,
        warnings,
        checkedAt: new Date().toISOString(),
    };
}

function getVisibilityEntries(visibility = {}) {
    return Object.entries(visibility).map(([objectKey, visible]) => ({
        objectKey,
        visible: Boolean(visible),
        role: getObjectRole(objectKey),
        category: getObjectCategory(objectKey),
        editable: isEditableObjectKey(objectKey),
        exportable: isExportableObjectKey(objectKey),
    }));
}

function getLayoutEntries(layout = {}) {
    return Object.entries(layout).map(([objectKey, transform]) => ({
        objectKey,
        role: getObjectRole(objectKey),
        category: getObjectCategory(objectKey),
        editable: isEditableObjectKey(objectKey),
        exportable: isExportableObjectKey(objectKey),
        transform: {
            position: transform?.position ?? [0, 0, 0],
            rotation: transform?.rotation ?? [0, 0, 0],
            scale: transform?.scale ?? [1, 1, 1],
            slot: transform?.slot ?? null,
        },
    }));
}

function getVisibleLayoutEntries(templateId = DEFAULT_TEMPLATE_ID) {
    const visibility = getTemplateObjectVisibility(templateId);
    const layout = getTemplateObjectLayout(templateId);

    return getLayoutEntries(layout).filter(
        (entry) => visibility[entry.objectKey] !== false,
    );
}

function getHiddenObjects(templateId = DEFAULT_TEMPLATE_ID) {
    const visibility = getTemplateObjectVisibility(templateId);

    return Object.entries(visibility)
        .filter(([, visible]) => !visible)
        .map(([objectKey]) => objectKey);
}

function getVisibleObjects(templateId = DEFAULT_TEMPLATE_ID) {
    const visibility = getTemplateObjectVisibility(templateId);

    return Object.entries(visibility)
        .filter(([, visible]) => Boolean(visible))
        .map(([objectKey]) => objectKey);
}

export function getTemplateCatalog() {
    return cloneDeep(DESIGN_TEMPLATES);
}

export function getTemplateGroups() {
    return cloneDeep(TEMPLATE_GROUPS);
}

export function getTemplateComplexityLevels() {
    return cloneDeep(TEMPLATE_COMPLEXITY);
}

export function getTemplatePersonalizationLevels() {
    return cloneDeep(TEMPLATE_PERSONALIZATION_LEVEL);
}

export function getTemplateLayoutStyles() {
    return cloneDeep(TEMPLATE_LAYOUT_STYLE);
}

export function getTemplateRenderStyles() {
    return cloneDeep(TEMPLATE_RENDER_STYLE);
}

export function getTemplateById(templateId = DEFAULT_TEMPLATE_ID) {
    return cloneDeep(getDesignTemplate(normalizeTemplateId(templateId)));
}

export function getDefaultTemplate() {
    return getTemplateById(DEFAULT_TEMPLATE_ID);
}

export function getTemplateLabel(templateId = DEFAULT_TEMPLATE_ID) {
    const safeTemplateId = normalizeTemplateId(templateId);

    return DESIGN_TEMPLATE_LABELS[safeTemplateId] ?? DESIGN_TEMPLATE_LABELS[DEFAULT_DESIGN_TEMPLATE];
}

export function getTemplateOptionsForUI() {
    return getDesignTemplateOptions().map((template) => ({
        ...template,
        recommended: template.id === DEFAULT_TEMPLATE_ID,
        premium: template.preset === PRODUCT_PRESET_IDS.PREMIUM,
    }));
}

export function getTemplateSelectorGroups() {
    return Object.values(TEMPLATE_GROUPS).map((group) => ({
        group,
        templates: getTemplatesByGroup(group).map((template) => ({
            id: template.id,
            label: template.label,
            preset: template.preset,
            complexity: template.complexity,
            personalizationLevel: template.personalizationLevel,
            positioning: template.commercial?.positioning ?? "",
        })),
    }));
}

export function getTemplatesForPreset(preset = DEFAULT_PRODUCT_PRESET) {
    return getTemplatesByPreset(normalizePresetId(preset)).map((template) => cloneDeep(template));
}

export function recommendTemplate(context = {}) {
    const recommendedId = getRecommendedTemplateId(context);

    return {
        templateId: recommendedId,
        template: getTemplateById(recommendedId),
        reason: resolveRecommendationReason(context, recommendedId),
    };
}

function resolveRecommendationReason(context = {}, templateId = DEFAULT_TEMPLATE_ID) {
    if (context.institutional) {
        return "Se recomienda plantilla institucional porque el regalo está orientado a autoridad, invitado especial o evento formal.";
    }

    if (context.jury || context.tribunal) {
        return "Se recomienda plantilla para jurado porque prioriza mensaje formal, QR, logo de carrera y souvenir.";
    }

    if (context.defense || context.finalDefense) {
        return "Se recomienda plantilla de defensa porque replica mejor la composición de caja premium con mensaje de agradecimiento en tapa.";
    }

    if (context.premium || templateId === DESIGN_TEMPLATE_IDS.PREMIUM) {
        return "Se recomienda caja premium porque representa mejor el empaque negro/dorado, bebida acostada, QR, rosa, pastelito y llavero.";
    }

    if (context.budget === "low" || context.studentBudget) {
        return "Se recomienda caja básica porque reduce elementos y mantiene precio accesible para estudiantes.";
    }

    return "Se recomienda caja estándar porque equilibra presentación, contenido y costo.";
}

export function validateTemplate(templateId = DEFAULT_TEMPLATE_ID) {
    const safeTemplateId = normalizeTemplateId(templateId);
    const template = getDesignTemplate(safeTemplateId);
    const errors = [];
    const warnings = [];

    REQUIRED_TEMPLATE_SECTIONS.forEach((section) => {
        if (!(section in template)) {
            errors.push(`La plantilla "${safeTemplateId}" no contiene la sección "${section}".`);
        }
    });

    REQUIRED_STATE_SECTIONS.forEach((section) => {
        if (!(section in (template.state ?? {}))) {
            errors.push(`La plantilla "${safeTemplateId}" no contiene state.${section}.`);
        }
    });

    if (template.id !== safeTemplateId) {
        errors.push(`El ID interno de la plantilla no coincide con "${safeTemplateId}".`);
    }

    if (!Object.values(PRODUCT_PRESET_IDS).includes(template.preset)) {
        errors.push(`La plantilla "${safeTemplateId}" tiene un preset inválido.`);
    }

    if (!Object.values(VISUAL_THEME_IDS).includes(template.themeId)) {
        errors.push(`La plantilla "${safeTemplateId}" tiene un themeId inválido.`);
    }

    const visibility = template.state?.visibility ?? {};
    const layout = template.state?.layout ?? {};

    Object.keys(layout).forEach((objectKey) => {
        if (!(objectKey in visibility)) {
            warnings.push(`El objeto "${objectKey}" tiene layout, pero no tiene visibilidad definida.`);
        }
    });

    Object.entries(layout).forEach(([objectKey, transform]) => {
        if (!Array.isArray(transform.position) || transform.position.length !== 3) {
            errors.push(`El objeto "${objectKey}" debe tener position [x, y, z].`);
        }

        if (!Array.isArray(transform.rotation) || transform.rotation.length !== 3) {
            errors.push(`El objeto "${objectKey}" debe tener rotation [x, y, z].`);
        }

        if (!Array.isArray(transform.scale) || transform.scale.length !== 3) {
            errors.push(`El objeto "${objectKey}" debe tener scale [x, y, z].`);
        }
    });

    if (!template.commercial?.priceItems?.length) {
        warnings.push(`La plantilla "${safeTemplateId}" no tiene priceItems comerciales.`);
    }

    if (template.state?.product?.includeBeverage && !template.state?.beverage?.type) {
        warnings.push(`La plantilla "${safeTemplateId}" incluye bebida, pero no define beverage.type.`);
    }

    if (template.state?.qr?.enabled && !template.state?.qr?.value) {
        warnings.push(`La plantilla "${safeTemplateId}" activa QR, pero no define qr.value.`);
    }

    return createValidationResult(errors.length === 0, errors, warnings);
}

export function validateAllTemplates() {
    const results = Object.fromEntries(
        TEMPLATE_DISPLAY_ORDER.map((templateId) => [
            templateId,
            validateTemplate(templateId),
        ]),
    );

    const errors = Object.values(results).flatMap((result) => result.errors);
    const warnings = Object.values(results).flatMap((result) => result.warnings);

    return {
        valid: errors.length === 0,
        results,
        errors,
        warnings,
        checkedAt: new Date().toISOString(),
    };
}

export function createTemplateState(templateId = DEFAULT_TEMPLATE_ID, overrides = {}) {
    const safeTemplateId = normalizeTemplateId(templateId);
    const template = getDesignTemplate(safeTemplateId);

    return createDesignStateFromTemplate(template, overrides);
}

export function applyTemplate(
    baseState = createDefaultDesignState(),
    templateId = DEFAULT_TEMPLATE_ID,
    overrides = {},
    options = {},
) {
    const safeTemplateId = normalizeTemplateId(templateId);
    const mode = options.mode ?? TEMPLATE_APPLICATION_MODE.MERGE;
    const template = getDesignTemplate(safeTemplateId);
    const templateState = getDesignTemplateState(safeTemplateId);

    let nextState;

    if (mode === TEMPLATE_APPLICATION_MODE.REPLACE) {
        nextState = createDesignStateFromTemplate(template, overrides);
    } else if (mode === TEMPLATE_APPLICATION_MODE.PREVIEW) {
        nextState = mergeDeep(createDefaultDesignState(), templateState);
        nextState = mergeDeep(nextState, overrides);
    } else {
        nextState = mergeDeep(baseState, templateState);
        nextState = mergeDeep(nextState, overrides);
    }

    const timestamp = new Date().toISOString();

    return mergeDeep(nextState, {
        template: {
            appliedTemplateId: safeTemplateId,
            appliedPreset: template.state?.product?.preset ?? template.preset,
            appliedThemeId: template.state?.product?.themeId ?? template.themeId,
            lastAppliedAt: timestamp,
            pendingTemplateChanges: false,
        },
        runtime: {
            hasUnsavedChanges: mode !== TEMPLATE_APPLICATION_MODE.PREVIEW,
            lastUpdatedAt: timestamp,
        },
    });
}

export function createTemplateApplicationResult(
    baseState = createDefaultDesignState(),
    templateId = DEFAULT_TEMPLATE_ID,
    overrides = {},
    options = {},
) {
    const safeTemplateId = normalizeTemplateId(templateId);
    const validation = validateTemplate(safeTemplateId);
    const previousTemplateId =
        baseState?.template?.appliedTemplateId ??
        baseState?.product?.templateId ??
        DEFAULT_TEMPLATE_ID;

    const nextState = applyTemplate(baseState, safeTemplateId, overrides, options);

    return {
        status: validation.valid
            ? TEMPLATE_SERVICE_STATUS.READY
            : TEMPLATE_SERVICE_STATUS.INVALID,
        templateId: safeTemplateId,
        previousTemplateId,
        changed: previousTemplateId !== safeTemplateId,
        validation,
        template: getTemplateById(safeTemplateId),
        state: nextState,
        sceneConfig: prepareSceneTemplateConfig(safeTemplateId, nextState),
        pricingPreview: createTemplatePricingPreview(safeTemplateId, nextState),
        appliedAt: new Date().toISOString(),
    };
}

export function prepareSceneTemplateConfig(
    templateId = DEFAULT_TEMPLATE_ID,
    state = createTemplateState(templateId),
    options = {},
) {
    const safeTemplateId = normalizeTemplateId(templateId);
    const template = getDesignTemplate(safeTemplateId);
    const visibility = mergeDeep(
        getTemplateObjectVisibility(safeTemplateId),
        options.visibility ?? {},
    );
    const layout = mergeDeep(
        getTemplateObjectLayout(safeTemplateId),
        options.layout ?? {},
    );

    const visual = mergeDeep(
        getTemplateVisualConfig(safeTemplateId),
        options.visual ?? {},
    );

    const visibleObjects = getVisibilityEntries(visibility)
        .filter((entry) => entry.visible)
        .map((entry) => entry.objectKey);

    const hiddenObjects = getVisibilityEntries(visibility)
        .filter((entry) => !entry.visible)
        .map((entry) => entry.objectKey);

    const objectTransforms = Object.fromEntries(
        getLayoutEntries(layout).map((entry) => [
            entry.objectKey,
            entry.transform,
        ]),
    );

    return {
        templateId: safeTemplateId,
        templateLabel: template.label,
        sceneTarget: options.sceneTarget ?? TEMPLATE_SCENE_TARGETS.FULL_SCENE,

        preset: state.product?.preset ?? template.preset,
        themeId: state.product?.themeId ?? template.themeId,

        camera: {
            view: normalizeCameraView(state.camera?.view ?? template.cameraView),
            autoRotate: Boolean(state.camera?.autoRotate),
            focusObjectKey: state.camera?.focusObjectKey ?? null,
            zoomLevel: state.camera?.zoomLevel ?? 1,
        },

        render: {
            quality: normalizeRenderQuality(state.render?.quality ?? template.renderQuality),
            lightingMode: normalizeLightingMode(state.render?.lightingMode ?? template.lightingMode),
            shadowsEnabled: state.render?.shadowsEnabled !== false,
            environmentEnabled: state.render?.environmentEnabled !== false,
            gridVisible: Boolean(state.render?.gridVisible),
        },

        visual,
        visibility,
        layout,
        visibleObjects,
        hiddenObjects,
        objectTransforms,

        content: {
            project: cloneDeep(state.project ?? {}),
            text: cloneDeep(state.text ?? {}),
            qr: cloneDeep(state.qr ?? {}),
            beverage: cloneDeep(state.beverage ?? {}),
            images: cloneDeep(state.images ?? {}),
        },

        commercial: cloneDeep(template.commercial ?? {}),
        metadata: {
            templateVersion: DESIGN_TEMPLATES[safeTemplateId]?.id ? "available" : "fallback",
            generatedAt: new Date().toISOString(),
        },
    };
}

export function createTemplatePricingPreview(
    templateId = DEFAULT_TEMPLATE_ID,
    state = createTemplateState(templateId),
    options = {},
) {
    const safeTemplateId = normalizeTemplateId(templateId);
    const template = getDesignTemplate(safeTemplateId);
    const selectedExtras = options.selectedExtras ?? [];
    const uploadedImages = options.uploadedImages ?? state.images?.uploadedImages ?? {};

    return estimatePresetCost({
        preset: state.product?.preset ?? template.preset,
        templateId: safeTemplateId,
        themeId: state.product?.themeId ?? template.themeId,
        beverageType: state.beverage?.type,
        quantity: state.customer?.orderQuantity,
        selectedExtras,
        uploadedImages,
        urgency: options.urgency,
        delivery: options.delivery,
        costMode: options.costMode ?? "expected",
    });
}

export function getTemplateCommercialConfig(templateId = DEFAULT_TEMPLATE_ID) {
    const safeTemplateId = normalizeTemplateId(templateId);
    const template = getDesignTemplate(safeTemplateId);
    const presetRule = getPresetPricingRule(template.preset);
    const templateAdjustment = getTemplatePricingAdjustment(safeTemplateId);
    const themeAdjustment = getThemePricingAdjustment(template.themeId);

    return {
        templateId: safeTemplateId,
        title: template.commercial?.title ?? template.label,
        positioning: template.commercial?.positioning ?? "",
        suggestedUse: template.commercial?.suggestedUse ?? "",
        targetBuyer: template.commercial?.targetBuyer ?? "",
        targetRecipient: template.commercial?.targetRecipient ?? "",
        pricePreset: template.commercial?.pricePreset ?? template.preset,
        priceItems: getTemplatePriceItems(safeTemplateId),
        presetRule,
        templateAdjustment,
        themeAdjustment,
    };
}

export function getTemplateSceneSummary(templateId = DEFAULT_TEMPLATE_ID) {
    const safeTemplateId = normalizeTemplateId(templateId);
    const template = getDesignTemplate(safeTemplateId);
    const visibility = getTemplateObjectVisibility(safeTemplateId);
    const layout = getTemplateObjectLayout(safeTemplateId);
    const visibleObjects = getVisibleObjects(safeTemplateId);
    const hiddenObjects = getHiddenObjects(safeTemplateId);

    return {
        templateId: safeTemplateId,
        label: template.label,
        preset: template.preset,
        themeId: template.themeId,
        complexity: template.complexity,
        personalizationLevel: template.personalizationLevel,
        layoutStyle: template.layoutStyle,
        renderStyle: template.renderStyle,
        visual: cloneDeep(template.visual),
        visibleObjects,
        hiddenObjects,
        objectCount: Object.keys(visibility).length,
        visibleObjectCount: visibleObjects.length,
        hiddenObjectCount: hiddenObjects.length,
        layoutObjectCount: Object.keys(layout).length,
        hasBeverage: Boolean(visibility[OBJECT_KEYS.SODA_BOTTLE]),
        hasQR: Boolean(visibility[OBJECT_KEYS.QR_CARD]),
        hasLidInteriorDesign: Boolean(visibility[OBJECT_KEYS.LID_INTERIOR_DESIGN]),
        hasPaperFiller: Boolean(visibility[OBJECT_KEYS.PAPER_FILLER]),
        hasKeychain: Boolean(visibility[OBJECT_KEYS.RESIN_KEYCHAIN]),
        recommendedCameraView: template.cameraView,
        recommendedLightingMode: template.lightingMode,
    };
}

export function getTemplateObjectConfig(templateId = DEFAULT_TEMPLATE_ID, objectKey) {
    const safeTemplateId = normalizeTemplateId(templateId);
    const visibility = getTemplateObjectVisibility(safeTemplateId);
    const layout = getTemplateObjectLayout(safeTemplateId);

    return {
        objectKey,
        visible: visibility[objectKey] !== false,
        transform: cloneDeep(layout[objectKey] ?? null),
        role: getObjectRole(objectKey),
        category: getObjectCategory(objectKey),
        editable: isEditableObjectKey(objectKey),
        exportable: isExportableObjectKey(objectKey),
    };
}

export function isObjectVisibleInTemplate(templateId = DEFAULT_TEMPLATE_ID, objectKey) {
    const visibility = getTemplateObjectVisibility(normalizeTemplateId(templateId));

    return visibility[objectKey] !== false;
}

export function getObjectTransformInTemplate(templateId = DEFAULT_TEMPLATE_ID, objectKey) {
    const layout = getTemplateObjectLayout(normalizeTemplateId(templateId));

    return cloneDeep(layout[objectKey] ?? null);
}

export function getRenderableObjectsForTemplate(templateId = DEFAULT_TEMPLATE_ID) {
    const safeTemplateId = normalizeTemplateId(templateId);
    const visibility = getTemplateObjectVisibility(safeTemplateId);
    const layout = getTemplateObjectLayout(safeTemplateId);

    return getVisibilityEntries(visibility)
        .filter((entry) => entry.visible)
        .map((entry) => ({
            ...entry,
            transform: cloneDeep(layout[entry.objectKey] ?? null),
            requiresLayout: Boolean(layout[entry.objectKey]),
        }));
}

export function getEditableObjectsForTemplate(templateId = DEFAULT_TEMPLATE_ID) {
    return getRenderableObjectsForTemplate(templateId).filter((entry) => entry.editable);
}

export function getExportableObjectsForTemplate(templateId = DEFAULT_TEMPLATE_ID) {
    return getRenderableObjectsForTemplate(templateId).filter((entry) => entry.exportable);
}

export function getTemplatePanelDefaults(templateId = DEFAULT_TEMPLATE_ID) {
    const safeTemplateId = normalizeTemplateId(templateId);
    const templateState = getDesignTemplateState(safeTemplateId);

    return {
        templateId: safeTemplateId,
        preset: templateState.product?.preset ?? PRODUCT_PRESET_IDS.PREMIUM,
        themeId: templateState.product?.themeId ?? VISUAL_THEME_IDS.PREMIUM_BLACK_GOLD,

        boxColor: templateState.product?.boxColor,
        interiorColor: templateState.product?.interiorColor,
        accentColor: templateState.product?.accentColor,
        logoVariant: templateState.product?.logoVariant,

        recipientName: templateState.project?.recipientName,
        teamName: templateState.project?.teamName,
        projectName: templateState.project?.projectName,
        message: templateState.project?.message,

        qrEnabled: Boolean(templateState.qr?.enabled),
        qrValue: templateState.qr?.value,
        qrContentType: templateState.qr?.contentType,

        beverageType: templateState.beverage?.type,
        beverageLabelText: templateState.beverage?.labelText,

        cameraView: templateState.camera?.view,
        lightingMode: templateState.render?.lightingMode,
        renderQuality: templateState.render?.quality,
    };
}

export function compareTemplates(leftTemplateId, rightTemplateId) {
    const leftId = normalizeTemplateId(leftTemplateId);
    const rightId = normalizeTemplateId(rightTemplateId);
    const left = getDesignTemplate(leftId);
    const right = getDesignTemplate(rightId);

    const leftVisible = new Set(getVisibleObjects(leftId));
    const rightVisible = new Set(getVisibleObjects(rightId));

    const addedObjects = [...rightVisible].filter((objectKey) => !leftVisible.has(objectKey));
    const removedObjects = [...leftVisible].filter((objectKey) => !rightVisible.has(objectKey));
    const sharedObjects = [...rightVisible].filter((objectKey) => leftVisible.has(objectKey));

    return {
        leftTemplateId: leftId,
        rightTemplateId: rightId,
        changed: leftId !== rightId,

        presetChanged: left.preset !== right.preset,
        themeChanged: left.themeId !== right.themeId,
        complexityChanged: left.complexity !== right.complexity,

        addedObjects,
        removedObjects,
        sharedObjects,

        leftSummary: getTemplateSceneSummary(leftId),
        rightSummary: getTemplateSceneSummary(rightId),
    };
}

export function createTemplateChangePatch(fromTemplateId, toTemplateId) {
    const comparison = compareTemplates(fromTemplateId, toTemplateId);
    const targetTemplate = getDesignTemplateState(toTemplateId);

    return {
        fromTemplateId: comparison.leftTemplateId,
        toTemplateId: comparison.rightTemplateId,
        changed: comparison.changed,
        addedObjects: comparison.addedObjects,
        removedObjects: comparison.removedObjects,
        sharedObjects: comparison.sharedObjects,
        patch: {
            product: cloneDeep(targetTemplate.product ?? {}),
            project: cloneDeep(targetTemplate.project ?? {}),
            text: cloneDeep(targetTemplate.text ?? {}),
            qr: cloneDeep(targetTemplate.qr ?? {}),
            beverage: cloneDeep(targetTemplate.beverage ?? {}),
            visibility: cloneDeep(targetTemplate.visibility ?? {}),
            layout: cloneDeep(targetTemplate.layout ?? {}),
            camera: cloneDeep(targetTemplate.camera ?? {}),
            render: cloneDeep(targetTemplate.render ?? {}),
        },
        generatedAt: new Date().toISOString(),
    };
}

export function resolveTemplateForState(state = {}) {
    const templateId =
        state.product?.templateId ??
        state.template?.appliedTemplateId ??
        DEFAULT_TEMPLATE_ID;

    return getTemplateById(templateId);
}

export function resolveTemplateIdForState(state = {}) {
    return normalizeTemplateId(
        state.product?.templateId ??
        state.template?.appliedTemplateId ??
        DEFAULT_TEMPLATE_ID,
    );
}

export function prepareTemplateForSceneComposer(state = createDefaultDesignState(), options = {}) {
    const templateId = resolveTemplateIdForState(state);
    const sceneConfig = prepareSceneTemplateConfig(templateId, state, options);

    return {
        templateId,
        template: getTemplateById(templateId),
        sceneConfig,
        renderableObjects: getRenderableObjectsForTemplate(templateId),
        editableObjects: getEditableObjectsForTemplate(templateId),
        exportableObjects: getExportableObjectsForTemplate(templateId),
        pricingPreview: createTemplatePricingPreview(templateId, state, options.pricing ?? {}),
        panelDefaults: getTemplatePanelDefaults(templateId),
        validation: validateTemplate(templateId),
    };
}

export function getTemplateByCommercialIntent(intent = {}) {
    const recommended = recommendTemplate({
        institutional: intent.institutional,
        jury: intent.jury,
        tribunal: intent.tribunal,
        defense: intent.defense,
        finalDefense: intent.finalDefense,
        premium: intent.premium,
        studentBudget: intent.studentBudget,
        budget: intent.budget,
    });

    return recommended;
}

export function getTemplateQualityScore(templateId = DEFAULT_TEMPLATE_ID) {
    const summary = getTemplateSceneSummary(templateId);
    let score = 0;

    if (summary.hasPaperFiller) score += 15;
    if (summary.hasBeverage) score += 15;
    if (summary.hasQR) score += 15;
    if (summary.hasLidInteriorDesign) score += 20;
    if (summary.hasKeychain) score += 15;
    if (summary.visibleObjectCount >= 10) score += 10;
    if (summary.renderStyle === TEMPLATE_RENDER_STYLE.PREMIUM_SHOWCASE) score += 10;

    return {
        templateId: normalizeTemplateId(templateId),
        score: Math.min(score, 100),
        level:
            score >= 85
                ? "premium"
                : score >= 65
                    ? "alto"
                    : score >= 45
                        ? "medio"
                        : "básico",
        summary,
    };
}

export function getBestTemplateForShowcase() {
    const candidates = TEMPLATE_DISPLAY_ORDER
        .map((templateId) => getTemplateQualityScore(templateId))
        .sort((a, b) => b.score - a.score);

    return {
        best: candidates[0],
        candidates,
    };
}

export const templateService = Object.freeze({
    version: TEMPLATE_SERVICE_VERSION,
    status: TEMPLATE_SERVICE_STATUS,

    getTemplateCatalog,
    getTemplateGroups,
    getTemplateComplexityLevels,
    getTemplatePersonalizationLevels,
    getTemplateLayoutStyles,
    getTemplateRenderStyles,

    getTemplateById,
    getDefaultTemplate,
    getTemplateLabel,
    getTemplateOptionsForUI,
    getTemplateSelectorGroups,
    getTemplatesForPreset,

    recommendTemplate,
    validateTemplate,
    validateAllTemplates,

    createTemplateState,
    applyTemplate,
    createTemplateApplicationResult,

    prepareSceneTemplateConfig,
    prepareTemplateForSceneComposer,

    createTemplatePricingPreview,
    getTemplateCommercialConfig,
    getTemplateSceneSummary,
    getTemplateObjectConfig,

    isObjectVisibleInTemplate,
    getObjectTransformInTemplate,
    getRenderableObjectsForTemplate,
    getEditableObjectsForTemplate,
    getExportableObjectsForTemplate,

    getTemplatePanelDefaults,
    compareTemplates,
    createTemplateChangePatch,
    resolveTemplateForState,
    resolveTemplateIdForState,
    getTemplateByCommercialIntent,
    getTemplateQualityScore,
    getBestTemplateForShowcase,
});
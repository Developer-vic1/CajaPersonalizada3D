import {
    APP_INFO,
    PRODUCT_PRESET_IDS,
    DEFAULT_PRODUCT_PRESET,
    DESIGN_TEMPLATE_IDS,
    DEFAULT_DESIGN_TEMPLATE,
    VISUAL_THEME_IDS,
    DEFAULT_VISUAL_THEME,
    DEFAULT_BEVERAGE_TYPE,
    DEFAULT_BEVERAGE_LAYOUT_MODE,
    DEFAULT_CAMERA_VIEW,
    DEFAULT_LIGHTING_MODE,
    DEFAULT_RENDER_QUALITY,
    DEFAULT_EDIT_MODE,
    DEFAULT_TRANSFORM_SPACE,
    DEFAULT_LOGO_VARIANT,
    LOGO_VARIANTS,
    THEME_COLOR_PRESETS,
    DEFAULT_TEXT_CONTENT,
    QR_DEFAULTS,
    BUSINESS_DEFAULTS,
    ANIMATION_DEFAULTS,
    EXPORT_TYPES,
    FORM_FIELD_KEYS,
} from "../constants/appConstants.js";

import {
    OBJECT_KEYS,
    GROUP_KEYS,
    DEFAULT_EDITABLE_OBJECTS,
    STRUCTURAL_OBJECTS,
    EXPORTABLE_OBJECTS,
} from "../constants/objectKeys.js";

const premiumTheme = THEME_COLOR_PRESETS[DEFAULT_VISUAL_THEME];

export const DEFAULT_CUSTOMER_STATE = Object.freeze({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    city: BUSINESS_DEFAULTS.DEFAULT_CITY,
    country: BUSINESS_DEFAULTS.DEFAULT_COUNTRY,
    orderQuantity: BUSINESS_DEFAULTS.MIN_ORDER_QUANTITY,
});

export const DEFAULT_PROJECT_STATE = Object.freeze({
    recipientName: DEFAULT_TEXT_CONTENT.RECIPIENT_NAME,
    teamName: DEFAULT_TEXT_CONTENT.TEAM_NAME,
    projectName: DEFAULT_TEXT_CONTENT.PROJECT_NAME,
    career: DEFAULT_TEXT_CONTENT.CAREER,
    university: DEFAULT_TEXT_CONTENT.UNIVERSITY,
    message: DEFAULT_TEXT_CONTENT.MESSAGE,
    occasion: "presentacion-final",
    academicYear: "2026",
});

export const DEFAULT_PRODUCT_STATE = Object.freeze({
    preset: DEFAULT_PRODUCT_PRESET,
    templateId: DEFAULT_DESIGN_TEMPLATE,
    themeId: DEFAULT_VISUAL_THEME,

    boxColor: premiumTheme.boxExterior,
    interiorColor: premiumTheme.boxInterior,
    accentColor: premiumTheme.accent,
    textColor: premiumTheme.text,
    backgroundColor: premiumTheme.background,

    logoVariant: DEFAULT_LOGO_VARIANT,

    includeBox: true,
    includeLid: true,
    includeDividers: true,
    includePaperFiller: true,
    includeCard: true,
    includeQR: true,
    includeCupcake: true,
    includeBeverage: true,
    includeRose: true,
    includeKeychain: true,
    includeCareerLogo: true,
    includeThematicDecorations: true,
});

export const DEFAULT_BEVERAGE_STATE = Object.freeze({
    type: DEFAULT_BEVERAGE_TYPE,
    layoutMode: DEFAULT_BEVERAGE_LAYOUT_MODE,
    labelText: "KICK COLA",
    subLabel: "Classic 2026",
    footerText: "Edición académica",
    customLiquidColor: null,
    customCapColor: null,
    customLabelColor: null,
    customLabelImage: null,
    showBubbles: true,
    showCondensation: true,
    showHighlights: true,
});

export const DEFAULT_QR_STATE = Object.freeze({
    enabled: true,
    value: QR_DEFAULTS.VALUE,
    title: QR_DEFAULTS.TITLE,
    subtitle: QR_DEFAULTS.SUBTITLE,
    footer: QR_DEFAULTS.FOOTER,
    contentType: "url",
    errorCorrectionLevel: QR_DEFAULTS.ERROR_CORRECTION_LEVEL,
});

export const DEFAULT_TEXT_STATE = Object.freeze({
    lidTitle: DEFAULT_TEXT_CONTENT.LID_TITLE,
    lidSubtitle: DEFAULT_TEXT_CONTENT.LID_SUBTITLE,
    lidMessage: DEFAULT_TEXT_CONTENT.MESSAGE,

    cardTitle: DEFAULT_TEXT_CONTENT.CARD_TITLE,
    cardRecipient: DEFAULT_TEXT_CONTENT.RECIPIENT_NAME,
    cardMessage: DEFAULT_TEXT_CONTENT.MESSAGE,
    cardFooter: DEFAULT_TEXT_CONTENT.CARD_FOOTER,

    frontLabel: DEFAULT_TEXT_CONTENT.FRONT_LABEL,
    sideLabel: "Mundial 2026",
    keychainText: "2026",
    keychainSubtitle: "KickOff",
});

export const DEFAULT_IMAGE_STATE = Object.freeze({
    lidImage: null,
    frontStickerImage: null,
    bottleLabelImage: null,
    cardImage: null,
    customLogoImage: null,
    uploadedImages: Object.freeze({}),
});

export const DEFAULT_PRICE_STATE = Object.freeze({
    currency: APP_INFO.CURRENCY,
    currencySymbol: APP_INFO.CURRENCY_SYMBOL,
    estimatedTotal: 0,
    basePrice: 0,
    extrasTotal: 0,
    productionDays: BUSINESS_DEFAULTS.DEFAULT_PRODUCTION_DAYS,
    deliveryDays: BUSINESS_DEFAULTS.DEFAULT_DELIVERY_DAYS,
    personalizationLevel: "alto",
    breakdown: Object.freeze([]),
});

export const DEFAULT_EXPORT_STATE = Object.freeze({
    lastExportType: null,
    availableExports: Object.freeze([
        EXPORT_TYPES.PNG,
        EXPORT_TYPES.JSON,
        EXPORT_TYPES.SUMMARY,
    ]),
    includeScreenshot: true,
    includeConfiguration: true,
    includePriceSummary: true,
    includeCustomerData: false,
});

export const DEFAULT_CAMERA_STATE = Object.freeze({
    view: DEFAULT_CAMERA_VIEW,
    previousView: null,
    autoRotate: false,
    focusObjectKey: null,
    zoomLevel: 1,
});

export const DEFAULT_RENDER_STATE = Object.freeze({
    quality: DEFAULT_RENDER_QUALITY,
    lightingMode: DEFAULT_LIGHTING_MODE,
    shadowsEnabled: true,
    environmentEnabled: true,
    helpersVisible: false,
    gridVisible: true,
});

export const DEFAULT_EDITOR_STATE = Object.freeze({
    mode: DEFAULT_EDIT_MODE,
    transformSpace: DEFAULT_TRANSFORM_SPACE,
    selectedObjectKey: null,
    hoveredObjectKey: null,
    lockedObjects: Object.freeze([...STRUCTURAL_OBJECTS]),
    editableObjects: Object.freeze([...DEFAULT_EDITABLE_OBJECTS]),
    exportableObjects: Object.freeze([...EXPORTABLE_OBJECTS]),
    snapEnabled: false,
    transformHistory: Object.freeze([]),
});

export const DEFAULT_VISIBILITY_STATE = Object.freeze({
    [OBJECT_KEYS.BOX_BASE]: true,
    [OBJECT_KEYS.BOX_LID]: true,
    [OBJECT_KEYS.INTERNAL_DIVIDERS]: true,
    [OBJECT_KEYS.PAPER_FILLER]: true,

    [OBJECT_KEYS.CARD_MESSAGE]: true,
    [OBJECT_KEYS.QR_CARD]: true,
    [OBJECT_KEYS.LID_INTERIOR_DESIGN]: true,

    [OBJECT_KEYS.CUPCAKE]: true,
    [OBJECT_KEYS.SODA_BOTTLE]: true,
    [OBJECT_KEYS.DECORATIVE_ROSE]: true,
    [OBJECT_KEYS.RESIN_KEYCHAIN]: true,

    [OBJECT_KEYS.CAREER_LOGO_BADGE]: true,
    [OBJECT_KEYS.CUSTOM_IMAGE_PLANE]: false,
    [OBJECT_KEYS.THEMATIC_DECORATIONS]: true,

    [OBJECT_KEYS.SELECTION_HELPER]: false,
    [OBJECT_KEYS.TRANSFORM_CONTROLS]: false,
});

export const DEFAULT_LAYOUT_STATE = Object.freeze({
    [OBJECT_KEYS.CUPCAKE]: Object.freeze({
        position: [-1.05, 0.55, 0.48],
        rotation: [0, 0.12, 0],
        scale: [0.88, 0.88, 0.88],
    }),

    [OBJECT_KEYS.SODA_BOTTLE]: Object.freeze({
        position: [0.74, 0.54, 0.42],
        rotation: [0, 0, Math.PI / 2],
        scale: [0.76, 0.76, 0.76],
    }),

    [OBJECT_KEYS.DECORATIVE_ROSE]: Object.freeze({
        position: [1.52, 0.58, -0.42],
        rotation: [0.08, -0.55, -0.2],
        scale: [0.82, 0.82, 0.82],
    }),

    [OBJECT_KEYS.RESIN_KEYCHAIN]: Object.freeze({
        position: [1.58, 0.6, 0.72],
        rotation: [Math.PI / 2, 0, -0.18],
        scale: [0.64, 0.64, 0.64],
    }),

    [OBJECT_KEYS.CARD_MESSAGE]: Object.freeze({
        position: [-1.12, 0.62, -0.76],
        rotation: [-Math.PI / 2, 0, -0.06],
        scale: [0.88, 0.88, 0.88],
    }),

    [OBJECT_KEYS.QR_CARD]: Object.freeze({
        position: [0.1, 0.64, -1.03],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [0.74, 0.74, 0.74],
    }),

    [OBJECT_KEYS.CAREER_LOGO_BADGE]: Object.freeze({
        position: [0.98, 0.665, -1.55],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [0.5, 0.5, 0.5],
    }),

    [OBJECT_KEYS.LID_INTERIOR_DESIGN]: Object.freeze({
        position: [0, 1.62, -1.95],
        rotation: [-0.94, 0, 0],
        scale: [1, 1, 1],
    }),

    [OBJECT_KEYS.PAPER_FILLER]: Object.freeze({
        position: [0, 0.42, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
    }),
});

export const DEFAULT_GROUP_STATE = Object.freeze({
    [GROUP_KEYS.ROOT]: Object.freeze({
        visible: true,
        locked: false,
    }),

    [GROUP_KEYS.ENVIRONMENT]: Object.freeze({
        visible: true,
        locked: true,
    }),

    [GROUP_KEYS.BOX]: Object.freeze({
        visible: true,
        locked: false,
    }),

    [GROUP_KEYS.CONTENT]: Object.freeze({
        visible: true,
        locked: false,
    }),

    [GROUP_KEYS.DECORATION]: Object.freeze({
        visible: true,
        locked: false,
    }),

    [GROUP_KEYS.INTERACTION]: Object.freeze({
        visible: true,
        locked: false,
    }),

    [GROUP_KEYS.HELPERS]: Object.freeze({
        visible: false,
        locked: true,
    }),

    [GROUP_KEYS.LIGHTS]: Object.freeze({
        visible: true,
        locked: true,
    }),
});

export const DEFAULT_TEMPLATE_STATE = Object.freeze({
    appliedTemplateId: DEFAULT_DESIGN_TEMPLATE,
    appliedPreset: PRODUCT_PRESET_IDS.PREMIUM,
    appliedThemeId: VISUAL_THEME_IDS.PREMIUM_BLACK_GOLD,
    lastAppliedAt: null,
    pendingTemplateChanges: false,
});

export const DEFAULT_RUNTIME_STATE = Object.freeze({
    isReady: false,
    isLoading: true,
    isSaving: false,
    isExporting: false,
    hasUnsavedChanges: false,
    lastError: null,
    lastUpdatedAt: null,
});

export const DEFAULT_ANIMATION_STATE = Object.freeze({
    idleRotationEnabled: ANIMATION_DEFAULTS.ENABLE_IDLE_ROTATION,
    idleRotationIntensity: ANIMATION_DEFAULTS.IDLE_ROTATION_INTENSITY,
    lidOpen: true,
    lidAnimationSpeed: ANIMATION_DEFAULTS.LID_ANIMATION_SPEED,
    beverageAnimationSpeed: ANIMATION_DEFAULTS.BEVERAGE_ANIMATION_SPEED,
    decorationAnimationSpeed: ANIMATION_DEFAULTS.DECORATION_ANIMATION_SPEED,
});

export const DEFAULT_DESIGN_METADATA = Object.freeze({
    appName: APP_INFO.NAME,
    appVersion: APP_INFO.VERSION,
    schemaVersion: "1.0.0",
    createdAt: null,
    updatedAt: null,
    source: "kickoff-box-3d-configurator",
});

export const DEFAULT_DESIGN_STATE = Object.freeze({
    metadata: DEFAULT_DESIGN_METADATA,

    customer: DEFAULT_CUSTOMER_STATE,
    project: DEFAULT_PROJECT_STATE,
    product: DEFAULT_PRODUCT_STATE,
    beverage: DEFAULT_BEVERAGE_STATE,
    qr: DEFAULT_QR_STATE,
    text: DEFAULT_TEXT_STATE,
    images: DEFAULT_IMAGE_STATE,
    price: DEFAULT_PRICE_STATE,
    export: DEFAULT_EXPORT_STATE,

    camera: DEFAULT_CAMERA_STATE,
    render: DEFAULT_RENDER_STATE,
    editor: DEFAULT_EDITOR_STATE,

    visibility: DEFAULT_VISIBILITY_STATE,
    layout: DEFAULT_LAYOUT_STATE,
    groups: DEFAULT_GROUP_STATE,
    template: DEFAULT_TEMPLATE_STATE,
    runtime: DEFAULT_RUNTIME_STATE,
    animation: DEFAULT_ANIMATION_STATE,
});

export const FORM_FIELD_TO_STATE_PATH = Object.freeze({
    [FORM_FIELD_KEYS.PRESET]: "product.preset",
    [FORM_FIELD_KEYS.TEMPLATE_ID]: "product.templateId",
    [FORM_FIELD_KEYS.THEME_ID]: "product.themeId",

    [FORM_FIELD_KEYS.RECIPIENT_NAME]: "project.recipientName",
    [FORM_FIELD_KEYS.TEAM_NAME]: "project.teamName",
    [FORM_FIELD_KEYS.PROJECT_NAME]: "project.projectName",
    [FORM_FIELD_KEYS.CAREER]: "project.career",
    [FORM_FIELD_KEYS.UNIVERSITY]: "project.university",
    [FORM_FIELD_KEYS.MESSAGE]: "project.message",

    [FORM_FIELD_KEYS.QR_URL]: "qr.value",
    [FORM_FIELD_KEYS.LOGO_VARIANT]: "product.logoVariant",

    [FORM_FIELD_KEYS.BOX_COLOR]: "product.boxColor",
    [FORM_FIELD_KEYS.INTERIOR_COLOR]: "product.interiorColor",
    [FORM_FIELD_KEYS.ACCENT_COLOR]: "product.accentColor",

    [FORM_FIELD_KEYS.BEVERAGE_TYPE]: "beverage.type",
    [FORM_FIELD_KEYS.BEVERAGE_LABEL_TEXT]: "beverage.labelText",

    [FORM_FIELD_KEYS.LID_IMAGE]: "images.lidImage",
    [FORM_FIELD_KEYS.LABEL_IMAGE]: "images.bottleLabelImage",
    [FORM_FIELD_KEYS.FRONT_STICKER_IMAGE]: "images.frontStickerImage",
});

function isPlainObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cloneDeep(value) {
    if (Array.isArray(value)) {
        return value.map((item) => cloneDeep(item));
    }

    if (isPlainObject(value)) {
        return Object.fromEntries(
            Object.entries(value).map(([key, item]) => [key, cloneDeep(item)]),
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

function getValueByPath(target, path) {
    return path.split(".").reduce((cursor, key) => {
        if (cursor == null) return undefined;
        return cursor[key];
    }, target);
}

export function createDefaultDesignState(overrides = {}) {
    const now = new Date().toISOString();

    return mergeDeep(
        {
            ...cloneDeep(DEFAULT_DESIGN_STATE),
            metadata: {
                ...cloneDeep(DEFAULT_DESIGN_METADATA),
                createdAt: now,
                updatedAt: now,
            },
            runtime: {
                ...cloneDeep(DEFAULT_RUNTIME_STATE),
                lastUpdatedAt: now,
            },
        },
        overrides,
    );
}

export function createDesignStateFromTemplate(template = {}, overrides = {}) {
    return createDefaultDesignState(
        mergeDeep(template.initialState ?? template.state ?? {}, overrides),
    );
}

export function updateDesignStateField(state, fieldKey, value) {
    const path = FORM_FIELD_TO_STATE_PATH[fieldKey];

    if (!path) {
        return cloneDeep(state);
    }

    const nextState = cloneDeep(state);

    setValueByPath(nextState, path, value);

    nextState.runtime = {
        ...nextState.runtime,
        hasUnsavedChanges: true,
        lastUpdatedAt: new Date().toISOString(),
    };

    return nextState;
}

export function getDesignStateField(state, fieldKey) {
    const path = FORM_FIELD_TO_STATE_PATH[fieldKey];

    if (!path) return undefined;

    return getValueByPath(state, path);
}

export function resetRuntimeFlags(state) {
    return {
        ...cloneDeep(state),
        runtime: {
            ...cloneDeep(DEFAULT_RUNTIME_STATE),
            isReady: true,
            isLoading: false,
            lastUpdatedAt: new Date().toISOString(),
        },
    };
}

export function markDesignStateSaved(state) {
    const nextState = cloneDeep(state);

    nextState.runtime = {
        ...nextState.runtime,
        hasUnsavedChanges: false,
        isSaving: false,
        lastUpdatedAt: new Date().toISOString(),
    };

    nextState.metadata = {
        ...nextState.metadata,
        updatedAt: new Date().toISOString(),
    };

    return nextState;
}

export function markDesignStateError(state, error) {
    const nextState = cloneDeep(state);

    nextState.runtime = {
        ...nextState.runtime,
        isLoading: false,
        isSaving: false,
        isExporting: false,
        lastError: error?.message ?? String(error),
        lastUpdatedAt: new Date().toISOString(),
    };

    return nextState;
}

export function createExportableDesignState(state) {
    const exportable = cloneDeep(state);

    exportable.runtime = {
        ...exportable.runtime,
        isLoading: false,
        isSaving: false,
        isExporting: false,
        lastError: null,
    };

    exportable.editor = {
        ...exportable.editor,
        selectedObjectKey: null,
        hoveredObjectKey: null,
        transformHistory: [],
    };

    return exportable;
}
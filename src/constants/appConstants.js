/* =========================================================
   KICKOFF BOX 3D CONFIGURATOR
   Archivo: src/constants/appConstants.js

   Propósito:
   Centralizar constantes generales del sistema para evitar
   valores quemados en main.js, sceneComposer.js, UI, servicios
   y utilidades.

   Este archivo NO crea objetos 3D.
   Este archivo NO modifica el DOM.
   Este archivo NO ejecuta lógica del configurador.
========================================================= */

/* ---------------------------------------------------------
   1. INFORMACIÓN GENERAL DE LA APLICACIÓN
--------------------------------------------------------- */

export const APP_INFO = Object.freeze({
    NAME: "KickOff Box 3D Configurator",
    SHORT_NAME: "KickOff Box",
    DESCRIPTION:
        "Configurador 3D interactivo para cajas de regalo académicas personalizadas con identidad universitaria, temática deportiva y contenido digital.",
    VERSION: "0.9.0-premium-candidate",
    AUTHOR: "Proyecto académico - Ingeniería de Sistemas",
    UNIVERSITY: "UNIFRANZ",
    CAREER: "Ingeniería de Sistemas",
    DEFAULT_LANGUAGE: "es",
    DEFAULT_LOCALE: "es-BO",
    CURRENCY: "BOB",
    CURRENCY_SYMBOL: "Bs",
});

/* ---------------------------------------------------------
   2. AMBIENTE / ENTORNO
--------------------------------------------------------- */

export const APP_ENV = Object.freeze({
    DEVELOPMENT: "development",
    PRODUCTION: "production",
    TEST: "test",
});

export const RUNTIME_FLAGS = Object.freeze({
    ENABLE_DEBUG_PANEL: true,
    ENABLE_CONSOLE_API: true,
    ENABLE_CAMERA_HELPERS: false,
    ENABLE_LIGHT_HELPERS: false,
    ENABLE_PERFORMANCE_LOGS: false,
    ENABLE_EXPERIMENTAL_FEATURES: true,
});

/* ---------------------------------------------------------
   3. RUTAS PÚBLICAS DEL PROYECTO

   En Vite, lo que está dentro de /public se sirve desde
   la raíz del sitio. Ejemplo:
   public/image/Logo-Claro.png → /image/Logo-Claro.png
--------------------------------------------------------- */

export const PUBLIC_PATHS = Object.freeze({
    IMAGE: "/image",
    MODELS: "/models",
    TEXTURES: "/textures",
    PRESETS: "/presets",
    EXPORTS: "/exports",
});

export const ASSET_PATHS = Object.freeze({
    LOGO_LIGHT: `${PUBLIC_PATHS.IMAGE}/Logo-Claro.png`,
    LOGO_DARK: `${PUBLIC_PATHS.IMAGE}/Logo-Oscuro.png`,

    DEFAULT_TEXTURES_DIR: PUBLIC_PATHS.TEXTURES,
    DEFAULT_MODELS_DIR: PUBLIC_PATHS.MODELS,
    DEFAULT_PRESETS_DIR: PUBLIC_PATHS.PRESETS,
});

export const SUPPORTED_ASSET_TYPES = Object.freeze({
    IMAGE: Object.freeze(["image/png", "image/jpeg", "image/webp"]),
    MODEL: Object.freeze([
        "model/gltf+json",
        "model/gltf-binary",
        "application/octet-stream",
    ]),
    JSON: Object.freeze(["application/json"]),
});

export const SUPPORTED_FILE_EXTENSIONS = Object.freeze({
    IMAGE: Object.freeze([".png", ".jpg", ".jpeg", ".webp"]),
    MODEL: Object.freeze([".glb", ".gltf"]),
    CONFIG: Object.freeze([".json"]),
});

/* ---------------------------------------------------------
   4. PRESETS / VERSIONES COMERCIALES
--------------------------------------------------------- */

export const PRODUCT_PRESET_IDS = Object.freeze({
    BASIC: "basica",
    STANDARD: "estandar",
    PREMIUM: "premium",
});

export const PRODUCT_PRESET_LABELS = Object.freeze({
    [PRODUCT_PRESET_IDS.BASIC]: "Básica",
    [PRODUCT_PRESET_IDS.STANDARD]: "Estándar",
    [PRODUCT_PRESET_IDS.PREMIUM]: "Premium",
});

export const DEFAULT_PRODUCT_PRESET = PRODUCT_PRESET_IDS.PREMIUM;

/* ---------------------------------------------------------
   5. PLANTILLAS DE DISEÑO
--------------------------------------------------------- */

export const DESIGN_TEMPLATE_IDS = Object.freeze({
    BASIC: "basic",
    STANDARD: "standard",
    PREMIUM: "premium",
    DEFENSE: "defense",
    JURY: "jury",
    INSTITUTIONAL: "institutional",
});

export const DESIGN_TEMPLATE_LABELS = Object.freeze({
    [DESIGN_TEMPLATE_IDS.BASIC]: "Caja básica",
    [DESIGN_TEMPLATE_IDS.STANDARD]: "Caja estándar",
    [DESIGN_TEMPLATE_IDS.PREMIUM]: "Caja premium",
    [DESIGN_TEMPLATE_IDS.DEFENSE]: "Defensa de grado",
    [DESIGN_TEMPLATE_IDS.JURY]: "Tribunal / jurado",
    [DESIGN_TEMPLATE_IDS.INSTITUTIONAL]: "Institucional",
});

export const DEFAULT_DESIGN_TEMPLATE = DESIGN_TEMPLATE_IDS.PREMIUM;

/* ---------------------------------------------------------
   6. MODOS VISUALES DEL PRODUCTO
--------------------------------------------------------- */

export const VISUAL_THEME_IDS = Object.freeze({
    LIGHT_ACADEMIC: "light-academic",
    WARM_KRAFT: "warm-kraft",
    PREMIUM_BLACK_GOLD: "premium-black-gold",
    BOLIVIA_TRICOLOR: "bolivia-tricolor",
    TECH_SYSTEMS: "tech-systems",
    WORLD_CUP_2026: "world-cup-2026",
});

export const DEFAULT_VISUAL_THEME = VISUAL_THEME_IDS.PREMIUM_BLACK_GOLD;

/* ---------------------------------------------------------
   7. PALETAS BASE DEL PROYECTO
--------------------------------------------------------- */

export const BRAND_COLORS = Object.freeze({
    BLACK: "#111111",
    DARK_BROWN: "#2b2118",
    BROWN: "#704a27",
    KRAFT: "#c89f72",
    CREAM: "#fff7e8",
    GOLD: "#c59a4a",
    GOLD_SOFT: "#e9c678",

    BOLIVIA_RED: "#b92d2d",
    BOLIVIA_YELLOW: "#f0c84b",
    BOLIVIA_GREEN: "#2f7d55",

    TECH_BLUE: "#2f86c7",
    SPORT_GREEN: "#2f7d55",
    WARNING_ORANGE: "#ff8a00",
    ERROR_RED: "#c0392b",
    SUCCESS_GREEN: "#2f7d55",
});

export const THEME_COLOR_PRESETS = Object.freeze({
    [VISUAL_THEME_IDS.LIGHT_ACADEMIC]: Object.freeze({
        boxExterior: "#c89f72",
        boxInterior: "#f3e0c5",
        accent: "#c59a4a",
        text: "#2b2118",
        background: "#fff7e8",
    }),

    [VISUAL_THEME_IDS.WARM_KRAFT]: Object.freeze({
        boxExterior: "#a97745",
        boxInterior: "#ead2ad",
        accent: "#c59a4a",
        text: "#2b2118",
        background: "#f7ead5",
    }),

    [VISUAL_THEME_IDS.PREMIUM_BLACK_GOLD]: Object.freeze({
        boxExterior: "#111111",
        boxInterior: "#1f1710",
        accent: "#c59a4a",
        text: "#fff7e8",
        background: "#0d0a07",
    }),

    [VISUAL_THEME_IDS.BOLIVIA_TRICOLOR]: Object.freeze({
        boxExterior: "#7a1e1e",
        boxInterior: "#fff7e8",
        accent: "#f0c84b",
        text: "#2b2118",
        background: "#2f7d55",
    }),

    [VISUAL_THEME_IDS.TECH_SYSTEMS]: Object.freeze({
        boxExterior: "#151c24",
        boxInterior: "#eaf4ff",
        accent: "#2f86c7",
        text: "#f7fbff",
        background: "#0b1118",
    }),

    [VISUAL_THEME_IDS.WORLD_CUP_2026]: Object.freeze({
        boxExterior: "#15110c",
        boxInterior: "#f6e2c2",
        accent: "#c59a4a",
        text: "#fff7e8",
        background: "#1b120a",
    }),
});

/* ---------------------------------------------------------
   8. BEBIDAS / ELEMENTO REFRESCO
--------------------------------------------------------- */

export const DEFAULT_BEVERAGE_TYPE = "cola";

export const BEVERAGE_LAYOUT_MODE = Object.freeze({
    HORIZONTAL: "horizontal",
    VERTICAL: "vertical",
    DIAGONAL: "diagonal",
});

export const DEFAULT_BEVERAGE_LAYOUT_MODE = BEVERAGE_LAYOUT_MODE.HORIZONTAL;

/* ---------------------------------------------------------
   9. MODOS DE CÁMARA
--------------------------------------------------------- */

export const CAMERA_VIEW_IDS = Object.freeze({
    DEFAULT: "default",
    FRONT: "front",
    TOP: "top",
    INTERIOR: "interior",
    PRODUCT: "product",
    PREMIUM_RENDER: "premium-render",
    DETAIL: "detail",
});

export const CAMERA_VIEW_LABELS = Object.freeze({
    [CAMERA_VIEW_IDS.DEFAULT]: "Principal",
    [CAMERA_VIEW_IDS.FRONT]: "Frontal",
    [CAMERA_VIEW_IDS.TOP]: "Superior",
    [CAMERA_VIEW_IDS.INTERIOR]: "Interior",
    [CAMERA_VIEW_IDS.PRODUCT]: "Producto",
    [CAMERA_VIEW_IDS.PREMIUM_RENDER]: "Render premium",
    [CAMERA_VIEW_IDS.DETAIL]: "Detalle",
});

export const DEFAULT_CAMERA_VIEW = CAMERA_VIEW_IDS.PREMIUM_RENDER;

/* ---------------------------------------------------------
   10. MODOS DE ILUMINACIÓN
--------------------------------------------------------- */

export const LIGHTING_MODE_IDS = Object.freeze({
    STUDIO: "studio",
    PRESENTATION: "presentation",
    SOFT: "soft",
    DRAMATIC: "dramatic",
    PREMIUM: "premium",
    INSPECTION: "inspection",
});

export const LIGHTING_MODE_LABELS = Object.freeze({
    [LIGHTING_MODE_IDS.STUDIO]: "Estudio",
    [LIGHTING_MODE_IDS.PRESENTATION]: "Presentación",
    [LIGHTING_MODE_IDS.SOFT]: "Suave",
    [LIGHTING_MODE_IDS.DRAMATIC]: "Dramática",
    [LIGHTING_MODE_IDS.PREMIUM]: "Premium",
    [LIGHTING_MODE_IDS.INSPECTION]: "Inspección",
});

export const DEFAULT_LIGHTING_MODE = LIGHTING_MODE_IDS.PREMIUM;

/* ---------------------------------------------------------
   11. CALIDAD DE RENDER
--------------------------------------------------------- */

export const RENDER_QUALITY_IDS = Object.freeze({
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
    ULTRA: "ultra",
});

export const RENDER_QUALITY_LABELS = Object.freeze({
    [RENDER_QUALITY_IDS.LOW]: "Baja",
    [RENDER_QUALITY_IDS.MEDIUM]: "Media",
    [RENDER_QUALITY_IDS.HIGH]: "Alta",
    [RENDER_QUALITY_IDS.ULTRA]: "Ultra",
});

export const DEFAULT_RENDER_QUALITY = RENDER_QUALITY_IDS.HIGH;

export const RENDER_QUALITY_SETTINGS = Object.freeze({
    [RENDER_QUALITY_IDS.LOW]: Object.freeze({
        pixelRatio: 1,
        shadowMapSize: 512,
        antialias: false,
    }),

    [RENDER_QUALITY_IDS.MEDIUM]: Object.freeze({
        pixelRatio: 1.25,
        shadowMapSize: 1024,
        antialias: true,
    }),

    [RENDER_QUALITY_IDS.HIGH]: Object.freeze({
        pixelRatio: 1.5,
        shadowMapSize: 2048,
        antialias: true,
    }),

    [RENDER_QUALITY_IDS.ULTRA]: Object.freeze({
        pixelRatio: 2,
        shadowMapSize: 4096,
        antialias: true,
    }),
});

/* ---------------------------------------------------------
   12. MODOS DE EDICIÓN 3D
--------------------------------------------------------- */

export const EDIT_MODE_IDS = Object.freeze({
    EXPLORE: "explore",
    SELECT: "select",
    MOVE: "move",
    ROTATE: "rotate",
    SCALE: "scale",
    LOCKED: "locked",
});

export const EDIT_MODE_LABELS = Object.freeze({
    [EDIT_MODE_IDS.EXPLORE]: "Explorar",
    [EDIT_MODE_IDS.SELECT]: "Seleccionar",
    [EDIT_MODE_IDS.MOVE]: "Mover",
    [EDIT_MODE_IDS.ROTATE]: "Rotar",
    [EDIT_MODE_IDS.SCALE]: "Escalar",
    [EDIT_MODE_IDS.LOCKED]: "Bloqueado",
});

export const TRANSFORM_CONTROL_MODES = Object.freeze({
    TRANSLATE: "translate",
    ROTATE: "rotate",
    SCALE: "scale",
});

export const EDIT_TO_TRANSFORM_MODE = Object.freeze({
    [EDIT_MODE_IDS.MOVE]: TRANSFORM_CONTROL_MODES.TRANSLATE,
    [EDIT_MODE_IDS.ROTATE]: TRANSFORM_CONTROL_MODES.ROTATE,
    [EDIT_MODE_IDS.SCALE]: TRANSFORM_CONTROL_MODES.SCALE,
});

export const DEFAULT_EDIT_MODE = EDIT_MODE_IDS.EXPLORE;

export const TRANSFORM_SPACE_IDS = Object.freeze({
    LOCAL: "local",
    WORLD: "world",
});

export const DEFAULT_TRANSFORM_SPACE = TRANSFORM_SPACE_IDS.LOCAL;

/* ---------------------------------------------------------
   13. LÍMITES DE TRANSFORMACIÓN
--------------------------------------------------------- */

export const TRANSFORM_LIMITS = Object.freeze({
    MIN_SCALE: 0.25,
    MAX_SCALE: 2.0,

    MIN_OBJECT_Y: 0.05,
    MAX_OBJECT_Y: 2.2,

    MIN_POSITION_X: -3.5,
    MAX_POSITION_X: 3.5,

    MIN_POSITION_Z: -2.5,
    MAX_POSITION_Z: 2.5,

    TRANSLATION_SNAP: 0.05,
    ROTATION_SNAP_DEGREES: 15,
    SCALE_SNAP: 0.05,
});

export const OBJECT_SCALE_LIMITS = Object.freeze({
    DEFAULT: Object.freeze({
        min: 0.25,
        max: 2,
    }),

    BEVERAGE: Object.freeze({
        min: 0.45,
        max: 1.25,
    }),

    CARD: Object.freeze({
        min: 0.45,
        max: 1.6,
    }),

    QR: Object.freeze({
        min: 0.35,
        max: 1.4,
    }),

    KEYCHAIN: Object.freeze({
        min: 0.35,
        max: 1.8,
    }),

    LOGO: Object.freeze({
        min: 0.25,
        max: 1.6,
    }),
});

/* ---------------------------------------------------------
   14. INTERACCIÓN / ATAJOS
--------------------------------------------------------- */

export const INTERACTION_KEYS = Object.freeze({
    SHIFT: "Shift",
    ALT: "Alt",
    CONTROL: "Control",
    ESCAPE: "Escape",
    DELETE: "Delete",

    ARROW_LEFT: "ArrowLeft",
    ARROW_RIGHT: "ArrowRight",
    ARROW_UP: "ArrowUp",
    ARROW_DOWN: "ArrowDown",

    ROTATE_LEFT: "q",
    ROTATE_RIGHT: "e",
    SCALE_UP: "+",
    SCALE_DOWN: "-",
});

export const POINTER_BUTTONS = Object.freeze({
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2,
});

export const INTERACTION_HELP_TEXT = Object.freeze({
    DESKTOP:
        "Selecciona un objeto para editarlo. Usa el panel para personalizar texto, bebida, QR, colores e imágenes.",
    TRANSFORM:
        "Modo edición: mover, rotar o escalar objetos seleccionados dentro de la caja.",
    LEGACY_SHORTCUTS:
        "Shift + arrastrar: mover · Alt + flechas: ajustar posición · Alt + Q/E: rotar",
});

/* ---------------------------------------------------------
   15. SELECTORES DEL DOM ACTUAL

   Estos IDs deben coincidir con index.html y con los controles
   que luego creará customizationPanel.js.
--------------------------------------------------------- */

export const DOM_IDS = Object.freeze({
    APP: "app",
    CANVAS_CONTAINER: "canvas-container",
    LOADING: "loading",

    PRESET_SELECT: "preset",
    BOX_COLOR_INPUT: "boxColor",
    INTERIOR_COLOR_INPUT: "interiorColor",
    TOGGLE_LID_BUTTON: "toggleLid",

    CAMERA_VIEW_SELECT: "cameraView",
    QUALITY_MODE_SELECT: "qualityMode",
    LIGHTING_MODE_SELECT: "lightingMode",
    LOGO_VARIANT_SELECT: "logoVariant",
    BEVERAGE_TYPE_SELECT: "beverageType",

    RESET_VIEW_BUTTON: "resetView",
    CAPTURE_VIEW_BUTTON: "captureView",

    CUSTOMIZATION_PANEL: "customizationPanel",
    PRICE_SUMMARY: "priceSummary",
    EXPORT_JSON_BUTTON: "exportJson",
    IMPORT_JSON_INPUT: "importJson",
    UPLOAD_LID_IMAGE_INPUT: "uploadLidImage",
    UPLOAD_LABEL_IMAGE_INPUT: "uploadLabelImage",
});

export const CSS_SELECTORS = Object.freeze({
    APP: ".app",
    SIDEBAR: ".sidebar",
    PANEL: ".panel",
    LEGEND: ".legend",
    VIEWER: ".viewer",
    VIEWER_HEADER: ".viewer__header",
    CANVAS_CONTAINER: ".canvas-container",
    LOADING_HIDDEN: ".loading.is-hidden",
});

/* ---------------------------------------------------------
   16. CAMPOS EDITABLES DEL FORMULARIO
--------------------------------------------------------- */

export const FORM_FIELD_KEYS = Object.freeze({
    PRESET: "preset",
    TEMPLATE_ID: "templateId",
    THEME_ID: "themeId",

    RECIPIENT_NAME: "recipientName",
    TEAM_NAME: "teamName",
    PROJECT_NAME: "projectName",
    CAREER: "career",
    UNIVERSITY: "university",
    MESSAGE: "message",

    QR_URL: "qrUrl",
    LOGO_VARIANT: "logoVariant",

    BOX_COLOR: "boxColor",
    INTERIOR_COLOR: "interiorColor",
    ACCENT_COLOR: "accentColor",

    BEVERAGE_TYPE: "beverageType",
    BEVERAGE_LABEL_TEXT: "beverageLabelText",

    LID_IMAGE: "lidImage",
    LABEL_IMAGE: "labelImage",
    FRONT_STICKER_IMAGE: "frontStickerImage",
});

/* ---------------------------------------------------------
   17. VARIANTES DE LOGO
--------------------------------------------------------- */

export const LOGO_VARIANTS = Object.freeze({
    LIGHT: "claro",
    DARK: "oscuro",
});

export const LOGO_VARIANT_LABELS = Object.freeze({
    [LOGO_VARIANTS.LIGHT]: "Logo claro",
    [LOGO_VARIANTS.DARK]: "Logo oscuro",
});

export const DEFAULT_LOGO_VARIANT = LOGO_VARIANTS.LIGHT;

/* ---------------------------------------------------------
   18. EXPORTACIÓN
--------------------------------------------------------- */

export const EXPORT_TYPES = Object.freeze({
    PNG: "png",
    JSON: "json",
    SUMMARY: "summary",
});

export const EXPORT_FILE_PREFIXES = Object.freeze({
    DESIGN: "kickoff-box-design",
    IMAGE: "kickoff-box-render",
    SUMMARY: "kickoff-box-summary",
});

export const EXPORT_MIME_TYPES = Object.freeze({
    PNG: "image/png",
    JSON: "application/json",
    TEXT: "text/plain",
});

export const EXPORT_LIMITS = Object.freeze({
    MAX_JSON_SIZE_KB: 512,
    MAX_IMAGE_SIZE_MB: 8,
});

/* ---------------------------------------------------------
   19. VALIDACIÓN DE ARCHIVOS
--------------------------------------------------------- */

export const FILE_LIMITS = Object.freeze({
    MAX_IMAGE_SIZE_MB: 5,
    MAX_TEXTURE_WIDTH: 2048,
    MAX_TEXTURE_HEIGHT: 2048,
    RECOMMENDED_TEXTURE_WIDTH: 1024,
    RECOMMENDED_TEXTURE_HEIGHT: 1024,
});

export const FILE_ERROR_MESSAGES = Object.freeze({
    INVALID_IMAGE_TYPE:
        "Formato no permitido. Usa PNG, JPG, JPEG o WEBP.",
    IMAGE_TOO_LARGE:
        "La imagen es demasiado grande. Usa una imagen menor a 5 MB.",
    IMAGE_LOAD_FAILED:
        "No se pudo cargar la imagen. Intenta con otro archivo.",
    CONFIG_LOAD_FAILED:
        "No se pudo cargar la configuración del diseño.",
});

/* ---------------------------------------------------------
   20. QR / CONTENIDO DIGITAL
--------------------------------------------------------- */

export const QR_DEFAULTS = Object.freeze({
    VALUE: "https://example.com/kickoff-box-2026",
    TITLE: "Contenido digital",
    SUBTITLE: "Escanea para ver el proyecto",
    FOOTER: "KickOff Box 2026",
    SIZE: 512,
    MARGIN: 2,
    ERROR_CORRECTION_LEVEL: "M",
});

export const QR_CONTENT_TYPES = Object.freeze({
    URL: "url",
    TEXT: "text",
    PORTFOLIO: "portfolio",
    PRESENTATION: "presentation",
    VIDEO: "video",
    DRIVE: "drive",
    GITHUB: "github",
});

/* ---------------------------------------------------------
   21. TEXTO BASE DEL PRODUCTO
--------------------------------------------------------- */

export const DEFAULT_TEXT_CONTENT = Object.freeze({
    RECIPIENT_NAME: "Jurado Académico",
    TEAM_NAME: "Equipo de proyecto",
    PROJECT_NAME: "KickOff Box",
    CAREER: APP_INFO.CAREER,
    UNIVERSITY: APP_INFO.UNIVERSITY,
    MESSAGE:
        "Gracias por acompañar nuestra presentación y formar parte de este logro académico.",
    LID_TITLE: "Gracias por ser parte",
    LID_SUBTITLE: "Presentación final · Proyecto académico · 2026",
    CARD_TITLE: "Gracias por ser parte",
    CARD_FOOTER: "KickOff Box 2026",
    FRONT_LABEL: "KickOff Box",
});

/* ---------------------------------------------------------
   22. CONFIGURACIÓN DE PRECIO / NEGOCIO
--------------------------------------------------------- */

export const BUSINESS_DEFAULTS = Object.freeze({
    DEFAULT_CITY: "La Paz",
    DEFAULT_COUNTRY: "Bolivia",
    DEFAULT_DELIVERY_DAYS: 2,
    DEFAULT_PRODUCTION_DAYS: 1,
    MIN_ORDER_QUANTITY: 1,
    MAX_ORDER_QUANTITY: 50,
});

/* ---------------------------------------------------------
   23. LOCAL STORAGE
--------------------------------------------------------- */

export const STORAGE_KEYS = Object.freeze({
    DESIGN_STATE: "kickoffBox.designState",
    LAST_TEMPLATE: "kickoffBox.lastTemplate",
    LAST_PRESET: "kickoffBox.lastPreset",
    USER_PREFERENCES: "kickoffBox.userPreferences",
});

/* ---------------------------------------------------------
   24. EVENTOS DE APLICACIÓN
--------------------------------------------------------- */

export const APP_EVENTS = Object.freeze({
    APP_READY: "app/ready",
    APP_DISPOSED: "app/disposed",

    UI_READY: "ui/ready",
    UI_FIELD_CHANGED: "ui/fieldChanged",
    UI_ACTION_TRIGGERED: "ui/actionTriggered",

    SCENE_READY: "scene/ready",
    SCENE_UPDATED: "scene/updated",

    RENDER_CAPTURED: "render/captured",
    ERROR_OCCURRED: "app/errorOccurred",
});

/* ---------------------------------------------------------
   25. CONFIGURACIÓN DE ANIMACIÓN
--------------------------------------------------------- */

export const ANIMATION_DEFAULTS = Object.freeze({
    ENABLE_IDLE_ROTATION: true,
    IDLE_ROTATION_INTENSITY: 0.025,
    LID_ANIMATION_SPEED: 0.08,
    BEVERAGE_ANIMATION_SPEED: 1,
    DECORATION_ANIMATION_SPEED: 1,
    CAMERA_SMOOTHING: 0.09,
});

/* ---------------------------------------------------------
   26. MENSAJES DEL SISTEMA
--------------------------------------------------------- */

export const UI_MESSAGES = Object.freeze({
    LOADING: "Preparando simulación 3D...",
    READY: "Simulador listo",
    SAVED: "Diseño guardado",
    EXPORTED: "Diseño exportado",
    IMPORTED: "Diseño importado",
    NO_OBJECT_SELECTED: "Selecciona un objeto para editarlo",
    UNSUPPORTED_BROWSER:
        "Tu navegador no soporta correctamente WebGL o algunas funciones 3D.",
});

/* ---------------------------------------------------------
   27. HELPERS GENERALES
--------------------------------------------------------- */

export function getProductPresetLabel(presetId) {
    return PRODUCT_PRESET_LABELS[presetId] ?? PRODUCT_PRESET_LABELS[DEFAULT_PRODUCT_PRESET];
}

export function getDesignTemplateLabel(templateId) {
    return DESIGN_TEMPLATE_LABELS[templateId] ?? DESIGN_TEMPLATE_LABELS[DEFAULT_DESIGN_TEMPLATE];
}

export function getCameraViewLabel(viewId) {
    return CAMERA_VIEW_LABELS[viewId] ?? CAMERA_VIEW_LABELS[DEFAULT_CAMERA_VIEW];
}

export function getLightingModeLabel(modeId) {
    return LIGHTING_MODE_LABELS[modeId] ?? LIGHTING_MODE_LABELS[DEFAULT_LIGHTING_MODE];
}

export function getRenderQualityLabel(qualityId) {
    return RENDER_QUALITY_LABELS[qualityId] ?? RENDER_QUALITY_LABELS[DEFAULT_RENDER_QUALITY];
}

export function getLogoPath(variant = DEFAULT_LOGO_VARIANT) {
    return variant === LOGO_VARIANTS.DARK
        ? ASSET_PATHS.LOGO_DARK
        : ASSET_PATHS.LOGO_LIGHT;
}

export function isValidProductPreset(value) {
    return Object.values(PRODUCT_PRESET_IDS).includes(value);
}

export function isValidDesignTemplate(value) {
    return Object.values(DESIGN_TEMPLATE_IDS).includes(value);
}

export function isValidCameraView(value) {
    return Object.values(CAMERA_VIEW_IDS).includes(value);
}

export function isValidLightingMode(value) {
    return Object.values(LIGHTING_MODE_IDS).includes(value);
}

export function isValidRenderQuality(value) {
    return Object.values(RENDER_QUALITY_IDS).includes(value);
}

export function isValidEditMode(value) {
    return Object.values(EDIT_MODE_IDS).includes(value);
}

export function isValidLogoVariant(value) {
    return Object.values(LOGO_VARIANTS).includes(value);
}

export function clampNumber(value, min, max) {
    const number = Number(value);

    if (Number.isNaN(number)) return min;

    return Math.min(Math.max(number, min), max);
}

export function megabytesToBytes(megabytes) {
    return megabytes * 1024 * 1024;
}

/* ---------------------------------------------------------
   28. EXPORT AGRUPADO
--------------------------------------------------------- */

export const APP_CONSTANTS = Object.freeze({
    APP_INFO,
    APP_ENV,
    RUNTIME_FLAGS,

    PUBLIC_PATHS,
    ASSET_PATHS,
    SUPPORTED_ASSET_TYPES,
    SUPPORTED_FILE_EXTENSIONS,

    PRODUCT_PRESET_IDS,
    PRODUCT_PRESET_LABELS,
    DEFAULT_PRODUCT_PRESET,

    DESIGN_TEMPLATE_IDS,
    DESIGN_TEMPLATE_LABELS,
    DEFAULT_DESIGN_TEMPLATE,

    VISUAL_THEME_IDS,
    DEFAULT_VISUAL_THEME,
    BRAND_COLORS,
    THEME_COLOR_PRESETS,

    DEFAULT_BEVERAGE_TYPE,
    BEVERAGE_LAYOUT_MODE,
    DEFAULT_BEVERAGE_LAYOUT_MODE,

    CAMERA_VIEW_IDS,
    CAMERA_VIEW_LABELS,
    DEFAULT_CAMERA_VIEW,

    LIGHTING_MODE_IDS,
    LIGHTING_MODE_LABELS,
    DEFAULT_LIGHTING_MODE,

    RENDER_QUALITY_IDS,
    RENDER_QUALITY_LABELS,
    DEFAULT_RENDER_QUALITY,
    RENDER_QUALITY_SETTINGS,

    EDIT_MODE_IDS,
    EDIT_MODE_LABELS,
    TRANSFORM_CONTROL_MODES,
    EDIT_TO_TRANSFORM_MODE,
    DEFAULT_EDIT_MODE,
    TRANSFORM_SPACE_IDS,
    DEFAULT_TRANSFORM_SPACE,

    TRANSFORM_LIMITS,
    OBJECT_SCALE_LIMITS,

    INTERACTION_KEYS,
    POINTER_BUTTONS,
    INTERACTION_HELP_TEXT,

    DOM_IDS,
    CSS_SELECTORS,
    FORM_FIELD_KEYS,

    LOGO_VARIANTS,
    LOGO_VARIANT_LABELS,
    DEFAULT_LOGO_VARIANT,

    EXPORT_TYPES,
    EXPORT_FILE_PREFIXES,
    EXPORT_MIME_TYPES,
    EXPORT_LIMITS,

    FILE_LIMITS,
    FILE_ERROR_MESSAGES,

    QR_DEFAULTS,
    QR_CONTENT_TYPES,

    DEFAULT_TEXT_CONTENT,
    BUSINESS_DEFAULTS,
    STORAGE_KEYS,
    APP_EVENTS,
    ANIMATION_DEFAULTS,
    UI_MESSAGES,
});
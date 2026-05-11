/* =========================================================
   KICKOFF BOX 3D CONFIGURATOR
   Archivo: src/constants/objectKeys.js

   Propósito:
   Centralizar nombres, llaves y categorías de objetos 3D para
   evitar strings sueltos dentro de main.js, sceneComposer.js,
   servicios, UI y objetos del simulador.

   Regla:
   - Las claves deben ser serializables.
   - No usar Symbol, porque luego exportaremos/importaremos JSON.
   - No duplicar strings de objetos en otros módulos.
========================================================= */

/* ---------------------------------------------------------
   1. GRUPOS PRINCIPALES DE ESCENA
--------------------------------------------------------- */

export const GROUP_KEYS = Object.freeze({
    ROOT: "rootGroup",
    ENVIRONMENT: "environmentGroup",
    BOX: "boxGroup",
    CONTENT: "contentGroup",
    DECORATION: "decorationGroup",
    INTERACTION: "interactionGroup",
    HELPERS: "helpersGroup",
    LIGHTS: "lightsGroup",
});

/* ---------------------------------------------------------
   2. OBJETOS PRINCIPALES DEL PRODUCTO
--------------------------------------------------------- */

export const OBJECT_KEYS = Object.freeze({
    BOX_BASE: "boxBase",
    BOX_LID: "boxLid",
    INTERNAL_DIVIDERS: "internalDividers",

    PAPER_FILLER: "paperFiller",

    CARD_MESSAGE: "cardMessage",
    QR_CARD: "qrCard",
    LID_INTERIOR_DESIGN: "lidInteriorDesign",

    CUPCAKE: "cupcake",
    SODA_BOTTLE: "sodaBottle",
    DECORATIVE_ROSE: "decorativeRose",
    RESIN_KEYCHAIN: "resinKeychain",

    CAREER_LOGO_BADGE: "careerLogoBadge",
    CUSTOM_IMAGE_PLANE: "customImagePlane",
    THEMATIC_DECORATIONS: "thematicDecorations",

    SELECTION_HELPER: "selectionHelper",
    TRANSFORM_CONTROLS: "transformControls",
});

/* ---------------------------------------------------------
   3. OBJETOS INTERNOS / PARTES DE LA CAJA
--------------------------------------------------------- */

export const BOX_PART_KEYS = Object.freeze({
    BASE_FLOOR: "boxBaseFloor",
    BASE_FRONT_WALL: "boxBaseFrontWall",
    BASE_BACK_WALL: "boxBaseBackWall",
    BASE_LEFT_WALL: "boxBaseLeftWall",
    BASE_RIGHT_WALL: "boxBaseRightWall",

    INTERIOR_FLOOR: "boxInteriorFloor",
    INTERIOR_FRAME: "boxInteriorFrame",
    FRONT_LABEL: "boxFrontLabel",
    SIDE_LABEL: "boxSideLabel",

    LID_PANEL: "boxLidPanel",
    LID_OUTER_SURFACE: "boxLidOuterSurface",
    LID_INNER_SURFACE: "boxLidInnerSurface",
    LID_HINGE: "boxLidHinge",
    LID_RIBBON: "boxLidRibbon",
});

/* ---------------------------------------------------------
   4. PARTES DEL CONTENIDO INTERNO
--------------------------------------------------------- */

export const CONTENT_PART_KEYS = Object.freeze({
    CARD_SURFACE: "cardMessageSurface",
    CARD_BACKING: "cardMessageBacking",
    CARD_FRAME: "cardMessageFrame",

    QR_SURFACE: "qrCardSurface",
    QR_BODY: "qrCardBody",
    QR_STAND: "qrCardStand",

    CUPCAKE_WRAPPER: "cupcakeWrapper",
    CUPCAKE_BODY: "cupcakeBody",
    CUPCAKE_FROSTING: "cupcakeFrosting",
    CUPCAKE_TOPPING: "cupcakeTopping",

    ROSE_STEM: "decorativeRoseStem",
    ROSE_PETALS: "decorativeRosePetals",
    ROSE_LEAF: "decorativeRoseLeaf",

    KEYCHAIN_BODY: "resinKeychainBody",
    KEYCHAIN_LOGO: "resinKeychainLogo",
    KEYCHAIN_RING: "resinKeychainRing",
    KEYCHAIN_CHAIN: "resinKeychainChain",
    KEYCHAIN_GLITTER: "resinKeychainGlitter",
    KEYCHAIN_ENGRAVING: "resinKeychainEngraving",
});

/* ---------------------------------------------------------
   5. PARTES DEL SISTEMA DE BEBIDAS
--------------------------------------------------------- */

export const BEVERAGE_PART_KEYS = Object.freeze({
    ASSEMBLY: "beverageAssembly",
    BODY: "beverageBody",
    SHOULDER: "beverageShoulder",
    NECK: "beverageNeck",
    CAP: "beverageCap",
    CAP_RIDGES: "beverageCapRidges",
    SPORT_NOZZLE: "beverageSportNozzle",

    LIQUID: "beverageLiquid",
    LIQUID_SURFACE: "beverageLiquidSurface",

    LABEL_FRONT: "beverageLabelFront",
    LABEL_BACK: "beverageLabelBack",
    LABEL_CUSTOM_IMAGE: "beverageLabelCustomImage",

    BUBBLES: "beverageBubbles",
    CONDENSATION: "beverageCondensation",

    HIGHLIGHTS: "beverageHighlights",
    BASE_RING: "beverageBaseRing",
    CONTACT_SHADOW: "beverageContactShadow",
});

/* ---------------------------------------------------------
   6. PARTES DE DECORACIÓN TEMÁTICA
--------------------------------------------------------- */

export const DECORATION_PART_KEYS = Object.freeze({
    FRONT_PLATE: "frontThematicPlate",
    LID_PLATE: "lidThematicPlate",
    WORLD_CUP_BADGE: "worldCupBadge",
    TRICOLOR_RIBBON: "tricolorRibbon",
    TECH_LINES: "techLines",
    PIXEL_ARC: "pixelArc",
    FIELD_OVERLAY: "footballFieldOverlay",
    FLOATING_NODES: "floatingNodes",

    PREMIUM_PATTERN: "premiumPattern",
    GOLD_ACCENT: "goldAccent",
    STADIUM_LINES: "stadiumLines",
});

/* ---------------------------------------------------------
   7. ROLES DE OBJETOS EN LA ESCENA
--------------------------------------------------------- */

export const OBJECT_ROLES = Object.freeze({
    STRUCTURE: "structure",
    CONTENT: "content",
    DECORATION: "decoration",
    INTERACTIVE: "interactive",
    HELPER: "helper",
    LIGHT: "light",
    ENVIRONMENT: "environment",
});

/* ---------------------------------------------------------
   8. CATEGORÍAS FUNCIONALES
--------------------------------------------------------- */

export const OBJECT_CATEGORIES = Object.freeze({
    PACKAGING: "packaging",
    FOOD: "food",
    BEVERAGE: "beverage",
    SOUVENIR: "souvenir",
    DIGITAL: "digital",
    BRANDING: "branding",
    DECORATION: "decoration",
    SYSTEM: "system",
});

/* ---------------------------------------------------------
   9. ESTADOS DE VISIBILIDAD / PRESETS
--------------------------------------------------------- */

export const VISIBILITY_KEYS = Object.freeze({
    ALWAYS: "always",

    BASIC: "basic",
    STANDARD: "standard",
    PREMIUM: "premium",

    DEFENSE: "defense",
    JURY: "jury",
    INSTITUTIONAL: "institutional",

    OPTIONAL: "optional",
    HIDDEN: "hidden",
});

/* ---------------------------------------------------------
   10. LLAVES DEL REGISTRO DE OBJETOS
--------------------------------------------------------- */

export const REGISTRY_KEYS = Object.freeze({
    ID: "registryKey",
    NAME: "name",
    ROLE: "role",
    CATEGORY: "category",
    PRESET_KEY: "presetKey",
    PART_KEY: "partKey",
    PARENT_KEY: "parentKey",
    TEMPLATE_KEY: "templateKey",
    EDITABLE: "editable",
    DRAGGABLE: "draggable",
    ROTATABLE: "rotatable",
    SCALABLE: "scalable",
    SELECTABLE: "selectable",
});

/* ---------------------------------------------------------
   11. LLAVES PARA USERDATA DE THREE.JS
--------------------------------------------------------- */

export const USER_DATA_KEYS = Object.freeze({
    TYPE: "type",
    OBJECT_KEY: "objectKey",
    PART_KEY: "partKey",
    ROLE: "role",
    CATEGORY: "category",

    EDITABLE: "editable",
    SELECTABLE: "selectable",
    DRAGGABLE: "draggable",
    ROTATABLE: "rotatable",
    SCALABLE: "scalable",

    VISIBLE_IN_PRESETS: "visibleInPresets",
    ACTIVE_TEMPLATE: "activeTemplate",

    MIN_SCALE: "minScale",
    MAX_SCALE: "maxScale",

    OPTIONS: "options",
    CONFIG: "config",
    MATERIALS: "materials",
    DISPOSE_HANDLER: "disposeHandler",
});

/* ---------------------------------------------------------
   12. EVENTOS INTERNOS DEL CONFIGURADOR
--------------------------------------------------------- */

export const CONFIGURATOR_EVENTS = Object.freeze({
    STATE_CHANGED: "configurator/stateChanged",
    TEMPLATE_CHANGED: "configurator/templateChanged",
    PRESET_CHANGED: "configurator/presetChanged",

    OBJECT_SELECTED: "scene/objectSelected",
    OBJECT_DESELECTED: "scene/objectDeselected",
    OBJECT_TRANSFORMED: "scene/objectTransformed",
    OBJECT_VISIBILITY_CHANGED: "scene/objectVisibilityChanged",

    BEVERAGE_CHANGED: "product/beverageChanged",
    MESSAGE_CHANGED: "product/messageChanged",
    QR_CHANGED: "product/qrChanged",
    LOGO_CHANGED: "product/logoChanged",
    IMAGE_UPLOADED: "product/imageUploaded",

    PRICE_UPDATED: "commerce/priceUpdated",
    DESIGN_EXPORTED: "export/designExported",
    DESIGN_IMPORTED: "export/designImported",
});

/* ---------------------------------------------------------
   13. MAPEO DE OBJETO → ROL
--------------------------------------------------------- */

export const OBJECT_ROLE_MAP = Object.freeze({
    [OBJECT_KEYS.BOX_BASE]: OBJECT_ROLES.STRUCTURE,
    [OBJECT_KEYS.BOX_LID]: OBJECT_ROLES.STRUCTURE,
    [OBJECT_KEYS.INTERNAL_DIVIDERS]: OBJECT_ROLES.STRUCTURE,

    [OBJECT_KEYS.PAPER_FILLER]: OBJECT_ROLES.DECORATION,
    [OBJECT_KEYS.THEMATIC_DECORATIONS]: OBJECT_ROLES.DECORATION,

    [OBJECT_KEYS.CARD_MESSAGE]: OBJECT_ROLES.CONTENT,
    [OBJECT_KEYS.QR_CARD]: OBJECT_ROLES.CONTENT,
    [OBJECT_KEYS.LID_INTERIOR_DESIGN]: OBJECT_ROLES.CONTENT,

    [OBJECT_KEYS.CUPCAKE]: OBJECT_ROLES.CONTENT,
    [OBJECT_KEYS.SODA_BOTTLE]: OBJECT_ROLES.CONTENT,
    [OBJECT_KEYS.DECORATIVE_ROSE]: OBJECT_ROLES.CONTENT,
    [OBJECT_KEYS.RESIN_KEYCHAIN]: OBJECT_ROLES.CONTENT,

    [OBJECT_KEYS.CAREER_LOGO_BADGE]: OBJECT_ROLES.DECORATION,
    [OBJECT_KEYS.CUSTOM_IMAGE_PLANE]: OBJECT_ROLES.DECORATION,

    [OBJECT_KEYS.SELECTION_HELPER]: OBJECT_ROLES.HELPER,
    [OBJECT_KEYS.TRANSFORM_CONTROLS]: OBJECT_ROLES.HELPER,
});

/* ---------------------------------------------------------
   14. MAPEO DE OBJETO → CATEGORÍA
--------------------------------------------------------- */

export const OBJECT_CATEGORY_MAP = Object.freeze({
    [OBJECT_KEYS.BOX_BASE]: OBJECT_CATEGORIES.PACKAGING,
    [OBJECT_KEYS.BOX_LID]: OBJECT_CATEGORIES.PACKAGING,
    [OBJECT_KEYS.INTERNAL_DIVIDERS]: OBJECT_CATEGORIES.PACKAGING,
    [OBJECT_KEYS.PAPER_FILLER]: OBJECT_CATEGORIES.PACKAGING,

    [OBJECT_KEYS.CARD_MESSAGE]: OBJECT_CATEGORIES.DIGITAL,
    [OBJECT_KEYS.QR_CARD]: OBJECT_CATEGORIES.DIGITAL,
    [OBJECT_KEYS.LID_INTERIOR_DESIGN]: OBJECT_CATEGORIES.DIGITAL,

    [OBJECT_KEYS.CUPCAKE]: OBJECT_CATEGORIES.FOOD,
    [OBJECT_KEYS.SODA_BOTTLE]: OBJECT_CATEGORIES.BEVERAGE,

    [OBJECT_KEYS.DECORATIVE_ROSE]: OBJECT_CATEGORIES.DECORATION,
    [OBJECT_KEYS.RESIN_KEYCHAIN]: OBJECT_CATEGORIES.SOUVENIR,

    [OBJECT_KEYS.CAREER_LOGO_BADGE]: OBJECT_CATEGORIES.BRANDING,
    [OBJECT_KEYS.CUSTOM_IMAGE_PLANE]: OBJECT_CATEGORIES.BRANDING,
    [OBJECT_KEYS.THEMATIC_DECORATIONS]: OBJECT_CATEGORIES.DECORATION,

    [OBJECT_KEYS.SELECTION_HELPER]: OBJECT_CATEGORIES.SYSTEM,
    [OBJECT_KEYS.TRANSFORM_CONTROLS]: OBJECT_CATEGORIES.SYSTEM,
});

/* ---------------------------------------------------------
   15. OBJETOS EDITABLES POR DEFECTO
--------------------------------------------------------- */

export const DEFAULT_EDITABLE_OBJECTS = Object.freeze([
    OBJECT_KEYS.CARD_MESSAGE,
    OBJECT_KEYS.QR_CARD,
    OBJECT_KEYS.CUPCAKE,
    OBJECT_KEYS.SODA_BOTTLE,
    OBJECT_KEYS.DECORATIVE_ROSE,
    OBJECT_KEYS.RESIN_KEYCHAIN,
    OBJECT_KEYS.CAREER_LOGO_BADGE,
    OBJECT_KEYS.CUSTOM_IMAGE_PLANE,
]);

/* ---------------------------------------------------------
   16. OBJETOS ESTRUCTURALES NO EDITABLES
--------------------------------------------------------- */

export const STRUCTURAL_OBJECTS = Object.freeze([
    OBJECT_KEYS.BOX_BASE,
    OBJECT_KEYS.BOX_LID,
    OBJECT_KEYS.INTERNAL_DIVIDERS,
]);

/* ---------------------------------------------------------
   17. OBJETOS QUE PUEDEN EXPORTARSE COMO CONFIGURACIÓN
--------------------------------------------------------- */

export const EXPORTABLE_OBJECTS = Object.freeze([
    OBJECT_KEYS.BOX_BASE,
    OBJECT_KEYS.BOX_LID,
    OBJECT_KEYS.PAPER_FILLER,
    OBJECT_KEYS.CARD_MESSAGE,
    OBJECT_KEYS.QR_CARD,
    OBJECT_KEYS.LID_INTERIOR_DESIGN,
    OBJECT_KEYS.CUPCAKE,
    OBJECT_KEYS.SODA_BOTTLE,
    OBJECT_KEYS.DECORATIVE_ROSE,
    OBJECT_KEYS.RESIN_KEYCHAIN,
    OBJECT_KEYS.CAREER_LOGO_BADGE,
    OBJECT_KEYS.CUSTOM_IMAGE_PLANE,
    OBJECT_KEYS.THEMATIC_DECORATIONS,
]);

/* ---------------------------------------------------------
   18. HELPERS DE VALIDACIÓN
--------------------------------------------------------- */

export function getObjectRole(objectKey) {
    return OBJECT_ROLE_MAP[objectKey] ?? OBJECT_ROLES.CONTENT;
}

export function getObjectCategory(objectKey) {
    return OBJECT_CATEGORY_MAP[objectKey] ?? OBJECT_CATEGORIES.SYSTEM;
}

export function isObjectKey(value) {
    return Object.values(OBJECT_KEYS).includes(value);
}

export function isEditableObjectKey(value) {
    return DEFAULT_EDITABLE_OBJECTS.includes(value);
}

export function isStructuralObjectKey(value) {
    return STRUCTURAL_OBJECTS.includes(value);
}

export function isExportableObjectKey(value) {
    return EXPORTABLE_OBJECTS.includes(value);
}

export function createObjectUserData(objectKey, overrides = {}) {
    return {
        [USER_DATA_KEYS.OBJECT_KEY]: objectKey,
        [USER_DATA_KEYS.ROLE]: getObjectRole(objectKey),
        [USER_DATA_KEYS.CATEGORY]: getObjectCategory(objectKey),
        [USER_DATA_KEYS.EDITABLE]: isEditableObjectKey(objectKey),
        [USER_DATA_KEYS.SELECTABLE]: isEditableObjectKey(objectKey),
        [USER_DATA_KEYS.DRAGGABLE]: isEditableObjectKey(objectKey),
        [USER_DATA_KEYS.ROTATABLE]: isEditableObjectKey(objectKey),
        [USER_DATA_KEYS.SCALABLE]: isEditableObjectKey(objectKey),
        ...overrides,
    };
}

export function createRegistryEntry(objectKey, object, metadata = {}) {
    return {
        key: objectKey,
        object,
        role: getObjectRole(objectKey),
        category: getObjectCategory(objectKey),
        editable: isEditableObjectKey(objectKey),
        exportable: isExportableObjectKey(objectKey),
        ...metadata,
    };
}

/* ---------------------------------------------------------
   19. EXPORT AGRUPADO
--------------------------------------------------------- */

export const OBJECT_KEY_REGISTRY = Object.freeze({
    GROUP_KEYS,
    OBJECT_KEYS,
    BOX_PART_KEYS,
    CONTENT_PART_KEYS,
    BEVERAGE_PART_KEYS,
    DECORATION_PART_KEYS,
    OBJECT_ROLES,
    OBJECT_CATEGORIES,
    VISIBILITY_KEYS,
    REGISTRY_KEYS,
    USER_DATA_KEYS,
    CONFIGURATOR_EVENTS,
    OBJECT_ROLE_MAP,
    OBJECT_CATEGORY_MAP,
    DEFAULT_EDITABLE_OBJECTS,
    STRUCTURAL_OBJECTS,
    EXPORTABLE_OBJECTS,
});
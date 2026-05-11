import * as THREE from "three";

import { OBJECT_KEYS, createObjectUserData } from "../constants/objectKeys.js";

import { createMaterials, disposeMaterials } from "../utils/materials.js";

import {
    createTextureSet,
    createMaterialFromTexture,
    disposeTextureSet,
} from "../utils/textureFactory.js";

import {
    createAssetLoader,
    loadLogoAsset,
} from "./assetLoader.js";

import {
    prepareConfiguratorForScene,
    validateConfiguratorState,
} from "../services/configuratorService.js";

import * as BoxBaseObject from "../objects/BoxBase.js";
import * as BoxLidObject from "../objects/BoxLid.js";
import * as CardMessageObject from "../objects/CardMessage.js";
import * as CareerLogoBadgeObject from "../objects/CareerLogoBadge.js";
import * as CupcakeObject from "../objects/Cupcake.js";
import * as CustomImagePlaneObject from "../objects/CustomImagePlane.js";
import * as DecorativeRoseObject from "../objects/DecorativeRose.js";
import * as InternalDividersObject from "../objects/InternalDividers.js";
import * as LidInteriorDesignObject from "../objects/LidInteriorDesign.js";
import * as PaperFillerObject from "../objects/PaperFiller.js";
import * as QRCardObject from "../objects/QRCard.js";
import * as ResinKeychainObject from "../objects/ResinKeychain.js";
import * as SodaBottleObject from "../objects/SodaBottle.js";
import * as ThematicDecorationsObject from "../objects/ThematicDecorations.js";

export const SCENE_COMPOSER_VERSION = "1.0.0";

export const SCENE_COMPOSER_STATUS = Object.freeze({
    IDLE: "idle",
    BUILDING: "building",
    READY: "ready",
    UPDATING: "updating",
    DISPOSED: "disposed",
    ERROR: "error",
});

export const SCENE_GROUP_KEYS = Object.freeze({
    ROOT: "KickOffBoxSceneRoot",
    PRODUCT: "KickOffBoxProductGroup",
    STRUCTURE: "StructureGroup",
    CONTENT: "ContentGroup",
    BRANDING: "BrandingGroup",
    DECORATION: "DecorationGroup",
    HELPERS: "HelpersGroup",
    GENERATED_TEXTURES: "GeneratedTextures",
});

export const SCENE_LAYERS = Object.freeze({
    DEFAULT: 0,
    PRODUCT: 1,
    EDITABLE: 2,
    HELPER: 3,
    EXPORT: 4,
});

export const OBJECT_CREATION_ORDER = Object.freeze([
    OBJECT_KEYS.BOX_BASE,
    OBJECT_KEYS.BOX_LID,
    OBJECT_KEYS.PAPER_FILLER,
    OBJECT_KEYS.INTERNAL_DIVIDERS,
    OBJECT_KEYS.LID_INTERIOR_DESIGN,
    OBJECT_KEYS.CARD_MESSAGE,
    OBJECT_KEYS.QR_CARD,
    OBJECT_KEYS.CUPCAKE,
    OBJECT_KEYS.SODA_BOTTLE,
    OBJECT_KEYS.DECORATIVE_ROSE,
    OBJECT_KEYS.RESIN_KEYCHAIN,
    OBJECT_KEYS.CAREER_LOGO_BADGE,
    OBJECT_KEYS.CUSTOM_IMAGE_PLANE,
    OBJECT_KEYS.THEMATIC_DECORATIONS,
]);

const OBJECT_MODULES = Object.freeze({
    [OBJECT_KEYS.BOX_BASE]: BoxBaseObject,
    [OBJECT_KEYS.BOX_LID]: BoxLidObject,
    [OBJECT_KEYS.CARD_MESSAGE]: CardMessageObject,
    [OBJECT_KEYS.CAREER_LOGO_BADGE]: CareerLogoBadgeObject,
    [OBJECT_KEYS.CUPCAKE]: CupcakeObject,
    [OBJECT_KEYS.CUSTOM_IMAGE_PLANE]: CustomImagePlaneObject,
    [OBJECT_KEYS.DECORATIVE_ROSE]: DecorativeRoseObject,
    [OBJECT_KEYS.INTERNAL_DIVIDERS]: InternalDividersObject,
    [OBJECT_KEYS.LID_INTERIOR_DESIGN]: LidInteriorDesignObject,
    [OBJECT_KEYS.PAPER_FILLER]: PaperFillerObject,
    [OBJECT_KEYS.QR_CARD]: QRCardObject,
    [OBJECT_KEYS.RESIN_KEYCHAIN]: ResinKeychainObject,
    [OBJECT_KEYS.SODA_BOTTLE]: SodaBottleObject,
    [OBJECT_KEYS.THEMATIC_DECORATIONS]: ThematicDecorationsObject,
});

const OBJECT_FACTORY_NAMES = Object.freeze({
    [OBJECT_KEYS.BOX_BASE]: ["createBoxBase"],
    [OBJECT_KEYS.BOX_LID]: ["createBoxLid"],
    [OBJECT_KEYS.CARD_MESSAGE]: ["createCardMessage", "createMessageCard"],
    [OBJECT_KEYS.CAREER_LOGO_BADGE]: ["createCareerLogoBadge", "createLogoBadge"],
    [OBJECT_KEYS.CUPCAKE]: ["createCupcake"],
    [OBJECT_KEYS.CUSTOM_IMAGE_PLANE]: ["createCustomImagePlane", "createImagePlane"],
    [OBJECT_KEYS.DECORATIVE_ROSE]: ["createDecorativeRose", "createRose"],
    [OBJECT_KEYS.INTERNAL_DIVIDERS]: ["createInternalDividers", "createDividers"],
    [OBJECT_KEYS.LID_INTERIOR_DESIGN]: ["createLidInteriorDesign", "createLidDesign"],
    [OBJECT_KEYS.PAPER_FILLER]: ["createPaperFiller"],
    [OBJECT_KEYS.QR_CARD]: ["createQRCard", "createQrCard"],
    [OBJECT_KEYS.RESIN_KEYCHAIN]: ["createResinKeychain", "createKeychain"],
    [OBJECT_KEYS.SODA_BOTTLE]: ["createSodaBottle", "createBottle"],
    [OBJECT_KEYS.THEMATIC_DECORATIONS]: ["createThematicDecorations", "createDecorations"],
});

const OBJECT_DISPOSER_NAMES = Object.freeze({
    [OBJECT_KEYS.BOX_BASE]: ["disposeBoxBase"],
    [OBJECT_KEYS.BOX_LID]: ["disposeBoxLid"],
    [OBJECT_KEYS.CARD_MESSAGE]: ["disposeCardMessage", "disposeMessageCard"],
    [OBJECT_KEYS.CAREER_LOGO_BADGE]: ["disposeCareerLogoBadge", "disposeLogoBadge"],
    [OBJECT_KEYS.CUPCAKE]: ["disposeCupcake"],
    [OBJECT_KEYS.CUSTOM_IMAGE_PLANE]: ["disposeCustomImagePlane", "disposeImagePlane"],
    [OBJECT_KEYS.DECORATIVE_ROSE]: ["disposeDecorativeRose", "disposeRose"],
    [OBJECT_KEYS.INTERNAL_DIVIDERS]: ["disposeInternalDividers", "disposeDividers"],
    [OBJECT_KEYS.LID_INTERIOR_DESIGN]: ["disposeLidInteriorDesign", "disposeLidDesign"],
    [OBJECT_KEYS.PAPER_FILLER]: ["disposePaperFiller"],
    [OBJECT_KEYS.QR_CARD]: ["disposeQRCard", "disposeQrCard"],
    [OBJECT_KEYS.RESIN_KEYCHAIN]: ["disposeResinKeychain", "disposeKeychain"],
    [OBJECT_KEYS.SODA_BOTTLE]: ["disposeSodaBottle", "disposeBottle"],
    [OBJECT_KEYS.THEMATIC_DECORATIONS]: ["disposeThematicDecorations", "disposeDecorations"],
});

function nowISO() {
    return new Date().toISOString();
}

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

function toVector3(value, fallback = [0, 0, 0]) {
    const source = Array.isArray(value) && value.length === 3 ? value : fallback;

    return new THREE.Vector3(
        Number(source[0]) || 0,
        Number(source[1]) || 0,
        Number(source[2]) || 0,
    );
}

function applyTransform(object, transform = {}) {
    if (!object) return object;

    const position = toVector3(transform.position, [0, 0, 0]);
    const rotation = toVector3(transform.rotation, [0, 0, 0]);
    const scale = toVector3(transform.scale, [1, 1, 1]);

    object.position.copy(position);
    object.rotation.set(rotation.x, rotation.y, rotation.z);
    object.scale.copy(scale);

    object.updateMatrix();
    object.updateMatrixWorld(true);

    return object;
}

function setObjectShadows(object, castShadow = true, receiveShadow = true) {
    object.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = castShadow;
            child.receiveShadow = receiveShadow;
        }
    });
}

function setObjectLayer(object, layer = SCENE_LAYERS.PRODUCT) {
    object.layers.set(layer);

    object.traverse((child) => {
        child.layers.set(layer);
    });
}

function createNamedGroup(name, userData = {}) {
    const group = new THREE.Group();

    group.name = name;
    group.userData = {
        ...userData,
        isSceneComposerGroup: true,
        createdAt: nowISO(),
    };

    return group;
}

function getFunctionFromModule(module, functionNames = []) {
    return functionNames
        .map((name) => module?.[name])
        .find((candidate) => typeof candidate === "function") ?? null;
}

function disposeObject3D(object) {
    if (!object) return;

    const disposable = [];

    object.traverse((child) => {
        disposable.push(child);
    });

    disposable.forEach((child) => {
        if (child.geometry?.dispose) {
            child.geometry.dispose();
        }

        if (child.material) {
            const materials = Array.isArray(child.material)
                ? child.material
                : [child.material];

            materials.forEach((material) => {
                if (material.map?.dispose) material.map.dispose();
                if (material.normalMap?.dispose) material.normalMap.dispose();
                if (material.roughnessMap?.dispose) material.roughnessMap.dispose();
                if (material.metalnessMap?.dispose) material.metalnessMap.dispose();
                if (material.alphaMap?.dispose) material.alphaMap.dispose();
                if (material.emissiveMap?.dispose) material.emissiveMap.dispose();
                if (material.dispose) material.dispose();
            });
        }
    });

    object.removeFromParent();
}

function createFallbackObject(objectKey, sceneConfig = {}) {
    const group = new THREE.Group();
    group.name = `Fallback_${objectKey}`;

    const geometry = new THREE.BoxGeometry(0.35, 0.08, 0.35);
    const material = new THREE.MeshStandardMaterial({
        color: sceneConfig?.visual?.accentColor ?? "#c59a4a",
        roughness: 0.62,
        metalness: 0.05,
        transparent: true,
        opacity: 0.38,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `FallbackMesh_${objectKey}`;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    group.add(mesh);
    group.userData = {
        objectKey,
        fallback: true,
        reason: "No existe factory exportada para este objeto.",
    };

    return group;
}

function createMaterialConfigFromScene(sceneConfig = {}) {
    const visual = sceneConfig.visual ?? {};
    const content = sceneConfig.content ?? {};
    const product = sceneConfig.product ?? {};

    return {
        colors: {
            exterior: product.boxColor ?? visual.primaryColor ?? "#111111",
            interior: product.interiorColor ?? visual.secondaryColor ?? "#1f1710",
            darkCardboard: visual.primaryColor ?? "#111111",
            paper: visual.textColor === "#fff7e8" ? "#fff7e8" : "#f3e0c5",
            gold: visual.accentColor ?? "#c59a4a",
            textDark: "#2b2118",
            boliviaRed: "#b92d2d",
            boliviaYellow: "#f0c84b",
            boliviaGreen: "#2f7d55",
            sodaBlue: content.beverage?.liquidColor ?? "#2f86c7",
        },
        materialSettings: {
            cardboard: {
                roughness: 0.78,
                metalness: visual.finish?.includes("premium") ? 0.06 : 0.02,
            },
            interior: {
                roughness: 0.82,
                metalness: 0.02,
            },
            bottle: {
                roughness: 0.16,
                metalness: 0.02,
                transmission: 0.25,
                opacity: 0.74,
                thickness: 0.75,
            },
            resin: {
                roughness: 0.12,
                metalness: 0.04,
                transmission: 0.28,
                opacity: 0.78,
                thickness: 0.7,
            },
        },
        environment: {
            floor: {
                color: "#20140d",
            },
            ring: {
                color: visual.accentColor ?? "#c59a4a",
                opacity: 0.22,
            },
        },
    };
}

function createObjectConfig(objectKey, sceneConfig = {}, composerContext = {}) {
    const content = sceneConfig.content ?? {};
    const visual = sceneConfig.visual ?? {};
    const transform = sceneConfig.objectTransforms?.[objectKey] ?? sceneConfig.layout?.[objectKey] ?? {};
    const visibility = sceneConfig.visibility ?? {};

    return {
        objectKey,
        visible: visibility[objectKey] !== false,
        transform,
        sceneConfig,
        visual,
        content,
        project: content.project ?? {},
        text: content.text ?? {},
        qr: content.qr ?? {},
        beverage: content.beverage ?? sceneConfig.beverage?.state ?? {},
        images: content.images ?? {},
        product: sceneConfig.product ?? {},
        themeId: sceneConfig.themeId,
        templateId: sceneConfig.templateId,
        templateLabel: sceneConfig.templateLabel,
        textureSet: composerContext.textureSet ?? {},
        assets: composerContext.assets ?? {},
        materials: composerContext.materials ?? {},
        registry: composerContext.registry ?? null,
        createdAt: nowISO(),
    };
}

function createObject3D(objectKey, sceneConfig, materials, composerContext = {}) {
    const module = OBJECT_MODULES[objectKey];
    const factory = getFunctionFromModule(module, OBJECT_FACTORY_NAMES[objectKey]);

    const objectConfig = createObjectConfig(objectKey, sceneConfig, {
        ...composerContext,
        materials,
    });

    let object;

    if (factory) {
        object = factory(objectConfig, materials, composerContext.textureSet, composerContext.assets);
    } else {
        object = createFallbackObject(objectKey, sceneConfig);
    }

    if (!object) {
        object = createFallbackObject(objectKey, sceneConfig);
    }

    object.name = object.name || objectKey;
    object.visible = objectConfig.visible;
    object.userData = {
        ...object.userData,
        ...createObjectUserData(objectKey, {
            templateId: sceneConfig.templateId,
            visible: objectConfig.visible,
            createdBy: "sceneComposer",
            composerVersion: SCENE_COMPOSER_VERSION,
        }),
        objectKey,
    };

    applyTransform(object, objectConfig.transform);
    setObjectShadows(object, true, true);

    if (composerContext.editableKeys?.has(objectKey)) {
        setObjectLayer(object, SCENE_LAYERS.EDITABLE);
    } else {
        setObjectLayer(object, SCENE_LAYERS.PRODUCT);
    }

    return object;
}

function disposeObjectByModule(objectKey, object) {
    const module = OBJECT_MODULES[objectKey];
    const disposer = getFunctionFromModule(module, OBJECT_DISPOSER_NAMES[objectKey]);

    if (disposer) {
        disposer(object);
        return;
    }

    disposeObject3D(object);
}

function assignObjectToGroup(objectKey, object, groups) {
    if (!object) return;

    const structure = new Set([
        OBJECT_KEYS.BOX_BASE,
        OBJECT_KEYS.BOX_LID,
        OBJECT_KEYS.INTERNAL_DIVIDERS,
    ]);

    const branding = new Set([
        OBJECT_KEYS.CARD_MESSAGE,
        OBJECT_KEYS.QR_CARD,
        OBJECT_KEYS.CAREER_LOGO_BADGE,
        OBJECT_KEYS.CUSTOM_IMAGE_PLANE,
        OBJECT_KEYS.LID_INTERIOR_DESIGN,
    ]);

    const decoration = new Set([
        OBJECT_KEYS.DECORATIVE_ROSE,
        OBJECT_KEYS.THEMATIC_DECORATIONS,
        OBJECT_KEYS.PAPER_FILLER,
    ]);

    if (structure.has(objectKey)) {
        groups.structure.add(object);
        return;
    }

    if (branding.has(objectKey)) {
        groups.branding.add(object);
        return;
    }

    if (decoration.has(objectKey)) {
        groups.decoration.add(object);
        return;
    }

    groups.content.add(object);
}

function createSceneGroups() {
    const root = createNamedGroup(SCENE_GROUP_KEYS.ROOT, {
        composerVersion: SCENE_COMPOSER_VERSION,
    });

    const product = createNamedGroup(SCENE_GROUP_KEYS.PRODUCT);
    const structure = createNamedGroup(SCENE_GROUP_KEYS.STRUCTURE);
    const content = createNamedGroup(SCENE_GROUP_KEYS.CONTENT);
    const branding = createNamedGroup(SCENE_GROUP_KEYS.BRANDING);
    const decoration = createNamedGroup(SCENE_GROUP_KEYS.DECORATION);
    const helpers = createNamedGroup(SCENE_GROUP_KEYS.HELPERS);

    product.add(structure, decoration, content, branding);
    root.add(product, helpers);

    return {
        root,
        product,
        structure,
        content,
        branding,
        decoration,
        helpers,
    };
}

function createSceneTextureSet(sceneConfig = {}, state = {}) {
    const visual = sceneConfig.visual ?? {};
    const content = sceneConfig.content ?? {};

    return createTextureSet({
        visual,
        text: content.text ?? state.text ?? {},
        qr: content.qr ?? state.qr ?? {},
        beverage: content.beverage ?? state.beverage ?? {},
        logoVariant: state.product?.logoVariant ?? sceneConfig.product?.logoVariant,
    });
}

function applyTextureEnhancements(objects, textureSet = {}) {
    const materialApplications = [
        {
            objectKey: OBJECT_KEYS.LID_INTERIOR_DESIGN,
            resource: textureSet.lidInterior,
            materialType: "physical",
        },
        {
            objectKey: OBJECT_KEYS.CARD_MESSAGE,
            resource: textureSet.cardMessage,
            materialType: "standard",
        },
        {
            objectKey: OBJECT_KEYS.QR_CARD,
            resource: textureSet.qrCard,
            materialType: "standard",
        },
        {
            objectKey: OBJECT_KEYS.CAREER_LOGO_BADGE,
            resource: textureSet.logoBadge,
            materialType: "standard",
        },
        {
            objectKey: OBJECT_KEYS.RESIN_KEYCHAIN,
            resource: textureSet.keychain,
            materialType: "physical",
        },
        {
            objectKey: OBJECT_KEYS.SODA_BOTTLE,
            resource: textureSet.beverageLabel,
            materialType: "standard",
            nameIncludes: ["label", "Etiqueta", "Label"],
        },
    ];

    materialApplications.forEach((entry) => {
        const object = objects.get(entry.objectKey);
        const texture = entry.resource?.texture;

        if (!object || !texture) return;

        const material = createMaterialFromTexture(texture, {
            materialType: entry.materialType,
            roughness: entry.materialType === "physical" ? 0.26 : 0.5,
            metalness: entry.materialType === "physical" ? 0.04 : 0.01,
            transparent: true,
        });

        let applied = false;

        object.traverse((child) => {
            if (!child.isMesh) return;

            const name = child.name?.toLowerCase?.() ?? "";
            const shouldTargetSpecific =
                !entry.nameIncludes ||
                entry.nameIncludes.some((needle) => name.includes(needle.toLowerCase()));

            if (!shouldTargetSpecific) return;

            if (child.material?.dispose) child.material.dispose();
            child.material = material.clone();
            child.material.needsUpdate = true;
            applied = true;
        });

        if (!applied && object.isMesh) {
            if (object.material?.dispose) object.material.dispose();
            object.material = material;
            object.material.needsUpdate = true;
        } else {
            material.dispose();
        }
    });
}

function createContactPlane(sceneConfig = {}) {
    const visual = sceneConfig.visual ?? {};
    const geometry = new THREE.CircleGeometry(3.8, 96);
    const material = new THREE.MeshBasicMaterial({
        color: visual.primaryColor ?? "#111111",
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
        depthWrite: false,
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.name = "PremiumSceneContactPlane";
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0.004;
    plane.renderOrder = -10;

    return plane;
}

function createFocusRing(sceneConfig = {}) {
    const visual = sceneConfig.visual ?? {};
    const geometry = new THREE.RingGeometry(2.2, 2.24, 128);
    const material = new THREE.MeshBasicMaterial({
        color: visual.accentColor ?? "#c59a4a",
        transparent: true,
        opacity: 0.28,
        side: THREE.DoubleSide,
    });

    const ring = new THREE.Mesh(geometry, material);
    ring.name = "PremiumSceneFocusRing";
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.018;

    return ring;
}

function createSceneHelpers(sceneConfig = {}) {
    const group = createNamedGroup("SceneVisualHelpers");
    group.add(createContactPlane(sceneConfig));
    group.add(createFocusRing(sceneConfig));

    return group;
}

function getEditableKeys(scenePayload = {}) {
    return new Set(
        (scenePayload.editableObjects ?? [])
            .map((entry) => entry.objectKey)
            .filter(Boolean),
    );
}

function getExportableKeys(scenePayload = {}) {
    return new Set(
        (scenePayload.exportableObjects ?? [])
            .map((entry) => entry.objectKey)
            .filter(Boolean),
    );
}

export function prepareSceneComposerPayload(state, options = {}) {
    const scenePayload = options.scenePayload ?? prepareConfiguratorForScene(state, options);
    const sceneConfig = scenePayload.sceneConfig ?? {};
    const validation = options.validation ?? validateConfiguratorState(state);

    return {
        state,
        scenePayload,
        sceneConfig,
        validation,
        editableKeys: getEditableKeys(scenePayload),
        exportableKeys: getExportableKeys(scenePayload),
        preparedAt: nowISO(),
    };
}

export function createSceneComposition(state, options = {}) {
    const payload = prepareSceneComposerPayload(state, options);
    const sceneConfig = payload.sceneConfig;

    const groups = createSceneGroups();
    const materialConfig = createMaterialConfigFromScene(sceneConfig);
    const materials = createMaterials(materialConfig);
    const textureSet = options.createTextures === false
        ? {}
        : createSceneTextureSet(sceneConfig, state);

    const objects = new Map();
    const warnings = [];
    const errors = [];

    const composerContext = {
        payload,
        state,
        scenePayload: payload.scenePayload,
        sceneConfig,
        materials,
        textureSet,
        assets: options.assets ?? {},
        assetLoader: options.assetLoader ?? null,
        editableKeys: payload.editableKeys,
        exportableKeys: payload.exportableKeys,
    };

    OBJECT_CREATION_ORDER.forEach((objectKey) => {
        const isVisibleInConfig = sceneConfig.visibility?.[objectKey] !== false;

        if (!isVisibleInConfig && options.createHiddenObjects !== true) return;

        try {
            const object = createObject3D(objectKey, sceneConfig, materials, composerContext);

            object.visible = isVisibleInConfig;
            object.userData.exportable = payload.exportableKeys.has(objectKey);
            object.userData.editable = payload.editableKeys.has(objectKey);

            assignObjectToGroup(objectKey, object, groups);
            objects.set(objectKey, object);
        } catch (error) {
            errors.push({
                objectKey,
                message: error.message,
            });

            if (options.fallbackOnError !== false) {
                const fallback = createFallbackObject(objectKey, sceneConfig);
                fallback.visible = isVisibleInConfig;
                assignObjectToGroup(objectKey, fallback, groups);
                objects.set(objectKey, fallback);
            }
        }
    });

    if (options.includeHelpers !== false) {
        groups.helpers.add(createSceneHelpers(sceneConfig));
        groups.helpers.visible = Boolean(sceneConfig.render?.gridVisible);
        setObjectLayer(groups.helpers, SCENE_LAYERS.HELPER);
    }

    applyTextureEnhancements(objects, textureSet);

    groups.root.userData = {
        ...groups.root.userData,
        templateId: sceneConfig.templateId,
        templateLabel: sceneConfig.templateLabel,
        status: errors.length ? SCENE_COMPOSER_STATUS.ERROR : SCENE_COMPOSER_STATUS.READY,
        objectCount: objects.size,
        warnings,
        errors,
        composedAt: nowISO(),
    };

    return {
        status: errors.length ? SCENE_COMPOSER_STATUS.ERROR : SCENE_COMPOSER_STATUS.READY,
        root: groups.root,
        groups,
        objects,
        materials,
        textureSet,
        sceneConfig,
        scenePayload: payload.scenePayload,
        validation: payload.validation,
        warnings,
        errors,
        createdAt: nowISO(),
    };
}

export function addCompositionToScene(scene, composition, options = {}) {
    if (!scene || !composition?.root) {
        return {
            ok: false,
            error: "No se recibió scene o composición válida.",
        };
    }

    if (options.clearPrevious !== false) {
        const previous = scene.getObjectByName(SCENE_GROUP_KEYS.ROOT);
        if (previous) previous.removeFromParent();
    }

    scene.add(composition.root);

    return {
        ok: true,
        scene,
        root: composition.root,
        addedAt: nowISO(),
    };
}

export function updateSceneComposition(composition, state, options = {}) {
    if (!composition?.root) {
        return createSceneComposition(state, options);
    }

    const payload = prepareSceneComposerPayload(state, options);
    const sceneConfig = payload.sceneConfig;
    const objects = composition.objects ?? new Map();

    objects.forEach((object, objectKey) => {
        const visible = sceneConfig.visibility?.[objectKey] !== false;
        const transform = sceneConfig.objectTransforms?.[objectKey] ?? sceneConfig.layout?.[objectKey];

        object.visible = visible;

        if (transform) {
            applyTransform(object, transform);
        }

        object.userData = {
            ...object.userData,
            visible,
            templateId: sceneConfig.templateId,
            updatedAt: nowISO(),
        };
    });

    composition.root.userData = {
        ...composition.root.userData,
        templateId: sceneConfig.templateId,
        templateLabel: sceneConfig.templateLabel,
        updatedAt: nowISO(),
        status: SCENE_COMPOSER_STATUS.READY,
    };

    composition.sceneConfig = sceneConfig;
    composition.scenePayload = payload.scenePayload;
    composition.validation = payload.validation;

    return composition;
}

export function rebuildSceneComposition(composition, state, options = {}) {
    const parent = composition?.root?.parent ?? null;

    disposeSceneComposition(composition);

    const nextComposition = createSceneComposition(state, options);

    if (parent) {
        parent.add(nextComposition.root);
    }

    return nextComposition;
}

export function disposeSceneComposition(composition) {
    if (!composition) return;

    if (composition.objects instanceof Map) {
        composition.objects.forEach((object, objectKey) => {
            disposeObjectByModule(objectKey, object);
        });

        composition.objects.clear();
    }

    if (composition.textureSet) {
        disposeTextureSet(composition.textureSet);
    }

    if (composition.materials) {
        disposeMaterials(composition.materials);
    }

    if (composition.root) {
        disposeObject3D(composition.root);
    }

    composition.status = SCENE_COMPOSER_STATUS.DISPOSED;
    composition.disposedAt = nowISO();
}

export function getSceneObject(composition, objectKey) {
    return composition?.objects?.get(objectKey) ?? null;
}

export function setSceneObjectVisibility(composition, objectKey, visible = true) {
    const object = getSceneObject(composition, objectKey);

    if (!object) {
        return {
            ok: false,
            error: `No existe el objeto ${objectKey} en la composición.`,
        };
    }

    object.visible = Boolean(visible);
    object.userData.visible = Boolean(visible);
    object.userData.updatedAt = nowISO();

    return {
        ok: true,
        object,
        objectKey,
        visible: Boolean(visible),
    };
}

export function setSceneObjectTransform(composition, objectKey, transform = {}) {
    const object = getSceneObject(composition, objectKey);

    if (!object) {
        return {
            ok: false,
            error: `No existe el objeto ${objectKey} en la composición.`,
        };
    }

    applyTransform(object, mergeDeep(
        {
            position: [object.position.x, object.position.y, object.position.z],
            rotation: [object.rotation.x, object.rotation.y, object.rotation.z],
            scale: [object.scale.x, object.scale.y, object.scale.z],
        },
        transform,
    ));

    object.userData.transform = {
        position: [object.position.x, object.position.y, object.position.z],
        rotation: [object.rotation.x, object.rotation.y, object.rotation.z],
        scale: [object.scale.x, object.scale.y, object.scale.z],
    };
    object.userData.updatedAt = nowISO();

    return {
        ok: true,
        object,
        objectKey,
        transform: object.userData.transform,
    };
}

export function focusSceneObject(composition, objectKey, camera, controls, options = {}) {
    const object = getSceneObject(composition, objectKey);

    if (!object) {
        return {
            ok: false,
            error: `No existe el objeto ${objectKey}.`,
        };
    }

    const box = new THREE.Box3().setFromObject(object);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();

    box.getCenter(center);
    box.getSize(size);

    const distance = Math.max(size.x, size.y, size.z, 0.5) * (options.distanceMultiplier ?? 3.2);

    if (camera) {
        camera.position.set(
            center.x + distance,
            center.y + distance * 0.7,
            center.z + distance,
        );
        camera.lookAt(center);
        camera.updateProjectionMatrix?.();
    }

    if (controls) {
        controls.target.copy(center);
        controls.update?.();
    }

    return {
        ok: true,
        objectKey,
        center,
        size,
        distance,
    };
}

export function createSceneComposer(initialState, options = {}) {
    let status = SCENE_COMPOSER_STATUS.IDLE;
    let composition = null;
    let state = initialState ? cloneDeep(initialState) : null;

    const assetLoader = options.assetLoader ?? createAssetLoader({
        callbacks: options.assetCallbacks ?? {},
    });

    function build(nextState = state, buildOptions = {}) {
        status = SCENE_COMPOSER_STATUS.BUILDING;
        state = cloneDeep(nextState);

        composition = createSceneComposition(state, {
            ...options,
            ...buildOptions,
            assetLoader,
        });

        status = composition.status;

        if (buildOptions.scene) {
            addCompositionToScene(buildOptions.scene, composition, buildOptions);
        }

        return composition;
    }

    function update(nextState = state, updateOptions = {}) {
        status = SCENE_COMPOSER_STATUS.UPDATING;
        state = cloneDeep(nextState);

        if (!composition || updateOptions.rebuild) {
            return build(state, updateOptions);
        }

        composition = updateSceneComposition(composition, state, updateOptions);
        status = SCENE_COMPOSER_STATUS.READY;

        return composition;
    }

    function rebuild(nextState = state, rebuildOptions = {}) {
        state = cloneDeep(nextState);

        composition = rebuildSceneComposition(composition, state, {
            ...options,
            ...rebuildOptions,
            assetLoader,
        });

        status = composition.status;

        return composition;
    }

    function dispose() {
        disposeSceneComposition(composition);
        assetLoader.dispose?.();

        composition = null;
        status = SCENE_COMPOSER_STATUS.DISPOSED;
    }

    function getObject(objectKey) {
        return getSceneObject(composition, objectKey);
    }

    function setVisibility(objectKey, visible) {
        return setSceneObjectVisibility(composition, objectKey, visible);
    }

    function setTransform(objectKey, transform) {
        return setSceneObjectTransform(composition, objectKey, transform);
    }

    async function loadLogo(variant, logoOptions = {}) {
        return loadLogoAsset(variant, logoOptions);
    }

    return {
        version: SCENE_COMPOSER_VERSION,

        get status() {
            return status;
        },

        get state() {
            return cloneDeep(state);
        },

        get composition() {
            return composition;
        },

        get root() {
            return composition?.root ?? null;
        },

        get objects() {
            return composition?.objects ?? new Map();
        },

        assetLoader,

        build,
        update,
        rebuild,
        dispose,

        getObject,
        setVisibility,
        setTransform,
        focusObject(objectKey, camera, controls, focusOptions = {}) {
            return focusSceneObject(composition, objectKey, camera, controls, focusOptions);
        },

        loadLogo,
    };
}

export const sceneComposer = Object.freeze({
    version: SCENE_COMPOSER_VERSION,
    status: SCENE_COMPOSER_STATUS,
    groupKeys: SCENE_GROUP_KEYS,
    layers: SCENE_LAYERS,
    creationOrder: OBJECT_CREATION_ORDER,

    prepareSceneComposerPayload,
    createSceneComposition,
    addCompositionToScene,
    updateSceneComposition,
    rebuildSceneComposition,
    disposeSceneComposition,

    getSceneObject,
    setSceneObjectVisibility,
    setSceneObjectTransform,
    focusSceneObject,

    createSceneComposer,
});
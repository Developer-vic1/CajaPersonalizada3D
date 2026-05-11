import * as THREE from "three";

import { boxConfig } from "./config/boxConfig.js";
import {
    defaultPreset,
    getPreset,
    getPresetOptions,
} from "./config/productPresets.js";

import * as DesignTemplates from "./config/designTemplates.js";
import * as BeverageCatalog from "./config/beverageCatalog.js";

import {
    createScene,
    createMainGroups,
    addMainGroupsToScene,
    createSceneState,
} from "./core/scene.js";

import { createCamera } from "./core/camera.js";

import {
    createRenderer,
    updateRendererSize,
    configureRendererQuality,
    captureRendererImage,
    disposeRenderer,
} from "./core/renderer.js";

import {
    createControls,
    updateControls,
    resetControls,
    setInteractionMode,
    moveCameraToView,
    createSmoothCameraController,
    focusControlsOnObject,
    disposeControls,
} from "./core/controls.js";

import {
    createLightingRig,
    setLightingMode,
    disposeLightingRig,
} from "./core/lights.js";

import * as AssetLoader from "./core/assetLoader.js";
import * as TransformControlsCore from "./core/transformControls.js";

import {
    createMaterials,
    updateMaterialColor,
    disposeMaterials,
} from "./utils/materials.js";

import * as TextureFactory from "./utils/textureFactory.js";
import * as ExportDesign from "./utils/exportDesign.js";
import * as PriceEstimator from "./utils/priceEstimator.js";

import * as DefaultDesignState from "./data/defaultDesignState.js";
import * as PricingRules from "./data/pricingRules.js";

import * as BoxBaseObject from "./objects/BoxBase.js";
import * as BoxLidObject from "./objects/BoxLid.js";
import * as InternalDividersObject from "./objects/InternalDividers.js";
import * as PaperFillerObject from "./objects/PaperFiller.js";
import * as LidInteriorDesignObject from "./objects/LidInteriorDesign.js";
import * as CardMessageObject from "./objects/CardMessage.js";
import * as CupcakeObject from "./objects/Cupcake.js";
import * as SodaBottleObject from "./objects/SodaBottle.js";
import * as DecorativeRoseObject from "./objects/DecorativeRose.js";
import * as ResinKeychainObject from "./objects/ResinKeychain.js";
import * as QRCardObject from "./objects/QRCard.js";
import * as CareerLogoBadgeObject from "./objects/CareerLogoBadge.js";
import * as CustomImagePlaneObject from "./objects/CustomImagePlane.js";
import * as ThematicDecorationsObject from "./objects/ThematicDecorations.js";

import * as ConfiguratorService from "./services/configuratorService.js";
import * as BeverageService from "./services/beverageService.js";
import * as TemplateService from "./services/templateService.js";

import * as FormState from "./ui/formState.js";
import * as UiEvents from "./ui/uiEvents.js";
import * as Actions from "./ui/actions.js";
import * as Panel from "./ui/panel.js";
import * as CustomizationPanel from "./ui/customizationPanel.js";

/* -------------------------------------------------------
   1. REFERENCIAS HTML
------------------------------------------------------- */

const canvasContainer = document.getElementById("canvas-container");
const loadingElement = document.getElementById("loading");

const presetSelect = document.getElementById("preset");
const boxColorInput = document.getElementById("boxColor");
const interiorColorInput = document.getElementById("interiorColor");
const toggleLidButton = document.getElementById("toggleLid");

if (!canvasContainer) {
    throw new Error("No se encontró el contenedor #canvas-container.");
}

/* -------------------------------------------------------
   2. UTILIDADES SEGURAS
------------------------------------------------------- */

function resolveFunction(module, names = []) {
    return names
        .map((name) => module?.[name])
        .find((candidate) => typeof candidate === "function") ?? null;
}

function callSafe(fn, ...args) {
    if (typeof fn !== "function") return null;

    try {
        return fn(...args);
    } catch (error) {
        console.warn("[KickOffBox3D] Error controlado:", error);
        return null;
    }
}

function firstValue(...values) {
    return values.find((value) => value !== undefined && value !== null);
}

function toArray3(value, fallback = [0, 0, 0]) {
    if (!Array.isArray(value)) return fallback;

    return [
        Number(value[0]) || fallback[0],
        Number(value[1]) || fallback[1],
        Number(value[2]) || fallback[2],
    ];
}

function applyObjectTransform(object, transform = {}) {
    if (!object) return object;

    if (Array.isArray(transform.position)) {
        const [x, y, z] = toArray3(transform.position);
        object.position.set(x, y, z);
    }

    if (Array.isArray(transform.rotation)) {
        const [x, y, z] = toArray3(transform.rotation);
        object.rotation.set(x, y, z);
    }

    if (Array.isArray(transform.scale)) {
        const [x, y, z] = toArray3(transform.scale, [1, 1, 1]);
        object.scale.set(x, y, z);
    }

    return object;
}

function disposeTexture(texture) {
    if (texture?.dispose) {
        texture.dispose();
    }
}

function disposeGenericObject(object) {
    if (!object) return;

    object.traverse?.((child) => {
        if (child.geometry?.dispose) {
            child.geometry.dispose();
        }

        if (child.material) {
            const materials = Array.isArray(child.material)
                ? child.material
                : [child.material];

            materials.forEach((material) => {
                disposeTexture(material.map);
                disposeTexture(material.normalMap);
                disposeTexture(material.roughnessMap);
                disposeTexture(material.metalnessMap);
                disposeTexture(material.alphaMap);
                disposeTexture(material.emissiveMap);

                if (material.userData?.texture?.dispose) {
                    material.userData.texture.dispose();
                }

                if (material.dispose) {
                    material.dispose();
                }
            });
        }
    });

    object.removeFromParent?.();
}

/* -------------------------------------------------------
   3. FACTORIES COMPATIBLES
------------------------------------------------------- */

const factory = {
    createBoxBase: resolveFunction(BoxBaseObject, [
        "createBoxBase",
    ]),
    updateBoxBaseColors: resolveFunction(BoxBaseObject, [
        "updateBoxBaseColors",
    ]),
    disposeBoxBase: resolveFunction(BoxBaseObject, [
        "disposeBoxBase",
    ]),

    createBoxLid: resolveFunction(BoxLidObject, [
        "createBoxLid",
    ]),
    toggleLid: resolveFunction(BoxLidObject, [
        "toggleLid",
    ]),
    updateLidAnimation: resolveFunction(BoxLidObject, [
        "updateLidAnimation",
        "animateLid",
    ]),
    setLidOpenState: resolveFunction(BoxLidObject, [
        "setLidOpenState",
    ]),
    disposeBoxLid: resolveFunction(BoxLidObject, [
        "disposeBoxLid",
    ]),

    createInternalDividers: resolveFunction(InternalDividersObject, [
        "createInternalDividers",
        "createDividers",
    ]),
    updateInternalDividersAnimation: resolveFunction(InternalDividersObject, [
        "updateInternalDividersAnimation",
        "animateInternalDividers",
    ]),
    setSlotGuidesVisibility: resolveFunction(InternalDividersObject, [
        "setSlotGuidesVisibility",
        "setSlotGuideVisibility",
    ]),
    setSlotLabelsVisibility: resolveFunction(InternalDividersObject, [
        "setSlotLabelsVisibility",
        "setSlotLabelVisibility",
    ]),
    setBottleChannelVisibility: resolveFunction(InternalDividersObject, [
        "setBottleChannelVisibility",
    ]),
    disposeInternalDividers: resolveFunction(InternalDividersObject, [
        "disposeInternalDividers",
        "disposeDividers",
    ]),

    createPaperFiller: resolveFunction(PaperFillerObject, [
        "createPaperFiller",
        "createFiller",
    ]),
    updatePaperFillerAnimation: resolveFunction(PaperFillerObject, [
        "updatePaperFillerAnimation",
        "animatePaperFiller",
    ]),
    setPaperFillerStyle: resolveFunction(PaperFillerObject, [
        "setPaperFillerStyle",
    ]),
    setPaperFillerDensityVisibility: resolveFunction(PaperFillerObject, [
        "setPaperFillerDensityVisibility",
    ]),
    disposePaperFiller: resolveFunction(PaperFillerObject, [
        "disposePaperFiller",
        "disposeFiller",
    ]),

    createLidInteriorDesign: resolveFunction(LidInteriorDesignObject, [
        "createLidInteriorDesign",
        "createLidDesign",
    ]),
    updateLidInteriorAnimation: resolveFunction(LidInteriorDesignObject, [
        "updateLidInteriorAnimation",
        "animateLidInteriorDesign",
        "animateLidDesign",
    ]),
    updateLidInteriorDesign: resolveFunction(LidInteriorDesignObject, [
        "updateLidInteriorDesign",
        "updateLidDesign",
    ]),
    disposeLidInteriorDesign: resolveFunction(LidInteriorDesignObject, [
        "disposeLidInteriorDesign",
        "disposeLidDesign",
    ]),

    createCardMessage: resolveFunction(CardMessageObject, [
        "createCardMessage",
        "createMessageCard",
    ]),
    updateCardMessage: resolveFunction(CardMessageObject, [
        "updateCardMessage",
        "updateMessageCard",
    ]),
    disposeCardMessage: resolveFunction(CardMessageObject, [
        "disposeCardMessage",
        "disposeMessageCard",
    ]),

    createCupcake: resolveFunction(CupcakeObject, [
        "createCupcake",
    ]),
    updateCupcakeAnimation: resolveFunction(CupcakeObject, [
        "updateCupcakeAnimation",
        "animateCupcake",
    ]),
    disposeCupcake: resolveFunction(CupcakeObject, [
        "disposeCupcake",
    ]),

    createSodaBottle: resolveFunction(SodaBottleObject, [
        "createSodaBottle",
        "createBeverageBottle",
        "createBottle",
    ]),
    updateSodaBottleAnimation: resolveFunction(SodaBottleObject, [
        "updateSodaBottleAnimation",
        "animateSodaBottle",
        "animateBottle",
    ]),
    updateBottleLabel: resolveFunction(SodaBottleObject, [
        "updateBottleLabel",
        "updateSodaBottleLabel",
    ]),
    setSodaBottleTransform: resolveFunction(SodaBottleObject, [
        "setSodaBottleTransform",
        "setBottleTransform",
    ]),
    disposeSodaBottle: resolveFunction(SodaBottleObject, [
        "disposeSodaBottle",
        "disposeBottle",
    ]),

    createDecorativeRose: resolveFunction(DecorativeRoseObject, [
        "createDecorativeRose",
        "createRose",
    ]),
    updateDecorativeRoseAnimation: resolveFunction(DecorativeRoseObject, [
        "updateDecorativeRoseAnimation",
        "animateDecorativeRose",
        "animateRose",
    ]),
    disposeDecorativeRose: resolveFunction(DecorativeRoseObject, [
        "disposeDecorativeRose",
        "disposeRose",
    ]),

    createResinKeychain: resolveFunction(ResinKeychainObject, [
        "createResinKeychain",
        "createKeychain",
    ]),
    updateResinKeychainAnimation: resolveFunction(ResinKeychainObject, [
        "updateResinKeychainAnimation",
        "animateResinKeychain",
        "animateKeychain",
    ]),
    setResinLogoVariant: resolveFunction(ResinKeychainObject, [
        "setResinLogoVariant",
    ]),
    setResinKeychainTransform: resolveFunction(ResinKeychainObject, [
        "setResinKeychainTransform",
        "setKeychainTransform",
    ]),
    disposeResinKeychain: resolveFunction(ResinKeychainObject, [
        "disposeResinKeychain",
        "disposeKeychain",
    ]),

    createQRCard: resolveFunction(QRCardObject, [
        "createQRCard",
        "createQrCard",
    ]),
    updateQRCard: resolveFunction(QRCardObject, [
        "updateQRCard",
        "updateQrCard",
    ]),
    setQRCardStandVisibility: resolveFunction(QRCardObject, [
        "setQRCardStandVisibility",
        "setQrCardStandVisibility",
    ]),
    disposeQRCard: resolveFunction(QRCardObject, [
        "disposeQRCard",
        "disposeQrCard",
    ]),

    createCareerLogoBadge: resolveFunction(CareerLogoBadgeObject, [
        "createCareerLogoBadge",
        "createLogoBadge",
    ]),
    updateCareerLogoVariant: resolveFunction(CareerLogoBadgeObject, [
        "updateCareerLogoVariant",
        "setCareerLogoVariant",
    ]),
    updateCareerLogoBadgeAnimation: resolveFunction(CareerLogoBadgeObject, [
        "updateCareerLogoBadgeAnimation",
        "animateCareerLogoBadge",
    ]),
    disposeCareerLogoBadge: resolveFunction(CareerLogoBadgeObject, [
        "disposeCareerLogoBadge",
        "disposeLogoBadge",
    ]),

    createCustomImagePlane: resolveFunction(CustomImagePlaneObject, [
        "createCustomImagePlane",
        "createImagePlane",
    ]),
    updateCustomImagePlaneAnimation: resolveFunction(CustomImagePlaneObject, [
        "updateCustomImagePlaneAnimation",
        "animateCustomImagePlane",
    ]),
    updateCustomImageSource: resolveFunction(CustomImagePlaneObject, [
        "updateCustomImageSource",
        "setCustomImageSource",
    ]),
    disposeCustomImagePlane: resolveFunction(CustomImagePlaneObject, [
        "disposeCustomImagePlane",
        "disposeImagePlane",
    ]),

    createThematicDecorations: resolveFunction(ThematicDecorationsObject, [
        "createThematicDecorations",
        "createDecorations",
    ]),
    updateThematicDecorationsAnimation: resolveFunction(ThematicDecorationsObject, [
        "animateThematicDecorations",
        "updateThematicDecorationsAnimation",
    ]),
    setThematicDecorationVisibility: resolveFunction(ThematicDecorationsObject, [
        "setThematicDecorationVisibility",
    ]),
    setThematicDecorationPartVisibility: resolveFunction(ThematicDecorationsObject, [
        "setThematicDecorationPartVisibility",
    ]),
    disposeThematicDecorations: resolveFunction(ThematicDecorationsObject, [
        "disposeThematicDecorations",
        "disposeDecorations",
    ]),
};

/* -------------------------------------------------------
   4. ESTADO GLOBAL
------------------------------------------------------- */

const designDefaults =
    DefaultDesignState.defaultDesignState ??
    DefaultDesignState.designState ??
    DefaultDesignState.DEFAULT_DESIGN_STATE ??
    {};

const state = {
    ...createSceneState(),

    currentPreset: presetSelect?.value || defaultPreset,
    quality: "high",
    lightingMode: "studio",
    detailMode: "presentation",
    selectedObject: null,
    hoveredObject: null,

    isDragging: false,
    dragPlane: new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.64),
    dragOffset: new THREE.Vector3(),
    pointer: new THREE.Vector2(),

    productReady: false,
    isLidOpen: true,

    design: {
        ...designDefaults,
        productName: "KickOff Box",
        teamName: "Synaptic_4",
        career: "Ingeniería de Sistemas",
        university: "UNIFRANZ",
        eventYear: "2026",
        recipient: "Jurado Académico",
        beverageType: "cola",
        logoVariant: "claro",
    },
};

const objectRegistry = new Map();
const disposers = [];
const integrationAudit = [];

const raycaster = new THREE.Raycaster();
const dragIntersection = new THREE.Vector3();
const clock = new THREE.Clock();

let animationFrameId = null;
let selectionHelper = null;

/* -------------------------------------------------------
   5. ESCENA BASE
------------------------------------------------------- */

const scene = createScene(boxConfig);

const groups = createMainGroups();
addMainGroupsToScene(scene, groups);

const camera = createCamera(boxConfig, canvasContainer);

const renderer = createRenderer(canvasContainer);
configureRendererQuality(renderer, state.quality);

const controls = createControls(camera, renderer, boxConfig);
const cameraController = createSmoothCameraController(camera, controls, boxConfig);

const materials = createMaterials(boxConfig);
const lightingRig = createLightingRig(boxConfig, scene);

/* -------------------------------------------------------
   6. CONFIGURACIÓN PREMIUM CENTRALIZADA
------------------------------------------------------- */

const premiumContent = {
    product: {
        productName: "KickOff Box",
        versionName: "Caja Premium",
        shortLabel: "Premium",
        theme: "kickoff-2026",
        templateId: "premium",
        logoVariant: "claro",
    },

    project: {
        projectName: "KickOff Box 2026",
        teamName: "Synaptic_4",
        career: "Ingeniería de Sistemas",
        university: "UNIFRANZ",
        recipientName: "Jurado Académico",
        message: "Este presente integra identidad académica, detalle físico y acceso digital al proyecto.",
    },

    visual: {
        accentColor: "#c59a4a",
        exteriorColor: boxColorInput?.value ?? "#c89f72",
        interiorColor: interiorColorInput?.value ?? "#f3e0c5",
        lidInteriorStyle: "premium-black-gold",
        dividerStyle: "dark-premium",
        decorationDensity: "high",
        theme: "kickoff-2026",
    },

    text: {
        frontText: "KickOff Box",
        lidTitle: "Gracias por acompañarnos",
        lidSubtitle: "Presentación académica",
        lidMessage: "Este detalle fue preparado para reconocer tu tiempo, criterio y apoyo en nuestro proyecto.",
        lidFooter: "KickOff Box · Ingeniería de Sistemas · UNIFRANZ",
        recipient: "Jurado Académico",
    },

    beverage: {
        beverageType: "cola",
        type: "cola",
        labelText: "COLA 2026",
        subLabel: "Refresco académico",
        footerText: "KickOff Box",
        orientation: "horizontal",
        bottleShape: "classic",
        labelStyle: "cola",
        position: [0.42, 0.34, 0.42],
        rotation: [0, 0, 0],
        scale: [0.5, 0.5, 0.5],
        showPackingPad: true,
        showSlotGuide: true,
    },

    internalDividers: {
        layout: "horizontal-beverage",
        visualStyle: "dark-premium",
        showBottleChannel: true,
        showBottleEndStops: true,
        showBottleSideFoam: true,
        showCardSleeve: true,
        showQrPocket: true,
        showKeychainPad: true,
        showCupcakeCup: true,
        showSlotLabels: true,
        showSlotGuides: true,
        showTricolorMicroRibbon: true,
    },

    paperFiller: {
        style: "premium",
        density: "high",
        width: 2.45,
        depth: 1.58,
        height: 0.18,
        baseY: 0.08,
        avoidCenterForBottle: true,
        bottleSupportChannel: true,
        showBaseVolume: true,
        showCurledStrips: true,
        showRibbonStrips: true,
        showConfetti: true,
        showSupportNest: true,
        showTexturePlane: true,
        seed: 2026,
    },

    lidInteriorDesign: {
        style: "premium-black-gold",
        finish: "laminated",
        layout: "hero-message",
        title: "Gracias por acompañarnos",
        subtitle: "Presentación académica",
        recipient: "Jurado Académico",
        message: "Este detalle fue preparado para reconocer tu tiempo, criterio y apoyo en nuestro proyecto.",
        footer: "KickOff Box · Ingeniería de Sistemas · UNIFRANZ",
        projectName: "KickOff Box 2026",
        teamName: "Synaptic_4",
        logoVariant: "oscuro",
        position: [0, 1.02, -0.78],
        rotation: [-Math.PI / 2.85, 0, 0],
        scale: [0.92, 0.92, 0.92],
    },

    customImagePlane: {
        target: "lid",
        style: "watermark",
        fit: "contain",
        title: "Imagen personalizada",
        subtitle: "Diseño editable",
        footer: "KickOff Box",
        opacity: 0.22,
        position: [0, 1.22, -0.72],
        rotation: [-Math.PI / 2.85, 0, 0],
        scale: [0.72, 0.72, 0.72],
        showFrame: false,
        showCaption: false,
        showBacking: false,
        showShadow: false,
    },

    thematicDecorations: {
        theme: "kickoff-2026",
        density: "high",
        showLidPlate: false,
        showFrontPlate: true,
        showWorldCupBadge: true,
        showAcademicSeal: true,
        showTechLines: true,
        showPixelArc: true,
        showFieldLines: true,
        showFloatingNodes: true,
        showConfetti: true,
        showStars: true,
        showGoldenThreads: true,
        showSubtleFloorPattern: true,
        frontText: "KickOff Box",
        frontSubtitle: "Presente académico personalizado",
        lidText: "KickOff Box",
        lidSubtitle: "Mundial 2026 · Tecnología · Identidad académica",
        academicText: "Ingeniería de Sistemas",
        universityText: "UNIFRANZ",
    },
};

function buildSceneConfig(overrides = {}) {
    return {
        ...boxConfig,
        sceneConfig: {
            product: premiumContent.product,
            visual: premiumContent.visual,
        },
        product: premiumContent.product,
        project: premiumContent.project,
        visual: premiumContent.visual,
        text: premiumContent.text,
        content: {
            project: premiumContent.project,
            text: premiumContent.text,
        },
        beverage: premiumContent.beverage,
        internalDividers: premiumContent.internalDividers,
        paperFiller: premiumContent.paperFiller,
        lidInteriorDesign: premiumContent.lidInteriorDesign,
        customImagePlane: premiumContent.customImagePlane,
        thematicDecorations: premiumContent.thematicDecorations,
        ...overrides,
    };
}

/* -------------------------------------------------------
   7. ARRANQUE
------------------------------------------------------- */

bootstrap();

function bootstrap() {
    createEnvironment();
    createProduct();
    createInterfaceExtensions();
    setupUIEvents();
    setupPointerEvents();
    setupKeyboardShortcuts();
    applyPreset(state.currentPreset);
    finishLoading();
    printIntegrationAudit();
    animate();
}

/* -------------------------------------------------------
   8. AMBIENTE 3D
------------------------------------------------------- */

function createEnvironment() {
    const environment = boxConfig.environment ?? {};
    const environmentGroup = groups.environmentGroup;

    const floor = new THREE.Mesh(
        new THREE.CircleGeometry(environment.floor?.radius ?? 14, 96),
        materials.floor,
    );

    floor.name = "StudioFloor";
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.04;
    floor.receiveShadow = true;

    environmentGroup.add(floor);

    const ring = new THREE.Mesh(
        new THREE.RingGeometry(
            environment.ring?.innerRadius ?? 5.8,
            environment.ring?.outerRadius ?? 6,
            96,
        ),
        materials.ring,
    );

    ring.name = "StudioAccentRing";
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.005;

    environmentGroup.add(ring);

    const grid = new THREE.GridHelper(
        environment.grid?.size ?? 18,
        environment.grid?.divisions ?? 28,
        environment.grid?.colorCenterLine ?? "#7a4f2a",
        environment.grid?.colorGrid ?? "#3a281c",
    );

    grid.name = "StudioGrid";
    grid.position.y = 0.01;

    if (grid.material) {
        grid.material.transparent = true;
        grid.material.opacity = environment.grid?.opacity ?? 0.18;
    }

    environmentGroup.add(grid);
}

/* -------------------------------------------------------
   9. CREACIÓN E INTEGRACIÓN COMPLETA
------------------------------------------------------- */

function createProduct() {
    const config = buildSceneConfig();

    const boxBase = createObject({
        key: "boxBase",
        creator: factory.createBoxBase,
        required: true,
        group: groups.boxGroup,
        disposer: factory.disposeBoxBase,
        metadata: {
            role: "structure",
            presetKey: "always",
            editable: false,
            selectable: false,
        },
        strategies: [
            [config, materials],
            [boxConfig, materials],
        ],
    });

    const lid = createObject({
        key: "lid",
        creator: factory.createBoxLid,
        required: true,
        group: groups.boxGroup,
        disposer: factory.disposeBoxLid,
        metadata: {
            role: "structure",
            presetKey: "always",
            editable: false,
            selectable: false,
        },
        strategies: [
            [config, materials],
            [boxConfig, materials],
        ],
    });

    const decorations = createObject({
        key: "decorations",
        creator: factory.createThematicDecorations,
        group: groups.boxGroup,
        disposer: factory.disposeThematicDecorations,
        metadata: {
            role: "decoration",
            presetKey: "always",
            editable: false,
            selectable: false,
        },
        strategies: [
            [config, materials, premiumContent.thematicDecorations],
            [
                buildSceneConfig({
                    thematicDecorations: premiumContent.thematicDecorations,
                }),
                materials,
            ],
            [boxConfig, materials, premiumContent.thematicDecorations],
        ],
    });

    const paperFiller = createObject({
        key: "paperFiller",
        creator: factory.createPaperFiller,
        group: groups.contentGroup,
        disposer: factory.disposePaperFiller,
        metadata: {
            role: "support-decoration",
            presetKey: "paperFiller",
            editable: false,
            selectable: false,
        },
        strategies: [
            [
                buildSceneConfig({
                    paperFiller: premiumContent.paperFiller,
                }),
                materials,
                {},
            ],
            [
                {
                    paperFiller: premiumContent.paperFiller,
                    visual: premiumContent.visual,
                },
                materials,
                {},
            ],
            [premiumContent.paperFiller, materials, {}],
        ],
    });

    const dividers = createObject({
        key: "dividers",
        creator: factory.createInternalDividers,
        group: groups.contentGroup,
        disposer: factory.disposeInternalDividers,
        metadata: {
            role: "layout",
            presetKey: "dividers",
            editable: false,
            selectable: false,
        },
        strategies: [
            [
                buildSceneConfig({
                    internalDividers: premiumContent.internalDividers,
                }),
                materials,
                premiumContent.internalDividers,
            ],
            [boxConfig, materials, premiumContent.internalDividers],
            [premiumContent.internalDividers, materials],
        ],
    });

    const lidInterior = createObject({
        key: "lidInterior",
        creator: factory.createLidInteriorDesign,
        group: groups.contentGroup,
        disposer: factory.disposeLidInteriorDesign,
        metadata: {
            role: "lid-branding",
            presetKey: "lidInterior",
            editable: true,
            draggable: true,
            selectable: true,
        },
        transform: premiumContent.lidInteriorDesign,
        strategies: [
            [
                buildSceneConfig({
                    lidInteriorDesign: premiumContent.lidInteriorDesign,
                }),
                materials,
                {},
                premiumContent.lidInteriorDesign,
            ],
            [
                {
                    lidInteriorDesign: premiumContent.lidInteriorDesign,
                    visual: premiumContent.visual,
                    text: premiumContent.text,
                    project: premiumContent.project,
                    product: premiumContent.product,
                },
                materials,
                {},
            ],
            [premiumContent.lidInteriorDesign, materials, {}],
        ],
    });

    const customImage = createObject({
        key: "customImage",
        creator: factory.createCustomImagePlane,
        group: groups.contentGroup,
        disposer: factory.disposeCustomImagePlane,
        metadata: {
            role: "custom-visual",
            presetKey: "customImage",
            editable: true,
            draggable: true,
            selectable: true,
        },
        transform: premiumContent.customImagePlane,
        strategies: [
            [
                buildSceneConfig({
                    customImagePlane: premiumContent.customImagePlane,
                }),
                materials,
                {},
                premiumContent.customImagePlane,
            ],
            [
                {
                    customImagePlane: premiumContent.customImagePlane,
                    visual: premiumContent.visual,
                    project: premiumContent.project,
                },
                materials,
                {},
            ],
            [premiumContent.customImagePlane, materials, {}],
        ],
    });

    const card = createObject({
        key: "card",
        creator: factory.createCardMessage,
        group: groups.contentGroup,
        disposer: factory.disposeCardMessage,
        metadata: {
            role: "content",
            presetKey: "card",
            editable: true,
            draggable: true,
            selectable: true,
        },
        transform: {
            position: [-0.78, 0.34, -0.36],
            rotation: [-Math.PI / 2, 0, -0.08],
            scale: [0.72, 0.72, 0.72],
        },
        strategies: [
            [
                config,
                materials,
                {
                    title: "Gracias por ser parte",
                    recipient: "Jurado Académico",
                    message: "Tu evaluación impulsa este proyecto académico.",
                    footer: "KickOff Box 2026",
                    position: [-0.78, 0.34, -0.36],
                    rotation: [-Math.PI / 2, 0, -0.08],
                    scale: [0.72, 0.72, 0.72],
                },
            ],
            [
                boxConfig,
                materials,
                {
                    title: "Gracias por ser parte",
                    recipient: "Jurado Académico",
                    message: "Tu evaluación impulsa este proyecto académico.",
                    footer: "KickOff Box 2026",
                },
            ],
        ],
    });

    const qrCard = createObject({
        key: "qr",
        creator: factory.createQRCard,
        group: groups.contentGroup,
        disposer: factory.disposeQRCard,
        metadata: {
            role: "content",
            presetKey: "qr",
            editable: true,
            draggable: true,
            selectable: true,
        },
        transform: {
            position: [1.02, 0.34, -0.46],
            rotation: [-Math.PI / 2, 0, 0.08],
            scale: [0.58, 0.58, 0.58],
        },
        strategies: [
            [
                config,
                materials,
                {
                    title: "Contenido digital",
                    subtitle: "Escanea para ver el proyecto",
                    qrValue: "https://example.com/kickoff-box-2026",
                    footer: "KickOff Box 2026",
                    position: [1.02, 0.34, -0.46],
                    rotation: [-Math.PI / 2, 0, 0.08],
                    scale: [0.58, 0.58, 0.58],
                },
            ],
            [
                boxConfig,
                materials,
                {
                    title: "Contenido digital",
                    subtitle: "Escanea para ver el proyecto",
                    qrValue: "https://example.com/kickoff-box-2026",
                    footer: "KickOff Box 2026",
                },
            ],
        ],
    });

    const cupcake = createObject({
        key: "cupcake",
        creator: factory.createCupcake,
        group: groups.contentGroup,
        disposer: factory.disposeCupcake,
        metadata: {
            role: "content",
            presetKey: "cupcake",
            editable: true,
            draggable: true,
            selectable: true,
        },
        transform: {
            position: [-0.82, 0.34, 0.46],
            scale: [0.72, 0.72, 0.72],
        },
        strategies: [
            [
                config,
                materials,
                {
                    position: [-0.82, 0.34, 0.46],
                    scale: [0.72, 0.72, 0.72],
                },
            ],
            [boxConfig, materials],
        ],
    });

    const soda = createObject({
        key: "soda",
        creator: factory.createSodaBottle,
        group: groups.contentGroup,
        disposer: factory.disposeSodaBottle,
        metadata: {
            role: "content",
            presetKey: "soda",
            editable: true,
            draggable: true,
            selectable: true,
        },
        transform: premiumContent.beverage,
        strategies: [
            [
                buildSceneConfig({
                    beverage: premiumContent.beverage,
                }),
                materials,
                {},
                premiumContent.beverage,
            ],
            [
                {
                    ...config,
                    beverage: premiumContent.beverage,
                },
                materials,
                {},
            ],
            [
                boxConfig,
                materials,
                {
                    labelText: "COLA 2026",
                    subLabel: "Refresco académico",
                    liquidColor: "#1d1009",
                },
            ],
        ],
    });

    const rose = createObject({
        key: "rose",
        creator: factory.createDecorativeRose,
        group: groups.contentGroup,
        disposer: factory.disposeDecorativeRose,
        metadata: {
            role: "content",
            presetKey: "rose",
            editable: true,
            draggable: true,
            selectable: true,
        },
        transform: {
            position: [1.03, 0.36, 0.58],
            rotation: [-Math.PI / 2, 0, 0.3],
            scale: [0.64, 0.64, 0.64],
        },
        strategies: [
            [
                config,
                materials,
                {
                    position: [1.03, 0.36, 0.58],
                    rotation: [-Math.PI / 2, 0, 0.3],
                    scale: [0.64, 0.64, 0.64],
                },
            ],
            [boxConfig, materials],
        ],
    });

    const keychain = createObject({
        key: "keychain",
        creator: factory.createResinKeychain,
        group: groups.contentGroup,
        disposer: factory.disposeResinKeychain,
        metadata: {
            role: "content",
            presetKey: "keychain",
            editable: true,
            draggable: true,
            selectable: true,
        },
        transform: {
            position: [1.0, 0.36, 0.1],
            rotation: [-Math.PI / 2, 0, -0.12],
            scale: [0.52, 0.52, 0.52],
        },
        strategies: [
            [
                config,
                materials,
                {},
                {
                    logoVariant: "claro",
                    labelText: "SIS",
                    labelSubtitle: "KickOff 2026",
                    labelFooter: "UNIFRANZ",
                    style: "bolivia-2026",
                    orientation: "flat",
                    bodyColor: "#f2eee7",
                    position: [1.0, 0.36, 0.1],
                    rotation: [-Math.PI / 2, 0, -0.12],
                    scale: [0.52, 0.52, 0.52],
                },
            ],
            [
                boxConfig,
                materials,
                {
                    logoVariant: "claro",
                    labelText: "SIS",
                    labelSubtitle: "KickOff 2026",
                    bodyColor: "#f2eee7",
                },
            ],
        ],
    });

    const careerLogo = createObject({
        key: "careerLogo",
        creator: factory.createCareerLogoBadge,
        group: groups.contentGroup,
        disposer: factory.disposeCareerLogoBadge,
        metadata: {
            role: "branding",
            presetKey: "academicIdentity",
            editable: true,
            draggable: true,
            selectable: true,
        },
        transform: {
            position: [0.98, 0.69, -1.5],
            rotation: [-Math.PI / 2, 0, 0],
            scale: [0.48, 0.48, 0.48],
        },
        strategies: [
            [
                config,
                materials,
                {},
                {
                    variant: "claro",
                    style: "circular",
                    target: "interior",
                    finish: "glossy",
                    position: [0.98, 0.69, -1.5],
                    rotation: [-Math.PI / 2, 0, 0],
                    scale: [0.48, 0.48, 0.48],
                    showTitle: false,
                    showSubtitle: false,
                    showFooter: false,
                },
            ],
            [
                boxConfig,
                materials,
                {
                    variant: "claro",
                    style: "circular",
                    position: [0.98, 0.69, -1.5],
                    rotation: [-Math.PI / 2, 0, 0],
                    scale: [0.48, 0.48, 0.48],
                    showTitle: false,
                    showSubtitle: false,
                    showFooter: false,
                },
            ],
        ],
    });

    callSafe(factory.setSlotGuidesVisibility, dividers, true);
    callSafe(factory.setSlotLabelsVisibility, dividers, true);
    callSafe(factory.setBottleChannelVisibility, dividers, true);
    callSafe(factory.setQRCardStandVisibility, qrCard, false);
    callSafe(factory.setLidOpenState, lid, true, true);

    if (customImage) {
        customImage.visible = false;
    }

    state.productReady = true;
    state.isLidOpen = true;

    focusInitialCamera();
}

function createObject({
    key,
    creator,
    strategies = [],
    required = false,
    group,
    disposer,
    metadata = {},
    transform = null,
}) {
    if (typeof creator !== "function") {
        integrationAudit.push({
            key,
            status: required ? "missing-required-factory" : "missing-optional-factory",
            ok: false,
        });

        if (required) {
            throw new Error(`No existe factory para crear el objeto obligatorio: ${key}`);
        }

        return null;
    }

    let object = null;
    let usedStrategy = -1;
    let lastError = null;

    for (let index = 0; index < strategies.length; index += 1) {
        try {
            object = creator(...strategies[index]);
            usedStrategy = index;

            if (object) break;
        } catch (error) {
            lastError = error;
            console.warn(`[KickOffBox3D] Falló estrategia ${index + 1} para ${key}:`, error);
        }
    }

    if (!object) {
        integrationAudit.push({
            key,
            status: required ? "not-created-required" : "not-created-optional",
            ok: false,
            error: lastError?.message,
        });

        if (required) {
            throw new Error(`No se pudo crear el objeto obligatorio: ${key}`);
        }

        return null;
    }

    applyObjectTransform(object, transform);

    registerObject(key, object, metadata);

    if (group) {
        group.add(object);
    }

    registerDisposer(object, disposer);

    integrationAudit.push({
        key,
        status: "created",
        ok: true,
        strategy: usedStrategy + 1,
        name: object.name,
        children: object.children?.length ?? 0,
    });

    return object;
}

function registerObject(key, object, metadata = {}) {
    if (!object) return;

    object.userData = {
        ...object.userData,
        registryKey: key,
        presetKey: metadata.presetKey ?? object.userData?.presetKey,
        role: metadata.role ?? object.userData?.role,
        editable: metadata.editable ?? object.userData?.editable ?? false,
        draggable: metadata.draggable ?? object.userData?.draggable ?? metadata.editable ?? false,
        rotatable: metadata.rotatable ?? object.userData?.rotatable ?? metadata.editable ?? false,
        scalable: metadata.scalable ?? object.userData?.scalable ?? metadata.editable ?? false,
        selectable: metadata.selectable ?? object.userData?.selectable ?? metadata.editable ?? false,
        createdByMainIntegrator: true,
    };

    objectRegistry.set(key, object);
}

function registerDisposer(object, disposer) {
    if (!object) return;

    if (typeof disposer === "function") {
        disposers.push(() => callSafe(disposer, object));
        return;
    }

    disposers.push(() => disposeGenericObject(object));
}

function focusInitialCamera() {
    callSafe(moveCameraToView, camera, controls, "product", boxConfig);
}

/* -------------------------------------------------------
   10. PRESETS
------------------------------------------------------- */

function applyPreset(presetId = defaultPreset) {
    const preset = getPreset(presetId);
    const items = preset.items ?? {};

    objectRegistry.forEach((object) => {
        const presetKey = object.userData?.presetKey;

        if (!presetKey || presetKey === "always") {
            object.visible = true;
            return;
        }

        object.visible = resolvePresetVisibility(presetKey, items);
    });

    state.currentPreset = preset.id;

    if (presetSelect && presetSelect.value !== preset.id) {
        presetSelect.value = preset.id;
    }

    updatePresetDependentContent(preset, items);
}

function resolvePresetVisibility(presetKey, items = {}) {
    const defaults = {
        dividers: true,
        paperFiller: true,
        lidInterior: true,
        customImage: false,
        academicIdentity: true,
    };

    if (Object.prototype.hasOwnProperty.call(items, presetKey)) {
        return Boolean(items[presetKey]);
    }

    if (Object.prototype.hasOwnProperty.call(defaults, presetKey)) {
        return Boolean(defaults[presetKey]);
    }

    return true;
}

function updatePresetDependentContent(preset, items) {
    const qrCard = objectRegistry.get("qr");

    if (qrCard && items.qr) {
        callSafe(factory.updateQRCard, qrCard, {
            subtitle: "Escanea para ver el proyecto completo",
            footer: preset.shortLabel,
        });
    }

    const card = objectRegistry.get("card");

    if (card) {
        callSafe(factory.updateCardMessage, card, {
            footer: preset.shortLabel,
            message: items.qr
                ? "Gracias por acompañar esta experiencia académica con contenido digital."
                : "Gracias por acompañar este proyecto académico.",
        });
    }

    const lidInterior = objectRegistry.get("lidInterior");

    if (lidInterior) {
        callSafe(factory.updateLidInteriorDesign, lidInterior, {
            footer: `KickOff Box · ${preset.shortLabel}`,
            message: items.qr
                ? "Este presente integra identidad académica, detalle físico y acceso digital al proyecto."
                : "Este presente fue preparado como reconocimiento académico para la presentación final.",
        });
    }
}

/* -------------------------------------------------------
   11. PANEL
------------------------------------------------------- */

function createInterfaceExtensions() {
    const panel = document.querySelector(".panel");

    if (!panel) return;

    const presetOptions = getPresetOptions();

    if (presetSelect && presetOptions.length) {
        presetSelect.innerHTML = presetOptions
            .map((preset) => `<option value="${preset.id}">${preset.label}</option>`)
            .join("");

        presetSelect.value = state.currentPreset;
    }

    if (document.getElementById("cameraView")) return;

    panel.insertAdjacentHTML(
        "beforeend",
        `
        <div class="control-group">
            <label for="cameraView">Vista de cámara</label>
            <select id="cameraView">
                <option value="default">Principal</option>
                <option value="front">Frontal</option>
                <option value="top">Superior</option>
                <option value="interior">Interior</option>
                <option value="product" selected>Producto</option>
            </select>
        </div>

        <div class="control-group">
            <label for="qualityMode">Calidad visual</label>
            <select id="qualityMode">
                <option value="medium">Media</option>
                <option value="high" selected>Alta</option>
                <option value="ultra">Ultra</option>
            </select>
        </div>

        <div class="control-group">
            <label for="lightingMode">Iluminación</label>
            <select id="lightingMode">
                <option value="studio" selected>Estudio</option>
                <option value="presentation">Presentación</option>
                <option value="soft">Suave</option>
                <option value="dramatic">Dramática</option>
            </select>
        </div>

        <div class="control-group">
            <label for="logoVariant">Logo de carrera</label>
            <select id="logoVariant">
                <option value="claro" selected>Logo claro</option>
                <option value="oscuro">Logo oscuro</option>
            </select>
        </div>

        <div class="control-group">
            <label for="beverageType">Bebida</label>
            <select id="beverageType">
                <option value="cola" selected>Cola 2026</option>
                <option value="water">Agua</option>
                <option value="mineral">Agua mineral</option>
                <option value="orange">Naranja</option>
                <option value="lemon">Lima limón</option>
                <option value="sport">Sport</option>
                <option value="juice">Jugo</option>
                <option value="energy">Energética / lata</option>
            </select>
        </div>

        <div class="control-group">
            <label for="paperStyle">Relleno interno</label>
            <select id="paperStyle">
                <option value="premium" selected>Premium</option>
                <option value="black-gold">Negro dorado</option>
                <option value="tricolor">Tricolor Bolivia</option>
                <option value="kraft">Kraft</option>
                <option value="white">Blanco</option>
                <option value="academic">Académico</option>
            </select>
        </div>

        <div class="control-group">
            <label for="sceneDetail">Modo de escena</label>
            <select id="sceneDetail">
                <option value="presentation" selected>Presentación completa</option>
                <option value="clean">Vista limpia</option>
                <option value="technical">Vista técnica</option>
                <option value="showcase">Showcase</option>
            </select>
        </div>

        <div class="control-group">
            <label>
                <input id="toggleCustomImage" type="checkbox" />
                Mostrar imagen personalizada
            </label>
        </div>

        <div class="control-group">
            <label>
                <input id="toggleLabels" type="checkbox" checked />
                Mostrar etiquetas internas
            </label>
        </div>

        <div class="control-group control-group--buttons">
            <button id="resetView" type="button">Restablecer vista</button>
            <button id="auditScene" type="button">Auditar escena</button>
            <button id="captureView" type="button">Capturar PNG</button>
        </div>
        `,
    );
}

/* -------------------------------------------------------
   12. EVENTOS UI
------------------------------------------------------- */

function setupUIEvents() {
    presetSelect?.addEventListener("change", (event) => {
        applyPreset(event.target.value);
    });

    boxColorInput?.addEventListener("input", (event) => {
        const color = event.target.value;

        premiumContent.visual.exteriorColor = color;
        updateMaterialColor(materials.boxExterior, color);
        callSafe(factory.updateBoxBaseColors, materials, {
            exteriorColor: color,
        });
    });

    interiorColorInput?.addEventListener("input", (event) => {
        const color = event.target.value;

        premiumContent.visual.interiorColor = color;
        updateMaterialColor(materials.boxInterior, color);
        callSafe(factory.updateBoxBaseColors, materials, {
            interiorColor: color,
        });
    });

    toggleLidButton?.addEventListener("click", () => {
        const lid = objectRegistry.get("lid");

        callSafe(factory.toggleLid, lid);
        state.isLidOpen = !state.isLidOpen;
    });

    document.getElementById("cameraView")?.addEventListener("change", (event) => {
        cameraController.moveTo(event.target.value, 0.09);
    });

    document.getElementById("qualityMode")?.addEventListener("change", (event) => {
        state.quality = event.target.value;
        configureRendererQuality(renderer, state.quality);
    });

    document.getElementById("lightingMode")?.addEventListener("change", (event) => {
        state.lightingMode = event.target.value;
        setLightingMode(lightingRig, state.lightingMode);
    });

    document.getElementById("logoVariant")?.addEventListener("change", (event) => {
        const variant = event.target.value;

        state.design.logoVariant = variant;
        premiumContent.product.logoVariant = variant;
        premiumContent.lidInteriorDesign.logoVariant = variant === "oscuro" ? "oscuro" : "claro";

        callSafe(factory.updateCareerLogoVariant, objectRegistry.get("careerLogo"), variant);
        callSafe(factory.setResinLogoVariant, objectRegistry.get("keychain"), variant);
        callSafe(factory.updateLidInteriorDesign, objectRegistry.get("lidInterior"), {
            logoVariant: variant === "oscuro" ? "oscuro" : "claro",
        });
    });

    document.getElementById("beverageType")?.addEventListener("change", (event) => {
        updateBeverageSelection(event.target.value);
    });

    document.getElementById("paperStyle")?.addEventListener("change", (event) => {
        const paperFiller = objectRegistry.get("paperFiller");

        callSafe(factory.setPaperFillerStyle, paperFiller, event.target.value);
    });

    document.getElementById("sceneDetail")?.addEventListener("change", (event) => {
        applySceneDetailMode(event.target.value);
    });

    document.getElementById("toggleCustomImage")?.addEventListener("change", (event) => {
        setObjectVisible("customImage", event.target.checked);
    });

    document.getElementById("toggleLabels")?.addEventListener("change", (event) => {
        const dividers = objectRegistry.get("dividers");
        callSafe(factory.setSlotLabelsVisibility, dividers, event.target.checked);
    });

    document.getElementById("resetView")?.addEventListener("click", () => {
        moveCameraToView(camera, controls, "product", boxConfig);
        resetControls(controls);
    });

    document.getElementById("auditScene")?.addEventListener("click", () => {
        printSceneAudit();
    });

    document.getElementById("captureView")?.addEventListener("click", () => {
        captureScene();
    });

    window.addEventListener("resize", handleResize);
    window.addEventListener("beforeunload", disposeApp);
}

function updateBeverageSelection(beverageType) {
    const soda = objectRegistry.get("soda");

    if (!soda) return;

    state.design.beverageType = beverageType;
    premiumContent.beverage.beverageType = beverageType;
    premiumContent.beverage.type = beverageType;

    const beveragePreset = getBeveragePreset(beverageType);

    callSafe(factory.updateBottleLabel, soda, {
        beverageType,
        type: beverageType,
        ...beveragePreset,
    });

    soda.userData.beverageType = beverageType;
    soda.userData.updatedAt = new Date().toISOString();
}

function getBeveragePreset(beverageType) {
    const presets = {
        cola: {
            labelText: "COLA 2026",
            subLabel: "Refresco académico",
            footerText: "KickOff Box",
        },
        water: {
            labelText: "AGUA",
            subLabel: "Botella personal",
            footerText: "Hidratación",
        },
        mineral: {
            labelText: "MINERAL",
            subLabel: "Agua con gas",
            footerText: "Presentación premium",
        },
        orange: {
            labelText: "NARANJA",
            subLabel: "Refresco cítrico",
            footerText: "Sabor celebración",
        },
        lemon: {
            labelText: "LIMA LIMÓN",
            subLabel: "Refresco claro",
            footerText: "KickOff Box",
        },
        sport: {
            labelText: "SPORT",
            subLabel: "Bebida deportiva",
            footerText: "Energía académica",
        },
        juice: {
            labelText: "JUGO",
            subLabel: "Fruta natural",
            footerText: "Detalle saludable",
        },
        energy: {
            labelText: "ENERGY",
            subLabel: "Bebida energética",
            footerText: "Edición 2026",
        },
    };

    return presets[beverageType] ?? presets.cola;
}

function applySceneDetailMode(mode) {
    state.detailMode = mode;

    const detailMap = {
        presentation: {
            decorations: true,
            paperFiller: true,
            customImage: false,
            slotGuides: true,
            slotLabels: true,
            lidInterior: true,
            fieldDecor: true,
        },
        clean: {
            decorations: false,
            paperFiller: true,
            customImage: false,
            slotGuides: false,
            slotLabels: false,
            lidInterior: true,
            fieldDecor: false,
        },
        technical: {
            decorations: false,
            paperFiller: false,
            customImage: false,
            slotGuides: true,
            slotLabels: true,
            lidInterior: false,
            fieldDecor: false,
        },
        showcase: {
            decorations: true,
            paperFiller: true,
            customImage: true,
            slotGuides: true,
            slotLabels: true,
            lidInterior: true,
            fieldDecor: true,
        },
    };

    const next = detailMap[mode] ?? detailMap.presentation;

    setObjectVisible("decorations", next.decorations);
    setObjectVisible("paperFiller", next.paperFiller);
    setObjectVisible("customImage", next.customImage);
    setObjectVisible("lidInterior", next.lidInterior);

    const dividers = objectRegistry.get("dividers");

    callSafe(factory.setSlotGuidesVisibility, dividers, next.slotGuides);
    callSafe(factory.setSlotLabelsVisibility, dividers, next.slotLabels);
}

function setObjectVisible(key, visible) {
    const object = objectRegistry.get(key);

    if (!object) return;

    object.visible = Boolean(visible);
    object.userData.visible = Boolean(visible);
    object.userData.updatedAt = new Date().toISOString();
}

/* -------------------------------------------------------
   13. SELECCIÓN Y EDICIÓN
------------------------------------------------------- */

function setupPointerEvents() {
    const canvas = renderer.domElement;

    canvas.addEventListener("pointerdown", (event) => {
        const picked = pickEditableObject(event);

        selectObject(picked);

        if (picked?.userData?.draggable || picked?.userData?.editable) {
            state.isDragging = event.shiftKey;

            if (state.isDragging) {
                setInteractionMode(controls, "locked");

                raycaster.ray.intersectPlane(state.dragPlane, dragIntersection);
                state.dragOffset.copy(picked.position).sub(dragIntersection);
            }
        }
    });

    canvas.addEventListener("pointermove", (event) => {
        if (!state.isDragging || !state.selectedObject) return;

        updatePointer(event);
        raycaster.setFromCamera(state.pointer, camera);

        if (raycaster.ray.intersectPlane(state.dragPlane, dragIntersection)) {
            const nextPosition = dragIntersection.clone().add(state.dragOffset);

            nextPosition.y = state.selectedObject.position.y;

            state.selectedObject.position.lerp(nextPosition, 0.35);

            updateSelectionHelper();
        }
    });

    window.addEventListener("pointerup", () => {
        if (!state.isDragging) return;

        state.isDragging = false;
        setInteractionMode(controls, "explore");
    });

    canvas.addEventListener("dblclick", (event) => {
        const picked = pickEditableObject(event);

        if (!picked) return;

        focusControlsOnObject(controls, picked, {
            offsetY: 0.2,
        });
    });
}

function pickEditableObject(event) {
    updatePointer(event);

    raycaster.setFromCamera(state.pointer, camera);

    const candidates = [...objectRegistry.values()].filter((object) => object?.visible);
    const intersections = raycaster.intersectObjects(candidates, true);

    if (!intersections.length) return null;

    return findRegisteredParent(intersections[0].object);
}

function updatePointer(event) {
    const rect = renderer.domElement.getBoundingClientRect();

    state.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    state.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function findRegisteredParent(object) {
    let current = object;

    while (current) {
        if (current.userData?.registryKey && current.userData?.selectable) {
            return current;
        }

        current = current.parent;
    }

    return null;
}

function selectObject(object) {
    state.selectedObject = object;

    if (!selectionHelper) {
        selectionHelper = new THREE.BoxHelper(new THREE.Object3D(), 0xffc65a);
        selectionHelper.name = "SelectionHelper";
        selectionHelper.visible = false;

        groups.helpersGroup.add(selectionHelper);
    }

    if (!object) {
        selectionHelper.visible = false;
        return;
    }

    selectionHelper.setFromObject(object);
    selectionHelper.visible = true;
}

function updateSelectionHelper() {
    if (!selectionHelper || !state.selectedObject) return;

    selectionHelper.setFromObject(state.selectedObject);
}

/* -------------------------------------------------------
   14. ATAJOS
------------------------------------------------------- */

function setupKeyboardShortcuts() {
    window.addEventListener("keydown", (event) => {
        if (!state.selectedObject) return;

        const step = event.shiftKey ? 0.08 : 0.03;
        const rotationStep = event.shiftKey ? 0.12 : 0.05;

        if (event.key === "Escape") {
            selectObject(null);
            return;
        }

        if (!event.altKey) return;

        if (event.key === "ArrowLeft") {
            state.selectedObject.position.x -= step;
        }

        if (event.key === "ArrowRight") {
            state.selectedObject.position.x += step;
        }

        if (event.key === "ArrowUp") {
            state.selectedObject.position.z -= step;
        }

        if (event.key === "ArrowDown") {
            state.selectedObject.position.z += step;
        }

        if (event.key.toLowerCase() === "q") {
            state.selectedObject.rotation.y += rotationStep;
        }

        if (event.key.toLowerCase() === "e") {
            state.selectedObject.rotation.y -= rotationStep;
        }

        if (event.key.toLowerCase() === "z") {
            state.selectedObject.rotation.z += rotationStep;
        }

        if (event.key.toLowerCase() === "x") {
            state.selectedObject.rotation.z -= rotationStep;
        }

        if (event.key === "+" || event.key === "=") {
            scaleSelected(1.04);
        }

        if (event.key === "-" || event.key === "_") {
            scaleSelected(0.96);
        }

        updateSelectionHelper();
    });
}

function scaleSelected(multiplier) {
    if (!state.selectedObject) return;

    const object = state.selectedObject;

    const minScale = object.userData?.minScale ?? 0.25;
    const maxScale = object.userData?.maxScale ?? 1.8;

    const nextScale = THREE.MathUtils.clamp(
        object.scale.x * multiplier,
        minScale,
        maxScale,
    );

    object.scale.setScalar(nextScale);

    if (object.userData.registryKey === "keychain") {
        callSafe(factory.setResinKeychainTransform, object, {
            scale: [nextScale, nextScale, nextScale],
        });
    }

    if (object.userData.registryKey === "soda") {
        callSafe(factory.setSodaBottleTransform, object, {
            scale: [nextScale, nextScale, nextScale],
        });
    }
}

/* -------------------------------------------------------
   15. LOOP
------------------------------------------------------- */

function animate() {
    const deltaTime = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    callSafe(factory.updateLidAnimation, objectRegistry.get("lid"), elapsedTime);

    callSafe(factory.updateInternalDividersAnimation, objectRegistry.get("dividers"), elapsedTime);
    callSafe(factory.updatePaperFillerAnimation, objectRegistry.get("paperFiller"), elapsedTime);
    callSafe(factory.updateLidInteriorAnimation, objectRegistry.get("lidInterior"), elapsedTime);
    callSafe(factory.updateCupcakeAnimation, objectRegistry.get("cupcake"), elapsedTime);
    callSafe(factory.updateSodaBottleAnimation, objectRegistry.get("soda"), elapsedTime);
    callSafe(factory.updateDecorativeRoseAnimation, objectRegistry.get("rose"), elapsedTime);
    callSafe(factory.updateResinKeychainAnimation, objectRegistry.get("keychain"), elapsedTime);
    callSafe(factory.updateCareerLogoBadgeAnimation, objectRegistry.get("careerLogo"), elapsedTime);
    callSafe(factory.updateCustomImagePlaneAnimation, objectRegistry.get("customImage"), elapsedTime);
    callSafe(factory.updateThematicDecorationsAnimation, objectRegistry.get("decorations"), elapsedTime);

    groups.rootGroup.rotation.y =
        Math.sin(elapsedTime * 0.14) *
        (boxConfig.animation?.rotationIntensity ?? 0.035);

    cameraController.update();
    updateControls(controls, deltaTime);
    updateSelectionHelper();

    renderer.render(scene, camera);

    animationFrameId = requestAnimationFrame(animate);
}

/* -------------------------------------------------------
   16. RESPONSIVE, CAPTURA Y LIMPIEZA
------------------------------------------------------- */

function handleResize() {
    updateRendererSize(renderer, camera, canvasContainer);
}

function captureScene() {
    const fileName = `kickoff-box-${state.currentPreset}.png`;

    const result = callSafe(captureRendererImage, renderer, fileName);

    if (result) return result;

    const link = document.createElement("a");
    link.href = renderer.domElement.toDataURL("image/png");
    link.download = fileName;
    link.click();

    return null;
}

function finishLoading() {
    state.isReady = true;

    window.setTimeout(() => {
        loadingElement?.classList.add("is-hidden");
    }, 450);
}

function disposeApp() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    disposers.forEach((dispose) => {
        callSafe(dispose);
    });

    disposeLightingRig(lightingRig);
    disposeControls(controls);
    disposeMaterials(materials);
    disposeRenderer(renderer);
}

/* -------------------------------------------------------
   17. AUDITORÍA
------------------------------------------------------- */

function printIntegrationAudit() {
    const requiredKeys = [
        "boxBase",
        "lid",
        "decorations",
        "paperFiller",
        "dividers",
        "lidInterior",
        "customImage",
        "card",
        "qr",
        "cupcake",
        "soda",
        "rose",
        "keychain",
        "careerLogo",
    ];

    const missing = requiredKeys.filter((key) => !objectRegistry.has(key));

    console.groupCollapsed("[KickOffBox3D] Auditoría de integración");
    console.table(integrationAudit);
    console.log("Objetos registrados:", [...objectRegistry.keys()]);
    console.log("Faltantes:", missing);
    console.groupEnd();

    if (missing.length) {
        console.warn("[KickOffBox3D] Hay objetos no integrados:", missing);
    }
}

function printSceneAudit() {
    const rows = [...objectRegistry.entries()].map(([key, object]) => ({
        key,
        name: object.name,
        visible: object.visible,
        children: object.children?.length ?? 0,
        role: object.userData?.role,
        presetKey: object.userData?.presetKey,
        editable: object.userData?.editable,
        position: object.position.toArray().map((value) => Number(value.toFixed(3))).join(", "),
        scale: object.scale.toArray().map((value) => Number(value.toFixed(3))).join(", "),
    }));

    console.group("[KickOffBox3D] Auditoría de escena");
    console.table(rows);
    console.groupEnd();

    return rows;
}

function getObject(key) {
    return objectRegistry.get(key) ?? null;
}

/* -------------------------------------------------------
   18. API GLOBAL DE DEPURACIÓN
------------------------------------------------------- */

window.KickOffBox3D = {
    scene,
    camera,
    renderer,
    controls,
    groups,
    state,
    objects: objectRegistry,

    modules: {
        DesignTemplates,
        BeverageCatalog,
        AssetLoader,
        TransformControlsCore,
        TextureFactory,
        ExportDesign,
        PriceEstimator,
        DefaultDesignState,
        PricingRules,
        ConfiguratorService,
        BeverageService,
        TemplateService,
        FormState,
        UiEvents,
        Actions,
        Panel,
        CustomizationPanel,
    },

    factories: factory,

    getObject,
    select: (key) => selectObject(getObject(key)),
    show: (key) => setObjectVisible(key, true),
    hide: (key) => setObjectVisible(key, false),

    applyPreset,
    applySceneDetailMode,
    updateBeverageSelection,

    audit: printSceneAudit,
    integrationAudit: () => integrationAudit,
    capture: captureScene,

    moveTo: (view = "product") => {
        cameraController.moveTo(view, 0.09);
    },

    reset: () => {
        moveCameraToView(camera, controls, "product", boxConfig);
        resetControls(controls);
    },
};
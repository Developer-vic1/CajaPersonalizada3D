import * as THREE from "three";

import { boxConfig } from "./config/boxConfig.js";
import {
    defaultPreset,
    getPreset,
    getPresetOptions,
} from "./config/productPresets.js";

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

import {
    createMaterials,
    updateMaterialColor,
    disposeMaterials,
} from "./utils/materials.js";

import {
    createBoxBase,
    updateBoxBaseColors,
    disposeBoxBase,
} from "./objects/BoxBase.js";
import {
    createBoxLid,
    toggleLid,
    updateLidAnimation,
    setLidOpenState,
    disposeBoxLid,
} from "./objects/BoxLid.js";
import {
    createInternalDividers,
    setSlotGuidesVisibility,
    setSlotLabelsVisibility,
    disposeInternalDividers,
} from "./objects/InternalDividers.js";
import {
    createCardMessage,
    updateCardMessage,
    disposeCardMessage,
} from "./objects/CardMessage.js";
import { createCupcake, disposeCupcake } from "./objects/Cupcake.js";
import {
    createSodaBottle,
    animateSodaBottle,
    disposeSodaBottle,
} from "./objects/SodaBottle.js";
import {
    createDecorativeRose,
    animateDecorativeRose,
    disposeDecorativeRose,
} from "./objects/DecorativeRose.js";
import {
    createResinKeychain,
    animateResinKeychain,
    setResinLogoVariant,
    setResinKeychainTransform,
    disposeResinKeychain,
} from "./objects/ResinKeychain.js";
import {
    createQRCard,
    updateQRCard,
    setQRCardStandVisibility,
    disposeQRCard,
} from "./objects/QRCard.js";
import {
    createCareerLogoBadge,
    animateCareerLogoBadge,
    updateCareerLogoVariant,
    disposeCareerLogoBadge,
} from "./objects/CareerLogoBadge.js";
import {
    createThematicDecorations,
    animateThematicDecorations,
    disposeThematicDecorations,
} from "./objects/ThematicDecorations.js";

/* -------------------------------------------------------
   1. REFERENCIAS DEL HTML
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
   2. ESTADO GLOBAL DEL SIMULADOR
------------------------------------------------------- */

const state = {
    ...createSceneState(),

    currentPreset: presetSelect?.value || defaultPreset,

    quality: "high",
    lightingMode: "studio",

    selectedObject: null,
    hoveredObject: null,

    isDragging: false,
    dragPlane: new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.64),
    dragOffset: new THREE.Vector3(),
    pointer: new THREE.Vector2(),
};

const objectRegistry = new Map();
const disposers = [];

const raycaster = new THREE.Raycaster();
const dragIntersection = new THREE.Vector3();
const clock = new THREE.Clock();

let animationFrameId = null;
let selectionHelper = null;

/* -------------------------------------------------------
   3. ESCENA, GRUPOS, CÁMARA Y RENDERIZADOR
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
   4. ARRANQUE PRINCIPAL
------------------------------------------------------- */

createEnvironment();
createProduct();
createInterfaceExtensions();
setupUIEvents();
setupPointerEvents();
setupKeyboardShortcuts();
applyPreset(state.currentPreset);
finishLoading();
animate();

/* -------------------------------------------------------
   5. AMBIENTE 3D
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
    grid.material.transparent = true;
    grid.material.opacity = environment.grid?.opacity ?? 0.18;

    environmentGroup.add(grid);
}

/* -------------------------------------------------------
   6. CREACIÓN COMPLETA DEL PRODUCTO
------------------------------------------------------- */

function createProduct() {
    const boxBase = createBoxBase(boxConfig, materials);

    const lid = createBoxLid(boxConfig, materials);

    const dividers = createInternalDividers(boxConfig, materials);

    const card = createCardMessage(boxConfig, materials, {
        title: "Gracias por ser parte",
        recipient: "Jurado Académico",
        message: "Tu evaluación impulsa este proyecto académico.",
        footer: "KickOff Box 2026",
    });

    const rose = createDecorativeRose(boxConfig, materials);

    const cupcake = createCupcake(boxConfig, materials);

    const soda = createSodaBottle(boxConfig, materials, {
        labelText: "BOL",
        subLabel: "2026",
        liquidColor: "#2f86c7",
    });

    const keychain = createResinKeychain(boxConfig, materials, {
        logoVariant: "claro",
        labelText: "2026",
        labelSubtitle: "KickOff",
        bodyColor: "#f2eee7",
    });

    const qrCard = createQRCard(boxConfig, materials, {
        title: "Contenido digital",
        subtitle: "Escanea para ver el proyecto",
        qrValue: "https://example.com/kickoff-box-2026",
        footer: "KickOff Box 2026",
    });

    const careerLogo = createCareerLogoBadge(boxConfig, materials, {
        variant: "claro",
        style: "circular",
        position: [0.98, 0.665, -1.55],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [0.5, 0.5, 0.5],
        showTitle: false,
        showSubtitle: false,
    });

    const decorations = createThematicDecorations(boxConfig, materials, {
        showLidPlate: false,
        frontText: "KickOff Box",
        lidText: "KickOff Box",
        lidSubtitle: "Mundial 2026 · Tecnología · Presente académico",
    });

    groups.boxGroup.add(boxBase);
    groups.boxGroup.add(lid);
    groups.boxGroup.add(decorations);

    groups.contentGroup.add(dividers);
    groups.contentGroup.add(card);
    groups.contentGroup.add(rose);
    groups.contentGroup.add(cupcake);
    groups.contentGroup.add(soda);
    groups.contentGroup.add(keychain);
    groups.contentGroup.add(qrCard);
    groups.contentGroup.add(careerLogo);

    registerObject("boxBase", boxBase, {
        role: "structure",
        presetKey: "always",
        editable: false,
    });

    registerObject("lid", lid, {
        role: "structure",
        presetKey: "always",
        editable: false,
    });

    registerObject("decorations", decorations, {
        role: "decoration",
        presetKey: "always",
        editable: false,
    });

    registerObject("dividers", dividers, {
        role: "layout",
        presetKey: "dividers",
        editable: false,
    });

    registerObject("card", card, {
        role: "content",
        presetKey: "card",
        editable: true,
    });

    registerObject("rose", rose, {
        role: "content",
        presetKey: "rose",
        editable: true,
    });

    registerObject("cupcake", cupcake, {
        role: "content",
        presetKey: "cupcake",
        editable: true,
    });

    registerObject("soda", soda, {
        role: "content",
        presetKey: "soda",
        editable: true,
    });

    registerObject("keychain", keychain, {
        role: "content",
        presetKey: "keychain",
        editable: true,
    });

    registerObject("qr", qrCard, {
        role: "content",
        presetKey: "qr",
        editable: true,
    });

    registerObject("careerLogo", careerLogo, {
        role: "content",
        presetKey: "academicIdentity",
        editable: true,
    });

    disposers.push(
        () => disposeBoxBase(boxBase),
        () => disposeBoxLid(lid),
        () => disposeInternalDividers(dividers),
        () => disposeCardMessage(card),
        () => disposeDecorativeRose(rose),
        () => disposeCupcake(cupcake),
        () => disposeSodaBottle(soda),
        () => disposeResinKeychain(keychain),
        () => disposeQRCard(qrCard),
        () => disposeCareerLogoBadge(careerLogo),
        () => disposeThematicDecorations(decorations),
    );

    setSlotGuidesVisibility(dividers, true);
    setSlotLabelsVisibility(dividers, true);
    setQRCardStandVisibility(qrCard, false);
    setLidOpenState(lid, true, true);
}

function registerObject(key, object, metadata = {}) {
    if (!object) return;

    object.userData = {
        ...object.userData,
        registryKey: key,
        presetKey: metadata.presetKey ?? object.userData?.presetKey,
        role: metadata.role ?? object.userData?.role,
        editable: metadata.editable ?? object.userData?.editable ?? false,
    };

    objectRegistry.set(key, object);
}

/* -------------------------------------------------------
   7. PRESETS DEL PRODUCTO
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

        object.visible = Boolean(items[presetKey]);
    });

    state.currentPreset = preset.id;

    if (presetSelect && presetSelect.value !== preset.id) {
        presetSelect.value = preset.id;
    }

    const qrCard = objectRegistry.get("qr");

    if (qrCard && items.qr) {
        updateQRCard(qrCard, {
            subtitle: "Escanea para ver el proyecto completo",
            footer: preset.shortLabel,
        });
    }

    const card = objectRegistry.get("card");

    if (card) {
        updateCardMessage(card, {
            footer: preset.shortLabel,
            message: items.qr
                ? "Gracias por acompañar esta experiencia académica con contenido digital."
                : "Gracias por acompañar este proyecto académico.",
        });
    }
}

/* -------------------------------------------------------
   8. EXTENSIONES DEL PANEL HTML
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
                <option value="product">Producto</option>
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

        <div class="control-group control-group--buttons">
            <button id="resetView" type="button">Restablecer vista</button>
            <button id="captureView" type="button">Capturar PNG</button>
        </div>
        `,
    );
}

/* -------------------------------------------------------
   9. EVENTOS DE INTERFAZ
------------------------------------------------------- */

function setupUIEvents() {
    presetSelect?.addEventListener("change", (event) => {
        applyPreset(event.target.value);
    });

    boxColorInput?.addEventListener("input", (event) => {
        const color = event.target.value;

        updateMaterialColor(materials.boxExterior, color);
        updateBoxBaseColors(materials, {
            exteriorColor: color,
        });
    });

    interiorColorInput?.addEventListener("input", (event) => {
        const color = event.target.value;

        updateMaterialColor(materials.boxInterior, color);
        updateBoxBaseColors(materials, {
            interiorColor: color,
        });
    });

    toggleLidButton?.addEventListener("click", () => {
        toggleLid(objectRegistry.get("lid"));
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

        updateCareerLogoVariant(objectRegistry.get("careerLogo"), variant);
        setResinLogoVariant(objectRegistry.get("keychain"), variant);
    });

    document.getElementById("resetView")?.addEventListener("click", () => {
        moveCameraToView(camera, controls, "default", boxConfig);
        resetControls(controls);
    });

    document.getElementById("captureView")?.addEventListener("click", () => {
        captureRendererImage(renderer, `kickoff-box-${state.currentPreset}.png`);
    });

    window.addEventListener("resize", handleResize);
    window.addEventListener("beforeunload", disposeApp);
}

/* -------------------------------------------------------
   10. SELECCIÓN, RAYCASTING Y MOVIMIENTO
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

    const candidates = [...objectRegistry.values()].filter((object) => object.visible);

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
        if (current.userData?.registryKey && current.userData?.editable) {
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
   11. ATAJOS DE TECLADO PARA EDICIÓN
------------------------------------------------------- */

function setupKeyboardShortcuts() {
    window.addEventListener("keydown", (event) => {
        if (!state.selectedObject) return;

        const step = event.shiftKey ? 0.08 : 0.03;
        const rotationStep = event.shiftKey ? 0.12 : 0.05;

        if (event.key === "Delete" || event.key === "Escape") {
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
        setResinKeychainTransform(object, {
            scale: [nextScale, nextScale, nextScale],
        });
    }
}

/* -------------------------------------------------------
   12. LOOP DE ANIMACIÓN
------------------------------------------------------- */

function animate() {
    const deltaTime = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    updateLidAnimation(objectRegistry.get("lid"));

    animateDecorativeRose(objectRegistry.get("rose"), elapsedTime);
    animateSodaBottle(objectRegistry.get("soda"), elapsedTime);
    animateResinKeychain(objectRegistry.get("keychain"), elapsedTime);
    animateCareerLogoBadge(objectRegistry.get("careerLogo"), elapsedTime);
    animateThematicDecorations(objectRegistry.get("decorations"), elapsedTime);

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
   13. RESPONSIVE
------------------------------------------------------- */

function handleResize() {
    updateRendererSize(renderer, camera, canvasContainer);
}

/* -------------------------------------------------------
   14. CARGA Y LIMPIEZA
------------------------------------------------------- */

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

    disposers.forEach((dispose) => dispose());

    disposeLightingRig(lightingRig);
    disposeControls(controls);
    disposeMaterials(materials);
    disposeRenderer(renderer);
}

/* -------------------------------------------------------
   15. API DE DEPURACIÓN EN CONSOLA
------------------------------------------------------- */

window.KickOffBox3D = {
    scene,
    camera,
    renderer,
    controls,
    groups,
    state,
    objects: objectRegistry,

    applyPreset,

    capture: () => captureRendererImage(
        renderer,
        `kickoff-box-${state.currentPreset}.png`,
    ),
};
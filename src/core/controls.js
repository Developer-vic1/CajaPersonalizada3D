import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { toVector3 } from "../utils/dimensions.js";
import { createCameraViews } from "./camera.js";

const DEFAULT_CONTROL_SETTINGS = {
    enableDamping: true,
    dampingFactor: 0.065,
    enablePan: true,
    enableZoom: true,
    enableRotate: true,
    rotateSpeed: 0.72,
    zoomSpeed: 0.82,
    panSpeed: 0.58,
    keyPanSpeed: 9,
    autoRotate: false,
    autoRotateSpeed: 0.65,
    screenSpacePanning: true,
};

export function createControls(camera, renderer, config) {
    if (!camera || !renderer?.domElement) {
        throw new Error("No se pudo crear OrbitControls: cámara o renderer inválido.");
    }

    const cameraConfig = config?.camera ?? {};
    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enabled = true;
    controls.enableDamping = DEFAULT_CONTROL_SETTINGS.enableDamping;
    controls.dampingFactor = DEFAULT_CONTROL_SETTINGS.dampingFactor;
    controls.enablePan = DEFAULT_CONTROL_SETTINGS.enablePan;
    controls.enableZoom = DEFAULT_CONTROL_SETTINGS.enableZoom;
    controls.enableRotate = DEFAULT_CONTROL_SETTINGS.enableRotate;

    controls.rotateSpeed = DEFAULT_CONTROL_SETTINGS.rotateSpeed;
    controls.zoomSpeed = DEFAULT_CONTROL_SETTINGS.zoomSpeed;
    controls.panSpeed = DEFAULT_CONTROL_SETTINGS.panSpeed;
    controls.keyPanSpeed = DEFAULT_CONTROL_SETTINGS.keyPanSpeed;

    controls.autoRotate = DEFAULT_CONTROL_SETTINGS.autoRotate;
    controls.autoRotateSpeed = DEFAULT_CONTROL_SETTINGS.autoRotateSpeed;
    controls.screenSpacePanning = DEFAULT_CONTROL_SETTINGS.screenSpacePanning;

    controls.minDistance = cameraConfig.minDistance ?? 5;
    controls.maxDistance = cameraConfig.maxDistance ?? 18;
    controls.minPolarAngle = cameraConfig.minPolarAngle ?? Math.PI / 8;
    controls.maxPolarAngle = cameraConfig.maxPolarAngle ?? Math.PI / 2.05;

    controls.minAzimuthAngle = cameraConfig.minAzimuthAngle ?? -Infinity;
    controls.maxAzimuthAngle = cameraConfig.maxAzimuthAngle ?? Infinity;

    controls.target.copy(toVector3(cameraConfig.target, [0, 0.7, 0]));
    controls.saveState();
    controls.update();

    setDefaultInputMapping(controls);
    enableKeyboardControls(controls);

    return controls;
}

export function setDefaultInputMapping(controls) {
    if (!controls) return;

    controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
    };

    controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
    };
}

export function enableKeyboardControls(controls) {
    if (!controls) return;

    controls.listenToKeyEvents(window);

    controls.keys = {
        LEFT: "ArrowLeft",
        UP: "ArrowUp",
        RIGHT: "ArrowRight",
        BOTTOM: "ArrowDown",
    };
}

export function updateControls(controls, deltaTime) {
    if (!controls) return;

    if (typeof deltaTime === "number") {
        controls.update(deltaTime);
        return;
    }

    controls.update();
}

export function resetControls(controls) {
    if (!controls) return;

    controls.reset();
    controls.update();
}

export function setControlsEnabled(controls, enabled = true) {
    if (!controls) return;

    controls.enabled = Boolean(enabled);
}

export function setAutoRotate(controls, enabled = true, speed = 0.65) {
    if (!controls) return;

    controls.autoRotate = Boolean(enabled);
    controls.autoRotateSpeed = speed;
}

export function setControlsTarget(controls, target = [0, 0.7, 0]) {
    if (!controls) return;

    controls.target.copy(toVector3(target));
    controls.update();
}

export function setControlsLimits(controls, limits = {}) {
    if (!controls) return;

    if (limits.minDistance !== undefined) controls.minDistance = limits.minDistance;
    if (limits.maxDistance !== undefined) controls.maxDistance = limits.maxDistance;
    if (limits.minPolarAngle !== undefined) controls.minPolarAngle = limits.minPolarAngle;
    if (limits.maxPolarAngle !== undefined) controls.maxPolarAngle = limits.maxPolarAngle;
    if (limits.minAzimuthAngle !== undefined) controls.minAzimuthAngle = limits.minAzimuthAngle;
    if (limits.maxAzimuthAngle !== undefined) controls.maxAzimuthAngle = limits.maxAzimuthAngle;

    controls.update();
}

export function setInteractionMode(controls, mode = "explore") {
    if (!controls) return;

    const modes = {
        explore: {
            enableRotate: true,
            enableZoom: true,
            enablePan: true,
            rotateSpeed: 0.72,
            zoomSpeed: 0.82,
            panSpeed: 0.58,
            autoRotate: false,
        },

        presentation: {
            enableRotate: true,
            enableZoom: true,
            enablePan: false,
            rotateSpeed: 0.55,
            zoomSpeed: 0.65,
            panSpeed: 0,
            autoRotate: true,
        },

        detail: {
            enableRotate: true,
            enableZoom: true,
            enablePan: true,
            rotateSpeed: 0.42,
            zoomSpeed: 0.48,
            panSpeed: 0.42,
            autoRotate: false,
        },

        locked: {
            enableRotate: false,
            enableZoom: false,
            enablePan: false,
            rotateSpeed: 0,
            zoomSpeed: 0,
            panSpeed: 0,
            autoRotate: false,
        },
    };

    const selectedMode = modes[mode] ?? modes.explore;

    controls.enableRotate = selectedMode.enableRotate;
    controls.enableZoom = selectedMode.enableZoom;
    controls.enablePan = selectedMode.enablePan;
    controls.rotateSpeed = selectedMode.rotateSpeed;
    controls.zoomSpeed = selectedMode.zoomSpeed;
    controls.panSpeed = selectedMode.panSpeed;
    controls.autoRotate = selectedMode.autoRotate;

    controls.update();
}

export function focusControlsOnObject(controls, object, options = {}) {
    if (!controls || !object) return null;

    const bounds = new THREE.Box3().setFromObject(object);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();

    bounds.getCenter(center);
    bounds.getSize(size);

    const offsetY = options.offsetY ?? 0.15;
    const focusTarget = center.clone();
    focusTarget.y += offsetY;

    controls.target.copy(focusTarget);
    controls.update();

    return {
        center,
        size,
        target: focusTarget,
    };
}

export function moveCameraToView(camera, controls, viewName, config) {
    if (!camera || !controls) return;

    const views = createCameraViews(config);
    const view = views[viewName] ?? views.default;

    camera.position.copy(toVector3(view.position));
    controls.target.copy(toVector3(view.target));
    camera.lookAt(controls.target);
    controls.update();
}

export function createSmoothCameraController(camera, controls, config) {
    const controller = {
        isMoving: false,
        targetPosition: new THREE.Vector3(),
        targetLookAt: new THREE.Vector3(),
        speed: 0.08,

        moveTo(viewName, customSpeed) {
            const views = createCameraViews(config);
            const view = views[viewName] ?? views.default;

            this.targetPosition.copy(toVector3(view.position));
            this.targetLookAt.copy(toVector3(view.target));
            this.speed = customSpeed ?? 0.08;
            this.isMoving = true;
        },

        moveToCustom(position, target, customSpeed) {
            this.targetPosition.copy(toVector3(position));
            this.targetLookAt.copy(toVector3(target));
            this.speed = customSpeed ?? 0.08;
            this.isMoving = true;
        },

        update() {
            if (!this.isMoving || !camera || !controls) return;

            camera.position.lerp(this.targetPosition, this.speed);
            controls.target.lerp(this.targetLookAt, this.speed);

            const positionDistance = camera.position.distanceTo(this.targetPosition);
            const targetDistance = controls.target.distanceTo(this.targetLookAt);

            if (positionDistance < 0.015 && targetDistance < 0.015) {
                camera.position.copy(this.targetPosition);
                controls.target.copy(this.targetLookAt);
                this.isMoving = false;
            }

            camera.lookAt(controls.target);
            controls.update();
        },
    };

    return controller;
}

export function getControlsSnapshot(camera, controls) {
    if (!camera || !controls) return null;

    return {
        cameraPosition: camera.position.toArray(),
        target: controls.target.toArray(),
        distance: controls.getDistance(),
        polarAngle: controls.getPolarAngle(),
        azimuthalAngle: controls.getAzimuthalAngle(),
        zoom: camera.zoom,
    };
}

export function applyControlsSnapshot(camera, controls, snapshot) {
    if (!camera || !controls || !snapshot) return;

    camera.position.copy(toVector3(snapshot.cameraPosition));
    controls.target.copy(toVector3(snapshot.target));
    camera.zoom = snapshot.zoom ?? camera.zoom;
    camera.updateProjectionMatrix();
    controls.update();
}

export function disposeControls(controls) {
    if (!controls) return;

    controls.stopListenToKeyEvents?.();
    controls.dispose();
}
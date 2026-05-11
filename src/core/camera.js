import * as THREE from "three";
import { toVector3 } from "../utils/dimensions.js";

export function createCamera(config, container) {
    const cameraConfig = config?.camera ?? {};

    const width = container?.clientWidth || window.innerWidth;
    const height = container?.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(
        cameraConfig.fov ?? 45,
        width / height,
        cameraConfig.near ?? 0.1,
        cameraConfig.far ?? 100,
    );

    camera.name = "KickOffBoxCamera";
    camera.position.copy(toVector3(cameraConfig.position, [7, 6, 8]));
    camera.lookAt(toVector3(cameraConfig.target, [0, 0.7, 0]));
    camera.updateProjectionMatrix();

    return camera;
}

export function updateCameraAspect(camera, container) {
    if (!camera || !container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

export function setCameraView(camera, viewName, config) {
    if (!camera) return;

    const views = createCameraViews(config);
    const selectedView = views[viewName] ?? views.default;

    camera.position.copy(toVector3(selectedView.position));
    camera.lookAt(toVector3(selectedView.target));
    camera.updateProjectionMatrix();
}

export function createCameraViews(config) {
    const target = config?.camera?.target ?? [0, 0.7, 0];

    return {
        default: {
            label: "Vista principal",
            position: config?.camera?.position ?? [7, 6, 8],
            target,
        },

        front: {
            label: "Vista frontal",
            position: [0, 3.5, 10],
            target,
        },

        top: {
            label: "Vista superior",
            position: [0, 10, 0.01],
            target: [0, 0, 0],
        },

        interior: {
            label: "Vista interior",
            position: [0, 4.5, 5.8],
            target: [0, 0.8, 0],
        },

        product: {
            label: "Vista de producto",
            position: [6.2, 4.2, 6.8],
            target: [0, 0.85, 0],
        },
    };
}

export function frameObject(camera, object, offset = 1.55) {
    if (!camera || !object) return;

    const bounds = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    const maxDimension = Math.max(size.x, size.y, size.z);
    const fov = THREE.MathUtils.degToRad(camera.fov);
    const distance = (maxDimension / (2 * Math.tan(fov / 2))) * offset;

    const direction = new THREE.Vector3()
        .subVectors(camera.position, center)
        .normalize();

    camera.position.copy(center).add(direction.multiplyScalar(distance));
    camera.lookAt(center);
    camera.updateProjectionMatrix();
}

export function smoothMoveCamera(camera, targetPosition, targetLookAt, alpha = 0.08) {
    if (!camera) return;

    const nextPosition = toVector3(targetPosition, [7, 6, 8]);
    const nextTarget = toVector3(targetLookAt, [0, 0.7, 0]);

    camera.position.lerp(nextPosition, alpha);
    camera.lookAt(nextTarget);
    camera.updateProjectionMatrix();
}
import * as THREE from "three";
import { toVector3 } from "../utils/dimensions.js";

function applyPosition(object, position = [0, 0, 0]) {
    object.position.copy(toVector3(position));
    return object;
}

function configureShadow(light, options = {}) {
    if (!light?.shadow) return light;

    light.castShadow = options.castShadow ?? true;
    light.shadow.mapSize.width = options.mapSize ?? 2048;
    light.shadow.mapSize.height = options.mapSize ?? 2048;
    light.shadow.bias = options.bias ?? -0.00018;
    light.shadow.normalBias = options.normalBias ?? 0.025;
    light.shadow.radius = options.radius ?? 4;

    if (light.shadow.camera) {
        light.shadow.camera.near = options.near ?? 0.5;
        light.shadow.camera.far = options.far ?? 35;
        light.shadow.camera.left = options.left ?? -10;
        light.shadow.camera.right = options.right ?? 10;
        light.shadow.camera.top = options.top ?? 10;
        light.shadow.camera.bottom = options.bottom ?? -10;
        light.shadow.camera.updateProjectionMatrix();
    }

    return light;
}

function createTarget(name, position = [0, 0.7, 0]) {
    const target = new THREE.Object3D();
    target.name = name;
    target.position.copy(toVector3(position));
    return target;
}

export function createLightingRig(config, scene) {
    const group = new THREE.Group();
    group.name = "LightingRig";

    const lightConfig = config?.lights ?? {};
    const target = createTarget("LightingTarget", [0, 0.75, 0]);
    group.add(target);

    const hemisphere = new THREE.HemisphereLight(
        lightConfig.hemisphere?.skyColor ?? "#fff4df",
        lightConfig.hemisphere?.groundColor ?? "#2b1a10",
        lightConfig.hemisphere?.intensity ?? 1.25,
    );
    hemisphere.name = "SoftAmbientHemisphere";
    group.add(hemisphere);

    const ambient = new THREE.AmbientLight(
        lightConfig.ambient?.color ?? "#fff4df",
        lightConfig.ambient?.intensity ?? 0.55,
    );
    ambient.name = "WarmAmbientLight";
    group.add(ambient);

    const main = new THREE.DirectionalLight(
        lightConfig.main?.color ?? "#fff4dc",
        lightConfig.main?.intensity ?? 3.6,
    );
    main.name = "MainProductLight";
    applyPosition(main, lightConfig.main?.position ?? [6, 8, 5]);
    main.target = target;
    configureShadow(main, {
        mapSize: 4096,
        bias: -0.00016,
        normalBias: 0.028,
        radius: 5,
        near: 0.5,
        far: 38,
        left: -9,
        right: 9,
        top: 9,
        bottom: -9,
    });
    group.add(main);

    const fill = new THREE.DirectionalLight(
        lightConfig.fill?.color ?? "#d8ecff",
        lightConfig.fill?.intensity ?? 1.15,
    );
    fill.name = "CoolFillLight";
    applyPosition(fill, lightConfig.fill?.position ?? [-5, 4, -4]);
    fill.target = target;
    group.add(fill);

    const rim = new THREE.DirectionalLight("#ffe1b8", 1.35);
    rim.name = "WarmRimLight";
    applyPosition(rim, [0, 4.2, -6]);
    rim.target = target;
    group.add(rim);

    const warmPoint = new THREE.PointLight(
        lightConfig.warmPoint?.color ?? "#ffc37a",
        lightConfig.warmPoint?.intensity ?? 1.35,
        lightConfig.warmPoint?.distance ?? 18,
        1.6,
    );
    warmPoint.name = "WarmInteriorGlow";
    applyPosition(warmPoint, lightConfig.warmPoint?.position ?? [0, 3.2, -2.6]);
    warmPoint.castShadow = false;
    group.add(warmPoint);

    const interiorSpot = new THREE.SpotLight("#fff1d0", 1.9, 12, Math.PI / 5.5, 0.45, 1.3);
    interiorSpot.name = "InteriorProductSpot";
    applyPosition(interiorSpot, [0, 5.2, 3.4]);
    interiorSpot.target = target;
    interiorSpot.castShadow = true;
    interiorSpot.shadow.mapSize.width = 2048;
    interiorSpot.shadow.mapSize.height = 2048;
    interiorSpot.shadow.bias = -0.0002;
    interiorSpot.shadow.normalBias = 0.02;
    group.add(interiorSpot);

    const softboxLeft = new THREE.RectAreaLight("#fff0d2", 1.8, 5.2, 3.4);
    softboxLeft.name = "LeftSoftbox";
    applyPosition(softboxLeft, [-4.8, 3.4, 2.4]);
    softboxLeft.lookAt(0, 0.8, 0);
    group.add(softboxLeft);

    const softboxRight = new THREE.RectAreaLight("#dfefff", 1.15, 4.4, 3.2);
    softboxRight.name = "RightCoolSoftbox";
    applyPosition(softboxRight, [4.8, 2.7, -2.8]);
    softboxRight.lookAt(0, 0.75, 0);
    group.add(softboxRight);

    if (scene) {
        scene.add(group);
    }

    return {
        group,
        target,
        hemisphere,
        ambient,
        main,
        fill,
        rim,
        warmPoint,
        interiorSpot,
        softboxLeft,
        softboxRight,
    };
}

export function updateLightingTarget(lightingRig, position = [0, 0.75, 0]) {
    if (!lightingRig?.target) return;

    lightingRig.target.position.copy(toVector3(position));
}

export function setLightingMode(lightingRig, mode = "studio") {
    if (!lightingRig) return;

    const modes = {
        studio: {
            hemisphere: 1.25,
            ambient: 0.55,
            main: 3.6,
            fill: 1.15,
            rim: 1.35,
            warmPoint: 1.35,
            interiorSpot: 1.9,
            softboxLeft: 1.8,
            softboxRight: 1.15,
        },
        presentation: {
            hemisphere: 1.45,
            ambient: 0.65,
            main: 4.2,
            fill: 1.25,
            rim: 1.55,
            warmPoint: 1.55,
            interiorSpot: 2.25,
            softboxLeft: 2.1,
            softboxRight: 1.25,
        },
        soft: {
            hemisphere: 1.55,
            ambient: 0.75,
            main: 2.6,
            fill: 1.05,
            rim: 0.9,
            warmPoint: 1.15,
            interiorSpot: 1.35,
            softboxLeft: 1.45,
            softboxRight: 0.95,
        },
        dramatic: {
            hemisphere: 0.85,
            ambient: 0.25,
            main: 4.8,
            fill: 0.55,
            rim: 2.2,
            warmPoint: 1.7,
            interiorSpot: 2.7,
            softboxLeft: 2.35,
            softboxRight: 0.75,
        },
    };

    const selectedMode = modes[mode] ?? modes.studio;

    lightingRig.hemisphere.intensity = selectedMode.hemisphere;
    lightingRig.ambient.intensity = selectedMode.ambient;
    lightingRig.main.intensity = selectedMode.main;
    lightingRig.fill.intensity = selectedMode.fill;
    lightingRig.rim.intensity = selectedMode.rim;
    lightingRig.warmPoint.intensity = selectedMode.warmPoint;
    lightingRig.interiorSpot.intensity = selectedMode.interiorSpot;
    lightingRig.softboxLeft.intensity = selectedMode.softboxLeft;
    lightingRig.softboxRight.intensity = selectedMode.softboxRight;
}

export function createLightHelpers(lightingRig) {
    if (!lightingRig) return new THREE.Group();

    const helpers = new THREE.Group();
    helpers.name = "LightHelpers";

    if (lightingRig.main) {
        helpers.add(new THREE.DirectionalLightHelper(lightingRig.main, 0.7));
        helpers.add(new THREE.CameraHelper(lightingRig.main.shadow.camera));
    }

    if (lightingRig.interiorSpot) {
        helpers.add(new THREE.SpotLightHelper(lightingRig.interiorSpot));
    }

    if (lightingRig.warmPoint) {
        helpers.add(new THREE.PointLightHelper(lightingRig.warmPoint, 0.25));
    }

    helpers.visible = false;

    return helpers;
}

export function toggleLightHelpers(helpers, visible) {
    if (!helpers) return;

    helpers.visible = Boolean(visible);
}

export function disposeLightingRig(lightingRig) {
    if (!lightingRig?.group) return;

    lightingRig.group.traverse((object) => {
        if (object.dispose) object.dispose();
    });

    lightingRig.group.removeFromParent();
}
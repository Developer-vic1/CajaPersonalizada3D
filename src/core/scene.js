import * as THREE from "three";

export function createScene(config) {
    const scene = new THREE.Scene();

    const environment = config?.environment ?? {};
    const backgroundColor =
        environment.backgroundColor ?? config?.colors?.background ?? "#110d0a";

    scene.name = "KickOffBoxScene";
    scene.background = new THREE.Color(backgroundColor);

    if (environment.fog?.enabled) {
        scene.fog = new THREE.Fog(
            environment.fog.color ?? backgroundColor,
            environment.fog.near ?? 15,
            environment.fog.far ?? 34,
        );
    }

    return scene;
}

export function createMainGroups() {
    const rootGroup = new THREE.Group();
    const boxGroup = new THREE.Group();
    const contentGroup = new THREE.Group();
    const environmentGroup = new THREE.Group();
    const helpersGroup = new THREE.Group();

    rootGroup.name = "KickOffBoxRoot";
    boxGroup.name = "BoxStructure";
    contentGroup.name = "BoxContent";
    environmentGroup.name = "Environment";
    helpersGroup.name = "Helpers";

    rootGroup.add(boxGroup);
    rootGroup.add(contentGroup);
    rootGroup.add(environmentGroup);
    rootGroup.add(helpersGroup);

    return {
        rootGroup,
        boxGroup,
        contentGroup,
        environmentGroup,
        helpersGroup,
    };
}

export function addMainGroupsToScene(scene, groups) {
    if (!scene || !groups?.rootGroup) {
        throw new Error("No se pudo agregar el grupo principal a la escena.");
    }

    scene.add(groups.rootGroup);

    return scene;
}

export function createSceneState() {
    return {
        isReady: false,
        isLidOpen: true,
        currentPreset: "estandar",
        selectedObject: null,
        hoveredObject: null,
    };
}

export function setSceneBackground(scene, color) {
    if (!scene) return;

    scene.background = new THREE.Color(color);

    if (scene.fog) {
        scene.fog.color = new THREE.Color(color);
    }
}

export function setSceneFog(scene, fogConfig = {}) {
    if (!scene) return;

    if (!fogConfig.enabled) {
        scene.fog = null;
        return;
    }

    scene.fog = new THREE.Fog(
        fogConfig.color ?? "#110d0a",
        fogConfig.near ?? 15,
        fogConfig.far ?? 34,
    );
}

export function clearSceneGroup(group) {
    if (!group) return;

    while (group.children.length > 0) {
        const child = group.children[0];

        group.remove(child);

        child.traverse?.((object) => {
            if (object.geometry) object.geometry.dispose();

            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach((material) => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }
}
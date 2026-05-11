import * as THREE from "three";

export function toVector3(values, fallback = [0, 0, 0]) {
    const source = Array.isArray(values) ? values : fallback;

    return new THREE.Vector3(
        source[0] ?? fallback[0],
        source[1] ?? fallback[1],
        source[2] ?? fallback[2],
    );
}

export function toEuler(values, fallback = [0, 0, 0]) {
    const source = Array.isArray(values) ? values : fallback;

    return new THREE.Euler(
        source[0] ?? fallback[0],
        source[1] ?? fallback[1],
        source[2] ?? fallback[2],
    );
}

export function applyTransform(object, transform = {}) {
    if (!object) return object;

    if (transform.position) {
        object.position.copy(toVector3(transform.position));
    }

    if (transform.rotation) {
        object.rotation.copy(toEuler(transform.rotation));
    }

    if (transform.scale) {
        object.scale.copy(toVector3(transform.scale, [1, 1, 1]));
    }

    return object;
}

export function getBoxDimensions(config) {
    const dimensions = config?.dimensions ?? {};

    return {
        width: dimensions.width ?? 7.4,
        depth: dimensions.depth ?? 5,
        height: dimensions.height ?? 1.3,
        wallThickness: dimensions.wallThickness ?? 0.14,
        floorHeight: dimensions.floorHeight ?? 0.22,
        borderRadius: dimensions.borderRadius ?? 0.22,
    };
}

export function getLidDimensions(config) {
    const box = getBoxDimensions(config);
    const lid = config?.lid ?? {};

    return {
        width: box.width + (lid.margin ?? 0.28),
        depth: box.depth + (lid.margin ?? 0.28),
        thickness: lid.thickness ?? 0.2,
        interiorThickness: lid.interiorThickness ?? 0.04,
        margin: lid.margin ?? 0.28,
    };
}

export function getInnerBoxDimensions(config) {
    const box = getBoxDimensions(config);

    return {
        width: box.width - box.wallThickness * 2,
        depth: box.depth - box.wallThickness * 2,
        height: box.height,
    };
}

export function getBoxEdges(config) {
    const box = getBoxDimensions(config);

    return {
        left: -box.width / 2,
        right: box.width / 2,
        front: box.depth / 2,
        back: -box.depth / 2,
        bottom: 0,
        floorTop: box.floorHeight,
        top: box.height + box.floorHeight,
    };
}

export function getWallPositions(config) {
    const box = getBoxDimensions(config);
    const edges = getBoxEdges(config);

    const wallY = box.height / 2 + box.floorHeight;

    return {
        frontWall: {
            size: [box.width, box.height, box.wallThickness],
            position: [0, wallY, edges.front],
        },
        backWall: {
            size: [box.width, box.height, box.wallThickness],
            position: [0, wallY, edges.back],
        },
        leftWall: {
            size: [box.wallThickness, box.height, box.depth],
            position: [edges.left, wallY, 0],
        },
        rightWall: {
            size: [box.wallThickness, box.height, box.depth],
            position: [edges.right, wallY, 0],
        },
    };
}

export function getInteriorWallPositions(config) {
    const box = getBoxDimensions(config);
    const edges = getBoxEdges(config);

    const wallY = box.height / 2 + box.floorHeight + 0.01;
    const interiorHeight = box.height * 0.86;
    const inset = 0.09;

    return {
        frontInterior: {
            size: [box.width - 0.25, interiorHeight, 0.045],
            position: [0, wallY, edges.front - inset],
        },
        backInterior: {
            size: [box.width - 0.25, interiorHeight, 0.045],
            position: [0, wallY, edges.back + inset],
        },
        leftInterior: {
            size: [0.045, interiorHeight, box.depth - 0.25],
            position: [edges.left + inset, wallY, 0],
        },
        rightInterior: {
            size: [0.045, interiorHeight, box.depth - 0.25],
            position: [edges.right - inset, wallY, 0],
        },
    };
}

export function getLidPivotPosition(config) {
    const box = getBoxDimensions(config);
    const edges = getBoxEdges(config);

    return [0, box.height + box.floorHeight + 0.13, edges.back - 0.05];
}

export function getLidMeshPosition(config) {
    const lid = getLidDimensions(config);

    return [0, 0, lid.depth / 2];
}

export function getObjectBounds(object) {
    const bounds = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    return {
        bounds,
        size,
        center,
    };
}

export function centerObjectOnOrigin(object) {
    if (!object) return object;

    const { center } = getObjectBounds(object);
    object.position.sub(center);

    return object;
}

export function setMeshShadow(mesh, castShadow = true, receiveShadow = true) {
    if (!mesh) return mesh;

    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;

    return mesh;
}

export function setGroupShadow(group, castShadow = true, receiveShadow = true) {
    if (!group) return group;

    group.traverse((child) => {
        if (child.isMesh) {
            setMeshShadow(child, castShadow, receiveShadow);
        }
    });

    return group;
}

export function createSize(width = 1, height = 1, depth = 1) {
    return { width, height, depth };
}

export function createTransform({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
} = {}) {
    return {
        position,
        rotation,
        scale,
    };
}
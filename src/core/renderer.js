import * as THREE from "three";

const DEFAULT_RENDERER_OPTIONS = {
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: true,
};

export function createRenderer(container, options = {}) {
    if (!container) {
        throw new Error("No se encontró el contenedor para el renderizador 3D.");
    }

    const renderer = new THREE.WebGLRenderer({
        ...DEFAULT_RENDERER_OPTIONS,
        ...options,
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(getSafePixelRatio());

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = true;

    renderer.sortObjects = true;
    renderer.setClearColor(0x000000, 0);

    renderer.domElement.classList.add("viewer-canvas");
    renderer.domElement.setAttribute("aria-label", "Simulador 3D de KickOff Box");
    renderer.domElement.setAttribute("role", "img");

    container.appendChild(renderer.domElement);

    return renderer;
}

export function updateRendererSize(renderer, camera, container) {
    if (!renderer || !camera || !container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(getSafePixelRatio());
}

export function configureRendererQuality(renderer, quality = "high") {
    if (!renderer) return;

    const qualitySettings = {
        low: {
            pixelRatio: 1,
            shadows: false,
            shadowType: THREE.BasicShadowMap,
            toneMappingExposure: 0.95,
            transmissionResolutionScale: 0.35,
        },
        medium: {
            pixelRatio: Math.min(window.devicePixelRatio, 1.5),
            shadows: true,
            shadowType: THREE.PCFShadowMap,
            toneMappingExposure: 1,
            transmissionResolutionScale: 0.55,
        },
        high: {
            pixelRatio: Math.min(window.devicePixelRatio, 2),
            shadows: true,
            shadowType: THREE.PCFSoftShadowMap,
            toneMappingExposure: 1.08,
            transmissionResolutionScale: 0.75,
        },
        ultra: {
            pixelRatio: Math.min(window.devicePixelRatio, 2.5),
            shadows: true,
            shadowType: THREE.PCFSoftShadowMap,
            toneMappingExposure: 1.14,
            transmissionResolutionScale: 1,
        },
    };

    const settings = qualitySettings[quality] ?? qualitySettings.high;

    renderer.setPixelRatio(settings.pixelRatio);
    renderer.shadowMap.enabled = settings.shadows;
    renderer.shadowMap.type = settings.shadowType;
    renderer.toneMappingExposure = settings.toneMappingExposure;

    if ("transmissionResolutionScale" in renderer) {
        renderer.transmissionResolutionScale = settings.transmissionResolutionScale;
    }
}

export function setRendererTone(renderer, exposure = 1.08) {
    if (!renderer) return;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = exposure;
}

export function captureRendererImage(renderer, filename = "kickoff-box-render.png") {
    if (!renderer) return null;

    const imageURL = renderer.domElement.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = filename;
    link.click();

    return imageURL;
}

export function disposeRenderer(renderer) {
    if (!renderer) return;

    renderer.dispose();

    if (renderer.domElement?.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
    }
}

export function getRendererInfo(renderer) {
    if (!renderer) return null;

    return {
        calls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        points: renderer.info.render.points,
        lines: renderer.info.render.lines,
        geometries: renderer.info.memory.geometries,
        textures: renderer.info.memory.textures,
    };
}

function getSafePixelRatio() {
    return Math.min(window.devicePixelRatio || 1, 2);
}
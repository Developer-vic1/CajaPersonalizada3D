import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Simulador 3D - Caja Personalizada
 * Primera versión funcional y profesional.
 *
 * Objetivo:
 * Mostrar una caja decorativa organizada como presente académico,
 * con contenido editable y visualización interactiva.
 */

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
    throw new Error("No se encontró el contenedor #canvas-container");
}

/* -------------------------------------------------------
   2. CONFIGURACIÓN GENERAL
------------------------------------------------------- */

const CONFIG = {
    box: {
        width: 7.4,
        depth: 5,
        height: 1.3,
        wallThickness: 0.14,
        baseColor: "#c89f72",
        interiorColor: "#f3e0c5",
    },

    camera: {
        fov: 45,
        near: 0.1,
        far: 100,
        position: new THREE.Vector3(7, 6, 8),
    },

    animation: {
        lidOpenAngle: -Math.PI / 2.6,
        lidClosedAngle: 0,
        speed: 0.08,
    },
};

const PRODUCT_PRESETS = {
    basica: {
        card: true,
        rose: true,
        cupcake: true,
        soda: false,
        keychain: false,
        qr: false,
        dividers: false,
    },

    estandar: {
        card: true,
        rose: true,
        cupcake: true,
        soda: true,
        keychain: true,
        qr: false,
        dividers: true,
    },

    completa: {
        card: true,
        rose: true,
        cupcake: true,
        soda: true,
        keychain: true,
        qr: true,
        dividers: true,
    },
};

const state = {
    currentPreset: "estandar",
    isLidOpen: true,
    targetLidRotation: CONFIG.animation.lidOpenAngle,
    boxColor: CONFIG.box.baseColor,
    interiorColor: CONFIG.box.interiorColor,
};

/* -------------------------------------------------------
   3. ESCENA, CÁMARA Y RENDERIZADOR
------------------------------------------------------- */

const scene = new THREE.Scene();
scene.background = new THREE.Color("#110d0a");
scene.fog = new THREE.Fog("#110d0a", 15, 34);

const camera = new THREE.PerspectiveCamera(
    CONFIG.camera.fov,
    canvasContainer.clientWidth / canvasContainer.clientHeight,
    CONFIG.camera.near,
    CONFIG.camera.far,
);

camera.position.copy(CONFIG.camera.position);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
});

renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

canvasContainer.appendChild(renderer.domElement);

/* -------------------------------------------------------
   4. CONTROLES DE CÁMARA
------------------------------------------------------- */

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = true;
controls.enableZoom = true;
controls.minDistance = 5;
controls.maxDistance = 18;
controls.maxPolarAngle = Math.PI / 2.05;
controls.target.set(0, 0.7, 0);
controls.update();

/* -------------------------------------------------------
   5. MATERIALES
------------------------------------------------------- */

const materials = {
    boxExterior: new THREE.MeshStandardMaterial({
        color: state.boxColor,
        roughness: 0.78,
        metalness: 0.03,
    }),

    boxInterior: new THREE.MeshStandardMaterial({
        color: state.interiorColor,
        roughness: 0.82,
        metalness: 0.02,
    }),

    darkCardboard: new THREE.MeshStandardMaterial({
        color: "#7a4f2a",
        roughness: 0.86,
        metalness: 0.02,
    }),

    paper: new THREE.MeshStandardMaterial({
        color: "#fff7e8",
        roughness: 0.7,
        metalness: 0,
    }),

    red: new THREE.MeshStandardMaterial({
        color: "#b92d2d",
        roughness: 0.55,
        metalness: 0.03,
    }),

    yellow: new THREE.MeshStandardMaterial({
        color: "#f0c84b",
        roughness: 0.5,
        metalness: 0.03,
    }),

    green: new THREE.MeshStandardMaterial({
        color: "#2f7d55",
        roughness: 0.56,
        metalness: 0.03,
    }),

    cream: new THREE.MeshStandardMaterial({
        color: "#f5d9a7",
        roughness: 0.7,
        metalness: 0,
    }),

    chocolate: new THREE.MeshStandardMaterial({
        color: "#6d3b22",
        roughness: 0.75,
        metalness: 0,
    }),

    sodaBottle: new THREE.MeshPhysicalMaterial({
        color: "#2f86c7",
        roughness: 0.18,
        metalness: 0.02,
        transmission: 0.25,
        transparent: true,
        opacity: 0.72,
        thickness: 0.8,
    }),

    sodaCap: new THREE.MeshStandardMaterial({
        color: "#f4f1e8",
        roughness: 0.5,
        metalness: 0.05,
    }),

    resin: new THREE.MeshPhysicalMaterial({
        color: "#d7efff",
        roughness: 0.16,
        metalness: 0.03,
        transmission: 0.25,
        transparent: true,
        opacity: 0.78,
        thickness: 0.7,
    }),

    blackText: new THREE.MeshStandardMaterial({
        color: "#2b2118",
        roughness: 0.5,
        metalness: 0,
    }),

    gold: new THREE.MeshStandardMaterial({
        color: "#c59a4a",
        roughness: 0.32,
        metalness: 0.28,
    }),
};

/* -------------------------------------------------------
   6. ILUMINACIÓN
------------------------------------------------------- */

function createLights() {
    const ambient = new THREE.AmbientLight("#fff4df", 1.55);
    scene.add(ambient);

    const mainLight = new THREE.DirectionalLight("#fff4dc", 3.8);
    mainLight.position.set(6, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 30;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight("#d8ecff", 1.2);
    fillLight.position.set(-5, 4, -4);
    scene.add(fillLight);

    const warmPoint = new THREE.PointLight("#ffc37a", 1.5, 18);
    warmPoint.position.set(0, 4, -3);
    scene.add(warmPoint);
}

createLights();

/* -------------------------------------------------------
   7. PISO Y AMBIENTE
------------------------------------------------------- */

function createEnvironment() {
    const floorGeometry = new THREE.CircleGeometry(14, 96);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: "#2c1c12",
        roughness: 0.92,
        metalness: 0.02,
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.04;
    floor.receiveShadow = true;
    scene.add(floor);

    const ringGeometry = new THREE.RingGeometry(5.8, 6, 96);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: "#c89f72",
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.005;
    scene.add(ring);

    const grid = new THREE.GridHelper(18, 28, "#7a4f2a", "#3a281c");
    grid.position.y = 0.01;
    grid.material.transparent = true;
    grid.material.opacity = 0.18;
    scene.add(grid);
}

createEnvironment();

/* -------------------------------------------------------
   8. GRUPOS PRINCIPALES
------------------------------------------------------- */

const productGroup = new THREE.Group();
productGroup.name = "CajaPersonalizada3D";
scene.add(productGroup);

const boxGroup = new THREE.Group();
boxGroup.name = "Caja";
productGroup.add(boxGroup);

const contentGroup = new THREE.Group();
contentGroup.name = "ContenidoInterno";
productGroup.add(contentGroup);

let lidPivot = null;
let lidMesh = null;

const contentObjects = {
    card: null,
    rose: null,
    cupcake: null,
    soda: null,
    keychain: null,
    qr: null,
    dividers: null,
};

/* -------------------------------------------------------
   9. UTILIDADES DE CREACIÓN
------------------------------------------------------- */

function createRoundedBox(width, height, depth, radius, material) {
    const shape = new THREE.Shape();

    const x = -width / 2;
    const y = -depth / 2;

    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + depth - radius);
    shape.quadraticCurveTo(x + width, y + depth, x + width - radius, y + depth);
    shape.lineTo(x + radius, y + depth);
    shape.quadraticCurveTo(x, y + depth, x, y + depth - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: height,
        bevelEnabled: true,
        bevelThickness: radius * 0.22,
        bevelSize: radius * 0.22,
        bevelSegments: 5,
    });

    geometry.rotateX(-Math.PI / 2);
    geometry.center();

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
}

function createBoxMesh(width, height, depth, material) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}

function createCylinder(radiusTop, radiusBottom, height, radialSegments, material) {
    const geometry = new THREE.CylinderGeometry(
        radiusTop,
        radiusBottom,
        height,
        radialSegments,
    );

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
}

function createTextLabel({ text, width = 2.2, height = 0.42, color = "#2b2118" }) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#fff7e8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = color;
    ctx.font = "bold 56px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: false,
    });

    const geometry = new THREE.PlaneGeometry(width, height);
    const mesh = new THREE.Mesh(geometry, material);

    return mesh;
}

/* -------------------------------------------------------
   10. CAJA BASE
------------------------------------------------------- */

function createBoxBase() {
    const { width, depth, height, wallThickness } = CONFIG.box;

    const baseFloor = createRoundedBox(
        width,
        0.22,
        depth,
        0.22,
        materials.boxInterior,
    );
    baseFloor.position.y = 0.12;
    boxGroup.add(baseFloor);

    const frontWall = createBoxMesh(
        width,
        height,
        wallThickness,
        materials.boxExterior,
    );
    frontWall.position.set(0, height / 2 + 0.22, depth / 2);
    boxGroup.add(frontWall);

    const backWall = createBoxMesh(
        width,
        height,
        wallThickness,
        materials.boxExterior,
    );
    backWall.position.set(0, height / 2 + 0.22, -depth / 2);
    boxGroup.add(backWall);

    const leftWall = createBoxMesh(
        wallThickness,
        height,
        depth,
        materials.boxExterior,
    );
    leftWall.position.set(-width / 2, height / 2 + 0.22, 0);
    boxGroup.add(leftWall);

    const rightWall = createBoxMesh(
        wallThickness,
        height,
        depth,
        materials.boxExterior,
    );
    rightWall.position.set(width / 2, height / 2 + 0.22, 0);
    boxGroup.add(rightWall);

    const frontInterior = createBoxMesh(
        width - 0.25,
        height * 0.86,
        0.045,
        materials.boxInterior,
    );
    frontInterior.position.set(0, height / 2 + 0.23, depth / 2 - 0.09);
    boxGroup.add(frontInterior);

    const backInterior = createBoxMesh(
        width - 0.25,
        height * 0.86,
        0.045,
        materials.boxInterior,
    );
    backInterior.position.set(0, height / 2 + 0.23, -depth / 2 + 0.09);
    boxGroup.add(backInterior);

    const leftInterior = createBoxMesh(
        0.045,
        height * 0.86,
        depth - 0.25,
        materials.boxInterior,
    );
    leftInterior.position.set(-width / 2 + 0.09, height / 2 + 0.23, 0);
    boxGroup.add(leftInterior);

    const rightInterior = createBoxMesh(
        0.045,
        height * 0.86,
        depth - 0.25,
        materials.boxInterior,
    );
    rightInterior.position.set(width / 2 - 0.09, height / 2 + 0.23, 0);
    boxGroup.add(rightInterior);
}

/* -------------------------------------------------------
   11. TAPA ANIMABLE
------------------------------------------------------- */

function createBoxLid() {
    const { width, depth, height } = CONFIG.box;

    lidPivot = new THREE.Group();
    lidPivot.name = "TapaPivot";

    /**
     * La tapa gira desde la parte posterior de la caja.
     * Por eso colocamos el pivote en el borde trasero.
     */
    lidPivot.position.set(0, height + 0.35, -depth / 2 - 0.05);

    lidMesh = createRoundedBox(width + 0.28, 0.2, depth + 0.28, 0.2, materials.boxExterior);
    lidMesh.name = "TapaCaja";

    /**
     * Se mueve la tapa hacia adelante respecto al pivote
     * para que su borde posterior quede sobre el eje de rotación.
     */
    lidMesh.position.set(0, 0, (depth + 0.28) / 2);

    const lidInterior = createRoundedBox(
        width + 0.05,
        0.04,
        depth + 0.05,
        0.16,
        materials.boxInterior,
    );
    lidInterior.position.set(0, -0.13, (depth + 0.28) / 2);
    lidMesh.add(lidInterior);

    const label = createTextLabel({
        text: "MUNDIAL 2026",
        width: 2.7,
        height: 0.46,
        color: "#7a1e1e",
    });
    label.rotation.x = -Math.PI / 2;
    label.position.set(0, 0.13, (depth + 0.28) / 2);
    lidMesh.add(label);

    lidPivot.add(lidMesh);
    lidPivot.rotation.x = state.targetLidRotation;

    boxGroup.add(lidPivot);
}

/* -------------------------------------------------------
   12. SEPARADORES INTERNOS
------------------------------------------------------- */

function createInternalDividers() {
    const group = new THREE.Group();
    group.name = "SeparadoresInternos";

    const dividerA = createBoxMesh(0.08, 0.58, 4.4, materials.darkCardboard);
    dividerA.position.set(-0.55, 0.62, 0);

    const dividerB = createBoxMesh(6.3, 0.58, 0.08, materials.darkCardboard);
    dividerB.position.set(0, 0.62, -0.55);

    const dividerC = createBoxMesh(0.08, 0.58, 2.0, materials.darkCardboard);
    dividerC.position.set(2.25, 0.62, 1.05);

    group.add(dividerA, dividerB, dividerC);
    contentGroup.add(group);

    contentObjects.dividers = group;
}

/* -------------------------------------------------------
   13. TARJETA PERSONALIZADA
------------------------------------------------------- */

function createCardMessage() {
    const group = new THREE.Group();
    group.name = "TarjetaPersonalizada";

    const card = createBoxMesh(2.7, 0.06, 1.35, materials.paper);
    card.position.set(-2.25, 0.62, -1.45);
    group.add(card);

    const border = createBoxMesh(2.88, 0.035, 1.5, materials.gold);
    border.position.set(-2.25, 0.59, -1.45);
    border.scale.y = 0.45;
    group.add(border);

    const text = createTextLabel({
        text: "Gracias por ser parte",
        width: 2.25,
        height: 0.35,
        color: "#2b2118",
    });
    text.rotation.x = -Math.PI / 2;
    text.position.set(-2.25, 0.665, -1.45);
    group.add(text);

    contentGroup.add(group);
    contentObjects.card = group;
}

/* -------------------------------------------------------
   14. PASTELITO
------------------------------------------------------- */

function createCupcake() {
    const group = new THREE.Group();
    group.name = "Pastelito";

    const wrapper = createCylinder(0.46, 0.36, 0.48, 32, materials.chocolate);
    wrapper.position.set(-2.35, 0.68, 0.72);
    group.add(wrapper);

    const top = createCylinder(0.5, 0.42, 0.24, 32, materials.cream);
    top.position.set(-2.35, 1.04, 0.72);
    group.add(top);

    const cherry = createCylinder(0.09, 0.09, 0.08, 24, materials.red);
    cherry.position.set(-2.35, 1.24, 0.72);
    group.add(cherry);

    const sprinkleGeometry = new THREE.BoxGeometry(0.12, 0.025, 0.025);

    for (let i = 0; i < 10; i += 1) {
        const sprinkleMaterial = i % 2 === 0 ? materials.red : materials.yellow;
        const sprinkle = new THREE.Mesh(sprinkleGeometry, sprinkleMaterial);
        sprinkle.position.set(
            -2.35 + (Math.random() - 0.5) * 0.65,
            1.18,
            0.72 + (Math.random() - 0.5) * 0.55,
        );
        sprinkle.rotation.y = Math.random() * Math.PI;
        sprinkle.castShadow = true;
        group.add(sprinkle);
    }

    contentGroup.add(group);
    contentObjects.cupcake = group;
}

/* -------------------------------------------------------
   15. REFRESCO PEQUEÑO
------------------------------------------------------- */

function createSodaBottle() {
    const group = new THREE.Group();
    group.name = "RefrescoPequeno";

    const bottle = createCylinder(0.25, 0.31, 1.45, 40, materials.sodaBottle);
    bottle.position.set(1.25, 0.98, 0.9);
    group.add(bottle);

    const neck = createCylinder(0.16, 0.2, 0.38, 32, materials.sodaBottle);
    neck.position.set(1.25, 1.86, 0.9);
    group.add(neck);

    const cap = createCylinder(0.18, 0.18, 0.16, 32, materials.sodaCap);
    cap.position.set(1.25, 2.13, 0.9);
    group.add(cap);

    const label = createTextLabel({
        text: "BOL",
        width: 0.65,
        height: 0.26,
        color: "#7a1e1e",
    });
    label.position.set(1.25, 1.02, 1.215);
    label.rotation.x = 0;
    group.add(label);

    contentGroup.add(group);
    contentObjects.soda = group;
}

/* -------------------------------------------------------
   16. ROSA DECORATIVA
------------------------------------------------------- */

function createDecorativeRose() {
    const group = new THREE.Group();
    group.name = "RosaDecorativa";

    const stem = createCylinder(0.035, 0.035, 1.4, 16, materials.green);
    stem.rotation.z = Math.PI / 2.8;
    stem.position.set(2.25, 0.75, -1.45);
    group.add(stem);

    const flowerCenter = createCylinder(0.13, 0.13, 0.12, 24, materials.yellow);
    flowerCenter.position.set(2.75, 1.05, -1.75);
    flowerCenter.rotation.x = Math.PI / 2;
    group.add(flowerCenter);

    const petalGeometry = new THREE.SphereGeometry(0.18, 24, 12);

    const petalColors = [materials.red, materials.yellow, materials.green];

    for (let i = 0; i < 9; i += 1) {
        const petal = new THREE.Mesh(petalGeometry, petalColors[i % petalColors.length]);
        const angle = (i / 9) * Math.PI * 2;

        petal.scale.set(1, 0.45, 0.18);
        petal.position.set(
            2.75 + Math.cos(angle) * 0.22,
            1.05 + Math.sin(angle) * 0.08,
            -1.75 + Math.sin(angle) * 0.22,
        );
        petal.rotation.y = angle;
        petal.castShadow = true;
        group.add(petal);
    }

    contentGroup.add(group);
    contentObjects.rose = group;
}

/* -------------------------------------------------------
   17. LLAVERO / SOUVENIR EN RESINA
------------------------------------------------------- */

function createResinKeychain() {
    const group = new THREE.Group();
    group.name = "LlaveroResina";

    const keychain = createCylinder(0.42, 0.42, 0.08, 48, materials.resin);
    keychain.position.set(2.15, 0.65, 1.58);
    keychain.rotation.x = Math.PI / 2;
    group.add(keychain);

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.19, 0.025, 12, 48),
        materials.gold,
    );
    ring.position.set(2.15, 0.74, 1.08);
    ring.rotation.x = Math.PI / 2;
    ring.castShadow = true;
    group.add(ring);

    const miniLabel = createTextLabel({
        text: "2026",
        width: 0.62,
        height: 0.24,
        color: "#7a1e1e",
    });
    miniLabel.position.set(2.15, 0.71, 1.58);
    miniLabel.rotation.x = -Math.PI / 2;
    group.add(miniLabel);

    contentGroup.add(group);
    contentObjects.keychain = group;
}

/* -------------------------------------------------------
   18. TARJETA QR DECORATIVA
------------------------------------------------------- */

function createQRCard() {
    const group = new THREE.Group();
    group.name = "QRDecorativo";

    const card = createBoxMesh(0.95, 0.05, 0.95, materials.paper);
    card.position.set(0.25, 0.62, -1.55);
    group.add(card);

    const qrCanvas = document.createElement("canvas");
    qrCanvas.width = 256;
    qrCanvas.height = 256;

    const ctx = qrCanvas.getContext("2d");

    ctx.fillStyle = "#fff7e8";
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = "#2b2118";

    const blocks = [
        [18, 18, 52, 52],
        [186, 18, 52, 52],
        [18, 186, 52, 52],
        [92, 28, 18, 18],
        [128, 28, 18, 18],
        [96, 84, 18, 18],
        [132, 92, 18, 18],
        [174, 96, 18, 18],
        [88, 132, 18, 18],
        [124, 132, 18, 18],
        [162, 140, 18, 18],
        [202, 144, 18, 18],
        [94, 184, 18, 18],
        [134, 194, 18, 18],
        [174, 194, 18, 18],
        [210, 210, 18, 18],
    ];

    blocks.forEach(([x, y, w, h]) => {
        ctx.fillRect(x, y, w, h);
    });

    const texture = new THREE.CanvasTexture(qrCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    const qrMaterial = new THREE.MeshBasicMaterial({
        map: texture,
    });

    const qrPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.76, 0.76), qrMaterial);
    qrPlane.rotation.x = -Math.PI / 2;
    qrPlane.position.set(0.25, 0.66, -1.55);
    group.add(qrPlane);

    contentGroup.add(group);
    contentObjects.qr = group;
}

/* -------------------------------------------------------
   19. DECORACIÓN EXTERIOR TEMÁTICA
------------------------------------------------------- */

function createThemeDecorations() {
    const frontBanner = createTextLabel({
        text: "KICK BOX",
        width: 2.5,
        height: 0.35,
        color: "#000000ff",
    });
    frontBanner.position.set(0, 1.18, CONFIG.box.depth / 2 + 0.083);
    boxGroup.add(frontBanner);

    const leftStripe = createBoxMesh(0.08, 0.07, 4.5, materials.red);
    leftStripe.position.set(-3.1, 1.08, 0);
    boxGroup.add(leftStripe);

    const middleStripe = createBoxMesh(0.08, 0.07, 4.5, materials.yellow);
    middleStripe.position.set(-2.95, 1.08, 0);
    boxGroup.add(middleStripe);

    const rightStripe = createBoxMesh(0.08, 0.07, 4.5, materials.green);
    rightStripe.position.set(-2.8, 1.08, 0);
    boxGroup.add(rightStripe);
}

/* -------------------------------------------------------
   20. CONSTRUCCIÓN DE ESCENA
------------------------------------------------------- */

function buildProduct() {
    createBoxBase();
    createBoxLid();
    createInternalDividers();
    createCardMessage();
    createDecorativeRose();
    createCupcake();
    createSodaBottle();
    createResinKeychain();
    createQRCard();
    createThemeDecorations();

    applyPreset(state.currentPreset);
}

buildProduct();

/* -------------------------------------------------------
   21. PRESETS: BÁSICA, ESTÁNDAR, COMPLETA
------------------------------------------------------- */

function applyPreset(presetName) {
    const preset = PRODUCT_PRESETS[presetName] ?? PRODUCT_PRESETS.estandar;

    Object.entries(contentObjects).forEach(([key, object]) => {
        if (!object) return;
        object.visible = Boolean(preset[key]);
    });

    state.currentPreset = presetName;
}

/* -------------------------------------------------------
   22. EVENTOS DEL PANEL
------------------------------------------------------- */

function setupUIEvents() {
    if (presetSelect) {
        presetSelect.addEventListener("change", (event) => {
            applyPreset(event.target.value);
        });
    }

    if (boxColorInput) {
        boxColorInput.addEventListener("input", (event) => {
            state.boxColor = event.target.value;
            materials.boxExterior.color.set(event.target.value);
        });
    }

    if (interiorColorInput) {
        interiorColorInput.addEventListener("input", (event) => {
            state.interiorColor = event.target.value;
            materials.boxInterior.color.set(event.target.value);
        });
    }

    if (toggleLidButton) {
        toggleLidButton.addEventListener("click", () => {
            state.isLidOpen = !state.isLidOpen;
            state.targetLidRotation = state.isLidOpen
                ? CONFIG.animation.lidOpenAngle
                : CONFIG.animation.lidClosedAngle;
        });
    }
}

setupUIEvents();

/* -------------------------------------------------------
   23. ANIMACIÓN
------------------------------------------------------- */

const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    if (lidPivot) {
        lidPivot.rotation.x = THREE.MathUtils.lerp(
            lidPivot.rotation.x,
            state.targetLidRotation,
            CONFIG.animation.speed,
        );
    }

    if (contentObjects.rose) {
        contentObjects.rose.rotation.y = Math.sin(elapsedTime * 0.55) * 0.04;
    }

    if (contentObjects.keychain) {
        contentObjects.keychain.rotation.y = Math.sin(elapsedTime * 0.75) * 0.08;
    }

    productGroup.rotation.y = Math.sin(elapsedTime * 0.14) * 0.035;

    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

animate();

/* -------------------------------------------------------
   24. RESPONSIVE
------------------------------------------------------- */

function handleResize() {
    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener("resize", handleResize);

/* -------------------------------------------------------
   25. FINALIZACIÓN DE CARGA
------------------------------------------------------- */

setTimeout(() => {
    if (loadingElement) {
        loadingElement.classList.add("is-hidden");
    }
}, 650);
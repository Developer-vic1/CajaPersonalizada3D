export const boxConfig = {
    meta: {
        projectName: "Caja Personalizada 3D",
        description:
            "Simulación tridimensional de una caja decorativa personalizada como presente académico.",
        version: "1.0.0",
    },

    // Medidas principales de la caja
    dimensions: {
        width: 7.4,
        depth: 5.0,
        height: 1.3,
        wallThickness: 0.14,
        floorHeight: 0.22,
        borderRadius: 0.22,
    },

    // Configuración de la tapa
    lid: {
        thickness: 0.2,
        margin: 0.28,
        interiorThickness: 0.04,
        openAngle: -Math.PI / 2.6,
        closedAngle: 0,
        animationSpeed: 0.08,
        initialOpen: true,
    },

    // Paleta visual base
    colors: {
        exterior: "#c89f72",
        interior: "#f3e0c5",
        darkCardboard: "#7a4f2a",
        paper: "#fff7e8",
        boliviaRed: "#b92d2d",
        boliviaYellow: "#f0c84b",
        boliviaGreen: "#2f7d55",
        chocolate: "#6d3b22",
        cream: "#f5d9a7",
        sodaBlue: "#2f86c7",
        gold: "#c59a4a",
        textDark: "#2b2118",
        background: "#110d0a",
    },

    // Propiedades físicas de materiales
    materialSettings: {
        cardboard: {
            roughness: 0.78,
            metalness: 0.03,
        },
        interior: {
            roughness: 0.82,
            metalness: 0.02,
        },
        paper: {
            roughness: 0.7,
            metalness: 0,
        },
        decorative: {
            roughness: 0.55,
            metalness: 0.03,
        },
        resin: {
            roughness: 0.16,
            metalness: 0.03,
            transmission: 0.25,
            opacity: 0.78,
            thickness: 0.7,
        },
        bottle: {
            roughness: 0.18,
            metalness: 0.02,
            transmission: 0.25,
            opacity: 0.72,
            thickness: 0.8,
        },
    },

    // Distribución del contenido interno
    contentLayout: {
        card: {
            position: [-2.25, 0.62, -1.45],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            size: {
                width: 2.7,
                height: 0.06,
                depth: 1.35,
            },
            text: "Gracias por ser parte",
        },

        cupcake: {
            position: [-2.35, 0.68, 0.72],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            wrapper: {
                radiusTop: 0.46,
                radiusBottom: 0.36,
                height: 0.48,
            },
            topping: {
                radiusTop: 0.5,
                radiusBottom: 0.42,
                height: 0.24,
            },
        },

        soda: {
            position: [1.25, 0.98, 0.9],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            body: {
                radiusTop: 0.25,
                radiusBottom: 0.31,
                height: 1.45,
            },
            neck: {
                radiusTop: 0.16,
                radiusBottom: 0.2,
                height: 0.38,
            },
            label: "BOL",
        },

        rose: {
            position: [2.25, 0.75, -1.45],
            rotation: [0, 0, Math.PI / 2.8],
            scale: [1, 1, 1],
            stemHeight: 1.4,
            petalCount: 9,
        },

        keychain: {
            position: [2.15, 0.65, 1.58],
            rotation: [Math.PI / 2, 0, 0],
            scale: [1, 1, 1],
            radius: 0.42,
            thickness: 0.08,
            label: "2026",
        },

        qrCard: {
            position: [0.25, 0.62, -1.55],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            size: {
                width: 0.95,
                height: 0.05,
                depth: 0.95,
            },
        },
    },

    // Separadores internos
    dividers: [
        {
            name: "dividerVerticalMain",
            size: [0.08, 0.58, 4.4],
            position: [-0.55, 0.62, 0],
        },
        {
            name: "dividerHorizontalMain",
            size: [6.3, 0.58, 0.08],
            position: [0, 0.62, -0.55],
        },
        {
            name: "dividerSmallRight",
            size: [0.08, 0.58, 2.0],
            position: [2.25, 0.62, 1.05],
        },
    ],

    // Decoración exterior
    exteriorDecorations: {
        frontLabel: {
            text: "Presente Académico",
            position: [0, 1.18, 2.583],
            size: {
                width: 2.5,
                height: 0.35,
            },
        },

        lidLabel: {
            text: "MUNDIAL 2026",
            size: {
                width: 2.7,
                height: 0.46,
            },
        },

        boliviaStripes: [
            {
                color: "boliviaRed",
                size: [0.08, 0.07, 4.5],
                position: [-3.1, 1.08, 0],
            },
            {
                color: "boliviaYellow",
                size: [0.08, 0.07, 4.5],
                position: [-2.95, 1.08, 0],
            },
            {
                color: "boliviaGreen",
                size: [0.08, 0.07, 4.5],
                position: [-2.8, 1.08, 0],
            },
        ],
    },

    // Cámara inicial
    camera: {
        fov: 45,
        near: 0.1,
        far: 100,
        position: [7, 6, 8],
        target: [0, 0.7, 0],
        minDistance: 5,
        maxDistance: 18,
        maxPolarAngle: Math.PI / 2.05,
    },

    // Ambiente de escena
    environment: {
        backgroundColor: "#110d0a",
        fog: {
            enabled: true,
            color: "#110d0a",
            near: 15,
            far: 34,
        },
        floor: {
            radius: 14,
            color: "#2c1c12",
        },
        ring: {
            innerRadius: 5.8,
            outerRadius: 6.0,
            color: "#c89f72",
            opacity: 0.22,
        },
        grid: {
            size: 18,
            divisions: 28,
            colorCenterLine: "#7a4f2a",
            colorGrid: "#3a281c",
            opacity: 0.18,
        },
    },

    // Iluminación
    lights: {
        ambient: {
            color: "#fff4df",
            intensity: 1.55,
        },
        main: {
            color: "#fff4dc",
            intensity: 3.8,
            position: [6, 8, 5],
        },
        fill: {
            color: "#d8ecff",
            intensity: 1.2,
            position: [-5, 4, -4],
        },
        warmPoint: {
            color: "#ffc37a",
            intensity: 1.5,
            distance: 18,
            position: [0, 4, -3],
        },
    },

    // Movimiento visual
    animation: {
        floatIntensity: 0.04,
        rotationIntensity: 0.035,
        roseSwayIntensity: 0.04,
        keychainSwayIntensity: 0.08,
    },
};
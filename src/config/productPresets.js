export const defaultPreset = "estandar";

export const productPresets = {
    basica: {
        id: "basica",
        label: "Básica",
        shortLabel: "KickOff Box Básica",
        description:
            "Versión accesible orientada a un presente académico sencillo, ordenado y significativo.",
        purpose:
            "Representar una opción económica para estudiantes que desean entregar un detalle personalizado en presentaciones finales o defensas.",
        audience: "Estudiantes universitarios",
        items: {
            exteriorDesign: true,
            interiorDesign: false,
            card: true,
            personalizedMessage: true,
            rose: true,
            cupcake: true,
            soda: false,
            keychain: false,
            qr: false,
            dividers: false,
            boliviaIdentity: true,
            worldCupTheme: true,
            academicIdentity: true,
        },
    },

    estandar: {
        id: "estandar",
        label: "Estándar",
        shortLabel: "KickOff Box Estándar",
        description:
            "Versión principal del proyecto, con diseño exterior e interior, detalle dulce, bebida y accesorio personalizado.",
        purpose:
            "Mostrar la propuesta central de KickOff Box como presente académico para jurados, docentes, tribunales e invitados.",
        audience: "Estudiantes, grupos de defensa y presentaciones académicas",
        items: {
            exteriorDesign: true,
            interiorDesign: true,
            card: true,
            personalizedMessage: true,
            rose: true,
            cupcake: true,
            soda: true,
            keychain: true,
            qr: false,
            dividers: true,
            boliviaIdentity: true,
            worldCupTheme: true,
            academicIdentity: true,
        },
    },

    premium: {
        id: "premium",
        label: "Premium",
        shortLabel: "KickOff Box Premium",
        description:
            "Versión más completa, con mayor personalización, QR interactivo, accesorios conmemorativos y presentación visual reforzada.",
        purpose:
            "Exhibir el máximo potencial del producto como experiencia académica, tecnológica, temática y conmemorativa.",
        audience: "Grupos de defensa, eventos institucionales y reconocimientos especiales",
        items: {
            exteriorDesign: true,
            interiorDesign: true,
            card: true,
            personalizedMessage: true,
            rose: true,
            cupcake: true,
            soda: true,
            keychain: true,
            qr: true,
            dividers: true,
            boliviaIdentity: true,
            worldCupTheme: true,
            academicIdentity: true,
        },
    },
};

export const presetOrder = ["basica", "estandar", "premium"];

export function getPreset(presetId = defaultPreset) {
    return productPresets[presetId] ?? productPresets[defaultPreset];
}

export function getPresetItems(presetId = defaultPreset) {
    return getPreset(presetId).items;
}

export function getPresetOptions() {
    return presetOrder.map((presetId) => {
        const preset = getPreset(presetId);

        return {
            id: preset.id,
            label: preset.label,
            shortLabel: preset.shortLabel,
            description: preset.description,
            purpose: preset.purpose,
            audience: preset.audience,
        };
    });
}
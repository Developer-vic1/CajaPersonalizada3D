import {
    PRODUCT_PRESET_IDS,
    DESIGN_TEMPLATE_IDS,
    DESIGN_TEMPLATE_LABELS,
    VISUAL_THEME_IDS,
    CAMERA_VIEW_IDS,
    LIGHTING_MODE_IDS,
    RENDER_QUALITY_IDS,
    LOGO_VARIANTS,
    BRAND_COLORS,
    DEFAULT_TEXT_CONTENT,
    QR_DEFAULTS,
} from "../constants/appConstants.js";

import { OBJECT_KEYS } from "../constants/objectKeys.js";

import {
    PRICE_ITEM_KEYS,
    BEVERAGE_PRICE_KEYS,
    URGENCY_PRICE_RULES,
    DELIVERY_PRICE_RULES,
} from "../data/pricingRules.js";

export const DESIGN_TEMPLATE_VERSION = "1.0.0";

export const TEMPLATE_GROUPS = Object.freeze({
    COMMERCIAL: "commercial",
    ACADEMIC: "academic",
    INSTITUTIONAL: "institutional",
});

export const TEMPLATE_COMPLEXITY = Object.freeze({
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
    ADVANCED: "advanced",
});

export const TEMPLATE_PERSONALIZATION_LEVEL = Object.freeze({
    BASIC: "basic",
    MEDIUM: "medium",
    HIGH: "high",
    FULL: "full",
});

export const TEMPLATE_LAYOUT_STYLE = Object.freeze({
    SIMPLE: "simple",
    BALANCED: "balanced",
    PREMIUM_PACKAGING: "premium-packaging",
    PRESENTATION: "presentation",
    INSTITUTIONAL: "institutional",
});

export const TEMPLATE_RENDER_STYLE = Object.freeze({
    CLEAN_PREVIEW: "clean-preview",
    PRODUCT_RENDER: "product-render",
    PREMIUM_SHOWCASE: "premium-showcase",
    TECH_ACADEMIC: "tech-academic",
});

const commonText = Object.freeze({
    career: DEFAULT_TEXT_CONTENT.CAREER,
    university: DEFAULT_TEXT_CONTENT.UNIVERSITY,
    academicYear: "2026",
});

const commonObjectVisibility = Object.freeze({
    [OBJECT_KEYS.BOX_BASE]: true,
    [OBJECT_KEYS.BOX_LID]: true,
    [OBJECT_KEYS.INTERNAL_DIVIDERS]: true,
    [OBJECT_KEYS.PAPER_FILLER]: true,

    [OBJECT_KEYS.CARD_MESSAGE]: true,
    [OBJECT_KEYS.QR_CARD]: true,
    [OBJECT_KEYS.LID_INTERIOR_DESIGN]: true,

    [OBJECT_KEYS.CUPCAKE]: true,
    [OBJECT_KEYS.SODA_BOTTLE]: true,
    [OBJECT_KEYS.DECORATIVE_ROSE]: true,
    [OBJECT_KEYS.RESIN_KEYCHAIN]: true,

    [OBJECT_KEYS.CAREER_LOGO_BADGE]: true,
    [OBJECT_KEYS.CUSTOM_IMAGE_PLANE]: false,
    [OBJECT_KEYS.THEMATIC_DECORATIONS]: true,

    [OBJECT_KEYS.SELECTION_HELPER]: false,
    [OBJECT_KEYS.TRANSFORM_CONTROLS]: false,
});

const premiumLayout = Object.freeze({
    [OBJECT_KEYS.CUPCAKE]: Object.freeze({
        position: [-1.08, 0.56, 0.48],
        rotation: [0, 0.08, 0],
        scale: [0.92, 0.92, 0.92],
        slot: "left-food",
    }),

    [OBJECT_KEYS.SODA_BOTTLE]: Object.freeze({
        position: [0.64, 0.55, 0.44],
        rotation: [0, 0, Math.PI / 2],
        scale: [0.78, 0.78, 0.78],
        slot: "center-beverage-horizontal",
    }),

    [OBJECT_KEYS.DECORATIVE_ROSE]: Object.freeze({
        position: [1.48, 0.59, -0.42],
        rotation: [0.08, -0.55, -0.22],
        scale: [0.82, 0.82, 0.82],
        slot: "right-flower",
    }),

    [OBJECT_KEYS.RESIN_KEYCHAIN]: Object.freeze({
        position: [1.5, 0.62, 0.72],
        rotation: [Math.PI / 2, 0, -0.18],
        scale: [0.64, 0.64, 0.64],
        slot: "right-front-souvenir",
    }),

    [OBJECT_KEYS.CARD_MESSAGE]: Object.freeze({
        position: [-1.12, 0.63, -0.76],
        rotation: [-Math.PI / 2, 0, -0.06],
        scale: [0.88, 0.88, 0.88],
        slot: "left-card",
    }),

    [OBJECT_KEYS.QR_CARD]: Object.freeze({
        position: [0.05, 0.65, -1.03],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [0.72, 0.72, 0.72],
        slot: "back-digital-card",
    }),

    [OBJECT_KEYS.CAREER_LOGO_BADGE]: Object.freeze({
        position: [0.98, 0.67, -1.55],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [0.5, 0.5, 0.5],
        slot: "back-logo-badge",
    }),

    [OBJECT_KEYS.LID_INTERIOR_DESIGN]: Object.freeze({
        position: [0, 1.62, -1.95],
        rotation: [-0.94, 0, 0],
        scale: [1, 1, 1],
        slot: "inner-lid-panel",
    }),

    [OBJECT_KEYS.PAPER_FILLER]: Object.freeze({
        position: [0, 0.42, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        slot: "interior-base-fill",
    }),
});

const standardLayout = Object.freeze({
    [OBJECT_KEYS.CUPCAKE]: Object.freeze({
        position: [-0.92, 0.55, 0.48],
        rotation: [0, 0.08, 0],
        scale: [0.88, 0.88, 0.88],
        slot: "left-food",
    }),

    [OBJECT_KEYS.SODA_BOTTLE]: Object.freeze({
        position: [0.55, 0.55, 0.42],
        rotation: [0, 0, Math.PI / 2],
        scale: [0.72, 0.72, 0.72],
        slot: "center-beverage-horizontal",
    }),

    [OBJECT_KEYS.DECORATIVE_ROSE]: Object.freeze({
        position: [1.35, 0.58, -0.34],
        rotation: [0.08, -0.45, -0.18],
        scale: [0.74, 0.74, 0.74],
        slot: "right-flower",
    }),

    [OBJECT_KEYS.RESIN_KEYCHAIN]: Object.freeze({
        position: [1.42, 0.61, 0.66],
        rotation: [Math.PI / 2, 0, -0.18],
        scale: [0.55, 0.55, 0.55],
        slot: "right-front-souvenir",
    }),

    [OBJECT_KEYS.CARD_MESSAGE]: Object.freeze({
        position: [-1.04, 0.62, -0.72],
        rotation: [-Math.PI / 2, 0, -0.04],
        scale: [0.84, 0.84, 0.84],
        slot: "left-card",
    }),

    [OBJECT_KEYS.QR_CARD]: Object.freeze({
        position: [0.06, 0.64, -1],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [0.66, 0.66, 0.66],
        slot: "back-digital-card",
    }),

    [OBJECT_KEYS.CAREER_LOGO_BADGE]: Object.freeze({
        position: [0.9, 0.66, -1.48],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [0.44, 0.44, 0.44],
        slot: "back-logo-badge",
    }),

    [OBJECT_KEYS.PAPER_FILLER]: Object.freeze({
        position: [0, 0.42, 0],
        rotation: [0, 0, 0],
        scale: [0.96, 0.96, 0.96],
        slot: "interior-base-fill",
    }),
});

const basicLayout = Object.freeze({
    [OBJECT_KEYS.CUPCAKE]: Object.freeze({
        position: [-0.58, 0.55, 0.38],
        rotation: [0, 0.08, 0],
        scale: [0.82, 0.82, 0.82],
        slot: "left-food",
    }),

    [OBJECT_KEYS.DECORATIVE_ROSE]: Object.freeze({
        position: [0.64, 0.57, 0.38],
        rotation: [0.08, -0.4, -0.16],
        scale: [0.72, 0.72, 0.72],
        slot: "right-flower",
    }),

    [OBJECT_KEYS.CARD_MESSAGE]: Object.freeze({
        position: [0, 0.62, -0.72],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [0.78, 0.78, 0.78],
        slot: "back-card",
    }),

    [OBJECT_KEYS.PAPER_FILLER]: Object.freeze({
        position: [0, 0.42, 0],
        rotation: [0, 0, 0],
        scale: [0.82, 0.82, 0.82],
        slot: "interior-base-fill",
    }),
});

const defenseLayout = Object.freeze({
    ...premiumLayout,

    [OBJECT_KEYS.LID_INTERIOR_DESIGN]: Object.freeze({
        position: [0, 1.62, -1.95],
        rotation: [-0.94, 0, 0],
        scale: [1.04, 1.04, 1.04],
        slot: "inner-lid-panel",
    }),

    [OBJECT_KEYS.QR_CARD]: Object.freeze({
        position: [0.16, 0.65, -1.04],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [0.76, 0.76, 0.76],
        slot: "back-digital-card",
    }),
});

const juryLayout = Object.freeze({
    ...premiumLayout,

    [OBJECT_KEYS.CARD_MESSAGE]: Object.freeze({
        position: [-1.08, 0.63, -0.78],
        rotation: [-Math.PI / 2, 0, -0.04],
        scale: [0.92, 0.92, 0.92],
        slot: "left-card",
    }),

    [OBJECT_KEYS.RESIN_KEYCHAIN]: Object.freeze({
        position: [1.48, 0.62, 0.7],
        rotation: [Math.PI / 2, 0, -0.14],
        scale: [0.7, 0.7, 0.7],
        slot: "right-front-souvenir",
    }),
});

const institutionalLayout = Object.freeze({
    ...premiumLayout,

    [OBJECT_KEYS.CUPCAKE]: Object.freeze({
        position: [-1.18, 0.56, 0.45],
        rotation: [0, 0.04, 0],
        scale: [0.84, 0.84, 0.84],
        slot: "left-food",
    }),

    [OBJECT_KEYS.SODA_BOTTLE]: Object.freeze({
        position: [0.52, 0.55, 0.38],
        rotation: [0, 0, Math.PI / 2],
        scale: [0.74, 0.74, 0.74],
        slot: "center-beverage-horizontal",
    }),

    [OBJECT_KEYS.CAREER_LOGO_BADGE]: Object.freeze({
        position: [1.02, 0.67, -1.52],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [0.58, 0.58, 0.58],
        slot: "back-logo-badge",
    }),
});

export const PAPER_FILLER_STYLES = Object.freeze({
    KRAFT: "kraft",
    WHITE: "white",
    GOLD: "gold",
    BLACK_GOLD: "black-gold",
    TRICOLOR: "tricolor",
});

export const LID_DESIGN_STYLES = Object.freeze({
    SIMPLE_MESSAGE: "simple-message",
    PREMIUM_QR_PANEL: "premium-qr-panel",
    DEFENSE_MESSAGE: "defense-message",
    JURY_THANKS: "jury-thanks",
    INSTITUTIONAL_BADGE: "institutional-badge",
});

export const BOX_ART_STYLES = Object.freeze({
    CLEAN_KRAFT: "clean-kraft",
    ACADEMIC_MINIMAL: "academic-minimal",
    BLACK_GOLD_STADIUM: "black-gold-stadium",
    TECH_SYSTEMS: "tech-systems",
    BOLIVIA_WORLD_CUP: "bolivia-world-cup",
});

export const DESIGN_TEMPLATES = Object.freeze({
    [DESIGN_TEMPLATE_IDS.BASIC]: Object.freeze({
        id: DESIGN_TEMPLATE_IDS.BASIC,
        label: DESIGN_TEMPLATE_LABELS[DESIGN_TEMPLATE_IDS.BASIC],
        group: TEMPLATE_GROUPS.COMMERCIAL,
        complexity: TEMPLATE_COMPLEXITY.LOW,
        personalizationLevel: TEMPLATE_PERSONALIZATION_LEVEL.BASIC,
        layoutStyle: TEMPLATE_LAYOUT_STYLE.SIMPLE,
        renderStyle: TEMPLATE_RENDER_STYLE.CLEAN_PREVIEW,

        preset: PRODUCT_PRESET_IDS.BASIC,
        themeId: VISUAL_THEME_IDS.LIGHT_ACADEMIC,
        cameraView: CAMERA_VIEW_IDS.PRODUCT,
        lightingMode: LIGHTING_MODE_IDS.SOFT,
        renderQuality: RENDER_QUALITY_IDS.HIGH,

        commercial: Object.freeze({
            title: "Caja básica",
            positioning: "Detalle económico y accesible para estudiantes.",
            suggestedUse: "Presentaciones finales, agradecimientos simples y entregas rápidas.",
            targetBuyer: "Estudiantes o grupos que buscan un presente económico.",
            targetRecipient: "Docentes, jurados o invitados académicos.",
            pricePreset: PRODUCT_PRESET_IDS.BASIC,
            priceItems: Object.freeze([
                PRICE_ITEM_KEYS.BOX_BASE,
                PRICE_ITEM_KEYS.CARD_MESSAGE,
                PRICE_ITEM_KEYS.CUPCAKE,
                PRICE_ITEM_KEYS.DECORATIVE_ROSE,
                PRICE_ITEM_KEYS.DESIGN_SERVICE_BASIC,
                PRICE_ITEM_KEYS.ASSEMBLY_BASIC,
            ]),
        }),

        visual: Object.freeze({
            boxArtStyle: BOX_ART_STYLES.CLEAN_KRAFT,
            lidDesignStyle: LID_DESIGN_STYLES.SIMPLE_MESSAGE,
            paperFillerStyle: PAPER_FILLER_STYLES.WHITE,
            primaryColor: BRAND_COLORS.KRAFT,
            secondaryColor: BRAND_COLORS.CREAM,
            accentColor: BRAND_COLORS.GOLD,
            textColor: BRAND_COLORS.DARK_BROWN,
            finish: "mate cálido",
        }),

        state: Object.freeze({
            product: Object.freeze({
                preset: PRODUCT_PRESET_IDS.BASIC,
                templateId: DESIGN_TEMPLATE_IDS.BASIC,
                themeId: VISUAL_THEME_IDS.LIGHT_ACADEMIC,
                boxColor: "#c89f72",
                interiorColor: "#f3e0c5",
                accentColor: "#c59a4a",
                logoVariant: LOGO_VARIANTS.LIGHT,
                includeDividers: false,
                includePaperFiller: true,
                includeCard: true,
                includeQR: false,
                includeCupcake: true,
                includeBeverage: false,
                includeRose: true,
                includeKeychain: false,
                includeCareerLogo: false,
                includeThematicDecorations: false,
            }),

            project: Object.freeze({
                ...commonText,
                recipientName: "Docente invitado",
                teamName: "Equipo de proyecto",
                projectName: "Presentación final",
                message: "Gracias por acompañar nuestra presentación.",
                occasion: "presentacion-final",
            }),

            text: Object.freeze({
                lidTitle: "Gracias",
                lidSubtitle: "Presentación final · 2026",
                lidMessage: "Gracias por acompañar nuestra presentación.",
                cardTitle: "Gracias por ser parte",
                cardRecipient: "Docente invitado",
                cardMessage: "Gracias por acompañar nuestra presentación.",
                cardFooter: "KickOff Box",
                frontLabel: "KickOff Box",
                sideLabel: "Caja básica",
                keychainText: "2026",
                keychainSubtitle: "KickOff",
            }),

            qr: Object.freeze({
                enabled: false,
                value: QR_DEFAULTS.VALUE,
                title: "Contenido digital",
                subtitle: "Opcional",
                footer: "KickOff Box",
                contentType: "url",
            }),

            beverage: Object.freeze({
                type: BEVERAGE_PRICE_KEYS.WATER,
                layoutMode: "horizontal",
                labelText: "PURE WATER",
                subLabel: "Natural",
                footerText: "Detalle académico",
                showBubbles: false,
                showCondensation: true,
                showHighlights: true,
            }),

            visibility: Object.freeze({
                ...commonObjectVisibility,
                [OBJECT_KEYS.INTERNAL_DIVIDERS]: false,
                [OBJECT_KEYS.QR_CARD]: false,
                [OBJECT_KEYS.LID_INTERIOR_DESIGN]: false,
                [OBJECT_KEYS.SODA_BOTTLE]: false,
                [OBJECT_KEYS.RESIN_KEYCHAIN]: false,
                [OBJECT_KEYS.CAREER_LOGO_BADGE]: false,
                [OBJECT_KEYS.THEMATIC_DECORATIONS]: false,
            }),

            layout: basicLayout,

            camera: Object.freeze({
                view: CAMERA_VIEW_IDS.PRODUCT,
                autoRotate: false,
                focusObjectKey: null,
                zoomLevel: 1,
            }),

            render: Object.freeze({
                quality: RENDER_QUALITY_IDS.HIGH,
                lightingMode: LIGHTING_MODE_IDS.SOFT,
                shadowsEnabled: true,
                environmentEnabled: true,
                gridVisible: true,
            }),
        }),
    }),

    [DESIGN_TEMPLATE_IDS.STANDARD]: Object.freeze({
        id: DESIGN_TEMPLATE_IDS.STANDARD,
        label: DESIGN_TEMPLATE_LABELS[DESIGN_TEMPLATE_IDS.STANDARD],
        group: TEMPLATE_GROUPS.COMMERCIAL,
        complexity: TEMPLATE_COMPLEXITY.MEDIUM,
        personalizationLevel: TEMPLATE_PERSONALIZATION_LEVEL.MEDIUM,
        layoutStyle: TEMPLATE_LAYOUT_STYLE.BALANCED,
        renderStyle: TEMPLATE_RENDER_STYLE.PRODUCT_RENDER,

        preset: PRODUCT_PRESET_IDS.STANDARD,
        themeId: VISUAL_THEME_IDS.WARM_KRAFT,
        cameraView: CAMERA_VIEW_IDS.PRODUCT,
        lightingMode: LIGHTING_MODE_IDS.STUDIO,
        renderQuality: RENDER_QUALITY_IDS.HIGH,

        commercial: Object.freeze({
            title: "Caja estándar",
            positioning: "Presentación equilibrada con detalle dulce, bebida y souvenir.",
            suggestedUse: "Defensas internas, presentaciones finales y reconocimientos de aula.",
            targetBuyer: "Grupos universitarios que buscan buena presentación sin exceder presupuesto.",
            targetRecipient: "Docentes, tutores, jurados e invitados especiales.",
            pricePreset: PRODUCT_PRESET_IDS.STANDARD,
            priceItems: Object.freeze([
                PRICE_ITEM_KEYS.BOX_BASE,
                PRICE_ITEM_KEYS.PRINTED_EXTERIOR,
                PRICE_ITEM_KEYS.INTERNAL_DIVIDERS,
                PRICE_ITEM_KEYS.PAPER_FILLER,
                PRICE_ITEM_KEYS.CARD_MESSAGE,
                PRICE_ITEM_KEYS.CUPCAKE,
                PRICE_ITEM_KEYS.BEVERAGE,
                PRICE_ITEM_KEYS.DECORATIVE_ROSE,
                PRICE_ITEM_KEYS.ACRYLIC_KEYCHAIN,
                PRICE_ITEM_KEYS.CAREER_LOGO_BADGE,
                PRICE_ITEM_KEYS.DESIGN_SERVICE_STANDARD,
                PRICE_ITEM_KEYS.ASSEMBLY_STANDARD,
            ]),
        }),

        visual: Object.freeze({
            boxArtStyle: BOX_ART_STYLES.ACADEMIC_MINIMAL,
            lidDesignStyle: LID_DESIGN_STYLES.SIMPLE_MESSAGE,
            paperFillerStyle: PAPER_FILLER_STYLES.KRAFT,
            primaryColor: "#a97745",
            secondaryColor: "#ead2ad",
            accentColor: BRAND_COLORS.GOLD,
            textColor: BRAND_COLORS.DARK_BROWN,
            finish: "kraft académico con detalles dorados",
        }),

        state: Object.freeze({
            product: Object.freeze({
                preset: PRODUCT_PRESET_IDS.STANDARD,
                templateId: DESIGN_TEMPLATE_IDS.STANDARD,
                themeId: VISUAL_THEME_IDS.WARM_KRAFT,
                boxColor: "#a97745",
                interiorColor: "#ead2ad",
                accentColor: "#c59a4a",
                logoVariant: LOGO_VARIANTS.LIGHT,
                includeDividers: true,
                includePaperFiller: true,
                includeCard: true,
                includeQR: true,
                includeCupcake: true,
                includeBeverage: true,
                includeRose: true,
                includeKeychain: true,
                includeCareerLogo: true,
                includeThematicDecorations: true,
            }),

            project: Object.freeze({
                ...commonText,
                recipientName: "Jurado Académico",
                teamName: "Equipo de proyecto",
                projectName: "Presentación final",
                message: "Gracias por acompañar nuestra presentación y apoyar este proceso académico.",
                occasion: "presentacion-final",
            }),

            text: Object.freeze({
                lidTitle: "Gracias por acompañar",
                lidSubtitle: "Presentación final · Ingeniería de Sistemas · 2026",
                lidMessage: "Gracias por acompañar nuestra presentación y apoyar este proceso académico.",
                cardTitle: "Gracias por ser parte",
                cardRecipient: "Jurado Académico",
                cardMessage: "Su evaluación impulsa nuestro crecimiento profesional.",
                cardFooter: "KickOff Box 2026",
                frontLabel: "KickOff Box",
                sideLabel: "Caja estándar",
                keychainText: "2026",
                keychainSubtitle: "KickOff",
            }),

            qr: Object.freeze({
                enabled: true,
                value: QR_DEFAULTS.VALUE,
                title: "Contenido digital",
                subtitle: "Escanea para ver el proyecto",
                footer: "KickOff Box 2026",
                contentType: "url",
            }),

            beverage: Object.freeze({
                type: BEVERAGE_PRICE_KEYS.ORANGE,
                layoutMode: "horizontal",
                labelText: "KICK ORANGE",
                subLabel: "Fresh 2026",
                footerText: "Detalle académico",
                showBubbles: true,
                showCondensation: false,
                showHighlights: true,
            }),

            visibility: commonObjectVisibility,
            layout: standardLayout,

            camera: Object.freeze({
                view: CAMERA_VIEW_IDS.PRODUCT,
                autoRotate: false,
                focusObjectKey: null,
                zoomLevel: 1,
            }),

            render: Object.freeze({
                quality: RENDER_QUALITY_IDS.HIGH,
                lightingMode: LIGHTING_MODE_IDS.STUDIO,
                shadowsEnabled: true,
                environmentEnabled: true,
                gridVisible: true,
            }),
        }),
    }),

    [DESIGN_TEMPLATE_IDS.PREMIUM]: Object.freeze({
        id: DESIGN_TEMPLATE_IDS.PREMIUM,
        label: DESIGN_TEMPLATE_LABELS[DESIGN_TEMPLATE_IDS.PREMIUM],
        group: TEMPLATE_GROUPS.COMMERCIAL,
        complexity: TEMPLATE_COMPLEXITY.HIGH,
        personalizationLevel: TEMPLATE_PERSONALIZATION_LEVEL.FULL,
        layoutStyle: TEMPLATE_LAYOUT_STYLE.PREMIUM_PACKAGING,
        renderStyle: TEMPLATE_RENDER_STYLE.PREMIUM_SHOWCASE,

        preset: PRODUCT_PRESET_IDS.PREMIUM,
        themeId: VISUAL_THEME_IDS.PREMIUM_BLACK_GOLD,
        cameraView: CAMERA_VIEW_IDS.PREMIUM_RENDER,
        lightingMode: LIGHTING_MODE_IDS.PREMIUM,
        renderQuality: RENDER_QUALITY_IDS.ULTRA,

        commercial: Object.freeze({
            title: "Caja premium",
            positioning:
                "Empaque académico de alto impacto con estética negra/dorada, QR, bebida acostada, souvenir y composición tipo render comercial.",
            suggestedUse: "Defensas importantes, tribunales, jurados principales e invitados especiales.",
            targetBuyer: "Grupos universitarios que buscan una presentación memorable.",
            targetRecipient: "Jurados, tribunales, docentes, tutores e invitados institucionales.",
            pricePreset: PRODUCT_PRESET_IDS.PREMIUM,
            priceItems: Object.freeze([
                PRICE_ITEM_KEYS.BOX_BASE,
                PRICE_ITEM_KEYS.PRINTED_EXTERIOR,
                PRICE_ITEM_KEYS.PRINTED_INTERIOR,
                PRICE_ITEM_KEYS.INTERNAL_DIVIDERS,
                PRICE_ITEM_KEYS.PAPER_FILLER,
                PRICE_ITEM_KEYS.PREMIUM_FINISH,
                PRICE_ITEM_KEYS.CARD_MESSAGE,
                PRICE_ITEM_KEYS.QR_CARD,
                PRICE_ITEM_KEYS.LID_INTERIOR_DESIGN,
                PRICE_ITEM_KEYS.CUPCAKE,
                PRICE_ITEM_KEYS.BEVERAGE,
                PRICE_ITEM_KEYS.DECORATIVE_ROSE,
                PRICE_ITEM_KEYS.RESIN_KEYCHAIN,
                PRICE_ITEM_KEYS.CAREER_LOGO_BADGE,
                PRICE_ITEM_KEYS.THEMATIC_DECORATIONS,
                PRICE_ITEM_KEYS.DESIGN_SERVICE_PREMIUM,
                PRICE_ITEM_KEYS.ASSEMBLY_PREMIUM,
            ]),
        }),

        visual: Object.freeze({
            boxArtStyle: BOX_ART_STYLES.BLACK_GOLD_STADIUM,
            lidDesignStyle: LID_DESIGN_STYLES.PREMIUM_QR_PANEL,
            paperFillerStyle: PAPER_FILLER_STYLES.BLACK_GOLD,
            primaryColor: BRAND_COLORS.BLACK,
            secondaryColor: BRAND_COLORS.DARK_BROWN,
            accentColor: BRAND_COLORS.GOLD,
            textColor: BRAND_COLORS.CREAM,
            finish: "negro/dorado con brillo premium, líneas de estadio y detalles tecnológicos",
        }),

        state: Object.freeze({
            product: Object.freeze({
                preset: PRODUCT_PRESET_IDS.PREMIUM,
                templateId: DESIGN_TEMPLATE_IDS.PREMIUM,
                themeId: VISUAL_THEME_IDS.PREMIUM_BLACK_GOLD,
                boxColor: "#111111",
                interiorColor: "#1f1710",
                accentColor: "#c59a4a",
                logoVariant: LOGO_VARIANTS.LIGHT,
                includeDividers: true,
                includePaperFiller: true,
                includeCard: true,
                includeQR: true,
                includeCupcake: true,
                includeBeverage: true,
                includeRose: true,
                includeKeychain: true,
                includeCareerLogo: true,
                includeThematicDecorations: true,
            }),

            project: Object.freeze({
                ...commonText,
                recipientName: "Jurado Académico",
                teamName: "Synaptic_4",
                projectName: "KickOff Box",
                message: "Gracias por acompañar nuestra defensa. Este logro también es de ustedes.",
                occasion: "defensa-academica",
            }),

            text: Object.freeze({
                lidTitle: "Gracias por acompañar nuestra defensa",
                lidSubtitle: "Este logro también es de ustedes.",
                lidMessage: "Escanea el QR para ver el proyecto, la presentación o el portafolio digital.",
                cardTitle: "Gracias por ser parte",
                cardRecipient: "Jurado Académico",
                cardMessage: "Su evaluación y acompañamiento hacen parte de este logro académico.",
                cardFooter: "KickOff Box 2026",
                frontLabel: "KickOff Box",
                sideLabel: "Caja premium",
                keychainText: "2026",
                keychainSubtitle: "KickOff",
            }),

            qr: Object.freeze({
                enabled: true,
                value: QR_DEFAULTS.VALUE,
                title: "Contenido digital",
                subtitle: "Escanea para ver el proyecto",
                footer: "KickOff Box 2026",
                contentType: "presentation",
            }),

            beverage: Object.freeze({
                type: BEVERAGE_PRICE_KEYS.COLA,
                layoutMode: "horizontal",
                labelText: "KICK COLA",
                subLabel: "Classic 2026",
                footerText: "Edición académica",
                showBubbles: true,
                showCondensation: false,
                showHighlights: true,
            }),

            visibility: commonObjectVisibility,
            layout: premiumLayout,

            camera: Object.freeze({
                view: CAMERA_VIEW_IDS.PREMIUM_RENDER,
                autoRotate: false,
                focusObjectKey: null,
                zoomLevel: 1,
            }),

            render: Object.freeze({
                quality: RENDER_QUALITY_IDS.ULTRA,
                lightingMode: LIGHTING_MODE_IDS.PREMIUM,
                shadowsEnabled: true,
                environmentEnabled: true,
                gridVisible: false,
            }),
        }),
    }),

    [DESIGN_TEMPLATE_IDS.DEFENSE]: Object.freeze({
        id: DESIGN_TEMPLATE_IDS.DEFENSE,
        label: DESIGN_TEMPLATE_LABELS[DESIGN_TEMPLATE_IDS.DEFENSE],
        group: TEMPLATE_GROUPS.ACADEMIC,
        complexity: TEMPLATE_COMPLEXITY.HIGH,
        personalizationLevel: TEMPLATE_PERSONALIZATION_LEVEL.FULL,
        layoutStyle: TEMPLATE_LAYOUT_STYLE.PRESENTATION,
        renderStyle: TEMPLATE_RENDER_STYLE.PREMIUM_SHOWCASE,

        preset: PRODUCT_PRESET_IDS.PREMIUM,
        themeId: VISUAL_THEME_IDS.WORLD_CUP_2026,
        cameraView: CAMERA_VIEW_IDS.PREMIUM_RENDER,
        lightingMode: LIGHTING_MODE_IDS.DRAMATIC,
        renderQuality: RENDER_QUALITY_IDS.ULTRA,

        commercial: Object.freeze({
            title: "Caja defensa de grado",
            positioning:
                "Plantilla enfocada en defensa, jurado y cierre académico con mensaje de gratitud visible en tapa.",
            suggestedUse: "Defensas de grado, exposición final o presentación de proyecto integrador.",
            targetBuyer: "Equipos que presentan defensa o proyecto final.",
            targetRecipient: "Tribunal evaluador, jurado académico y tutor.",
            pricePreset: PRODUCT_PRESET_IDS.PREMIUM,
            priceItems: Object.freeze([
                PRICE_ITEM_KEYS.BOX_BASE,
                PRICE_ITEM_KEYS.PRINTED_EXTERIOR,
                PRICE_ITEM_KEYS.PRINTED_INTERIOR,
                PRICE_ITEM_KEYS.PAPER_FILLER,
                PRICE_ITEM_KEYS.PREMIUM_FINISH,
                PRICE_ITEM_KEYS.CARD_MESSAGE,
                PRICE_ITEM_KEYS.QR_CARD,
                PRICE_ITEM_KEYS.LID_INTERIOR_DESIGN,
                PRICE_ITEM_KEYS.CUPCAKE,
                PRICE_ITEM_KEYS.BEVERAGE,
                PRICE_ITEM_KEYS.DECORATIVE_ROSE,
                PRICE_ITEM_KEYS.RESIN_KEYCHAIN,
                PRICE_ITEM_KEYS.CAREER_LOGO_BADGE,
                PRICE_ITEM_KEYS.THEMATIC_DECORATIONS,
                PRICE_ITEM_KEYS.DESIGN_SERVICE_PREMIUM,
                PRICE_ITEM_KEYS.ASSEMBLY_PREMIUM,
            ]),
        }),

        visual: Object.freeze({
            boxArtStyle: BOX_ART_STYLES.BOLIVIA_WORLD_CUP,
            lidDesignStyle: LID_DESIGN_STYLES.DEFENSE_MESSAGE,
            paperFillerStyle: PAPER_FILLER_STYLES.BLACK_GOLD,
            primaryColor: "#111111",
            secondaryColor: "#101820",
            accentColor: BRAND_COLORS.GOLD,
            textColor: BRAND_COLORS.CREAM,
            finish: "premium con estadio, QR, logos académicos y mensaje central de defensa",
        }),

        state: Object.freeze({
            product: Object.freeze({
                preset: PRODUCT_PRESET_IDS.PREMIUM,
                templateId: DESIGN_TEMPLATE_IDS.DEFENSE,
                themeId: VISUAL_THEME_IDS.WORLD_CUP_2026,
                boxColor: "#111111",
                interiorColor: "#1f1710",
                accentColor: "#c59a4a",
                logoVariant: LOGO_VARIANTS.LIGHT,
                includeDividers: true,
                includePaperFiller: true,
                includeCard: true,
                includeQR: true,
                includeCupcake: true,
                includeBeverage: true,
                includeRose: true,
                includeKeychain: true,
                includeCareerLogo: true,
                includeThematicDecorations: true,
            }),

            project: Object.freeze({
                ...commonText,
                recipientName: "Tribunal Evaluador",
                teamName: "Synaptic_4",
                projectName: "Proyecto de grado",
                message: "Gracias por acompañar nuestra defensa. Este logro también es de ustedes.",
                occasion: "defensa-grado",
            }),

            text: Object.freeze({
                lidTitle: "Gracias por acompañar nuestra defensa",
                lidSubtitle: "Este logro también es de ustedes.",
                lidMessage: "Tu defensa también se juega como una final.",
                cardTitle: "Gracias por ser parte",
                cardRecipient: "Tribunal Evaluador",
                cardMessage: "Su tiempo, evaluación y orientación hacen parte de este logro.",
                cardFooter: "Defensa académica 2026",
                frontLabel: "KickOff Box",
                sideLabel: "Caja defensa",
                keychainText: "2026",
                keychainSubtitle: "Defensa",
            }),

            qr: Object.freeze({
                enabled: true,
                value: QR_DEFAULTS.VALUE,
                title: "Proyecto digital",
                subtitle: "Escanea para ver la defensa",
                footer: "Defensa 2026",
                contentType: "presentation",
            }),

            beverage: Object.freeze({
                type: BEVERAGE_PRICE_KEYS.COLA,
                layoutMode: "horizontal",
                labelText: "KICK COLA",
                subLabel: "Defense 2026",
                footerText: "Edición defensa",
                showBubbles: true,
                showCondensation: false,
                showHighlights: true,
            }),

            visibility: commonObjectVisibility,
            layout: defenseLayout,

            camera: Object.freeze({
                view: CAMERA_VIEW_IDS.PREMIUM_RENDER,
                autoRotate: false,
                focusObjectKey: null,
                zoomLevel: 1,
            }),

            render: Object.freeze({
                quality: RENDER_QUALITY_IDS.ULTRA,
                lightingMode: LIGHTING_MODE_IDS.DRAMATIC,
                shadowsEnabled: true,
                environmentEnabled: true,
                gridVisible: false,
            }),
        }),
    }),

    [DESIGN_TEMPLATE_IDS.JURY]: Object.freeze({
        id: DESIGN_TEMPLATE_IDS.JURY,
        label: DESIGN_TEMPLATE_LABELS[DESIGN_TEMPLATE_IDS.JURY],
        group: TEMPLATE_GROUPS.ACADEMIC,
        complexity: TEMPLATE_COMPLEXITY.HIGH,
        personalizationLevel: TEMPLATE_PERSONALIZATION_LEVEL.FULL,
        layoutStyle: TEMPLATE_LAYOUT_STYLE.PREMIUM_PACKAGING,
        renderStyle: TEMPLATE_RENDER_STYLE.PREMIUM_SHOWCASE,

        preset: PRODUCT_PRESET_IDS.PREMIUM,
        themeId: VISUAL_THEME_IDS.TECH_SYSTEMS,
        cameraView: CAMERA_VIEW_IDS.PREMIUM_RENDER,
        lightingMode: LIGHTING_MODE_IDS.PREMIUM,
        renderQuality: RENDER_QUALITY_IDS.ULTRA,

        commercial: Object.freeze({
            title: "Caja para jurado",
            positioning:
                "Plantilla elegante para jurados, docentes y tribunales con mensaje formal y souvenir personalizado.",
            suggestedUse: "Evaluaciones académicas, cierre de proyecto, defensa o presentación formal.",
            targetBuyer: "Estudiantes o equipos que preparan un reconocimiento formal.",
            targetRecipient: "Jurado, docente, tribunal o tutor.",
            pricePreset: PRODUCT_PRESET_IDS.PREMIUM,
            priceItems: Object.freeze([
                PRICE_ITEM_KEYS.BOX_BASE,
                PRICE_ITEM_KEYS.PRINTED_EXTERIOR,
                PRICE_ITEM_KEYS.PRINTED_INTERIOR,
                PRICE_ITEM_KEYS.PAPER_FILLER,
                PRICE_ITEM_KEYS.PREMIUM_FINISH,
                PRICE_ITEM_KEYS.CARD_MESSAGE,
                PRICE_ITEM_KEYS.QR_CARD,
                PRICE_ITEM_KEYS.LID_INTERIOR_DESIGN,
                PRICE_ITEM_KEYS.CUPCAKE,
                PRICE_ITEM_KEYS.BEVERAGE,
                PRICE_ITEM_KEYS.DECORATIVE_ROSE,
                PRICE_ITEM_KEYS.RESIN_KEYCHAIN,
                PRICE_ITEM_KEYS.CAREER_LOGO_BADGE,
                PRICE_ITEM_KEYS.THEMATIC_DECORATIONS,
                PRICE_ITEM_KEYS.DESIGN_SERVICE_PREMIUM,
                PRICE_ITEM_KEYS.ASSEMBLY_PREMIUM,
            ]),
        }),

        visual: Object.freeze({
            boxArtStyle: BOX_ART_STYLES.TECH_SYSTEMS,
            lidDesignStyle: LID_DESIGN_STYLES.JURY_THANKS,
            paperFillerStyle: PAPER_FILLER_STYLES.BLACK_GOLD,
            primaryColor: "#101820",
            secondaryColor: "#111111",
            accentColor: BRAND_COLORS.GOLD,
            textColor: BRAND_COLORS.CREAM,
            finish: "formal tecnológico con líneas de sistemas y detalle premium",
        }),

        state: Object.freeze({
            product: Object.freeze({
                preset: PRODUCT_PRESET_IDS.PREMIUM,
                templateId: DESIGN_TEMPLATE_IDS.JURY,
                themeId: VISUAL_THEME_IDS.TECH_SYSTEMS,
                boxColor: "#101820",
                interiorColor: "#121212",
                accentColor: "#c59a4a",
                logoVariant: LOGO_VARIANTS.LIGHT,
                includeDividers: true,
                includePaperFiller: true,
                includeCard: true,
                includeQR: true,
                includeCupcake: true,
                includeBeverage: true,
                includeRose: true,
                includeKeychain: true,
                includeCareerLogo: true,
                includeThematicDecorations: true,
            }),

            project: Object.freeze({
                ...commonText,
                recipientName: "Jurado Académico",
                teamName: "Equipo de proyecto",
                projectName: "Proyecto final",
                message: "Gracias por su tiempo, evaluación y acompañamiento académico.",
                occasion: "reconocimiento-jurado",
            }),

            text: Object.freeze({
                lidTitle: "Gracias por acompañar nuestra evaluación",
                lidSubtitle: "Su criterio impulsa nuestro crecimiento profesional.",
                lidMessage: "Escanee el QR para acceder al proyecto y material complementario.",
                cardTitle: "Reconocimiento académico",
                cardRecipient: "Jurado Académico",
                cardMessage: "Gracias por su tiempo, evaluación y acompañamiento académico.",
                cardFooter: "Ingeniería de Sistemas · UNIFRANZ",
                frontLabel: "KickOff Box",
                sideLabel: "Caja jurado",
                keychainText: "2026",
                keychainSubtitle: "Jurado",
            }),

            qr: Object.freeze({
                enabled: true,
                value: QR_DEFAULTS.VALUE,
                title: "Material complementario",
                subtitle: "Escanea para ver el proyecto",
                footer: "Jurado académico",
                contentType: "portfolio",
            }),

            beverage: Object.freeze({
                type: BEVERAGE_PRICE_KEYS.MINERAL,
                layoutMode: "horizontal",
                labelText: "MINERAL BLUE",
                subLabel: "Sparkling",
                footerText: "Edición jurado",
                showBubbles: true,
                showCondensation: true,
                showHighlights: true,
            }),

            visibility: commonObjectVisibility,
            layout: juryLayout,

            camera: Object.freeze({
                view: CAMERA_VIEW_IDS.PREMIUM_RENDER,
                autoRotate: false,
                focusObjectKey: null,
                zoomLevel: 1,
            }),

            render: Object.freeze({
                quality: RENDER_QUALITY_IDS.ULTRA,
                lightingMode: LIGHTING_MODE_IDS.PREMIUM,
                shadowsEnabled: true,
                environmentEnabled: true,
                gridVisible: false,
            }),
        }),
    }),

    [DESIGN_TEMPLATE_IDS.INSTITUTIONAL]: Object.freeze({
        id: DESIGN_TEMPLATE_IDS.INSTITUTIONAL,
        label: DESIGN_TEMPLATE_LABELS[DESIGN_TEMPLATE_IDS.INSTITUTIONAL],
        group: TEMPLATE_GROUPS.INSTITUTIONAL,
        complexity: TEMPLATE_COMPLEXITY.ADVANCED,
        personalizationLevel: TEMPLATE_PERSONALIZATION_LEVEL.FULL,
        layoutStyle: TEMPLATE_LAYOUT_STYLE.INSTITUTIONAL,
        renderStyle: TEMPLATE_RENDER_STYLE.TECH_ACADEMIC,

        preset: PRODUCT_PRESET_IDS.PREMIUM,
        themeId: VISUAL_THEME_IDS.BOLIVIA_TRICOLOR,
        cameraView: CAMERA_VIEW_IDS.PREMIUM_RENDER,
        lightingMode: LIGHTING_MODE_IDS.PRESENTATION,
        renderQuality: RENDER_QUALITY_IDS.ULTRA,

        commercial: Object.freeze({
            title: "Caja institucional",
            positioning:
                "Plantilla para reconocimientos formales, invitados especiales o entregas institucionales.",
            suggestedUse: "Eventos universitarios, ferias académicas, reconocimientos y entregas especiales.",
            targetBuyer: "Institución, carrera, dirección académica o equipos organizadores.",
            targetRecipient: "Autoridades, docentes, invitados especiales y representantes institucionales.",
            pricePreset: PRODUCT_PRESET_IDS.PREMIUM,
            priceItems: Object.freeze([
                PRICE_ITEM_KEYS.BOX_BASE,
                PRICE_ITEM_KEYS.PRINTED_EXTERIOR,
                PRICE_ITEM_KEYS.PRINTED_INTERIOR,
                PRICE_ITEM_KEYS.PAPER_FILLER,
                PRICE_ITEM_KEYS.PREMIUM_FINISH,
                PRICE_ITEM_KEYS.CARD_MESSAGE,
                PRICE_ITEM_KEYS.QR_CARD,
                PRICE_ITEM_KEYS.LID_INTERIOR_DESIGN,
                PRICE_ITEM_KEYS.CUPCAKE,
                PRICE_ITEM_KEYS.BEVERAGE,
                PRICE_ITEM_KEYS.DECORATIVE_ROSE,
                PRICE_ITEM_KEYS.RESIN_KEYCHAIN,
                PRICE_ITEM_KEYS.CAREER_LOGO_BADGE,
                PRICE_ITEM_KEYS.THEMATIC_DECORATIONS,
                PRICE_ITEM_KEYS.CUSTOM_IMAGE_PRINT,
                PRICE_ITEM_KEYS.DESIGN_SERVICE_PREMIUM,
                PRICE_ITEM_KEYS.ASSEMBLY_PREMIUM,
            ]),
        }),

        visual: Object.freeze({
            boxArtStyle: BOX_ART_STYLES.BOLIVIA_WORLD_CUP,
            lidDesignStyle: LID_DESIGN_STYLES.INSTITUTIONAL_BADGE,
            paperFillerStyle: PAPER_FILLER_STYLES.TRICOLOR,
            primaryColor: BRAND_COLORS.BOLIVIA_RED,
            secondaryColor: BRAND_COLORS.BOLIVIA_GREEN,
            accentColor: BRAND_COLORS.BOLIVIA_YELLOW,
            textColor: BRAND_COLORS.CREAM,
            finish: "institucional con identidad Bolivia, carrera y evento académico",
        }),

        state: Object.freeze({
            product: Object.freeze({
                preset: PRODUCT_PRESET_IDS.PREMIUM,
                templateId: DESIGN_TEMPLATE_IDS.INSTITUTIONAL,
                themeId: VISUAL_THEME_IDS.BOLIVIA_TRICOLOR,
                boxColor: "#7a1e1e",
                interiorColor: "#fff7e8",
                accentColor: "#f0c84b",
                logoVariant: LOGO_VARIANTS.DARK,
                includeDividers: true,
                includePaperFiller: true,
                includeCard: true,
                includeQR: true,
                includeCupcake: true,
                includeBeverage: true,
                includeRose: true,
                includeKeychain: true,
                includeCareerLogo: true,
                includeThematicDecorations: true,
            }),

            project: Object.freeze({
                ...commonText,
                recipientName: "Invitado Especial",
                teamName: "Ingeniería de Sistemas",
                projectName: "Reconocimiento académico",
                message: "Gracias por acompañar este espacio académico e institucional.",
                occasion: "evento-institucional",
            }),

            text: Object.freeze({
                lidTitle: "Reconocimiento institucional",
                lidSubtitle: "Ingeniería de Sistemas · UNIFRANZ · Bolivia",
                lidMessage: "Gracias por acompañar este espacio académico e institucional.",
                cardTitle: "Reconocimiento",
                cardRecipient: "Invitado Especial",
                cardMessage: "Gracias por acompañar este espacio académico e institucional.",
                cardFooter: "UNIFRANZ · 2026",
                frontLabel: "KickOff Box",
                sideLabel: "Caja institucional",
                keychainText: "2026",
                keychainSubtitle: "UNIFRANZ",
            }),

            qr: Object.freeze({
                enabled: true,
                value: QR_DEFAULTS.VALUE,
                title: "Información institucional",
                subtitle: "Escanea para ver el contenido",
                footer: "UNIFRANZ · Ingeniería de Sistemas",
                contentType: "url",
            }),

            beverage: Object.freeze({
                type: BEVERAGE_PRICE_KEYS.SPORT,
                layoutMode: "horizontal",
                labelText: "SPORT AQUA",
                subLabel: "Active 2026",
                footerText: "Institucional",
                showBubbles: false,
                showCondensation: true,
                showHighlights: true,
            }),

            visibility: commonObjectVisibility,
            layout: institutionalLayout,

            camera: Object.freeze({
                view: CAMERA_VIEW_IDS.PREMIUM_RENDER,
                autoRotate: false,
                focusObjectKey: null,
                zoomLevel: 1,
            }),

            render: Object.freeze({
                quality: RENDER_QUALITY_IDS.ULTRA,
                lightingMode: LIGHTING_MODE_IDS.PRESENTATION,
                shadowsEnabled: true,
                environmentEnabled: true,
                gridVisible: false,
            }),
        }),
    }),
});

export const DEFAULT_TEMPLATE_ID = DESIGN_TEMPLATE_IDS.PREMIUM;

export const TEMPLATE_DISPLAY_ORDER = Object.freeze([
    DESIGN_TEMPLATE_IDS.BASIC,
    DESIGN_TEMPLATE_IDS.STANDARD,
    DESIGN_TEMPLATE_IDS.PREMIUM,
    DESIGN_TEMPLATE_IDS.DEFENSE,
    DESIGN_TEMPLATE_IDS.JURY,
    DESIGN_TEMPLATE_IDS.INSTITUTIONAL,
]);

export const TEMPLATE_RECOMMENDATIONS = Object.freeze({
    studentBudget: DESIGN_TEMPLATE_IDS.BASIC,
    balancedGift: DESIGN_TEMPLATE_IDS.STANDARD,
    premiumPresentation: DESIGN_TEMPLATE_IDS.PREMIUM,
    finalDefense: DESIGN_TEMPLATE_IDS.DEFENSE,
    juryRecognition: DESIGN_TEMPLATE_IDS.JURY,
    institutionalEvent: DESIGN_TEMPLATE_IDS.INSTITUTIONAL,
});

function isPlainObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cloneDeep(value) {
    if (Array.isArray(value)) {
        return value.map((item) => cloneDeep(item));
    }

    if (isPlainObject(value)) {
        return Object.fromEntries(
            Object.entries(value).map(([key, item]) => [key, cloneDeep(item)]),
        );
    }

    return value;
}

function mergeDeep(base, override) {
    if (!isPlainObject(base) || !isPlainObject(override)) {
        return cloneDeep(override ?? base);
    }

    const result = cloneDeep(base);

    Object.entries(override).forEach(([key, value]) => {
        if (isPlainObject(value) && isPlainObject(result[key])) {
            result[key] = mergeDeep(result[key], value);
            return;
        }

        result[key] = cloneDeep(value);
    });

    return result;
}

export function getDesignTemplate(templateId = DEFAULT_TEMPLATE_ID) {
    return DESIGN_TEMPLATES[templateId] ?? DESIGN_TEMPLATES[DEFAULT_TEMPLATE_ID];
}

export function getDesignTemplateState(templateId = DEFAULT_TEMPLATE_ID) {
    return cloneDeep(getDesignTemplate(templateId).state);
}

export function getDesignTemplateOptions() {
    return TEMPLATE_DISPLAY_ORDER.map((templateId) => {
        const template = getDesignTemplate(templateId);

        return {
            id: template.id,
            label: template.label,
            group: template.group,
            complexity: template.complexity,
            personalizationLevel: template.personalizationLevel,
            preset: template.preset,
            themeId: template.themeId,
            title: template.commercial.title,
            positioning: template.commercial.positioning,
            suggestedUse: template.commercial.suggestedUse,
        };
    });
}

export function getTemplatesByPreset(presetId) {
    return TEMPLATE_DISPLAY_ORDER
        .map((templateId) => getDesignTemplate(templateId))
        .filter((template) => template.preset === presetId);
}

export function getTemplatesByGroup(group) {
    return TEMPLATE_DISPLAY_ORDER
        .map((templateId) => getDesignTemplate(templateId))
        .filter((template) => template.group === group);
}

export function getRecommendedTemplateId(context = {}) {
    if (context.institutional) return TEMPLATE_RECOMMENDATIONS.institutionalEvent;
    if (context.jury || context.tribunal) return TEMPLATE_RECOMMENDATIONS.juryRecognition;
    if (context.defense || context.finalDefense) return TEMPLATE_RECOMMENDATIONS.finalDefense;
    if (context.premium) return TEMPLATE_RECOMMENDATIONS.premiumPresentation;
    if (context.budget === "low" || context.studentBudget) return TEMPLATE_RECOMMENDATIONS.studentBudget;

    return TEMPLATE_RECOMMENDATIONS.balancedGift;
}

export function applyTemplateToState(baseState, templateId = DEFAULT_TEMPLATE_ID, overrides = {}) {
    const templateState = getDesignTemplateState(templateId);

    return mergeDeep(
        mergeDeep(baseState, templateState),
        {
            ...overrides,
            template: {
                appliedTemplateId: templateId,
                appliedPreset: templateState.product?.preset,
                appliedThemeId: templateState.product?.themeId,
                lastAppliedAt: new Date().toISOString(),
                pendingTemplateChanges: false,
            },
            runtime: {
                ...(baseState.runtime ?? {}),
                hasUnsavedChanges: true,
                lastUpdatedAt: new Date().toISOString(),
            },
        },
    );
}

export function getTemplateObjectVisibility(templateId = DEFAULT_TEMPLATE_ID) {
    return cloneDeep(getDesignTemplate(templateId).state.visibility ?? {});
}

export function getTemplateObjectLayout(templateId = DEFAULT_TEMPLATE_ID) {
    return cloneDeep(getDesignTemplate(templateId).state.layout ?? {});
}

export function getTemplatePriceItems(templateId = DEFAULT_TEMPLATE_ID) {
    return [...(getDesignTemplate(templateId).commercial.priceItems ?? [])];
}

export function getTemplateVisualConfig(templateId = DEFAULT_TEMPLATE_ID) {
    return cloneDeep(getDesignTemplate(templateId).visual ?? {});
}

export function isValidDesignTemplateId(templateId) {
    return Object.prototype.hasOwnProperty.call(DESIGN_TEMPLATES, templateId);
}
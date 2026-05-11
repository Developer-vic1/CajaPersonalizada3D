import * as THREE from "three";

import {
    ASSET_PATHS,
    PUBLIC_PATHS,
    LOGO_VARIANTS,
    DEFAULT_LOGO_VARIANT,
    SUPPORTED_ASSET_TYPES,
    SUPPORTED_FILE_EXTENSIONS,
    FILE_LIMITS,
    FILE_ERROR_MESSAGES,
    megabytesToBytes,
    getLogoPath,
} from "../constants/appConstants.js";

import {
    TEXTURE_QUALITY,
    createTextureFromImageSource,
    createLogoImageTexture,
    createCustomImageTexture,
    createLogoBadgeTexture,
    disposeTextureResource,
} from "../utils/textureFactory.js";

export const ASSET_LOADER_VERSION = "1.0.0";

export const ASSET_TYPES = Object.freeze({
    IMAGE: "image",
    TEXTURE: "texture",
    MODEL: "model",
    LOGO: "logo",
    USER_UPLOAD: "user-upload",
    GENERATED: "generated",
    JSON: "json",
});

export const ASSET_STATUS = Object.freeze({
    IDLE: "idle",
    LOADING: "loading",
    READY: "ready",
    FAILED: "failed",
    DISPOSED: "disposed",
});

export const IMAGE_TARGETS = Object.freeze({
    LID_IMAGE: "lidImage",
    FRONT_STICKER: "frontStickerImage",
    BOTTLE_LABEL: "bottleLabelImage",
    CARD_IMAGE: "cardImage",
    CUSTOM_LOGO: "customLogoImage",
    GENERIC: "genericImage",
});

export const TEXTURE_USAGE = Object.freeze({
    COLOR: "color",
    DATA: "data",
    ALPHA: "alpha",
    NORMAL: "normal",
    ROUGHNESS: "roughness",
    METALNESS: "metalness",
    EMISSIVE: "emissive",
});

export const ASSET_CACHE_KEYS = Object.freeze({
    LOGO_LIGHT: "logo:light",
    LOGO_DARK: "logo:dark",
    LOGO_BADGE_LIGHT: "logo-badge:light",
    LOGO_BADGE_DARK: "logo-badge:dark",
});

export const DEFAULT_ASSET_LOADER_OPTIONS = Object.freeze({
    crossOrigin: "anonymous",
    textureQuality: TEXTURE_QUALITY.HIGH,
    maxImageSizeMB: FILE_LIMITS.MAX_IMAGE_SIZE_MB,
    maxTextureWidth: FILE_LIMITS.MAX_TEXTURE_WIDTH,
    maxTextureHeight: FILE_LIMITS.MAX_TEXTURE_HEIGHT,
    recommendedTextureWidth: FILE_LIMITS.RECOMMENDED_TEXTURE_WIDTH,
    recommendedTextureHeight: FILE_LIMITS.RECOMMENDED_TEXTURE_HEIGHT,
    useCache: true,
    generateFallbacks: true,
});

function nowISO() {
    return new Date().toISOString();
}

function isPlainObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cloneDeep(value) {
    if (typeof structuredClone === "function") {
        try {
            return structuredClone(value);
        } catch {
            return cloneDeepFallback(value);
        }
    }

    return cloneDeepFallback(value);
}

function cloneDeepFallback(value) {
    if (Array.isArray(value)) {
        return value.map((item) => cloneDeepFallback(item));
    }

    if (isPlainObject(value)) {
        return Object.fromEntries(
            Object.entries(value).map(([key, item]) => [key, cloneDeepFallback(item)]),
        );
    }

    return value;
}

function normalizeOptions(options = {}) {
    return {
        ...DEFAULT_ASSET_LOADER_OPTIONS,
        ...options,
    };
}

function normalizePath(path = "") {
    if (!path) return "";

    if (
        path.startsWith("http://") ||
        path.startsWith("https://") ||
        path.startsWith("data:") ||
        path.startsWith("blob:")
    ) {
        return path;
    }

    return path.startsWith("/") ? path : `/${path}`;
}

function getFileExtension(filename = "") {
    const index = filename.lastIndexOf(".");
    if (index === -1) return "";

    return filename.slice(index).toLowerCase();
}

function createAssetId(prefix = "asset") {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 10)}`;
}

function createAssetRecord(data = {}) {
    return {
        id: data.id ?? createAssetId(data.type ?? "asset"),
        type: data.type ?? ASSET_TYPES.IMAGE,
        status: data.status ?? ASSET_STATUS.READY,
        name: data.name ?? "asset",
        source: data.source ?? null,
        mimeType: data.mimeType ?? null,
        sizeBytes: data.sizeBytes ?? null,
        width: data.width ?? null,
        height: data.height ?? null,
        aspectRatio: data.aspectRatio ?? null,
        texture: data.texture ?? null,
        image: data.image ?? null,
        dataUrl: data.dataUrl ?? null,
        objectUrl: data.objectUrl ?? null,
        metadata: data.metadata ?? {},
        createdAt: data.createdAt ?? nowISO(),
        updatedAt: data.updatedAt ?? nowISO(),
        error: data.error ?? null,
    };
}

function createLoadResult(ok, payload = {}) {
    return {
        ok,
        status: ok ? ASSET_STATUS.READY : ASSET_STATUS.FAILED,
        ...payload,
        at: nowISO(),
    };
}

function createValidationResult(valid, errors = [], warnings = [], metadata = {}) {
    return {
        valid,
        errors,
        warnings,
        metadata,
        checkedAt: nowISO(),
    };
}

function getImageDimensionsFromElement(image) {
    const width = image.naturalWidth || image.width || 0;
    const height = image.naturalHeight || image.height || 0;

    return {
        width,
        height,
        aspectRatio: height ? width / height : 1,
    };
}

function getTextureFilters(usage = TEXTURE_USAGE.COLOR) {
    if (
        usage === TEXTURE_USAGE.NORMAL ||
        usage === TEXTURE_USAGE.ROUGHNESS ||
        usage === TEXTURE_USAGE.METALNESS ||
        usage === TEXTURE_USAGE.DATA
    ) {
        return {
            colorSpace: THREE.LinearSRGBColorSpace,
            minFilter: THREE.LinearMipmapLinearFilter,
            magFilter: THREE.LinearFilter,
            generateMipmaps: true,
        };
    }

    return {
        colorSpace: THREE.SRGBColorSpace,
        minFilter: THREE.LinearMipmapLinearFilter,
        magFilter: THREE.LinearFilter,
        generateMipmaps: true,
    };
}

function applyTextureSettings(texture, options = {}) {
    const usage = options.usage ?? TEXTURE_USAGE.COLOR;
    const filters = getTextureFilters(usage);

    texture.colorSpace = options.colorSpace ?? filters.colorSpace;
    texture.minFilter = options.minFilter ?? filters.minFilter;
    texture.magFilter = options.magFilter ?? filters.magFilter;
    texture.generateMipmaps = options.generateMipmaps ?? filters.generateMipmaps;
    texture.wrapS = options.wrapS ?? THREE.ClampToEdgeWrapping;
    texture.wrapT = options.wrapT ?? THREE.ClampToEdgeWrapping;
    texture.flipY = options.flipY ?? true;
    texture.anisotropy = options.anisotropy ?? options.maxAnisotropy ?? TEXTURE_QUALITY.HIGH.anisotropy;
    texture.needsUpdate = true;

    texture.userData = {
        ...(texture.userData ?? {}),
        usage,
        source: options.source ?? texture.userData?.source ?? null,
        assetName: options.name ?? texture.userData?.assetName ?? null,
        loadedAt: nowISO(),
        loaderVersion: ASSET_LOADER_VERSION,
    };

    return texture;
}

function validateFileExtension(file) {
    const extension = getFileExtension(file.name);

    return SUPPORTED_FILE_EXTENSIONS.IMAGE.includes(extension);
}

function validateFileMimeType(file) {
    return SUPPORTED_ASSET_TYPES.IMAGE.includes(file.type);
}

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("No se pudo leer el archivo seleccionado."));
        reader.onabort = () => reject(new Error("La lectura del archivo fue cancelada."));
        reader.readAsDataURL(file);
    });
}

function loadImageFromSource(src, options = {}) {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`No se pudo cargar la imagen: ${src}`));

        if (options.crossOrigin !== false && !String(src).startsWith("data:") && !String(src).startsWith("blob:")) {
            image.crossOrigin = options.crossOrigin ?? "anonymous";
        }

        image.src = src;
    });
}

function resizeImageToCanvas(image, options = {}) {
    const maxWidth = options.maxWidth ?? FILE_LIMITS.RECOMMENDED_TEXTURE_WIDTH;
    const maxHeight = options.maxHeight ?? FILE_LIMITS.RECOMMENDED_TEXTURE_HEIGHT;
    const fit = options.fit ?? "contain";
    const background = options.background ?? "rgba(255,255,255,0)";

    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;
    const sourceAspect = sourceWidth / sourceHeight;
    const targetAspect = maxWidth / maxHeight;

    const canvas = document.createElement("canvas");
    canvas.width = maxWidth;
    canvas.height = maxHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("No se pudo crear canvas para redimensionar imagen.");
    }

    ctx.clearRect(0, 0, maxWidth, maxHeight);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, maxWidth, maxHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    let drawWidth = maxWidth;
    let drawHeight = maxHeight;
    let drawX = 0;
    let drawY = 0;

    if (fit === "cover") {
        if (sourceAspect > targetAspect) {
            drawHeight = maxHeight;
            drawWidth = maxHeight * sourceAspect;
            drawX = (maxWidth - drawWidth) / 2;
        } else {
            drawWidth = maxWidth;
            drawHeight = maxWidth / sourceAspect;
            drawY = (maxHeight - drawHeight) / 2;
        }
    } else {
        if (sourceAspect > targetAspect) {
            drawWidth = maxWidth;
            drawHeight = maxWidth / sourceAspect;
            drawY = (maxHeight - drawHeight) / 2;
        } else {
            drawHeight = maxHeight;
            drawWidth = maxHeight * sourceAspect;
            drawX = (maxWidth - drawWidth) / 2;
        }
    }

    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);

    return {
        canvas,
        width: maxWidth,
        height: maxHeight,
        sourceWidth,
        sourceHeight,
        drawWidth,
        drawHeight,
        drawX,
        drawY,
    };
}

function createTextureFromCanvas(canvas, options = {}) {
    const texture = new THREE.CanvasTexture(canvas);

    applyTextureSettings(texture, {
        ...options,
        source: options.source ?? "canvas",
    });

    return texture;
}

function normalizeLogoVariant(variant = DEFAULT_LOGO_VARIANT) {
    return Object.values(LOGO_VARIANTS).includes(variant)
        ? variant
        : DEFAULT_LOGO_VARIANT;
}

export function validateImageFile(file, options = {}) {
    const normalized = normalizeOptions(options);
    const errors = [];
    const warnings = [];

    if (!file) {
        errors.push("No se seleccionó ningún archivo.");
        return createValidationResult(false, errors, warnings);
    }

    if (!validateFileMimeType(file)) {
        errors.push(FILE_ERROR_MESSAGES.INVALID_IMAGE_TYPE);
    }

    if (!validateFileExtension(file)) {
        warnings.push("La extensión del archivo no coincide con los formatos recomendados.");
    }

    const maxBytes = megabytesToBytes(normalized.maxImageSizeMB);

    if (file.size > maxBytes) {
        errors.push(FILE_ERROR_MESSAGES.IMAGE_TOO_LARGE);
    }

    return createValidationResult(errors.length === 0, errors, warnings, {
        name: file.name,
        type: file.type,
        sizeBytes: file.size,
        sizeMB: Math.round((file.size / 1024 / 1024) * 100) / 100,
        maxSizeMB: normalized.maxImageSizeMB,
    });
}

export function validateImageDimensions(image, options = {}) {
    const normalized = normalizeOptions(options);
    const errors = [];
    const warnings = [];
    const dimensions = getImageDimensionsFromElement(image);

    if (!dimensions.width || !dimensions.height) {
        errors.push("No se pudieron detectar las dimensiones de la imagen.");
    }

    if (dimensions.width > normalized.maxTextureWidth || dimensions.height > normalized.maxTextureHeight) {
        warnings.push(
            `La imagen supera ${normalized.maxTextureWidth}x${normalized.maxTextureHeight}px; será ajustada para optimizar el render.`,
        );
    }

    if (dimensions.width < 256 || dimensions.height < 256) {
        warnings.push("La imagen es pequeña; puede verse pixelada en el render 3D.");
    }

    return createValidationResult(errors.length === 0, errors, warnings, dimensions);
}

export async function loadImageFile(file, options = {}) {
    const normalized = normalizeOptions(options);
    const validation = validateImageFile(file, normalized);

    if (!validation.valid) {
        return createLoadResult(false, {
            validation,
            error: validation.errors.join(" "),
        });
    }

    try {
        const dataUrl = await readFileAsDataUrl(file);
        const image = await loadImageFromSource(dataUrl, {
            crossOrigin: false,
        });

        const dimensionValidation = validateImageDimensions(image, normalized);
        const dimensions = getImageDimensionsFromElement(image);

        return createLoadResult(true, {
            asset: createAssetRecord({
                type: ASSET_TYPES.USER_UPLOAD,
                name: file.name,
                source: "file",
                mimeType: file.type,
                sizeBytes: file.size,
                width: dimensions.width,
                height: dimensions.height,
                aspectRatio: dimensions.aspectRatio,
                image,
                dataUrl,
                metadata: {
                    target: options.target ?? IMAGE_TARGETS.GENERIC,
                    validation,
                    dimensionValidation,
                    originalFileName: file.name,
                },
            }),
            validation: {
                ...validation,
                warnings: [
                    ...validation.warnings,
                    ...dimensionValidation.warnings,
                ],
            },
        });
    } catch (error) {
        return createLoadResult(false, {
            validation,
            error: error.message || FILE_ERROR_MESSAGES.IMAGE_LOAD_FAILED,
        });
    }
}

export async function loadImageUrl(src, options = {}) {
    const normalized = normalizeOptions(options);
    const path = normalizePath(src);

    try {
        const image = await loadImageFromSource(path, normalized);
        const dimensions = getImageDimensionsFromElement(image);
        const dimensionValidation = validateImageDimensions(image, normalized);

        return createLoadResult(true, {
            asset: createAssetRecord({
                type: ASSET_TYPES.IMAGE,
                name: options.name ?? path.split("/").pop() ?? "image",
                source: path,
                mimeType: options.mimeType ?? null,
                width: dimensions.width,
                height: dimensions.height,
                aspectRatio: dimensions.aspectRatio,
                image,
                metadata: {
                    validation: dimensionValidation,
                    target: options.target ?? IMAGE_TARGETS.GENERIC,
                },
            }),
            validation: dimensionValidation,
        });
    } catch (error) {
        return createLoadResult(false, {
            error: error.message || FILE_ERROR_MESSAGES.IMAGE_LOAD_FAILED,
        });
    }
}

export async function loadTextureUrl(src, options = {}) {
    const normalized = normalizeOptions(options);
    const path = normalizePath(src);
    const manager = options.manager ?? createLoadingManager(options.callbacks ?? {});
    const loader = new THREE.TextureLoader(manager);

    loader.setCrossOrigin(normalized.crossOrigin);

    try {
        const texture = await loader.loadAsync(path);

        applyTextureSettings(texture, {
            ...options,
            source: path,
            maxAnisotropy: options.maxAnisotropy,
        });

        const image = texture.image;
        const dimensions = image ? getImageDimensionsFromElement(image) : {};

        return createLoadResult(true, {
            asset: createAssetRecord({
                type: ASSET_TYPES.TEXTURE,
                name: options.name ?? path.split("/").pop() ?? "texture",
                source: path,
                width: dimensions.width ?? null,
                height: dimensions.height ?? null,
                aspectRatio: dimensions.aspectRatio ?? null,
                texture,
                image,
                metadata: {
                    usage: options.usage ?? TEXTURE_USAGE.COLOR,
                    target: options.target ?? IMAGE_TARGETS.GENERIC,
                },
            }),
            texture,
        });
    } catch (error) {
        return createLoadResult(false, {
            error: error.message || `No se pudo cargar la textura: ${path}`,
        });
    }
}

export async function createTextureFromImageFile(file, options = {}) {
    const result = await loadImageFile(file, options);

    if (!result.ok) return result;

    try {
        const image = result.asset.image;
        const shouldResize =
            options.resize !== false &&
            (
                image.width > (options.maxWidth ?? FILE_LIMITS.RECOMMENDED_TEXTURE_WIDTH) ||
                image.height > (options.maxHeight ?? FILE_LIMITS.RECOMMENDED_TEXTURE_HEIGHT) ||
                options.forceResize
            );

        let texture;
        let resizeInfo = null;

        if (shouldResize) {
            resizeInfo = resizeImageToCanvas(image, {
                maxWidth: options.maxWidth ?? FILE_LIMITS.RECOMMENDED_TEXTURE_WIDTH,
                maxHeight: options.maxHeight ?? FILE_LIMITS.RECOMMENDED_TEXTURE_HEIGHT,
                fit: options.fit ?? "contain",
                background: options.background ?? "rgba(255,255,255,0)",
            });

            texture = createTextureFromCanvas(resizeInfo.canvas, {
                ...options,
                source: result.asset.name,
                name: result.asset.name,
            });
        } else {
            const resource = createCustomImageTexture(image, {
                size: {
                    width: image.width,
                    height: image.height,
                },
                fit: options.fit ?? "contain",
                background: options.background ?? "rgba(255,255,255,0)",
                quality: options.textureQuality ?? TEXTURE_QUALITY.HIGH,
            });

            texture = resource.texture;
        }

        result.asset.texture = texture;
        result.asset.type = ASSET_TYPES.TEXTURE;
        result.asset.metadata = {
            ...result.asset.metadata,
            usage: options.usage ?? TEXTURE_USAGE.COLOR,
            resized: Boolean(resizeInfo),
            resizeInfo: resizeInfo
                ? {
                    width: resizeInfo.width,
                    height: resizeInfo.height,
                    sourceWidth: resizeInfo.sourceWidth,
                    sourceHeight: resizeInfo.sourceHeight,
                }
                : null,
        };

        return {
            ...result,
            texture,
            asset: result.asset,
        };
    } catch (error) {
        return createLoadResult(false, {
            error: error.message,
            sourceResult: result,
        });
    }
}

export async function createTextureFromImageAsset(asset, options = {}) {
    if (!asset?.image && !asset?.dataUrl && !asset?.source) {
        return createLoadResult(false, {
            error: "El asset no contiene imagen, dataUrl ni source.",
        });
    }

    try {
        const image = asset.image ?? await loadImageFromSource(asset.dataUrl ?? asset.source, options);
        const resource = createCustomImageTexture(image, {
            size: options.size ?? {
                width: options.width ?? FILE_LIMITS.RECOMMENDED_TEXTURE_WIDTH,
                height: options.height ?? FILE_LIMITS.RECOMMENDED_TEXTURE_HEIGHT,
            },
            fit: options.fit ?? "contain",
            background: options.background ?? "rgba(255,255,255,0)",
            quality: options.textureQuality ?? TEXTURE_QUALITY.HIGH,
        });

        return createLoadResult(true, {
            asset: createAssetRecord({
                ...asset,
                type: ASSET_TYPES.TEXTURE,
                texture: resource.texture,
                image,
                metadata: {
                    ...(asset.metadata ?? {}),
                    textureResource: resource.meta,
                },
            }),
            texture: resource.texture,
            resource,
        });
    } catch (error) {
        return createLoadResult(false, {
            error: error.message,
        });
    }
}

export async function loadLogoAsset(variant = DEFAULT_LOGO_VARIANT, options = {}) {
    const safeVariant = normalizeLogoVariant(variant);
    const path = getLogoPath(safeVariant);
    const cacheKey = safeVariant === LOGO_VARIANTS.DARK
        ? ASSET_CACHE_KEYS.LOGO_DARK
        : ASSET_CACHE_KEYS.LOGO_LIGHT;

    try {
        const resource = await createLogoImageTexture(safeVariant, {
            quality: options.textureQuality ?? TEXTURE_QUALITY.HIGH,
            size: options.size,
            background: options.background ?? "rgba(255,255,255,0)",
        });

        return createLoadResult(true, {
            cacheKey,
            asset: createAssetRecord({
                type: ASSET_TYPES.LOGO,
                name: `Logo ${safeVariant}`,
                source: path,
                width: resource.width,
                height: resource.height,
                aspectRatio: resource.height ? resource.width / resource.height : 1,
                texture: resource.texture,
                image: resource.canvas,
                metadata: {
                    variant: safeVariant,
                    resource: resource.meta,
                    fallback: false,
                },
            }),
            texture: resource.texture,
            resource,
        });
    } catch (error) {
        if (!options.generateFallbacks && !DEFAULT_ASSET_LOADER_OPTIONS.generateFallbacks) {
            return createLoadResult(false, {
                cacheKey,
                error: error.message,
            });
        }

        const fallback = createLogoBadgeTexture({
            variant: safeVariant,
            quality: options.textureQuality ?? TEXTURE_QUALITY.HIGH,
        });

        return createLoadResult(true, {
            cacheKey,
            asset: createAssetRecord({
                type: ASSET_TYPES.LOGO,
                name: `Logo ${safeVariant} fallback`,
                source: path,
                width: fallback.width,
                height: fallback.height,
                aspectRatio: fallback.height ? fallback.width / fallback.height : 1,
                texture: fallback.texture,
                image: fallback.canvas,
                metadata: {
                    variant: safeVariant,
                    resource: fallback.meta,
                    fallback: true,
                    fallbackReason: error.message,
                },
            }),
            texture: fallback.texture,
            resource: fallback,
        });
    }
}

export async function loadDefaultLogos(options = {}) {
    const [light, dark] = await Promise.all([
        loadLogoAsset(LOGO_VARIANTS.LIGHT, options),
        loadLogoAsset(LOGO_VARIANTS.DARK, options),
    ]);

    return {
        light,
        dark,
        ok: light.ok && dark.ok,
        loadedAt: nowISO(),
    };
}

export function createLoadingManager(callbacks = {}) {
    const manager = new THREE.LoadingManager();

    manager.onStart = (url, itemsLoaded, itemsTotal) => {
        callbacks.onStart?.({
            url,
            itemsLoaded,
            itemsTotal,
            progress: itemsTotal ? itemsLoaded / itemsTotal : 0,
        });
    };

    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
        callbacks.onProgress?.({
            url,
            itemsLoaded,
            itemsTotal,
            progress: itemsTotal ? itemsLoaded / itemsTotal : 0,
        });
    };

    manager.onLoad = () => {
        callbacks.onLoad?.({
            progress: 1,
            completedAt: nowISO(),
        });
    };

    manager.onError = (url) => {
        callbacks.onError?.({
            url,
            error: `Error cargando recurso: ${url}`,
        });
    };

    return manager;
}

export function createAssetRegistry(initialAssets = {}) {
    const records = new Map();
    const textureCache = new Map();
    const objectUrls = new Set();

    Object.entries(initialAssets).forEach(([key, value]) => {
        records.set(key, value);
    });

    function set(key, asset) {
        const record = createAssetRecord(asset);
        records.set(key, record);

        if (record.texture) {
            textureCache.set(key, record.texture);
        }

        if (record.objectUrl) {
            objectUrls.add(record.objectUrl);
        }

        return record;
    }

    function get(key) {
        return records.get(key) ?? null;
    }

    function has(key) {
        return records.has(key);
    }

    function remove(key, options = {}) {
        const record = records.get(key);

        if (!record) return false;

        if (options.disposeTexture !== false && record.texture?.dispose) {
            record.texture.dispose();
        }

        if (record.objectUrl) {
            URL.revokeObjectURL(record.objectUrl);
            objectUrls.delete(record.objectUrl);
        }

        records.delete(key);
        textureCache.delete(key);

        return true;
    }

    function clear(options = {}) {
        [...records.keys()].forEach((key) => remove(key, options));
        records.clear();
        textureCache.clear();

        objectUrls.forEach((url) => URL.revokeObjectURL(url));
        objectUrls.clear();
    }

    function list() {
        return [...records.entries()].map(([key, asset]) => ({
            key,
            ...asset,
        }));
    }

    function toJSON() {
        return list().map((asset) => ({
            key: asset.key,
            id: asset.id,
            type: asset.type,
            status: asset.status,
            name: asset.name,
            source: asset.source,
            mimeType: asset.mimeType,
            sizeBytes: asset.sizeBytes,
            width: asset.width,
            height: asset.height,
            aspectRatio: asset.aspectRatio,
            metadata: asset.metadata,
            createdAt: asset.createdAt,
            updatedAt: asset.updatedAt,
            error: asset.error,
        }));
    }

    return {
        set,
        get,
        has,
        remove,
        clear,
        list,
        toJSON,
        get size() {
            return records.size;
        },
    };
}

export function createAssetLoader(options = {}) {
    const normalized = normalizeOptions(options);
    const registry = createAssetRegistry();
    const manager = createLoadingManager(options.callbacks ?? {});

    async function loadTexture(key, src, textureOptions = {}) {
        if (normalized.useCache && registry.has(key)) {
            return createLoadResult(true, {
                asset: registry.get(key),
                fromCache: true,
            });
        }

        const result = await loadTextureUrl(src, {
            ...normalized,
            ...textureOptions,
            manager,
        });

        if (result.ok) {
            registry.set(key, result.asset);
        }

        return result;
    }

    async function loadImage(key, src, imageOptions = {}) {
        if (normalized.useCache && registry.has(key)) {
            return createLoadResult(true, {
                asset: registry.get(key),
                fromCache: true,
            });
        }

        const result = await loadImageUrl(src, {
            ...normalized,
            ...imageOptions,
        });

        if (result.ok) {
            registry.set(key, result.asset);
        }

        return result;
    }

    async function loadUserImage(key, file, imageOptions = {}) {
        const result = await createTextureFromImageFile(file, {
            ...normalized,
            ...imageOptions,
        });

        if (result.ok) {
            registry.set(key, result.asset);
        }

        return result;
    }

    async function loadLogo(variant = DEFAULT_LOGO_VARIANT, logoOptions = {}) {
        const safeVariant = normalizeLogoVariant(variant);
        const key = safeVariant === LOGO_VARIANTS.DARK
            ? ASSET_CACHE_KEYS.LOGO_DARK
            : ASSET_CACHE_KEYS.LOGO_LIGHT;

        if (normalized.useCache && registry.has(key)) {
            return createLoadResult(true, {
                asset: registry.get(key),
                fromCache: true,
            });
        }

        const result = await loadLogoAsset(safeVariant, {
            ...normalized,
            ...logoOptions,
        });

        if (result.ok) {
            registry.set(key, result.asset);
        }

        return result;
    }

    async function preloadEssentialAssets(preloadOptions = {}) {
        const results = await Promise.allSettled([
            loadLogo(LOGO_VARIANTS.LIGHT, preloadOptions),
            loadLogo(LOGO_VARIANTS.DARK, preloadOptions),
        ]);

        const normalizedResults = results.map((result) => (
            result.status === "fulfilled"
                ? result.value
                : createLoadResult(false, { error: result.reason?.message ?? String(result.reason) })
        ));

        return {
            ok: normalizedResults.every((result) => result.ok),
            results: normalizedResults,
            registry: registry.toJSON(),
            loadedAt: nowISO(),
        };
    }

    function getAsset(key) {
        return registry.get(key);
    }

    function getTexture(key) {
        return registry.get(key)?.texture ?? null;
    }

    function removeAsset(key, removeOptions = {}) {
        return registry.remove(key, removeOptions);
    }

    function dispose() {
        registry.clear();
    }

    return {
        version: ASSET_LOADER_VERSION,
        manager,
        registry,

        loadTexture,
        loadImage,
        loadUserImage,
        loadLogo,
        preloadEssentialAssets,

        getAsset,
        getTexture,
        removeAsset,
        dispose,
    };
}

export async function prepareUploadedImageForDesign(file, target = IMAGE_TARGETS.GENERIC, options = {}) {
    const targetProfiles = {
        [IMAGE_TARGETS.LID_IMAGE]: {
            width: 1600,
            height: 1000,
            fit: "cover",
            background: "#111111",
        },
        [IMAGE_TARGETS.FRONT_STICKER]: {
            width: 1200,
            height: 700,
            fit: "contain",
            background: "rgba(255,255,255,0)",
        },
        [IMAGE_TARGETS.BOTTLE_LABEL]: {
            width: 1400,
            height: 620,
            fit: "cover",
            background: "#111111",
        },
        [IMAGE_TARGETS.CARD_IMAGE]: {
            width: 1200,
            height: 800,
            fit: "contain",
            background: "#fff7e8",
        },
        [IMAGE_TARGETS.CUSTOM_LOGO]: {
            width: 900,
            height: 900,
            fit: "contain",
            background: "rgba(255,255,255,0)",
        },
        [IMAGE_TARGETS.GENERIC]: {
            width: FILE_LIMITS.RECOMMENDED_TEXTURE_WIDTH,
            height: FILE_LIMITS.RECOMMENDED_TEXTURE_HEIGHT,
            fit: "contain",
            background: "rgba(255,255,255,0)",
        },
    };

    const profile = {
        ...targetProfiles[target],
        ...options,
    };

    return createTextureFromImageFile(file, {
        target,
        maxWidth: profile.width,
        maxHeight: profile.height,
        forceResize: true,
        fit: profile.fit,
        background: profile.background,
        usage: TEXTURE_USAGE.COLOR,
        textureQuality: options.textureQuality ?? TEXTURE_QUALITY.HIGH,
    });
}

export async function prepareDesignAssetBatch(filesByTarget = {}, options = {}) {
    const entries = Object.entries(filesByTarget).filter(([, file]) => Boolean(file));
    const results = {};

    for (const [target, file] of entries) {
        results[target] = await prepareUploadedImageForDesign(file, target, options);
    }

    return {
        ok: Object.values(results).every((result) => result.ok),
        results,
        loadedAt: nowISO(),
    };
}

export function createAssetManifest(registryOrAssets) {
    const assets = Array.isArray(registryOrAssets)
        ? registryOrAssets
        : registryOrAssets?.toJSON?.() ?? [];

    return {
        version: ASSET_LOADER_VERSION,
        generatedAt: nowISO(),
        publicPaths: cloneDeep(PUBLIC_PATHS),
        assetPaths: cloneDeep(ASSET_PATHS),
        assets: assets.map((asset) => ({
            key: asset.key,
            id: asset.id,
            type: asset.type,
            status: asset.status,
            name: asset.name,
            source: asset.source,
            width: asset.width,
            height: asset.height,
            aspectRatio: asset.aspectRatio,
            metadata: asset.metadata,
        })),
    };
}

export function disposeAsset(asset) {
    if (!asset) return;

    if (asset.texture?.dispose) {
        asset.texture.dispose();
    }

    if (asset.resource) {
        disposeTextureResource(asset.resource);
    }

    if (asset.objectUrl) {
        URL.revokeObjectURL(asset.objectUrl);
    }

    asset.status = ASSET_STATUS.DISPOSED;
    asset.updatedAt = nowISO();
}

export const assetLoader = Object.freeze({
    version: ASSET_LOADER_VERSION,

    assetTypes: ASSET_TYPES,
    status: ASSET_STATUS,
    imageTargets: IMAGE_TARGETS,
    textureUsage: TEXTURE_USAGE,
    cacheKeys: ASSET_CACHE_KEYS,

    validateImageFile,
    validateImageDimensions,

    loadImageFile,
    loadImageUrl,
    loadTextureUrl,
    createTextureFromImageFile,
    createTextureFromImageAsset,

    loadLogoAsset,
    loadDefaultLogos,
    createLoadingManager,
    createAssetRegistry,
    createAssetLoader,

    prepareUploadedImageForDesign,
    prepareDesignAssetBatch,
    createAssetManifest,

    applyTextureSettings,
    disposeAsset,
});
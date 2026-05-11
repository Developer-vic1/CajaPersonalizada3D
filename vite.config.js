import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    root: ".",

    publicDir: "public",

    server: {
        host: "0.0.0.0",
        port: 5173,
        strictPort: false,
        open: true,
    },

    preview: {
        host: "0.0.0.0",
        port: 4173,
        strictPort: false,
    },

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@config": path.resolve(__dirname, "src/config"),
            "@core": path.resolve(__dirname, "src/core"),
            "@objects": path.resolve(__dirname, "src/objects"),
            "@utils": path.resolve(__dirname, "src/utils"),
            "@services": path.resolve(__dirname, "src/services"),
            "@ui": path.resolve(__dirname, "src/ui"),
            "@data": path.resolve(__dirname, "src/data"),
            "@constants": path.resolve(__dirname, "src/constants"),
            "@public": path.resolve(__dirname, "public"),
        },
    },

    assetsInclude: [
        "**/*.glb",
        "**/*.gltf",
        "**/*.hdr",
        "**/*.exr",
        "**/*.webp",
        "**/*.png",
        "**/*.jpg",
        "**/*.jpeg",
        "**/*.svg",
    ],

    build: {
        outDir: "dist",
        emptyOutDir: true,
        sourcemap: true,

        rollupOptions: {
            input: {
                main: path.resolve(__dirname, "index.html"),
            },
        },
    },

    optimizeDeps: {
        include: [
            "three",
            "three/examples/jsm/controls/OrbitControls.js",
            "three/examples/jsm/controls/TransformControls.js",
            "three/examples/jsm/geometries/RoundedBoxGeometry.js",
            "three/examples/jsm/geometries/DecalGeometry.js",
        ],
    },
});
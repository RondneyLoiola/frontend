/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
}

// biome-ignore lint/correctness/noUnusedVariables: ImportMeta
interface ImportMeta {
    readonly env: ImportMetaEnv;
}
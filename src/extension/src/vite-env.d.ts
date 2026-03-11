/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_HELPER_HOST: string;
    readonly VITE_TOSS_WTS_CERT_HOST: string;
    readonly VITE_TOSS_WTS_INFO_HOST: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

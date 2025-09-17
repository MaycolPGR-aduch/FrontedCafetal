/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  // 👆 agrega aquí más variables si las usas
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

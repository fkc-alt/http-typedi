/// <reference types="vite/client" />
/// <reference types="reflect-metadata" />

interface ImportMetaEnv {
  readonly VITE_APP_BASE_API: string
  readonly VITE_APP_PROJECT_ICON: string
  readonly VITE_APP_PROJECT_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

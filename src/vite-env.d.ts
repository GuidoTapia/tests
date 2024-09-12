/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_JANUS_API_1_ORIGIN: string
  readonly VITE_SERVICE_ALB_LISTENER_PATH_PREFIX: string
  readonly VITE_USE_MOCK_API: number
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

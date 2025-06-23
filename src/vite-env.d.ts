/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_CONFIG_EDITOR?: string
  readonly VITE_ENABLE_TEST_TOGGLES?: string
  readonly VITE_ENABLE_DEBUG_TOOLS?: string
  readonly VITE_ENABLE_WELCOME_CONFIG?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 
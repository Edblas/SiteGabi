/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_WHATSAPP_NUMBER: string
  readonly VITE_INSTAGRAM_URL: string
  readonly VITE_LOJA_ENDERECO: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

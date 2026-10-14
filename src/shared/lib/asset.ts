// Путь к файлу из public/ с учётом base из vite.config
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

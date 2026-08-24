export const ADMIN_BASE_PATH = "/gestion-speedcode";

export const adminRoutes = {
  root: ADMIN_BASE_PATH,
  login: `${ADMIN_BASE_PATH}/acceso`,
  content: `${ADMIN_BASE_PATH}/contenido`,
  portfolio: `${ADMIN_BASE_PATH}/portafolio`,
  contacts: `${ADMIN_BASE_PATH}/contactos`,
  versions: `${ADMIN_BASE_PATH}/versiones`,
} as const;

/**
 * Descarga de PhootFlow Desktop.
 *
 * Las versiones se publican en el repo público «phootflow-releases» (lo hace el
 * workflow de phootflow-desktop al crear una etiqueta vX.Y.Z). El enlace
 * «releases/latest/download/<fichero>» de GitHub siempre apunta a la última
 * versión, así que no hay que tocar la landing en cada release.
 *
 * Se puede cambiar en build con VITE_DOWNLOAD_URL / VITE_APP_VERSION.
 */
export const SITE_URL = 'https://phootflow.com';

export const RELEASES_URL = 'https://github.com/davidcaptart-glitch/phootflow-releases/releases';

export const DOWNLOAD_URL_WINDOWS: string =
  import.meta.env.VITE_DOWNLOAD_URL || `${RELEASES_URL}/latest/download/PhootFlow-Setup.exe`;

/** Versión mostrada junto al botón (opcional; vacío = no se muestra). */
export const APP_VERSION: string = import.meta.env.VITE_APP_VERSION || '';

/** Apps para móvil (PWA en Vercel, con los subdominios lite./pro.phootflow.com). */
export const MOBILE_LITE_URL: string = import.meta.env.VITE_MOBILE_LITE_URL || 'https://lite.phootflow.com';
export const MOBILE_PRO_URL: string = import.meta.env.VITE_MOBILE_PRO_URL || 'https://pro.phootflow.com';

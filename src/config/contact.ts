/**
 * Formulario de contacto.
 *
 * GitHub Pages solo sirve ficheros estáticos, así que el envío lo hace
 * FormSubmit (https://formsubmit.co), gratis y sin cuenta.
 *
 * La primera vez que alguien envíe el formulario, FormSubmit manda un correo
 * de activación a la dirección de destino: hay que pulsar «Activate Form».
 * Después, FormSubmit da un alias aleatorio (p. ej. «a1b2c3…»): si se pone
 * en VITE_CONTACT_ID, la dirección de correo deja de aparecer en la web.
 */
const CONTACT_ID: string = import.meta.env.VITE_CONTACT_ID || 'da34c382ff3aa01dd5fcaa4dfa1d2c6b';

export const CONTACT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_ID}`;

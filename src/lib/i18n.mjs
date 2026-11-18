import { translateText, translateHtml } from '../i18n/translate.mjs';
export const language = document.documentElement.lang === 'en' ? 'en' : 'es';
export const locale = language === 'en' ? 'en-GB' : 'es-ES';
export const t = text => language === 'en' ? translateText(text) : text;
export const html = markup => language === 'en' ? translateHtml(markup) : markup;

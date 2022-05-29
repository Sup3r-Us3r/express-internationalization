import type { Request, Response, NextFunction } from 'express';
import { resolve } from 'path';
import { readFileSync } from 'fs';

interface IInternationalizationMiddlewareOptions {
  languagesFolderPath: string;
  defaultLocaleToTranslate?: string;
}

let LANGUAGES_FOLDER_PATH = '';
let CURRENT_LOCALE = '';

function translateByLocale(keyOfMessage: string) {
  try {
    const path = resolve(
      LANGUAGES_FOLDER_PATH,
      CURRENT_LOCALE,
      'translation.json'
    );

    const translationJson = JSON.parse(
      readFileSync(path).toString('utf8'),
    );

    return translationJson[keyOfMessage];
  } catch {
    throw new Error('Could not read the translation file, please check the sent path and try again.');
  }
}

export function internationalizationMiddleware(
  { languagesFolderPath, defaultLocaleToTranslate = 'en' }: IInternationalizationMiddlewareOptions
) {
  return (request: Request, _response: Response, next: NextFunction) => {
    const currentLocale = request.headers['accept-language']?.replace(/(-.*)/g, '');

    LANGUAGES_FOLDER_PATH = languagesFolderPath;
    CURRENT_LOCALE = currentLocale?.length === 2
      ? currentLocale.toLowerCase()
      : defaultLocaleToTranslate.toLowerCase();

    request.translateByLocale = translateByLocale;

    next();
  }
}

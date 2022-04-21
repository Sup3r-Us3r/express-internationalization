declare namespace Express {
  export interface Request {
    translateByLocale: (keyOfMessage: string) => string;
  }
}
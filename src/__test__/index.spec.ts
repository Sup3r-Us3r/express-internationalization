import type { Request, Response, NextFunction } from 'express';
import { resolve } from 'path';

import { internationalizationMiddleware } from '../index';

describe('Internationalization Middleware', () => {
  let mockRequest: Partial<Request & { translateByLocale(keyOfMessage: string): any }>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      translateByLocale: jest.fn()
    };
    mockResponse = {
      json: jest.fn()
    };
  });

  it('should be able to return the message translated to portuguese with header accept-language desired', () => {
    mockRequest = {
      headers: {
        'accept-language': 'pt'
      }
    };

    internationalizationMiddleware({
      languagesFolderPath: resolve(__dirname, 'languages')
    })(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockRequest.translateByLocale).toBeDefined();

    if (mockRequest!.translateByLocale !== undefined) {
      expect(mockRequest!.translateByLocale('testMessage'))
        .toEqual('o teste funciona');
    }
  });

  it('should be able to return the message translated to english without header accept-language', () => {
    mockRequest = {
      headers: {
        'accept-language': undefined
      }
    };

    internationalizationMiddleware({
      languagesFolderPath: resolve(__dirname, 'languages')
    })(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockRequest.translateByLocale).toBeDefined();

    if (mockRequest!.translateByLocale !== undefined) {
      expect(mockRequest!.translateByLocale('testMessage'))
        .toEqual('the test works');
    }
  });

  it('should be able to throw a new error because of the desired path', () => {
    mockRequest = {
      headers: {
        'accept-language': 'pt'
      }
    };

    internationalizationMiddleware({
      languagesFolderPath: resolve('')
    })(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockRequest.translateByLocale).toBeDefined();

    expect(() => {
      if (mockRequest!.translateByLocale !== undefined) {
        mockRequest!.translateByLocale('testMessage');
      }
    }).toThrow('Could not read the translation file, please check the sent path and try again.');

    if (mockRequest!.translateByLocale !== undefined) {
      try {
        mockRequest!.translateByLocale('testMessage');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty(
          'message',
          'Could not read the translation file, please check the sent path and try again.'
        );
      }
    }
  });
});

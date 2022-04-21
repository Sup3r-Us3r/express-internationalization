## Express Internationalization

A lib to perform internationalization the simple way with Express.

It's a middleware to add to your routes, with it you'll be able to translate your texts based on the **Accept-Language sent**.

### How to use

Installation

```bash
$ npm i express-internationalization
```

In your main file use this way

```typescript
import express from 'express';
import { internationalizationMiddleware } from 'express-internationalization';
import { resolve } from 'path';

const app = express();

app.use(internationalizationMiddleware({
  languagesFolderPath: resolve(__dirname, 'languages'),
  defaultLocale: 'pt'
}));
```

In `internationalizationMiddleware` there are only 2 parameters:

* **languagesFolderPath**: Absolute path to `languages` folder.
* **defaultLocale**: It is optional the default is `en` it is used when `Accept-Language` is not passed in Headers.

It is necessary to create a `languages` folder for example and inside it create a new folder with the desired locale and a file called `translation.json` which will contain all the translations for that desired language.

The structure will look like this:

```text
├── src/
│   ├── languages/
│   │   ├── en/
│   │   │   └── translation.json
│   │   ├── pt/
│   │   │   └── translation.json
```

And the JSON file will contain this key and value structure:

```json
{
  "welcomeMessage": "Hello World"
}
```

The key you will use in the `translateByLocale` function that was added in the Express request:

```typescript
app.get('/', (request, response) => {
  return response.json({
    message: request.translateByLocale('welcomeMessage')
  });
});
```

To change the locale according to the user's locale, the `Accept-Language` with the locale value must be sent in the Request Header, for example:

```text
Accept-Language: pt
```

You can find a list of available locales at this [Wikipedia link](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).

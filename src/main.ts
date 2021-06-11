import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

declare let __webpack_public_path__: any;

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));

// This tells Webpack to lazily load chunks from the same URL as where the current script was loaded from. It's an experimental alternative
// to hard-coding the "deploy-url" at build time. See: https://www.javaer101.com/en/article/18138920.html:
const currentScriptSrc = (document.currentScript as HTMLScriptElement)?.src ?? '';
if (currentScriptSrc.endsWith('.js')) {
    __webpack_public_path__ = currentScriptSrc.replace(/[^\/]*.js$/, '');
    console.log('Lazily-loaded chunks will be retrieved from: %O', __webpack_public_path__);
}

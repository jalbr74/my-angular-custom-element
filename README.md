# Embeddable Angular Custom Element

This project shows an example of an embeddable custom element, based on angular and ux-aspects.



This project was created using the angular cli:

```
$ ng new my-angular-custom-element
```



## Dependencies

The following dependencies are installed:

**Production:**

```
$ npm install @ux-aspects/ux-aspects ngx-bootstrap @angular/elements
```

**Development**

```
$ npm install rimraf postcss postcss-prefixwrap replace-in-file concat-files --save-dev
```



## Build Scripts

A folder: 'build-scripts' was add to the root of the project, and the following two build scripts were added:

* build-scripts/prepare-3rd-party-css.js
* build-scripts/finalize-build-output.js



**prepare-3rd-party-css.js** makes a copy of bootstrap.css and ux-aspects.css, traversing each selector, and wrapping it within the parent selector: ".my-styles-root". This provides the ability to "embed" this stylesheet within the hosting web application, without affecting any of its existing styles. The following is an example of the resulting css:

```css
// The following selector:
td, th {
  padding: 0;
}

// becomes:
.my-styles-root td, .my-styles-root th {
  padding: 0;
}
```

Note: The only selectors that don't get wrapped are for the elements that get attached to the document root, such as modal dialogs. This exception exists because we can't put our enclosing selector ".my-styles-root" at the document root for those dialogs to be styled.



**finalize-build-output.js** replaces the `webpackJsonp` function found in the final build output with something else, in this case: `myWebpackJsonp`. The reason for doing this is because if the hosting web application uses webpack to package its deliverables, its `webpackJsonp` function definition will collide with the one used for the embedded project.

This script also combines the final javascript files into app.js, and the final stylesheet into app-styles.css. This way, the developer has the ability to add one *.js and one *.css file to the index.html of the hosting web application, and not having to worry about using the hashed filename. Cache busting can still be done, but using something like: `src="app.js?version=???"`.



The two build scripts are wired to run during at the postbuild and postinstall phases. This is done by editing package.json and adding the following two scripts:

```json
{
    ...
    "scripts": {
        ...
        "postbuild": "node build-scripts/finalize-build-output.js",
        "postinstall": "node build-scripts/prepare-3rd-party-css.js"
    }
}
```



By running the command `npm run postinstall`, the following files are created:

```
node_modules/bootstrap/dist/css/bootstrap-modified.css
node_modules/@ux-aspects/ux-aspects/styles/ux-aspects-modified.css
```



## 3rd Party Stylesheets

The 3rd party stylesheets were modified by the script: prepare-3rd-party-css.js to encapsulate the selectors within a parent selector. References to the modified 3rd party stylesheets are added to angular.json at the following location:

```json
{
    "projects": {
        "my-angular-custom-element": {
            "architect": {
                "build": {
                    "options": {
                        ...
                        "styles": [
                            "node_modules/bootstrap/dist/css/bootstrap-modified.css",
                            "node_modules/@ux-aspects/ux-aspects/styles/ux-aspects-modified.css",
                            "src/styles.scss"
                        ],
                        "resourcesOutputPath": "css-resources"
                    }
                }
            }
        }
    }
}
```

resourcesOutputPath has also been added to angular.json, so all css artifacts (images, fonts, etc.) don't get dumped at the root of the build output. This isn't necessary, but it helps keep the build output folder clean:

Note: styles.scss is added last so it can override definitions from the two stylesheets above it.



## Lazily Loaded Components

The existing app component wasn't needed, so the following files were deleted: app.component.html, app.component.scss, and app.component.ts. Instead, a new HelloComponent was added, see: hello.component.ts, hello.component.html, and hello.component.scss in the folder: src/app/components/hello.

index.html was also modified to remove `<app-root></app-root>` and replace it with `<hello-element></hello-element>`.



To incur as little overhead as possible on the host web application, the HelloComponent uses a wrapper component, which lazily loads the HelloModule when rendered. See app.module.ts for how the wrapper component is defined as a custom element, for example:

```typescript
customElements.define('hello-element', createCustomElement(LazyLoaderForHelloComponent, { injector: this.injector }));
```



In lazy-loader-for-hello.component.ts, the HelloModule is lazily loaded, and queried for the component factory for the HelloComponent. This is passed to the createComponent method of ViewContainerRef, which renders the component in the place of `<ng-container #containerRef></ng-container>`.

```typescript
async ngAfterViewInit(): Promise<void> {
    const moduleDef = await import('../components/hello/hello.module');
    const moduleFactory = await this.compiler.compileModuleAsync(moduleDef.HelloModule);
    const componentFactory = moduleFactory.create(this.injector).instance.getHelloComponentFactory();

    this.containerRef.createComponent(componentFactory, 0, this.injector);
}
```



In HelloComponent, the css class: "my-styles-root" is added to the element by using the following code:

```typescript
export class HelloComponent implements OnInit {
    @HostBinding('class') classes = 'my-styles-root';
    ...
}
```



It also gets added to the dialogs by doing the following:

```typescript
showDialog(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, {
        class: 'my-styles-root'
    });
}
```



## Known Issues

While this successfully embed a lazily-loaded component into a host web application, there are still a few issues...



### Angular Routing

If the hosting web application is making use of the browser's URL for routing, and if you need to use angular routing in your custom element, you can still use the Angular router if you disconnect it from the browser's URL. This can be done by adding the following to your module definition:

```javascript
providers: [
  { provide: LocationStrategy, useClass: MockLocationStrategy },
]
```



### Fonts

Fonts have to be defined at the root of the stylesheets, and can't be encapsulated. So all fonts in bootstrap & ux-aspects are defined at the global level, and can overwrite fonts with the same name defined in the hosting web application. This may not be a problem unless the the hosting web application is using fonts with the following names: "Glyphicons Halflings", "Source Sans Pro", "hpe-icons", "ux-icons", and "ias-icons".



### CSS Selectors for Dynamic Elements Attached to BODY

Frameworks like ux-aspects and ngx-bootstrap will create dynamic elements, and attach them to the document root, or body tag. The most common dynamic element is probably modal dialogs. Because of this, there is no parent where we can place a top-level class name, such as "my-styles-root". Therefore, all styles dealing with root-level dynamic elements do not get encapsulated, and may collide with parent elements with a similar name.

In other words, since bootstrap and ux-aspects use the selector: ".modal", if the hosting web application also defines the class ".modal", then unfortunately there will be a style collision.

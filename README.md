# IDM

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `out dir in angular cli.json` directory. Use the `-prod` flag for a production build.

## Build Watch

Run `ng build -w` to build the project continuously.  This is helpful because then grid will automatically pick up changes to source code.

After this, you should be able to browse to a URL *like* https://czpandbrown:25000/ca/client/  where the machine name, matches your machine name.
https://{your machine name here}:25000/ca/client/

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running code coverage

Run `ng test --code-coverage` This will create a coverage folder in your project, simply open the index.html in there to view the coverage.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Troubleshooting
Cannot read property 'length' of undefined
TypeError: Cannot read property 'length' of undefined
    at createSourceFile (C:\IDM\idm\Projects\GridPackage\GridPackage-app\src\main\resources\webXi\client\node_modules\typescript\lib\typescript.js:14877:109)
    at parseSourceFileWorker (C:\IDM\idm\Projects\GridPackage\GridPackage-app\src\main\resources\webXi\client\node_modules\typescript\lib\typescript.js:14809:26)
...

If you're getting this error most likely it's because you don't have an environments.ts in your project. You have to create an environment.ts in the environment folder.  We 
don't check this into source control because each local dev has a different environment.ts
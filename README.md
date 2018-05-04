# helgoland-toolbox

> tools for a sensor observation service based client

[![npm version](https://badge.fury.io/js/helgoland-toolbox.svg)](https://badge.fury.io/js/helgoland-toolbox)
[![dependencies Status](https://david-dm.org/52north/helgoland-toolbox/status.svg)](https://david-dm.org/52north/helgoland-toolbox)
[![devDependencies Status](https://david-dm.org/52north/helgoland-toolbox/dev-status.svg)](https://david-dm.org/52north/helgoland-toolbox?type=dev)

This project contains [Angular](https://angular.io/) based Modules, Components, Injectables to build a sensor observation service based client. 

## Getting Started

### Dependencies

##### Node/NPM
Install latest Node and NPM following the [instructions](https://nodejs.org/en/download/). Make sure you have Node version ≥ 7.0 and NPM ≥ 4.

- `brew install node` for Mac.

##### Yarn
[Yarn package manager](https://yarnpkg.com/en/) is optional but highly recommended. If you prefer to work with `npm` directly you may ignore this step.

Yarn installs library dependencies faster and also locks theirs versions. It has [more advantages](https://yarnpkg.com/en/) but these two are already pretty attractive. 

Install Yarn by following the [instructions](https://yarnpkg.com/en/docs/install).

- `brew install yarn` for Mac.

### Installing
- `fork` this repository.
- `clone` your fork to your local environment.
- `yarn install` to install required dependencies (or `npm i`).

### Build the library
- `yarn lib:build` for building the library once
<!-- - `yarn build:watch` for building the library (both ESM and AOT versions) and watch for file changes. -->

### Other commands

##### Lint the code
- `yarn lint` for performing static code analysis.

<!-- ##### Test the library
- `yarn test` for running all your `*.spec.ts` tests once. Generated code coverage report may be found in `coverage` folder.
- `yarn test:watch` for running all you `*.spec.ts` and watch for file changes. -->

##### Generate documentation
- `yarn compodoc` for generating documentation locally
- `yarn gh-pages` for generating documentation and uploading it to GitHub Pages

##### Bump library version
- `npm version ***` to increase library version. [More on bumping](https://docs.npmjs.com/cli/version).

<!-- `preversion` script in this case will automatically run project testing and linting in prior in order to check that the library is ready for publishing. -->

##### Publish library to NPM
- `yarn lib:publish` to publish your library sources on [npmjs.com](https://www.npmjs.com/). Once the library is published it will be available for usage in npm packages.

<!-- `prepublishOnly` script in this case will automatically run project testing and linting in prior in order to check that the library is ready for publishing. -->

##### Cleaning
- `yarn clean:tmp` command will clean up all temporary files like `docs`, `dist`, `coverage` etc.
- `yarn clean:all` command will clean up all temporary files along with `node_modules` folder. 

### Using demo applications

 - just start the demo with `yarn start` and the demo is published 

<!-- #### Using `yarn link`

In you library root folder:

```bash
# Create symbolic link
yarn link

# Build library in watch mode
yarn build:watch
```

In you project folder that should consume the library:

```bash
# Link you library to the project
yarn link "angular-library-seed"

# Build your project. In case of Angular-CLI use the following command.
ng serve --aot
```

Then you need to import your library into your project's source code.

Now, once you update your library source code it will automatically be re-compiled and your project will be re-built so you may see library changes instantly.

[More information](https://yarnpkg.com/en/docs/cli/link) about `yarn link` command.

> At the moment of publishing this project there is a [bug](https://github.com/angular/angular-cli/issues/3854) exists when using `yarn link` in combination with Angular CLI. The issue is caused by having `node_modules` folder inside linked library. There is a [workaround](https://github.com/angular/angular-cli/issues/3854#issuecomment-274344771) has been provided that suggests to add a `paths` property with all Angular dependencies to the `tsconfig.json` file of the Angular CLI project like it is shown below:
```
{
  "compilerOptions": {
    "paths": { "@angular/*": ["../node_modules/@angular/*"] }
  }
}
``` -->

## Troubleshooting while using this library

 - add `allowSyntheticDefaultImports: true` to your tsconfig.json to avoid error messages like `... has no default export`
 - don't forget to add styles of nested dependencies



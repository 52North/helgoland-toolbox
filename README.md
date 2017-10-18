# helgoland-toolbox

> tools for a sensor observation service based client

<!-- [![Build Status](https://travis-ci.org/trekhleb/angular-library-seed.svg?branch=master)](https://travis-ci.org/trekhleb/angular-library-seed)
[![codecov](https://codecov.io/gh/trekhleb/angular-library-seed/branch/master/graph/badge.svg)](https://codecov.io/gh/trekhleb/angular-library-seed)
[![npm version](https://badge.fury.io/js/angular-library-seed.svg)](https://badge.fury.io/js/angular-library-seed) -->

This project contains [Angular](https://angular.io/) based Modules, Components, Injectables to build a sensor observation service based client. 

<!-- # Quick Start

```bash
# Clone the repository
git clone https://github.com/trekhleb/angular-library-seed.git

# Go to repository folder
cd angular-library-seed

# Install all dependencies
yarn install

# Build the library
yarn build
``` -->

<!-- # File Structure

```
angular-library-seed
  ├─ src                          * Library sources home folder (THE PLACE FOR YOUR LIBRARY SOURCES)
  |  ├─ components                * Example of library components with tests
  |  ├─ services                  * Example of library services with tests
  |  ├─ index.ts                  * Library entry point that is used by builders
  |  └─ tick-tock.module.ts       * Example of library module
  |
  ├─ .editorconfig                * Common IDE configuration
  ├─ .gitignore	                  * List of files that are ignored while publishing to git repo
  ├─ .npmignore                   * List of files that are ignored while publishing to npm
  ├─ .travis.yml                  * Travic CI configuration
  ├─ LICENSE                      * License details
  ├─ README.md                    * README for you library
  ├─ gulpfile.js                  * Gulp helper scripts
  ├─ karma-test-entry.ts          * Entry script for Karma tests
  ├─ karma.conf.ts                * Karma configuration for our unit tests
  ├─ package.json                 * NPM dependencies, scripts and package configuration
  ├─ tsconfig-aot.json            * TypeScript configuration for AOT build
  ├─ tsconfig.json                * TypeScript configuration for UMD and Test builds
  ├─ tslint.json                  * TypeScript linting configuration
  ├─ webpack-test.config.ts       * Webpack configuration for building test version of the library
  ├─ webpack-umd.config.ts        * Webpack configuration for building UMD bundle
  └─ yarn.lock                    * Yarn lock file that locks dependency versions
``` -->

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
- `yarn build` for building the library once (both ESM and AOT versions).
- `yarn build:watch` for building the library (both ESM and AOT versions) and watch for file changes.

You may also build UMD bundle and ESM files separately:
- `yarn build:esm` - for building AOT/JIT compatible versions of files.
- `yarn build:esm:watch` - the same as previous command but in watch-mode.
- `yarn build:umd` - for building UMD bundle only.
- `yarn build:umd:watch` - the same as previous command but in watch-mode.

### Other commands

##### Lint the code
- `yarn lint` for performing static code analysis.

##### Test the library
- `yarn test` for running all your `*.spec.ts` tests once. Generated code coverage report may be found in `coverage` folder.
- `yarn test:watch` for running all you `*.spec.ts` and watch for file changes.

##### Generate documentation
- `yarn docs` for generating documentation locally.
- `yarn gh-pages` for generating documentation and uploading it to GitHub Pages. [Documentation example](https://trekhleb.github.io/angular-library-seed/).

##### Explore the bundle
- `yarn explorer` to find out where all your code in bundle is coming from.

##### Bump library version
- `npm version patch` to increase library version. [More on bumping](https://docs.npmjs.com/cli/version).

`preversion` script in this case will automatically run project testing and linting in prior in order to check that the library is ready for publishing.

##### Publish library to NPM
- `npm publish` to publish your library sources on [npmjs.com](https://www.npmjs.com/). Once the library is published it will be [available for usage](https://www.npmjs.com/package/angular-library-seed) in npm packages.

`prepublishOnly` script in this case will automatically run project testing and linting in prior in order to check that the library is ready for publishing.

##### Cleaning
- `yarn clean:tmp` command will clean up all temporary files like `docs`, `dist`, `coverage` etc.
- `yarn clean:all` command will clean up all temporary files along with `node_modules` folder. 

## Library development workflow

In order to debug your library in browser you need to have Angular project that will consume your library, build the application and display it. For your convenience all of that should happen automatically in background so once you change library source code you should instantly see the changes in browser.

There are several ways to go here:
- Use your **real library-consumer project** and link your library to it via `yarn link` command (see below).
- Use [demo applications](https://github.com/trekhleb/angular-library-seed/tree/master/demo) that are provided for your convenience as a part of this repository.
- Use [Angular-CLI](https://cli.angular.io/) to generate library-consumer project for you and then use `yarn link` to link your library to it.

<!-- ### Using demo applications

You may take advantage of watch-modes for both library build and [demo-projects](https://github.com/trekhleb/angular-library-seed/tree/master/demo) builds in order to see changes to your library's source code immediately in your browser.

To do so you need to:
1. Open two console instances.
2. Launch library build in watch mode in first console instance by running `yarn build:watch` (assuming that you're in `angular-library-seed` root folder).
3. Launch demo project build (JIT version) in watch-mode by running `yarn start` in second console instance (assuming that you're in `angular-library-seed/demo` folder).

As a result once you change library source code it will be automatically re-compiled and in turn your JIT demo-project will be automatically re-built and you will be able to see that changes in your browser instantly.

For more details about demo projects, their folder structure and npm commands please take a look at [demo projects README](https://github.com/trekhleb/angular-library-seed/tree/master/demo). -->

#### Using `yarn link`

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
```

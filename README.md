# helgoland-toolbox

> tools for a sensor observation service based client

[![npm version](https://badge.fury.io/js/%40helgoland%2Fcore.svg)](https://badge.fury.io/js/%40helgoland%2Fcore)

<!-- [![dependencies Status](https://david-dm.org/52north/helgoland-toolbox/status.svg)](https://david-dm.org/52north/helgoland-toolbox)
[![devDependencies Status](https://david-dm.org/52north/helgoland-toolbox/dev-status.svg)](https://david-dm.org/52north/helgoland-toolbox?type=dev) -->

This project contains [Angular](https://angular.io/) based Modules, Components, Injectables to build a sensor observation service based client.

## Getting Started

### Dependencies

#### Node/NPM

Install latest Node and NPM following the [instructions](https://nodejs.org/en/download/). Make sure you have Node version ≥ 10 and NPM ≥ 6. `brew install node` for Mac.

### Installing

- `fork` this repository.
- `clone` your fork to your local environment.
- `npm install` to install required dependencies.

### Start test application

- `npm start` will start the test application, which provide views for the main modules and components
- the app, and their corrensponding files can be found in the `src` folder

### See Documentation

- a module based documentation can be found here: <https://52north.github.io/helgoland-toolbox/>
- there is also a how to page with different use cases: <https://52north.github.io/helgoland-toolbox/additional-documentation/how-tos.html>

<!-- TODO: check how toos, if their are still valid -->

## Development

- different moduls are in the projects folder
<!-- TODO: short description to every module -->

### use customized toolbox in an other app development

#### build Toolbox

- `npm run lib:build` builds the complete toolbox in the `dist`-folder
- after build `npm run lib:pack` packs every module to a file in the following structure `helgoland-MODULENAME-CURRENT_VERSION.tgz` in the `root`-folder
- every packed module can be used by installing it in app development with it's relative path, for example `npm install ../helgoland-toolbox/helgoland-MODULENAME-CURRENT_VERSION.tgz`

### Other commands

#### Run tests

- all implemented tests for the modules can be run by `npm test`

#### Lint the complete code

- `ng lint` for performing static code analysis.

#### Generate documentation

- `npm run compodoc` for generating documentation locally
- `npm run gh-pages` for generating documentation and uploading it to GitHub Pages

##### Bump library version

- `npm version ***` to increase library version. [More on bumping](https://docs.npmjs.com/cli/version).

<!-- `preversion` script in this case will automatically run project testing and linting in prior in order to check that the library is ready for publishing. -->

<!-- ## Supported series API versions mapping

| helgoland-toolbox version | [series rest API](https://github.com/52North/series-rest-api) version |
| :-----------------------: | :-------------------------------------------------------------------: |
|      v0.0.1-alpha.53      |                                v1.10.2                                | -->

## Troubleshooting while using this library

- add `allowSyntheticDefaultImports: true` to your tsconfig.json to avoid error messages like `... has no default export`
- don't forget to add styles of nested dependencies

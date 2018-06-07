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

### Installing
- `fork` this repository.
- `clone` your fork to your local environment.
- `npm install` to install required dependencies.

### Build the libraries
- `npm run build:libs` for building the library once

### Other commands

##### Lint the complete code
- `ng lint` for performing static code analysis.

##### Generate documentation
- `npm run compodoc` for generating documentation locally
- `npm run gh-pages` for generating documentation and uploading it to GitHub Pages

##### Bump library version
- `npm version ***` to increase library version. [More on bumping](https://docs.npmjs.com/cli/version).

<!-- `preversion` script in this case will automatically run project testing and linting in prior in order to check that the library is ready for publishing. -->

##### Publish library to NPM
- `yarn lib:publish` to publish your library sources on [npmjs.com](https://www.npmjs.com/). Once the library is published it will be available for usage in npm packages.

<!-- `prepublishOnly` script in this case will automatically run project testing and linting in prior in order to check that the library is ready for publishing. -->

### Using demo applications

 - just start the demo with `ng serve` and the demo is published 

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

## Supported series API versions mapping

| helgoland-toolbox version | [series rest API](https://github.com/52North/series-rest-api) version |
|:-------------------------:|:---------------------------------------------------------------------:|
| v0.0.1-alpha.50           | v1.10.2                                                               |

## Troubleshooting while using this library

 - add `allowSyntheticDefaultImports: true` to your tsconfig.json to avoid error messages like `... has no default export`
 - don't forget to add styles of nested dependencies




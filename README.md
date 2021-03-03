# helgoland-toolbox

> tools for a sensor observation service based client

[![npm version](https://badge.fury.io/js/%40helgoland%2Fcore.svg)](https://badge.fury.io/js/%40helgoland%2Fcore)

<!-- [![dependencies Status](https://david-dm.org/52north/helgoland-toolbox/status.svg)](https://david-dm.org/52north/helgoland-toolbox)
[![devDependencies Status](https://david-dm.org/52north/helgoland-toolbox/dev-status.svg)](https://david-dm.org/52north/helgoland-toolbox?type=dev) -->

This project contains [Angular](https://angular.io/) based Modules, Components, Injectables to build a sensor observation service based client.

## Description

### Tools for Building Web Applications
**Providing Reusable Components for Building (Sensor Web) Client Applications**

52°North created the Helgoland Toolbox to facilitate the reuse of developments for Sensor Web client applications. It provides a range of modules that offer functionalities for building Web applications dealing with dynamic spatio-temporal data. The Helgoland Toolbox modules are used to build the 52°North Helgoland Sensor Web Viewer. Additional applications (e.g. the BelAir app, smle, or the developments resulting from the TaMIS project) are also built upon this library.

**Features:**

The most important functional modules comprise:

Core
- Communication with the APIs
- Important common services (local storage, time)
- Central interfaces and abstract classes

Caching
- Request Caching with Angular Interceptors

d3
- Trajectory Graph component
- Time Series Graph component

Depiction
- Legend entries
- Table view of data

Map
- Controls (Geo-Search, Locate, Zoom, Extent)
- Map Selector component

Selectors
- List Selector for observation data
- Service Selector for data sources

The work on the Helgoland Toolbox comprised several evolutionary improvements and enhancements that were developed as part of several projects (e.g. WaCoDiS, MuDak-WRM. SeaDataCloudk BSH, Wupperverband Framework Contract). This include:

- Enhancement to connect to instances of the OGC SensorThings API
- Improved caching
- Complementary mapping module based on open layers to support time-dependent background map layers
- Enhanced data export functionality
- Improvements in the diagram visualization
- Facet search for observation data

<p align="center">
  <img src="https://user-images.githubusercontent.com/3830314/81534731-d1905380-9368-11ea-8c6f-213b96dd5c41.jpg" alt="Helgoland map view" width="75%"/>
</p>

**Key Technologies:**

- JavaScript
- TypeScript
- Angular
- Leaflet
- d3
- Open Layers

**Benefits:**

 - Reusable components for building client applications
 - Modules for visualizing different types of sensor data (time series, trajectories, profiles)
 - Mapping modules
 - Different components for data selection
 
## Quick Start

### Dependencies

#### Node/NPM

Install latest Node and NPM following the [instructions](https://nodejs.org/en/download/). Make sure you have Node version ≥ 10 and NPM ≥ 6. `brew install node` for Mac.

### Installing

- `fork` this repository.
- `clone` your fork to your local environment.
- `npm install` to install required dependencies.

### Build the libraries

- `npm run lib:build` for building the library once

### Other commands

#### Lint the complete code

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


## Funding organizations/projects

The development of this client implementations was supported by several organizations and projects. Among other we would like to thank the following organisations and projects:

| Project/Logo | Description |
| :-------------: | :------------- |
| <a target="_blank" href="https://bmbf.de/"><img alt="BMBF" align="middle" width="172" src="https://raw.githubusercontent.com/52North/sos/develop/spring/views/src/main/webapp/static/images/funding/bmbf_logo_en.png"/></a><a target="_blank" href="http://tamis.kn.e-technik.tu-dortmund.de/"><img alt="TaMIS - Das Talsperren-Mess-Informations-System" align="middle"  src="https://raw.githubusercontent.com/52North/sos/develop/spring/views/src/main/webapp/static/images/funding/TaMIS_Logo_small.png"/></a> |  The development of this version of the 52&deg;North SOS was supported by the <a target="_blank" href="https://www.bmbf.de/"> German Federal Ministry of Education and Research</a> research project <a target="_blank" href="http://tamis.kn.e-technik.tu-dortmund.de/">TaMIS</a> (co-funded by the German Federal Ministry of Education and Research, programme Geotechnologien, under grant agreement no. 03G0854[A-D]) |
| <a target="_blank" href="https://www.jerico-ri.eu/"><img alt="JERICO-S3 - Science - Services- Sustainability" align="middle" width="172" src="https://raw.githubusercontent.com/52North/sos/develop/spring/views/src/main/webapp/static/images/funding/jerico_s3.png" /></a> | The development of this version of the 52&deg;North SOS was supported by the <a target="_blank" href="https://ec.europa.eu/programmes/horizon2020/">European Union’s Horizon 2020</a> research project <a target="_blank" href="https://www.jerico-ri.eu/">JERICO-S3</a> (co-funded by the European Commission under the grant agreement n&deg;871153) |
| <a target="_blank" href="http://www.nexosproject.eu/"><img alt="NeXOS - Next generation, Cost-effective, Compact, Multifunctional Web Enabled Ocean Sensor Systems Empowering Marine, Maritime and Fisheries Management" align="middle" width="172" src="https://raw.githubusercontent.com/52North/sos/develop/spring/views/src/main/webapp/static/images/funding/logo_nexos.png" /></a> | The development of this version of the 52&deg;North SOS was supported by the <a target="_blank" href="http://cordis.europa.eu/fp7/home_en.html">European FP7</a> research project <a target="_blank" href="http://www.nexosproject.eu/">NeXOS</a> (co-funded by the European Commission under the grant agreement n&deg;614102) |
| <a target="_blank" href="https://bmbf.de/"><img alt="BMBF" align="middle"  src="https://raw.githubusercontent.com/52North/sos/develop/spring/views/src/main/webapp/static/images/funding/bmbf_logo_en.png"/></a><a target="_blank" href="https://colabis.de/"><img alt="COLABIS - Collaborative Early Warning Information Systems for Urban Infrastructures" align="middle"  src="https://raw.githubusercontent.com/52North/sos/develop/spring/views/src/main/webapp/static/images/funding/colabis.png"/></a> | The development of this version of the 52&deg;North SOS was supported by the <a target="_blank" href="https://www.bmbf.de/"> German Federal Ministry of Education and Research</a> research project <a target="_blank" href="https://colabis.de/">COLABIS</a> (co-funded by the German Federal Ministry of Education and Research, programme Geotechnologien, under grant agreement no. 03G0852A) |
| <a target="_blank" href="https://www.bmvi.de/"><img alt="BMVI" align="middle" width="100" src="https://raw.githubusercontent.com/52North/sos/develop/spring/views/src/main/webapp/static/images/funding/bmvi-logo-en.png"/></a><a target="_blank" href="https://www.bmvi.de/DE/Themen/Digitales/mFund/Ueberblick/ueberblick.html"><img alt="mFund" align="middle" width="100" src="https://raw.githubusercontent.com/52North/sos/develop/spring/views/src/main/webapp/static/images/funding/mFund.jpg"/></a><a target="_blank" href="http://wacodis.fbg-hsbo.de/"><img alt="WaCoDis - Water management Copernicus services for the determination of substance inputs into waters and dams within the framework of environmental monitoring" align="middle" width="126" src="https://raw.githubusercontent.com/52North/sos/develop/spring/views/src/main/webapp/static/images/funding/wacodis-logo.png"/></a> | The development of this version of the 52&deg;North SOS was supported by the <a target="_blank" href="https://www.bmvi.de/"> German Federal Ministry of of Transport and Digital Infrastructure</a> research project <a target="_blank" href="http://wacodis.fbg-hsbo.de/">WaCoDis</a> (co-funded by the German Federal Ministry of Transport and Digital Infrastructure, programme mFund) |
| <a target="_blank" href="https://bmbf.de/"><img alt="BMBF" align="middle" width="100" src="https://raw.githubusercontent.com/52North/sos/develop/spring/views/src/main/webapp/static/images/funding/bmbf_logo_neu_eng.png"/></a><a target="_blank" href="https://www.fona.de/"><img alt="FONA" align="middle" width="100" src="https://raw.githubusercontent.com/52North/sos/develop/spring/views/src/main/webapp/static/images/funding/fona.png"/></a><a target="_blank" href="https://www.mudak-wrm.kit.edu/"><img alt="Multidisciplinary data acquisition as the key for a globally applicable water resource management (MuDak-WRM)" align="middle" width="100" src="https://raw.githubusercontent.com/52North/sos/develop/spring/views/src/main/webapp/static/images/funding/mudak_wrm_logo.png"/></a> | The development of this version of the 52&deg;North SOS was supported by the <a target="_blank" href="https://www.bmbf.de/"> German Federal Ministry of Education and Research</a> research project <a target="_blank" href="http://www.mudak-wrm.kit.edu/">MuDak-WRM</a> (co-funded by the German Federal Ministry of Education and Research, programme FONA) |
| <a target="_blank" href="https://www.seadatanet.org/About-us/SeaDataCloud/"><img alt="SeaDataCloud" align="middle" width="156" src="https://raw.githubusercontent.com/52North/sos/develop/spring/views/src/main/webapp/static/images/funding/LOGO_SDC_Layer_opengraphimage.png"/></a> | The development of this version of the 52&deg;North SOS was supported by the <a target="_blank" href="https://ec.europa.eu/programmes/horizon2020/">Horizon 2020</a> research project <a target="_blank" href="https://www.seadatanet.org/About-us/SeaDataCloud/">SeaDataCloud</a> (co-funded by the European Commission under the grant agreement n&deg;730960) |
| <a target="_blank" href="http://www.odip.org"><img alt="ODIP II - Ocean Data Interoperability Platform" align="middle" width="100" src="https://raw.githubusercontent.com/52North/sos/develop/spring/views/src/main/webapp/static/images/funding/odip-logo.png"/></a> | The development of this version of the 52&deg;North SOS was supported by the <a target="_blank" href="https://ec.europa.eu/programmes/horizon2020/">Horizon 2020</a> research project <a target="_blank" href="http://www.odip.org/">ODIP II</a> (co-funded by the European Commission under the grant agreement n&deg;654310) |
| <a target="_blank" href="http://www.wupperverband.de"><img alt="Wupperverband" align="middle" width="196" src="https://raw.githubusercontent.com/52North/sos/develop/spring/views/src/main/webapp/static/images/funding/logo_wv.jpg"/></a> | The <a target="_blank" href="http://www.wupperverband.de/">Wupperverband</a> for water, humans and the environment (Germany) |
| <a target="_blank" href="http://www.irceline.be/en"><img alt="Belgian Interregional Environment Agency (IRCEL - CELINE)" align="middle" width="130" src="https://raw.githubusercontent.com/52North/sos/develop/spring/views/src/main/webapp/static/images/funding/logo_irceline_no_text.png"/></a> | The <a href="http://www.irceline.be/en" target="_blank" title="Belgian Interregional Environment Agency (IRCEL - CELINE)">Belgian Interregional Environment Agency (IRCEL - CELINE)</a> is active in the domain of air quality (modelling, forecasts, informing the public on the state of their air quality, e-reporting to the EU under the air quality directives, participating in scientific research on air quality, etc.). IRCEL &mdash; CELINE is a permanent cooperation between three regional environment agencies: <a href="http://www.awac.be/" title="Agence wallonne de l&#39Air et du Climat (AWAC)">Agence wallonne de l'Air et du Climat (AWAC)</a>, <a href="http://www.ibgebim.be/" title="Bruxelles Environnement - Leefmilieu Brussel">Bruxelles Environnement - Leefmilieu Brussel</a> and <a href="http://www.vmm.be/" title="Vlaamse Milieumaatschappij (VMM)">Vlaamse Milieumaatschappij (VMM)</a>. |

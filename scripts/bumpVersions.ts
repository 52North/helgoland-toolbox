import { readFile, writeFile } from 'jsonfile';

import { modules } from './utils';

readFile('./package.json', (err, obj) => {
  console.log(`bump to version ${obj.version}`);
  // console.log(obj.dependencies);
  modules.forEach(p => {
    const packageFile = './libs/' + p + '/package.json';
    readFile(packageFile, (e, packageJson) => {
      packageJson.version = obj.version;
      // console.log(packageJson.dependencies);
      for (const key in packageJson.dependencies) {
        if (Object.prototype.hasOwnProperty.call(packageJson.dependencies, key)) {
          // const element = packageJson.dependencies[key];
          if (obj.dependencies[key]) {
            packageJson.dependencies[key] = obj.dependencies[key];
          } else {
            console.error(`Could not found ${key} in main package.json`);
          }
        }
      }
      writeFile('./libs/' + p + '/package.json', packageJson, { spaces: 2 }, (error) => {
        if (error) { console.error(error); }
      });
    });
  });
});

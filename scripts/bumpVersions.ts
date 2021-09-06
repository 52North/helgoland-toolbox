import { readFile, writeFile } from 'jsonfile';

import { modules } from './utils';

readFile('./package.json', (err, packageMain) => {
  console.log(`bump to version ${packageMain.version}`);
  modules.forEach(lib => {
    const packageFile = './projects/helgoland/' + lib + '/package.json';
    readFile(packageFile, (e, packageLib) => {
      packageLib.version = packageMain.version;
      for (const key in packageLib.dependencies) {
        if (packageMain.dependencies[key]) {
          packageLib.dependencies[key] = packageMain.dependencies[key];
        } else if (packageMain.devDependencies[key]) {
          packageLib.dependencies[key] = packageMain.devDependencies[key];
        } else {
          console.error(`Could not found ${key} in main package.json for lib ${lib}`);
        }
      }
      writeFile('./projects/helgoland/' + lib + '/package.json', packageLib, { spaces: 2 }, (error) => {
        if (error) { console.error(error); }
      });
    });
  });
});

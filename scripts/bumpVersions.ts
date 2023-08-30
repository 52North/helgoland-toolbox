import { readFile, writeFile } from 'jsonfile';

import { modules } from './utils';

readFile('./package.json', (err, packageMain) => {
  console.log(`bump to version ${packageMain.version}`);
  modules.forEach(lib => {
    const packageFile = './projects/helgoland/' + lib + '/package.json';
    readFile(packageFile, (e, packageLib) => {
      packageLib.version = packageMain.version;
      writeFile('./projects/helgoland/' + lib + '/package.json', packageLib, { spaces: 2 }, (error) => {
        if (error) { console.error(error); }
      });
    });
  });
});
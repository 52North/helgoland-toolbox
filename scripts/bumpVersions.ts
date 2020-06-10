import { readFile, writeFile } from 'jsonfile';

import { modules } from './utils';

readFile('./package.json', function (err, obj) {
  modules.forEach(p => {
    const packageFile = './libs/' + p + '/package.json';
    readFile(packageFile, function (e, packageJson) {
      packageJson.version = obj.version;
      writeFile('./libs/' + p + '/package.json', packageJson, { spaces: 2 }, (error) => {
        if (error) { console.error(error); }
      });
    });
  });
});

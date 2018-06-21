import { readFile, writeFile } from 'jsonfile';

import { modules } from './utils';

readFile('./package.json', function (err, obj) {
  modules.forEach(p => {
    const packageFile = './projects/helgoland/' + p + '/package.json';
    readFile(packageFile, function (e, packageJson) {
      packageJson.version = obj.version;
      writeFile('./projects/helgoland/' + p + '/package.json', packageJson, { spaces: 2 }, (error) => {
        if (error) { console.error(error); }
      });
    });
  });
});

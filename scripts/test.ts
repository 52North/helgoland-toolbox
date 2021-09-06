import { execSync } from 'child_process';

import { modules } from './utils';

modules.forEach(p => {
  console.log('##### Test helgoland-toolbox \'' + p + '\' module #####');
  execSync(`ng test @helgoland/${p} --watch=false`, { stdio: [0, 1, 2] });
});

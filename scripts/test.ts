import { execSync } from 'child_process';

import { modules } from './utils';

modules.forEach(p => {
  console.log('##### Test helgoland-toolbox \'' + p + '\' module #####');
  execSync(`nx test ${p}`, { stdio: [0, 1, 2] });
});

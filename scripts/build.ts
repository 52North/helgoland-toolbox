import { execSync } from 'child_process';

import { modules } from './utils';

modules.forEach(p => {
  // console.log('##### Build helgoland-toolbox \'' + p + '\' module #####');
  execSync('ng build @helgoland/' + p, { stdio: [0, 1, 2] });
});

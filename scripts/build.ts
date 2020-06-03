import { execSync } from 'child_process';
import { copyFileSync } from 'fs';

import { modules } from './utils';

modules.forEach(p => {
    execSync(`ng build @helgoland/${p} --prod`, { stdio: [0, 1, 2] });
    copyFileSync('README.md', `dist/helgoland/${p}/README.md`);
});


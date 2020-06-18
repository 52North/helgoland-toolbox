import { exec, execSync } from 'child_process';

import { modules } from './utils';

execSync('npm addUser', { stdio: 'inherit' });

modules.forEach(p => {
  exec('npm publish dist/libs/' + p + ' --access public', (error: Error | null, stdout: string, stderr: string) => {
    if (stderr) {
      console.log(stderr);
    } else {
      console.log('Publish module \'' + p + '\'');
    }
  });
});

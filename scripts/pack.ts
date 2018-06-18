import { exec } from 'child_process';

import { modules } from './utils';

modules.forEach(p => {
  exec('npm pack dist/helgoland/' + p, (error: Error | null, stdout: string, stderr: string) => {
    console.log('Packed module \'' + p + '\'');
  });
});

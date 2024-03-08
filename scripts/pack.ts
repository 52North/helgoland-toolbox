import { exec, execSync } from 'child_process';

import { modules } from './utils';

exec('rm -rf ../npm-builds/ && mkdir ../npm-builds');
modules.forEach(p => {
  exec('npm pack dist/helgoland/' + p, (error: Error | null, stdout: string, stderr: string) => {
    const fileName = stdout.trim();
    console.log(`Packed module '${fileName}'`);
    execSync(`mv ${fileName} ../npm-builds/${fileName} -f`);
  });
});

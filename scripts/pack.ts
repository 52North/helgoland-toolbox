import { execSync } from 'child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';

import { modules } from './utils';

// Local tarballs get a prerelease version (e.g. 20.0.2-local.202610021430). A consumer range like
// "^20.0.3" never matches a prerelease, so after the release npm resolves from the registry again
// instead of keeping the file:-entries of these tarballs in the lock file.
const outDir = '../npm-builds';
const version: string = JSON.parse(readFileSync('./package.json', 'utf8')).version;
const timestamp = new Date().toISOString().replace(/\D/g, '').slice(0, 12);
const localVersion = `${version}-local.${timestamp}`;

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir);

modules.forEach(p => {
  const packageFile = `dist/helgoland/${p}/package.json`;
  const original = readFileSync(packageFile, 'utf8');
  const pkg = JSON.parse(original);
  pkg.version = localVersion;
  // peer ranges on sibling packages must accept the prerelease of the other local tarballs
  Object.keys(pkg.peerDependencies || {})
    .filter(dep => dep.startsWith('@helgoland/'))
    .forEach(dep => (pkg.peerDependencies[dep] = `${pkg.peerDependencies[dep]} || ${localVersion}`));
  writeFileSync(packageFile, JSON.stringify(pkg, undefined, 2));
  try {
    const fileName = execSync(`npm pack dist/helgoland/${p} --pack-destination ${outDir}`, { encoding: 'utf8' }).trim();
    console.log(`Packed module '${fileName}'`);
  } finally {
    // keep dist identical to the release build
    writeFileSync(packageFile, original);
  }
});

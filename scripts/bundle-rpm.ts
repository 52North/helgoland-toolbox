import { execSync, execFileSync } from 'child_process';
import rpm from 'rpm-builder';
import { versions } from '../versions';

// BUILD_NUMBER provided by Jenkins
// Override BUILD_NUMBER by setting a RELEASE_VERSION
const releaseVersion = process.env['RELEASE_VERSION'] 
    || process.env['BUILD_NUMBER']
    || "1";

console.log(`rpm version: ${versions.version}`)
console.log(`rpm release version: ${releaseVersion}`)

const application = process.argv[2] !== undefined ? process.argv[2] : "helgoland-timeseries";
const targetName = process.argv[3] !== undefined ?process.argv[3] : application;

const buildPath = `./dist/${targetName}/`;

const options = {
  name: 'sensorwebclient',
  version: versions.version,
  release: releaseVersion,
  description: "The Sensor Web Web Client built for EDIS",
  group: "Applications/Internet",
  buildArch: 'noarch',
  keepTemp: false,
  rpmDest: './dist',
  files: [
    { cwd: `${buildPath}browser/`, src: '*', dest: `/var/www/html/${targetName}` },
    { cwd: `${buildPath}/`, src: 'sensorwebclient-sbom.json', dest: `/opt/edis` }
  ]
};

console.log(`Cleaning output directory ${buildPath}`);
execSync(
  `rimraf -rf ${buildPath}`,
  { stdio: [0, 1, 2] }
);

console.log(`Building application ${application}`);
execSync(
  `ng build ${application} --configuration production --output-path=${buildPath} --base-href=/${targetName}/`,
  { stdio: [0, 1, 2] }
);

console.log(`Creating SBOM for application ${application}`);
execFileSync(process.execPath, [
    './node_modules/@cyclonedx/cyclonedx-npm/bin/cyclonedx-npm-cli.js',
    '--output-format', 'JSON',
    '--omit', 'dev',
    '--flatten-components',
    '--output-reproducible',
    '--output-file', `${buildPath}sensorwebclient-sbom.json`
]);

rpm(options, function(err: any, rpm: any) {
  if (err) {
    throw err;
  }
  
  console.log(`RPM file written to ${rpm}`);
  
});
 

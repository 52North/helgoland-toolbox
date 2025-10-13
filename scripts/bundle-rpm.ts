import { execSync } from 'child_process';
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

console.log(`build application ${application} into ${buildPath}`)

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
    { cwd: buildPath, src: '*', dest: `/var/www/html/${targetName}` }
  ]
};

console.log(`Build application ${application}`);
execSync(
  `rimraf -rf ${buildPath} && ng build ${application} --configuration production --output-path=${buildPath} --base-href=/${targetName}/`,
  { stdio: [0, 1, 2] }
);

rpm(options, function(err: any, rpm: any) {
  if (err) {
    throw err;
  }
  
  console.log(`RPM file written to ${rpm}`);
  
});
 

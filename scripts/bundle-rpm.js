const { execSync } = require('child_process');
const buildRpm = require('rpm-builder');

// Jenkins provides a build number
const buildNumber = process.env.BUILD_NUMBER || "1";


if (process.argv.length > 2) {
  if (process.argv[2]) {
    appname = process.argv[2];
  }
}


const application = process.argv[2] ?? "helgoland-timeseries";
const targetName = process.argv[3] ?? application;
const buildPath = `./dist/${targetName}/`;

const options = {
  name: 'sensorwebclient',
  version: '15.0.0',
  release: buildNumber,
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
  `rm -rf ${buildPath} && ng build ${application} --configuration production --output-path=${buildPath} --base-href=/${targetName}/`,
  { stdio: [0, 1, 2] }
);

buildRpm(options, function(err, rpm) {
  if (err) {
    throw err;
  }
  
  console.log(`RPM file written to ${rpm}`);
  
});
 

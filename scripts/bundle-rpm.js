const buildRpm = require('rpm-builder');

// Jenkins provides a build number
const buildNumber = process.env.BUILD_NUMBER || "1";
 
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
    { cwd: './dist/helgoland-timeseries/', src: '*.*', dest: '/opt/edis/sensorwebclient/' }
  ]
};
 
buildRpm(options, function(err, rpm) {
  if (err) {
    throw err;
  }
  
  console.log(`RPM file written to ${rpm}`);
  
});
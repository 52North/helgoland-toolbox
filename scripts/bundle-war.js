const archiver = require('archiver');
const { execSync } = require('child_process');
const fs = require('fs');
const pjson = require('../package.json');

let appname = 'helgoland-timeseries';
// let appname = apptype;

const xmlAsText = `<web-app version="3.0" xmlns="http://java.sun.com/xml/ns/javaee"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd">
    <display-name>Helgoland client version ${pjson.version} - built at ${new Date()}</display-name>
    <welcome-file-list>
        <welcome-file>index.html</welcome-file>
    </welcome-file-list>
    <mime-mapping>
        <extension>woff</extension>
        <mime-type>application/font-woff</mime-type>
    </mime-mapping>
    <error-page>
        <error-code>404</error-code>
        <location>/index.html</location>
    </error-page>
</web-app>`;

console.log(`args: ${process.argv}`);

if (process.argv.length > 2) {
  if (process.argv[2]) {
    appname = process.argv[2];
  }
}

console.log('Creating web.xml ...');

fs.writeFile('./web.xml', xmlAsText, (errWrite) => {
  if (errWrite) {
    console.log(errWrite);
    console.log('web.xml could not be updated.');
    return;
  } else {
    console.log(`Updated web.xml`);
    buildApplication();
  }
});

function buildApplication() {
  console.log(`Build application ${appname}`);
  execSync(
    `rm -rf dist/${appname} && ng build ${appname} --base-href=/${appname}/`,
    { stdio: [0, 1, 2] }
  );

  const out = `dist/${appname}.war`;
  const output = fs.createWriteStream(out);
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  output.on('finish', () => {
    fs.unlinkSync('web.xml');
    console.log('Finished creation of war (' + out + ') with ' + archive.pointer() + ' total bytes.');
  });

  archive.pipe(output);
  archive.directory(`dist/${appname}`, '/');
  archive.file('web.xml', { name: '/WEB-INF/web.xml' });

  console.log(`Finalizing build application ${appname} ...`);

  archive.finalize();
}

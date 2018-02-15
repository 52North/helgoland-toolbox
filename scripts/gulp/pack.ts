import * as util from '../util';

let exec = require('child_process').exec;
let spawnSync = require('child_process').spawnSync;
let spawn = require('child_process').spawn;

function filterPackageSelection(packages) {
  const idx = process.argv.indexOf('--select');

  if (idx > -1) {
    if (!process.argv[idx + 1]) {
      throw new Error('Invalid library selection.');
    }
    const selected = process.argv[idx + 1].split(',').map(v => v.trim());
    selected.forEach(s => {
      if (packages.indexOf(s) === -1) {
        throw new Error(`Could not apply selection, "${s}" is not a known package name.`);
      }
    });
    packages = selected;
  }

  return packages;
}

@util.GulpClass.Gulpclass()
export class Gulpfile {
  private packages: util.PackageMetadata[];

  @util.GulpClass.Task({ name: '!pack', dependencies: [] })
  public pack() {
    this.packages = filterPackageSelection(util.libConfig.packages.slice())
      .map((pkgName) => util.buildPackageMetadata(pkgName));

    this.packages.forEach((p) => {
      util.log('pack ' + p.dirName);
      exec('npm pack ' + util.FS_REF.PKG_DIST + '/' + p.dir);
    });
  }

  @util.GulpClass.Task({ name: '!publish', dependencies: [] })
  public publish() {
    this.packages = filterPackageSelection(util.libConfig.packages.slice())
      .map((pkgName) => util.buildPackageMetadata(pkgName));

    spawnSync('npm addUser', [], { stdio: 'inherit', shell: true });

    this.packages.forEach((p) => {
      util.log('publish ' + p.dirName);
      spawn('npm', ['publish', '--access public', util.FS_REF.PKG_DIST + '/' + p.dir], { stdio: 'inherit', shell: true });
    });
  }
}

import * as util from '../util';

let exec = require('child_process').exec;

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

    if (this.packages.length === 0) {
      return Promise.reject(new Error('Invalid configuration, no packages found.'));
    }

    this.packages.forEach((p) => {
      util.log('pack ' + p.dirName);
      exec('npm pack ' + util.FS_REF.PKG_DIST + '/' + p.dir);
    });
  }
}

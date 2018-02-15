import * as jsonfile from 'jsonfile';
import { root } from './fs';
import { PackageMetadata, GlobalLibConfig } from './types';

export const PKG_METADATA_CACHE: { [dirName: string]: PackageMetadata } = {};

export const libConfig: GlobalLibConfig = jsonfile.readFileSync(root('package.json')).libConfig;
export const libVersion: GlobalLibConfig = jsonfile.readFileSync(root('package.json')).version;

if (libConfig.scope && libConfig.scope.substr(0, 1) !== '@') {
  libConfig.scope = '@' + libConfig.scope;
}

let CURRENT_PACKAGE: PackageMetadata;

export function currentPackage(value?: PackageMetadata): PackageMetadata {
  if (value) {
    CURRENT_PACKAGE = value;
  }
  return CURRENT_PACKAGE;
}

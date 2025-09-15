// @ts-nocheck
import { AbstractProcess } from '../../model/sml';
import { BidiMap } from '../dynamicGUI/BidiMap';
import { SensorMLDecoder } from './SensorMLDecoder';

export class SensorMLDocumentDecoder {
  private decoder = new SensorMLDecoder();
  private _profileIDMap: BidiMap;

  get profileIDMap() {
    return this._profileIDMap;
  }
  set profileIDMap(profileIDMap: BidiMap) {
    this._profileIDMap = profileIDMap;
    this.decoder.profileIDMap = this._profileIDMap;
  }
  decode(document: Document): AbstractProcess {
    return this.decoder.decodeElement(document.documentElement);
  }
}

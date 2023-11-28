// @ts-nocheck
import {
  AbstractProcess
} from "../../model/sml";
import { SensorMLDecoder } from "./SensorMLDecoder";
import { BidiMap } from "../dynamicGUI/BidiMap";

export class SensorMLDocumentDecoder {

  private decoder = new SensorMLDecoder();
  private _profileIDMap: BidiMap;

  public get profileIDMap() {
    return this._profileIDMap;
  }
  public set profileIDMap(profileIDMap: BidiMap) {
    this._profileIDMap = profileIDMap;
    this.decoder.profileIDMap = this._profileIDMap;
  }
  public decode(document: Document): AbstractProcess {
    return this.decoder.decodeElement(document.documentElement);
  }

}

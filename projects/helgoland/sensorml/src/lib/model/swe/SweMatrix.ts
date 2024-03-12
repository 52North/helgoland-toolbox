// @ts-nocheck
import { SweDataArray } from "./SweDataArray";
import { DisplayName } from "../../common/decorators/DisplayName";

export class SweMatrix extends SweDataArray {
    @DisplayName("Reference frame")
      referenceFrame: string;

    @DisplayName("Local frame")
      localFrame: string;

    override toString() {
      return super.toString("SWE matrix");
    }

    override getValue() {
      return this.toString();
    }
}

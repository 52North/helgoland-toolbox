// @ts-nocheck
import { AbstractSetting } from "./AbstractSetting";
import { DisplayName } from "../../common/decorators/DisplayName";

export class ValueSetting extends AbstractSetting {
    @DisplayName("Value")
  override value: boolean | number | string | Date;

    override toString() {
      return this.value !== null && this.value !== undefined ? this.value.toString() : "Value setting";
    }
}

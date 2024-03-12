// @ts-nocheck
import { AbstractSetting } from "./AbstractSetting";
import { DisplayName } from "../../common/decorators/DisplayName";

export class ModeSetting extends AbstractSetting {
    @DisplayName("Value")
  override value: string;

    override toString() {
      return this.value && this.value.length ? this.value : "Mode setting";
    }
}

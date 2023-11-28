// @ts-nocheck
import { AbstractSetting } from "./AbstractSetting";
import { DisplayName } from "../../common/decorators/DisplayName";

export class StatusSetting extends AbstractSetting {
    @DisplayName("Value")
  override value: Status;

    override toString() {
      return this.value && this.value.length ? this.value : "Status setting";
    }
}

export type Status = "enabled" | "disabled";

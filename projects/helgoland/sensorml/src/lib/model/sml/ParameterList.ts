import { AbstractSWE } from "../swe/AbstractSWE";
import { Parameter } from "./Parameter";
import { DisplayName } from "../../common/decorators/DisplayName";

export class ParameterList extends AbstractSWE {
    @DisplayName("Parameters")
      parameters: Parameter[] = [];

    override toString() {
      return "Parameter list";
    }
}

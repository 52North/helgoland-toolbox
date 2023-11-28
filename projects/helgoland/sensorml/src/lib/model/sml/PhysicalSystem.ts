import { AbstractPhysicalProcess } from "./AbstractPhysicalProcess";
import { AggregatingProcess } from "./AggregatingProcess";
import { ComponentList } from "./ComponentList";
import { ConnectionList } from "./ConnectionList";
import { DisplayName } from "../../common/decorators/DisplayName";

export class PhysicalSystem extends AbstractPhysicalProcess implements AggregatingProcess {
    @DisplayName("Components")
      components: ComponentList = new ComponentList();

    @DisplayName("Connections")
      connections: ConnectionList = new ConnectionList();

    // getter
    public static SCHEMA(): string {
      return "http://schemas.opengis.net/sensorML/2.0/physical_system.xsd";
    }

    public static NAME(): string {
      return "PhysicalSystem";
    }

    override toString() {
      return "Physical system";
    }
}

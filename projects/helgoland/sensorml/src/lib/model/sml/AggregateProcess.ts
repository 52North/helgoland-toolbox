import { DisplayName } from '../../common/decorators/DisplayName';
import { AbstractProcess } from './AbstractProcess';
import { AggregatingProcess } from './AggregatingProcess';
import { ComponentList } from './ComponentList';
import { ConnectionList } from './ConnectionList';

/**
 * A process that consist of a collection of linked component processes
 * resulting in a specified output.
 */
export class AggregateProcess
  extends AbstractProcess
  implements AggregatingProcess
{
  @DisplayName('Components')
  components: ComponentList = new ComponentList();

  @DisplayName('Connections')
  connections: ConnectionList = new ConnectionList();

  // getter
  static SCHEMA(): string {
    const schema =
      'http://schemas.opengis.net/sensorML/2.0/aggregate_process.xsd';
    return schema;
  }

  static NAME(): string {
    return 'AggregateProcess';
  }

  override toString() {
    return 'Aggregate process';
  }
}
